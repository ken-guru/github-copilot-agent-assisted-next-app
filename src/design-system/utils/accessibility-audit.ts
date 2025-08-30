/**
 * Accessibility Audit for Material 3 Color System
 * 
 * Runs comprehensive contrast checks and generates accessibility reports
 * for both light and dark theme color schemes.
 */

import { lightColorScheme, darkColorScheme } from '../tokens/colors';
import { 
  auditColorScheme, 
  generateAccessibilityReport,
  ContrastAuditResult 
} from '../utils/accessibility-contrast';

/**
 * Run complete accessibility audit
 */
export async function runAccessibilityAudit(): Promise<{
  lightResults: ContrastAuditResult[];
  darkResults: ContrastAuditResult[];
  report: string;
  summary: {
    totalCombinations: number;
    wcagAACompliant: number;
    wcagAAACompliant: number;
    issues: number;
    passRate: number;
  };
}> {
  // Audit both color schemes
  const lightResults = auditColorScheme(lightColorScheme as unknown as Record<string, string>);
  const darkResults = auditColorScheme(darkColorScheme as unknown as Record<string, string>);
  
  // Generate comprehensive report
  const report = generateAccessibilityReport(lightResults, darkResults);
  
  // Calculate summary statistics
  const allResults = [...lightResults, ...darkResults];
  const totalCombinations = allResults.length;
  const wcagAACompliant = allResults.filter(r => r.wcagAA).length;
  const wcagAAACompliant = allResults.filter(r => r.wcagAAA).length;
  const issues = allResults.filter(r => !r.wcagAA).length;
  const passRate = (wcagAACompliant / totalCombinations) * 100;
  
  return {
    lightResults,
    darkResults,
    report,
    summary: {
      totalCombinations,
      wcagAACompliant,
      wcagAAACompliant,
      issues,
      passRate
    }
  };
}

/**
 * Log accessibility audit results to console
 */
export function logAccessibilityResults(
  lightResults: ContrastAuditResult[],
  darkResults: ContrastAuditResult[]
): void {
  console.group('🔍 Material 3 Color Accessibility Audit');
  
  console.log('📊 Light Theme Results:');
  lightResults.forEach(result => {
    const status = result.wcagAA ? '✅' : '❌';
    const level = result.wcagAAA ? ' (AAA)' : result.wcagAA ? ' (AA)' : ' (FAIL)';
    console.log(`  ${status} ${result.combination}: ${result.ratio}:1${level}`);
    if (result.recommendation) {
      console.log(`    💡 ${result.recommendation}`);
    }
  });
  
  console.log('\n🌙 Dark Theme Results:');
  darkResults.forEach(result => {
    const status = result.wcagAA ? '✅' : '❌';
    const level = result.wcagAAA ? ' (AAA)' : result.wcagAA ? ' (AA)' : ' (FAIL)';
    console.log(`  ${status} ${result.combination}: ${result.ratio}:1${level}`);
    if (result.recommendation) {
      console.log(`    💡 ${result.recommendation}`);
    }
  });
  
  const allResults = [...lightResults, ...darkResults];
  const passed = allResults.filter(r => r.wcagAA).length;
  const total = allResults.length;
  
  console.log(`\n📈 Overall: ${passed}/${total} combinations pass WCAG AA (${((passed/total)*100).toFixed(1)}%)`);
  console.groupEnd();
}

/**
 * Check specific color combination
 */
export function checkColorCombination(
  foreground: string,
  background: string,
  isLargeText: boolean = false,
  label: string = 'Custom'
): ContrastAuditResult {
  const results = auditColorScheme({ fg: foreground, bg: background });
  if (results.length > 0) {
    const result = results[0];
    if (result) {
      return {
        combination: label,
        foreground: result.foreground,
        background: result.background,
        ratio: result.ratio,
        wcagAA: result.wcagAA,
        wcagAAA: result.wcagAAA,
        isLargeText,
        recommendation: result.recommendation
      };
    }
  }
  
  // Fallback for direct checking
  return {
    combination: label,
    foreground,
    background,
    ratio: 0,
    wcagAA: false,
    wcagAAA: false,
    isLargeText,
    recommendation: 'Unable to calculate contrast ratio'
  };
}

/**
 * Suggest accessible alternatives for failing combinations
 */
export function suggestAccessibleAlternatives(
  foreground: string,
  background: string,
  targetLevel: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): string[] {
  const suggestions: string[] = [];
  
  // This would implement color adjustment algorithms
  // For now, provide general guidance
  suggestions.push('Consider darkening the foreground color');
  suggestions.push('Consider lightening the background color');
  suggestions.push('Try using a different color from the palette');
  suggestions.push('Consider using outline or border for better definition');
  
  return suggestions;
}