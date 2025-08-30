#!/usr/bin/env node

/**
 * Fix Package Lock Script
 * 
 * This script helps fix package-lock.json synchronization issues
 * by removing the lock file and reinstalling dependencies.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const packageLockPath = path.join(rootDir, 'package-lock.json');
const nodeModulesPath = path.join(rootDir, 'node_modules');

console.log('🔧 Fixing package-lock.json synchronization issues...');

try {
  // Step 1: Remove package-lock.json if it exists
  if (fs.existsSync(packageLockPath)) {
    console.log('📝 Removing existing package-lock.json...');
    fs.unlinkSync(packageLockPath);
  }

  // Step 2: Remove node_modules if it exists
  if (fs.existsSync(nodeModulesPath)) {
    console.log('🗑️  Removing existing node_modules...');
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  }

  // Step 3: Clean npm cache
  console.log('🧹 Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit', cwd: rootDir });

  // Step 4: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });

  console.log('✅ Package lock file has been regenerated successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Commit the new package-lock.json file');
  console.log('2. Push the changes to trigger CI again');

} catch (error) {
  console.error('❌ Error fixing package lock:', error.message);
  process.exit(1);
}