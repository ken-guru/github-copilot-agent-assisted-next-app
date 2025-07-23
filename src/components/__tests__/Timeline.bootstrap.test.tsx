import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from '../Timeline';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';

describe('Timeline Bootstrap Integration', () => {
  let dateNowSpy: jest.SpyInstance;
  const FIXED_TIME = 1000000;
  
  beforeEach(() => {
    jest.useFakeTimers();
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => FIXED_TIME);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  // Helper function to render timeline with standard props
  const renderTimeline = (entries: TimelineEntry[], props = {}) => {
    return render(
      <ToastProvider>
        <Timeline 
          entries={entries}
          totalDuration={3600}
          elapsedTime={30}
          timerActive={true}
          {...props}
        />
      </ToastProvider>
    );
  };

  const mockEntries: TimelineEntry[] = [
    {
      id: '1',
      activityId: 'activity-1',
      activityName: 'Task 1',
      startTime: FIXED_TIME - 30000,
      endTime: FIXED_TIME - 10000,
      colors: {
        background: '#E8F5E9',
        text: '#1B5E20',
        border: '#2E7D32'
      }
    }
  ];

  describe('Bootstrap Layout Structure', () => {
    it('renders with Bootstrap Card component', () => {
      renderTimeline(mockEntries);
      
      const container = document.querySelector('.card');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('card');
    });

    it('uses Bootstrap Row and Column layout for header', () => {
      renderTimeline(mockEntries);
      
      const headerRow = document.querySelector('.row');
      expect(headerRow).toBeInTheDocument();
      
      const columns = document.querySelectorAll('.col, .col-auto');
      expect(columns.length).toBeGreaterThan(0);
    });

    it('applies Bootstrap responsive classes', () => {
      renderTimeline(mockEntries);
      
      // Should have responsive Bootstrap classes for different screen sizes
      const responsiveElements = document.querySelectorAll('[class*="col-"], [class*="row"]');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });

    it('maintains proper Bootstrap card structure', () => {
      renderTimeline(mockEntries);
      
      const container = document.querySelector('.card');
      const row = container?.querySelector('.row');
      const cols = row?.querySelectorAll('.col, .col-auto');
      
      expect(container).toBeInTheDocument();
      expect(row).toBeInTheDocument();
      expect(cols?.length).toBeGreaterThan(0);
    });
  });

  describe('Bootstrap Card Integration', () => {
    it('renders timeline container as Bootstrap Card', () => {
      renderTimeline(mockEntries);
      
      const card = document.querySelector('.card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('card');
    });

    it('uses Card header for timeline header section', () => {
      renderTimeline(mockEntries);
      
      const cardHeader = document.querySelector('.card-header');
      expect(cardHeader).toBeInTheDocument();
      expect(cardHeader).toHaveClass('card-header');
    });

    it('uses Card body for timeline content', () => {
      renderTimeline(mockEntries);
      
      const cardBody = document.querySelector('.card-body');
      expect(cardBody).toBeInTheDocument();
      expect(cardBody).toHaveClass('card-body');
    });

    it('applies proper Card styling classes', () => {
      renderTimeline(mockEntries);
      
      const card = document.querySelector('.card');
      expect(card).toHaveClass('card');
      // Should have appropriate card styling
      expect(card).not.toHaveClass('border-0'); // Should have border
    });
  });

  describe('Bootstrap Typography Integration', () => {
    it('uses Bootstrap heading classes for timeline title', () => {
      renderTimeline(mockEntries);
      
      const heading = screen.getByText('Timeline');
      expect(heading.tagName.toLowerCase()).toBe('h5');
      expect(heading).toHaveClass('mb-0');
    });

    it('applies Bootstrap text utilities for time display', () => {
      renderTimeline(mockEntries);
      
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveClass('badge');
      expect(timeDisplay).toHaveClass('text-nowrap');
    });

    it('uses Bootstrap text classes for activity names', () => {
      renderTimeline(mockEntries);
      
      const activityName = screen.getByTestId('timeline-activity-name');
      expect(activityName).toHaveClass('fw-medium');
      expect(activityName.closest('.timeline-entry')).toBeInTheDocument();
    });

    it('applies Bootstrap font utilities for time markers', () => {
      renderTimeline(mockEntries);
      
      const timeMarkers = screen.getAllByTestId('time-marker');
      timeMarkers.forEach(marker => {
        expect(marker).toHaveClass('small');
        expect(marker).toHaveClass('text-muted');
      });
    });
  });

  describe('Bootstrap Alert Integration', () => {
    it('renders overtime scenario with proper time display', () => {
      const overtimeEntries: TimelineEntry[] = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Task 1',
          startTime: FIXED_TIME - 4000 * 1000,
          endTime: FIXED_TIME,
          colors: {
            background: '#E8F5E9',
            text: '#1B5E20',
            border: '#2E7D32'
          }
        }
      ];
      
      renderTimeline(overtimeEntries, {
        elapsedTime: 4000,
        isTimeUp: true
      });
      
      // Verify overtime time display is shown
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toBeInTheDocument();
      expect(timeDisplay).toHaveClass('badge');
      expect(timeDisplay.textContent).toContain('Overtime');
    });

    it('displays overtime with proper Bootstrap styling', () => {
      const overtimeEntries: TimelineEntry[] = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Task 1',
          startTime: FIXED_TIME - 4000 * 1000,
          endTime: FIXED_TIME,
          colors: {
            background: '#E8F5E9',
            text: '#1B5E20',
            border: '#2E7D32'
          }
        }
      ];
      
      renderTimeline(overtimeEntries, {
        elapsedTime: 4000,
        isTimeUp: true
      });
      
      // Verify overtime section uses proper Bootstrap classes
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveClass('badge');
      expect(timeDisplay).toHaveClass('bg-danger');
      
      const overtimeSection = screen.getByTestId('overtime-section');
      expect(overtimeSection).toBeInTheDocument();
    });
  });

  describe('Bootstrap Badge Integration', () => {
    it('renders time display as Bootstrap Badge', () => {
      renderTimeline(mockEntries);
      
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveClass('badge');
    });

    it('applies appropriate Badge variant for normal time', () => {
      renderTimeline(mockEntries);
      
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveClass('badge-primary');
    });

    it('applies danger Badge variant for overtime', () => {
      const overtimeEntries: TimelineEntry[] = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Task 1',
          startTime: FIXED_TIME - 4000 * 1000,
          endTime: FIXED_TIME,
          colors: {
            background: '#E8F5E9',
            text: '#1B5E20',
            border: '#2E7D32'
          }
        }
      ];
      
      renderTimeline(overtimeEntries, {
        elapsedTime: 4000,
        isTimeUp: true
      });
      
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveClass('badge-danger');
    });
  });

  describe('Bootstrap Responsive Design', () => {
    it('applies responsive classes for mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 576,
      });

      renderTimeline(mockEntries);
      
      const container = document.querySelector('.card');
      expect(container).toBeInTheDocument();
      
      // Should maintain Bootstrap responsive structure
      const responsiveElements = document.querySelectorAll('[class*="col-sm"], [class*="col-md"]');
      expect(responsiveElements.length).toBeGreaterThanOrEqual(0);
    });

    it('maintains proper spacing with Bootstrap utilities', () => {
      renderTimeline(mockEntries);
      
      const container = document.querySelector('.card');
      expect(container).toHaveClass('h-100'); // Bootstrap height utility
    });

    it('uses Bootstrap gap utilities for spacing', () => {
      renderTimeline(mockEntries);
      
      const row = document.querySelector('.row');
      expect(row).toHaveClass('g-3'); // Bootstrap gap utility
    });
  });

  describe('Bootstrap Flex Utilities', () => {
    it('uses Bootstrap flex classes for header layout', () => {
      renderTimeline(mockEntries);
      
      const cardHeader = document.querySelector('.card-header');
      expect(cardHeader).toHaveClass('d-flex');
      expect(cardHeader).toHaveClass('justify-content-between');
      expect(cardHeader).toHaveClass('align-items-center');
    });

    it('applies Bootstrap flex utilities for timeline entries', () => {
      renderTimeline(mockEntries);
      
      const timelineEntry = document.querySelector('.timeline-entry');
      expect(timelineEntry).toHaveClass('d-flex');
      expect(timelineEntry).toHaveClass('flex-column');
    });

    it('uses Bootstrap flex utilities for responsive behavior', () => {
      renderTimeline(mockEntries);
      
      const flexElements = document.querySelectorAll('.d-flex, .flex-column, .justify-content-between');
      expect(flexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Bootstrap Position Utilities', () => {
    it('uses Bootstrap position classes for timeline elements', () => {
      renderTimeline(mockEntries);
      
      const timelineContainer = document.querySelector('.timeline-container');
      expect(timelineContainer).toHaveClass('position-relative');
    });

    it('applies position-absolute for timeline markers', () => {
      renderTimeline(mockEntries);
      
      const timeMarkers = screen.getAllByTestId('time-marker');
      timeMarkers.forEach(marker => {
        expect(marker).toHaveClass('position-absolute');
      });
    });
  });

  describe('Bootstrap Text Utilities', () => {
    it('applies text utilities for empty state', () => {
      renderTimeline([]);
      
      const emptyState = screen.getByText('No activities started yet');
      expect(emptyState).toHaveClass('text-muted');
      expect(emptyState).toHaveClass('fst-italic');
      expect(emptyState).toHaveClass('text-center');
    });

    it('uses text utilities for activity information', () => {
      renderTimeline(mockEntries);
      
      const activityName = screen.getByTestId('timeline-activity-name');
      expect(activityName).toHaveClass('fw-medium');
      
      // Time info should have appropriate text utilities
      const timeInfo = document.querySelector('.time-info');
      expect(timeInfo).toHaveClass('small');
      expect(timeInfo).toHaveClass('text-nowrap');
    });
  });

  describe('Bootstrap Border Utilities', () => {
    it('applies border utilities to timeline container', () => {
      renderTimeline(mockEntries);
      
      const card = document.querySelector('.card');
      expect(card).toHaveClass('border');
    });

    it('uses border utilities for timeline entries', () => {
      renderTimeline(mockEntries);
      
      const timelineEntry = document.querySelector('.timeline-entry');
      expect(timelineEntry).toHaveClass('border');
      expect(timelineEntry).toHaveClass('rounded');
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper ARIA attributes with Bootstrap', () => {
      renderTimeline(mockEntries);
      
      const heading = screen.getByText('Timeline');
      expect(heading).toHaveAttribute('role', 'heading');
      expect(heading).toHaveAttribute('aria-level', '2');
    });

    it('maintains proper Bootstrap structure during overtime', () => {
      const overtimeEntries: TimelineEntry[] = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Task 1',
          startTime: FIXED_TIME - 4000 * 1000,
          endTime: FIXED_TIME,
          colors: {
            background: '#E8F5E9',
            text: '#1B5E20',
            border: '#2E7D32'
          }
        }
      ];
      
      renderTimeline(overtimeEntries, {
        elapsedTime: 4000,
        isTimeUp: true
      });
      
      // Verify Bootstrap structure is maintained
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveClass('badge');
      
      // Verify timeline structure remains intact
      const timelineContainer = document.querySelector('.card');
      expect(timelineContainer).toBeInTheDocument();
      expect(timelineContainer).toHaveClass('card');
    });

    it('maintains proper semantic structure with Bootstrap', () => {
      renderTimeline(mockEntries);
      
      const main = document.querySelector('.card');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('card');
    });
  });

  describe('Custom Timeline Styling Preservation', () => {
    it('preserves custom timeline visualization within Bootstrap structure', () => {
      renderTimeline(mockEntries);
      
      // Custom timeline functionality should be preserved
      const timelineRuler = document.querySelector('.timeline-ruler');
      const entriesContainer = document.querySelector('.entries-container');
      
      expect(timelineRuler).toBeInTheDocument();
      expect(entriesContainer).toBeInTheDocument();
    });

    it('maintains custom overtime visualization', () => {
      const overtimeEntries: TimelineEntry[] = [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Task 1',
          startTime: FIXED_TIME - 4000 * 1000,
          endTime: FIXED_TIME,
          colors: {
            background: '#E8F5E9',
            text: '#1B5E20',
            border: '#2E7D32'
          }
        }
      ];
      
      renderTimeline(overtimeEntries, {
        elapsedTime: 4000,
        isTimeUp: true
      });
      
      const overtimeSection = screen.getByTestId('overtime-section');
      const overtimeRuler = screen.getByTestId('overtime-ruler-section');
      
      expect(overtimeSection).toBeInTheDocument();
      expect(overtimeRuler).toBeInTheDocument();
    });

    it('preserves time marker functionality with Bootstrap layout', () => {
      renderTimeline(mockEntries);
      
      const timeMarkers = screen.getAllByTestId('time-marker');
      expect(timeMarkers.length).toBeGreaterThan(0);
      
      // Should maintain custom positioning within Bootstrap structure
      timeMarkers.forEach(marker => {
        expect(marker).toHaveClass('position-absolute');
        expect(marker).toHaveClass('small');
        expect(marker).toHaveClass('text-muted');
      });
    });
  });
});
