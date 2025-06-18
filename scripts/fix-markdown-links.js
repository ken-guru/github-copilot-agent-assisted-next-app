#!/usr/bin/env node
/**
 * Markdown Link Fixer
 * 
 * This script fixes common broken links in markdown files based on the 
 * memory log reorganization that happened.
 */

const fs = require('fs');
const path = require('path');

// Load the ID mapping from the reorganization
const ID_MAPPING_PATH = './docs/memory_log_id_mapping.json';

/**
 * Load ID mapping and create reverse lookup
 */
function loadIdMapping() {
    try {
        const mapping = JSON.parse(fs.readFileSync(ID_MAPPING_PATH, 'utf8'));
        
        // Create reverse mapping (new ID -> old ID) for reference
        const reverseMapping = {};
        Object.entries(mapping).forEach(([oldId, newId]) => {
            reverseMapping[newId] = oldId;
        });
        
        return { oldToNew: mapping, newToOld: reverseMapping };
    } catch (error) {
        console.error('Could not load ID mapping:', error.message);
        return { oldToNew: {}, newToOld: {} };
    }
}

/**
 * Fix memory log references in a file
 */
function fixMemoryLogReferences(content, filePath, idMapping) {
    let fixes = 0;
    let newContent = content;
    
    // Fix old MRTMLY-XXX references to new format
    const memoryLogRegex = /MRTMLY-(\d+)(-[^)\]]+)?/g;
    
    newContent = newContent.replace(memoryLogRegex, (match, oldId, suffix) => {
        const newId = idMapping.oldToNew[oldId];
        if (newId && newId !== oldId) {
            fixes++;
            console.log(`  Fixed: ${match} -> MRTMLY-${newId}${suffix || ''}`);
            return `MRTMLY-${newId}${suffix || ''}`;
        }
        return match;
    });
    
    return { content: newContent, fixes };
}

/**
 * Fix known broken link patterns
 */
function fixKnownBrokenLinks(content, filePath) {
    let fixes = 0;
    let newContent = content;
    
    // Fix broken reference patterns like [0]([BROKEN REFERENCE: 0])
    const brokenRefRegex = /\[([^\]]+)\]\(\[BROKEN REFERENCE: [^\]]+\]\)/g;
    newContent = newContent.replace(brokenRefRegex, (match, text) => {
        fixes++;
        console.log(`  Removed broken reference: ${match}`);
        return text; // Just leave the text without the broken link
    });
    
    // Fix malformed links like [level]('[Service Worker] ' + message)
    const malformedLinkRegex = /\[([^\]]+)\]\(('[^']*'[^)]*)\)/g;
    newContent = newContent.replace(malformedLinkRegex, (match, text, url) => {
        fixes++;
        console.log(`  Fixed malformed link: ${match} -> ${text}`);
        return text; // Remove the malformed link, keep text
    });
    
    // Fix [rel="stylesheet"]([BROKEN REFERENCE: href]) pattern
    const brokenStylesheetRegex = /\[rel="stylesheet"\]\(\[BROKEN REFERENCE: href\]\)/g;
    newContent = newContent.replace(brokenStylesheetRegex, (match) => {
        fixes++;
        console.log(`  Fixed broken stylesheet reference: ${match}`);
        return 'rel="stylesheet"'; // Remove the broken link
    });
    
    return { content: newContent, fixes };
}

/**
 * Fix specific file paths and references
 */
function fixSpecificPaths(content, filePath) {
    let fixes = 0;
    let newContent = content;
    
    // Fix references to TIME_UTILS_DOCUMENTATION.md (moved location)
    if (newContent.includes('/docs/utils/TIME_UTILS_DOCUMENTATION.md')) {
        newContent = newContent.replace(
            '/docs/utils/TIME_UTILS_DOCUMENTATION.md',
            '../dev-guides/TIME_UTILITIES_GUIDE.md'
        );
        fixes++;
        console.log(`  Fixed TIME_UTILS_DOCUMENTATION.md path`);
    }
    
    // Fix template placeholder links
    if (filePath.includes('templates/')) {
        newContent = newContent.replace(/\[#123\]\(link\)/g, '[#123](https://example.com)');
        newContent = newContent.replace(/\[#456\]\(link\)/g, '[#456](https://example.com)');
        if (newContent !== content) {
            fixes += 2;
            console.log(`  Fixed template placeholder links`);
        }
    }
    
    // Fix ViewportConfiguration link to Layout
    if (filePath.includes('ViewportConfiguration.md')) {
        newContent = newContent.replace(
            '[Related: Layout Configuration](./Layout.md)',
            '[Related: Layout Configuration](../README.md#layout-components)'
        );
        if (newContent !== content) {
            fixes++;
            console.log(`  Fixed ViewportConfiguration Layout link`);
        }
    }
    
    return { content: newContent, fixes };
}

/**
 * Fix all markdown files
 */
function fixAllMarkdownFiles() {
    console.log('🔧 Loading ID mapping...');
    const idMapping = loadIdMapping();
    console.log(`Loaded ${Object.keys(idMapping.oldToNew).length} ID mappings\n`);
    
    console.log('🔍 Finding markdown files...');
    const { execSync } = require('child_process');
    const mdFiles = execSync('find . -name "*.md" -type f', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(file => file && !file.includes('node_modules'));
    
    console.log(`Found ${mdFiles.length} markdown files\n`);
    
    let totalFixes = 0;
    let filesFixed = 0;
    
    for (const filePath of mdFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let fileFixes = 0;
            
            // Apply all fix functions
            const fixFunctions = [
                () => fixMemoryLogReferences(newContent, filePath, idMapping),
                () => fixKnownBrokenLinks(newContent, filePath),
                () => fixSpecificPaths(newContent, filePath)
            ];
            
            for (const fixFn of fixFunctions) {
                const result = fixFn();
                newContent = result.content;
                fileFixes += result.fixes;
            }
            
            // Write back if changes were made
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent);
                filesFixed++;
                totalFixes += fileFixes;
                console.log(`✅ Fixed ${filePath} (${fileFixes} fixes)`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`Files processed: ${mdFiles.length}`);
    console.log(`Files fixed: ${filesFixed}`);
    console.log(`Total fixes applied: ${totalFixes}`);
    
    return { filesFixed, totalFixes };
}

// Run the fixer
if (require.main === module) {
    fixAllMarkdownFiles();
}

module.exports = { fixAllMarkdownFiles };
