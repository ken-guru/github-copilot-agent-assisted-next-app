import fs from 'fs';
import path from 'path';

// Define paths to check
const paths: [string, string][] = [
  ['src/app', 'Directory for app router'],
  ['src/app/page.tsx', 'Root route component'],
  ['src/app/layout.tsx', 'Root layout component'],
  ['public', 'Public directory'],
  ['public/manifest.json', 'PWA manifest'],
  ['public/service-worker.js', 'Service worker file'],
];

console.log('Checking Next.js file structure...');
console.log('-------------------------------');

// Check if each path exists
let allValid = true;
paths.forEach(([filePath, description]) => {
  if (typeof filePath !== 'string') {
    console.log(`✗ Invalid file path provided`);
    allValid = false;
    return;
  }
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  console.log(`${exists ? '✓' : '✗'} ${filePath} (${description})`);
  
  if (!exists) {
    allValid = false;
  }
});

console.log('-------------------------------');
if (allValid) {
  console.log('All required files exist!');
} else {
  console.log('Some required files are missing. Please check the output above.');
}
