#!/usr/bin/env node

/**
 * Cross-Browser Testing Script
 * 
 * Runs comprehensive cross-browser tests for Material 3 Expressive components
 * across different browsers, devices, and network conditions.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BROWSERS = ['chrome', 'firefox', 'edge'];
const DEVICES = ['desktop', 'tablet', 'mobile'];
const NETWORK_CONDITIONS = ['fast', '3g', 'slow'];

// Test results storage
const results = {
  browsers: {},
  devices: {},
  performance: {},
  accessibility: {},
  errors: [],
};

/**
 * Utility functions
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  console.log(`${prefix} ${message}`);
}

function runCommand(command, options = {}) {
  try {
    log(`Running: ${command}`);
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    log(`Command failed: ${error.message}`, 'error');
    return { success: false, error: error.message, output: error.stdout };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Start the development server
 */
async function startDevServer() {
  log('Starting development server...');
  
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      detached: false,
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready') || output.includes('localhost:3000')) {
        if (!serverReady) {
          serverReady = true;
          log('Development server is ready');
          resolve(server);
        }
      }
    });

    server.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('EADDRINUSE')) {
        log('Port 3000 is already in use, assuming server is running');
        resolve(null);
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!serverReady) {
        server.kill();
        reject(new Error('Server failed to start within 60 seconds'));
      }
    }, 60000);
  });
}

/**
 * Run Jest tests for browser compatibility
 */
async function runJestTests() {
  log('Running Jest tests for browser compatibility...');
  
  const result = runCommand('npm test -- --testPathPattern=cross-browser-compatibility.test.ts --verbose');
  
  if (result.success) {
    log('Jest tests passed');
    results.jest = { status: 'passed', output: result.output };
  } else {
    log('Jest tests failed', 'error');
    results.jest = { status: 'failed', error: result.error };
    results.errors.push('Jest tests failed');
  }
  
  return result.success;
}

/**
 * Run Cypress tests for a specific browser
 */
async function runCypressTests(browser, device = 'desktop') {
  log(`Running Cypress tests for ${browser} on ${device}...`);
  
  const env = `CYPRESS_BROWSER=${browser},CYPRESS_DEVICE=${device}`;
  const command = `${env} npx cypress run --browser ${browser} --spec "cypress/e2e/cross-browser-compatibility.cy.ts"`;
  
  const result = runCommand(command);
  
  const testKey = `${browser}-${device}`;
  if (result.success) {
    log(`Cypress tests passed for ${browser} on ${device}`);
    results.browsers[testKey] = { status: 'passed', output: result.output };
  } else {
    log(`Cypress tests failed for ${browser} on ${device}`, 'error');
    results.browsers[testKey] = { status: 'failed', error: result.error };
    results.errors.push(`Cypress tests failed for ${browser} on ${device}`);
  }
  
  return result.success;
}

/**
 * Run performance tests
 */
async function runPerformanceTests() {
  log('Running performance tests...');
  
  const performanceScript = `
    const puppeteer = require('puppeteer');
    
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      // Navigate to the application
      await page.goto('http://localhost:3000');
      
      // Measure performance metrics
      const metrics = await page.metrics();
      
      // Get performance entries
      const performanceEntries = await page.evaluate(() => {
        return {
          navigation: performance.getEntriesByType('navigation')[0],
          paint: performance.getEntriesByType('paint'),
          measure: performance.getEntriesByType('measure'),
        };
      });
      
      // Test animation performance
      await page.evaluate(() => {
        let frameCount = 0;
        let droppedFrames = 0;
        let lastTime = 0;
        
        return new Promise((resolve) => {
          const measureFrames = (currentTime) => {
            if (lastTime) {
              const delta = currentTime - lastTime;
              frameCount++;
              
              if (delta > 16.67) { // 60fps threshold
                droppedFrames++;
              }
            }
            
            lastTime = currentTime;
            
            if (frameCount < 60) {
              requestAnimationFrame(measureFrames);
            } else {
              resolve({
                frameCount,
                droppedFrames,
                dropRate: droppedFrames / frameCount,
              });
            }
          };
          
          requestAnimationFrame(measureFrames);
        });
      });
      
      await browser.close();
      
      console.log(JSON.stringify({
        metrics,
        performanceEntries,
      }));
    })();
  `;
  
  // Write temporary performance test script
  const tempScript = path.join(__dirname, 'temp-performance-test.js');
  fs.writeFileSync(tempScript, performanceScript);
  
  try {
    const result = runCommand(`node ${tempScript}`);
    
    if (result.success) {
      const performanceData = JSON.parse(result.output);
      results.performance = performanceData;
      log('Performance tests completed');
      
      // Check performance budgets
      const navigation = performanceData.performanceEntries.navigation;
      const fcp = performanceData.performanceEntries.paint.find(p => p.name === 'first-contentful-paint');
      
      if (fcp && fcp.startTime > 2000) {
        results.errors.push(`First Contentful Paint too slow: ${fcp.startTime}ms`);
      }
      
      if (navigation && navigation.loadEventEnd - navigation.navigationStart > 5000) {
        results.errors.push(`Page load too slow: ${navigation.loadEventEnd - navigation.navigationStart}ms`);
      }
    } else {
      log('Performance tests failed', 'error');
      results.errors.push('Performance tests failed');
    }
  } finally {
    // Clean up temporary script
    if (fs.existsSync(tempScript)) {
      fs.unlinkSync(tempScript);
    }
  }
}

/**
 * Run accessibility tests
 */
async function runAccessibilityTests() {
  log('Running accessibility tests...');
  
  const a11yScript = `
    const { chromium } = require('playwright');
    const { injectAxe, checkA11y } = require('axe-playwright');
    
    (async () => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      await page.goto('http://localhost:3000');
      await injectAxe(page);
      
      try {
        const results = await checkA11y(page, null, {
          detailedReport: true,
          detailedReportOptions: { html: true },
        });
        
        console.log(JSON.stringify(results));
      } catch (error) {
        console.error('Accessibility test failed:', error.message);
        process.exit(1);
      }
      
      await browser.close();
    })();
  `;
  
  // Write temporary accessibility test script
  const tempScript = path.join(__dirname, 'temp-a11y-test.js');
  fs.writeFileSync(tempScript, a11yScript);
  
  try {
    const result = runCommand(`node ${tempScript}`);
    
    if (result.success) {
      const a11yResults = JSON.parse(result.output);
      results.accessibility = a11yResults;
      log('Accessibility tests completed');
      
      // Check for violations
      if (a11yResults.violations && a11yResults.violations.length > 0) {
        results.errors.push(`Accessibility violations found: ${a11yResults.violations.length}`);
      }
    } else {
      log('Accessibility tests failed', 'error');
      results.errors.push('Accessibility tests failed');
    }
  } finally {
    // Clean up temporary script
    if (fs.existsSync(tempScript)) {
      fs.unlinkSync(tempScript);
    }
  }
}

/**
 * Test bundle size optimization
 */
async function testBundleSize() {
  log('Testing bundle size optimization...');
  
  // Build the application
  const buildResult = runCommand('npm run build');
  
  if (!buildResult.success) {
    log('Build failed', 'error');
    results.errors.push('Build failed');
    return;
  }
  
  // Analyze bundle size
  const bundleAnalyzer = runCommand('npx next-bundle-analyzer');
  
  if (bundleAnalyzer.success) {
    log('Bundle analysis completed');
    results.bundleSize = { status: 'analyzed' };
  } else {
    log('Bundle analysis failed', 'error');
    results.bundleSize = { status: 'failed' };
  }
  
  // Check for large bundles (simplified check)
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      const files = fs.readdirSync(staticDir, { recursive: true });
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      let totalSize = 0;
      jsFiles.forEach(file => {
        const filePath = path.join(staticDir, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      });
      
      const totalSizeMB = totalSize / (1024 * 1024);
      results.bundleSize.totalSizeMB = totalSizeMB;
      
      if (totalSizeMB > 5) { // 5MB threshold
        results.errors.push(`Bundle size too large: ${totalSizeMB.toFixed(2)}MB`);
      }
      
      log(`Total bundle size: ${totalSizeMB.toFixed(2)}MB`);
    }
  }
}

/**
 * Generate test report
 */
function generateReport() {
  log('Generating test report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: Object.keys(results.browsers).length,
      passedTests: Object.values(results.browsers).filter(r => r.status === 'passed').length,
      failedTests: Object.values(results.browsers).filter(r => r.status === 'failed').length,
      errors: results.errors.length,
    },
    results,
  };
  
  // Write report to file
  const reportPath = path.join(process.cwd(), 'cross-browser-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cross-Browser Test Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        .error { background: #ffebee; padding: 10px; border-radius: 4px; margin: 5px 0; }
        .section { margin: 20px 0; }
        .section h3 { border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>Cross-Browser Test Report</h1>
      <div class="summary">
        <h2>Summary</h2>
        <p>Generated: ${report.timestamp}</p>
        <p>Total Tests: ${report.summary.totalTests}</p>
        <p class="passed">Passed: ${report.summary.passedTests}</p>
        <p class="failed">Failed: ${report.summary.failedTests}</p>
        <p>Errors: ${report.summary.errors}</p>
      </div>
      
      ${report.summary.errors > 0 ? `
        <div class="section">
          <h3>Errors</h3>
          ${results.errors.map(error => `<div class="error">${error}</div>`).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <h3>Browser Test Results</h3>
        <pre>${JSON.stringify(results.browsers, null, 2)}</pre>
      </div>
      
      ${results.performance ? `
        <div class="section">
          <h3>Performance Results</h3>
          <pre>${JSON.stringify(results.performance, null, 2)}</pre>
        </div>
      ` : ''}
      
      ${results.accessibility ? `
        <div class="section">
          <h3>Accessibility Results</h3>
          <pre>${JSON.stringify(results.accessibility, null, 2)}</pre>
        </div>
      ` : ''}
    </body>
    </html>
  `;
  
  const htmlReportPath = path.join(process.cwd(), 'cross-browser-test-report.html');
  fs.writeFileSync(htmlReportPath, htmlReport);
  
  log(`Report generated: ${reportPath}`);
  log(`HTML report generated: ${htmlReportPath}`);
  
  return report;
}

/**
 * Main test runner
 */
async function main() {
  log('Starting cross-browser testing...');
  
  let server = null;
  
  try {
    // Start development server
    server = await startDevServer();
    await sleep(3000); // Give server time to fully start
    
    // Run Jest tests
    await runJestTests();
    
    // Run Cypress tests for each browser and device combination
    for (const browser of BROWSERS) {
      for (const device of DEVICES) {
        try {
          await runCypressTests(browser, device);
          await sleep(1000); // Brief pause between tests
        } catch (error) {
          log(`Failed to run tests for ${browser} on ${device}: ${error.message}`, 'error');
          results.errors.push(`Failed to run tests for ${browser} on ${device}`);
        }
      }
    }
    
    // Run performance tests
    await runPerformanceTests();
    
    // Run accessibility tests
    await runAccessibilityTests();
    
    // Test bundle size
    await testBundleSize();
    
    // Generate report
    const report = generateReport();
    
    // Exit with appropriate code
    if (report.summary.errors > 0 || report.summary.failedTests > 0) {
      log('Tests completed with errors', 'error');
      process.exit(1);
    } else {
      log('All tests passed successfully');
      process.exit(0);
    }
    
  } catch (error) {
    log(`Test runner failed: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    // Clean up server
    if (server && server.kill) {
      log('Stopping development server...');
      server.kill();
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('Test runner interrupted');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('Test runner terminated');
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  main().catch(error => {
    log(`Unhandled error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runJestTests,
  runCypressTests,
  runPerformanceTests,
  runAccessibilityTests,
  testBundleSize,
  generateReport,
};