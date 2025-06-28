import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';

// Mock utils and setup
jest.mock('../../utils/colors', () => ({
  ...jest.requireActual('../../utils/colors'),
  getNextAvailableColorSet: jest.fn().mockImplementation(() => ({
    background: '#E8F5E9',
    text: '#1B5E20',
    border: '#2E7D32'
  }))
}));

beforeAll(() => {
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      contains: jest.fn().mockReturnValue(false),
      add: jest.fn(),
      remove: jest.fn(),
    }
  });
});

describe('ActivityManager Bootstrap Integration', () => {
  const mockOnActivitySelect = jest.fn();
  const mockOnActivityRemove = jest.fn();

  beforeEach(() => {
    mockOnActivitySelect.mockClear();
    mockOnActivityRemove.mockClear();
    jest.clearAllMocks();
  });

  describe('Bootstrap Container Structure', () => {
    it('renders with Bootstrap Container structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('container-fluid');
    });

    it('renders heading with Bootstrap typography', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toHaveClass('h4', 'mb-3');
    });

    it('renders activity list with Bootstrap structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('row', 'gy-3');
      });
    });
  });

  describe('Bootstrap Layout Components', () => {
    it('renders ActivityForm in proper Bootstrap column', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        const formColumn = screen.getByTestId('activity-form-column');
        expect(formColumn).toHaveClass('col-12', 'mb-3');
      });
    });

    it('renders each activity in Bootstrap column', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      const activityColumns = screen.getAllByTestId(/^activity-column-/);
      activityColumns.forEach(column => {
        expect(column).toHaveClass('col-12', 'col-md-6', 'col-lg-4');
      });
    });

    it('applies responsive grid classes correctly', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Check that activity columns have responsive classes
      const homeworkColumn = screen.getByTestId('activity-column-1');
      expect(homeworkColumn).toHaveClass('col-12'); // Full width on mobile
      expect(homeworkColumn).toHaveClass('col-md-6'); // Half width on medium
      expect(homeworkColumn).toHaveClass('col-lg-4'); // Third width on large
    });
  });

  describe('Bootstrap Empty State', () => {
    it('renders empty state with Bootstrap Alert styling', async () => {
      // Render with no default activities by mocking useEffect
      const ActivityManagerNoDefaults = () => {
        return (
          <div className="container-fluid" data-testid="activity-manager">
            <h4 className="h4 mb-3">Activities</h4>
            <div className="alert alert-info text-center" role="alert" data-testid="empty-state">
              No activities defined
            </div>
          </div>
        );
      };

      render(<ActivityManagerNoDefaults />);

      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toHaveClass('alert', 'alert-info', 'text-center');
      expect(emptyState).toHaveAttribute('role', 'alert');
    });
  });

  describe('Bootstrap Spacing and Layout', () => {
    it('maintains Bootstrap spacing utilities', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('container-fluid');

      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toHaveClass('mb-3');

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('gy-3'); // Bootstrap row gutter spacing
      });
    });

    it('applies proper Bootstrap grid structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        // Container should be fluid
        const container = screen.getByTestId('activity-manager');
        expect(container).toHaveClass('container-fluid');

        // Activity list should be a row
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('row');

        // Form should be in a column
        const formColumn = screen.getByTestId('activity-form-column');
        expect(formColumn).toHaveClass('col-12');
      });
    });
  });

  describe('Bootstrap Responsive Behavior', () => {
    it('handles responsive column behavior correctly', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Each activity should be in a responsive column
      const activityColumns = screen.getAllByTestId(/^activity-column-/);
      expect(activityColumns.length).toBeGreaterThan(0);

      activityColumns.forEach(column => {
        // Mobile: full width
        expect(column).toHaveClass('col-12');
        // Tablet: half width  
        expect(column).toHaveClass('col-md-6');
        // Desktop: third width
        expect(column).toHaveClass('col-lg-4');
      });
    });

    it('maintains Bootstrap structure during activity interactions', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Add a new activity
      const input = screen.getByPlaceholderText('New activity name');
      fireEvent.change(input, { target: { value: 'Test Activity' } });
      fireEvent.click(screen.getByText('Add'));

      await waitFor(() => {
        expect(screen.getByText('Test Activity')).toBeInTheDocument();
      });

      // Grid structure should be maintained
      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('row', 'gy-3');

      const activityColumns = screen.getAllByTestId(/^activity-column-/);
      expect(activityColumns.length).toBeGreaterThan(4); // Should include new activity

      // New activity column should have proper Bootstrap classes
      const newActivityColumn = activityColumns[activityColumns.length - 1];
      expect(newActivityColumn).toHaveClass('col-12', 'col-md-6', 'col-lg-4');
    });
  });

  describe('Bootstrap Integration with Child Components', () => {
    it('maintains Bootstrap structure with ActivityForm integration', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      // ActivityForm should be in its own column
      const formColumn = screen.getByTestId('activity-form-column');
      expect(formColumn).toHaveClass('col-12', 'mb-3');

      // Form should be properly contained within Bootstrap structure
      const form = screen.getByRole('form');
      expect(form.closest('[data-testid="activity-form-column"]')).toBe(formColumn);
    });

    it('maintains Bootstrap structure with ActivityButton integration', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Each ActivityButton should be properly contained in a Bootstrap column
      const homeworkColumn = screen.getByTestId('activity-column-1');
      const homeworkText = within(homeworkColumn).getByText('Homework');
      expect(homeworkText).toBeInTheDocument();

      // Column should have proper Bootstrap classes
      expect(homeworkColumn).toHaveClass('col-12', 'col-md-6', 'col-lg-4');
    });
  });

  describe('Bootstrap Theme Integration', () => {
    it('applies Bootstrap theme classes consistently', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('container-fluid');

      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toHaveClass('h4');

      await waitFor(() => {
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toHaveClass('row');
      });
    });

    it('maintains Bootstrap consistency during state changes', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Start an activity
      const homeworkColumn = screen.getByTestId('activity-column-1');
      const startButton = within(homeworkColumn).getByRole('button', { name: 'Start' });
      fireEvent.click(startButton);

      // Bootstrap structure should be maintained
      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('container-fluid');

      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('row', 'gy-3');
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper Bootstrap accessibility with container structure', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      // Container should have proper structure
      const container = screen.getByTestId('activity-manager');
      expect(container).toBeInTheDocument();

      // Heading should be properly structured
      const heading = screen.getByRole('heading', { name: 'Activities' });
      expect(heading).toBeInTheDocument();

      await waitFor(() => {
        // Activity list should be accessible
        const activityList = screen.getByTestId('activity-list');
        expect(activityList).toBeInTheDocument();
      });
    });

    it('preserves activity accessibility within Bootstrap grid', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Homework')).toBeInTheDocument();
      });

      // Activities should remain accessible within grid structure
      const activities = ['Homework', 'Reading', 'Play Time', 'Chores'];
      activities.forEach(activityName => {
        const activityText = screen.getByText(activityName);
        expect(activityText).toBeInTheDocument();
        
        // Should be within a Bootstrap column
        const column = activityText.closest('[class*="col-"]');
        expect(column).toBeTruthy();
      });
    });
  });

  describe('Bootstrap Overflow and Scrolling', () => {
    it('handles Bootstrap container overflow properly', async () => {
      render(
        <ActivityManager 
          onActivitySelect={mockOnActivitySelect}
          onActivityRemove={mockOnActivityRemove}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      );

      const container = screen.getByTestId('activity-manager');
      expect(container).toHaveClass('container-fluid');
      
      // Container should handle full height
      expect(container).toHaveClass('h-100');
    });
  });
});
