import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActivityButton } from '@/components/ActivityButton';
import { Activity } from '@/components/ActivityManager';
import { TimelineEntry } from '@/types';

// Mock formatTime utility
jest.mock('@/utils/timeUtils', () => ({
  formatTime: jest.fn((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  })
}));

describe('ActivityButton Timer Contrast', () => {
  const mockActivity: Activity = {
    id: '1',
    name: 'Test Activity',
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  };

  const mockTimelineEntries: TimelineEntry[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Running Activity Timer Display', () => {
    it('should display timer with proper contrast for running activity', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={125} // 2:05
        />
      );

      // Should have a timer badge
      const timerBadge = screen.getByText('2:05').closest('.badge');
      expect(timerBadge).toBeInTheDocument();
      expect(timerBadge).toHaveClass('bg-primary');
      
      // Timer text should NOT have text-muted class which causes poor contrast
      const timerText = screen.getByText('2:05');
      expect(timerText).not.toHaveClass('text-muted');
      
      // Timer text should have appropriate contrast classes
      expect(timerText).toHaveClass('fw-normal');
    });

    it('should use high contrast text color for timer on primary background', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={3665} // 1:01:05
        />
      );

      const timerText = screen.getByText('1:01:05');
      
      // Should not use muted text which has poor contrast on primary background
      expect(timerText).not.toHaveClass('text-muted');
      
      // Should use Bootstrap's default badge text color (white on primary)
      // or explicitly use high contrast color
      expect(timerText).toHaveClass('fw-normal');
    });

    it('should maintain timer visibility in different states', () => {
      const { rerender } = render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={30}
        />
      );

      // Timer should be visible for running activity
      expect(screen.getByText('0:30')).toBeInTheDocument();
      
      // Timer badge should have primary background
      const timerBadge = screen.getByText('0:30').closest('.badge');
      expect(timerBadge).toHaveClass('bg-primary');

      // Rerender as not running - timer should not be displayed
      rerender(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={30}
        />
      );

      expect(screen.queryByText('0:30')).not.toBeInTheDocument();
    });

    it('should ensure timer text has appropriate font weight and styling', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={90} // 1:30
        />
      );

      const timerText = screen.getByText('1:30');
      
      // Should have normal font weight (not muted)
      expect(timerText).toHaveClass('fw-normal');
      
      // Should not have small size that makes it hard to read
      // Note: small class has been removed for better readability
      
      // Timer should be easily readable
      expect(timerText).toBeVisible();
    });
  });

  describe('Timer Badge Container', () => {
    it('should position timer badge properly in the top right', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={60}
        />
      );

      // Timer should be in the status badge container
      const statusContainer = screen.getByText('1:00').closest('.d-flex.flex-column.align-items-end');
      expect(statusContainer).toBeInTheDocument();
      
      // Badge should have proper Bootstrap classes
      const timerBadge = screen.getByText('1:00').closest('.badge');
      expect(timerBadge).toHaveClass('d-flex', 'align-items-center', 'gap-1');
    });

    it('should handle multiple badges (timer + completion) properly', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={true} // Both completed and running (edge case)
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={180}
        />
      );

      // Should show both timer and completion badge
      expect(screen.getByText('3:00')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
      
      // Both should be in the same container
      const statusContainer = screen.getByText('3:00').closest('.d-flex.flex-column.align-items-end');
      const doneText = screen.getByText('Done');
      expect(statusContainer).toContainElement(doneText);
    });
  });

  describe('Timer Accessibility', () => {
    it('should provide accessible timer information', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={300} // 5:00
        />
      );

      const timerText = screen.getByText('5:00');
      
      // Timer should be visible and accessible
      expect(timerText).toBeVisible();
      expect(timerText).toBeInTheDocument();
      
      // Badge should be properly structured for screen readers
      const timerBadge = timerText.closest('.badge');
      expect(timerBadge).toHaveClass('bg-primary');
    });
  });
});
