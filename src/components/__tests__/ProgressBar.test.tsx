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

  it('should render the progress bar with correct progress percentage', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800} // 50% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toBeInTheDocument();
    expect(progressFill).toHaveStyle('width: 50%');
  });

  it('should have green glow when less than 50% of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1440} // 40% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toHaveClass('greenGlow');
    expect(progressFill).not.toHaveClass('yellowGlow');
    expect(progressFill).not.toHaveClass('orangeGlow');
    expect(progressFill).not.toHaveClass('redPulse');
  });

  it('should have yellow glow when between 50% and 75% of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={2340} // 65% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toHaveClass('yellowGlow');
    expect(progressFill).not.toHaveClass('greenGlow');
    expect(progressFill).not.toHaveClass('orangeGlow');
    expect(progressFill).not.toHaveClass('redPulse');
  });

  it('should have orange glow when between 75% and 100% of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={3240} // 90% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toHaveClass('orangeGlow');
    expect(progressFill).not.toHaveClass('greenGlow');
    expect(progressFill).not.toHaveClass('yellowGlow');
    expect(progressFill).not.toHaveClass('redPulse');
  });

  it('should have red pulse when 100% or more of time is elapsed', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={3600} // 100% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toHaveClass('redPulse');
    expect(progressFill).not.toHaveClass('greenGlow');
    expect(progressFill).not.toHaveClass('yellowGlow');
    expect(progressFill).not.toHaveClass('orangeGlow');
    
    // We don't check computed styles as they're not reliable in Jest testing environment
  });

  it('should cap at 100% width when time exceeds provided duration', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={4500} // 125% of total duration
        timerActive={true}
      />
    );
    
    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toHaveStyle('width: 100%');
    expect(progressFill).toHaveClass('redPulse');
  });
  
  it('should have appropriate aria-valuenow attribute for accessibility', () => {
    const { container } = render(
      <ProgressBar 
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800} // 50% of total duration
        timerActive={true}
      />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });
});
