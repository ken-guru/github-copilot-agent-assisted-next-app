/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';
import * as activityOrderUtils from '@/utils/activity-order';

// Mock the activity order utilities
jest.mock('@/utils/activity-order');

describe('Timeline Order Consistency', () => {
  let dateNowSpy: jest.SpyInstance;
  const FIXED_TIME = 1000000;
  
  const mockGetActivityOrder = activityOrderUtils.getActivityOrder as jest.MockedFunction<typeof activityOrderUtils.getActivityOrder>;
  const mockHasCustomActivityOrder = activityOrderUtils.hasCustomActivityOrder as jest.MockedFunction<typeof activityOrderUtils.hasCustomActivityOrder>;
  
  beforeEach(() => {
    jest.useFakeTimers();
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => FIXED_TIME);
    
    // Reset mocks
    jest.clearAllMocks();
    mockGetActivityOrder.mockReturnValue([]);
    mockHasCustomActivityOrder.mockReturnValue(false);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  // Helper function to render timeline with standard props
  const renderTimeline = (entries: TimelineEntry[], props = {}) => {
    return render(
      <ToastProvider>
        <Timeline 
          entries={entries}
          totalDuration={3600}
          elapsedTime={30}
          timerActive={true}
          {...props}
        />
      </ToastProvider>
    );
  };

  it('should not show order indicators when no custom order exists', () => {
    mockHasCustomActivityOrder.mockReturnValue(false);
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 10000,
        endTime: FIXED_TIME,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    // Should not show any order indicators
    expect(screen.queryByTestId('timeline-order-indicator')).not.toBeInTheDocument();
    
    // Should still show activity names
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should show order indicators when custom order exists', () => {
    mockHasCustomActivityOrder.mockReturnValue(true);
    mockGetActivityOrder.mockReturnValue(['activity-2', 'activity-1', 'activity-3']);
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 10000,
        endTime: FIXED_TIME,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    // Should show order indicators
    const orderIndicators = screen.getAllByTestId('timeline-order-indicator');
    expect(orderIndicators).toHaveLength(2);
    
    // Check the order positions based on chronological timeline order
    // First timeline entry is activity-1, which is 2nd in custom order ['activity-2', 'activity-1', 'activity-3']
    // Second timeline entry is activity-2, which is 1st in custom order
    expect(orderIndicators[0]).toHaveTextContent('#2'); // activity-1 is second in custom order
    expect(orderIndicators[1]).toHaveTextContent('#1'); // activity-2 is first in custom order
    
    // Should still show activity names
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should show correct order positions for activities in custom order', () => {
    mockHasCustomActivityOrder.mockReturnValue(true);
    mockGetActivityOrder.mockReturnValue(['activity-3', 'activity-1', 'activity-2']);
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 20000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Second Activity',
        startTime: FIXED_TIME - 20000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      },
      {
        id: '3',
        activityId: 'activity-3',
        activityName: 'Third Activity',
        startTime: FIXED_TIME - 10000,
        endTime: FIXED_TIME,
        colors: {
          background: '#FFF3E0',
          text: '#E65100',
          border: '#FF9800'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    const orderIndicators = screen.getAllByTestId('timeline-order-indicator');
    expect(orderIndicators).toHaveLength(3);
    
    // Based on custom order ['activity-3', 'activity-1', 'activity-2']:
    // activity-1 should show #2, activity-2 should show #3, activity-3 should show #1
    expect(orderIndicators[0]).toHaveTextContent('#2'); // First entry (activity-1) is 2nd in custom order
    expect(orderIndicators[1]).toHaveTextContent('#3'); // Second entry (activity-2) is 3rd in custom order
    expect(orderIndicators[2]).toHaveTextContent('#1'); // Third entry (activity-3) is 1st in custom order
  });

  it('should not show order indicator for activities not in custom order', () => {
    mockHasCustomActivityOrder.mockReturnValue(true);
    mockGetActivityOrder.mockReturnValue(['activity-1']); // Only activity-1 is in custom order
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Ordered Activity',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Unordered Activity',
        startTime: FIXED_TIME - 10000,
        endTime: FIXED_TIME,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    // Should show only one order indicator
    const orderIndicators = screen.getAllByTestId('timeline-order-indicator');
    expect(orderIndicators).toHaveLength(1);
    expect(orderIndicators[0]).toHaveTextContent('#1');
    
    // Both activities should still be visible
    expect(screen.getByText('Ordered Activity')).toBeInTheDocument();
    expect(screen.getByText('Unordered Activity')).toBeInTheDocument();
  });

  it('should handle null activityId gracefully', () => {
    mockHasCustomActivityOrder.mockReturnValue(true);
    mockGetActivityOrder.mockReturnValue(['activity-1']);
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: null, // Break entry with null activityId
        activityName: null,
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#F5F5F5',
          text: '#666666',
          border: '#CCCCCC'
        }
      },
      {
        id: '2',
        activityId: 'activity-1',
        activityName: 'Regular Activity',
        startTime: FIXED_TIME - 10000,
        endTime: FIXED_TIME,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    // Should show only one order indicator (for the regular activity)
    const orderIndicators = screen.getAllByTestId('timeline-order-indicator');
    expect(orderIndicators).toHaveLength(1);
    expect(orderIndicators[0]).toHaveTextContent('#1');
    
    // Should show the regular activity name
    expect(screen.getByText('Regular Activity')).toBeInTheDocument();
  });

  it('should maintain chronological order for time calculations while showing visual order indicators', () => {
    mockHasCustomActivityOrder.mockReturnValue(true);
    mockGetActivityOrder.mockReturnValue(['activity-2', 'activity-1']); // Reverse chronological order
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Chronologically',
        startTime: FIXED_TIME - 30000, // Started first
        endTime: FIXED_TIME - 20000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Second Chronologically',
        startTime: FIXED_TIME - 20000, // Started second
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    // Timeline should still show activities in chronological order (as they appear in entries array)
    const activityNames = screen.getAllByTestId('timeline-activity-name');
    expect(activityNames[0]).toHaveTextContent('First Chronologically');
    expect(activityNames[1]).toHaveTextContent('Second Chronologically');
    
    // But order indicators should reflect custom order
    const orderIndicators = screen.getAllByTestId('timeline-order-indicator');
    expect(orderIndicators[0]).toHaveTextContent('#2'); // activity-1 is 2nd in custom order
    expect(orderIndicators[1]).toHaveTextContent('#1'); // activity-2 is 1st in custom order
  });

  it('should show tooltips for order indicators', () => {
    mockHasCustomActivityOrder.mockReturnValue(true);
    mockGetActivityOrder.mockReturnValue(['activity-1']);
    
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: FIXED_TIME - 30000,
        endTime: FIXED_TIME - 10000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    renderTimeline(mockEntries);
    
    const orderIndicator = screen.getByTestId('timeline-order-indicator');
    expect(orderIndicator).toHaveAttribute('title', 'Activity order position: 1');
  });
});