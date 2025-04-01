import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../Timeline';
import { renderWithTheme } from '../../test/utils/renderWithTheme';

// Mock useTheme to avoid context errors
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'system',
    isDarkMode: false,
    setTheme: jest.fn()
  })
}));

describe('Timeline Break Visualization', () => {
  it('should show ongoing break immediately after completing an activity', () => {
    // Setup entries with one complete activity followed by an ongoing break
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Completed Activity',
        startTime: 0,
        endTime: 5000,
        breakAfter: true // Break after this activity
      }
    ];
    
    // Current time is after the activity, during the break
    renderWithTheme(
      <Timeline
        entries={entries}
        totalSeconds={10000}
        currentTime={6000} // During the break
      />
    );
    
    // The completed activity should be visible
    expect(screen.getByText('Completed Activity')).toBeInTheDocument();
    
    // There should be a break indicator visible
    const breakElements = screen.getAllByTestId(/break/i);
    expect(breakElements.length).toBeGreaterThan(0);
    
    // The break should be currently "active"
    const activeBreak = screen.getByTestId('active-break');
    expect(activeBreak).toBeInTheDocument();
  });
  
  it('should handle ongoing break after completing the last activity', () => {
    // Setup entries with multiple activities and a break after the last one
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 0,
        endTime: 3000,
        breakAfter: false
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Last Activity',
        startTime: 3000,
        endTime: 8000,
        breakAfter: true // Break after this activity
      }
    ];
    
    renderWithTheme(
      <Timeline
        entries={entries}
        totalSeconds={10000}
        currentTime={9000} // During the final break
      />
    );
    
    // Both activities should be visible
    expect(screen.getByText('First Activity')).toBeInTheDocument();
    expect(screen.getByText('Last Activity')).toBeInTheDocument();
    
    // There should be an active break indicator after the last activity
    const activeBreak = screen.getByTestId('active-break');
    expect(activeBreak).toBeInTheDocument();
    
    // The break should come after the last activity
    const lastActivity = screen.getByText('Last Activity');
    const lastActivityContainer = lastActivity.closest('[data-testid^="timeline-item"]');
    expect(lastActivityContainer?.nextElementSibling).toContainElement(activeBreak);
  });
  
  it('should transition from break to new activity correctly', () => {
    // Setup entries with activities separated by a break
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 0,
        endTime: 3000,
        breakAfter: true // Break after this activity
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Second Activity',
        startTime: 5000, // Break is from 3000-5000
        endTime: 8000,
        breakAfter: false
      }
    ];
    
    // Test during the break
    const { rerender } = renderWithTheme(
      <Timeline
        entries={entries}
        totalSeconds={10000}
        currentTime={4000} // During the break
      />
    );
    
    // Both activities should be visible
    expect(screen.getByText('First Activity')).toBeInTheDocument();
    expect(screen.getByText('Second Activity')).toBeInTheDocument();
    
    // There should be an active break
    expect(screen.getByTestId('active-break')).toBeInTheDocument();
    
    // Now test after the break, during the second activity
    rerender(
      <Timeline
        entries={entries}
        totalSeconds={10000}
        currentTime={6000} // During the second activity
      />
    );
    
    // The break should now be inactive, and the second activity should be active
    expect(screen.queryByTestId('active-break')).not.toBeInTheDocument();
    expect(screen.getByTestId('active-activity')).toHaveTextContent('Second Activity');
  });
});