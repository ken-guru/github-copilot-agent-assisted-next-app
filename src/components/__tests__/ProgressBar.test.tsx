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

  // Helper function to get the progress bar container
  const getProgressBarContainer = () => {
    const outerContainer = screen.getByRole('complementary', { name: 'Progress' });
    // The progress bar container is the first child with aria-valuenow
    return outerContainer.querySelector('[aria-valuenow]') as HTMLElement;
  };

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

  it('should display a break when an activity is completed and a new one is started after a few seconds', () => {
    const startTime1 = Date.now() - 20000; // 20 seconds ago
    const endTime1 = Date.now() - 10000; // 10 seconds ago
    const startTime2 = Date.now() - 5000; // 5 seconds ago
    const endTime2 = Date.now(); // now

    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: startTime1,
        endTime: endTime1,
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
        startTime: startTime2,
        endTime: endTime2,
        colors: {
          background: '#FFEBEE',
          text: '#C62828',
          border: '#B71C1C'
        }
      }
    ];

    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={30}
        timerActive={true}
      />
    );

    expect(container.querySelector('.breakSegment')).toBeInTheDocument();
  });

  describe('Time-based color states', () => {
    const totalDuration = 3600; // 1 hour in seconds

    it('should show green glow when more than 50% time remaining', () => {
      render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={totalDuration * 0.2} // 20% elapsed, 80% remaining
          timerActive={true}
        />
      );
      
      const progressBar = getProgressBarContainer();
      expect(progressBar).toHaveClass('stateGreen');
    });

    it('should show yellow glow when 25-50% time remaining', () => {
      render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={totalDuration * 0.6} // 60% elapsed, 40% remaining
          timerActive={true}
        />
      );
      
      const progressBar = getProgressBarContainer();
      expect(progressBar).toHaveClass('stateYellow');
    });

    it('should show orange glow when less than 25% time remaining', () => {
      render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={totalDuration * 0.8} // 80% elapsed, 20% remaining
          timerActive={true}
        />
      );
      
      const progressBar = getProgressBarContainer();
      expect(progressBar).toHaveClass('stateOrange');
    });

    it('should show pulsing red glow when time has expired', () => {
      render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={totalDuration + 1} // Time expired
          timerActive={true}
        />
      );
      
      const progressBar = getProgressBarContainer();
      expect(progressBar).toHaveClass('stateRed', 'statePulsing');
    });

    it('should maintain pulsing red state without showing overtime', () => {
      render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={totalDuration * 1.5} // 50% overtime
          timerActive={true}
        />
      );
      
      const progressBar = getProgressBarContainer();
      expect(progressBar).toHaveClass('stateRed', 'statePulsing');
      
      // Check that the progress bar doesn't show more than 100% completion
      const segments = screen.getAllByRole('progressbar');
      const totalWidth = segments.reduce((sum, segment) => {
        const width = parseFloat(window.getComputedStyle(segment).width) || 0;
        return sum + width;
      }, 0);
      
      expect(totalWidth).toBeLessThanOrEqual(100);
    });
  });
});
