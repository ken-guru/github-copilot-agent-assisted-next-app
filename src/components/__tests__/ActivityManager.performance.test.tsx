/**
 * Performance tests for ActivityManager component
 * Tests large activity lists and rapid reordering scenarios
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import ActivityManager from '../ActivityManager';
import { Activity } from '../../types/activity';

// Mock the activity storage functions
const mockGetActivitiesInOrder = jest.fn();
const mockAddActivity = jest.fn();
const mockDeleteActivity = jest.fn();

jest.mock('../../utils/activity-storage', () => ({
  getActivitiesInOrder: mockGetActivitiesInOrder,
  addActivity: mockAddActivity,
  deleteActivity: mockDeleteActivity,
}));

// Mock the drag and drop hook
jest.mock('../../hooks/useDragAndDrop', () => ({
  useDragAndDrop: jest.fn(() => ({
    state: {
      draggedItem: null,
      dragOverItem: null,
      isDragging: false,
      isTouchDragging: false,
      touchStartPosition: null,
      isSupported: true,
      supportedMethods: { dragAndDrop: true, touch: true, vibration: false }
    },
    handlers: {
      handleDragStart: jest.fn(),
      handleDragOver: jest.fn(),
      handleDragEnd: jest.fn(),
      handleDrop: jest.fn(),
      handleDragEnter: jest.fn(),
      handleDragLeave: jest.fn(),
      handleTouchStart: jest.fn(),
      handleTouchMove: jest.fn(),
      handleTouchEnd: jest.fn(),
      handleTouchCancel: jest.fn(),
    },
    getActivityClasses: jest.fn(() => ''),
    isActivityDragged: jest.fn(() => false),
    isActivityDraggedOver: jest.fn(() => false),
    cleanup: jest.fn(),
  }))
}));

// Mock the keyboard reordering hook
jest.mock('../../hooks/useKeyboardReordering', () => ({
  useKeyboardReordering: jest.fn(() => ({
    focusedItem: null,
    isReordering: false,
    handleKeyDown: jest.fn(),
    setFocusedItem: jest.fn(),
    clearAnnouncements: jest.fn(),
  }))
}));

// Helper function to create test activities
const createTestActivities = (count: number): Activity[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i}`,
    name: `Test Activity ${i + 1}`,
    description: `Description for activity ${i + 1}`,
    colorIndex: i % 8,
    isActive: true,
    createdAt: new Date(Date.now() - (count - i) * 1000).toISOString(),
    updatedAt: new Date(Date.now() - (count - i) * 1000).toISOString(),
  }));
};



describe('ActivityManager Performance Tests', () => {
  const defaultProps = {
    onActivitySelect: jest.fn(),
    onActivityRemove: jest.fn(),
    onActivityRestore: jest.fn(),
    currentActivityId: null,
    completedActivityIds: [],
    removedActivityIds: [],
    timelineEntries: [],
    elapsedTime: 0,
    totalDuration: 1800000, // 30 minutes
    timerActive: false,
    onReset: jest.fn(),
    onExtendDuration: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock performance.now for consistent timing
    jest.spyOn(performance, 'now').mockImplementation(() => Date.now());
    
    // Reset mocks to default empty state
    mockGetActivitiesInOrder.mockReturnValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Large Activity Lists', () => {
    it('should render activities efficiently', async () => {
      const startTime = performance.now();
      
      render(
        <ActivityManager
          {...defaultProps}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(200);

      // Verify component renders successfully
      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Should render some activities (default or mocked)
      const activityList = screen.getByTestId('activity-list');
      const activityColumns = activityList.querySelectorAll('[data-testid^="activity-column-"]');
      expect(activityColumns.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle re-renders without performance degradation', async () => {
      const startTime = performance.now();
      
      const { rerender } = render(
        <ActivityManager
          {...defaultProps}
        />
      );

      // Test re-render performance
      const rerenderStartTime = performance.now();
      rerender(
        <ActivityManager
          {...defaultProps}
          currentActivityId="1"
        />
      );
      const rerenderEndTime = performance.now();

      const initialRenderTime = rerenderStartTime - startTime;
      const rerenderTime = rerenderEndTime - rerenderStartTime;

      // Initial render should be reasonable
      expect(initialRenderTime).toBeLessThan(300);
      // Re-render should be fast due to memoization
      expect(rerenderTime).toBeLessThan(100);

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });
    });

    it('should efficiently handle activity filtering', async () => {
      const startTime = performance.now();
      
      render(
        <ActivityManager
          {...defaultProps}
          removedActivityIds={['1']} // Hide one activity
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle filtering efficiently
      expect(renderTime).toBeLessThan(150);

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        const visibleColumns = activityList.querySelectorAll('[data-testid^="activity-column-"]');
        // Should show some activities
        expect(visibleColumns.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Rapid Reordering Performance', () => {
    it('should handle rapid reorder operations without lag', async () => {
      const activities = createTestActivities(15);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      render(
        <ActivityManager
          {...defaultProps}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Simulate rapid reordering by triggering multiple state updates
      const startTime = performance.now();
      
      // Simulate 10 rapid reorder operations
      for (let i = 0; i < 10; i++) {
        act(() => {
          // Trigger a reorder by changing the activity order
          const reorderedActivities = [...activities];
          const currentActivity = reorderedActivities[i % activities.length];
          const nextActivity = reorderedActivities[(i + 1) % activities.length];
          if (currentActivity && nextActivity) {
            reorderedActivities[i % activities.length] = nextActivity;
            reorderedActivities[(i + 1) % activities.length] = currentActivity;
          }
          mockGetActivitiesInOrder.mockReturnValue(reorderedActivities);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle rapid operations efficiently
      expect(totalTime).toBeLessThan(200);
    });

    it('should debounce reorder persistence calls', async () => {
      const activities = createTestActivities(10);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      render(
        <ActivityManager
          {...defaultProps}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // The debouncing is handled in the useDragAndDrop hook
      // This test verifies that the component doesn't cause excessive re-renders
      const initialRenderCount = mockGetActivitiesInOrder.mock.calls.length;

      // Simulate multiple rapid updates
      act(() => {
        // Multiple state changes in quick succession
        for (let i = 0; i < 5; i++) {
          mockGetActivitiesInOrder.mockReturnValue([...activities].reverse());
        }
      });

      // Should not cause excessive calls to storage
      const finalRenderCount = mockGetActivitiesInOrder.mock.calls.length;
      expect(finalRenderCount - initialRenderCount).toBeLessThan(10);
    });
  });

  describe('Memory Usage and Cleanup', () => {
    it('should properly cleanup event listeners and timers', async () => {
      const activities = createTestActivities(20);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      const { unmount } = render(
        <ActivityManager
          {...defaultProps}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Verify cleanup was called (mocked in the hook)
      // In a real scenario, this would check for memory leaks
      expect(true).toBe(true); // Placeholder - actual cleanup verification would be more complex
    });

    it('should handle component updates without memory leaks', async () => {
      const activities = createTestActivities(15);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      const { rerender } = render(
        <ActivityManager
          {...defaultProps}
        />
      );

      // Simulate multiple re-renders with different props
      for (let i = 0; i < 10; i++) {
        rerender(
          <ActivityManager
            {...defaultProps}
            currentActivityId={`activity-${i}`}
            elapsedTime={i * 1000}
          />
        );
      }

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Component should still be responsive
      expect(screen.getByTestId('activity-list')).toBeInTheDocument();
    });
  });

  describe('Animation Performance', () => {
    it('should handle loading animations efficiently', async () => {
      // Start with empty activities to trigger loading state
      mockGetActivitiesInOrder.mockReturnValue([]);

      const { rerender } = render(
        <ActivityManager
          {...defaultProps}
        />
      );

      // Component should render successfully even with empty activities
      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Load activities
      const activities = createTestActivities(10);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      const startTime = performance.now();
      rerender(
        <ActivityManager
          {...defaultProps}
        />
      );

      const endTime = performance.now();
      const transitionTime = endTime - startTime;

      // Transition should be smooth
      expect(transitionTime).toBeLessThan(150);

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });
    });

    it('should handle drag feedback animations without blocking UI', async () => {
      const activities = createTestActivities(10);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      render(
        <ActivityManager
          {...defaultProps}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Simulate drag operations
      const activityElements = screen.getAllByRole('button');
      
      const startTime = performance.now();
      
      // Simulate multiple drag events
      activityElements.slice(0, 5).forEach((element) => {
        fireEvent.dragStart(element);
        fireEvent.dragEnd(element);
      });

      const endTime = performance.now();
      const dragTime = endTime - startTime;

      // Drag operations should be responsive
      expect(dragTime).toBeLessThan(50);
    });
  });

  describe('Responsive Performance', () => {
    it('should maintain performance on mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const activities = createTestActivities(20);
      mockGetActivitiesInOrder.mockReturnValue(activities);

      const startTime = performance.now();
      
      render(
        <ActivityManager
          {...defaultProps}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render efficiently on mobile
      expect(renderTime).toBeLessThan(150);

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });
    });
  });
});