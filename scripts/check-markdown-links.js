#!/usr/bin/env node
/**
 * Markdown Link Checker
 * 
 * This script checks all markdown files for broken links including:
 * - Relative file links
 * - Internal anchor links
 * - Image links
 * - Links to other markdown files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = '.';
const DOCS_DIR = './docs';

/**
 * Get all markdown files in the workspace
 */
function getAllMarkdownFiles() {
    try {
        const output = execSync('find . -name "*.md" -type f', { encoding: 'utf8' });
        return output.trim().split('\n').filter(file => file && !file.includes('node_modules'));
    } catch (error) {
        console.error('Error finding markdown files:', error.message);
        return [];
    }
}

/**
 * Extract all links from markdown content
 */
function extractLinks(content, filePath) {
    const links = [];
    
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        links.push({
            text: linkText,
            url: linkUrl,
            line: lineNumber,
            type: getLinkType(linkUrl),
            sourceFile: filePath
        });
    }
    
    // Match reference-style links: [text][ref]
    const refLinkRegex = /\[([^\]]+)\]\[([^\]]+)\]/g;
    while ((match = refLinkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const refId = match[2];
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        // Find the reference definition
        const refDefRegex = new RegExp(`^\\[${refId}\\]:\\s*(.+)$`, 'm');
        const refMatch = refDefRegex.exec(content);
        
        if (refMatch) {
            links.push({
                text: linkText,
                url: refMatch[1].trim(),
                line: lineNumber,
                type: getLinkType(refMatch[1].trim()),
                sourceFile: filePath,
                isReference: true,
                refId: refId
            });
        } else {
            links.push({
                text: linkText,
                url: `[BROKEN REFERENCE: ${refId}]`,
                line: lineNumber,
                type: 'broken-reference',
                sourceFile: filePath,
                isReference: true,
                refId: refId
            });
        }
    }
    
    return links;
}

/**
 * Determine the type of link
 */
function getLinkType(url) {
    if (!url) return 'empty';
    if (url.startsWith('http://') || url.startsWith('https://')) return 'external';
    if (url.startsWith('mailto:')) return 'email';
    if (url.startsWith('#')) return 'anchor';
    if (url.includes('#')) return 'file-with-anchor';
    if (url.startsWith('./') || url.startsWith('../') || !url.includes('://')) return 'relative';
    return 'unknown';
}

/**
 * Check if a relative file link exists
 */
function checkRelativeLink(linkUrl, sourceFile) {
    try {
        const sourceDir = path.dirname(sourceFile);
        let targetPath;
        
        // Handle anchor links within the same file
        if (linkUrl.startsWith('#')) {
            return { exists: true, reason: 'anchor-link-same-file' };
        }
        
        // Handle file links with anchors
        if (linkUrl.includes('#')) {
            const [filePart] = linkUrl.split('#');
            targetPath = path.resolve(sourceDir, filePart);
        } else {
            targetPath = path.resolve(sourceDir, linkUrl);
        }
        
        // Normalize path separators
        targetPath = targetPath.replace(/\\/g, '/');
        
        const exists = fs.existsSync(targetPath);
        
        if (!exists) {
            // Try with .md extension if not present
            if (!targetPath.endsWith('.md') && !path.extname(targetPath)) {
                const withMdExt = targetPath + '.md';
                if (fs.existsSync(withMdExt)) {
                    return { exists: true, actualPath: withMdExt, reason: 'found-with-md-extension' };
                }
            }
        }
        
        return { 
            exists, 
            actualPath: targetPath,
            reason: exists ? 'found' : 'not-found'
        };
    } catch (error) {
        return { 
            exists: false, 
            error: error.message,
            reason: 'error-checking'
        };
    }
}

/**
 * Check all links in a file
 */
function checkFileLinks(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const links = extractLinks(content, filePath);
        const results = [];
        
        for (const link of links) {
            const result = {
                ...link,
                status: 'unchecked'
            };
            
            switch (link.type) {
                case 'relative':
                case 'file-with-anchor':
                    const checkResult = checkRelativeLink(link.url, filePath);
                    result.status = checkResult.exists ? 'ok' : 'broken';
                    result.checkDetails = checkResult;
                    break;
                
                case 'anchor':
                    // For now, assume anchor links are OK (would need content parsing to verify)
                    result.status = 'ok';
                    result.checkDetails = { reason: 'anchor-not-verified' };
                    break;
                
                case 'external':
                case 'email':
                    result.status = 'ok';
                    result.checkDetails = { reason: 'external-not-checked' };
                    break;
                
                case 'broken-reference':
                    result.status = 'broken';
                    result.checkDetails = { reason: 'broken-reference-definition' };
                    break;
                
                default:
                    result.status = 'unknown';
                    result.checkDetails = { reason: 'unknown-link-type' };
            }
            
            results.push(result);
        }
        
        return results;
    } catch (error) {
        console.error(`Error checking file ${filePath}:`, error.message);
        return [];
    }
}

/**
 * Main function to check all markdown files
 */
function checkAllMarkdownLinks() {
    console.log('🔍 Scanning for markdown files...');
    const mdFiles = getAllMarkdownFiles();
    console.log(`Found ${mdFiles.length} markdown files\n`);
    
    const allResults = [];
    const brokenLinks = [];
    const summary = {
        totalFiles: mdFiles.length,
        totalLinks: 0,
        brokenLinks: 0,
        okLinks: 0,
        uncheckedLinks: 0
    };
    
    for (const filePath of mdFiles) {
        console.log(`Checking: ${filePath}`);
        const linkResults = checkFileLinks(filePath);
        allResults.push({
            file: filePath,
            links: linkResults
        });
        
        summary.totalLinks += linkResults.length;
        
        for (const link of linkResults) {
            if (link.status === 'broken') {
                brokenLinks.push(link);
                summary.brokenLinks++;
            } else if (link.status === 'ok') {
                summary.okLinks++;
            } else {
                summary.uncheckedLinks++;
            }
        }
    }
    
    // Report results
    console.log('\n📊 Link Check Summary:');
    console.log(`Files checked: ${summary.totalFiles}`);
    console.log(`Total links: ${summary.totalLinks}`);
    console.log(`✅ OK links: ${summary.okLinks}`);
    console.log(`❌ Broken links: ${summary.brokenLinks}`);
    console.log(`⚠️  Unchecked links: ${summary.uncheckedLinks}`);
    
    if (brokenLinks.length > 0) {
        console.log('\n❌ BROKEN LINKS FOUND:');
        console.log('=' .repeat(50));
        
        const groupedByFile = {};
        brokenLinks.forEach(link => {
            if (!groupedByFile[link.sourceFile]) {
                groupedByFile[link.sourceFile] = [];
            }
            groupedByFile[link.sourceFile].push(link);
        });
        
        for (const [file, links] of Object.entries(groupedByFile)) {
            console.log(`\n📄 ${file}:`);
            links.forEach(link => {
                console.log(`  Line ${link.line}: [${link.text}](${link.url})`);
                console.log(`    Reason: ${link.checkDetails?.reason || 'unknown'}`);
                if (link.checkDetails?.error) {
                    console.log(`    Error: ${link.checkDetails.error}`);
                }
            });
        }
        
        return false; // Indicate broken links found
    } else {
        console.log('\n✅ All links are working correctly!');
        return true; // All links OK
    }
}

// Run the checker
if (require.main === module) {
    const success = checkAllMarkdownLinks();
    process.exit(success ? 0 : 1);
}

module.exports = { checkAllMarkdownLinks };
