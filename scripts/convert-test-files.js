/**
 * Script to convert test files from JS to TS with proper import syntax
 */
const fs = require('fs');
const path = require('path');

const testsDir = path.join(process.cwd(), 'src', 'tests');

// Read all JS files in the tests directory
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.js'));

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace require syntax with import syntax
  content = content.replace(/const\s+(\w+)\s+=\s+require\(['"]([^'"]+)['"]\);/g, 'import $1 from \'$2\';');
  
  // Create a new TS file with updated content
  const newFilePath = path.join(testsDir, file.replace('.js', '.ts'));
  fs.writeFileSync(newFilePath, content);
  
  // Remove the old JS file
  fs.unlinkSync(filePath);
  
  console.log(`Converted ${file} to ${file.replace('.js', '.ts')}`);
});

console.log('All test files converted successfully!');
