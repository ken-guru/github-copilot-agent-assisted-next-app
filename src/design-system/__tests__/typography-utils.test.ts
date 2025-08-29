/**
 * Typography Utilities Tests
 * 
 * Unit tests for the Material 3 typography utility functions.
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  getTypographyClass,
  getExpressiveTypographyClass,
  getSemanticTypographyClass,
  getStatusTextClass,
  applyTypographyConfig,
  isValidTypographyScale,
  TYPOGRAPHY_SCALES,
  SEMANTIC_CLASSES,
  type TypographyConfig
} from '../typography-utils';

// Mock DOM environment
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: string) => {
      const mockValues: Record<string, string> = {
        '--m3-typescale-headline-large-font': '400 32px/40px Roboto',
        '--m3-typescale-headline-large-weight': '400',
        '--m3-typescale-headline-large-size': '32px',
        '--m3-typescale-headline-large-line-height': '40px',
        '--m3-typescale-headline-large-tracking': '0px',
      };
      return mockValues[prop] || '';
    }
  })
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: jest.fn()
    }
  },
  writable: true
});

describe('Typography Utilities', () => {
  let testElement: HTMLElement;

  beforeEach(() => {
    testElement = document.createElement('div');
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    if (testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe('getTypographyClass', () => {
    test('should return correct class name for typography scale', () => {
      expect(getTypographyClass('headline-large')).toBe('m3-headline-large');
      expect(getTypographyClass('body-medium')).toBe('m3-body-medium');
      expect(getTypographyClass('label-small')).toBe('m3-label-small');
    });
  });

  describe('getExpressiveTypographyClass', () => {
    test('should return expressive variant class name', () => {
      expect(getExpressiveTypographyClass('display-large')).toBe('m3-display-large-expressive');
      expect(getExpressiveTypographyClass('headline-large')).toBe('m3-headline-large-expressive');
      expect(getExpressiveTypographyClass('title-large')).toBe('m3-title-large-expressive');
      expect(getExpressiveTypographyClass('body-large')).toBe('m3-body-large-expressive');
    });
  });

  describe('getSemanticTypographyClass', () => {
    test('should return semantic class name', () => {
      expect(getSemanticTypographyClass('page-title')).toBe('m3-page-title');
      expect(getSemanticTypographyClass('card-title')).toBe('m3-card-title');
      expect(getSemanticTypographyClass('button-text')).toBe('m3-button-text');
    });
  });

  describe('getStatusTextClass', () => {
    test('should return status text class name', () => {
      expect(getStatusTextClass('error')).toBe('m3-error-text');
      expect(getStatusTextClass('success')).toBe('m3-success-text');
      expect(getStatusTextClass('warning')).toBe('m3-warning-text');
      expect(getStatusTextClass('info')).toBe('m3-info-text');
    });
  });

  describe('applyTypographyConfig', () => {
    test('should apply basic typography configuration', () => {
      const config: TypographyConfig = {
        scale: 'headline-large',
        align: 'center',
        weight: 'bold'
      };

      applyTypographyConfig(testElement, config);

      expect(testElement.classList.contains('m3-headline-large')).toBe(true);
      expect(testElement.classList.contains('m3-text-center')).toBe(true);
      expect(testElement.classList.contains('m3-font-bold')).toBe(true);
    });

    test('should apply expressive variant when specified', () => {
      const config: TypographyConfig = {
        scale: 'headline-large',
        expressive: true
      };

      applyTypographyConfig(testElement, config);

      expect(testElement.classList.contains('m3-headline-large-expressive')).toBe(true);
    });

    test('should apply semantic class when specified', () => {
      const config: TypographyConfig = {
        scale: 'headline-large',
        semantic: 'page-title'
      };

      applyTypographyConfig(testElement, config);

      expect(testElement.classList.contains('m3-headline-large')).toBe(true);
      expect(testElement.classList.contains('m3-page-title')).toBe(true);
    });

    test('should apply text utilities', () => {
      const config: TypographyConfig = {
        scale: 'body-medium',
        transform: 'uppercase',
        decoration: 'underline',
        overflow: 'truncate'
      };

      applyTypographyConfig(testElement, config);

      expect(testElement.classList.contains('m3-body-medium')).toBe(true);
      expect(testElement.classList.contains('m3-text-uppercase')).toBe(true);
      expect(testElement.classList.contains('m3-underline')).toBe(true);
      expect(testElement.classList.contains('m3-truncate')).toBe(true);
    });

    test('should apply custom color', () => {
      const config: TypographyConfig = {
        scale: 'body-medium',
        color: '#ff0000'
      };

      applyTypographyConfig(testElement, config);

      // Browser converts hex to rgb format
      expect(testElement.style.color).toBe('rgb(255, 0, 0)');
    });
  });

  describe('isValidTypographyScale', () => {
    test('should validate typography scales correctly', () => {
      expect(isValidTypographyScale('headline-large')).toBe(true);
      expect(isValidTypographyScale('body-medium')).toBe(true);
      expect(isValidTypographyScale('label-small')).toBe(true);
      expect(isValidTypographyScale('invalid-scale')).toBe(false);
      expect(isValidTypographyScale('')).toBe(false);
    });
  });

  describe('Typography Constants', () => {
    test('TYPOGRAPHY_SCALES should contain all scale categories', () => {
      expect(TYPOGRAPHY_SCALES.DISPLAY).toEqual(['display-large', 'display-medium', 'display-small']);
      expect(TYPOGRAPHY_SCALES.HEADLINE).toEqual(['headline-large', 'headline-medium', 'headline-small']);
      expect(TYPOGRAPHY_SCALES.TITLE).toEqual(['title-large', 'title-medium', 'title-small']);
      expect(TYPOGRAPHY_SCALES.BODY).toEqual(['body-large', 'body-medium', 'body-small']);
      expect(TYPOGRAPHY_SCALES.LABEL).toEqual(['label-large', 'label-medium', 'label-small']);
    });

    test('SEMANTIC_CLASSES should contain all semantic categories', () => {
      expect(SEMANTIC_CLASSES.HEADERS).toEqual(['page-title', 'section-title', 'subsection-title']);
      expect(SEMANTIC_CLASSES.COMPONENTS).toEqual(['card-title', 'card-subtitle', 'component-title']);
      expect(SEMANTIC_CLASSES.CONTENT).toEqual(['paragraph', 'caption', 'helper-text']);
      expect(SEMANTIC_CLASSES.INTERACTIVE).toEqual(['button-text', 'form-label', 'input-label']);
      expect(SEMANTIC_CLASSES.STATUS).toEqual(['error-text', 'success-text', 'warning-text', 'info-text']);
    });
  });
});