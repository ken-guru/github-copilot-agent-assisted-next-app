#!/usr/bin/env node
/**
 * Fix MEMORY_LOG.md to match actual file names
 */

const fs = require('fs');
const path = require('path');

const LOGGED_MEMORIES_DIR = './docs/logged_memories';
const MEMORY_LOG_PATH = './docs/MEMORY_LOG.md';

function regenerateMemoryLog() {
    console.log('🔧 Regenerating MEMORY_LOG.md with correct file references...');
    
    // Get all actual memory log files
    const files = fs.readdirSync(LOGGED_MEMORIES_DIR)
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const filePath = path.join(LOGGED_MEMORIES_DIR, fileName);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract title from first heading
            const titleMatch = content.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : path.basename(fileName, '.md');
            
            return {
                fileName,
                title,
                content
            };
        })
        .sort((a, b) => {
            // Sort by the numeric ID
            const aId = parseInt(a.fileName.match(/MRTMLY-(\d+)/)[1]);
            const bId = parseInt(b.fileName.match(/MRTMLY-(\d+)/)[1]);
            return aId - bId;
        });
    
    console.log(`Found ${files.length} memory log files`);
    
    // Extract tags from each file
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
        
        // Infer tags from filename and content if needed
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
    
    // Generate new MEMORY_LOG.md content
    const entries = files.map((file, index) => {
        const tags = extractTags(file.content, file.fileName);
        const tagString = tags.map(tag => `#${tag}`).join(' ');
        const id = String(index + 1).padStart(3, '0');
        
        return `${id}. [${file.title}](./logged_memories/${file.fileName}) - ${tagString}`;
    });
    
    const content = `# Memory Log

This document serves as an index of all logged memories for this project. Each entry links to a detailed markdown file with the full context, debugging process, and resolution.

Memory logs are organized chronologically by creation date. Each entry includes five relevant tags for categorization and searchability.

## Entries

${entries.join('\n')}

## About Memory Logs

Memory logs provide detailed records of debugging sessions, implementation decisions, and issue resolutions.
Each log follows a standard format including:

- Initial State
- Debug Process/Implementation  
- Resolution
- Lessons Learned

These logs serve as historical context to understand why certain decisions were made and how issues were resolved.

**Total Entries:** ${files.length}  
**Last Updated:** ${new Date().toISOString().split('T')[0]}
`;
    
    fs.writeFileSync(MEMORY_LOG_PATH, content);
    console.log(`✅ Regenerated MEMORY_LOG.md with ${files.length} entries`);
}

// Run the fixer
regenerateMemoryLog();
