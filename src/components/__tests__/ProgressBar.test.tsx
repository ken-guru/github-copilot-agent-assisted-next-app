import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';
import { TimelineEntry } from '../Timeline';

describe('ProgressBar Component', () => {
  const mockEntries: TimelineEntry[] = [
    {
      id: '1',
      activityId: 'activity-1',
      activityName: 'Task 1',
      startTime: 0,
      endTime: 1800000, // 30 minutes
      colors: {
        background: '#E8F5E9',
        text: '#1B5E20',
        border: '#2E7D32'
      }
    },
  ];

  it('should render null when timer is not active', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render the progress bar with segments', () => {
    render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should render the progress bar with correct segment width', () => {
    render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );
    const segment = screen.getByText('Task 1').closest('.segment');
    expect(segment).toHaveStyle('width: 50%');
  });
});
