import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock time entries for testing
const mockTimelineEntries = [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Test Activity 1',
    startTime: 0,
    endTime: 5000,
    breakAfter: false
  },
  {
    id: '2',
    activityId: 'activity-2',
    activityName: 'Test Activity 2',
    startTime: 5000,
    endTime: 10000,
    breakAfter: true
  }
];

const renderTimeline = (props = {}) => {
  const defaultProps = {
    entries: mockTimelineEntries,
    totalSeconds: 10000,
    currentTime: 3000
  };

  return renderWithTheme(
    <Timeline {...defaultProps} {...props} />
  );
};

describe('Timeline Component', () => {
  it('should render the timeline with entries', () => {
    renderTimeline();
    
    expect(screen.getByText('Test Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Test Activity 2')).toBeInTheDocument();
  });

  it('should render an empty state when no entries are present', () => {
    renderTimeline({ entries: [] });
    
    expect(screen.getByText(/no activities/i)).toBeInTheDocument();
  });

  it('should adjust timeline ruler when activities run into overtime', () => {
    const overtimeEntries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Test Activity 1',
        startTime: 0,
        endTime: 5000,
        breakAfter: false
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Test Activity 2',
        startTime: 5000,
        endTime: 15000, // This goes beyond the totalSeconds
        breakAfter: false
      }
    ];
    
    renderTimeline({
      entries: overtimeEntries,
      currentTime: 12000 // In overtime
    });
    
    expect(screen.getByText('Test Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Test Activity 2')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-container').querySelector('.overtime')).not.toBeNull();
  });

  it('updates activity colors when theme changes', () => {
    // Mock theme changes
    const mockIsDarkMode = jest.fn(() => false);
    jest.spyOn(require('../../hooks/useTheme'), 'useTheme').mockImplementation(() => ({
      theme: 'light',
      isDarkMode: false,
      setTheme: jest.fn()
    }));
    
    renderTimeline();
    
    // The timeline should have rendered with light theme colors
    const timelineItems = screen.getAllByTestId(/timeline-item/);
    expect(timelineItems.length).toBeGreaterThan(0);
    
    // Mock a theme change to dark mode
    jest.spyOn(require('../../hooks/useTheme'), 'useTheme').mockImplementation(() => ({
      theme: 'dark',
      isDarkMode: true,
      setTheme: jest.fn()
    }));
    
    // Rerender with the new theme
    renderTimeline();
    
    // Check that the timeline items still exist after theme change
    expect(screen.getAllByTestId(/timeline-item/).length).toBeGreaterThan(0);
  });
});