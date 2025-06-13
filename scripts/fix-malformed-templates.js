#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript React files
const files = glob.sync('**/*.{tsx,ts}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
  cwd: process.cwd()
});

console.log(`Found ${files.length} files to process`);

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Fix malformed className templates
  const originalContent = content;
  
  // Remove broken template literals like `${...}`} or similar patterns
  content = content.replace(/\s+\$\{[^}]*\}`\}/g, '');
  content = content.replace(/\s+\$\{[^}]*\}`>/g, '>');
  content = content.replace(/className=\{`[^`]*\$\{[^}]*\}[^`]*`\}/g, '');
  content = content.replace(/className=\s*\$\{[^}]*\}/g, '');
  
  // Remove any leftover malformed attributes
  content = content.replace(/\s+\$\{[^}]*styles\.[^}]*\}/g, '');
  content = content.replace(/className=\{[^}]*styles\.[^}]*\}/g, '');
  
  // Clean up empty attributes
  content = content.replace(/className=\{\s*\}/g, '');
  content = content.replace(/className=""/g, '');
  
  // Clean up extra spaces in JSX
  content = content.replace(/<(\w+)\s+>/g, '<$1>');
  content = content.replace(/<(\w+)\s+([^>]*)>/g, '<$1 $2>');

  if (content !== originalContent) {
    console.log(`Fixed: ${file}`);
    fs.writeFileSync(fullPath, content);
    changed = true;
  }
});

console.log('Finished processing files');
