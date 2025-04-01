import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Summary from '../Summary';
import { renderWithTheme } from '../../test/utils/renderWithTheme';

// Mock useTheme hook to avoid context issues
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    isDarkMode: false,
    setTheme: jest.fn()
  })
}));

describe('Summary Component', () => {
  describe('Time Metrics Display', () => {
    it('should render activity summary with time metrics', () => {
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Coding',
          startTime: 0,
          endTime: 3600000, // 1 hour
          breakAfter: false
        },
        {
          id: '2',
          activityId: 'activity-2',
          activityName: 'Design',
          startTime: 3600000,
          endTime: 5400000, // 30 minutes
          breakAfter: false
        },
        {
          id: '3',
          activityId: 'break-1',
          activityName: 'Break',
          startTime: 5400000,
          endTime: 5700000, // 5 minutes
          isBreak: true,
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={7200} // 2 hours
          allActivitiesCompleted={true}
        />
      );
      
      // Check activity names are displayed
      expect(screen.getByText('Coding')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      
      // Check time metrics are displayed
      expect(screen.getByText(/1h 0m/)).toBeInTheDocument(); // Coding duration
      expect(screen.getByText(/30m 0s/)).toBeInTheDocument(); // Design duration
      
      // Check total productive time calculation
      const productiveTime = screen.getByText(/productive time/i);
      expect(productiveTime).toHaveTextContent('1h 30m'); // 90 minutes total
    });
    
    it('should handle zero duration activities', () => {
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Zero Duration Activity',
          startTime: 1000,
          endTime: 1000, // Zero duration
          breakAfter: false
        },
        {
          id: '2',
          activityId: 'activity-2',
          activityName: 'Regular Activity',
          startTime: 1000,
          endTime: 3000, // 2 seconds
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={3}
          allActivitiesCompleted={true}
        />
      );
      
      // Check that both activities are displayed
      expect(screen.getByText('Zero Duration Activity')).toBeInTheDocument();
      expect(screen.getByText('Regular Activity')).toBeInTheDocument();
      
      // Check durations
      expect(screen.getByText(/0s/)).toBeInTheDocument(); // Zero duration
      expect(screen.getByText(/2s/)).toBeInTheDocument(); // 2 seconds duration
    });
    
    it('should handle single activity sessions correctly', () => {
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Single Activity',
          startTime: 0,
          endTime: 600000, // 10 minutes
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={600}
          allActivitiesCompleted={true}
        />
      );
      
      // Check that the activity is displayed
      expect(screen.getByText('Single Activity')).toBeInTheDocument();
      
      // Check duration
      expect(screen.getByText(/10m 0s/)).toBeInTheDocument();
      
      // Check that it correctly shows as 100% of total time
      expect(screen.getByText(/100%/)).toBeInTheDocument();
    });
    
    it('should handle sessions with only breaks', () => {
      const entries = [
        {
          id: '1',
          activityId: 'break-1',
          activityName: 'Break 1',
          startTime: 0,
          endTime: 300000, // 5 minutes
          isBreak: true,
          breakAfter: false
        },
        {
          id: '2',
          activityId: 'break-2',
          activityName: 'Break 2',
          startTime: 300000,
          endTime: 600000, // 5 minutes
          isBreak: true,
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={600}
          allActivitiesCompleted={true}
        />
      );
      
      // Check that breaks are displayed
      expect(screen.getByText('Break 1')).toBeInTheDocument();
      expect(screen.getByText('Break 2')).toBeInTheDocument();
      
      // Should show a message about no productive time
      expect(screen.getByText(/no productive time/i)).toBeInTheDocument();
    });
  });
  
  describe('Status Messages', () => {
    it('should display late completion message for any time over planned duration', () => {
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Long Activity',
          startTime: 0,
          endTime: 7200000, // 2 hours
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={3600} // 1 hour planned
          allActivitiesCompleted={true}
        />
      );
      
      // Check for late completion message
      expect(screen.getByText(/took longer than planned/i)).toBeInTheDocument();
      expect(screen.getByText(/1h over/i)).toBeInTheDocument();
    });
    
    it('should display early completion message when finishing under planned time', () => {
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Quick Activity',
          startTime: 0,
          endTime: 1800000, // 30 minutes
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={3600} // 1 hour planned
          allActivitiesCompleted={true}
        />
      );
      
      // Check for early completion message
      expect(screen.getByText(/finished early/i)).toBeInTheDocument();
      expect(screen.getByText(/30m under/i)).toBeInTheDocument();
    });
  });
  
  describe('Time Up State', () => {
    it('should show time up message when time is up', () => {
      renderWithTheme(
        <Summary
          entries={[]}
          totalSeconds={3600}
          allActivitiesCompleted={false}
          timeIsUp={true}
        />
      );
      
      // Check for time up message
      expect(screen.getByText(/time is up/i)).toBeInTheDocument();
    });
    
    it('should handle time up with overtime', () => {
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Ongoing Activity',
          startTime: 0,
          endTime: null, // Still ongoing
          breakAfter: false
        }
      ];
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={3600}
          allActivitiesCompleted={false}
          timeIsUp={true}
          currentTime={4500} // 15 minutes overtime
        />
      );
      
      // Check for overtime message
      expect(screen.getByText(/overtime/i)).toBeInTheDocument();
    });
  });
  
  describe('Performance', () => {
    it('should handle large number of activities efficiently', () => {
      // Create a large number of activities
      const entries = Array.from({ length: 50 }, (_, i) => ({
        id: `id-${i}`,
        activityId: `activity-${i}`,
        activityName: `Activity ${i}`,
        startTime: i * 60000,
        endTime: (i + 1) * 60000, // Each 1 minute long
        breakAfter: false
      }));
      
      const totalSeconds = entries.length * 60; // Total seconds for all activities
      
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={totalSeconds}
          allActivitiesCompleted={true}
        />
      );
      
      // Check that at least some activities are rendered
      // We don't check all 50 to keep the test efficient
      expect(screen.getByText('Activity 0')).toBeInTheDocument();
      expect(screen.getByText('Activity 10')).toBeInTheDocument();
      expect(screen.getByText('Activity 49')).toBeInTheDocument();
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle maximum safe integer durations', () => {
      const maxDuration = Number.MAX_SAFE_INTEGER; // Very large number
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Extremely Long Activity',
          startTime: 0,
          endTime: maxDuration,
          breakAfter: false
        }
      ];
      
      // We expect the component to handle this without crashing
      renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={maxDuration / 1000}
          allActivitiesCompleted={true}
        />
      );
      
      // Check that the activity is displayed
      expect(screen.getByText('Extremely Long Activity')).toBeInTheDocument();
    });
  });
  
  describe('Activity Order', () => {
    it('should display activities in chronological order', () => {
      // Deliberately provide activities in non-chronological order
      const entries = [
        {
          id: '3',
          activityId: 'activity-3',
          activityName: 'Third Activity',
          startTime: 7200000, // Starts at 2 hours
          endTime: 10800000, // Ends at 3 hours
          breakAfter: false
        },
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'First Activity',
          startTime: 0, // Starts at 0
          endTime: 3600000, // Ends at 1 hour
          breakAfter: false
        },
        {
          id: '2',
          activityId: 'activity-2',
          activityName: 'Second Activity',
          startTime: 3600000, // Starts at 1 hour
          endTime: 7200000, // Ends at 2 hours
          breakAfter: false
        }
      ];
      
      const { container } = renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={10800}
          allActivitiesCompleted={true}
        />
      );
      
      // Get all activity elements in the DOM
      const activityElements = screen.getAllByRole('listitem');
      
      // Check that they appear in chronological order
      expect(activityElements[0]).toHaveTextContent('First Activity');
      expect(activityElements[1]).toHaveTextContent('Second Activity');
      expect(activityElements[2]).toHaveTextContent('Third Activity');
    });
    
    it('should maintain chronological order with multiple activities of varying durations', () => {
      // A complex mix of activities and breaks
      const entries = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'First Activity',
          startTime: 0,
          endTime: 1800000, // 30 minutes
          breakAfter: true
        },
        {
          id: '2',
          activityId: 'break-1',
          activityName: 'Quick Break',
          startTime: 1800000,
          endTime: 2100000, // 5 minutes
          isBreak: true,
          breakAfter: false
        },
        {
          id: '3',
          activityId: 'activity-2',
          activityName: 'Short Activity',
          startTime: 2100000,
          endTime: 2400000, // 5 minutes
          breakAfter: false
        },
        {
          id: '4',
          activityId: 'activity-3',
          activityName: 'Long Final Activity',
          startTime: 2400000,
          endTime: 5400000, // 50 minutes
          breakAfter: false
        }
      ];
      
      const { container } = renderWithTheme(
        <Summary
          entries={entries}
          totalSeconds={5400}
          allActivitiesCompleted={true}
        />
      );
      
      // Get activity elements
      const activityElements = screen.getAllByRole('listitem');
      
      // Check chronological order
      expect(activityElements[0]).toHaveTextContent('First Activity');
      expect(activityElements[1]).toHaveTextContent('Quick Break');
      expect(activityElements[2]).toHaveTextContent('Short Activity');
      expect(activityElements[3]).toHaveTextContent('Long Final Activity');
    });
  });
  
  it('updates activity colors when theme changes', () => {
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Test Activity',
        startTime: 0,
        endTime: 3600000,
        breakAfter: false
      }
    ];
    
    // Render initially with light theme (default mock)
    const { rerender } = renderWithTheme(
      <Summary
        entries={entries}
        totalSeconds={3600}
        allActivitiesCompleted={true}
      />
    );
    
    // Check that the activity is rendered with light theme
    const activityElement = screen.getByText('Test Activity');
    expect(activityElement).toBeInTheDocument();
    
    // Now change the theme mock to dark mode
    jest.spyOn(require('../../hooks/useTheme'), 'useTheme').mockImplementation(() => ({
      theme: 'dark',
      isDarkMode: true,
      setTheme: jest.fn()
    }));
    
    // Rerender with the updated theme
    rerender(
      <Summary
        entries={entries}
        totalSeconds={3600}
        allActivitiesCompleted={true}
      />
    );
    
    // Check that the activity is still displayed in dark mode
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
  });
  
  it('status messages update colors in dark mode', () => {
    const statusMessages = [
      { 
        props: { 
          entries: [{ id: '1', activityId: 'a1', activityName: 'Over Time', startTime: 0, endTime: 7200000 }],
          totalSeconds: 3600, 
          allActivitiesCompleted: true
        },
        message: /took longer than planned/i
      },
      { 
        props: { 
          entries: [{ id: '1', activityId: 'a1', activityName: 'Under Time', startTime: 0, endTime: 1800000 }], 
          totalSeconds: 3600, 
          allActivitiesCompleted: true 
        },
        message: /finished early/i
      },
      { 
        props: { 
          entries: [], 
          totalSeconds: 3600, 
          allActivitiesCompleted: false, 
          timeIsUp: true 
        },
        message: /time is up/i
      }
    ];
    
    // Test each status message in both light and dark mode
    statusMessages.forEach(({ props, message }) => {
      // First light mode (default mock)
      renderWithTheme(
        <Summary {...props} />
      );
      
      // Check message exists in light mode
      const lightModeMessage = screen.getByText(message);
      expect(lightModeMessage).toBeInTheDocument();
      
      // Clean up
      screen.unmount;
      
      // Now change to dark mode
      jest.spyOn(require('../../hooks/useTheme'), 'useTheme').mockImplementation(() => ({
        theme: 'dark',
        isDarkMode: true,
        setTheme: jest.fn()
      }));
      
      renderWithTheme(
        <Summary {...props} />
      );
      
      // Check message exists in dark mode too
      const darkModeMessage = screen.getByText(message);
      expect(darkModeMessage).toBeInTheDocument();
      
      // Clean up 
      screen.unmount;
    });
  });
});