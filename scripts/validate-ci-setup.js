#!/usr/bin/env node

/**
 * CI Setup Validation Script
 * 
 * This script validates that the project is properly configured for CI/CD
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');

console.log('🔍 Validating CI/CD setup...\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync(path.join(rootDir, 'package.json')),
    fix: 'Ensure package.json exists in the root directory'
  },
  {
    name: 'Package-lock.json exists',
    check: () => fs.existsSync(path.join(rootDir, 'package-lock.json')),
    fix: 'Run "npm install" to generate package-lock.json'
  },
  {
    name: 'TypeScript configuration',
    check: () => fs.existsSync(path.join(rootDir, 'tsconfig.json')),
    fix: 'Ensure tsconfig.json exists'
  },
  {
    name: 'Jest configuration',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
      return packageJson.devDependencies && packageJson.devDependencies.jest;
    },
    fix: 'Install Jest: npm install --save-dev jest'
  },
  {
    name: 'Build script exists',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
      return packageJson.scripts && packageJson.scripts.build;
    },
    fix: 'Add build script to package.json'
  },
  {
    name: 'Test script exists',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
      return packageJson.scripts && packageJson.scripts.test;
    },
    fix: 'Add test script to package.json'
  },
  {
    name: 'Dependencies are installable',
    check: () => {
      try {
        execSync('npm ci --dry-run', { stdio: 'pipe', cwd: rootDir });
        return true;
      } catch (error) {
        return false;
      }
    },
    fix: 'Run "npm install" to fix dependency issues'
  },
  {
    name: 'TypeScript compiles',
    check: () => {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: rootDir });
        return true;
      } catch (error) {
        return false;
      }
    },
    fix: 'Fix TypeScript compilation errors'
  },
  {
    name: 'Tests can run',
    check: () => {
      try {
        execSync('npm test -- --passWithNoTests', { stdio: 'pipe', cwd: rootDir });
        return true;
      } catch (error) {
        return false;
      }
    },
    fix: 'Fix test configuration or test failures'
  }
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  process.stdout.write(`Checking ${check.name}... `);
  
  try {
    if (check.check()) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log('❌ FAIL');
      console.log(`   Fix: ${check.fix}`);
      failed++;
    }
  } catch (error) {
    console.log('❌ ERROR');
    console.log(`   Error: ${error.message}`);
    console.log(`   Fix: ${check.fix}`);
    failed++;
  }
}

console.log('\n📊 Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All checks passed! Your project is ready for CI/CD.');
} else {
  console.log('\n⚠️  Some checks failed. Please fix the issues above before deploying.');
  process.exit(1);
}

// Additional recommendations
console.log('\n💡 Recommendations:');
console.log('1. Set up GitHub Actions workflow');
console.log('2. Configure Dependabot for dependency updates');
console.log('3. Add pre-commit hooks with Husky');
console.log('4. Set up code coverage reporting');
console.log('5. Configure automated security scanning');