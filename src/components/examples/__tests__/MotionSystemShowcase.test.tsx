/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MotionSystemShowcase from '../MotionSystemShowcase';

// Mock the motion system hooks
jest.mock('../../../hooks/useMotionSystem', () => ({
  useMotionPreferences: () => ({
    prefersReducedMotion: false,
    getTransition: (normal: string) => normal
  }),
  useSharedElementTransition: () => ({
    enter: jest.fn(),
    exit: jest.fn(),
    reset: jest.fn(),
    styles: {},
    isEntering: false,
    isExiting: false
  }),
  useMicroInteraction: () => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    isActive: false,
    styles: {},
    handlers: {
      onMouseDown: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseLeave: jest.fn(),
      onTouchStart: jest.fn(),
      onTouchEnd: jest.fn()
    }
  }),
  useRippleEffect: () => ({
    ref: { current: null },
    createRipple: jest.fn(),
    rippleHandlers: {
      onMouseDown: jest.fn(),
      onTouchStart: jest.fn()
    }
  }),
  useKeyframeAnimation: () => ({
    createAnimation: jest.fn(() => 'test-animation 300ms ease forwards'),
    removeAnimation: jest.fn(),
    clearAllAnimations: jest.fn(),
    activeAnimations: []
  })
}));

describe('MotionSystemShowcase', () => {
  beforeEach(() => {
    // Mock matchMedia for reduced motion detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render the showcase component', () => {
    render(<MotionSystemShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Motion System')).toBeInTheDocument();
    expect(screen.getByText(/Interactive demonstration of Material 3 motion patterns/)).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    render(<MotionSystemShowcase />);
    
    expect(screen.getByRole('button', { name: 'Easing Curves' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Shared Transitions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Micro-interactions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Performance' })).toBeInTheDocument();
  });

  it('should switch between demo sections', () => {
    render(<MotionSystemShowcase />);
    
    // Should start with easing demo
    expect(screen.getByText('Easing Curves', { selector: 'h3' })).toBeInTheDocument();
    
    // Click on transitions demo
    fireEvent.click(screen.getByRole('button', { name: 'Shared Transitions' }));
    
    // Should eventually show transitions demo (after timeout)
    setTimeout(() => {
      expect(screen.getByText('Shared Element Transitions')).toBeInTheDocument();
    }, 300);
  });

  it('should apply custom className', () => {
    const { container } = render(<MotionSystemShowcase className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('motion-system-showcase');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});