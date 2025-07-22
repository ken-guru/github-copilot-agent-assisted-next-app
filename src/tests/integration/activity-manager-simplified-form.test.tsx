import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityManager from '../../components/ActivityManager';
import { ToastProvider } from '../../components/ToastNotificationProvider';
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
      const { rerender } = render(
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      rerender(
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });
      const formColumn = screen.getByTestId('activity-form-column');
      expect(formColumn).toBeInTheDocument();
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('placeholder', 'Quick add activity name');
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
    });

    it('allows adding activities through simplified form', async () => {
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
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      rerender(
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Quick Activity' } });
      const addButton = screen.getByRole('button', { name: /add activity/i });
      fireEvent.click(addButton);
      await waitFor(() => {
        expect(mockOnActivitySelect).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Quick Activity',
            description: '',
            id: expect.any(String),
            colorIndex: expect.any(Number),
            isActive: true
          }),
          true
        );
      });
    });

    it('maintains simplified form after adding activity', async () => {
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
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      rerender(
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByRole('button', { name: /add activity/i }));
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
    });

    it('handles disabled state when time is up', async () => {
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
        <ToastProvider>
          <ActivityManager {...defaultProps} isTimeUp={true} />
        </ToastProvider>
      );
      rerender(
        <ToastProvider>
          <ActivityManager {...defaultProps} isTimeUp={true} />
        </ToastProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('activity-form-column')).toBeInTheDocument();
      });
      const nameInput = screen.getByLabelText(/name/i);
      const addButton = screen.getByRole('button', { name: /add activity/i });
      expect(nameInput).toBeDisabled();
      expect(addButton).toBeDisabled();
    });

    it('shows progress bar alongside simplified form', async () => {
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
        <ToastProvider>
          <ActivityManager {...defaultProps} timerActive={true} elapsedTime={1800} totalDuration={3600} />
        </ToastProvider>
      );
      rerender(
        <ToastProvider>
          <ActivityManager {...defaultProps} timerActive={true} elapsedTime={1800} totalDuration={3600} />
        </ToastProvider>
      );
      const formColumn = screen.getByTestId('activity-form-column');
      expect(formColumn).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    });
  });

  describe('Activity List Integration', () => {
    it('shows activity list alongside simplified form when activities exist', async () => {
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
      const { rerender } = render(
        <ToastProvider>
          <ActivityManager {...defaultProps} timerActive={true} elapsedTime={1800} totalDuration={3600} />
        </ToastProvider>
      );
      rerender(
        <ToastProvider>
          <ActivityManager {...defaultProps} timerActive={true} elapsedTime={1800} totalDuration={3600} />
        </ToastProvider>
      );
      expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    });

    it('shows empty state when no activities exist', async () => {
      mockActivityStorage.getActivities.mockReturnValue([]);
      render(
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      });
      expect(screen.getByText(/no activities defined/i)).toBeInTheDocument();
      expect(screen.queryByTestId('activity-form-column')).not.toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('shows reset button when onReset is provided', async () => {
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'reset-1',
          name: 'Resettable Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);
      render(
        <ToastProvider>
          <ActivityManager {...defaultProps} />
        </ToastProvider>
      );
      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeInTheDocument();
      fireEvent.click(resetButton);
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('does not show reset button when onReset is not provided', async () => {
      mockActivityStorage.getActivities.mockReturnValue([
        {
          id: 'reset-1',
          name: 'Resettable Activity',
          description: 'Test',
          colorIndex: 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ]);
      render(
        <ToastProvider>
          <ActivityManager {...defaultProps} onReset={undefined} />
        </ToastProvider>
      );
      expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
    });
  });
});
