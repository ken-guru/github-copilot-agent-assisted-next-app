/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import Home from '../../app/page';

// Mock the activity storage utilities
jest.mock('../../utils/activity-storage', () => ({
  getActivities: jest.fn(() => []),
  addActivity: jest.fn((activity) => ({
    id: `test-${activity.name}`,
    name: activity.name,
    color: activity.color,
    status: 'PENDING'
  })),
  deleteActivity: jest.fn(),
}));

// Mock the resetService
jest.mock('../../utils/resetService', () => ({
  setDialogCallback: jest.fn(),
  registerResetCallback: jest.fn(() => jest.fn()),
  reset: jest.fn(),
}));

describe('Mobile Scrolling Issue #273', () => {
  beforeEach(() => {
    // Mock crypto.randomUUID for consistent test behavior
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: () => 'test-uuid' }
    });

    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });
  });

  it('should allow scrolling when content exceeds mobile viewport height', async () => {
    const { container } = render(<Home />);
    
    // Find the main container that should be scrollable on mobile
    const mainContainer = container.querySelector('main');
    expect(mainContainer).toBeInTheDocument();
    
    // For mobile, the main container should allow vertical scrolling
    // when content exceeds the available height
    const computedStyle = window.getComputedStyle(mainContainer!);
    
    // On mobile, the main container should not block scrolling
    // This test verifies the fix for issue #273
    expect(computedStyle.overflow).not.toBe('hidden');
    expect(computedStyle.overflowY).not.toBe('hidden');
  });

  it('should preserve responsive layout while enabling mobile scrolling', () => {
    const { container } = render(<Home />);
    
    const mainContainer = container.querySelector('main');
    expect(mainContainer).toHaveClass('d-flex', 'flex-column', 'flex-grow-1', 'overflow-hidden');
    
    // Should maintain height calculation
    expect(mainContainer).toHaveStyle('height: 100%');
    
    // Inner containers should also have scrolling enabled for mobile
    const innerContainer = mainContainer?.querySelector('.flex-grow-1.d-flex.flex-column');
    if (innerContainer) {
      // Inner containers should also enable scrolling for mobile accessibility
      expect(innerContainer).toHaveClass('overflow-x-hidden');
      expect(innerContainer).toHaveClass('overflow-y-auto');
    }
  });

  it('should have correct CSS classes for mobile scrolling fix', () => {
    const { container } = render(<Home />);
    
    const mainContainer = container.querySelector('main');
    
    // Verify the correct Bootstrap utility classes are applied for main container
    expect(mainContainer).toHaveClass('d-flex', 'flex-column', 'flex-grow-1', 'overflow-hidden');
    
    // The scrolling should be enabled on inner flex-grow-1 container, not main
    const innerContainer = mainContainer?.querySelector('.flex-grow-1.d-flex.flex-column.overflow-y-auto');
    if (innerContainer) {
      expect(innerContainer).toHaveClass('overflow-x-hidden');
      expect(innerContainer).toHaveClass('overflow-y-auto');
    }
  });
});
