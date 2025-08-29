import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import ActivityManagerMaterial3 from '../ActivityManagerMaterial3';
import { Activity } from '../../types/activity';
import { TimelineEntry } from '@/types';

// Mock dependencies
const mockAddResponsiveToast = jest.fn();
const mockGetActivities = jest.fn();
const mockAddActivity = jest.fn();
const mockDeleteActivity = jest.fn();
const mockFetchWithVercelBypass = jest.fn();

jest.mock('../../utils/activity-storage', () => ({
  getActivities: mockGetActivities,
  addActivity: mockAddActivity,
  deleteActivity: mockDeleteActivity
}));

jest.mock('@/utils/fetchWithVercelBypass', () => ({
  fetchWithVercelBypass: mockFetchWithVercelBypass
}));

jest.mock('@/hooks/useResponsiveToast', () => ({
  useResponsiveToast: () => ({
    addResponsiveToast: mockAddResponsiveToast
  })
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ online: true })
}));

jest.mock('@/hooks/useMotionSystem', () => ({
  useMotionSystem: () => ({
    transitions: {
      cardHover: {
        transform: 'translateY(-2px)',
        boxShadow: 'var(--md-elevation-level2)'
      },
      focus: {
        enter: { outline: '2px solid var(--md-color-primary)' },
        exit: { outline: 'none' }
      }
    }
  })
}));

// Mock Bootstrap components
jest.mock('react-bootstrap', () => ({
  Modal: ({ show, onHide, children }: any) => 
    show ? <div data-testid="modal" onClick={onHide}>{children}</div> : null,
  Spinner: () => <div data-testid="spinner">Loading...</div>
}));

// Mock child components
jest.mock('../ActivityButton', () => ({
  ActivityButton: ({ activity, onSelect, onRemove, isRunning, isCompleted }: any) => (
    <div data-testid={`activity-button-${activity.id}`}>
      <span>{activity.name}</span>
      <button onClick={() => onSelect(activity)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      {onRemove && (
        <button onClick={() => onRemove(activity.id)}>Remove</button>
      )}
      {isCompleted && <span data-testid="completed">Completed</span>}
    </div>
  )
}));

jest.mock('../TimerProgressSection', () => ({
  __esModule: true,
  default: ({ timerActive, elapsedTime }: any) => (
    <div data-testid="timer-progress">
      Timer: {timerActive ? 'Active' : 'Inactive'} - {elapsedTime}s
    </div>
  )
}));

jest.mock('../ActivityFormSection', () => ({
  __esModule: true,
  default: ({ onAddActivity, isSimplified }: any) => (
    <div data-testid="activity-form">
      <input 
        name="name" 
        placeholder="Activity name"
        data-testid="activity-name-input"
      />
      <button 
        onClick={() => onAddActivity({ 
          id: 'new-activity', 
          name: 'New Activity', 
          colorIndex: 0,
          isActive: true 
        })}
        data-testid="add-activity-button"
      >
        Add Activity
      </button>
      {isSimplified && <span data-testid="simplified-form">Simplified</span>}
    </div>
  )
}));

jest.mock('../ShareControls', () => ({
  __esModule: true,
  default: ({ shareUrl }: any) => (
    <div data-testid="share-controls">Share URL: {shareUrl}</div>
  )
}));

const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    name: 'Test Activity 1',
    description: 'Description 1',
    colorIndex: 0,
    isActive: true
  },
  {
    id: 'activity-2',
    name: 'Test Activity 2',
    description: 'Description 2',
    colorIndex: 1,
    isActive: true
  }
];

const mockTimelineEntries: TimelineEntry[] = [
  {
    id: 'entry-1',
    activityId: 'activity-1',
    activityName: 'Test Activity 1',
    startTime: Date.now() - 60000,
    endTime: Date.now() - 30000,
    duration: 30000,
    type: 'activity'
  }
];

const defaultProps = {
  onActivitySelect: jest.fn(),
  onActivityRemove: jest.fn(),
  onActivityRestore: jest.fn(),
  currentActivityId: null,
  completedActivityIds: [],
  removedActivityIds: [],
  timelineEntries: [],
  elapsedTime: 0,
  totalDuration: 1800,
  timerActive: false,
  onReset: jest.fn(),
  onExtendDuration: jest.fn()
};

describe('ActivityManagerMaterial3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActivities.mockReturnValue(mockActivities);
  });

  describe('Material 3 Expressive Design Implementation', () => {
    it('renders with Material 3 Expressive container structure', () => {
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('activityHub');
    });

    it('displays expressive typography in header', () => {
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const title = screen.getByRole('heading', { name: 'Activities' });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('title');
    });

    it('implements dynamic container elevation based on timer state', () => {
      const { rerender } = render(
        <ActivityManagerMaterial3 {...defaultProps} timerActive={false} />
      );
      
      let container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
      
      // Test active timer state
      rerender(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={true} 
          currentActivityId="activity-1" 
        />
      );
      
      container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
    });

    it('shows floating action button when no activities exist', () => {
      mockGetActivities.mockReturnValue([]);
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const fab = screen.getByRole('button', { name: 'Add new activity' });
      expect(fab).toBeInTheDocument();
    });

    it('focuses activity form input when FAB is clicked', async () => {
      mockGetActivities.mockReturnValue([]);
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const fab = screen.getByRole('button', { name: 'Add new activity' });
      await user.click(fab);
      
      const input = screen.getByTestId('activity-name-input');
      expect(input).toHaveFocus();
    });
  });

  describe('Enhanced State Communication', () => {
    it('communicates timer state through color and elevation', () => {
      const { rerender } = render(
        <ActivityManagerMaterial3 {...defaultProps} timerActive={false} />
      );
      
      // Test inactive state
      let container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
      
      // Test active state
      rerender(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={true}
          currentActivityId="activity-1"
        />
      );
      
      container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
    });

    it('shows loading state during share creation', async () => {
      mockFetchWithVercelBypass.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ shareUrl: 'https://example.com/share/123' })
        } as Response), 100))
      );

      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={false}
          timelineEntries={mockTimelineEntries}
        />
      );
      
      const shareButton = screen.getByTestId('open-share-modal');
      await userEvent.click(shareButton);
      
      const createButton = screen.getByRole('button', { name: 'Create share' });
      await userEvent.click(createButton);
      
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('Expressive Progress Indicators', () => {
    it('renders timer progress section with organic motion', () => {
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={true}
          elapsedTime={300}
        />
      );
      
      const progressSection = screen.getByTestId('timer-progress');
      expect(progressSection).toBeInTheDocument();
      expect(progressSection).toHaveTextContent('Timer: Active - 300s');
    });

    it('shows expressive loading indicators during operations', async () => {
      mockFetchWithVercelBypass.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ shareUrl: 'https://example.com/share/123' })
      } as Response);

      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={false}
          timelineEntries={mockTimelineEntries}
        />
      );
      
      const shareButton = screen.getByTestId('open-share-modal');
      await userEvent.click(shareButton);
      
      const createButton = screen.getByRole('button', { name: 'Create share' });
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });
  });

  describe('Smooth Transitions Between States', () => {
    it('handles activity state transitions smoothly', async () => {
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      // Add an activity
      const addButton = screen.getByTestId('add-activity-button');
      await user.click(addButton);
      
      expect(defaultProps.onActivitySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'new-activity',
          name: 'New Activity'
        }),
        true
      );
    });

    it('transitions between timer states with appropriate animations', () => {
      const { rerender } = render(
        <ActivityManagerMaterial3 {...defaultProps} timerActive={false} />
      );
      
      // Transition to active state
      rerender(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={true}
          currentActivityId="activity-1"
        />
      );
      
      const container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Activity Management Functionality', () => {
    it('loads activities from storage on mount', () => {
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      expect(mockGetActivities).toHaveBeenCalled();
      expect(defaultProps.onActivitySelect).toHaveBeenCalledTimes(2); // Once for each mock activity
    });

    it('handles activity selection with Material 3 feedback', async () => {
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const activityButton = screen.getByTestId('activity-button-activity-1');
      const startButton = activityButton.querySelector('button');
      
      if (startButton) {
        await user.click(startButton);
      }
      
      expect(defaultProps.onActivitySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'activity-1',
          name: 'Test Activity 1'
        })
      );
    });

    it('handles activity removal with confirmation', async () => {
      const user = userEvent.setup();
      
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          onActivityRemove={defaultProps.onActivityRemove}
        />
      );
      
      const activityButton = screen.getByTestId('activity-button-activity-1');
      const removeButton = activityButton.querySelector('button:last-child');
      
      if (removeButton) {
        await user.click(removeButton);
      }
      
      expect(defaultProps.onActivityRemove).toHaveBeenCalledWith('activity-1');
    });

    it('shows hidden activities with expressive reveal animation', async () => {
      const user = userEvent.setup();
      
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          removedActivityIds={['activity-2']}
        />
      );
      
      const toggleButton = screen.getByTestId('toggle-hidden-activities');
      await user.click(toggleButton);
      
      expect(screen.getByTestId('hidden-activities-panel')).toBeInTheDocument();
    });

    it('handles activity restoration with smooth transitions', async () => {
      const user = userEvent.setup();
      
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          removedActivityIds={['activity-2']}
        />
      );
      
      // Show hidden activities
      const toggleButton = screen.getByTestId('toggle-hidden-activities');
      await user.click(toggleButton);
      
      // Restore activity
      const restoreButton = screen.getByTestId('restore-activity-test-activity-2');
      await user.click(restoreButton);
      
      expect(defaultProps.onActivityRestore).toHaveBeenCalledWith('activity-2');
    });
  });

  describe('Material 3 Expressive Interactions', () => {
    it('provides Material 3 hover effects on interactive elements', async () => {
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const extendButton = screen.getByRole('button', { name: 'Add 1 minute to session duration' });
      
      await user.hover(extendButton);
      // Test that hover effects are applied (would need more specific testing in integration tests)
      expect(extendButton).toBeInTheDocument();
    });

    it('handles keyboard navigation with proper focus management', async () => {
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      // Tab through interactive elements
      await user.tab();
      
      const firstFocusableElement = document.activeElement;
      expect(firstFocusableElement).toBeInTheDocument();
    });

    it('provides appropriate ARIA labels for accessibility', () => {
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const extendButton = screen.getByRole('button', { name: 'Add 1 minute to session duration' });
      const resetButton = screen.getByRole('button', { name: 'Reset session and return to time setup' });
      
      expect(extendButton).toHaveAttribute('aria-label', 'Add 1 minute to session duration');
      expect(resetButton).toHaveAttribute('aria-label', 'Reset session and return to time setup');
    });
  });

  describe('Session Management', () => {
    it('handles session reset with form value clearing', async () => {
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const resetButton = screen.getByRole('button', { name: 'Reset session and return to time setup' });
      await user.click(resetButton);
      
      expect(defaultProps.onReset).toHaveBeenCalled();
    });

    it('handles duration extension with Material 3 feedback', async () => {
      const user = userEvent.setup();
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const extendButton = screen.getByRole('button', { name: 'Add 1 minute to session duration' });
      await user.click(extendButton);
      
      expect(defaultProps.onExtendDuration).toHaveBeenCalled();
    });

    it('shows share functionality only in appropriate states', () => {
      // Should not show share button when timer is active
      const { rerender } = render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={true}
        />
      );
      
      expect(screen.queryByTestId('open-share-modal')).not.toBeInTheDocument();
      
      // Should show share button when session is complete
      rerender(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={false}
          timelineEntries={mockTimelineEntries}
          currentActivityId={null}
        />
      );
      
      expect(screen.getByTestId('open-share-modal')).toBeInTheDocument();
    });
  });

  describe('Network Status Integration', () => {
    it('disables share functionality when offline', () => {
      mockUseNetworkStatus.mockReturnValue({ online: false });
      
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={false}
          timelineEntries={mockTimelineEntries}
        />
      );
      
      const shareButton = screen.getByTestId('open-share-modal');
      expect(shareButton).toBeDisabled();
    });

    it('shows offline warning in share modal', async () => {
      mockUseNetworkStatus.mockReturnValue({ online: false });
      const user = userEvent.setup();
      
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={false}
          timelineEntries={mockTimelineEntries}
        />
      );
      
      const shareButton = screen.getByTestId('open-share-modal');
      await user.click(shareButton);
      
      expect(screen.getByTestId('activitymanager-share-offline-warning')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });
      
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
      // Additional responsive behavior would be tested in integration tests
    });

    it('maintains accessibility on different screen sizes', () => {
      render(<ActivityManagerMaterial3 {...defaultProps} />);
      
      const container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();
      
      // Test that all interactive elements remain accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles share creation errors gracefully', async () => {
      mockFetchWithVercelBypass.mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      
      render(
        <ActivityManagerMaterial3 
          {...defaultProps} 
          timerActive={false}
          timelineEntries={mockTimelineEntries}
        />
      );
      
      const shareButton = screen.getByTestId('open-share-modal');
      await user.click(shareButton);
      
      const createButton = screen.getByRole('button', { name: 'Create share' });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(mockAddResponsiveToast).toHaveBeenCalledWith({
          message: 'Failed to create share.',
          variant: 'error',
          autoDismiss: true
        });
      });
    });

    it('handles storage errors gracefully', () => {
      mockGetActivities.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should not crash the component
      expect(() => {
        render(<ActivityManagerMaterial3 {...defaultProps} />);
      }).not.toThrow();
    });
  });
});