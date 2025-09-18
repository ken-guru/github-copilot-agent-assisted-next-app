import { render, screen } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import { TimelineEntry } from '@/types';

describe('ActivityManager Spacing and Layout', () => {
  const mockOnActivitySelect = jest.fn();
  const mockOnActivityRemove = jest.fn();
  const mockOnReset = jest.fn();

  const defaultProps = {
    onActivitySelect: mockOnActivitySelect,
    onActivityRemove: mockOnActivityRemove,
    currentActivityId: null,
    completedActivityIds: [],
    timelineEntries: [] as TimelineEntry[],
    isTimeUp: false,
    elapsedTime: 0,
    totalDuration: 3600,
    timerActive: false,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Container Layout and Overflow', () => {
    it('should have proper flex classes and overflow handling', () => {
      render(<ActivityManager {...defaultProps} />);
      
      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('h-100', 'd-flex', 'flex-column');
      
      // Check card body structure
      const cardBody = container.querySelector('.card-body');
      expect(cardBody).toHaveClass('d-flex', 'flex-column', 'flex-grow-1', 'overflow-hidden');
    });

    it('should have proper activities list container classes to prevent horizontal scroll', () => {
      // Add some activities to populate the list
      const activitiesData = [
        { id: '1', name: 'Task 1', colorIndex: 0, isActive: true, createdAt: new Date().toISOString() },
        { id: '2', name: 'Task 2', colorIndex: 1, isActive: true, createdAt: new Date().toISOString() }
      ];
      
      // Mock localStorage to return activities
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValue(JSON.stringify(activitiesData));
      
      render(<ActivityManager {...defaultProps} />);
      
      const cardBody = screen.getByTestId('activity-manager').querySelector('.card-body');
      const children = Array.from(cardBody?.children || []);
      
      // The activities list container (4th child, after progress, form, and live region) should have proper overflow classes
      const activitiesContainer = children[3] as HTMLElement;
      expect(activitiesContainer).toHaveClass('flex-grow-1');
      
      // Should have overflow properties that prevent horizontal scrolling
      const computedStyle = window.getComputedStyle(activitiesContainer);
      expect(computedStyle.overflowX).toBe('hidden');
      expect(computedStyle.overflowY).toBe('auto');
      
      getItemSpy.mockRestore();
    });

    it('should maintain vertical spacing between sections without increasing total height', () => {
      const activitiesData = [
        { id: '1', name: 'Task 1', colorIndex: 0, isActive: true, createdAt: new Date().toISOString() }
      ];
      
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValue(JSON.stringify(activitiesData));
      
      render(<ActivityManager {...defaultProps} />);
      
      const cardBody = screen.getByTestId('activity-manager').querySelector('.card-body');
      const children = Array.from(cardBody?.children || []);
      
      // Progress bar section should have margin bottom
      expect(children[0]).toHaveClass('mb-3');
      
      // Activity form section should have margin bottom
      expect(children[1]).toHaveClass('mb-3');
      
      // Activities list should not have margin bottom (it's the last item)
      expect(children[2]).not.toHaveClass('mb-3');
      
      getItemSpy.mockRestore();
    });
  });

  describe('Card Body Padding', () => {
    it('should have appropriate padding that maintains consistent spacing', () => {
      render(<ActivityManager {...defaultProps} />);
      
      const cardBody = screen.getByTestId('activity-manager').querySelector('.card-body');
      expect(cardBody).toHaveClass('p-3');
    });
  });
});
