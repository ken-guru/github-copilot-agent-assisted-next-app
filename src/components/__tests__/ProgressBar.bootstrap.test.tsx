import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../ProgressBar';
import { TimelineEntry } from '@/types';

describe('Bootstrap ProgressBar Integration Tests', () => {
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

  it('should render Bootstrap ProgressBar component correctly', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800} // 50% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    
    expect(progressContainer).toBeInTheDocument();
    expect(progressContainer).toHaveClass('progress');
    expect(progressBarElement).toHaveClass('progress-bar');
  });

  it('should display correct progress percentage with Bootstrap ProgressBar', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800} // 50% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '50');
    expect(progressBarElement).toHaveStyle('width: 50%');
  });

  it('should use success variant for progress under 50%', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1440} // 40% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveClass('bg-success');
  });

  it('should use info variant for progress between 50-75%', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={2160} // 60% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveClass('bg-info');
  });

  it('should use warning variant for progress between 75-100%', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={3240} // 90% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveClass('bg-warning');
  });

  it('should use danger variant for progress 100% or more', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={3600} // 100% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveClass('bg-danger');
  });

  it('should cap progress at 100% even when time exceeds duration', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={5400} // 150% progress
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '100');
    expect(progressBarElement).toHaveStyle('width: 100%');
  });

  it('should show inactive state when timer is not active', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '0');
    // Opacity is set on the parent div, not the progress bar itself
    expect(progressContainer.parentElement).toHaveStyle('opacity: 0.5');
  });

  it('should maintain accessibility attributes', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    
    expect(progressContainer).toHaveAttribute('aria-label', 'Progress towards total duration');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '50');
    expect(progressBarElement).toHaveAttribute('aria-valuemin', '0');
    expect(progressBarElement).toHaveAttribute('aria-valuemax', '100');
    expect(progressBarElement).toHaveAttribute('role', 'progressbar');
  });

  it('should handle empty entries gracefully', () => {
    render(
      <ProgressBar
        entries={[]}
        totalDuration={3600}
        elapsedTime={1800}
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '0');
  });

  it('should handle zero duration gracefully', () => {
    render(
      <ProgressBar
        entries={mockEntries}
        totalDuration={0}
        elapsedTime={1800}
        timerActive={true}
      />
    );

    const progressContainer = screen.getByTestId('bootstrap-progress-bar');
    const progressBarElement = progressContainer.querySelector('.progress-bar');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '0');
  });
});
