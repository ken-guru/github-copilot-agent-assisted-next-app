import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { TimelineEntry } from '../Timeline';

// Mock TimelineEntry data
const createMockTimelineEntries = (): TimelineEntry[] => [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Activity 1',
    startTime: 1000000,
    endTime: 1000000 + 3600000, // 1 hour
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  },
  {
    id: '2',
    activityId: null,
    activityName: null,
    startTime: 1000000 + 3600000,
    endTime: 1000000 + 3900000 // 5 minute break
  },
  {
    id: '3',
    activityId: 'activity-2',
    activityName: 'Activity 2',
    startTime: 1000000 + 3900000,
    endTime: 1000000 + 5400000, // 25 minutes
    colors: {
      background: '#E3F2FD',
      text: '#0D47A1',
      border: '#1976D2'
    }
  }
];

describe('Summary Component', () => {
  describe('Time Metrics Display', () => {
    it('should render activity summary with time metrics', () => {
      const entries = createMockTimelineEntries();
      const totalDuration = 3600; // 1 hour planned
      const elapsedTime = 5400; // 1h 30m actually spent
      
      render(
        <Summary 
          entries={entries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );
      
      // Check for the metric names
      expect(screen.getByText('Planned Time')).toBeInTheDocument();
      expect(screen.getByText('Spent Time')).toBeInTheDocument();
      expect(screen.getByText('Idle Time')).toBeInTheDocument();
      expect(screen.getByText('Overtime')).toBeInTheDocument();
      
      // Verify time values
      const plannedTime = screen.getByText('Planned Time').nextSibling;
      expect(plannedTime).toHaveTextContent('1h 0m 0s');

      const spentTime = screen.getByText('Spent Time').nextSibling;
      expect(spentTime).toHaveTextContent('1h 30m 0s');

      const idleTime = screen.getByText('Idle Time').nextSibling;
      expect(idleTime).toHaveTextContent('5m 0s');

      const overtime = screen.getByText('Overtime').nextSibling;
      expect(overtime).toHaveTextContent('30m 0s');
    });

    it('should handle zero duration activities', () => {
      const entries = [{
        id: '1',
        activityId: 'activity-1',
        activityName: 'Zero Duration',
        startTime: 1000000,
        endTime: 1000000, // Same start and end time
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }];

      render(
        <Summary 
          entries={entries}
          totalDuration={3600}
          elapsedTime={0}
          allActivitiesCompleted={true}
        />
      );

      const spentTime = screen.getByText('Spent Time').nextSibling;
      expect(spentTime).toHaveTextContent('0s');

      const idleTime = screen.getByText('Idle Time').nextSibling;
      expect(idleTime).toHaveTextContent('0s');
    });

    it('should handle single activity sessions correctly', () => {
      const entries = [{
        id: '1',
        activityId: 'activity-1',
        activityName: 'Single Activity',
        startTime: 1000000,
        endTime: 1000000 + 1800000, // 30 minutes
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }];

      render(
        <Summary 
          entries={entries}
          totalDuration={3600}
          elapsedTime={1800}
          allActivitiesCompleted={true}
        />
      );

      const spentTime = screen.getByText('Spent Time').nextSibling;
      expect(spentTime).toHaveTextContent('30m 0s');

      const idleTime = screen.getByText('Idle Time').nextSibling;
      expect(idleTime).toHaveTextContent('0s'); // No breaks in single activity
    });

    it('should handle sessions with only breaks', () => {
      const entries = [{
        id: '1',
        activityId: null,
        activityName: 'Break',
        startTime: 1000000,
        endTime: 1000000 + 1800000, // 30 minutes break
      }];

      render(
        <Summary 
          entries={entries}
          totalDuration={3600}
          elapsedTime={1800}
          allActivitiesCompleted={true}
        />
      );

      const spentTime = screen.getByText('Spent Time').nextSibling;
      expect(spentTime).toHaveTextContent('30m 0s');

      const idleTime = screen.getByText('Idle Time').nextSibling;
      expect(idleTime).toHaveTextContent('30m 0s'); // All time is idle
    });
  });

  describe('Status Messages', () => {
    it('should display late completion message for any time over planned duration', () => {
      const entries = [{
        id: '1',
        activityId: 'activity-1',
        activityName: 'Activity 1',
        startTime: 1000000,
        endTime: 1000000 + 3602000, // 1 hour + 2 seconds
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }];
      
      const totalDuration = 3600;
      const elapsedTime = 3602; // Just 2 seconds over
      
      render(
        <Summary 
          entries={entries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );
      
      expect(screen.getByText('You took 2s more than planned')).toBeInTheDocument();
      expect(screen.getByText('Overtime').nextSibling).toHaveTextContent('2s');
    });

    it('should display early completion message when finishing under planned time', () => {
      const entries = createMockTimelineEntries();
      const totalDuration = 3600;
      const elapsedTime = 3540; // 1 minute early
      
      render(
        <Summary 
          entries={entries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );
      
      expect(screen.getByText('Amazing! You finished 1m 0s earlier than planned!')).toBeInTheDocument();
      expect(screen.getByText('Overtime').nextSibling).toHaveTextContent('0s');
    });
  });

  describe('Time Up State', () => {
    it('should show time up message when time is up', () => {
      const entries = createMockTimelineEntries();
      
      render(
        <Summary 
          entries={entries}
          totalDuration={3600}
          elapsedTime={3600}
          allActivitiesCompleted={true}
          isTimeUp={true}
        />
      );
      
      expect(screen.getByText("Time's up! Review your completed activities below.")).toBeInTheDocument();
    });

    it('should handle time up with overtime', () => {
      const entries = [{
        id: '1',
        activityId: 'activity-1',
        activityName: 'Activity 1',
        startTime: 1000000,
        endTime: 1000000 + 3900000, // 1h 5m
      }];
      
      render(
        <Summary 
          entries={entries}
          totalDuration={3600}
          elapsedTime={3900}
          allActivitiesCompleted={true}
          isTimeUp={true}
        />
      );
      
      expect(screen.getByText("Time's up! Review your completed activities below.")).toBeInTheDocument();
      expect(screen.getByText('Overtime').nextSibling).toHaveTextContent('5m 0s');
    });
  });

  describe('Performance', () => {
    it('should handle large number of activities efficiently', () => {
      // Create 100 activities with varying durations
      const entries: TimelineEntry[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        activityId: `activity-${i + 1}`,
        activityName: `Activity ${i + 1}`,
        startTime: 1000000 + (i * 3600000),
        endTime: 1000000 + ((i + 1) * 3600000),
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }));

      const renderStart = performance.now();
      
      render(
        <Summary 
          entries={entries}
          totalDuration={360000} // 100 hours
          elapsedTime={360000}
          allActivitiesCompleted={true}
        />
      );

      const renderTime = performance.now() - renderStart;
      
      // Verify render completes in reasonable time (< 100ms)
      expect(renderTime).toBeLessThan(100);

      // Verify summary still shows all metrics correctly
      expect(screen.getByText('Planned Time')).toBeInTheDocument();
      expect(screen.getByText('Spent Time')).toBeInTheDocument();
      expect(screen.getByText('Time Spent per Activity')).toBeInTheDocument();

      // Verify all 100 activities are listed
      const activityItems = screen.getAllByText(/Activity \d+/);
      expect(activityItems).toHaveLength(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle maximum safe integer durations', () => {
      const maxDuration = Number.MAX_SAFE_INTEGER;
      const entries = [{
        id: '1',
        activityId: 'activity-1',
        activityName: 'Long Activity',
        startTime: 0,
        endTime: maxDuration,
      }];

      render(
        <Summary 
          entries={entries}
          totalDuration={maxDuration}
          elapsedTime={maxDuration}
          allActivitiesCompleted={true}
        />
      );

      // Verify the component doesn't break with maximum values
      expect(screen.getByText('Planned Time')).toBeInTheDocument();
      expect(screen.getByText('Spent Time')).toBeInTheDocument();
    });
  });
});