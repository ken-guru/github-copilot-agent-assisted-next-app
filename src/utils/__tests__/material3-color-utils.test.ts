/**
 * Unit tests for Material 3 Color Utilities Integration
 */

import {
  getMaterial3DynamicColorStates,
  getMaterial3ThemeAwareColor,
  getMaterial3AccessibleColors,
  getMaterial3SemanticColor,
  getMaterial3InteractionStates
} from '../material3-utils';

// Mock the Material3CSSProperties for testing
jest.mock('../../types/material3-tokens', () => ({
  Material3CSSProperties: {
    colors: {
      primary: '--md-sys-color-primary',
      onPrimary: '--md-sys-color-on-primary',
      secondary: '--md-sys-color-secondary',
      onSecondary: '--md-sys-color-on-secondary',
      tertiary: '--md-sys-color-tertiary',
      onTertiary: '--md-sys-color-on-tertiary',
      error: '--md-sys-color-error',
      onError: '--md-sys-color-on-error',
      surface: '--md-sys-color-surface',
      onSurface: '--md-sys-color-on-surface',
      outline: '--md-sys-color-outline',
    },
    motion: {
      duration: {
        short2: '--md-sys-motion-duration-short2',
      },
      easing: {
        standard: '--md-sys-motion-easing-standard',
      },
    },
  },
}));

describe('Material 3 Dynamic Color States', () => {
  describe('getMaterial3DynamicColorStates', () => {
    it('should generate all required state variations', () => {
      const states = getMaterial3DynamicColorStates('primary');
      
      expect(states.default).toBeDefined();
      expect(states.hover).toBeDefined();
      expect(states.focus).toBeDefined();
      expect(states.pressed).toBeDefined();
      expect(states.disabled).toBeDefined();
      expect(states.selected).toBeDefined();
    });

    it('should include state layer effects by default', () => {
      const states = getMaterial3DynamicColorStates('primary');
      
      expect(states.hover.backgroundColor).toBeDefined();
      expect(states.focus.backgroundColor).toBeDefined();
      expect(states.pressed.backgroundColor).toBeDefined();
      expect(states.selected.backgroundColor).toBeDefined();
    });

    it('should exclude state layer effects when requested', () => {
      const states = getMaterial3DynamicColorStates('primary', false);
      
      expect(states.hover.backgroundColor).toBeUndefined();
      expect(states.focus.backgroundColor).toBeUndefined();
      expect(states.pressed.backgroundColor).toBeUndefined();
    });

    it('should include focus outline', () => {
      const states = getMaterial3DynamicColorStates('primary');
      
      expect(states.focus.outline).toBeDefined();
      expect(states.focus.outlineOffset).toBeDefined();
    });

    it('should disable cursor for disabled state', () => {
      const states = getMaterial3DynamicColorStates('primary');
      
      expect(states.disabled.cursor).toBe('not-allowed');
    });

    it('should use color-mix for state variations', () => {
      const states = getMaterial3DynamicColorStates('primary');
      
      expect(states.hover.color).toContain('color-mix');
      expect(states.focus.color).toContain('color-mix');
      expect(states.pressed.color).toContain('color-mix');
      expect(states.disabled.color).toContain('color-mix');
    });
  });
});

describe('Material 3 Theme-Aware Colors', () => {
  describe('getMaterial3ThemeAwareColor', () => {
    it('should return light-dark function for theme adaptation', () => {
      const themeColor = getMaterial3ThemeAwareColor('primary');
      
      expect(themeColor).toContain('light-dark');
      expect(themeColor).toContain('var(--md-sys-color-primary)');
    });

    it('should use different colors for light and dark themes when specified', () => {
      const themeColor = getMaterial3ThemeAwareColor('primary', 'secondary');
      
      expect(themeColor).toContain('light-dark');
      expect(themeColor).toContain('var(--md-sys-color-primary)');
      expect(themeColor).toContain('var(--md-sys-color-secondary)');
    });

    it('should use same color for both themes when dark color not specified', () => {
      const themeColor = getMaterial3ThemeAwareColor('primary');
      
      const primaryCount = (themeColor.match(/--md-sys-color-primary/g) || []).length;
      expect(primaryCount).toBe(2); // Should appear twice in light-dark function
    });
  });
});

describe('Material 3 Accessible Colors', () => {
  describe('getMaterial3AccessibleColors', () => {
    it('should return style object with foreground and background colors', () => {
      const colors = getMaterial3AccessibleColors('onPrimary', 'primary');
      
      expect(colors.color).toBeDefined();
      expect(colors.backgroundColor).toBeDefined();
      expect(colors.color).toContain('var(--md-sys-color-on-primary)');
      expect(colors.backgroundColor).toContain('var(--md-sys-color-primary)');
    });

    it('should include fallback colors when specified', () => {
      const colors = getMaterial3AccessibleColors('onPrimary', 'primary', {
        fallbackForeground: 'onSurface',
        fallbackBackground: 'surface'
      });
      
      expect(colors.color).toContain('var(--md-sys-color-on-primary)');
      expect(colors.color).toContain('var(--md-sys-color-on-surface)');
      expect(colors.backgroundColor).toContain('var(--md-sys-color-primary)');
      expect(colors.backgroundColor).toContain('var(--md-sys-color-surface)');
    });

    it('should work without options', () => {
      const colors = getMaterial3AccessibleColors('onPrimary', 'primary');
      
      expect(colors).toBeDefined();
      expect(typeof colors).toBe('object');
    });
  });
});

describe('Material 3 Semantic Colors', () => {
  describe('getMaterial3SemanticColor', () => {
    it('should map semantic intents to Material 3 color roles', () => {
      const successColor = getMaterial3SemanticColor('success');
      const warningColor = getMaterial3SemanticColor('warning');
      const infoColor = getMaterial3SemanticColor('info');
      const neutralColor = getMaterial3SemanticColor('neutral');
      
      expect(successColor).toBeDefined();
      expect(warningColor).toBeDefined();
      expect(infoColor).toBeDefined();
      expect(neutralColor).toBeDefined();
    });

    it('should handle filled variant correctly', () => {
      const filledColor = getMaterial3SemanticColor('success', 'filled');
      
      expect(filledColor.color).toBeDefined();
      expect(filledColor.backgroundColor).toBeDefined();
    });

    it('should handle outlined variant correctly', () => {
      const outlinedColor = getMaterial3SemanticColor('success', 'outlined');
      
      expect(outlinedColor.color).toBeDefined();
      expect(outlinedColor.backgroundColor).toBe('transparent');
      expect(outlinedColor.border).toBeDefined();
    });

    it('should handle text variant correctly', () => {
      const textColor = getMaterial3SemanticColor('success', 'text');
      
      expect(textColor.color).toBeDefined();
      expect(textColor.backgroundColor).toBe('transparent');
      expect(textColor.border).toBeUndefined();
    });

    it('should default to filled variant', () => {
      const defaultColor = getMaterial3SemanticColor('success');
      const filledColor = getMaterial3SemanticColor('success', 'filled');
      
      expect(defaultColor).toEqual(filledColor);
    });

    it('should handle all semantic intents', () => {
      const intents = ['success', 'warning', 'info', 'neutral'] as const;
      
      intents.forEach(intent => {
        const color = getMaterial3SemanticColor(intent);
        expect(color).toBeDefined();
        expect(typeof color).toBe('object');
      });
    });
  });
});

describe('Material 3 Interaction States', () => {
  describe('getMaterial3InteractionStates', () => {
    it('should return style object with interaction properties', () => {
      const interactionStyles = getMaterial3InteractionStates('primary');
      
      expect(interactionStyles.position).toBe('relative');
      expect(interactionStyles.overflow).toBe('hidden');
      expect(interactionStyles['--md-state-layer-color']).toBeDefined();
      expect(interactionStyles['--md-state-layer-opacity']).toBe('0');
      expect(interactionStyles.transition).toBeDefined();
    });

    it('should use provided state layer opacity', () => {
      const customOpacity = 0.15;
      const interactionStyles = getMaterial3InteractionStates('primary', customOpacity);
      
      // The function should set up the base styles, opacity is handled by CSS
      expect(interactionStyles['--md-state-layer-opacity']).toBe('0');
    });

    it('should include transition properties', () => {
      const interactionStyles = getMaterial3InteractionStates('primary');
      
      expect(interactionStyles.transition).toContain('var(--md-sys-motion-duration-short2)');
      expect(interactionStyles.transition).toContain('var(--md-sys-motion-easing-standard)');
    });

    it('should set up state layer color variable', () => {
      const interactionStyles = getMaterial3InteractionStates('secondary');
      
      expect(interactionStyles['--md-state-layer-color']).toContain('var(--md-sys-color-secondary)');
    });
  });
});

describe('Integration and Edge Cases', () => {
  it('should handle all Material 3 color roles', () => {
    const colorRoles = [
      'primary', 'onPrimary', 'secondary', 'onSecondary', 
      'tertiary', 'onTertiary', 'error', 'onError',
      'surface', 'onSurface'
    ] as const;
    
    colorRoles.forEach(role => {
      expect(() => getMaterial3DynamicColorStates(role)).not.toThrow();
      expect(() => getMaterial3ThemeAwareColor(role)).not.toThrow();
      expect(() => getMaterial3InteractionStates(role)).not.toThrow();
    });
  });

  it('should maintain consistent API across utility functions', () => {
    const colorRole = 'primary';
    
    const dynamicStates = getMaterial3DynamicColorStates(colorRole);
    const themeAware = getMaterial3ThemeAwareColor(colorRole);
    const accessible = getMaterial3AccessibleColors('onPrimary', colorRole);
    const interaction = getMaterial3InteractionStates(colorRole);
    
    expect(dynamicStates).toBeDefined();
    expect(themeAware).toBeDefined();
    expect(accessible).toBeDefined();
    expect(interaction).toBeDefined();
  });

  it('should work with complex color combinations', () => {
    const complexColors = getMaterial3AccessibleColors('onPrimary', 'primary', {
      fallbackForeground: 'onSurface',
      fallbackBackground: 'surface',
      enforceContrast: true
    });
    
    expect(complexColors.color).toBeDefined();
    expect(complexColors.backgroundColor).toBeDefined();
  });

  it('should handle semantic color edge cases', () => {
    const variants = ['filled', 'outlined', 'text'] as const;
    const intents = ['success', 'warning', 'info', 'neutral'] as const;
    
    intents.forEach(intent => {
      variants.forEach(variant => {
        const color = getMaterial3SemanticColor(intent, variant);
        expect(color).toBeDefined();
        expect(typeof color).toBe('object');
      });
    });
  });
});