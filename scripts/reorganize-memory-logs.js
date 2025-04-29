#!/usr/bin/env node
/**
 * Memory Log Reorganization Script
 * 
 * This script analyzes the existing memory log files in docs/logged_memories/
 * and creates a mapping of current filenames to new unique sequential IDs.
 * It then renames the files according to the new ID scheme and updates all
 * references to these files throughout the codebase.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert fs functions to promise-based
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rename = util.promisify(fs.rename);

const MEMORY_LOG_DIR = path.resolve(__dirname, '../docs/logged_memories');
const MEMORY_LOG_INDEX = path.resolve(__dirname, '../docs/MEMORY_LOG.md');
const IMPLEMENTED_CHANGES = path.resolve(__dirname, '../docs/IMPLEMENTED_CHANGES.md');
const MIGRATION_DIR = path.resolve(__dirname, '../docs/migration');

// Categorization map for organizing related entries together
// Order matters for the memory log index categories display order
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
 * Update references to memory log files in a file
 * @param {string} filePath - Path to the file to update
 * @param {Object} mapping - Mapping from old filenames to new filenames
 */
async function updateReferencesInFile(filePath, mapping) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Replace references like [MRTMLY-XXX: Title](./logged_memories/MRTMLY-XXX-descriptive-name.md)
    for (const [oldFile, newFile] of Object.entries(mapping)) {
      const oldPattern = new RegExp(`\\[MRTMLY-\\d+:([^\\]]*)\\]\\([.\\./]*logged_memories/${oldFile}\\)`, 'g');
      const newReference = `[${newFile.replace('.md', '')}:$1](./logged_memories/${newFile})`;
      
      if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newReference);
        modified = true;
      }
      
      // Also handle references without the title part
      const simpleOldPattern = new RegExp(`\\[MRTMLY-\\d+\\]\\([.\\./]*logged_memories/${oldFile}\\)`, 'g');
      const simpleNewReference = `[${newFile.replace('.md', '')}](./logged_memories/${newFile})`;
      
      if (simpleOldPattern.test(content)) {
        content = content.replace(simpleOldPattern, simpleNewReference);
        modified = true;
      }
    }
    
    if (modified) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated references in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating references in ${filePath}:`, error);
  }
}

/**
 * Create a new MEMORY_LOG.md with a comprehensive index
 * @param {Object} mapping - Mapping from old filenames to new filenames
 */
async function createMemoryLogIndex(mapping) {
  let content = `<!-- filepath: ${MEMORY_LOG_INDEX} -->
# Memory Log

This file serves as an index to all memory log entries. Each entry documents debugging sessions, 
implementations, and issues encountered during the development of this project.

Memory logs are organized by category and listed in sequential ID order.

## Table of Contents

`;

  // Create table of contents
  for (const category in CATEGORIES) {
    if (CATEGORIES[category].length > 0) {
      // Add section header for each category (convert to title case)
      const title = category.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      content += `- [${title} Entries](#${category}-entries)\n`;
    }
  }
  
  // Add entries by category
  for (const category in CATEGORIES) {
    if (CATEGORIES[category].length > 0) {
      // Add section header for each category (convert to title case)
      const title = category.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      content += `\n## ${title} Entries {#${category}-entries}\n\n`;
      
      // Add entries for this category, sorted by new ID
      const entries = CATEGORIES[category].map(oldFile => mapping[oldFile])
        .sort((a, b) => {
          const idA = parseInt(a.match(/MRTMLY-(\d+)/)[1], 10);
          const idB = parseInt(b.match(/MRTMLY-(\d+)/)[1], 10);
          return idA - idB;
        });
      
      for (const newFile of entries) {
        // Create a more readable title by removing variation suffixes and formatting
        let title = newFile.replace(/^MRTMLY-\d+-/, '')
                         .replace(/\.md$/, '')
                         .replace(/-variation-\d+$/, ''); // Remove variation suffix
        
        // Convert kebab-case to Title Case
        title = title.split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                    
        // Extract just the ID for cleaner display
        const idMatch = newFile.match(/MRTMLY-(\d+)/);
        const id = idMatch ? idMatch[1] : '';
        
        content += `- [MRTMLY-${id}: ${title}](./logged_memories/${newFile})\n`;
      }
    }
  }
  
  // Add a footer with helpful information
  content += `\n## About Memory Logs

Memory logs provide detailed records of debugging sessions, implementation decisions, and issue resolutions.
Each log follows a standard format including:

- Initial State
- Debug Process/Implementation
- Resolution
- Lessons Learned

These logs serve as historical context to understand why certain decisions were made and how issues were resolved.
`;
  
  await writeFile(MEMORY_LOG_INDEX, content, 'utf8');
  console.log(`Created new MEMORY_LOG.md index`);
}

/**
 * Main function to execute the reorganization
 */
async function main() {
  try {
    console.log('Starting memory log reorganization...');
    
    // Get all memory log files
    const files = await readdir(MEMORY_LOG_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} memory log files`);
    
    // Create ID mapping
    const mapping = createIdMapping(mdFiles);
    console.log(`Created mapping for ${Object.keys(mapping).length} files`);
    
    // Output the mapping for reference
    await writeFile(
      path.resolve(__dirname, '../docs/memory_log_mapping.json'),
      JSON.stringify(mapping, null, 2),
      'utf8'
    );
    
    // Rename files
    for (const [oldFile, newFile] of Object.entries(mapping)) {
      const oldPath = path.join(MEMORY_LOG_DIR, oldFile);
      const newPath = path.join(MEMORY_LOG_DIR, newFile);
      
      if (oldPath !== newPath) {
        await rename(oldPath, newPath);
        console.log(`Renamed: ${oldFile} → ${newFile}`);
      }
    }
    
    // Update references in IMPLEMENTED_CHANGES.md
    await updateReferencesInFile(IMPLEMENTED_CHANGES, mapping);
    
    // Update references in migration docs
    const migrationFiles = await readdir(MIGRATION_DIR);
    for (const file of migrationFiles.filter(f => f.endsWith('.md'))) {
      await updateReferencesInFile(path.join(MIGRATION_DIR, file), mapping);
    }
    
    // Create a comprehensive index in MEMORY_LOG.md
    await createMemoryLogIndex(mapping);
    
    console.log('Memory log reorganization complete!');
    
  } catch (error) {
    console.error('Error during memory log reorganization:', error);
    process.exit(1);
  }
}

// Execute the script
main();
