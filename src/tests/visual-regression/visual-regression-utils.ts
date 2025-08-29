/**
 * Visual Regression Testing Utilities
 * Helper functions for image comparison and file management
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export interface ImageComparisonResult {
  passed: boolean;
  difference: number;
  totalPixels: number;
  diffPixels: number;
}

/**
 * Compare two images and generate a diff image if they differ
 */
export async function compareImages(
  baselinePath: string,
  actualPath: string,
  diffPath: string,
  threshold = 0.1
): Promise<ImageComparisonResult> {
  try {
    // Check if baseline exists
    const baselineExists = await fileExists(baselinePath);
    if (!baselineExists) {
      // If no baseline exists, copy actual as new baseline
      await fs.copyFile(actualPath, baselinePath);
      return {
        passed: true,
        difference: 0,
        totalPixels: 0,
        diffPixels: 0
      };
    }

    // Read images
    const baselineBuffer = await fs.readFile(baselinePath);
    const actualBuffer = await fs.readFile(actualPath);

    const baselineImg = PNG.sync.read(baselineBuffer);
    const actualImg = PNG.sync.read(actualBuffer);

    // Ensure images have same dimensions
    if (baselineImg.width !== actualImg.width || baselineImg.height !== actualImg.height) {
      throw new Error(`Image dimensions don't match: baseline(${baselineImg.width}x${baselineImg.height}) vs actual(${actualImg.width}x${actualImg.height})`);
    }

    // Compare images
    const { width, height } = baselineImg;
    const diffImg = new PNG({ width, height });
    
    const diffPixels = pixelmatch(
      baselineImg.data,
      actualImg.data,
      diffImg.data,
      width,
      height,
      { threshold }
    );

    const totalPixels = width * height;
    const difference = (diffPixels / totalPixels) * 100;
    const passed = difference < 0.1; // Pass if less than 0.1% difference

    // Save diff image if there are differences
    if (!passed) {
      await ensureDirectoryExists(dirname(diffPath));
      await fs.writeFile(diffPath, PNG.sync.write(diffImg));
    }

    return {
      passed,
      difference,
      totalPixels,
      diffPixels
    };

  } catch (error) {
    console.error('Error comparing images:', error);
    return {
      passed: false,
      difference: 100,
      totalPixels: 0,
      diffPixels: 0
    };
  }
}

/**
 * Generate screenshot file path
 */
export function generateScreenshotPath(baseDir: string, testId: string): string {
  return join(baseDir, `${testId}.png`);
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate visual test report
 */
export async function generateVisualTestReport(
  results: any[],
  outputPath: string
): Promise<void> {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;

  const report = {
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      passRate: ((passedTests / totalTests) * 100).toFixed(2) + '%'
    },
    timestamp: new Date().toISOString(),
    results: results.map(result => ({
      testId: result.testId,
      component: result.component,
      variant: result.variant,
      viewport: result.viewport,
      theme: result.theme,
      state: result.state,
      browser: result.browser,
      passed: result.passed,
      difference: result.difference,
      error: result.error
    }))
  };

  const htmlReport = generateHtmlReport(report);
  await ensureDirectoryExists(dirname(outputPath));
  await fs.writeFile(outputPath, htmlReport);
  
  console.log(`\n📊 Visual Test Report Generated: ${outputPath}`);
  console.log(`✅ Passed: ${passedTests}/${totalTests} (${report.summary.passRate})`);
  if (failedTests > 0) {
    console.log(`❌ Failed: ${failedTests}/${totalTests}`);
  }
}

/**
 * Generate HTML report for visual tests
 */
function generateHtmlReport(report: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Regression Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 0.9em; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .results-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .results-table th, .results-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .results-table th { background: #f8f9fa; font-weight: 600; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 500; }
        .status-passed { background: #d4edda; color: #155724; }
        .status-failed { background: #f8d7da; color: #721c24; }
        .component-group { margin-bottom: 30px; }
        .component-title { font-size: 1.2em; font-weight: 600; margin-bottom: 15px; padding: 10px; background: #e9ecef; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Visual Regression Test Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-value">${report.summary.total}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-value passed">${report.summary.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value failed">${report.summary.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.summary.passRate}</div>
                <div class="stat-label">Pass Rate</div>
            </div>
        </div>

        ${generateResultsByComponent(report.results)}
    </div>
</body>
</html>`;
}

function generateResultsByComponent(results: any[]): string {
  const groupedResults = results.reduce((groups, result) => {
    const key = result.component;
    if (!groups[key]) groups[key] = [];
    groups[key].push(result);
    return groups;
  }, {});

  return Object.entries(groupedResults)
    .map(([component, componentResults]: [string, any]) => `
      <div class="component-group">
        <div class="component-title">${component}</div>
        <table class="results-table">
          <thead>
            <tr>
              <th>Variant</th>
              <th>Viewport</th>
              <th>Theme</th>
              <th>State</th>
              <th>Browser</th>
              <th>Status</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            ${componentResults.map((result: any) => `
              <tr>
                <td>${result.variant}</td>
                <td>${result.viewport}</td>
                <td>${result.theme}</td>
                <td>${result.state}</td>
                <td>${result.browser}</td>
                <td><span class="status-badge status-${result.passed ? 'passed' : 'failed'}">${result.passed ? 'PASSED' : 'FAILED'}</span></td>
                <td>${result.difference ? result.difference.toFixed(2) + '%' : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
}