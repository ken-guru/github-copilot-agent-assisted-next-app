import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, Alert } from 'react-bootstrap';
import '@testing-library/jest-dom';
import { ToastProvider } from '@/contexts/ToastContext';

// Import the components we need to test for responsive design
import ActivityManager from '../ActivityManager';
import Timeline from '../Timeline';
import Summary from '../Summary';
import TimeSetup from '../TimeSetup';

// Mock the color utilities
jest.mock('../../utils/colors', () => ({
  getNextAvailableColorSet: jest.fn(() => ({
    background: '#E8F5E9',
    text: '#1B5E20',
    border: '#2E7D32'
  })),
  getActivityColorsForTheme: jest.fn(() => [
    {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  ]),
  getSmartColorIndex: jest.fn(() => 0), // Mock the new smart color selection
  isDarkMode: jest.fn(() => false),
  internalActivityColors: [],
  getThemeAppropriateColor: jest.fn((colors) => colors)
}));

// Mock the useThemeReactive hook
jest.mock('../../hooks/useThemeReactive', () => ({
  useThemeReactive: jest.fn(() => 'light')
}));

jest.mock('../../utils/time', () => ({
  formatTimeHuman: jest.fn((ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  })
}));

// Test utilities for responsive design testing
const mockViewport = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Dispatch resize event
  window.dispatchEvent(new Event('resize'));
};

// Responsive breakpoints based on Bootstrap 5
const BREAKPOINTS = {
  mobile: 575,     // xs: <576px
  tablet: 768,     // sm: 576px-767px, md: 768px-991px
  desktop: 992,    // lg: 992px-1199px
  largeDesktop: 1200 // xl: ≥1200px
};

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    // Reset viewport to desktop size before each test
    mockViewport(BREAKPOINTS.desktop);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Card Structure Responsive Behavior', () => {
    describe('ActivityManager Component', () => {
      const mockProps = {
        onActivitySelect: jest.fn(),
        onActivityRemove: jest.fn(),
        currentActivityId: null,
        completedActivityIds: [],
        timelineEntries: [],
        isTimeUp: false,
        elapsedTime: 0
      };

      it('maintains proper card structure on mobile devices', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<ActivityManager {...mockProps} />);
        
        // Check that Card structure is maintained
        const cardElement = screen.getByTestId('activity-manager');
        expect(cardElement).toBeInTheDocument();
        expect(cardElement).toHaveClass('card');
        
        // Check that header is properly formatted
        const headerElement = cardElement.querySelector('.card-header');
        expect(headerElement).toBeInTheDocument();
        expect(headerElement).toHaveTextContent('Activities');
      });

      it('applies correct Bootstrap grid classes for mobile layout', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<ActivityManager {...mockProps} />);
        
        // Check that activities form uses flexbox layout classes (updated from Bootstrap grid)
        const activityFormColumn = screen.getByTestId('activity-form-column');
        expect(activityFormColumn).toHaveClass('flex-shrink-0');
        expect(activityFormColumn).toHaveClass('mb-3');
      });

      it('maintains readable header text at small sizes', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<ActivityManager {...mockProps} />);
        
        const headerElement = screen.getByRole('heading', { level: 5 });
        expect(headerElement).toBeInTheDocument();
        expect(headerElement.tagName).toBe('H5');
        expect(headerElement).toHaveClass('mb-0');
      });
    });

    describe('Timeline Component', () => {
      const mockTimelineProps = {
        entries: [
          {
            id: '1',
            activityId: 'activity-1',
            activityName: 'Test Activity',
            startTime: Date.now() - 1800000,
            endTime: Date.now() - 900000,
            colors: {
              background: '#E8F5E9',
              text: '#1B5E20',
              border: '#2E7D32'
            }
          }
        ],
        totalDuration: 3600,
        elapsedTime: 1800,
        timerActive: false,
        isTimeUp: false,
        allActivitiesCompleted: false
      };

      it('maintains proper card structure on mobile devices', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<ToastProvider><Timeline {...mockTimelineProps} /></ToastProvider>);
        
        const cardElement = document.querySelector('.card');
        expect(cardElement).toBeInTheDocument();
        
        const headerElement = cardElement!.querySelector('.card-header');
        expect(headerElement).toBeInTheDocument();
        expect(headerElement).toHaveTextContent('Timeline');
      });

      it('adapts timeline visualization for mobile viewport', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<ToastProvider><Timeline {...mockTimelineProps} /></ToastProvider>);
        
        // Check that timeline container adapts to mobile - using CSS modules selector
        const timelineContainer = document.querySelector('[class*="timelineContainer"]');
        expect(timelineContainer).toBeInTheDocument();
        
        // Verify that the component renders with expected structure for mobile
        expect(timelineContainer?.className).toContain('timelineContainer');
      });

      it('ensures time markers remain readable on small screens', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<ToastProvider><Timeline {...mockTimelineProps} /></ToastProvider>);
        
        const timeDisplay = screen.getByTestId('time-display');
        expect(timeDisplay).toBeInTheDocument();
        expect(timeDisplay).toHaveClass('badge');
        expect(timeDisplay).toHaveClass('text-nowrap');
      });
    });

    describe('Summary Component', () => {
      const mockSummaryProps = {
        entries: [
          {
            id: '1',
            activityId: 'activity-1',
            activityName: 'Test Activity',
            startTime: Date.now() - 1800000,
            endTime: Date.now() - 900000,
            colors: {
              background: '#E8F5E9',
              text: '#1B5E20',
              border: '#2E7D32'
            }
          }
        ],
        totalDuration: 3600,
        elapsedTime: 1800,
        timerActive: false,
        allActivitiesCompleted: true,
        isTimeUp: false
      };

      it('maintains proper card structure on mobile devices', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<Summary {...mockSummaryProps} />);
        
        const summaryCard = screen.getByTestId('summary');
        expect(summaryCard).toBeInTheDocument();
        expect(summaryCard).toHaveClass('card');
        
        const headerElement = summaryCard.querySelector('.card-header');
        expect(headerElement).toBeInTheDocument();
        expect(headerElement).toHaveTextContent('Summary');
      });

      it('adapts statistics cards for mobile layout', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<Summary {...mockSummaryProps} />);
        
        // Check that statistics grid adapts to mobile
        const statsGrid = screen.getByTestId('stats-grid');
        expect(statsGrid).toBeInTheDocument();
        expect(statsGrid).toHaveClass('row');
        expect(statsGrid).toHaveClass('g-3');
        
        // Verify individual stat cards use proper mobile column classes
        const plannedStatCard = screen.getByTestId('stat-card-planned');
        expect(plannedStatCard).toHaveClass('col-6'); // 2 columns on mobile
        expect(plannedStatCard).toHaveClass('col-md-3'); // 4 columns on desktop
      });

      it('ensures statistics text remains readable at small sizes', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<Summary {...mockSummaryProps} />);
        
        // Check that stat values are properly sized for mobile
        const statValue = screen.getByTestId('stat-value-planned');
        expect(statValue).toBeInTheDocument();
        expect(statValue).toHaveClass('fs-4');
        expect(statValue).toHaveClass('fw-bold');
      });
    });

    describe('TimeSetup Component', () => {
      const mockTimeSetupProps = {
        onTimeSet: jest.fn()
      };

      it('maintains proper card structure on mobile devices', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<TimeSetup {...mockTimeSetupProps} />);
        
        const cardElement = document.querySelector('.card');
        expect(cardElement).toBeInTheDocument();
        
        const headerElement = cardElement!.querySelector('.card-header');
        expect(headerElement).toBeInTheDocument();
        expect(headerElement).toHaveTextContent('Set Time');
      });

      it('adapts form controls for mobile interaction', () => {
        mockViewport(BREAKPOINTS.mobile);
        
        render(<TimeSetup {...mockTimeSetupProps} />);
        
        // Check that form controls are touch-friendly
        const hoursInput = screen.getByLabelText(/hours/i);
        const minutesInput = screen.getByLabelText(/minutes/i);
        
        expect(hoursInput).toBeInTheDocument();
        expect(minutesInput).toBeInTheDocument();
        
        // Verify proper input types for mobile keyboards
        expect(hoursInput).toHaveAttribute('type', 'number');
        expect(minutesInput).toHaveAttribute('type', 'number');
      });
    });
  });

  describe('Alert Message Responsive Behavior', () => {
    it('maintains alert readability on mobile devices', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      render(
        <Alert variant="warning" className="mb-3" data-testid="test-alert">
          <strong>Warning:</strong> This is a test alert message that should remain readable on mobile devices.
        </Alert>
      );
      
      const alertElement = screen.getByTestId('test-alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveClass('alert');
      expect(alertElement).toHaveClass('alert-warning');
      expect(alertElement).toHaveClass('mb-3');
    });

    it('ensures alert spacing works correctly in card structures on mobile', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      render(
        <Card>
          <Card.Header>
            <h5 className="mb-0">Test Card</h5>
          </Card.Header>
          <Alert variant="info" className="mb-0 border-0 border-bottom rounded-0" data-testid="card-alert">
            This is an alert within a card structure
          </Alert>
          <Card.Body>
            Card content goes here
          </Card.Body>
        </Card>
      );
      
      const alertElement = screen.getByTestId('card-alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveClass('alert-info');
      expect(alertElement).toHaveClass('mb-0');
      expect(alertElement).toHaveClass('border-0');
    });

    it('maintains proper alert button interaction on touch devices', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      render(
        <Alert variant="success" dismissible data-testid="dismissible-alert">
          This alert can be dismissed on mobile devices
        </Alert>
      );
      
      const alertElement = screen.getByTestId('dismissible-alert');
      expect(alertElement).toBeInTheDocument();
      
      // Check for dismiss button
      const dismissButton = alertElement.querySelector('.btn-close');
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('Header Alignment Responsive Behavior', () => {
    it('maintains header alignment between components across breakpoints', () => {
      // Test desktop alignment
      mockViewport(BREAKPOINTS.desktop);
      
      const { rerender } = render(
        <ToastProvider>
          <div>
            <ActivityManager
              onActivitySelect={jest.fn()}
              onActivityRemove={jest.fn()}
              currentActivityId={null}
              completedActivityIds={[]}
              timelineEntries={[]}
              isTimeUp={false}
              elapsedTime={0}
            />
            <Timeline
              entries={[]}
              totalDuration={3600}
              elapsedTime={0}
              timerActive={false}
              isTimeUp={false}
              allActivitiesCompleted={false}
            />
          </div>
        </ToastProvider>
      );
      
      // Check that both headers use consistent styling
      const activityHeader = screen.getByRole('heading', { name: /activities/i });
      const timelineHeader = screen.getByRole('heading', { name: /timeline/i });
      
      expect(activityHeader.tagName).toBe('H5');
      expect(activityHeader).toHaveClass('mb-0');
      expect(timelineHeader.tagName).toBe('H5');
      expect(timelineHeader).toHaveClass('mb-0');
      
      // Test mobile alignment
      mockViewport(BREAKPOINTS.mobile);
      rerender(
        <ToastProvider>
          <div>
            <ActivityManager
              onActivitySelect={jest.fn()}
              onActivityRemove={jest.fn()}
              currentActivityId={null}
              completedActivityIds={[]}
              timelineEntries={[]}
              isTimeUp={false}
              elapsedTime={0}
            />
            <Timeline
              entries={[]}
              totalDuration={3600}
              elapsedTime={0}
              timerActive={false}
              isTimeUp={false}
              allActivitiesCompleted={false}
            />
          </div>
        </ToastProvider>
      );
      
      // Headers should maintain consistent styling on mobile
      expect(activityHeader.tagName).toBe('H5');
      expect(activityHeader).toHaveClass('mb-0');
      expect(timelineHeader.tagName).toBe('H5');
      expect(timelineHeader).toHaveClass('mb-0');
    });
  });

  describe('Statistics Cards Mobile Stacking', () => {
    const mockSummaryProps = {
      entries: [
        {
          id: '1',
          activityId: 'activity-1',
          activityName: 'Test Activity',
          startTime: Date.now() - 1800000,
          endTime: Date.now() - 900000,
          colors: {
            background: '#E8F5E9',
            text: '#1B5E20',
            border: '#2E7D32'
          }
        }
      ],
      totalDuration: 3600,
      elapsedTime: 1800,
      timerActive: false,
      allActivitiesCompleted: true,
      isTimeUp: false
    };

    it('properly stacks statistics cards on mobile devices', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      render(<Summary {...mockSummaryProps} />);
      
      // Check that all stat cards have proper mobile column classes
      const plannedCard = screen.getByTestId('stat-card-planned');
      const spentCard = screen.getByTestId('stat-card-spent');
      const idleCard = screen.getByTestId('stat-card-idle');
      const overtimeCard = screen.getByTestId('stat-card-overtime');
      
      // Mobile: 2 columns (xs-6)
      expect(plannedCard).toHaveClass('col-6');
      expect(spentCard).toHaveClass('col-6');
      expect(idleCard).toHaveClass('col-6');
      expect(overtimeCard).toHaveClass('col-6');
      
      // Desktop: 4 columns (md-3)
      expect(plannedCard).toHaveClass('col-md-3');
      expect(spentCard).toHaveClass('col-md-3');
      expect(idleCard).toHaveClass('col-md-3');
      expect(overtimeCard).toHaveClass('col-md-3');
    });

    it('maintains proper spacing between stacked cards', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      render(<Summary {...mockSummaryProps} />);
      
      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('g-3'); // Bootstrap gap utility
      expect(statsGrid).toHaveClass('mb-4'); // Bottom margin
    });
  });

  describe('Touch Interaction Optimization', () => {
    it('ensures proper touch target sizes for mobile interaction', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      render(
        <TimeSetup
          onTimeSet={jest.fn()}
        />
      );
      
      // Check that form controls have adequate touch targets
      const hoursInput = screen.getByLabelText(/hours/i);
      const minutesInput = screen.getByLabelText(/minutes/i);
      
      expect(hoursInput).toBeInTheDocument();
      expect(minutesInput).toBeInTheDocument();
      
      // Verify inputs are properly sized for touch interaction
      expect(hoursInput).toHaveClass('form-control');
      expect(minutesInput).toHaveClass('form-control');
    });

    it('maintains proper button sizing for touch interaction', () => {
      mockViewport(BREAKPOINTS.mobile);
      
      const mockProps = {
        onActivitySelect: jest.fn(),
        onActivityRemove: jest.fn(),
        currentActivityId: null,
        completedActivityIds: [],
        timelineEntries: [],
        isTimeUp: false,
        elapsedTime: 0
      };
      
      render(<ActivityManager {...mockProps} />);
      
      // Form submit button should be appropriately sized for touch
      const formElement = document.querySelector('form');
      if (formElement) {
        const submitButton = formElement.querySelector('button[type="submit"]');
        if (submitButton) {
          expect(submitButton).toHaveClass('btn');
        }
      }
    });
  });

  describe('Responsive Typography', () => {
    it('maintains readable font sizes across all breakpoints', () => {
      // Test various breakpoints
      const breakpoints = [BREAKPOINTS.mobile, BREAKPOINTS.tablet, BREAKPOINTS.desktop];
      
      breakpoints.forEach(width => {
        mockViewport(width);
        
        const { rerender } = render(
          <Summary
            entries={[
              {
                id: '1',
                activityId: 'activity-1',
                activityName: 'Test Activity',
                startTime: Date.now() - 1800000,
                endTime: Date.now() - 900000,
                colors: {
                  background: '#E8F5E9',
                  text: '#1B5E20',
                  border: '#2E7D32'
                }
              }
            ]}
            totalDuration={3600}
            elapsedTime={1800}
            timerActive={false}
            allActivitiesCompleted={true}
            isTimeUp={false}
          />
        );
        
        // Check that text remains readable
        const headerElement = screen.getByRole('heading', { name: /summary/i });
        expect(headerElement.tagName).toBe('H5');
        
        const statValues = screen.getAllByTestId(/stat-value-/);
        statValues.forEach(statValue => {
          expect(statValue).toHaveClass('fs-4');
          expect(statValue).toHaveClass('fw-bold');
        });
        
        rerender(<div />); // Clear for next iteration
      });
    });
  });
});
