/**
 * Material 3 Typography Tokens
 * Comprehensive typography system with semantic naming and responsive scaling
 */

/**
 * Material 3 Typography Scale
 * Five scale levels: Display, Headline, Title, Body, Label
 */
export interface Material3TypeScale {
  // Display styles (largest)
  displayLarge: TypographyToken;
  displayMedium: TypographyToken;
  displaySmall: TypographyToken;
  
  // Headline styles
  headlineLarge: TypographyToken;
  headlineMedium: TypographyToken;
  headlineSmall: TypographyToken;
  
  // Title styles
  titleLarge: TypographyToken;
  titleMedium: TypographyToken;
  titleSmall: TypographyToken;
  
  // Body styles
  bodyLarge: TypographyToken;
  bodyMedium: TypographyToken;
  bodySmall: TypographyToken;
  
  // Label styles (smallest)
  labelLarge: TypographyToken;
  labelMedium: TypographyToken;
  labelSmall: TypographyToken;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  textDecoration?: string;
  textTransform?: string;
}

/**
 * Material 3 Font Weights
 */
export const Material3FontWeights = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700
} as const;

/**
 * Default Material 3 Typography Scale
 */
export const material3TypeScale: Material3TypeScale = {
  // Display styles
  displayLarge: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '3.5625rem', // 57px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '4rem', // 64px
    letterSpacing: '-0.0156rem' // -0.25px
  },
  displayMedium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '2.8125rem', // 45px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '3.25rem', // 52px
    letterSpacing: '0rem'
  },
  displaySmall: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '2.25rem', // 36px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '2.75rem', // 44px
    letterSpacing: '0rem'
  },
  
  // Headline styles
  headlineLarge: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '2rem', // 32px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '2.5rem', // 40px
    letterSpacing: '0rem'
  },
  headlineMedium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.75rem', // 28px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '2.25rem', // 36px
    letterSpacing: '0rem'
  },
  headlineSmall: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.5rem', // 24px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '2rem', // 32px
    letterSpacing: '0rem'
  },
  
  // Title styles
  titleLarge: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.375rem', // 22px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '1.75rem', // 28px
    letterSpacing: '0rem'
  },
  titleMedium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1rem', // 16px
    fontWeight: Material3FontWeights.medium,
    lineHeight: '1.5rem', // 24px
    letterSpacing: '0.009375rem' // 0.15px
  },
  titleSmall: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem', // 14px
    fontWeight: Material3FontWeights.medium,
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0.00625rem' // 0.1px
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1rem', // 16px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '1.5rem', // 24px
    letterSpacing: '0.03125rem' // 0.5px
  },
  bodyMedium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem', // 14px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0.015625rem' // 0.25px
  },
  bodySmall: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.75rem', // 12px
    fontWeight: Material3FontWeights.regular,
    lineHeight: '1rem', // 16px
    letterSpacing: '0.025rem' // 0.4px
  },
  
  // Label styles
  labelLarge: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem', // 14px
    fontWeight: Material3FontWeights.medium,
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0.00625rem' // 0.1px
  },
  labelMedium: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.75rem', // 12px
    fontWeight: Material3FontWeights.medium,
    lineHeight: '1rem', // 16px
    letterSpacing: '0.03125rem' // 0.5px
  },
  labelSmall: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.6875rem', // 11px
    fontWeight: Material3FontWeights.medium,
    lineHeight: '1rem', // 16px
    letterSpacing: '0.03125rem' // 0.5px
  }
};

/**
 * Responsive typography breakpoints
 */
export const typographyBreakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
} as const;

/**
 * Responsive typography scaling
 */
export interface ResponsiveTypeScale {
  mobile: Material3TypeScale;
  tablet: Material3TypeScale;
  desktop: Material3TypeScale;
}

/**
 * Generate responsive typography scale
 */
export function createResponsiveTypeScale(
  baseScale: Material3TypeScale,
  scaleFactor: { tablet: number; desktop: number } = { tablet: 1.1, desktop: 1.2 }
): ResponsiveTypeScale {
  const scaleFont = (token: TypographyToken, factor: number): TypographyToken => ({
    ...token,
    fontSize: `${parseFloat(token.fontSize) * factor}rem`,
    lineHeight: `${parseFloat(token.lineHeight) * factor}rem`
  });

  const scaleTypeScale = (scale: Material3TypeScale, factor: number): Material3TypeScale => {
    const scaledScale: Partial<Material3TypeScale> = {};
    
    Object.entries(scale).forEach(([key, value]) => {
      scaledScale[key as keyof Material3TypeScale] = scaleFont(value, factor);
    });
    
    return scaledScale as Material3TypeScale;
  };

  return {
    mobile: baseScale,
    tablet: scaleTypeScale(baseScale, scaleFactor.tablet),
    desktop: scaleTypeScale(baseScale, scaleFactor.desktop)
  };
}

/**
 * Typography utilities
 */
export class Material3TypographyUtils {
  /**
   * Convert pixel value to rem
   */
  static pxToRem(px: number, baseFontSize: number = 16): string {
    return `${px / baseFontSize}rem`;
  }

  /**
   * Calculate optimal line height
   */
  static calculateLineHeight(fontSize: number, ratio: number = 1.5): string {
    return `${fontSize * ratio}px`;
  }

  /**
   * Generate letter spacing from tracking value
   */
  static trackingToLetterSpacing(tracking: number, fontSize: number): string {
    return `${(tracking / 1000) * fontSize}px`;
  }

  /**
   * Create CSS font shorthand
   */
  static createFontShorthand(token: TypographyToken): string {
    const { fontWeight, fontSize, lineHeight, fontFamily } = token;
    return `${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
  }

  /**
   * Generate CSS custom properties for typography
   */
  static generateCSSVariables(
    typeScale: Material3TypeScale,
    prefix: string = '--md-type'
  ): Record<string, string> {
    const variables: Record<string, string> = {};

    Object.entries(typeScale).forEach(([styleName, token]) => {
      const kebabName = styleName.replace(/([A-Z])/g, '-$1').toLowerCase();
      
      variables[`${prefix}-${kebabName}-font-family`] = token.fontFamily;
      variables[`${prefix}-${kebabName}-font-size`] = token.fontSize;
      variables[`${prefix}-${kebabName}-font-weight`] = token.fontWeight.toString();
      variables[`${prefix}-${kebabName}-line-height`] = token.lineHeight;
      variables[`${prefix}-${kebabName}-letter-spacing`] = token.letterSpacing;
      
      if (token.textDecoration) {
        variables[`${prefix}-${kebabName}-text-decoration`] = token.textDecoration;
      }
      if (token.textTransform) {
        variables[`${prefix}-${kebabName}-text-transform`] = token.textTransform;
      }
    });

    return variables;
  }

  /**
   * Apply typography token to element
   */
  static applyTypographyToken(element: HTMLElement, token: TypographyToken): void {
    element.style.fontFamily = token.fontFamily;
    element.style.fontSize = token.fontSize;
    element.style.fontWeight = token.fontWeight.toString();
    element.style.lineHeight = token.lineHeight;
    element.style.letterSpacing = token.letterSpacing;
    
    if (token.textDecoration) {
      element.style.textDecoration = token.textDecoration;
    }
    if (token.textTransform) {
      element.style.textTransform = token.textTransform;
    }
  }
}

/**
 * Font loading optimization
 */
export const fontLoadingOptimization = {
  /**
   * Preload critical fonts
   */
  preloadFonts: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap',
      rel: 'preload',
      as: 'style',
      onload: "this.onload=null;this.rel='stylesheet'"
    }
  ],

  /**
   * Font display strategy
   */
  fontDisplay: 'swap' as const,

  /**
   * Local font fallbacks
   */
  localFallbacks: {
    'Roboto': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif']
  }
};

/**
 * Typography accessibility helpers
 */
export const typographyA11y = {
  /**
   * Minimum contrast ratios
   */
  contrastRatios: {
    largeText: 3, // 18pt+ or 14pt+ bold
    normalText: 4.5,
    enhanced: 7 // AAA level
  },

  /**
   * Readable line lengths
   */
  readableLineLength: {
    min: '45ch',
    max: '75ch',
    optimal: '60ch'
  },

  /**
   * Focus indicators for typography
   */
  focusRing: {
    offset: '2px',
    width: '2px',
    style: 'solid',
    color: 'var(--md-primary)'
  }
};

/**
 * Default export with complete typography system
 */
export const Material3Typography = {
  scale: material3TypeScale,
  weights: Material3FontWeights,
  breakpoints: typographyBreakpoints,
  createResponsiveScale: createResponsiveTypeScale,
  utils: Material3TypographyUtils,
  fontLoading: fontLoadingOptimization,
  a11y: typographyA11y
};