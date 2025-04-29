#!/usr/bin/env node
/**
 * Memory Log Reorganization Test Script
 * 
 * This script tests the reorganization logic without making any file changes.
 * It analyzes the existing memory log files and outputs the planned changes
 * for review before executing the actual reorganization.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert fs functions to promise-based
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const MEMORY_LOG_DIR = path.resolve(__dirname, '../docs/logged_memories');

// Categorization map for organizing related entries together
const CATEGORIES = {
  'service-worker': [],
  'testing': [],
  'ui-layout': [],
  'dark-mode': [],
  'typescript': [],
  'eslint': [],
  'deployment': [],
  'miscellaneous': []
};

/**
 * Extract the ID and descriptive part from a filename
 * @param {string} filename - Memory log filename
 * @returns {Object} Object containing ID and descriptive part
 */
function parseFilename(filename) {
  const match = filename.match(/^MRTMLY-(\d+)-(.*?)\.md$/);
  if (match) {
    return {
      id: parseInt(match[1], 10),
      descriptiveName: match[2]
    };
  }
  return null;
}

/**
 * Determine the category of a memory log based on its filename
 * @param {string} filename - Memory log filename
 * @returns {string} Category name
 */
function determineCategory(filename) {
  const lowerFilename = filename.toLowerCase();
  
  // Priority order - more specific categories first
  if (lowerFilename.includes('service-worker')) return 'service-worker';
  if (lowerFilename.includes('test') || lowerFilename.includes('jest') || lowerFilename.includes('cypress')) return 'testing';
  if (lowerFilename.includes('layout') || lowerFilename.includes('ui') || lowerFilename.includes('icon') || lowerFilename.includes('progress-bar')) return 'ui-layout';
  if (lowerFilename.includes('dark-mode') || lowerFilename.includes('theme')) return 'dark-mode';
  if (lowerFilename.includes('typescript') || lowerFilename.includes('type') || lowerFilename.includes('ts-')) return 'typescript';
  if (lowerFilename.includes('eslint') || lowerFilename.includes('lint')) return 'eslint';
  if (lowerFilename.includes('deploy') || lowerFilename.includes('build')) return 'deployment';
  
  return 'miscellaneous';
}

/**
 * Create a mapping from old filenames to new sequential IDs
 * @param {Array} files - Array of memory log filenames
 * @returns {Object} Mapping from old filename to new filename
 */
function createIdMapping(files) {
  const mapping = {};
  let nextId = 1;
  
  // First, categorize files
  for (const file of files) {
    const category = determineCategory(file);
    CATEGORIES[category].push(file);
  }
  
  // Sort files within each category for consistent ordering
  for (const category in CATEGORIES) {
    CATEGORIES[category].sort((a, b) => {
      // First try to sort by original numeric ID
      const parsedA = parseFilename(a);
      const parsedB = parseFilename(b);
      
      if (parsedA && parsedB) {
        return parsedA.id - parsedB.id;
      }
      
      // If parsing fails for some reason, fall back to alphabetical sorting
      return a.localeCompare(b);
    });
  }
  
  // Track descriptions to handle duplicates
  const descriptionsMap = {};
  
  // Then assign sequential IDs by category
  for (const category in CATEGORIES) {
    for (const file of CATEGORIES[category]) {
      const parsed = parseFilename(file);
      const descriptiveName = parsed ? parsed.descriptiveName : file.replace(/^MRTMLY-\d+-/, '').replace(/\.md$/, '');
      
      // Format new ID with leading zeros (001, 002, etc.)
      const newId = String(nextId).padStart(3, '0');
      
      // Check if this descriptive name already exists
      if (descriptiveName in descriptionsMap) {
        // We have a duplicate descriptive name
        const existingEntries = descriptionsMap[descriptiveName];
        existingEntries.push(file);
        
        // For the first duplicate, rename the original file with "-original" suffix
        if (existingEntries.length === 2) {
          const originalFile = existingEntries[0];
          const originalId = String(nextId - existingEntries.length + 1).padStart(3, '0');
          mapping[originalFile] = `MRTMLY-${originalId}-${descriptiveName}-original.md`;
        }
        
        // Current duplicate gets a variation number
        const variationNum = existingEntries.length - 1;
        mapping[file] = `MRTMLY-${newId}-${descriptiveName}-variation-${variationNum}.md`;
      } else {
        // This is a new descriptive name
        descriptionsMap[descriptiveName] = [file];
        mapping[file] = `MRTMLY-${newId}-${descriptiveName}.md`;
      }
      
      nextId++;
    }
  }
  
  return mapping;
}

/**
 * Check if there are files with the same descriptive name but different IDs
 * @param {Object} mapping - Mapping from old filenames to new filenames
 */
function checkForDuplicateDescriptions(mapping) {
  const descriptions = {};
  const issues = [];
  
  for (const [oldFile, newFile] of Object.entries(mapping)) {
    const descriptivePart = newFile.replace(/^MRTMLY-\d+-/, '');
    
    if (descriptions[descriptivePart]) {
      issues.push({
        issue: 'Duplicate descriptive name',
        files: [descriptions[descriptivePart], oldFile],
        newNames: [mapping[descriptions[descriptivePart]], newFile]
      });
    } else {
      descriptions[descriptivePart] = oldFile;
    }
  }
  
  return issues;
}

/**
 * Check for any files that might be referenced but not included in the mapping
 * @param {Array} files - All memory log files
 * @param {Object} mapping - Mapping from old filenames to new filenames
 */
function checkForMissingFiles(files, mapping) {
  const mappedFiles = new Set(Object.keys(mapping));
  const allFiles = new Set(files);
  
  const missingFiles = [...allFiles].filter(file => !mappedFiles.has(file));
  
  return missingFiles;
}

/**
 * Main function to test the reorganization
 */
async function main() {
  try {
    console.log('Testing memory log reorganization...');
    
    // Get all memory log files
    const files = await readdir(MEMORY_LOG_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} memory log files`);
    
    // Create ID mapping
    const mapping = createIdMapping(mdFiles);
    console.log(`Created mapping for ${Object.keys(mapping).length} files`);
    
    // Check for potential issues
    const duplicateDescriptions = checkForDuplicateDescriptions(mapping);
    const missingFiles = checkForMissingFiles(mdFiles, mapping);
    
    // Output results
    console.log('\n=== CATEGORY DISTRIBUTION ===');
    for (const category in CATEGORIES) {
      console.log(`${category}: ${CATEGORIES[category].length} files`);
    }
    
    console.log('\n=== SAMPLE MAPPINGS ===');
    const sampleEntries = Object.entries(mapping).slice(0, 10);
    for (const [oldFile, newFile] of sampleEntries) {
      console.log(`${oldFile} → ${newFile}`);
    }
    
    if (duplicateDescriptions.length > 0) {
      console.log('\n=== DUPLICATE DESCRIPTIONS DETECTED ===');
      duplicateDescriptions.forEach(issue => {
        console.log(`Files: ${issue.files.join(', ')}`);
        console.log(`Will be renamed to: ${issue.newNames.join(', ')}`);
        console.log('---');
      });
    } else {
      console.log('\n✅ No duplicate descriptions detected');
    }
    
    if (missingFiles.length > 0) {
      console.log('\n=== FILES NOT INCLUDED IN MAPPING ===');
      missingFiles.forEach(file => console.log(file));
    } else {
      console.log('\n✅ All files included in mapping');
    }
    
    console.log('\nTest completed. Review results above before running the actual reorganization script.');
    
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

// Execute the script
main();
