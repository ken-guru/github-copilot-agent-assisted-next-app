/**
 * Accessibility Testing Suite for Material 3 Components
 * 
 * Comprehensive automated accessibility testing with WCAG 2.1 compliance,
 * component-specific tests, and detailed reporting.
 */

import { runAccessibilityAudit } from './accessibility-audit';
import { 
  Material3AriaPatterns, 
  AriaTestingUtils 
} from './aria-labels';
import { MotionPreferences } from './reduced-motion';
import { ScreenReaderTesting } from './screen-reader';

/**
 * Accessibility audit results interface
 */
export interface AccessibilityAuditResults {
  summary: {
    totalCombinations: number;
    passedAA: number;
    passedAAA: number;
    failed: number;
  };
  results: Array<{
    background: string;
    foreground: string;
    contrastRatio: number;
    passesAA: boolean;
    passesAAA: boolean;
  }>;
}

/**
 * Test severity levels
 */
export type TestSeverity = 'error' | 'warning' | 'info';

/**
 * Test result interface
 */
export interface AccessibilityTestResult {
  id: string;
  name: string;
  severity: TestSeverity;
  passed: boolean;
  message: string;
  element?: HTMLElement;
  recommendation?: string;
  wcagReference?: string;
}

/**
 * Test suite configuration
 */
export interface AccessibilityTestConfig {
  includeColorContrast: boolean;
  includeKeyboardNavigation: boolean;
  includeScreenReader: boolean;
  includeARIA: boolean;
  includeHeadingStructure: boolean;
  includeLandmarks: boolean;
  includeMotionSupport: boolean;
  includeFormValidation: boolean;
  skipHidden: boolean;
  customTests?: AccessibilityTest[];
}

/**
 * Individual accessibility test
 */
export interface AccessibilityTest {
  id: string;
  name: string;
  description: string;
  severity: TestSeverity;
  wcagReference?: string;
  run: (element: HTMLElement) => AccessibilityTestResult[];
}

/**
 * Default test configuration
 */
const defaultTestConfig: AccessibilityTestConfig = {
  includeColorContrast: true,
  includeKeyboardNavigation: true,
  includeScreenReader: true,
  includeARIA: true,
  includeHeadingStructure: true,
  includeLandmarks: true,
  includeMotionSupport: true,
  includeFormValidation: true,
  skipHidden: true
};

/**
 * Material 3 Accessibility Test Suite
 */
export class Material3AccessibilityTestSuite {
  private config: AccessibilityTestConfig;
  private builtInTests: AccessibilityTest[] = [];

  constructor(config: Partial<AccessibilityTestConfig> = {}) {
    this.config = { ...defaultTestConfig, ...config };
    this.initializeBuiltInTests();
  }

  /**
   * Initialize built-in accessibility tests
   */
  private initializeBuiltInTests(): void {
    this.builtInTests = [
      // Color contrast tests
      {
        id: 'color-contrast-aa',
        name: 'Color Contrast AA',
        description: 'Text must have sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 1.4.3',
        run: this.testColorContrast.bind(this)
      },

      // Keyboard navigation tests
      {
        id: 'keyboard-focusable',
        name: 'Keyboard Focusable',
        description: 'Interactive elements must be keyboard focusable',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 2.1.1',
        run: this.testKeyboardFocusable.bind(this)
      },
      {
        id: 'focus-indicators',
        name: 'Focus Indicators',
        description: 'Focusable elements must have visible focus indicators',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 2.4.7',
        run: this.testFocusIndicators.bind(this)
      },

      // ARIA tests
      {
        id: 'aria-labels',
        name: 'ARIA Labels',
        description: 'Interactive elements must have accessible names',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 4.1.2',
        run: this.testAriaLabels.bind(this)
      },
      {
        id: 'aria-roles',
        name: 'ARIA Roles',
        description: 'Elements must have appropriate ARIA roles',
        severity: 'warning',
        wcagReference: 'WCAG 2.1 SC 4.1.2',
        run: this.testAriaRoles.bind(this)
      },

      // Heading structure tests
      {
        id: 'heading-structure',
        name: 'Heading Structure',
        description: 'Headings must be properly structured and hierarchical',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 1.3.1',
        run: this.testHeadingStructure.bind(this)
      },

      // Landmark tests
      {
        id: 'landmarks',
        name: 'Landmark Structure',
        description: 'Page must have proper landmark structure',
        severity: 'warning',
        wcagReference: 'WCAG 2.1 SC 1.3.1',
        run: this.testLandmarks.bind(this)
      },

      // Motion support tests
      {
        id: 'reduced-motion',
        name: 'Reduced Motion Support',
        description: 'Animations must respect prefers-reduced-motion',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 2.3.3',
        run: this.testReducedMotion.bind(this)
      },

      // Form validation tests
      {
        id: 'form-labels',
        name: 'Form Labels',
        description: 'Form fields must have associated labels',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 1.3.1',
        run: this.testFormLabels.bind(this)
      },
      {
        id: 'form-errors',
        name: 'Form Error Identification',
        description: 'Form errors must be clearly identified',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 3.3.1',
        run: this.testFormErrors.bind(this)
      },

      // Material 3 specific tests
      {
        id: 'm3-fab-accessibility',
        name: 'FAB Accessibility',
        description: 'Floating Action Buttons must be properly accessible',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 4.1.2',
        run: this.testFABAccessibility.bind(this)
      },
      {
        id: 'm3-navigation-accessibility',
        name: 'Navigation Accessibility',
        description: 'Navigation components must be properly accessible',
        severity: 'error',
        wcagReference: 'WCAG 2.1 SC 2.4.3',
        run: this.testNavigationAccessibility.bind(this)
      }
    ];
  }

  /**
   * Run complete accessibility test suite
   */
  public async runFullSuite(container: HTMLElement): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      warnings: number;
      errors: number;
    };
    results: AccessibilityTestResult[];
    colorAudit?: AccessibilityAuditResults;
  }> {
    const results: AccessibilityTestResult[] = [];
    let colorAudit: AccessibilityAuditResults | undefined;

    // Run color contrast audit if enabled
    if (this.config.includeColorContrast) {
      try {
        const auditResults = await runAccessibilityAudit();
        
        // Transform audit results to match our interface
        colorAudit = {
          summary: {
            totalCombinations: auditResults.summary.totalCombinations,
            passedAA: auditResults.summary.wcagAACompliant,
            passedAAA: auditResults.summary.wcagAAACompliant,
            failed: auditResults.summary.issues
          },
          results: [
            ...auditResults.lightResults.map(r => ({
              background: r.background,
              foreground: r.foreground,
              contrastRatio: r.ratio,
              passesAA: r.wcagAA,
              passesAAA: r.wcagAAA
            })),
            ...auditResults.darkResults.map(r => ({
              background: r.background,
              foreground: r.foreground,
              contrastRatio: r.ratio,
              passesAA: r.wcagAA,
              passesAAA: r.wcagAAA
            }))
          ]
        };
      } catch (error) {
        console.warn('Color audit failed:', error);
      }
    }

    // Run all applicable tests
    const testsToRun = this.getTestsToRun();
    
    for (const test of testsToRun) {
      try {
        const testResults = test.run(container);
        results.push(...testResults);
      } catch (error) {
        console.error(`Test ${test.id} failed:`, error);
        results.push({
          id: test.id,
          name: test.name,
          severity: 'error',
          passed: false,
          message: `Test execution failed: ${error}`,
          recommendation: 'Check test implementation and element structure'
        });
      }
    }

    // Generate summary
    const summary = this.generateSummary(results);

    return { summary, results, colorAudit };
  }

  /**
   * Get tests to run based on configuration
   */
  private getTestsToRun(): AccessibilityTest[] {
    const tests = [...this.builtInTests];
    
    if (this.config.customTests) {
      tests.push(...this.config.customTests);
    }

    // Filter based on configuration
    return tests.filter(test => {
      switch (test.id) {
        case 'color-contrast-aa':
          return this.config.includeColorContrast;
        case 'keyboard-focusable':
        case 'focus-indicators':
          return this.config.includeKeyboardNavigation;
        case 'aria-labels':
        case 'aria-roles':
          return this.config.includeARIA;
        case 'heading-structure':
          return this.config.includeHeadingStructure;
        case 'landmarks':
          return this.config.includeLandmarks;
        case 'reduced-motion':
          return this.config.includeMotionSupport;
        case 'form-labels':
        case 'form-errors':
          return this.config.includeFormValidation;
        default:
          return true;
      }
    });
  }

  /**
   * Test color contrast
   */
  private testColorContrast(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const textElements = container.querySelectorAll('*');

    textElements.forEach(element => {
      if (this.shouldSkipElement(element as HTMLElement)) return;

      const computedStyle = window.getComputedStyle(element);
      const textColor = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      // Skip if no visible text
      if (!element.textContent?.trim()) return;

      try {
        const contrast = this.calculateContrastRatio(textColor, backgroundColor);
        const fontSize = parseFloat(computedStyle.fontSize);
        const isLargeText = fontSize >= 18 || 
          (fontSize >= 14 && computedStyle.fontWeight === 'bold');
        
        const minContrast = isLargeText ? 3 : 4.5;
        const passed = contrast >= minContrast;

        if (!passed) {
          results.push({
            id: 'color-contrast-aa',
            name: 'Color Contrast AA',
            severity: 'error',
            passed: false,
            message: `Insufficient contrast ratio: ${contrast.toFixed(2)} (minimum: ${minContrast})`,
            element: element as HTMLElement,
            recommendation: 'Increase contrast between text and background colors',
            wcagReference: 'WCAG 2.1 SC 1.4.3'
          });
        }
      } catch (error) {
        // Skip contrast calculation errors
      }
    });

    return results;
  }

  /**
   * Test keyboard focusability
   */
  private testKeyboardFocusable(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const interactiveElements = container.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"], [onclick]'
    );

    interactiveElements.forEach(element => {
      if (this.shouldSkipElement(element as HTMLElement)) return;

      const htmlElement = element as HTMLElement;
      const tabIndex = htmlElement.getAttribute('tabindex');
      const isDisabled = htmlElement.hasAttribute('disabled') || 
        htmlElement.getAttribute('aria-disabled') === 'true';

      if (!isDisabled && tabIndex === '-1') {
        results.push({
          id: 'keyboard-focusable',
          name: 'Keyboard Focusable',
          severity: 'error',
          passed: false,
          message: 'Interactive element is not keyboard focusable',
          element: htmlElement,
          recommendation: 'Remove tabindex="-1" or add keyboard event handlers',
          wcagReference: 'WCAG 2.1 SC 2.1.1'
        });
      }
    });

    return results;
  }

  /**
   * Test focus indicators
   */
  private testFocusIndicators(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      if (this.shouldSkipElement(element as HTMLElement)) return;

      const htmlElement = element as HTMLElement;
      
      // Simulate focus to check for focus indicators
      htmlElement.focus();
      const computedStyle = window.getComputedStyle(htmlElement, ':focus');
      const outline = computedStyle.outline;
      const boxShadow = computedStyle.boxShadow;
      
      // Check for focus indicators
      const hasFocusIndicator = outline !== 'none' && outline !== '' ||
        boxShadow !== 'none' && boxShadow !== '';

      if (!hasFocusIndicator) {
        results.push({
          id: 'focus-indicators',
          name: 'Focus Indicators',
          severity: 'error',
          passed: false,
          message: 'Element lacks visible focus indicator',
          element: htmlElement,
          recommendation: 'Add CSS focus styles with outline or box-shadow',
          wcagReference: 'WCAG 2.1 SC 2.4.7'
        });
      }
    });

    return results;
  }

  /**
   * Test ARIA labels
   */
  private testAriaLabels(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const validation = AriaTestingUtils.generateReport(container);

    validation.issues.forEach(issue => {
      issue.issues.forEach(issueText => {
        results.push({
          id: 'aria-labels',
          name: 'ARIA Labels',
          severity: 'error',
          passed: false,
          message: issueText,
          element: issue.element,
          recommendation: 'Add appropriate ARIA labels or semantic markup',
          wcagReference: 'WCAG 2.1 SC 4.1.2'
        });
      });
    });

    return results;
  }

  /**
   * Test ARIA roles
   */
  private testAriaRoles(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const elementsWithRoles = container.querySelectorAll('[role]');

    elementsWithRoles.forEach(element => {
      if (this.shouldSkipElement(element as HTMLElement)) return;

      const role = element.getAttribute('role');
      const validRoles = [
        'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
        'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
        'contentinfo', 'definition', 'dialog', 'directory', 'document',
        'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
        'img', 'link', 'list', 'listbox', 'listitem', 'main', 'marquee',
        'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
        'menuitemradio', 'navigation', 'none', 'note', 'option',
        'presentation', 'progressbar', 'radio', 'radiogroup', 'region',
        'row', 'rowgroup', 'rowheader', 'scrollbar', 'search',
        'searchbox', 'separator', 'slider', 'spinbutton', 'status',
        'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term',
        'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid',
        'treeitem'
      ];

      if (role && !validRoles.includes(role)) {
        results.push({
          id: 'aria-roles',
          name: 'ARIA Roles',
          severity: 'warning',
          passed: false,
          message: `Invalid ARIA role: ${role}`,
          element: element as HTMLElement,
          recommendation: 'Use valid ARIA roles from the specification',
          wcagReference: 'WCAG 2.1 SC 4.1.2'
        });
      }
    });

    return results;
  }

  /**
   * Test heading structure
   */
  private testHeadingStructure(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const headingStructure = ScreenReaderTesting.testHeadingStructure(container);

    headingStructure.forEach(heading => {
      heading.issues.forEach(issue => {
        results.push({
          id: 'heading-structure',
          name: 'Heading Structure',
          severity: 'error',
          passed: false,
          message: issue,
          recommendation: 'Maintain proper heading hierarchy (h1 → h2 → h3, etc.)',
          wcagReference: 'WCAG 2.1 SC 1.3.1'
        });
      });
    });

    return results;
  }

  /**
   * Test landmarks
   */
  private testLandmarks(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const landmarks = ScreenReaderTesting.testLandmarks(container);

    landmarks.forEach(landmark => {
      landmark.issues.forEach(issue => {
        results.push({
          id: 'landmarks',
          name: 'Landmark Structure',
          severity: 'warning',
          passed: false,
          message: issue,
          element: landmark.element,
          recommendation: 'Add proper landmark labels and structure',
          wcagReference: 'WCAG 2.1 SC 1.3.1'
        });
      });
    });

    return results;
  }

  /**
   * Test reduced motion support
   */
  private testReducedMotion(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const elementsWithAnimation = container.querySelectorAll(
      '[style*="animation"], [style*="transition"], .animate, .transition'
    );

    elementsWithAnimation.forEach(element => {
      if (this.shouldSkipElement(element as HTMLElement)) return;

      const computedStyle = window.getComputedStyle(element);
      const animation = computedStyle.animation;
      const transition = computedStyle.transition;

      // Check if animations/transitions respect reduced motion
      const hasAnimation = animation !== 'none' && animation !== '';
      const hasTransition = transition !== 'none' && transition !== '';

      if ((hasAnimation || hasTransition) && !this.hasReducedMotionCSS(element as HTMLElement)) {
        results.push({
          id: 'reduced-motion',
          name: 'Reduced Motion Support',
          severity: 'error',
          passed: false,
          message: 'Animation does not respect prefers-reduced-motion preference',
          element: element as HTMLElement,
          recommendation: 'Add @media (prefers-reduced-motion: reduce) CSS rules',
          wcagReference: 'WCAG 2.1 SC 2.3.3'
        });
      }
    });

    return results;
  }

  /**
   * Test form labels
   */
  private testFormLabels(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const formInputs = container.querySelectorAll('input, select, textarea');

    formInputs.forEach(input => {
      if (this.shouldSkipElement(input as HTMLElement)) return;

      const htmlInput = input as HTMLElement;
      const id = htmlInput.getAttribute('id');
      const ariaLabel = htmlInput.getAttribute('aria-label');
      const ariaLabelledby = htmlInput.getAttribute('aria-labelledby');
      
      let hasLabel = false;

      // Check for aria-label
      if (ariaLabel) hasLabel = true;

      // Check for aria-labelledby
      if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        if (labelElement) hasLabel = true;
      }

      // Check for associated label element
      if (id) {
        const labelElement = container.querySelector(`label[for="${id}"]`);
        if (labelElement) hasLabel = true;
      }

      // Check for wrapping label
      const parentLabel = htmlInput.closest('label');
      if (parentLabel) hasLabel = true;

      if (!hasLabel) {
        results.push({
          id: 'form-labels',
          name: 'Form Labels',
          severity: 'error',
          passed: false,
          message: 'Form input lacks accessible label',
          element: htmlInput,
          recommendation: 'Add label element or aria-label attribute',
          wcagReference: 'WCAG 2.1 SC 1.3.1'
        });
      }
    });

    return results;
  }

  /**
   * Test form error identification
   */
  private testFormErrors(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const invalidInputs = container.querySelectorAll('[aria-invalid="true"], .error, .invalid');

    invalidInputs.forEach(input => {
      if (this.shouldSkipElement(input as HTMLElement)) return;

      const htmlInput = input as HTMLElement;
      const ariaDescribedby = htmlInput.getAttribute('aria-describedby');
      
      let hasErrorMessage = false;

      if (ariaDescribedby) {
        const errorElement = document.getElementById(ariaDescribedby);
        if (errorElement && errorElement.textContent?.trim()) {
          hasErrorMessage = true;
        }
      }

      if (!hasErrorMessage) {
        results.push({
          id: 'form-errors',
          name: 'Form Error Identification',
          severity: 'error',
          passed: false,
          message: 'Invalid form field lacks error description',
          element: htmlInput,
          recommendation: 'Add error message with aria-describedby reference',
          wcagReference: 'WCAG 2.1 SC 3.3.1'
        });
      }
    });

    return results;
  }

  /**
   * Test FAB accessibility
   */
  private testFABAccessibility(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const fabs = container.querySelectorAll('.fab, [class*="fab"], [role="button"][class*="float"]');

    fabs.forEach(fab => {
      if (this.shouldSkipElement(fab as HTMLElement)) return;

      const htmlFab = fab as HTMLElement;
      const ariaLabel = htmlFab.getAttribute('aria-label');
      const textContent = htmlFab.textContent?.trim();

      // FABs should have descriptive labels
      if (!ariaLabel && !textContent) {
        results.push({
          id: 'm3-fab-accessibility',
          name: 'FAB Accessibility',
          severity: 'error',
          passed: false,
          message: 'FAB lacks accessible name',
          element: htmlFab,
          recommendation: 'Add aria-label describing the FAB action',
          wcagReference: 'WCAG 2.1 SC 4.1.2'
        });
      }
    });

    return results;
  }

  /**
   * Test navigation accessibility
   */
  private testNavigationAccessibility(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const navElements = container.querySelectorAll('nav, [role="navigation"]');

    navElements.forEach(nav => {
      if (this.shouldSkipElement(nav as HTMLElement)) return;

      const htmlNav = nav as HTMLElement;
      const ariaLabel = htmlNav.getAttribute('aria-label');
      const ariaLabelledby = htmlNav.getAttribute('aria-labelledby');

      // Navigation landmarks should have labels when multiple exist
      const allNavs = container.querySelectorAll('nav, [role="navigation"]');
      if (allNavs.length > 1 && !ariaLabel && !ariaLabelledby) {
        results.push({
          id: 'm3-navigation-accessibility',
          name: 'Navigation Accessibility',
          severity: 'error',
          passed: false,
          message: 'Navigation landmark lacks distinguishing label',
          element: htmlNav,
          recommendation: 'Add aria-label to distinguish between multiple navigation areas',
          wcagReference: 'WCAG 2.1 SC 2.4.3'
        });
      }
    });

    return results;
  }

  /**
   * Helper methods
   */
  private shouldSkipElement(element: HTMLElement): boolean {
    if (!this.config.skipHidden) return false;
    
    return element.offsetParent === null ||
           element.getAttribute('aria-hidden') === 'true' ||
           window.getComputedStyle(element).display === 'none';
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd want a more robust color parsing library
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    const lum1 = this.getLuminance(rgb1);
    const lum2 = this.getLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  private parseColor(color: string): [number, number, number] {
    // Basic RGB parsing - would need enhancement for all color formats
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match && match[1] && match[2] && match[3]) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [0, 0, 0]; // Default to black
  }

  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0);
  }

  private hasReducedMotionCSS(element: HTMLElement): boolean {
    // Check if element or its stylesheet includes reduced motion queries
    // This is a simplified check - real implementation would analyze CSS rules
    const stylesheet = element.ownerDocument.styleSheets;
    
    for (let i = 0; i < stylesheet.length; i++) {
      try {
        const sheet = stylesheet[i];
        if (!sheet) continue;
        
        const rules = sheet.cssRules || (sheet as any).rules;
        if (!rules) continue;
        
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule instanceof CSSMediaRule && 
              rule.conditionText.includes('prefers-reduced-motion')) {
            return true;
          }
        }
      } catch (e) {
        // Cross-origin stylesheets may throw errors
      }
    }
    
    return false;
  }

  private generateSummary(results: AccessibilityTestResult[]) {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const warnings = results.filter(r => r.severity === 'warning').length;
    const errors = results.filter(r => r.severity === 'error').length;

    return { total, passed, failed, warnings, errors };
  }
}

/**
 * Quick accessibility test function
 */
export async function testAccessibility(
  container: HTMLElement,
  config?: Partial<AccessibilityTestConfig>
): Promise<{
  summary: { total: number; passed: number; failed: number; warnings: number; errors: number };
  results: AccessibilityTestResult[];
  colorAudit?: AccessibilityAuditResults;
}> {
  const testSuite = new Material3AccessibilityTestSuite(config);
  return await testSuite.runFullSuite(container);
}

/**
 * Material 3 component-specific accessibility tests
 */
export const Material3ComponentTests = {
  /**
   * Test Material 3 Button accessibility
   */
  button: (buttonElement: HTMLElement): AccessibilityTestResult[] => {
    const results: AccessibilityTestResult[] = [];
    
    // Check for accessible name
    const hasAccessibleName = buttonElement.getAttribute('aria-label') ||
      buttonElement.textContent?.trim() ||
      buttonElement.querySelector('img')?.getAttribute('alt');

    if (!hasAccessibleName) {
      results.push({
        id: 'm3-button-name',
        name: 'Button Accessible Name',
        severity: 'error',
        passed: false,
        message: 'Button lacks accessible name',
        element: buttonElement,
        recommendation: 'Add text content or aria-label',
        wcagReference: 'WCAG 2.1 SC 4.1.2'
      });
    }

    return results;
  },

  /**
   * Test Material 3 Card accessibility
   */
  card: (cardElement: HTMLElement): AccessibilityTestResult[] => {
    const results: AccessibilityTestResult[] = [];
    
    // Cards with click handlers should be focusable
    const hasClickHandler = cardElement.getAttribute('onclick') ||
      cardElement.addEventListener.length > 0;

    if (hasClickHandler && cardElement.getAttribute('tabindex') === null) {
      results.push({
        id: 'm3-card-focusable',
        name: 'Card Focusable',
        severity: 'error',
        passed: false,
        message: 'Interactive card is not keyboard focusable',
        element: cardElement,
        recommendation: 'Add tabindex="0" and keyboard event handlers',
        wcagReference: 'WCAG 2.1 SC 2.1.1'
      });
    }

    return results;
  }
} as const;