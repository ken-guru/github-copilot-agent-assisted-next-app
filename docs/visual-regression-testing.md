# Visual Regression Testing & Quality Assurance

This document describes the comprehensive visual regression testing and quality assurance system implemented for the Material 3 Expressive design system.

## Overview

The visual regression testing system provides automated testing for:

- **Visual Regression**: Component screenshot comparisons across browsers, themes, and viewports
- **Theme Switching**: Color adaptation and theme transition validation
- **Responsive Design**: Layout and typography scaling across different screen sizes
- **Animation Performance**: Frame rate monitoring and smoothness validation
- **Accessibility Compliance**: WCAG 2.1 AA compliance and screen reader support
- **Cross-Browser Compatibility**: Feature support across modern browsers
- **User Experience Validation**: Interaction patterns and usability testing

## Architecture

### Core Components

```
src/tests/visual-regression/
├── visual-regression.config.ts      # Test configurations
├── visual-regression-runner.ts      # Main test runner
├── visual-regression-utils.ts       # Utility functions
├── comprehensive-test-runner.ts     # Orchestrates all test suites
├── run-visual-tests.ts             # CLI entry point
├── jest.visual.config.js           # Jest configuration
├── jest.visual.setup.js            # Test setup and custom matchers
├── theme-switching.test.ts         # Theme adaptation tests
├── responsive-design.test.ts       # Responsive behavior tests
├── animation-performance.test.ts   # Animation and performance tests
├── accessibility-compliance.test.ts # Accessibility tests
├── baselines/                      # Baseline screenshots
├── actual/                         # Current test screenshots
├── diff/                          # Difference images
└── reports/                       # Test reports
```

### Test Component Page

A dedicated test page at `/test-components` provides an isolated environment for component testing with configurable props and variants.

## Usage

### Running Tests

```bash
# Run all visual regression and QA tests
npm run test:visual

# Run specific test suite
npm run test:visual -- --suite=visual
npm run test:visual -- --suite=theme
npm run test:visual -- --suite=responsive
npm run test:visual -- --suite=animation
npm run test:visual -- --suite=accessibility

# Update baseline images
npm run test:visual:update

# Run with browser visible (for debugging)
npm run test:visual:headed

# Run Jest-based visual tests
npm run test:visual:jest

# Run complete QA suite
npm run test:qa
```

### Command Line Options

- `--suite=<name>`: Run specific test suite
- `--update-baselines`: Update baseline images
- `--headed`: Show browser during tests
- `--verbose`: Detailed output
- `--help`: Show help message

## Test Suites

### 1. Visual Regression Tests

Captures and compares component screenshots across:
- **Browsers**: Chrome, Firefox, Safari (WebKit)
- **Themes**: Light and dark modes
- **Viewports**: Mobile, tablet, desktop, large desktop
- **States**: Default, hover, focus, active, disabled
- **Variants**: All component variants (filled, outlined, etc.)

**Configuration**: `VISUAL_TEST_CONFIGS` in `visual-regression.config.ts`

### 2. Theme Switching Tests

Validates:
- Smooth theme transitions
- Color contrast ratios (WCAG AA compliance)
- Theme persistence across page reloads
- Dynamic color adaptation
- Semantic color role consistency

### 3. Responsive Design Tests

Tests:
- Typography scaling across viewports
- Layout adaptation for different screen sizes
- Touch target sizing on mobile
- Content reflow without horizontal scrolling
- Orientation change handling
- Breakpoint behavior

### 4. Animation Performance Tests

Monitors:
- Frame rate maintenance (60fps target)
- Memory leak prevention
- Hardware acceleration usage
- Appropriate easing curves
- Reduced motion preference support
- Animation duration standards

### 5. Accessibility Compliance Tests

Validates:
- WCAG 2.1 AA compliance
- Color contrast requirements
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and semantic markup
- Focus indicator visibility
- Form accessibility

### 6. Cross-Browser Compatibility Tests

Ensures:
- Feature support across browsers
- Consistent rendering
- Progressive enhancement
- Fallback behavior

### 7. User Experience Validation Tests

Checks:
- Interaction pattern consistency
- Visual hierarchy effectiveness
- Content readability
- Touch interaction quality

## Configuration

### Test Configuration

Components are configured in `visual-regression.config.ts`:

```typescript
export const VISUAL_TEST_CONFIGS: VisualTestConfig[] = [
  {
    component: 'Material3Button',
    variants: ['filled', 'outlined', 'text', 'elevated', 'tonal'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: COMMON_STATES,
    animations: true,
    accessibility: true
  }
  // ... more configurations
];
```

### Viewport Configurations

Standard viewports for responsive testing:

```typescript
export const STANDARD_VIEWPORTS: ViewportConfig[] = [
  { name: 'mobile', width: 375, height: 667, deviceScaleFactor: 2 },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'large-desktop', width: 1920, height: 1080, deviceScaleFactor: 1 }
];
```

### Theme Configurations

```typescript
export const STANDARD_THEMES: ThemeConfig[] = [
  { name: 'light', colorScheme: 'light' },
  { name: 'dark', colorScheme: 'dark' }
];
```

## Custom Jest Matchers

The testing system includes custom Jest matchers for visual testing:

```typescript
// Visual difference validation
expect(result).toHaveVisualDifference(expected, 0.1);

// Accessibility compliance
expect(axeResults).toBeAccessible();

// Performance validation
expect(performanceData).toHaveGoodPerformance(60);

// Color contrast validation
expect(colorData).toMeetContrastRequirements('AA');
```

## Reports

### Comprehensive Report

JSON report with complete test results:
```json
{
  "summary": {
    "totalSuites": 7,
    "totalTests": 156,
    "passedTests": 152,
    "failedTests": 4,
    "duration": 45000,
    "passRate": "97.44%"
  },
  "suiteResults": [...],
  "visualResults": [...]
}
```

### Visual Regression Report

HTML report with screenshot comparisons, showing:
- Side-by-side baseline vs actual images
- Difference highlighting
- Test metadata (browser, theme, viewport, etc.)
- Pass/fail status with difference percentages

## Best Practices

### Writing Visual Tests

1. **Use Stable Selectors**: Use `data-testid` attributes for reliable element selection
2. **Wait for Animations**: Allow animations to complete before capturing screenshots
3. **Consistent Test Data**: Use predictable test data for reproducible results
4. **Isolated Components**: Test components in isolation when possible
5. **Multiple States**: Test all interactive states (hover, focus, active, disabled)

### Maintaining Baselines

1. **Review Changes**: Always review baseline updates before committing
2. **Batch Updates**: Update baselines for related changes together
3. **Document Changes**: Include reasoning for baseline updates in commit messages
4. **Cross-Browser Testing**: Ensure baselines work across all target browsers

### Performance Considerations

1. **Parallel Execution**: Limit concurrent browser instances to avoid resource exhaustion
2. **Selective Testing**: Use suite-specific runs during development
3. **Cleanup**: Ensure proper cleanup of browser instances and temporary files
4. **CI Optimization**: Use headless mode and appropriate timeouts in CI environments

## Troubleshooting

### Common Issues

**Tests Failing Due to Font Rendering**
- Ensure consistent font loading across environments
- Use web fonts with proper fallbacks
- Consider font rendering differences between operating systems

**Screenshot Differences in CI**
- Use consistent browser versions
- Set appropriate viewport sizes and device scale factors
- Ensure proper theme initialization

**Performance Test Failures**
- Check system resources during test execution
- Adjust frame rate expectations for different environments
- Monitor for background processes affecting performance

**Accessibility Test Failures**
- Review ARIA labels and semantic markup
- Check color contrast ratios
- Validate keyboard navigation paths

### Debugging

1. **Use Headed Mode**: Run tests with `--headed` to see browser interactions
2. **Check Screenshots**: Review actual vs baseline images in diff reports
3. **Console Logs**: Enable verbose logging for detailed test execution information
4. **Error Screenshots**: Automatic error screenshots are captured on test failures

## Integration

### CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
- name: Run Visual Regression Tests
  run: |
    npm ci
    npm run build
    npm run dev &
    sleep 10
    npm run test:visual
    npm run test:qa
```

### Development Workflow

1. **Local Development**: Run specific test suites during feature development
2. **Pre-commit**: Run visual tests before committing design changes
3. **Pull Request**: Automated visual regression testing in PR checks
4. **Release**: Full QA suite execution before releases

## Maintenance

### Regular Tasks

1. **Baseline Updates**: Review and update baselines for intentional design changes
2. **Browser Updates**: Test with new browser versions and update configurations
3. **Performance Monitoring**: Track test execution times and optimize as needed
4. **Report Cleanup**: Archive old test reports and screenshots

### Monitoring

- Test execution duration trends
- Pass/fail rate monitoring
- Browser compatibility tracking
- Performance regression detection

This comprehensive visual regression testing system ensures the Material 3 Expressive design system maintains high quality, consistency, and accessibility across all supported platforms and use cases.