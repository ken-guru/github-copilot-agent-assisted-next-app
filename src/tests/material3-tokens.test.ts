/**
 * Tests for Material 3 Expressive Design Tokens
 */

import { Material3CSSProperties } from '../types/material3-tokens';
import { 
  getMaterial3Token, 
  getMaterial3Typography, 
  getMaterial3Color,
  getMaterial3Shape,
  getMaterial3Elevation,
  getMaterial3Transition,
  getMaterial3ComponentStyle,
  getMaterial3Classes,
  getMaterial3ButtonStyle,
  getMaterial3CardStyle,
  getMaterial3TextFieldStyle,
  getResponsiveMaterial3Typography,
  getMaterial3ExpressiveTypography,
  getMaterial3ContextualTypography,
  getMaterial3AdaptiveTypography
} from '../utils/material3-utils';

describe('Material 3 Design Tokens', () => {
  describe('getMaterial3Token', () => {
    it('should return a CSS var() function string', () => {
      const result = getMaterial3Token('--md-sys-color-primary');
      expect(result).toBe('var(--md-sys-color-primary)');
    });
  });

  describe('getMaterial3Typography', () => {
    it('should return typography styles for headline large', () => {
      const result = getMaterial3Typography('headlineLarge');
      expect(result).toEqual({
        fontFamily: 'var(--md-sys-typescale-headline-large-font-family)',
        fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)',
        fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
        lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
        letterSpacing: 'var(--md-sys-typescale-headline-large-letter-spacing)',
      });
    });

    it('should return typography styles for body medium', () => {
      const result = getMaterial3Typography('bodyMedium');
      expect(result).toEqual({
        fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
        fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)',
        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
        lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
        letterSpacing: 'var(--md-sys-typescale-body-medium-letter-spacing)',
      });
    });
  });

  describe('getMaterial3Color', () => {
    it('should return color styles for primary color', () => {
      const result = getMaterial3Color('primary');
      expect(result).toEqual({
        color: 'var(--md-sys-color-primary)',
      });
    });

    it('should return background color styles when specified', () => {
      const result = getMaterial3Color('primaryContainer', 'backgroundColor');
      expect(result).toEqual({
        backgroundColor: 'var(--md-sys-color-primary-container)',
      });
    });
  });

  describe('getMaterial3Shape', () => {
    it('should return border radius styles for medium corner', () => {
      const result = getMaterial3Shape('cornerMedium');
      expect(result).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-medium)',
      });
    });

    it('should return border radius styles for asymmetric shape', () => {
      const result = getMaterial3Shape('cornerAsymmetricSmall');
      expect(result).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-asymmetric-small)',
      });
    });
  });

  describe('getMaterial3Elevation', () => {
    it('should return box shadow styles for elevation level 1', () => {
      const result = getMaterial3Elevation('level1');
      expect(result).toEqual({
        boxShadow: 'var(--md-sys-elevation-level1)',
      });
    });
  });

  describe('getMaterial3Transition', () => {
    it('should return transition styles with default values', () => {
      const result = getMaterial3Transition('opacity');
      expect(result).toEqual({
        transition: 'opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
      });
    });

    it('should return transition styles with custom duration and easing', () => {
      const result = getMaterial3Transition(['opacity', 'transform'], 'medium1', 'emphasized');
      expect(result).toEqual({
        transition: 'opacity, transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized)',
      });
    });
  });

  describe('getMaterial3ComponentStyle', () => {
    it('should combine multiple token types into a single style object', () => {
      const result = getMaterial3ComponentStyle({
        typography: 'titleMedium',
        color: 'onSurface',
        backgroundColor: 'surface',
        shape: 'cornerSmall',
        elevation: 'level2',
        transition: {
          properties: 'all',
          duration: 'short3',
          easing: 'standard',
        },
      });

      expect(result).toEqual({
        fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
        fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
        fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
        lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
        letterSpacing: 'var(--md-sys-typescale-title-medium-letter-spacing)',
        color: 'var(--md-sys-color-on-surface)',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderRadius: 'var(--md-sys-shape-corner-small)',
        boxShadow: 'var(--md-sys-elevation-level2)',
        transition: 'all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)',
      });
    });
  });

  describe('getMaterial3Classes', () => {
    it('should generate CSS class names for utility classes', () => {
      const result = getMaterial3Classes({
        typography: 'headlineLarge',
        color: 'primary',
        backgroundColor: 'primaryContainer',
        shape: 'cornerMedium',
        elevation: 'level1',
        stateLayer: true,
      });

      expect(result).toBe('md-typescale-headline-large md-color-primary md-bg-primary-container md-shape-corner-medium md-elevation-level1 md-state-layer');
    });

    it('should handle camelCase to kebab-case conversion', () => {
      const result = getMaterial3Classes({
        typography: 'bodyLarge',
        color: 'onPrimaryContainer',
        shape: 'cornerAsymmetricSmall',
      });

      expect(result).toBe('md-typescale-body-large md-color-on-primary-container md-shape-corner-asymmetric-small');
    });
  });

  describe('getMaterial3ButtonStyle', () => {
    it('should return filled button styles by default', () => {
      const result = getMaterial3ButtonStyle();
      
      expect(result).toMatchObject({
        height: '40px',
        padding: '0 24px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        backgroundColor: 'var(--md-sys-color-primary)',
        color: 'var(--md-sys-color-on-primary)',
      });
    });

    it('should return outlined button styles when specified', () => {
      const result = getMaterial3ButtonStyle('outlined');
      
      expect(result).toMatchObject({
        backgroundColor: 'transparent',
        color: 'var(--md-sys-color-primary)',
        border: '1px solid var(--md-sys-color-outline)',
      });
    });

    it('should return small button styles when specified', () => {
      const result = getMaterial3ButtonStyle('filled', 'small');
      
      expect(result).toMatchObject({
        height: '32px',
        padding: '0 16px',
        fontSize: '0.75rem',
      });
    });
  });

  describe('getMaterial3CardStyle', () => {
    it('should return elevated card styles by default', () => {
      const result = getMaterial3CardStyle();
      
      expect(result).toMatchObject({
        padding: '16px',
        display: 'block',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        color: 'var(--md-sys-color-on-surface)',
        boxShadow: 'var(--md-sys-elevation-level1)',
      });
    });

    it('should return outlined card styles when specified', () => {
      const result = getMaterial3CardStyle('outlined');
      
      expect(result).toMatchObject({
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)',
        border: '1px solid var(--md-sys-color-outline-variant)',
      });
    });
  });

  describe('getMaterial3TextFieldStyle', () => {
    it('should return outlined text field styles by default', () => {
      const result = getMaterial3TextFieldStyle();
      
      expect(result).toMatchObject({
        padding: '16px',
        outline: 'none',
        width: '100%',
        backgroundColor: 'transparent',
        color: 'var(--md-sys-color-on-surface)',
        border: '1px solid var(--md-sys-color-outline)',
        borderRadius: 'var(--md-sys-shape-corner-extra-small)',
      });
    });

    it('should return filled text field styles when specified', () => {
      const result = getMaterial3TextFieldStyle('filled');
      
      expect(result).toMatchObject({
        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
        color: 'var(--md-sys-color-on-surface)',
        borderBottom: '1px solid var(--md-sys-color-on-surface-variant)',
      });
    });
  });

  describe('Material3CSSProperties', () => {
    it('should contain all required typography properties', () => {
      expect(Material3CSSProperties.typography).toHaveProperty('displayLarge');
      expect(Material3CSSProperties.typography).toHaveProperty('headlineMedium');
      expect(Material3CSSProperties.typography).toHaveProperty('bodyLarge');
      expect(Material3CSSProperties.typography).toHaveProperty('labelSmall');
    });

    it('should contain all required color properties', () => {
      expect(Material3CSSProperties.colors).toHaveProperty('primary');
      expect(Material3CSSProperties.colors).toHaveProperty('onPrimary');
      expect(Material3CSSProperties.colors).toHaveProperty('surface');
      expect(Material3CSSProperties.colors).toHaveProperty('onSurface');
      expect(Material3CSSProperties.colors).toHaveProperty('error');
    });

    it('should contain all required shape properties', () => {
      expect(Material3CSSProperties.shapes).toHaveProperty('cornerNone');
      expect(Material3CSSProperties.shapes).toHaveProperty('cornerMedium');
      expect(Material3CSSProperties.shapes).toHaveProperty('cornerFull');
      expect(Material3CSSProperties.shapes).toHaveProperty('cornerAsymmetricSmall');
    });

    it('should contain all required elevation properties', () => {
      expect(Material3CSSProperties.elevation).toHaveProperty('level0');
      expect(Material3CSSProperties.elevation).toHaveProperty('level1');
      expect(Material3CSSProperties.elevation).toHaveProperty('level5');
    });

    it('should contain all required motion properties', () => {
      expect(Material3CSSProperties.motion.easing).toHaveProperty('standard');
      expect(Material3CSSProperties.motion.easing).toHaveProperty('emphasized');
      expect(Material3CSSProperties.motion.duration).toHaveProperty('short1');
      expect(Material3CSSProperties.motion.duration).toHaveProperty('medium2');
      expect(Material3CSSProperties.motion.duration).toHaveProperty('long4');
    });

    it('should contain all required font weight properties', () => {
      expect(Material3CSSProperties.fontWeights).toHaveProperty('thin');
      expect(Material3CSSProperties.fontWeights).toHaveProperty('regular');
      expect(Material3CSSProperties.fontWeights).toHaveProperty('medium');
      expect(Material3CSSProperties.fontWeights).toHaveProperty('bold');
      expect(Material3CSSProperties.fontWeights).toHaveProperty('black');
    });

    it('should contain typography scaling properties', () => {
      expect(Material3CSSProperties.typographyScaling).toHaveProperty('scaleFactor');
      expect(Material3CSSProperties.typographyScaling).toHaveProperty('scaleFactorCompact');
      expect(Material3CSSProperties.typographyScaling).toHaveProperty('scaleFactorComfortable');
      expect(Material3CSSProperties.typographyScaling).toHaveProperty('scaleFactorSpacious');
    });
  });

  describe('Enhanced Typography System', () => {
    describe('getResponsiveMaterial3Typography', () => {
      it('should return base typography styles without options', () => {
        const result = getResponsiveMaterial3Typography('headlineLarge');
        
        expect(result).toEqual({
          fontFamily: 'var(--md-sys-typescale-headline-large-font-family)',
          fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)',
          fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
          lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
          letterSpacing: 'var(--md-sys-typescale-headline-large-letter-spacing)',
        });
      });

      it('should enable dynamic scaling when specified', () => {
        const result = getResponsiveMaterial3Typography('bodyLarge', {
          enableDynamicScaling: true,
        });
        
        expect(result.fontSize).toContain('calc(');
        expect(result.fontSize).toContain('var(--md-sys-typescale-scale-factor)');
        expect(result.lineHeight).toContain('calc(');
        expect(result.lineHeight).toContain('var(--md-sys-typescale-scale-factor)');
      });

      it('should handle context configuration', () => {
        const result = getResponsiveMaterial3Typography('titleMedium', {
          context: 'compact',
        });
        
        // Base typography should still be present
        expect(result).toHaveProperty('fontFamily');
        expect(result).toHaveProperty('fontSize');
      });
    });

    describe('getMaterial3ExpressiveTypography', () => {
      it('should return base typography without modifications', () => {
        const result = getMaterial3ExpressiveTypography('bodyLarge');
        
        expect(result).toEqual({
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
          fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
          fontSize: 'var(--md-sys-typescale-body-large-font-size)',
          lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
          letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)',
        });
      });

      it('should apply expressive font weight variations', () => {
        const result = getMaterial3ExpressiveTypography('headlineMedium', 'bold');
        
        expect(result.fontWeight).toBe('var(--md-sys-typescale-font-weight-bold)');
      });

      it('should apply high emphasis styling', () => {
        const result = getMaterial3ExpressiveTypography('titleLarge', undefined, 'high');
        
        expect(result.color).toBe('var(--md-sys-color-primary)');
        expect(result.fontWeight).toBe('var(--md-sys-typescale-font-weight-bold)');
      });

      it('should apply medium emphasis styling', () => {
        const result = getMaterial3ExpressiveTypography('bodyMedium', undefined, 'medium');
        
        expect(result.color).toBe('var(--md-sys-color-on-surface)');
        expect(result.fontWeight).toBe('var(--md-sys-typescale-font-weight-medium)');
      });

      it('should apply low emphasis styling', () => {
        const result = getMaterial3ExpressiveTypography('labelSmall', undefined, 'low');
        
        expect(result.color).toBe('var(--md-sys-color-on-surface-variant)');
        expect(result.fontWeight).toBe('var(--md-sys-typescale-font-weight-regular)');
      });

      it('should combine font weight and emphasis', () => {
        const result = getMaterial3ExpressiveTypography('headlineSmall', 'semi-bold', 'high');
        
        expect(result.color).toBe('var(--md-sys-color-primary)');
        // Emphasis should override the specified weight for consistency
        expect(result.fontWeight).toBe('var(--md-sys-typescale-font-weight-bold)');
      });
    });

    describe('getMaterial3ContextualTypography', () => {
      it('should return comfortable scaling by default', () => {
        const result = getMaterial3ContextualTypography('bodyLarge');
        
        expect(result.fontSize).toContain('* 1');
        expect(result.lineHeight).toContain('* 1');
      });

      it('should apply compact scaling', () => {
        const result = getMaterial3ContextualTypography('headlineLarge', 'compact');
        
        expect(result.fontSize).toContain('* 0.875');
        expect(result.lineHeight).toContain('* 0.875');
      });

      it('should apply spacious scaling', () => {
        const result = getMaterial3ContextualTypography('displaySmall', 'spacious');
        
        expect(result.fontSize).toContain('* 1.125');
        expect(result.lineHeight).toContain('* 1.125');
      });

      it('should maintain base typography properties', () => {
        const result = getMaterial3ContextualTypography('titleMedium', 'compact');
        
        expect(result.fontFamily).toBe('var(--md-sys-typescale-title-medium-font-family)');
        expect(result.fontWeight).toBe('var(--md-sys-typescale-title-medium-font-weight)');
        expect(result.letterSpacing).toBe('var(--md-sys-typescale-title-medium-letter-spacing)');
      });
    });

    describe('getMaterial3AdaptiveTypography', () => {
      it('should return adaptive typography with default breakpoints', () => {
        const result = getMaterial3AdaptiveTypography('headlineMedium');
        
        expect(result).toHaveProperty('base');
        expect(result).toHaveProperty('mobile');
        expect(result).toHaveProperty('tablet');
        expect(result).toHaveProperty('desktop');
        
        // Check base styles
        expect(result.base.fontFamily).toBe('var(--md-sys-typescale-headline-medium-font-family)');
        
        // Check mobile scaling
        expect(result.mobile.fontSize).toContain('* 0.875');
        
        // Check tablet scaling
        expect(result.tablet.fontSize).toContain('* 0.95');
        
        // Check desktop scaling
        expect(result.desktop.fontSize).toContain('* 1.05');
      });

      it('should use custom breakpoint configurations', () => {
        const customBreakpoints = {
          mobile: { scale: 0.8, maxWidth: '480px' },
          tablet: { scale: 0.9, minWidth: '481px', maxWidth: '1024px' },
          desktop: { scale: 1.2, minWidth: '1025px' },
        };
        
        const result = getMaterial3AdaptiveTypography('displayLarge', customBreakpoints);
        
        expect(result.mobile.fontSize).toContain('* 0.8');
        expect(result.tablet.fontSize).toContain('* 0.9');
        expect(result.desktop.fontSize).toContain('* 1.2');
      });

      it('should maintain proportional line height scaling', () => {
        const result = getMaterial3AdaptiveTypography('bodyLarge');
        
        expect(result.mobile.lineHeight).toContain('* 0.875');
        expect(result.tablet.lineHeight).toContain('* 0.95');
        expect(result.desktop.lineHeight).toContain('* 1.05');
      });
    });

    describe('Typography System Integration', () => {
      it('should work with getMaterial3Classes for expressive typography', () => {
        const classes = getMaterial3Classes({
          typography: 'headlineLarge',
          color: 'primary',
        });
        
        expect(classes).toContain('md-typescale-headline-large');
        expect(classes).toContain('md-color-primary');
      });

      it('should integrate with component style generation', () => {
        const componentStyle = getMaterial3ComponentStyle({
          typography: 'titleMedium',
          color: 'onSurface',
          backgroundColor: 'surface',
        });
        
        expect(componentStyle).toHaveProperty('fontFamily');
        expect(componentStyle).toHaveProperty('fontSize');
        expect(componentStyle).toHaveProperty('fontWeight');
        expect(componentStyle).toHaveProperty('lineHeight');
        expect(componentStyle).toHaveProperty('letterSpacing');
        expect(componentStyle).toHaveProperty('color');
        expect(componentStyle).toHaveProperty('backgroundColor');
      });
    });

    describe('Typography Accessibility and Performance', () => {
      it('should maintain accessibility with proper contrast ratios', () => {
        const highEmphasis = getMaterial3ExpressiveTypography('bodyLarge', undefined, 'high');
        const mediumEmphasis = getMaterial3ExpressiveTypography('bodyLarge', undefined, 'medium');
        const lowEmphasis = getMaterial3ExpressiveTypography('bodyLarge', undefined, 'low');
        
        // High emphasis should use primary color
        expect(highEmphasis.color).toBe('var(--md-sys-color-primary)');
        
        // Medium emphasis should use on-surface color
        expect(mediumEmphasis.color).toBe('var(--md-sys-color-on-surface)');
        
        // Low emphasis should use on-surface-variant color
        expect(lowEmphasis.color).toBe('var(--md-sys-color-on-surface-variant)');
      });

      it('should use CSS calc() for performance-optimized scaling', () => {
        const contextual = getMaterial3ContextualTypography('headlineLarge', 'compact');
        const adaptive = getMaterial3AdaptiveTypography('bodyMedium');
        
        // Should use CSS calc() for browser-optimized calculations
        expect(contextual.fontSize).toMatch(/^calc\(/);
        expect(adaptive.mobile.fontSize).toMatch(/^calc\(/);
      });

      it('should preserve letter spacing for optimal readability', () => {
        const expressive = getMaterial3ExpressiveTypography('labelLarge', 'bold');
        const contextual = getMaterial3ContextualTypography('bodySmall', 'spacious');
        
        expect(expressive.letterSpacing).toBe('var(--md-sys-typescale-label-large-letter-spacing)');
        expect(contextual.letterSpacing).toBe('var(--md-sys-typescale-body-small-letter-spacing)');
      });
    });
  });
});