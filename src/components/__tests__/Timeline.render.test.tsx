import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../Timeline';
import { renderWithTheme } from '../../test/utils/renderWithTheme';

// Mock the useTheme hook
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'system',
    isDarkMode: false,
    setTheme: jest.fn()
  })
}));

// Setup test data
const mockTimelineEntries = [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'First Activity',
    startTime: 0,
    endTime: 6000,
    breakAfter: false
  },
  {
    id: '2',
    activityId: 'activity-2',
    activityName: 'Second Activity',
    startTime: 6000,
    endTime: 10000,
    breakAfter: true
  }
];

describe('Timeline Component Rendering', () => {
  it('should render the timeline with entries', () => {
    renderWithTheme(
      <Timeline 
        entries={mockTimelineEntries} 
        totalSeconds={10000} 
        currentTime={5000} 
      />
    );
    
    // Check that both activities are rendered
    expect(screen.getByText('First Activity')).toBeInTheDocument();
    expect(screen.getByText('Second Activity')).toBeInTheDocument();
    
    // Check that the timeline container exists
    const timelineContainer = screen.getByTestId('timeline-container');
    expect(timelineContainer).toBeInTheDocument();
  });
  
  it('should render an empty state when no entries are present', () => {
    renderWithTheme(
      <Timeline 
        entries={[]} 
        totalSeconds={10000} 
        currentTime={5000} 
      />
    );
    
    // There should be an empty state message
    expect(screen.getByText(/no activities/i)).toBeInTheDocument();
  });
  
  it('should adjust timeline ruler when activities run into overtime', () => {
    // Create entries that go beyond the total time
    const overtimeEntries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'First Activity',
        startTime: 0,
        endTime: 6000,
        breakAfter: false
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Second Activity',
        startTime: 6000,
        endTime: 15000, // Goes beyond totalSeconds
        breakAfter: false
      }
    ];
    
    renderWithTheme(
      <Timeline 
        entries={overtimeEntries} 
        totalSeconds={10000} 
        currentTime={12000} 
      />
    );
    
    // The timeline should still render all activities
    expect(screen.getByText('First Activity')).toBeInTheDocument();
    expect(screen.getByText('Second Activity')).toBeInTheDocument();
    
    // There should be an overtime indicator visible
    expect(screen.getByTestId('timeline-container').querySelector('.overtime')).not.toBeNull();
  });
});