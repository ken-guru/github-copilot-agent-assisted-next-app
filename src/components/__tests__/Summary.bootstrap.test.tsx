import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { ToastProvider } from '../ToastNotificationProvider';
import { TimelineEntry } from '@/types';

// Mock TimelineEntry data for testing
const createMockTimelineEntries = (): TimelineEntry[] => [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Homework',
    startTime: 1000000,
    endTime: 1000000 + 3600000, // 1 hour
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  },
  {
    id: '2',
    activityId: null,
    activityName: null,
    startTime: 1000000 + 3600000,
    endTime: 1000000 + 3900000 // 5 minute break
  },
  {
    id: '3',
    activityId: 'activity-2',
    activityName: 'Reading',
    startTime: 1000000 + 3900000,
    endTime: 1000000 + 5400000, // 25 minutes
    colors: {
      background: '#E3F2FD',
      text: '#0D47A1',
      border: '#1976D2'
    }
  }
];

describe('Summary Bootstrap Integration', () => {
  const mockEntries = createMockTimelineEntries();
  const totalDuration = 5400000; // 90 minutes
  const elapsedTime = 5400000; // 90 minutes

  describe('Bootstrap Card Structure', () => {
    it('renders with Bootstrap Card structure', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card');
    });

    it('renders with Bootstrap Card Body', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const cardBody = screen.getByTestId('summary-body');
      expect(cardBody).toHaveClass('card-body');
    });

    it('applies proper Bootstrap Card classes', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card', 'h-100');
    });
  });

  describe('Bootstrap Alert for Status Messages', () => {
    it('renders status message as a toast when overtime', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime + 300000} // 5 minutes overtime
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );
      const toast = screen.getByTestId('global-toast');
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveClass('toast', 'bg-warning', 'show');
      expect(toast).toHaveAttribute('role', 'alert');
      expect(toast).toHaveTextContent(/more than planned/i);
    });

    it('renders correct toast variant for late status (warning)', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime + 600000} // 10 minutes overtime
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );
      const toast = screen.getByTestId('global-toast');
      expect(toast).toHaveClass('bg-warning');
      expect(toast).toHaveTextContent(/more than planned/i);
    });

    it('renders correct toast variant for early status (success)', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime - 300000} // 5 minutes under
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );
      const toast = screen.getByTestId('global-toast');
      expect(toast).toHaveClass('bg-success');
      expect(toast).toHaveTextContent(/earlier than planned/i);
    });
  });

  describe('Bootstrap Grid for Stats', () => {
    it('renders stats with Bootstrap Row and Col structure', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('row', 'g-3');
    });

    it('renders stat cards with Bootstrap Column classes', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const statCards = screen.getAllByTestId(/^stat-card-/);
      statCards.forEach(card => {
        expect(card).toHaveClass('col-6', 'col-md-3');
      });
    });

    it('renders individual stat cards with Bootstrap Card classes', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const plannedTimeCard = screen.getByTestId('stat-card-planned');
      expect(plannedTimeCard).toHaveClass('col-6', 'col-md-3');
      
      const cardContent = plannedTimeCard.querySelector('.card');
      expect(cardContent).toHaveClass('card', 'text-center', 'h-100');
    });

    it('displays all four stat categories', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      expect(screen.getByTestId('stat-card-planned')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-spent')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-idle')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-overtime')).toBeInTheDocument();
    });
  });

  describe('Bootstrap List Group for Activities', () => {
    it('renders activity list with Bootstrap List Group', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('list-group', 'list-group-flush');
    });

    it('renders activity items with Bootstrap List Group Item classes', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
      activityItems.forEach(item => {
        expect(item).toHaveClass('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      });
    });

    it('renders activity list heading with Bootstrap typography', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const heading = screen.getByTestId('activity-list-heading');
      expect(heading).toHaveClass('h5', 'mb-3');
    });
  });

  describe('Bootstrap Typography and Spacing', () => {
    it('applies Bootstrap spacing utilities', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const cardBody = screen.getByTestId('summary-body');
      expect(cardBody).toHaveClass('card-body');

      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('mb-4');
    });

    it('uses Bootstrap typography for stat labels and values', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const statLabels = screen.getAllByTestId(/^stat-label-/);
      statLabels.forEach(label => {
        expect(label).toHaveClass('card-title', 'small', 'text-muted');
      });

      const statValues = screen.getAllByTestId(/^stat-value-/);
      statValues.forEach(value => {
        expect(value).toHaveClass('card-text', 'fs-4', 'fw-bold');
      });
    });
  });

  describe('Bootstrap Responsive Behavior', () => {
    it('applies responsive column classes for stats grid', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const statCards = screen.getAllByTestId(/^stat-card-/);
      statCards.forEach(card => {
        // Mobile: 2 columns (col-6), Tablet+: 4 columns (col-md-3)
        expect(card).toHaveClass('col-6', 'col-md-3');
      });
    });

    it('maintains responsive layout structure', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('row', 'g-3');
      
      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card', 'h-100');
    });
  });

  describe('Bootstrap Theme Integration', () => {
    it('maintains Bootstrap theme classes consistently', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card');

      const cardBody = screen.getByTestId('summary-body');
      expect(cardBody).toHaveClass('card-body');
    });

    it('preserves custom activity colors within Bootstrap structure', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const homeworkItem = screen.getByTestId('activity-summary-item-activity-1');
      expect(homeworkItem).toHaveClass('list-group-item');
      
      const activityName = screen.getByTestId('activity-name-activity-1');
      expect(activityName).toBeInTheDocument();
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper Bootstrap accessibility with Card structure', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const card = screen.getByTestId('summary');
      expect(card).toBeInTheDocument();

      const heading = screen.getByTestId('activity-list-heading');
      expect(heading).toBeInTheDocument();
    });

    it('preserves accessibility within Bootstrap List Group', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('list-group');

      const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
      expect(activityItems.length).toBeGreaterThan(0);
    });
  });

  describe('Bootstrap Conditional Rendering', () => {
    it('does not render when activities not completed and time not up', () => {
      const { container } = render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={false}
            isTimeUp={false}
          />
        </ToastProvider>
      );
      // The only thing that may be present is the toast container, which may be empty
      // So assert that there is no summary card and no global toast
      expect(screen.queryByTestId('summary')).not.toBeInTheDocument();
      expect(screen.queryByTestId('global-toast')).not.toBeInTheDocument();
    });

    it('renders when time is up even if activities not completed', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={false}
            isTimeUp={true}
          />
        </ToastProvider>
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card');
    });

    it('renders activity list only when activities exist', () => {
      render(
        <ToastProvider>
          <Summary
            entries={[]}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const card = screen.getByTestId('summary');
      expect(card).toBeInTheDocument();

      // Activity list should not be present when no entries
      expect(screen.queryByTestId('activity-list')).not.toBeInTheDocument();
    });
  });

  describe('Bootstrap Data Display', () => {
    it('displays formatted duration values correctly', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      // Check that stat values are displayed
      expect(screen.getByTestId('stat-value-planned')).toBeInTheDocument();
      expect(screen.getByTestId('stat-value-spent')).toBeInTheDocument();
      expect(screen.getByTestId('stat-value-idle')).toBeInTheDocument();
      expect(screen.getByTestId('stat-value-overtime')).toBeInTheDocument();
    });

    it('displays activity durations with proper Bootstrap typography', () => {
      render(
        <ToastProvider>
          <Summary
            entries={mockEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={true}
          />
        </ToastProvider>
      );

      const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
      activityItems.forEach(item => {
        expect(item).toHaveClass('list-group-item');
        const timeElement = item.querySelector('.ms-auto');
        expect(timeElement).toHaveClass('badge', 'bg-secondary');
      });
    });
  });
});
