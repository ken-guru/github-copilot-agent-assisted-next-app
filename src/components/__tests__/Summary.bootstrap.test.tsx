import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card');
    });

    it('renders with Bootstrap Card Body', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const cardBody = screen.getByTestId('summary-body');
      expect(cardBody).toHaveClass('card-body');
    });

    it('applies proper Bootstrap Card classes', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card', 'h-100');
    });
  });

  describe('Bootstrap Alert for Status Messages', () => {
    it('renders status message with Bootstrap Alert', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime + 300000} // 5 minutes overtime
          allActivitiesCompleted={true}
        />
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toHaveClass('alert');
    });

    it('applies correct Bootstrap Alert variant for late status', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime + 600000} // 10 minutes overtime
          allActivitiesCompleted={true}
        />
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toHaveClass('alert', 'alert-warning');
    });

    it('applies correct Bootstrap Alert variant for early status', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime - 300000} // 5 minutes under
          allActivitiesCompleted={true}
        />
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toHaveClass('alert', 'alert-success');
    });
  });

  describe('Bootstrap Grid for Stats', () => {
    it('renders stats with Bootstrap Row and Col structure', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('row', 'g-3');
    });

    it('renders stat cards with Bootstrap Column classes', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const statCards = screen.getAllByTestId(/^stat-card-/);
      statCards.forEach(card => {
        expect(card).toHaveClass('col-6', 'col-md-3');
      });
    });

    it('renders individual stat cards with Bootstrap Card classes', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const plannedTimeCard = screen.getByTestId('stat-card-planned');
      expect(plannedTimeCard).toHaveClass('col-6', 'col-md-3');
      
      const cardContent = plannedTimeCard.querySelector('.card');
      expect(cardContent).toHaveClass('card', 'text-center', 'h-100');
    });

    it('displays all four stat categories', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const activityList = screen.getByTestId('activity-list');
      expect(activityList).toHaveClass('list-group', 'list-group-flush');
    });

    it('renders activity items with Bootstrap List Group Item classes', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const activityItems = screen.getAllByTestId(/^activity-summary-item-/);
      activityItems.forEach(item => {
        expect(item).toHaveClass('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      });
    });

    it('renders activity list heading with Bootstrap typography', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const heading = screen.getByTestId('activity-list-heading');
      expect(heading).toHaveClass('h5', 'mb-3');
    });
  });

  describe('Bootstrap Typography and Spacing', () => {
    it('applies Bootstrap spacing utilities', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const cardBody = screen.getByTestId('summary-body');
      expect(cardBody).toHaveClass('card-body');

      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('mb-4');
    });

    it('uses Bootstrap typography for stat labels and values', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const statCards = screen.getAllByTestId(/^stat-card-/);
      statCards.forEach(card => {
        // Mobile: 2 columns (col-6), Tablet+: 4 columns (col-md-3)
        expect(card).toHaveClass('col-6', 'col-md-3');
      });
    });

    it('maintains responsive layout structure', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card');

      const cardBody = screen.getByTestId('summary-body');
      expect(cardBody).toHaveClass('card-body');
    });

    it('preserves custom activity colors within Bootstrap structure', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      const card = screen.getByTestId('summary');
      expect(card).toBeInTheDocument();

      const heading = screen.getByTestId('activity-list-heading');
      expect(heading).toBeInTheDocument();
    });

    it('preserves accessibility within Bootstrap List Group', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={false}
          isTimeUp={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('renders when time is up even if activities not completed', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={false}
          isTimeUp={true}
        />
      );

      const card = screen.getByTestId('summary');
      expect(card).toHaveClass('card');
    });

    it('renders activity list only when activities exist', () => {
      render(
        <Summary
          entries={[]}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
      );

      // Check that stat values are displayed
      expect(screen.getByTestId('stat-value-planned')).toBeInTheDocument();
      expect(screen.getByTestId('stat-value-spent')).toBeInTheDocument();
      expect(screen.getByTestId('stat-value-idle')).toBeInTheDocument();
      expect(screen.getByTestId('stat-value-overtime')).toBeInTheDocument();
    });

    it('displays activity durations with proper Bootstrap typography', () => {
      render(
        <Summary
          entries={mockEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          allActivitiesCompleted={true}
        />
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
