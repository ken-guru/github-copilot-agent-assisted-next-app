/**
 * Tests for Material 3 Expressive Shape and Elevation Utilities
 */

import {
  getMaterial3OrganicShape,
  getMaterial3ContextualElevation,
  getMaterial3ExpressiveContainer,
  getMaterial3ResponsiveShape,
  getMaterial3OrganicElevation,
  getMaterial3InteractiveElevation,
  getMaterial3ResponsiveShapeBreakpoints,
  getMaterial3ShapeClasses,
  getMaterial3ElevationClasses,
} from '../material3-utils';

describe('Material 3 Shape and Elevation Utilities', () => {
  describe('getMaterial3OrganicShape', () => {
    it('returns correct shape styles for button components', () => {
      const primaryButton = getMaterial3OrganicShape('button', 'primary');
      expect(primaryButton).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-button-primary)',
      });

      const organicButton = getMaterial3OrganicShape('button', 'organic');
      expect(organicButton).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-pill-medium)',
      });

      const asymmetricButton = getMaterial3OrganicShape('button', 'asymmetric');
      expect(asymmetricButton).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-asymmetric-medium)',
      });
    });

    it('returns correct shape styles for card components', () => {
      const primaryCard = getMaterial3OrganicShape('card', 'primary');
      expect(primaryCard).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-card-elevated)',
      });

      const organicCard = getMaterial3OrganicShape('card', 'organic');
      expect(organicCard).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-medium-top)',
      });

      const asymmetricCard = getMaterial3OrganicShape('card', 'asymmetric');
      expect(asymmetricCard).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-asymmetric-large)',
      });
    });

    it('returns correct shape styles for field components', () => {
      const primaryField = getMaterial3OrganicShape('field', 'primary');
      expect(primaryField).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-field-outlined)',
      });

      const organicField = getMaterial3OrganicShape('field', 'organic');
      expect(organicField).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-extra-small-top)',
      });
    });

    it('returns correct shape styles for navigation components', () => {
      const primaryNavigation = getMaterial3OrganicShape('navigation', 'primary');
      expect(primaryNavigation).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-navigation-item)',
      });

      const organicNavigation = getMaterial3OrganicShape('navigation', 'organic');
      expect(organicNavigation).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-pill-large)',
      });
    });

    it('returns correct shape styles for activity components', () => {
      const primaryActivity = getMaterial3OrganicShape('activity', 'primary');
      expect(primaryActivity).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-activity-card)',
      });

      const organicActivity = getMaterial3OrganicShape('activity', 'organic');
      expect(organicActivity).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-medium-top)',
      });
    });

    it('returns correct shape styles for timer components', () => {
      const primaryTimer = getMaterial3OrganicShape('timer', 'primary');
      expect(primaryTimer).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-timer-container)',
      });

      const asymmetricTimer = getMaterial3OrganicShape('timer', 'asymmetric');
      expect(asymmetricTimer).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-asymmetric-large)',
      });
    });

    it('returns correct shape styles for summary components', () => {
      const primarySummary = getMaterial3OrganicShape('summary', 'primary');
      expect(primarySummary).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-summary-card)',
      });

      const organicSummary = getMaterial3OrganicShape('summary', 'organic');
      expect(organicSummary).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-small-top)',
      });
    });

    it('returns correct shape styles for chip components', () => {
      const primaryChip = getMaterial3OrganicShape('chip', 'primary');
      expect(primaryChip).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-chip)',
      });

      const organicChip = getMaterial3OrganicShape('chip', 'organic');
      expect(organicChip).toEqual({
        borderRadius: 'var(--md-sys-shape-corner-pill-medium)',
      });
    });

    it('defaults to primary variant when not specified', () => {
      const defaultButton = getMaterial3OrganicShape('button');
      const primaryButton = getMaterial3OrganicShape('button', 'primary');
      expect(defaultButton).toEqual(primaryButton);
    });
  });

  describe('getMaterial3ContextualElevation', () => {
    it('returns correct elevation styles for card components', () => {
      const restingCard = getMaterial3ContextualElevation('card', 'resting');
      expect(restingCard).toEqual({
        boxShadow: 'var(--md-sys-elevation-card-resting)',
      });

      const hoverCard = getMaterial3ContextualElevation('card', 'hover');
      expect(hoverCard).toEqual({
        boxShadow: 'var(--md-sys-elevation-card-hover)',
      });

      const pressedCard = getMaterial3ContextualElevation('card', 'pressed');
      expect(pressedCard).toEqual({
        boxShadow: 'var(--md-sys-elevation-card-pressed)',
      });

      const draggedCard = getMaterial3ContextualElevation('card', 'dragged');
      expect(draggedCard).toEqual({
        boxShadow: 'var(--md-sys-elevation-card-dragged)',
      });
    });

    it('returns correct elevation styles for button components', () => {
      const restingButton = getMaterial3ContextualElevation('button', 'resting');
      expect(restingButton).toEqual({
        boxShadow: 'var(--md-sys-elevation-button-resting)',
      });

      const hoverButton = getMaterial3ContextualElevation('button', 'hover');
      expect(hoverButton).toEqual({
        boxShadow: 'var(--md-sys-elevation-button-hover)',
      });
    });

    it('returns correct elevation styles for fab components', () => {
      const restingFab = getMaterial3ContextualElevation('fab', 'resting');
      expect(restingFab).toEqual({
        boxShadow: 'var(--md-sys-elevation-fab-resting)',
      });

      const hoverFab = getMaterial3ContextualElevation('fab', 'hover');
      expect(hoverFab).toEqual({
        boxShadow: 'var(--md-sys-elevation-fab-hover)',
      });
    });

    it('returns correct elevation styles for navigation components', () => {
      const restingNavigation = getMaterial3ContextualElevation('navigation', 'resting');
      expect(restingNavigation).toEqual({
        boxShadow: 'var(--md-sys-elevation-navigation-rail)',
      });

      const hoverNavigation = getMaterial3ContextualElevation('navigation', 'hover');
      expect(hoverNavigation).toEqual({
        boxShadow: 'var(--md-sys-elevation-navigation-bar)',
      });
    });

    it('returns correct elevation styles for dialog components', () => {
      const dialog = getMaterial3ContextualElevation('dialog', 'resting');
      expect(dialog).toEqual({
        boxShadow: 'var(--md-sys-elevation-dialog)',
      });
    });

    it('returns correct elevation styles for menu components', () => {
      const menu = getMaterial3ContextualElevation('menu', 'resting');
      expect(menu).toEqual({
        boxShadow: 'var(--md-sys-elevation-menu)',
      });
    });

    it('returns correct elevation styles for tooltip components', () => {
      const tooltip = getMaterial3ContextualElevation('tooltip', 'resting');
      expect(tooltip).toEqual({
        boxShadow: 'var(--md-sys-elevation-tooltip)',
      });
    });

    it('returns correct elevation styles for snackbar components', () => {
      const snackbar = getMaterial3ContextualElevation('snackbar', 'resting');
      expect(snackbar).toEqual({
        boxShadow: 'var(--md-sys-elevation-snackbar)',
      });
    });

    it('defaults to resting state when not specified', () => {
      const defaultCard = getMaterial3ContextualElevation('card');
      const restingCard = getMaterial3ContextualElevation('card', 'resting');
      expect(defaultCard).toEqual(restingCard);
    });
  });

  describe('getMaterial3ResponsiveShape', () => {
    it('returns responsive shape styles with context scaling', () => {
      const compactShape = getMaterial3ResponsiveShape('cornerMedium', 'compact');
      expect(compactShape).toEqual({
        borderRadius: 'calc(var(--md-sys-shape-corner-medium) * var(--md-sys-shape-scale-factor-compact))',
      });

      const comfortableShape = getMaterial3ResponsiveShape('cornerMedium', 'comfortable');
      expect(comfortableShape).toEqual({
        borderRadius: 'calc(var(--md-sys-shape-corner-medium) * var(--md-sys-shape-scale-factor-comfortable))',
      });

      const spaciousShape = getMaterial3ResponsiveShape('cornerMedium', 'spacious');
      expect(spaciousShape).toEqual({
        borderRadius: 'calc(var(--md-sys-shape-corner-medium) * var(--md-sys-shape-scale-factor-spacious))',
      });
    });

    it('defaults to comfortable context when not specified', () => {
      const defaultShape = getMaterial3ResponsiveShape('cornerMedium');
      const comfortableShape = getMaterial3ResponsiveShape('cornerMedium', 'comfortable');
      expect(defaultShape).toEqual(comfortableShape);
    });
  });

  describe('getMaterial3OrganicElevation', () => {
    it('returns organic elevation styles for different intensities', () => {
      const subtleElevation = getMaterial3OrganicElevation('subtle');
      expect(subtleElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-organic-subtle)',
      });

      const moderateElevation = getMaterial3OrganicElevation('moderate');
      expect(moderateElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-organic-moderate)',
      });

      const pronouncedElevation = getMaterial3OrganicElevation('pronounced');
      expect(pronouncedElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-organic-pronounced)',
      });
    });

    it('returns directional elevation styles when direction is specified', () => {
      const topElevation = getMaterial3OrganicElevation('moderate', 'top');
      expect(topElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-directional-top)',
      });

      const bottomElevation = getMaterial3OrganicElevation('moderate', 'bottom');
      expect(bottomElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-directional-bottom)',
      });

      const leftElevation = getMaterial3OrganicElevation('moderate', 'left');
      expect(leftElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-directional-left)',
      });

      const rightElevation = getMaterial3OrganicElevation('moderate', 'right');
      expect(rightElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-directional-right)',
      });
    });

    it('defaults to moderate intensity when not specified', () => {
      const defaultElevation = getMaterial3OrganicElevation();
      const moderateElevation = getMaterial3OrganicElevation('moderate');
      expect(defaultElevation).toEqual(moderateElevation);
    });
  });

  describe('getMaterial3InteractiveElevation', () => {
    it('returns interactive elevation styles with transitions', () => {
      const interactiveElevation = getMaterial3InteractiveElevation();
      expect(interactiveElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-level1)',
        transition: 'box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
        '&:hover': {
          boxShadow: 'var(--md-sys-elevation-level2)',
        },
        '&:active': {
          boxShadow: 'var(--md-sys-elevation-level0)',
        },
      });
    });

    it('accepts custom elevation levels', () => {
      const customInteractiveElevation = getMaterial3InteractiveElevation('level2', 'level3', 'level1');
      expect(customInteractiveElevation).toEqual({
        boxShadow: 'var(--md-sys-elevation-level2)',
        transition: 'box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
        '&:hover': {
          boxShadow: 'var(--md-sys-elevation-level3)',
        },
        '&:active': {
          boxShadow: 'var(--md-sys-elevation-level1)',
        },
      });
    });
  });

  describe('getMaterial3ExpressiveContainer', () => {
    it('returns combined shape and elevation styles for components', () => {
      const cardContainer = getMaterial3ExpressiveContainer({
        componentType: 'card',
        shapeVariant: 'primary',
        elevationState: 'resting',
        responsive: false,
        context: 'comfortable',
        interactive: false,
      });

      expect(cardContainer).toEqual(
        expect.objectContaining({
          borderRadius: 'var(--md-sys-shape-corner-card-elevated)',
          boxShadow: 'var(--md-sys-elevation-card-resting)',
        })
      );
    });

    it('applies responsive scaling when enabled', () => {
      const responsiveContainer = getMaterial3ExpressiveContainer({
        componentType: 'button',
        shapeVariant: 'primary',
        elevationState: 'resting',
        responsive: true,
        context: 'spacious',
        interactive: false,
      });

      expect(responsiveContainer).toEqual(
        expect.objectContaining({
          borderRadius: 'calc(var(--md-sys-shape-corner-button-primary) * var(--md-sys-shape-scale-factor-spacious))',
        })
      );
    });

    it('applies interactive transitions when enabled', () => {
      const interactiveContainer = getMaterial3ExpressiveContainer({
        componentType: 'card',
        shapeVariant: 'primary',
        elevationState: 'resting',
        responsive: false,
        context: 'comfortable',
        interactive: true,
      });

      expect(interactiveContainer).toEqual(
        expect.objectContaining({
          transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
        })
      );
    });

    it('handles field and chip components with no elevation', () => {
      const fieldContainer = getMaterial3ExpressiveContainer({
        componentType: 'field',
        shapeVariant: 'primary',
        elevationState: 'resting',
        responsive: false,
        context: 'comfortable',
        interactive: false,
      });

      expect(fieldContainer).toEqual(
        expect.objectContaining({
          borderRadius: 'var(--md-sys-shape-corner-field-outlined)',
          boxShadow: 'var(--md-sys-elevation-level0)',
        })
      );

      const chipContainer = getMaterial3ExpressiveContainer({
        componentType: 'chip',
        shapeVariant: 'primary',
        elevationState: 'resting',
        responsive: false,
        context: 'comfortable',
        interactive: false,
      });

      expect(chipContainer).toEqual(
        expect.objectContaining({
          borderRadius: 'var(--md-sys-shape-corner-chip)',
          boxShadow: 'var(--md-sys-elevation-level0)',
        })
      );
    });

    it('maps activity, timer, and summary components to card elevation', () => {
      const activityContainer = getMaterial3ExpressiveContainer({
        componentType: 'activity',
        shapeVariant: 'primary',
        elevationState: 'hover',
        responsive: false,
        context: 'comfortable',
        interactive: false,
      });

      expect(activityContainer).toEqual(
        expect.objectContaining({
          borderRadius: 'var(--md-sys-shape-corner-activity-card)',
          boxShadow: 'var(--md-sys-elevation-card-hover)',
        })
      );
    });

    it('uses default values when options are not specified', () => {
      const defaultContainer = getMaterial3ExpressiveContainer({
        componentType: 'card',
      });

      expect(defaultContainer).toEqual(
        expect.objectContaining({
          borderRadius: 'calc(var(--md-sys-shape-corner-card-elevated) * var(--md-sys-shape-scale-factor-comfortable))',
          boxShadow: 'var(--md-sys-elevation-card-resting)',
        })
      );
    });
  });

  describe('getMaterial3ResponsiveShapeBreakpoints', () => {
    it('returns responsive shape styles for different breakpoints', () => {
      const responsiveShapes = getMaterial3ResponsiveShapeBreakpoints({
        base: 'cornerMedium',
        mobile: 'cornerSmall',
        tablet: 'cornerMedium',
        desktop: 'cornerLarge',
      });

      expect(responsiveShapes).toEqual({
        base: { borderRadius: 'var(--md-sys-shape-corner-medium)' },
        mobile: { borderRadius: 'var(--md-sys-shape-corner-small)' },
        tablet: { borderRadius: 'var(--md-sys-shape-corner-medium)' },
        desktop: { borderRadius: 'var(--md-sys-shape-corner-large)' },
      });
    });

    it('only includes specified breakpoints', () => {
      const responsiveShapes = getMaterial3ResponsiveShapeBreakpoints({
        base: 'cornerMedium',
        mobile: 'cornerSmall',
      });

      expect(responsiveShapes).toEqual({
        base: { borderRadius: 'var(--md-sys-shape-corner-medium)' },
        mobile: { borderRadius: 'var(--md-sys-shape-corner-small)' },
      });
      expect(responsiveShapes.tablet).toBeUndefined();
      expect(responsiveShapes.desktop).toBeUndefined();
    });
  });

  describe('getMaterial3ShapeClasses', () => {
    it('generates CSS class names for shape variants', () => {
      const buttonShapeClasses = getMaterial3ShapeClasses('button', ['primary', 'secondary', 'organic']);
      
      expect(buttonShapeClasses).toEqual({
        primary: 'md-shape-button-primary',
        secondary: 'md-shape-button-secondary',
        organic: 'md-shape-button-organic',
      });
    });

    it('defaults to primary variant when variants not specified', () => {
      const cardShapeClasses = getMaterial3ShapeClasses('card');
      
      expect(cardShapeClasses).toEqual({
        primary: 'md-shape-card-primary',
      });
    });

    it('handles all component types correctly', () => {
      const componentTypes = ['button', 'card', 'field', 'navigation', 'activity', 'timer', 'summary', 'chip'] as const;
      
      componentTypes.forEach(componentType => {
        const classes = getMaterial3ShapeClasses(componentType, ['primary']);
        expect(classes.primary).toBe(`md-shape-${componentType}-primary`);
      });
    });
  });

  describe('getMaterial3ElevationClasses', () => {
    it('generates CSS class names for elevation states', () => {
      const cardElevationClasses = getMaterial3ElevationClasses('card', ['resting', 'hover', 'pressed']);
      
      expect(cardElevationClasses).toEqual({
        resting: 'md-elevation-card-resting',
        hover: 'md-elevation-card-hover',
        pressed: 'md-elevation-card-pressed',
      });
    });

    it('defaults to resting state when states not specified', () => {
      const buttonElevationClasses = getMaterial3ElevationClasses('button');
      
      expect(buttonElevationClasses).toEqual({
        resting: 'md-elevation-button-resting',
      });
    });

    it('handles all component types correctly', () => {
      const componentTypes = ['card', 'button', 'fab', 'navigation', 'dialog', 'menu', 'tooltip', 'snackbar'] as const;
      
      componentTypes.forEach(componentType => {
        const classes = getMaterial3ElevationClasses(componentType, ['resting']);
        expect(classes.resting).toBe(`md-elevation-${componentType}-resting`);
      });
    });
  });
});