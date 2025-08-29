/**
 * Material 3 Design System Tests
 * 
 * Basic test file to verify design tokens are properly loaded and accessible.
 * This file can be used for development testing and validation.
 */

import { describe, test, expect } from '@jest/globals';

describe('Material 3 Design System', () => {
  test('should load design tokens in DOM environment', () => {
    // Create a test element
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    
    // Apply Material 3 classes
    testElement.className = 'm3-title-large m3-bg-primary m3-shape-medium m3-elevation-2';
    
    // Get computed styles
    const computedStyle = window.getComputedStyle(testElement);
    
    // Test typography token is applied
    expect(computedStyle.fontWeight).toBe('500');
    expect(computedStyle.fontSize).toBe('22px');
    expect(computedStyle.lineHeight).toBe('28px');
    
    // Test that CSS custom properties are available
    const rootStyle = window.getComputedStyle(document.documentElement);
    
    // Check typography tokens
    expect(rootStyle.getPropertyValue('--m3-typescale-title-large-size')).toBe('22px');
    expect(rootStyle.getPropertyValue('--m3-typescale-title-large-weight')).toBe('500');
    
    // Check color tokens
    expect(rootStyle.getPropertyValue('--m3-color-primary')).toBeTruthy();
    expect(rootStyle.getPropertyValue('--m3-color-surface')).toBeTruthy();
    
    // Check shape tokens
    expect(rootStyle.getPropertyValue('--m3-shape-corner-medium')).toBe('12px');
    
    // Check motion tokens
    expect(rootStyle.getPropertyValue('--m3-motion-duration-medium2')).toBe('300ms');
    expect(rootStyle.getPropertyValue('--m3-motion-easing-standard')).toBe('cubic-bezier(0.2, 0.0, 0, 1.0)');
    
    // Check elevation tokens
    expect(rootStyle.getPropertyValue('--m3-elevation-level2')).toBeTruthy();
    
    // Clean up
    document.body.removeChild(testElement);
  });
  
  test('should have responsive typography tokens', () => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    
    // Test that all typography scale tokens exist
    const typographyTokens = [
      '--m3-typescale-display-large-size',
      '--m3-typescale-display-medium-size',
      '--m3-typescale-display-small-size',
      '--m3-typescale-headline-large-size',
      '--m3-typescale-headline-medium-size',
      '--m3-typescale-headline-small-size',
      '--m3-typescale-title-large-size',
      '--m3-typescale-title-medium-size',
      '--m3-typescale-title-small-size',
      '--m3-typescale-body-large-size',
      '--m3-typescale-body-medium-size',
      '--m3-typescale-body-small-size',
      '--m3-typescale-label-large-size',
      '--m3-typescale-label-medium-size',
      '--m3-typescale-label-small-size'
    ];
    
    typographyTokens.forEach(token => {
      expect(rootStyle.getPropertyValue(token)).toBeTruthy();
    });
  });
  
  test('should have complete color system', () => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    
    // Test semantic color roles
    const colorRoles = [
      '--m3-color-primary',
      '--m3-color-on-primary',
      '--m3-color-primary-container',
      '--m3-color-on-primary-container',
      '--m3-color-secondary',
      '--m3-color-on-secondary',
      '--m3-color-secondary-container',
      '--m3-color-on-secondary-container',
      '--m3-color-tertiary',
      '--m3-color-on-tertiary',
      '--m3-color-tertiary-container',
      '--m3-color-on-tertiary-container',
      '--m3-color-error',
      '--m3-color-on-error',
      '--m3-color-error-container',
      '--m3-color-on-error-container',
      '--m3-color-surface',
      '--m3-color-on-surface',
      '--m3-color-surface-variant',
      '--m3-color-on-surface-variant',
      '--m3-color-background',
      '--m3-color-on-background'
    ];
    
    colorRoles.forEach(role => {
      expect(rootStyle.getPropertyValue(role)).toBeTruthy();
    });
  });
  
  test('should have shape and elevation tokens', () => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    
    // Test shape tokens
    const shapeTokens = [
      '--m3-shape-corner-none',
      '--m3-shape-corner-extra-small',
      '--m3-shape-corner-small',
      '--m3-shape-corner-medium',
      '--m3-shape-corner-large',
      '--m3-shape-corner-extra-large',
      '--m3-shape-corner-full'
    ];
    
    shapeTokens.forEach(token => {
      expect(rootStyle.getPropertyValue(token)).toBeTruthy();
    });
    
    // Test elevation tokens
    const elevationTokens = [
      '--m3-elevation-level0',
      '--m3-elevation-level1',
      '--m3-elevation-level2',
      '--m3-elevation-level3',
      '--m3-elevation-level4',
      '--m3-elevation-level5'
    ];
    
    elevationTokens.forEach(token => {
      expect(rootStyle.getPropertyValue(token)).toBeTruthy();
    });
  });
  
  test('should have motion tokens', () => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    
    // Test easing tokens
    const easingTokens = [
      '--m3-motion-easing-standard',
      '--m3-motion-easing-emphasized',
      '--m3-motion-easing-decelerated',
      '--m3-motion-easing-accelerated'
    ];
    
    easingTokens.forEach(token => {
      expect(rootStyle.getPropertyValue(token)).toBeTruthy();
    });
    
    // Test duration tokens
    const durationTokens = [
      '--m3-motion-duration-short1',
      '--m3-motion-duration-short2',
      '--m3-motion-duration-medium1',
      '--m3-motion-duration-medium2',
      '--m3-motion-duration-long1',
      '--m3-motion-duration-long2'
    ];
    
    durationTokens.forEach(token => {
      expect(rootStyle.getPropertyValue(token)).toBeTruthy();
    });
  });
});