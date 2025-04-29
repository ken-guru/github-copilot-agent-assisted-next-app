#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Extended Build] Starting extended build process...');

// Step 1: Clean Next.js cache directory
console.log('[Extended Build] Removing Next.js cache directory...');
try {
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next');
    console.log('[Extended Build] Next.js cache directory removed successfully.');
  } else {
    console.log('[Extended Build] Next.js cache directory not found. Skipping removal.');
  }
} catch (error) {
  console.error('[Extended Build] Error removing Next.js cache directory:', error.message);
}

// Step 2: Create a temporary tsconfig for the build that excludes cypress files
console.log('[Extended Build] Creating temporary tsconfig that excludes Cypress files...');
const originalTsConfigPath = path.join(process.cwd(), 'tsconfig.json');
const backupTsConfigPath = path.join(process.cwd(), 'tsconfig.json.backup');
const tempTsConfigPath = path.join(process.cwd(), 'tsconfig.temp.json');

try {
  // Backup original tsconfig
  fs.copyFileSync(originalTsConfigPath, backupTsConfigPath);
  console.log('[Extended Build] Original tsconfig.json backed up to tsconfig.json.backup');
  
  // Read the original config
  const tsConfig = JSON.parse(fs.readFileSync(originalTsConfigPath, 'utf8'));
  
  // Modify the exclude to specifically exclude cypress files
  if (!tsConfig.exclude) {
    tsConfig.exclude = [];
  }
  if (!tsConfig.exclude.includes('cypress')) {
    tsConfig.exclude.push('cypress');
  }
  if (!tsConfig.exclude.includes('**/*.cy.ts')) {
    tsConfig.exclude.push('**/*.cy.ts');
  }
  if (!tsConfig.exclude.includes('**/*.cy.tsx')) {
    tsConfig.exclude.push('**/*.cy.tsx');
  }
  
  // Update target to es2015 for compatibility with Map iteration
  if (tsConfig.compilerOptions) {
    tsConfig.compilerOptions.target = 'es2015';
    console.log('[Extended Build] Updated target to es2015 for Map iteration compatibility');
  }
  
  // Write the temporary config
  fs.writeFileSync(originalTsConfigPath, JSON.stringify(tsConfig, null, 2));
  console.log('[Extended Build] Temporary tsconfig created with Cypress files excluded');
  
  // Step 3: Run the build command
  console.log('[Extended Build] Running the build command...');
  execSync('next build', { stdio: 'inherit' });
  console.log('[Extended Build] Build completed successfully!');
  
  // Step 4: Restore original tsconfig
  fs.copyFileSync(backupTsConfigPath, originalTsConfigPath);
  fs.unlinkSync(backupTsConfigPath);
  console.log('[Extended Build] Original tsconfig.json restored');
} catch (error) {
  // In case of error, ensure we restore the original tsconfig
  if (fs.existsSync(backupTsConfigPath)) {
    fs.copyFileSync(backupTsConfigPath, originalTsConfigPath);
    fs.unlinkSync(backupTsConfigPath);
    console.log('[Extended Build] Original tsconfig.json restored after error');
  }
  console.error('[Extended Build] Build failed:', error.message);
  process.exit(1);
}
