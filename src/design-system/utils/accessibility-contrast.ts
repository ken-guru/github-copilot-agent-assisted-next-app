/**
 * Accessibility Contrast Utilities
 * 
 * WCAG AA compliance checking and color accessibility utilities.
 * Ensures all text/background combinations meet required contrast ratios.
 */

/**
 * Convert RGB color to luminance value
 */
function getLuminance(r: number, g: number, b: number): number {
  const values = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * (values[0] || 0) + 0.7152 * (values[1] || 0) + 0.0722 * (values[2] || 0);
}

/**
 * Parse RGB color string to RGB values
 */
function parseRGB(colorString: string): { r: number; g: number; b: number } | null {
  const rgbMatch = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }
  
  // Handle hex colors
  const hexMatch = colorString.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch && hexMatch[1]) {
    const hex = hexMatch[1];
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  }
  
  return null;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseRGB(color1);
  const rgb2 = parseRGB(color2);
  
  if (!rgb1 || !rgb2) {
    console.warn('Invalid color format:', { color1, color2 });
    return 0;
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAGAA(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  return ratio >= requiredRatio;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAGAAA(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 4.5 : 7.0;
  return ratio >= requiredRatio;
}

/**
 * Color contrast audit result
 */
export interface ContrastAuditResult {
  combination: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  isLargeText: boolean;
  recommendation?: string;
}

/**
 * Audit color scheme for WCAG compliance
 */
export function auditColorScheme(colorScheme: Record<string, string>): ContrastAuditResult[] {
  const results: ContrastAuditResult[] = [];
  
  // Define critical text/background combinations to check
  const combinations = [
    // Primary combinations
    { fg: 'onPrimary', bg: 'primary', large: false, name: 'Primary Text on Primary' },
    { fg: 'onPrimaryContainer', bg: 'primaryContainer', large: false, name: 'Primary Container Text' },
    
    // Secondary combinations
    { fg: 'onSecondary', bg: 'secondary', large: false, name: 'Secondary Text on Secondary' },
    { fg: 'onSecondaryContainer', bg: 'secondaryContainer', large: false, name: 'Secondary Container Text' },
    
    // Tertiary combinations
    { fg: 'onTertiary', bg: 'tertiary', large: false, name: 'Tertiary Text on Tertiary' },
    { fg: 'onTertiaryContainer', bg: 'tertiaryContainer', large: false, name: 'Tertiary Container Text' },
    
    // Error combinations
    { fg: 'onError', bg: 'error', large: false, name: 'Error Text on Error' },
    { fg: 'onErrorContainer', bg: 'errorContainer', large: false, name: 'Error Container Text' },
    
    // Surface combinations
    { fg: 'onSurface', bg: 'surface', large: false, name: 'Text on Surface' },
    { fg: 'onSurfaceVariant', bg: 'surfaceVariant', large: false, name: 'Text on Surface Variant' },
    { fg: 'onBackground', bg: 'background', large: false, name: 'Text on Background' },
    
    // Large text combinations (headlines, titles)
    { fg: 'onSurface', bg: 'surface', large: true, name: 'Large Text on Surface' },
    { fg: 'onBackground', bg: 'background', large: true, name: 'Large Text on Background' },
    
    // Outline combinations
    { fg: 'outline', bg: 'surface', large: false, name: 'Outline on Surface' },
    { fg: 'outlineVariant', bg: 'surface', large: false, name: 'Outline Variant on Surface' }
  ];
  
  combinations.forEach(combo => {
    const foregroundColor = colorScheme[combo.fg];
    const backgroundColor = colorScheme[combo.bg];
    
    if (foregroundColor && backgroundColor) {
      const ratio = getContrastRatio(foregroundColor, backgroundColor);
      const wcagAA = meetsWCAGAA(foregroundColor, backgroundColor, combo.large);
      const wcagAAA = meetsWCAGAAA(foregroundColor, backgroundColor, combo.large);
      
      let recommendation: string | undefined;
      if (!wcagAA) {
        const requiredRatio = combo.large ? 3.0 : 4.5;
        recommendation = `Increase contrast. Current: ${ratio.toFixed(2)}:1, Required: ${requiredRatio}:1`;
      }
      
      results.push({
        combination: combo.name,
        foreground: foregroundColor,
        background: backgroundColor,
        ratio: parseFloat(ratio.toFixed(2)),
        wcagAA,
        wcagAAA,
        isLargeText: combo.large,
        recommendation
      });
    }
  });
  
  return results;
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(
  lightResults: ContrastAuditResult[],
  darkResults: ContrastAuditResult[]
): string {
  const allResults = [...lightResults, ...darkResults];
  const totalCombinations = allResults.length;
  const wcagAACompliant = allResults.filter(r => r.wcagAA).length;
  const wcagAAACompliant = allResults.filter(r => r.wcagAAA).length;
  const issues = allResults.filter(r => !r.wcagAA);
  
  let report = '# Color Accessibility Audit Report\n\n';
  
  report += '## Summary\n';
  report += `- **Total Combinations Tested:** ${totalCombinations}\n`;
  report += `- **WCAG AA Compliant:** ${wcagAACompliant}/${totalCombinations} (${(wcagAACompliant/totalCombinations*100).toFixed(1)}%)\n`;
  report += `- **WCAG AAA Compliant:** ${wcagAAACompliant}/${totalCombinations} (${(wcagAAACompliant/totalCombinations*100).toFixed(1)}%)\n`;
  report += `- **Issues Found:** ${issues.length}\n\n`;
  
  if (issues.length > 0) {
    report += '## ⚠️ Accessibility Issues\n\n';
    issues.forEach(issue => {
      report += `### ${issue.combination}\n`;
      report += `- **Contrast Ratio:** ${issue.ratio}:1\n`;
      report += `- **Foreground:** ${issue.foreground}\n`;
      report += `- **Background:** ${issue.background}\n`;
      report += `- **Large Text:** ${issue.isLargeText ? 'Yes' : 'No'}\n`;
      if (issue.recommendation) {
        report += `- **Recommendation:** ${issue.recommendation}\n`;
      }
      report += '\n';
    });
  }
  
  report += '## ✅ Light Theme Results\n\n';
  lightResults.forEach(result => {
    const status = result.wcagAA ? '✅' : '❌';
    report += `${status} **${result.combination}** - ${result.ratio}:1\n`;
  });
  
  report += '\n## 🌙 Dark Theme Results\n\n';
  darkResults.forEach(result => {
    const status = result.wcagAA ? '✅' : '❌';
    report += `${status} **${result.combination}** - ${result.ratio}:1\n`;
  });
  
  return report;
}

/**
 * Focus indicator styles for accessibility
 */
export const accessibilityFocusStyles = {
  // High contrast focus ring
  focusRing: {
    outline: '2px solid currentColor',
    outlineOffset: '2px',
    borderRadius: '4px'
  },
  
  // Alternative focus style with background
  focusBackground: {
    backgroundColor: 'rgba(103, 80, 164, 0.12)',
    outline: '2px solid rgb(103, 80, 164)',
    outlineOffset: '-2px'
  },
  
  // Focus for dark backgrounds
  focusLight: {
    outline: '2px solid rgb(255, 255, 255)',
    outlineOffset: '2px'
  },
  
  // Focus for light backgrounds  
  focusDark: {
    outline: '2px solid rgb(0, 0, 0)',
    outlineOffset: '2px'
  }
} as const;

/**
 * Color modifications for better accessibility
 */
export const accessibilityColorAdjustments = {
  /**
   * Darken a color for better contrast
   */
  darken: (color: string, amount: number = 0.2): string => {
    const rgb = parseRGB(color);
    if (!rgb) return color;
    
    return `rgb(${Math.max(0, Math.floor(rgb.r * (1 - amount)))}, ${Math.max(0, Math.floor(rgb.g * (1 - amount)))}, ${Math.max(0, Math.floor(rgb.b * (1 - amount)))})`;
  },
  
  /**
   * Lighten a color for better contrast
   */
  lighten: (color: string, amount: number = 0.2): string => {
    const rgb = parseRGB(color);
    if (!rgb) return color;
    
    return `rgb(${Math.min(255, Math.floor(rgb.r * (1 + amount)))}, ${Math.min(255, Math.floor(rgb.g * (1 + amount)))}, ${Math.min(255, Math.floor(rgb.b * (1 + amount)))})`;
  }
} as const;