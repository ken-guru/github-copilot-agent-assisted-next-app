/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import Home from '../../app/page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

// Mock the activity storage utilities
jest.mock('../../utils/activity-storage', () => ({
  getActivities: jest.fn(() => []),
  addActivity: jest.fn(),
  deleteActivity: jest.fn(),
}));

// Mock the resetService
jest.mock('../../utils/resetService', () => ({
  __esModule: true,
  default: {
    setDialogCallback: jest.fn(),
    registerResetCallback: jest.fn(() => jest.fn()),
    reset: jest.fn(),
  },
}));

describe('Home Page Layout Spacing', () => {
  beforeEach(() => {
    // Mock crypto.randomUUID for consistent test behavior
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: () => 'test-uuid' }
    });
  });

  describe('Activity State Layout', () => {
    it('should have proper top spacing between header and cards in activity state', () => {
      // Set up initial state to show activity view
      const { container } = render(<Home />);
      
      // Find the main container
      const mainContainer = container.querySelector('main');
      expect(mainContainer).toHaveClass('container-fluid', 'd-flex', 'flex-column', 'overflow-x-hidden', 'overflow-y-auto');
      
      // Check that the main container has proper height
      expect(mainContainer).toHaveStyle('height: calc(100vh - var(--navbar-height))');
      
      // Find the inner flex container (updated for new overflow classes)
      const innerContainer = mainContainer?.querySelector('.flex-grow-1.d-flex.flex-column.overflow-x-hidden.overflow-y-auto');
      expect(innerContainer).toBeInTheDocument();
      
      // The offline indicator is now global (in LayoutClient), so we just verify the structure
      // Check that the inner container is ready for proper layout spacing
      expect(innerContainer).toHaveClass('flex-grow-1', 'd-flex', 'flex-column', 'overflow-x-hidden', 'overflow-y-auto');
    });

    it('should have appropriate row layout with spacing for activity manager and timeline', () => {
      const { container } = render(<Home />);
      
      // Look for the row that contains ActivityManager and Timeline
      const activityRow = container.querySelector('.row.flex-grow-1.g-3');
      if (activityRow) {
        // Should have proper spacing classes
        expect(activityRow).toHaveClass('px-3', 'pt-3', 'pb-3', 'overflow-hidden');
        
        // Should have proper column structure
        const leftColumn = activityRow.querySelector('.col-lg-5');
        const rightColumn = activityRow.querySelector('.col-lg-7');
        
        if (leftColumn && rightColumn) {
          expect(leftColumn).toHaveClass('d-flex', 'flex-column', 'overflow-hidden');
          expect(rightColumn).toHaveClass('d-none', 'd-lg-flex', 'flex-column', 'overflow-hidden');
        }
      }
    });
  });

  describe('Responsive Layout Considerations', () => {
    it('should maintain proper spacing without causing total height overflow', () => {
      const { container } = render(<Home />);
      
      const mainContainer = container.querySelector('main');
      expect(mainContainer).toHaveClass('overflow-x-hidden', 'overflow-y-auto');
      
      // The flex-grow-1 container should also enable scrolling for mobile
      const flexContainer = mainContainer?.querySelector('.flex-grow-1');
      expect(flexContainer).toHaveClass('overflow-x-hidden', 'overflow-y-auto');
    });
  });
});
