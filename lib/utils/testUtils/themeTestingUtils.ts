// filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/utils/testUtils/themeTestingUtils.ts
/**
 * Utilities for testing component theme compatibility
 */

/**
 * Set theme mode for testing
 * @param theme 'light' | 'dark'
 */
export function setTestTheme(theme: 'light' | 'dark'): void {
  // Remove any existing theme classes
  document.documentElement.classList.remove('light-mode', 'dark-mode');
  
  // Add requested theme class
  document.documentElement.classList.add(`${theme}-mode`);
}

/**
 * Calculate the contrast ratio between two colors
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20-TECHS/G18.html
 * 
 * @param color1 - CSS color in any format
 * @param color2 - CSS color in any format
 * @returns contrast ratio (WCAG requires minimum 4.5:1 for normal text, 3:1 for large text)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Convert colors to RGB
  const color1RGB = parseColorToRGB(color1);
  const color2RGB = parseColorToRGB(color2);
  
  if (!color1RGB || !color2RGB) {
    throw new Error(`Invalid color format: ${!color1RGB ? color1 : color2}`);
  }

  // Calculate luminance values
  const color1Luminance = calculateRelativeLuminance(color1RGB);
  const color2Luminance = calculateRelativeLuminance(color2RGB);
  
  // Calculate contrast ratio (WCAG 2.0 formula)
  const lighter = Math.max(color1Luminance, color2Luminance);
  const darker = Math.min(color1Luminance, color2Luminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse CSS color string to RGB values
 * @param colorStr CSS color string (hex, rgb, rgba, hsl, etc.)
 * @returns RGB values as [r, g, b] or null if parsing fails
 */
function parseColorToRGB(colorStr: string): [number, number, number] | null {
  // For testing environment, create a temporary element to parse color
  const tempEl = document.createElement('div');
  tempEl.style.color = colorStr;
  document.body.appendChild(tempEl);
  
  // Get computed style
  const computedColor = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  
  // Parse RGB values (format is "rgb(r, g, b)" or "rgba(r, g, b, a)")
  const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  const rgbaMatch = computedColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/i);
  
  if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10)
    ];
  } else if (rgbaMatch && rgbaMatch[1] && rgbaMatch[2] && rgbaMatch[3]) {
    return [
      parseInt(rgbaMatch[1], 10),
      parseInt(rgbaMatch[2], 10),
      parseInt(rgbaMatch[3], 10)
    ];
  }
  
  return null;
}

/**
 * Calculate relative luminance value for RGB color
 * Using WCAG 2.0 formula: https://www.w3.org/TR/WCAG20-TECHS/G18.html
 * 
 * @param rgb RGB values as [r, g, b]
 * @returns relative luminance value
 */
function calculateRelativeLuminance(rgb: [number, number, number]): number {
  // Normalize RGB values
  const [r, g, b] = rgb.map(val => val / 255);
  
  // Calculate R, G, B components using WCAG formula
  // Using non-null assertion as we've validated RGB values in the parseColorToRGB function
  const rComp = r !== undefined && r <= 0.03928 ? r / 12.92 : Math.pow(((r ?? 0) + 0.055) / 1.055, 2.4);
  const gComp = g !== undefined && g <= 0.03928 ? g / 12.92 : Math.pow(((g ?? 0) + 0.055) / 1.055, 2.4);
  const bComp = b !== undefined && b <= 0.03928 ? b / 12.92 : Math.pow(((b ?? 0) + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * rComp + 0.7152 * gComp + 0.0722 * bComp;
}