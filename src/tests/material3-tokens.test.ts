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
  getMaterial3TextFieldStyle
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
  });
});