/**
 * Project Structure Analysis Script
 * 
 * This script analyzes the current project structure and outputs a report
 * that can be used for the restructuring process.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'docs', 'project-structure', 'structure-report.md');

// Directories to exclude from analysis
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'public',
];

// File extensions to categorize
const COMPONENT_EXTS = ['.jsx', '.tsx'];
const UTILITY_EXTS = ['.js', '.ts'];
const STYLE_EXTS = ['.css', '.scss', '.sass', '.less'];
const CONFIG_EXTS = ['.json', '.config.js', '.config.ts'];

// Results storage
const components = [];
const utilities = [];
const routes = [];
const configs = [];
const styles = [];
const otherFiles = [];

/**
 * Check if a path should be excluded from analysis
 */
function shouldExclude(currentPath) {
  return EXCLUDE_DIRS.some(dir => currentPath.includes(`/${dir}/`));
}

/**
 * Categorize a file based on its extension and path
 */
function categorizeFile(filePath) {
  const ext = path.extname(filePath);
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  
  // Check for components
  if (COMPONENT_EXTS.includes(ext)) {
    // Check for routing components in app directory
    if (relativePath.startsWith('app/') && 
        (relativePath.includes('/page.') || 
         relativePath.includes('/layout.') || 
         relativePath.includes('/loading.') ||
         relativePath.includes('/error.'))) {
      routes.push(relativePath);
    } else {
      components.push(relativePath);
    }
    return;
  }
  
  // Check for utilities
  if (UTILITY_EXTS.includes(ext) && !relativePath.includes('scripts/')) {
    utilities.push(relativePath);
    return;
  }
  
  // Check for styles
  if (STYLE_EXTS.includes(ext)) {
    styles.push(relativePath);
    return;
  }
  
  // Check for config files
  if (CONFIG_EXTS.includes(ext) || relativePath.includes('.config.')) {
    configs.push(relativePath);
    return;
  }
  
  // Other files
  otherFiles.push(relativePath);
}

/**
 * Recursively scan a directory and categorize files
 */
async function scanDirectory(dirPath) {
  if (shouldExclude(dirPath)) {
    return;
  }
  
  try {
    const files = await readdir(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        await scanDirectory(filePath);
      } else {
        categorizeFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

/**
 * Generate a directory tree structure
 */
async function generateDirectoryTree(startPath, level = 0, prefix = '') {
  if (shouldExclude(startPath)) {
    return '';
  }
  
  try {
    const stats = await stat(startPath);
    const relativePath = path.relative(PROJECT_ROOT, startPath);
    const name = path.basename(startPath);
    
    if (!stats.isDirectory()) {
      return `${prefix}${name}\n`;
    }
    
    let result = level === 0 ? '' : `${prefix}${name}/\n`;
    
    const files = await readdir(startPath);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(startPath, file);
      
      const isLast = i === files.length - 1;
      const newPrefix = level === 0 ? '' : `${prefix}${isLast ? '    ' : '│   '}`;
      const branchPrefix = `${prefix}${isLast ? '└── ' : '├── '}`;
      
      const subtree = await generateDirectoryTree(filePath, level + 1, newPrefix);
      result += subtree.replace(/^/m, branchPrefix);
    }
    
    return result;
  } catch (error) {
    console.error(`Error generating tree for ${startPath}:`, error);
    return '';
  }
}

/**
 * Generate the analysis report
 */
async function generateReport() {
  const tree = await generateDirectoryTree(PROJECT_ROOT);
  
  const report = `# Project Structure Analysis Report

## Directory Tree
\`\`\`
${tree}
\`\`\`

## Components (${components.length})
${components.map(c => `- ${c}`).join('\n')}

## Route Components (${routes.length})
${routes.map(r => `- ${r}`).join('\n')}

## Utilities (${utilities.length})
${utilities.map(u => `- ${u}`).join('\n')}

## Styles (${styles.length})
${styles.map(s => `- ${s}`).join('\n')}

## Configuration Files (${configs.length})
${configs.map(c => `- ${c}`).join('\n')}

## Other Files (${otherFiles.length})
${otherFiles.map(o => `- ${o}`).join('\n')}

## Next Steps
1. Review the component organization and identify which components should be moved or reorganized
2. Analyze the routing structure and plan migration to Next.js App Router conventions
3. Plan reorganization of utility functions into appropriate directories
4. Document planned changes in the STRUCTURE_ANALYSIS.md file
`;

  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the report
  fs.writeFileSync(OUTPUT_PATH, report);
  console.log(`Analysis report generated at ${OUTPUT_PATH}`);
}

// Main function
async function main() {
  console.log('Starting project structure analysis...');
  await scanDirectory(PROJECT_ROOT);
  await generateReport();
  console.log('Analysis complete!');
}

main().catch(console.error);
