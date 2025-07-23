#!/usr/bin/env node

/**
 * Update Service Worker Version Script
 * 
 * This script updates the BUILD_VERSION in the service worker file
 * with the current package.json version plus a timestamp for uniqueness.
 * Should be run during the build process to ensure consistent versioning.
 */

const fs = require('fs');
const path = require('path');

// Read package.json to get version
const packagePath = path.join(__dirname, '..', 'package.json');
const serviceWorkerPath = path.join(__dirname, '..', 'public', 'service-worker.js');

try {
  // Read current package version
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const packageVersion = packageJson.version;
  
  // Create build version: package.version-timestamp
  const buildTimestamp = Date.now();
  const buildVersion = `${packageVersion}-${buildTimestamp}`;
  
  // Read service worker file
  const serviceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf8');
  
  // Replace BUILD_VERSION line
  const versionRegex = /const BUILD_VERSION = '[^']+';/;
  const newVersionLine = `const BUILD_VERSION = '${buildVersion}';`;
  
  if (!versionRegex.test(serviceWorkerContent)) {
    console.error('Error: BUILD_VERSION not found in service worker file');
    process.exit(1);
  }
  
  const updatedContent = serviceWorkerContent.replace(versionRegex, newVersionLine);
  
  // Write updated service worker file
  fs.writeFileSync(serviceWorkerPath, updatedContent, 'utf8');
  
  console.log(`✓ Service worker version updated to: ${buildVersion}`);
  console.log(`  Package version: ${packageVersion}`);
  console.log(`  Build timestamp: ${buildTimestamp}`);
  
} catch (error) {
  console.error('Error updating service worker version:', error.message);
  process.exit(1);
}
