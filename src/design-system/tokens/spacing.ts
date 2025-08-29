/**
 * Material 3 Spacing Tokens
 * Consistent spacing system with semantic naming and responsive scaling
 */

/**
 * Material 3 Spacing Scale
 * Based on 4px grid system with extended range
 */
export const Material3Spacing = {
  // None
  none: '0rem',
  
  // Extra Small
  extraSmall1: '0.0625rem', // 1px
  extraSmall2: '0.125rem',  // 2px
  extraSmall3: '0.1875rem', // 3px
  
  // Small  
  small1: '0.25rem',   // 4px
  small2: '0.375rem',  // 6px
  small3: '0.5rem',    // 8px
  small4: '0.625rem',  // 10px
  
  // Medium
  medium1: '0.75rem',  // 12px
  medium2: '1rem',     // 16px
  medium3: '1.25rem',  // 20px
  medium4: '1.5rem',   // 24px
  
  // Large
  large1: '1.75rem',   // 28px
  large2: '2rem',      // 32px
  large3: '2.5rem',    // 40px
  large4: '3rem',      // 48px
  
  // Extra Large
  extraLarge1: '3.5rem',  // 56px
  extraLarge2: '4rem',    // 64px
  extraLarge3: '4.5rem',  // 72px
  extraLarge4: '5rem',    // 80px
  
  // Jumbo
  jumbo1: '6rem',     // 96px
  jumbo2: '8rem',     // 128px
  jumbo3: '10rem',    // 160px
  jumbo4: '12rem'     // 192px
} as const;

/**
 * Semantic spacing tokens for specific use cases
 */
export const Material3SemanticSpacing = {
  // Component internal spacing
  componentPadding: {
    dense: Material3Spacing.small3,     // 8px
    normal: Material3Spacing.medium2,   // 16px
    comfortable: Material3Spacing.medium4 // 24px
  },
  
  // Layout spacing
  layoutGap: {
    tight: Material3Spacing.small3,     // 8px
    normal: Material3Spacing.medium3,   // 20px
    loose: Material3Spacing.large2     // 32px
  },
  
  // Section spacing
  sectionSpacing: {
    small: Material3Spacing.large3,     // 40px
    medium: Material3Spacing.extraLarge1, // 56px
    large: Material3Spacing.extraLarge2   // 64px
  },
  
  // Container spacing
  containerPadding: {
    mobile: Material3Spacing.medium2,   // 16px
    tablet: Material3Spacing.medium4,   // 24px
    desktop: Material3Spacing.large2    // 32px
  },
  
  // Touch targets
  touchTarget: {
    minimum: '2.75rem', // 44px - iOS/Android minimum
    comfortable: '3rem' // 48px - comfortable touch
  },
  
  // Focus rings
  focusRing: {
    offset: Material3Spacing.extraSmall1, // 1px
    width: Material3Spacing.extraSmall2   // 2px
  }
} as const;

/**
 * Responsive spacing modifiers
 */
export interface ResponsiveSpacingScale {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export const responsiveSpacingScale: ResponsiveSpacingScale = {
  mobile: 1,      // 100% - base scale
  tablet: 1.125,  // 112.5% - slightly larger
  desktop: 1.25,  // 125% - larger
  wide: 1.375     // 137.5% - largest
};

/**
 * Spacing utilities
 */
export class Material3SpacingUtils {
  /**
   * Convert spacing token to pixel value
   */
  static toPixels(spacing: string, baseFontSize: number = 16): number {
    if (spacing.endsWith('rem')) {
      return parseFloat(spacing) * baseFontSize;
    }
    if (spacing.endsWith('px')) {
      return parseFloat(spacing);
    }
    return 0;
  }

  /**
   * Convert pixel value to rem
   */
  static pxToRem(px: number, baseFontSize: number = 16): string {
    return `${px / baseFontSize}rem`;
  }

  /**
   * Scale spacing value by factor
   */
  static scale(spacing: string, factor: number): string {
    if (spacing.endsWith('rem')) {
      const value = parseFloat(spacing);
      return `${value * factor}rem`;
    }
    if (spacing.endsWith('px')) {
      const value = parseFloat(spacing);
      return `${value * factor}px`;
    }
    return spacing;
  }

  /**
   * Apply responsive scaling to spacing
   */
  static responsive(
    baseSpacing: string,
    scale: ResponsiveSpacingScale = responsiveSpacingScale
  ): Record<string, string> {
    return {
      mobile: this.scale(baseSpacing, scale.mobile),
      tablet: this.scale(baseSpacing, scale.tablet),
      desktop: this.scale(baseSpacing, scale.desktop),
      wide: this.scale(baseSpacing, scale.wide)
    };
  }

  /**
   * Generate spacing utilities for CSS
   */
  static generateSpacingUtilities(
    spacing: typeof Material3Spacing,
    prefix: string = 'space'
  ): Record<string, string> {
    const utilities: Record<string, string> = {};

    Object.entries(spacing).forEach(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      
      // Margin utilities
      utilities[`.m-${kebabKey}`] = `margin: ${value}`;
      utilities[`.mt-${kebabKey}`] = `margin-top: ${value}`;
      utilities[`.mr-${kebabKey}`] = `margin-right: ${value}`;
      utilities[`.mb-${kebabKey}`] = `margin-bottom: ${value}`;
      utilities[`.ml-${kebabKey}`] = `margin-left: ${value}`;
      utilities[`.mx-${kebabKey}`] = `margin-left: ${value}; margin-right: ${value}`;
      utilities[`.my-${kebabKey}`] = `margin-top: ${value}; margin-bottom: ${value}`;
      
      // Padding utilities
      utilities[`.p-${kebabKey}`] = `padding: ${value}`;
      utilities[`.pt-${kebabKey}`] = `padding-top: ${value}`;
      utilities[`.pr-${kebabKey}`] = `padding-right: ${value}`;
      utilities[`.pb-${kebabKey}`] = `padding-bottom: ${value}`;
      utilities[`.pl-${kebabKey}`] = `padding-left: ${value}`;
      utilities[`.px-${kebabKey}`] = `padding-left: ${value}; padding-right: ${value}`;
      utilities[`.py-${kebabKey}`] = `padding-top: ${value}; padding-bottom: ${value}`;
      
      // Gap utilities
      utilities[`.gap-${kebabKey}`] = `gap: ${value}`;
      utilities[`.gap-x-${kebabKey}`] = `column-gap: ${value}`;
      utilities[`.gap-y-${kebabKey}`] = `row-gap: ${value}`;
    });

    return utilities;
  }

  /**
   * Generate CSS custom properties for spacing
   */
  static generateCSSVariables(
    spacing: typeof Material3Spacing,
    prefix: string = '--md-space'
  ): Record<string, string> {
    const variables: Record<string, string> = {};

    Object.entries(spacing).forEach(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      variables[`${prefix}-${kebabKey}`] = value;
    });

    return variables;
  }

  /**
   * Calculate optimal spacing for container width
   */
  static calculateContainerSpacing(
    containerWidth: number,
    minSpacing: number = 16,
    maxSpacing: number = 32,
    breakpoint: number = 1200
  ): string {
    const ratio = Math.min(containerWidth / breakpoint, 1);
    const spacing = minSpacing + (maxSpacing - minSpacing) * ratio;
    return this.pxToRem(spacing);
  }

  /**
   * Generate spacing for component variants
   */
  static componentSpacing(
    variant: 'dense' | 'normal' | 'comfortable',
    baseSpacing: string = Material3Spacing.medium2
  ): string {
    const multipliers = {
      dense: 0.75,
      normal: 1,
      comfortable: 1.5
    };

    return this.scale(baseSpacing, multipliers[variant]);
  }
}

/**
 * Grid system spacing
 */
export const Material3GridSpacing = {
  // Container max widths
  containerMaxWidth: {
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
    xxl: '1320px'
  },
  
  // Container padding
  containerPadding: {
    xs: Material3Spacing.medium2,   // 16px
    sm: Material3Spacing.medium2,   // 16px
    md: Material3Spacing.medium4,   // 24px
    lg: Material3Spacing.large2,    // 32px
    xl: Material3Spacing.large2     // 32px
  },
  
  // Column gaps
  columnGap: {
    xs: Material3Spacing.medium2,   // 16px
    sm: Material3Spacing.medium3,   // 20px
    md: Material3Spacing.medium4,   // 24px
    lg: Material3Spacing.large1,    // 28px
    xl: Material3Spacing.large2     // 32px
  },
  
  // Row gaps
  rowGap: {
    xs: Material3Spacing.medium3,   // 20px
    sm: Material3Spacing.medium4,   // 24px
    md: Material3Spacing.large1,    // 28px
    lg: Material3Spacing.large2,    // 32px
    xl: Material3Spacing.large3     // 40px
  }
} as const;

/**
 * Component-specific spacing presets
 */
export const Material3ComponentSpacing = {
  button: {
    paddingX: Material3Spacing.medium4,  // 24px
    paddingY: Material3Spacing.small4,   // 10px
    gap: Material3Spacing.small3         // 8px
  },
  
  card: {
    padding: Material3Spacing.medium2,   // 16px
    gap: Material3Spacing.medium2        // 16px
  },
  
  listItem: {
    paddingX: Material3Spacing.medium2,  // 16px
    paddingY: Material3Spacing.medium1,  // 12px
    gap: Material3Spacing.medium2        // 16px
  },
  
  dialog: {
    padding: Material3Spacing.medium4,   // 24px
    titleGap: Material3Spacing.medium2,  // 16px
    actionGap: Material3Spacing.small3   // 8px
  },
  
  navigationBar: {
    height: '3.5rem',                    // 56px
    paddingX: Material3Spacing.medium2,  // 16px
    gap: Material3Spacing.medium4        // 24px
  },
  
  toolbar: {
    height: '4rem',                      // 64px
    paddingX: Material3Spacing.medium2,  // 16px
    gap: Material3Spacing.medium2        // 16px
  }
} as const;

/**
 * Default export with complete spacing system
 */
export const Material3SpacingSystem = {
  base: Material3Spacing,
  semantic: Material3SemanticSpacing,
  responsive: responsiveSpacingScale,
  grid: Material3GridSpacing,
  components: Material3ComponentSpacing,
  utils: Material3SpacingUtils
};