import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { TimelineEntry } from '@/types';
import { Activity } from '@/types/activity';
import * as activityOrder from '@/utils/activity-order';
import * as activityStorage from '@/utils/activity-storage';

// Mock the activity order and storage utilities
jest.mock('@/utils/activity-order');
jest.mock('@/utils/activity-storage');

const mockSortActivitiesByOrder = activityOrder.sortActivitiesByOrder as jest.MockedFunction<typeof activityOrder.sortActivitiesByOrder>;
const mockGetActivities = activityStorage.getActivities as jest.MockedFunction<typeof activityStorage.getActivities>;

describe('Summary Component - Activity Order Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respect custom activity order for completed activities', () => {
    // Mock sortActivitiesByOrder to return activities in custom order
    mockSortActivitiesByOrder.mockImplementation((activities) => {
      // Custom order: activity-2 first, then activity-1
      const customOrder = ['activity-2', 'activity-1'];
      return [...activities].sort((a, b) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });
    });

    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 1000000,
        endTime: 1000000 + 1800000, // 30 minutes
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
        startTime: 1000000 + 3600000,
        endTime: 1000000 + 7200000, // 1 hour
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    render(
      <Summary 
        entries={entries}
        totalDuration={7200}
        elapsedTime={7200}
        allActivitiesCompleted={true}
      />
    );

    // Verify sortActivitiesByOrder was called
    expect(mockSortActivitiesByOrder).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'activity-1', name: 'First Activity' }),
        expect.objectContaining({ id: 'activity-2', name: 'Second Activity' })
      ])
    );

    // Get all activity list items in order
    const activityList = screen.getByTestId('activity-list');
    const activityItems = activityList.querySelectorAll('.activity-item');
    
    // Should be in custom order: Second Activity first, then First Activity
    expect(activityItems[0]).toHaveTextContent('Second Activity');
    expect(activityItems[1]).toHaveTextContent('First Activity');
  });

  it('should respect custom activity order for skipped activities', () => {
    // Mock getActivities to return test data
    mockGetActivities.mockReturnValue([
      { id: 'activity-1', name: 'First Activity', createdAt: '2023-01-01T00:00:00Z' },
      { id: 'activity-2', name: 'Second Activity', createdAt: '2023-01-02T00:00:00Z' }
    ] as Activity[]);

    // Mock sortActivitiesByOrder to return activities in custom order
    mockSortActivitiesByOrder.mockImplementation((activities) => {
      // Custom order for skipped activities: activity-2 first, then activity-1
      const customOrder = ['activity-2', 'activity-1'];
      return [...activities].sort((a, b) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });
    });

    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-3',
        activityName: 'Completed Activity',
        startTime: 1000000,
        endTime: 1000000 + 3600000,
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Summary 
        entries={entries}
        totalDuration={3600}
        elapsedTime={3600}
        allActivitiesCompleted={true}
        skippedActivityIds={['activity-1', 'activity-2']}
      />
    );

    // Verify sortActivitiesByOrder was called for skipped activities
    expect(mockSortActivitiesByOrder).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'activity-1', name: 'First Activity' }),
        expect.objectContaining({ id: 'activity-2', name: 'Second Activity' })
      ])
    );

    // Check that skipped activities section exists
    expect(screen.getByText('Skipped activities (2)')).toBeInTheDocument();

    // Get skipped activity names in order
    const skippedSection = screen.getByTestId('skipped-activities');
    const skippedItems = skippedSection.querySelectorAll('.list-group-item');
    
    // Should be in custom order: Second Activity first, then First Activity
    expect(skippedItems[0]).toHaveTextContent('Second Activity');
    expect(skippedItems[1]).toHaveTextContent('First Activity');
  });

  it('should maintain correct time calculations regardless of display order', () => {
    // Mock sortActivitiesByOrder to return activities in reverse chronological order
    mockSortActivitiesByOrder.mockImplementation((activities) => {
      return [...activities].sort((a, b) => b.id.localeCompare(a.id));
    });

    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 1000000,
        endTime: 1000000 + 1800000, // 30 minutes
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
        startTime: 1000000 + 3600000,
        endTime: 1000000 + 7200000, // 1 hour
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    render(
      <Summary 
        entries={entries}
        totalDuration={7200}
        elapsedTime={7200}
        allActivitiesCompleted={true}
      />
    );

    // Verify that time calculations are correct regardless of display order
    const activityList = screen.getByTestId('activity-list');
    const activityItems = activityList.querySelectorAll('.activity-item');
    
    // Find the badges for each activity
    const secondActivityBadge = Array.from(activityItems).find(item => 
      item.textContent?.includes('Second Activity')
    )?.querySelector('.badge');
    const firstActivityBadge = Array.from(activityItems).find(item => 
      item.textContent?.includes('First Activity')
    )?.querySelector('.badge');
    
    // Time calculations should be correct regardless of order
    expect(firstActivityBadge).toHaveTextContent('30m 0s'); // 30 minutes
    expect(secondActivityBadge).toHaveTextContent('1h 0m 0s'); // 1 hour
  });

  it('should handle activities with multiple timeline entries and custom order', () => {
    // Mock sortActivitiesByOrder to return activities in specific custom order
    mockSortActivitiesByOrder.mockImplementation((activities) => {
      // Custom order: activity-2 first, then activity-1
      const customOrder = ['activity-2', 'activity-1'];
      return [...activities].sort((a, b) => {
        const indexA = customOrder.indexOf(a.id);
        const indexB = customOrder.indexOf(b.id);
        return indexA - indexB;
      });
    });

    const entries: TimelineEntry[] = [
      // First session of activity-1
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 1000000,
        endTime: 1000000 + 1800000, // 30 minutes
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      // Activity-2 session
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Second Activity',
        startTime: 1000000 + 1800000,
        endTime: 1000000 + 3600000, // 30 minutes
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      },
      // Second session of activity-1 (resumed)
      {
        id: '3',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 1000000 + 3600000,
        endTime: 1000000 + 5400000, // 30 minutes more
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    render(
      <Summary 
        entries={entries}
        totalDuration={5400}
        elapsedTime={5400}
        allActivitiesCompleted={true}
      />
    );

    // Verify sortActivitiesByOrder was called with correct aggregated data
    expect(mockSortActivitiesByOrder).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ 
          id: 'activity-1', 
          name: 'First Activity',
          duration: 3600 // 60 minutes total (30 + 30)
        }),
        expect.objectContaining({ 
          id: 'activity-2', 
          name: 'Second Activity',
          duration: 1800 // 30 minutes
        })
      ])
    );

    // Get activity list items in custom order
    const activityList = screen.getByTestId('activity-list');
    const activityItems = activityList.querySelectorAll('.activity-item');
    
    // Should be in custom order: Second Activity first, then First Activity
    expect(activityItems[0]).toHaveTextContent('Second Activity');
    expect(activityItems[0]).toHaveTextContent('30m 0s');
    expect(activityItems[1]).toHaveTextContent('First Activity');
    expect(activityItems[1]).toHaveTextContent('1h 0m 0s'); // Total of both sessions
  });

  it('should handle empty custom order gracefully', () => {
    // Mock sortActivitiesByOrder to simulate no custom order (returns original order)
    mockSortActivitiesByOrder.mockImplementation((activities) => {
      // Simulate default behavior when no custom order exists
      return [...activities];
    });

    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 1000000,
        endTime: 1000000 + 1800000,
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
        startTime: 1000000 + 3600000,
        endTime: 1000000 + 7200000,
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    render(
      <Summary 
        entries={entries}
        totalDuration={7200}
        elapsedTime={7200}
        allActivitiesCompleted={true}
      />
    );

    // Verify sortActivitiesByOrder was still called
    expect(mockSortActivitiesByOrder).toHaveBeenCalled();

    // Component should render successfully
    expect(screen.getByText('Time Spent per Activity')).toBeInTheDocument();
    expect(screen.getByText('First Activity')).toBeInTheDocument();
    expect(screen.getByText('Second Activity')).toBeInTheDocument();
  });
});