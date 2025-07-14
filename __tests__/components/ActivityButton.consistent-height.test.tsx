import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityButton from '../../components/ActivityButton';
import { Activity } from '../../components/ActivityManager';
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

describe('ActivityButton Consistent Height', () => {
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

  describe('Consistent Vertical Space', () => {
    it('should maintain consistent height between different activity states', () => {
      // Test pending state
      const { rerender } = render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      const pendingCard = document.querySelector('.card') as HTMLElement;
      const pendingHeight = pendingCard?.offsetHeight || 0;

      // Test running state
      rerender(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={125}
        />
      );

      const runningCard = document.querySelector('.card') as HTMLElement;
      const runningHeight = runningCard?.offsetHeight || 0;

      // Test completed state
      rerender(
        <ActivityButton
          activity={mockActivity}
          isCompleted={true}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      const completedCard = document.querySelector('.card') as HTMLElement;
      const completedHeight = completedCard?.offsetHeight || 0;

      // All states should have the same height (within a small tolerance for rounding)
      expect(Math.abs(pendingHeight - runningHeight)).toBeLessThan(5);
      expect(Math.abs(pendingHeight - completedHeight)).toBeLessThan(5);
      expect(Math.abs(runningHeight - completedHeight)).toBeLessThan(5);
    });

    it('should maintain consistent right-side container height', () => {
      const { rerender } = render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      // Get the right-side container with buttons
      const pendingRightContainer = screen.getByRole('button', { name: /start/i }).parentElement?.parentElement;
      const pendingContainerHeight = pendingRightContainer?.getBoundingClientRect().height || 0;

      // Test completed state
      rerender(
        <ActivityButton
          activity={mockActivity}
          isCompleted={true}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      // Get the right-side container with just the badge
      const completedRightContainer = screen.getByLabelText('Completed').parentElement;
      const completedContainerHeight = completedRightContainer?.getBoundingClientRect().height || 0;

      // Both containers should have similar heights
      expect(Math.abs(pendingContainerHeight - completedContainerHeight)).toBeLessThan(5);
    });

    it('should use consistent minimum height for right-side content area', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={true}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      const rightSideContainer = screen.getByLabelText('Completed').parentElement;
      
      // Should have minimum height matching button containers
      expect(rightSideContainer).toHaveStyle({
        minHeight: '32px'
      });
    });

    it('should prevent layout shift when activity state changes', () => {
      const { rerender } = render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      const initialCard = document.querySelector('.card-body') as HTMLElement;
      const initialRect = initialCard?.getBoundingClientRect();

      // Change to completed state
      rerender(
        <ActivityButton
          activity={mockActivity}
          isCompleted={true}
          isRunning={false}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      const completedCard = document.querySelector('.card-body') as HTMLElement;
      const completedRect = completedCard?.getBoundingClientRect();

      // Card body should maintain the same height
      expect(Math.abs((initialRect?.height || 0) - (completedRect?.height || 0))).toBeLessThan(2);
    });
  });

  describe('Button Container Sizing', () => {
    it('should ensure button containers use consistent height standards', () => {
      render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={false}
          onSelect={jest.fn()}
          onRemove={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={0}
        />
      );

      const startButton = screen.getByRole('button', { name: /start/i });
      const removeButton = screen.getByRole('button', { name: /remove/i });

      // Both buttons should be small size for consistent layout
      expect(startButton).toHaveClass('btn-sm');
      expect(removeButton).toHaveClass('btn-sm');
    });

    it('should maintain button container alignment when badges are present', () => {
      const { rerender } = render(
        <ActivityButton
          activity={mockActivity}
          isCompleted={false}
          isRunning={true}
          onSelect={jest.fn()}
          timelineEntries={mockTimelineEntries}
          elapsedTime={125}
        />
      );

      // Should have both timer badge and complete button
      expect(screen.getByText('2:05')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();

      // Both elements should be in the same container
      const rightContainer = screen.getByText('2:05').parentElement?.parentElement;
      const completeButton = screen.getByRole('button', { name: /complete/i });
      
      expect(rightContainer).toContainElement(completeButton);
    });
  });
});
