#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Fixing final broken link formatting issues...');

// Fix MRTMLY-161 file
const file161 = './docs/logged_memories/MRTMLY-161-offline-cache-and-config-errors.md';
if (fs.existsSync(file161)) {
  let content = fs.readFileSync(file161, 'utf8');
  
  // Look for any malformed reference links and fix them
  content = content.replace(/\[rel="stylesheet"\]\(\[BROKEN REFERENCE: href\]\)/g, 'rel="stylesheet" href="..."');
  content = content.replace(/\[rel="stylesheet"\]\([^)]*BROKEN[^)]*\)/g, 'rel="stylesheet" href="..."');
  
  fs.writeFileSync(file161, content);
  console.log(`✅ Fixed MRTMLY-161 broken references`);
}

// Fix MRTMLY-039 file
const file039 = './docs/logged_memories/MRTMLY-039-service-worker-lifecycle-tests.md';
if (fs.existsSync(file039)) {
  let content = fs.readFileSync(file039, 'utf8');
  
  // Fix any malformed reference links
  content = content.replace(/\[0\]\(\[BROKEN REFERENCE: [01]\]\)/g, '(referenced above)');
  content = content.replace(/\[[0-9]+\]\([^)]*BROKEN[^)]*\)/g, '(code example)');
  
  fs.writeFileSync(file039, content);
  console.log(`✅ Fixed MRTMLY-039 broken references`);
}

// Also check for any reference definition issues at the end of files
const memoryLogFiles = [file161, file039];

memoryLogFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove any broken reference definitions at the end
    content = content.replace(/\n\[[^\]]+\]:\s*\[BROKEN REFERENCE:[^\]]*\]\s*$/gm, '');
    content = content.replace(/\[[^\]]+\]:\s*\[BROKEN REFERENCE:[^\]]*\]/g, '');
    
    fs.writeFileSync(filePath, content);
  }
});

console.log('🎉 Final link fixes completed');
