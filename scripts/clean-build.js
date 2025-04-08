const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const buildDir = path.resolve(__dirname, '../.next');
const cacheDir = path.resolve(__dirname, '../.next/cache');

// Helper function to log messages
function log(message) {
  console.log(`[Clean Build] ${message}`);
}

// Remove directories if they exist
function removeDir(dir, name) {
  if (fs.existsSync(dir)) {
    log(`Removing ${name} directory...`);
    fs.rmSync(dir, { recursive: true, force: true });
    log(`${name} directory removed successfully.`);
    return true;
  }
  return false;
}

// Main execution
log('Starting clean build process...');

// Remove just the cache directory first (faster for development)
if (removeDir(cacheDir, 'Next.js cache')) {
  log('Cache directory removed. This is often sufficient for fixing build issues.');
}

// If specified with --full, remove the entire .next directory
if (process.argv.includes('--full')) {
  if (removeDir(buildDir, 'build')) {
    log('Full build directory removed. This ensures a completely fresh build.');
  }
}

// Run the build command
log('Running the build command...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  log('Build completed successfully!');
} catch (error) {
  log('Build failed. See error details above.');
  process.exit(1);
}
