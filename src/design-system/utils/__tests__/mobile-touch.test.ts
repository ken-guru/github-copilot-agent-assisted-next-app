/**
 * @jest-environment jsdom
 */

import { createRippleEffect, isTouchDevice, getTouchTargetSize } from '../mobile-touch';

// Mock window properties for testing
const mockTouchDevice = () => {
  Object.defineProperty(window, 'ontouchstart', {
    value: {},
    writable: true,
    configurable: true
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: 5,
    writable: true,
    configurable: true
  });
};

const mockNonTouchDevice = () => {
  Object.defineProperty(window, 'ontouchstart', {
    value: undefined,
    writable: true,
    configurable: true
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: 0,
    writable: true,
    configurable: true
  });
  delete (window as Window & { ontouchstart?: unknown }).ontouchstart;
};

describe('Mobile Touch Utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('isTouchDevice', () => {
    it('should detect touch devices correctly', () => {
      mockTouchDevice();
      expect(isTouchDevice()).toBe(true);
    });

    it('should detect non-touch devices correctly', () => {
      mockNonTouchDevice();
      expect(isTouchDevice()).toBe(false);
    });
  });

  describe('getTouchTargetSize', () => {
    it('should return correct sizes for different button sizes', () => {
      const small = getTouchTargetSize('small');
      expect(small.minHeight).toBe('40px');
      expect(small.minWidth).toBe('40px');

      const medium = getTouchTargetSize('medium');
      expect(medium.minHeight).toBe('48px');
      expect(medium.minWidth).toBe('48px');

      const large = getTouchTargetSize('large');
      expect(large.minHeight).toBe('56px');
      expect(large.minWidth).toBe('56px');
    });
  });

  describe('createRippleEffect', () => {
    it('should create ripple element on button click', () => {
      const button = document.createElement('button');
      button.style.position = 'relative';
      button.style.width = '100px';
      button.style.height = '40px';
      container.appendChild(button);

      const mockEvent = new MouseEvent('click', {
        clientX: 50,
        clientY: 20,
        bubbles: true
      });

      // Mock getBoundingClientRect
      button.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
        right: 100,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }));

      createRippleEffect(button, mockEvent);

      // Check if ripple element was created
      const ripple = button.querySelector('.material3-ripple');
      expect(ripple).toBeTruthy();
      expect(ripple).toHaveStyle('position: absolute');
      expect(ripple).toHaveStyle('border-radius: 50%');
    });

    it('should not create multiple ripples simultaneously', () => {
      const button = document.createElement('button');
      button.style.position = 'relative';
      container.appendChild(button);

      button.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
        right: 100,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }));

      const mockEvent = new MouseEvent('click', {
        clientX: 50,
        clientY: 20,
        bubbles: true
      });

      // Create first ripple
      createRippleEffect(button, mockEvent);
      button.dataset.rippleActive = 'true';

      // Try to create second ripple
      createRippleEffect(button, mockEvent);

      // Should still have only one ripple
      const ripples = button.querySelectorAll('.material3-ripple');
      expect(ripples.length).toBe(1);
    });

    it('should handle touch events correctly', () => {
      const button = document.createElement('button');
      button.style.position = 'relative';
      container.appendChild(button);

      button.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
        right: 100,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }));

      // Create a mock touch event with a simplified touches array
      const mockTouchEvent = {
        touches: [{
          clientX: 50,
          clientY: 20
        }]
      } as unknown as TouchEvent;

      createRippleEffect(button, mockTouchEvent);

      const ripple = button.querySelector('.material3-ripple');
      expect(ripple).toBeTruthy();
    });

    it('should clean up ripple after animation', (done) => {
      const button = document.createElement('button');
      button.style.position = 'relative';
      container.appendChild(button);

      button.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
        right: 100,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }));

      const mockEvent = new MouseEvent('click', {
        clientX: 50,
        clientY: 20,
        bubbles: true
      });

      createRippleEffect(button, mockEvent, { duration: 100 });

      // Check ripple exists initially
      expect(button.querySelector('.material3-ripple')).toBeTruthy();

      // Check ripple is cleaned up after duration
      setTimeout(() => {
        expect(button.querySelector('.material3-ripple')).toBeFalsy();
        expect(button.dataset.rippleActive).toBe('false');
        done();
      }, 150);
    });
  });
});