#!/usr/bin/env node

/**
 * Visual Regression Test Execution Script
 * Main entry point for running comprehensive visual regression and QA tests
 */

import { ComprehensiveTestRunner } from './comprehensive-test-runner';

async function main() {
  const args = process.argv.slice(2);
  const options = {
    suite: args.find(arg => arg.startsWith('--suite='))?.split('=')[1],
    updateBaselines: args.includes('--update-baselines'),
    headless: !args.includes('--headed'),
    verbose: args.includes('--verbose'),
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log('🎨 Material 3 Expressive Design System');
  console.log('📊 Visual Regression & Quality Assurance Tests');
  console.log('=' .repeat(60));

  if (options.verbose) {
    console.log('Configuration:');
    console.log(`  Suite: ${options.suite || 'all'}`);
    console.log(`  Update Baselines: ${options.updateBaselines}`);
    console.log(`  Headless: ${options.headless}`);
    console.log('');
  }

  try {
    const runner = new ComprehensiveTestRunner();
    const report = await runner.runAllTests();

    // Exit with error code if tests failed
    if (report.summary.failedTests > 0) {
      console.error(`\n❌ ${report.summary.failedTests} tests failed`);
      process.exit(1);
    } else {
      console.log(`\n✅ All ${report.summary.totalTests} tests passed!`);
      process.exit(0);
    }

  } catch (error) {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
🎨 Material 3 Expressive Visual Regression Tests

Usage: npm run test:visual [options]

Options:
  --suite=<name>        Run specific test suite only
                        Options: visual, theme, responsive, animation, 
                                accessibility, cross-browser, ux
  --update-baselines    Update baseline images for visual tests
  --headed              Run tests in headed mode (show browser)
  --verbose             Show detailed output
  --help, -h            Show this help message

Examples:
  npm run test:visual                           # Run all tests
  npm run test:visual -- --suite=visual        # Run only visual regression tests
  npm run test:visual -- --update-baselines    # Update baseline images
  npm run test:visual -- --headed --verbose    # Run with browser visible and detailed output

Test Suites:
  • Visual Regression: Component screenshot comparisons across browsers/themes
  • Theme Switching: Color adaptation and theme transition testing
  • Responsive Design: Layout and typography scaling across viewports
  • Animation Performance: Frame rate and smoothness validation
  • Accessibility Compliance: WCAG 2.1 AA compliance and screen reader support
  • Cross-Browser Compatibility: Feature support across modern browsers
  • User Experience Validation: Interaction patterns and usability testing

Reports:
  Results are saved to src/tests/visual-regression/reports/
  • comprehensive-report-[timestamp].json: Complete test results
  • visual-report-[timestamp].html: Visual regression report with screenshots
`);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main as runVisualTests };