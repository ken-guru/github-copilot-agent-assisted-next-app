/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityManager from '../../components/ActivityManager';
import { Activity } from '../../types/activity';
import * as activityStorage from '../../utils/activity-storage';

// Mock the storage utilities
jest.mock('../../utils/activity-storage', () => ({
  getActivities: jest.fn((): Activity[] => []),
  addActivity: jest.fn(),
  deleteActivity: jest.fn()
}));

const mockActivityStorage = jest.mocked(activityStorage);

// Mock the theme hook
jest.mock('../../hooks/useThemeReactive', () => ({
  useThemeReactive: () => 'light'
}));

// Mock the color utilities
jest.mock('../../utils/colors', () => ({
  getActivityColorsForTheme: () => [
    { background: '#ff0000', border: '#cc0000' },
    { background: '#00ff00', border: '#00cc00' }
  ],
  getNextAvailableColorSet: (index: number) => ({
    background: `#ff${index}${index}00`,
    border: `#cc${index}${index}00`
  }),
  getSmartColorIndex: () => 0
}));

jest.mock('../../utils/colorNames', () => ({
  getColorName: (index: number) => `Color ${index}`
}));

describe('ActivityManager Simplified Form Integration', () => {
  const mockOnActivitySelect = jest.fn();
  const mockOnActivityRemove = jest.fn();
  const mockOnReset = jest.fn();

  const defaultProps = {
    onActivitySelect: mockOnActivitySelect,
    onActivityRemove: mockOnActivityRemove,
    currentActivityId: null,
    completedActivityIds: [],
    timelineEntries: [],
    isTimeUp: false,
    elapsedTime: 0,
    totalDuration: 3600,
    timerActive: false,
    onReset: mockOnReset
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Timeline Context (Simplified Form)', () => {
    it('renders simplified activity form in timeline context when activities exist', async () => {
      // Provide some activities so the form renders
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'test-1',
          name: 'Test Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);

      const { rerender } = render(<ActivityManager {...defaultProps} />);
      rerender(<ActivityManager {...defaultProps} />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });

      // Should show simplified form (only name field)
      const formColumn = screen.getByTestId('activity-form-column');
      expect(formColumn).toBeInTheDocument();

      // Check that only name field is present - look for input with name-related attributes
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('placeholder', 'Quick add activity name');

      // Description and color fields should not be present
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
    });

    it('allows adding activities through simplified form', async () => {
      // Start with some activities so the form renders
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'existing-1',
          name: 'Existing Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);

      const { rerender } = render(<ActivityManager {...defaultProps} />);
      rerender(<ActivityManager {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });

      // Add an activity using simplified form
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Quick Activity' } });

      const addButton = screen.getByRole('button', { name: /add activity/i });
      fireEvent.click(addButton);

      // Should call onActivitySelect with the new activity
      await waitFor(() => {
        expect(mockOnActivitySelect).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Quick Activity',
            description: '', // Should be empty in simplified mode
            id: expect.any(String),
            colorIndex: expect.any(Number),
            isActive: true
          }),
          true // justAdd flag
        );
      });
    });

    it('maintains simplified form after adding activity', async () => {
      // Start with existing activities so form renders
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'existing-1',
          name: 'Existing Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);

      const { rerender } = render(<ActivityManager {...defaultProps} />);
      rerender(<ActivityManager {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });

      // Add activity
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByRole('button', { name: /add activity/i }));

      // Form should still be simplified after adding
      await waitFor(() => {
        // Name field should still be present
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        // Description and color should still be absent
        expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
      });
    });

    it('keeps form enabled when time is up', async () => {
      // Start with activities so form renders
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'existing-1',
          name: 'Existing Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);

      const { rerender } = render(
        <ActivityManager 
          {...defaultProps} 
          isTimeUp={true}
        />
      );
      rerender(
        <ActivityManager 
          {...defaultProps} 
          isTimeUp={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });

      // Form should remain enabled when time is up
      const nameInput = screen.getByLabelText(/name/i);
      const addButton = screen.getByRole('button', { name: /add activity/i });

      expect(nameInput).not.toBeDisabled();
      expect(addButton).not.toBeDisabled();
    });

    it('shows progress bar alongside simplified form', async () => {
      // Start with activities so form renders
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'existing-1',
          name: 'Existing Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);

      const { rerender } = render(
        <ActivityManager 
          {...defaultProps}
          timerActive={true}
          elapsedTime={1800} // 30 minutes
          totalDuration={3600} // 60 minutes
        />
      );
      rerender(
        <ActivityManager 
          {...defaultProps}
          timerActive={true}
          elapsedTime={1800} // 30 minutes
          totalDuration={3600} // 60 minutes
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });

      // Progress bar should be present
      // Note: The ProgressBar component should have its own test-id
      const formColumn = screen.getByTestId('activity-form-column');
      expect(formColumn).toBeInTheDocument();

      // Simplified form should still be there
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    });
  });

  describe('Activity List Integration', () => {
    it('shows activity list alongside simplified form when activities exist', async () => {
      // Mock existing activities
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'activity-1',
          name: 'Existing Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);

      const { rerender } = render(<ActivityManager {...defaultProps} />);
      
      // Rerender to trigger effect
      rerender(<ActivityManager {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      });

      // Both form and activity list should be present
      expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      
      // Form should still be simplified
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    });

    it('shows empty state when no activities exist', async () => {
      // Ensure mock returns empty array
      mockActivityStorage.getActivities.mockReturnValue([]);
      
      render(<ActivityManager {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });

      expect(screen.getByText(/no activities defined/i)).toBeInTheDocument();
      
      // Form should NOT be present in empty state
      expect(screen.queryByTestId('activity-form-column')).not.toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('shows reset button when onReset is provided', async () => {
      render(<ActivityManager {...defaultProps} />);

      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeInTheDocument();

      fireEvent.click(resetButton);
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('does not show reset button when onReset is not provided', async () => {
      render(
        <ActivityManager 
          {...defaultProps} 
          onReset={undefined}
        />
      );

      expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
    });
  });
});
