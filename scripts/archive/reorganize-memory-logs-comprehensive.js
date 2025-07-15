#!/usr/bin/env node
/**
 * Comprehensive Memory Log Reorganization Script
 * 
 * This script will:
 * 1. Analyze all memory log files and their creation dates
 * 2. Remove duplicates and consolidate them
 * 3. Rename files with proper sequential IDs based on creation dates
 * 4. Generate a new MEMORY_LOG.md with proper tags
 * 5. Create a mapping of old IDs to new IDs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = './docs';
const LOGGED_MEMORIES_DIR = path.join(DOCS_DIR, 'logged_memories');
const MEMORY_LOG_PATH = path.join(DOCS_DIR, 'MEMORY_LOG.md');

/**
 * Get file creation date and other metadata
 */
function getFileMetadata(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract title from first heading
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
        
        return {
            filePath,
            fileName: path.basename(filePath),
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            content,
            title,
            size: stats.size
        };
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Extract tags from memory log content
 */
function extractTags(content, fileName) {
    const tags = new Set();
    
    // Extract from existing tags if present
    const tagMatch = content.match(/\*\*Tags:\*\*\s+(.+)/);
    if (tagMatch) {
        tagMatch[1].split(/[,\s]+/).forEach(tag => {
            const cleanTag = tag.replace(/^#/, '').trim();
            if (cleanTag) tags.add(cleanTag);
        });
    }
    
    // Infer tags from filename and content
    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    
    // Technology tags
    if (lowerContent.includes('service worker') || lowerFileName.includes('service-worker')) {
        tags.add('service-worker');
    }
    if (lowerContent.includes('typescript') || lowerFileName.includes('typescript')) {
        tags.add('typescript');
    }
    // Removed Cypress references
    if (lowerContent.includes('jest') || lowerFileName.includes('jest')) {
        tags.add('jest');
    }
    if (lowerContent.includes('eslint') || lowerFileName.includes('eslint')) {
        tags.add('eslint');
    }
    if (lowerContent.includes('next.js') || lowerContent.includes('nextjs') || lowerFileName.includes('next')) {
        tags.add('nextjs');
    }
    if (lowerContent.includes('codeql') || lowerFileName.includes('codeql')) {
        tags.add('codeql');
    }
    
    // Issue type tags
    if (lowerContent.includes('test') || lowerFileName.includes('test')) {
        tags.add('testing');
    }
    if (lowerContent.includes('build') || lowerFileName.includes('build')) {
        tags.add('build');
    }
    if (lowerContent.includes('deployment') || lowerFileName.includes('deployment')) {
        tags.add('deployment');
    }
    if (lowerContent.includes('error') || lowerContent.includes('fix') || lowerFileName.includes('fix')) {
        tags.add('debugging');
    }
    if (lowerContent.includes('refactor') || lowerFileName.includes('refactor')) {
        tags.add('refactoring');
    }
    if (lowerContent.includes('ui') || lowerContent.includes('layout') || lowerFileName.includes('ui') || lowerFileName.includes('layout')) {
        tags.add('ui');
    }
    if (lowerContent.includes('theme') || lowerContent.includes('dark mode') || lowerFileName.includes('theme')) {
        tags.add('theming');
    }
    if (lowerContent.includes('mobile') || lowerFileName.includes('mobile')) {
        tags.add('mobile');
    }
    if (lowerContent.includes('performance') || lowerFileName.includes('performance')) {
        tags.add('performance');
    }
    
    // Ensure we have at least 5 tags
    const tagArray = Array.from(tags);
    while (tagArray.length < 5) {
        if (!tagArray.includes('implementation')) tagArray.push('implementation');
        else if (!tagArray.includes('configuration')) tagArray.push('configuration');
        else if (!tagArray.includes('maintenance')) tagArray.push('maintenance');
        else if (!tagArray.includes('optimization')) tagArray.push('optimization');
        else tagArray.push('miscellaneous');
    }
    
    return tagArray.slice(0, 5); // Return exactly 5 tags
}

/**
 * Identify and resolve duplicate files
 */
function resolveDuplicates(files) {
    const duplicateGroups = new Map();
    const resolvedFiles = [];
    
    // Group files by base ID pattern
    files.forEach(file => {
        const match = file.fileName.match(/^MRTMLY-(\d+)-(.+)\.md$/);
        if (match) {
            const baseId = match[1];
            const baseName = match[2];
            
            if (!duplicateGroups.has(baseId)) {
                duplicateGroups.set(baseId, []);
            }
            duplicateGroups.get(baseId).push(file);
        }
    });
    
    // For each group, keep the most comprehensive file
    duplicateGroups.forEach((group, baseId) => {
        if (group.length === 1) {
            resolvedFiles.push(group[0]);
        } else {
            console.log(`\nResolving duplicates for MRTMLY-${baseId}:`);
            group.forEach((file, index) => {
                console.log(`  ${index + 1}. ${file.fileName} (${file.size} bytes, created: ${file.createdAt.toISOString()})`);
            });
            
            // Keep the largest file (most comprehensive)
            const bestFile = group.reduce((best, current) => 
                current.size > best.size ? current : best
            );
            
            console.log(`  → Keeping: ${bestFile.fileName}`);
            resolvedFiles.push(bestFile);
            
            // Delete the other files
            group.forEach(file => {
                if (file !== bestFile) {
                    console.log(`  → Removing: ${file.fileName}`);
                    try {
                        fs.unlinkSync(file.filePath);
                    } catch (error) {
                        console.error(`    Error removing ${file.fileName}:`, error.message);
                    }
                }
            });
        }
    });
    
    return resolvedFiles;
}

/**
 * Main reorganization function
 */
function reorganizeMemoryLogs() {
    console.log('🔍 Analyzing memory log files...');
    
    // Get all memory log files
    const files = fs.readdirSync(LOGGED_MEMORIES_DIR)
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => getFileMetadata(path.join(LOGGED_MEMORIES_DIR, fileName)))
        .filter(file => file !== null);
    
    console.log(`Found ${files.length} memory log files`);
    
    // Resolve duplicates
    console.log('\n🔧 Resolving duplicate files...');
    const resolvedFiles = resolveDuplicates(files);
    console.log(`After resolving duplicates: ${resolvedFiles.length} files`);
    
    // Sort by creation date
    resolvedFiles.sort((a, b) => a.createdAt - b.createdAt);
    
    // Create ID mapping and rename files
    console.log('\n📝 Renaming files with sequential IDs...');
    const idMapping = new Map();
    const renamedFiles = [];
    
    resolvedFiles.forEach((file, index) => {
        const newId = String(index + 1).padStart(3, '0');
        const oldMatch = file.fileName.match(/^MRTMLY-(\d+)-(.+)\.md$/);
        
        if (oldMatch) {
            const oldId = oldMatch[1];
            const descriptiveName = oldMatch[2];
            const newFileName = `MRTMLY-${newId}-${descriptiveName}.md`;
            const newFilePath = path.join(LOGGED_MEMORIES_DIR, newFileName);
            
            // Track the mapping
            idMapping.set(oldId, newId);
            
            // Rename the file if needed
            if (file.fileName !== newFileName) {
                try {
                    fs.renameSync(file.filePath, newFilePath);
                    console.log(`  ${file.fileName} → ${newFileName}`);
                } catch (error) {
                    console.error(`Error renaming ${file.fileName}:`, error.message);
                    return;
                }
            }
            
            // Update file metadata
            const updatedFile = {
                ...file,
                fileName: newFileName,
                filePath: newFilePath,
                newId,
                oldId
            };
            
            renamedFiles.push(updatedFile);
        }
    });
    
    // Generate new MEMORY_LOG.md
    console.log('\n📋 Generating new MEMORY_LOG.md...');
    generateMemoryLogIndex(renamedFiles);
    
    // Save ID mapping for reference
    const mappingPath = path.join(DOCS_DIR, 'memory_log_id_mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(Object.fromEntries(idMapping), null, 2));
    
    console.log('\n✅ Memory log reorganization complete!');
    console.log(`📊 Total files: ${renamedFiles.length}`);
    console.log(`📄 Memory log index: ${MEMORY_LOG_PATH}`);
    console.log(`🗂️  ID mapping: ${mappingPath}`);
}

/**
 * Generate the new MEMORY_LOG.md index
 */
function generateMemoryLogIndex(files) {
    const entries = files.map(file => {
        const tags = extractTags(file.content, file.fileName);
        const tagString = tags.map(tag => `#${tag}`).join(' ');
        
        return {
            id: file.newId,
            fileName: file.fileName,
            title: file.title,
            tags: tagString,
            createdAt: file.createdAt
        };
    });
    
    const content = `# Memory Log

This document serves as an index of all logged memories for this project. Each entry links to a detailed markdown file with the full context, debugging process, and resolution.

Memory logs are organized chronologically by creation date. Each entry includes five relevant tags for categorization and searchability.

## Entries

${entries.map(entry => 
    `${entry.id}. [${entry.title}](./logged_memories/${entry.fileName}) - ${entry.tags}`
).join('\n')}

## About Memory Logs

Memory logs provide detailed records of debugging sessions, implementation decisions, and issue resolutions.
Each log follows a standard format including:

- Initial State
- Debug Process/Implementation  
- Resolution
- Lessons Learned

These logs serve as historical context to understand why certain decisions were made and how issues were resolved.

**Total Entries:** ${entries.length}  
**Last Updated:** ${new Date().toISOString().split('T')[0]}
`;
    
    fs.writeFileSync(MEMORY_LOG_PATH, content);
}

// Run the script
if (require.main === module) {
    try {
        reorganizeMemoryLogs();
    } catch (error) {
        console.error('❌ Error during reorganization:', error);
        process.exit(1);
    }
}

module.exports = { reorganizeMemoryLogs };
