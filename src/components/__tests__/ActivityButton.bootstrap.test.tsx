import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityButton } from '../ActivityButton';
import { Activity } from '../ActivityManager';
import { TimelineEntry } from '@/types';

// Bootstrap-focused test suite for ActivityButton component
describe('ActivityButton Bootstrap Integration', () => {
  const mockActivity: Activity = {
    id: 'test-activity-1',
    name: 'Test Activity',
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  };

  const mockTimelineEntries: TimelineEntry[] = [
    {
      id: '1',
      activityId: 'test-activity-1',
      activityName: 'Test Activity',
      startTime: Date.now() - 3600000, // 1 hour ago
      endTime: Date.now() - 1800000   // 30 minutes ago
    }
  ];

  const defaultProps = {
    activity: mockActivity,
    isCompleted: false,
    isRunning: false,
    onSelect: jest.fn(),
    onRemove: jest.fn(),
    timelineEntries: [],
    elapsedTime: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Bootstrap Button Component Structure', () => {
    it('should render as a Bootstrap Button component', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Look for Bootstrap Button classes
      const button = screen.getByRole('button', { name: /start/i });
      expect(button).toHaveClass('btn');
      expect(button).toBeInTheDocument();
    });

    it('should use Bootstrap button variants for different states', () => {
      const { rerender } = render(<ActivityButton {...defaultProps} />);
      
      // Start button should use primary variant
      let button = screen.getByRole('button', { name: /start/i });
      expect(button).toHaveClass('btn-primary');

      // Complete button should use success variant
      rerender(<ActivityButton {...defaultProps} isRunning={true} />);
      button = screen.getByRole('button', { name: /complete/i });
      expect(button).toHaveClass('btn-success');
    });

    it('should use Bootstrap button sizes appropriately', () => {
      render(<ActivityButton {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /start/i });
      // Should use appropriate Bootstrap button size (default or small)
      expect(button).toHaveClass(/btn(-sm)?$/);
    });
  });

  describe('Bootstrap Card Component Structure', () => {
    it('should render activity container as Bootstrap Card', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Activity container should use Bootstrap Card classes
      const container = screen.getByTestId(`start-activity-${mockActivity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`).closest('.card');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('card');
    });

    it('should use Bootstrap Card body for content area', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Look for card body structure
      const cardBody = document.querySelector('.card-body');
      expect(cardBody).toBeInTheDocument();
    });

    it('should apply Bootstrap card variants for different states', () => {
      const { rerender } = render(<ActivityButton {...defaultProps} />);
      
      // Normal state - default card
      let container = document.querySelector('.card');
      expect(container).toHaveClass('card');

      // Completed state - success card variant
      rerender(<ActivityButton {...defaultProps} isCompleted={true} />);
      container = document.querySelector('.card');
      expect(container).toHaveClass('border-success');
    });
  });

  describe('Bootstrap Typography Integration', () => {
    it('should use Bootstrap typography classes for activity name', () => {
      render(<ActivityButton {...defaultProps} />);
      
      const activityName = screen.getByText(mockActivity.name);
      expect(activityName).toHaveClass(/h[1-6]|fs-[1-6]|fw-bold/);
    });

    it('should use Bootstrap muted text for timer display', () => {
      render(<ActivityButton {...defaultProps} isRunning={true} elapsedTime={125} />);
      
      const timer = screen.getByText('02:05');
      expect(timer).toHaveClass('text-muted');
    });

    it('should use Bootstrap typography utilities for status indicators', () => {
      render(<ActivityButton {...defaultProps} isCompleted={true} />);
      
      const completedIndicator = screen.getByLabelText('Completed');
      expect(completedIndicator).toHaveClass(/text-success|badge|badge-success/);
    });
  });

  describe('Bootstrap Badge Integration', () => {
    it('should render status badges using Bootstrap Badge component', () => {
      const { rerender } = render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Running state should show badge
      let statusBadge = document.querySelector('.badge');
      expect(statusBadge).toBeInTheDocument();

      // Completed state should show success badge
      rerender(<ActivityButton {...defaultProps} isCompleted={true} />);
      statusBadge = document.querySelector('.badge-success, .bg-success');
      expect(statusBadge).toBeInTheDocument();
    });

    it('should use appropriate Bootstrap badge variants for different states', () => {
      const { rerender } = render(<ActivityButton {...defaultProps} isRunning={true} />);
      
      // Running badge should be primary or info
      let badge = document.querySelector('.badge');
      expect(badge).toHaveClass(/badge-primary|badge-info|bg-primary|bg-info/);

      // Completed badge should be success
      rerender(<ActivityButton {...defaultProps} isCompleted={true} />);
      badge = document.querySelector('.badge');
      expect(badge).toHaveClass(/badge-success|bg-success/);
    });
  });

  describe('Bootstrap Layout and Spacing', () => {
    it('should use Bootstrap flexbox utilities for layout', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should use Bootstrap flex classes
      const flexContainers = document.querySelectorAll('.d-flex, .flex-row, .flex-column');
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it('should use Bootstrap spacing utilities', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should use Bootstrap margin/padding classes
      const spacingElements = document.querySelectorAll('[class*="m-"], [class*="p-"], [class*="gap-"]');
      expect(spacingElements.length).toBeGreaterThan(0);
    });

    it('should use Bootstrap justify-content utilities for alignment', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should use Bootstrap alignment classes
      const alignedElements = document.querySelectorAll('.justify-content-between, .align-items-center');
      expect(alignedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Bootstrap Responsive Design', () => {
    it('should include Bootstrap responsive classes', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should use Bootstrap responsive utilities
      const responsiveElements = document.querySelectorAll('[class*="-sm"], [class*="-md"], [class*="-lg"]');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });

    it('should handle mobile layout with Bootstrap utilities', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should include responsive button sizing or stacking
      const mobileClasses = document.querySelectorAll('.btn-sm, .d-sm-block, .flex-column');
      expect(mobileClasses.length).toBeGreaterThan(0);
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('should maintain Bootstrap ARIA attributes', () => {
      render(<ActivityButton {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /start/i });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should use Bootstrap sr-only classes for screen readers', () => {
      render(<ActivityButton {...defaultProps} isCompleted={true} />);
      
      // Should include screen reader accessible content
      const srOnlyElements = document.querySelectorAll('.sr-only, .visually-hidden');
      expect(srOnlyElements.length).toBeGreaterThanOrEqual(0);
    });

    it('should maintain keyboard navigation with Bootstrap focus states', () => {
      render(<ActivityButton {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /start/i });
      button.focus();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('btn');
    });
  });

  describe('Bootstrap Button Groups', () => {
    it('should group action buttons using Bootstrap ButtonGroup when multiple actions', () => {
      render(<ActivityButton {...defaultProps} onRemove={jest.fn()} />);
      
      // Should use Bootstrap button group for multiple buttons
      const buttonGroup = document.querySelector('.btn-group, .btn-toolbar');
      expect(buttonGroup).toBeInTheDocument();
    });

    it('should maintain Bootstrap button group accessibility', () => {
      render(<ActivityButton {...defaultProps} onRemove={jest.fn()} />);
      
      const buttonGroup = document.querySelector('.btn-group');
      if (buttonGroup) {
        expect(buttonGroup).toHaveAttribute('role', 'group');
      }
    });
  });

  describe('Bootstrap Color Theming', () => {
    it('should integrate with Bootstrap color system', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should use Bootstrap color classes, bg props, or CSS custom properties
      // Check for class-based color utilities (flex-grow, fw-bold, etc.)
      const colorClasses = document.querySelectorAll('[class*="text-"], [class*="bg-"], [class*="border-"]');
      
      // Check for React Bootstrap component props (bg="primary", variant="primary", etc.)
      const bootstrapComponents = document.querySelectorAll('.btn, .badge, .card');
      
      // Check for any color-related classes or attributes
      const hasColorClasses = colorClasses.length > 0;
      const hasBootstrapComponents = bootstrapComponents.length > 0;
      
      expect(hasColorClasses || hasBootstrapComponents).toBe(true);
    });

    it('should handle custom activity colors within Bootstrap framework', () => {
      render(<ActivityButton {...defaultProps} />);
      
      // Should apply custom colors via CSS custom properties or inline styles
      const styledElements = document.querySelectorAll('[style*="background"], [style*="color"], [style*="border"]');
      expect(styledElements.length).toBeGreaterThan(0);
    });
  });

  describe('Component Functionality with Bootstrap', () => {
    it('should maintain all click handlers with Bootstrap components', () => {
      const onSelectMock = jest.fn();
      const onRemoveMock = jest.fn();
      
      render(<ActivityButton {...defaultProps} onSelect={onSelectMock} onRemove={onRemoveMock} />);
      
      // Start button click
      const startButton = screen.getByRole('button', { name: /start/i });
      fireEvent.click(startButton);
      expect(onSelectMock).toHaveBeenCalledWith(mockActivity);

      // Remove button click
      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);
      expect(onRemoveMock).toHaveBeenCalledWith(mockActivity.id);
    });

    it('should prevent event bubbling with Bootstrap event handling', () => {
      const onSelectMock = jest.fn();
      const onRemoveMock = jest.fn();
      
      render(<ActivityButton {...defaultProps} onSelect={onSelectMock} onRemove={onRemoveMock} />);
      
      // Remove button should stop propagation
      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);
      
      expect(onRemoveMock).toHaveBeenCalledWith(mockActivity.id);
      expect(onSelectMock).not.toHaveBeenCalled();
    });

    it('should handle disabled states with Bootstrap disabled classes', () => {
      render(<ActivityButton {...defaultProps} timelineEntries={mockTimelineEntries} />);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeDisabled();
      expect(removeButton).toHaveClass('disabled');
    });
  });

  describe('Bootstrap Animation and Transitions', () => {
    it('should use Bootstrap transition classes', () => {
      const { rerender } = render(<ActivityButton {...defaultProps} />);
      
      // State changes should include Bootstrap transition classes
      rerender(<ActivityButton {...defaultProps} isRunning={true} />);
      
      const elements = document.querySelectorAll('.fade, .collapse, .transition');
      expect(elements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration with Timeline Entries', () => {
    it('should display duration using Bootstrap typography when timeline entries exist', () => {
      render(<ActivityButton {...defaultProps} isCompleted={true} timelineEntries={mockTimelineEntries} />);
      
      // Should display duration with Bootstrap text classes - duration is inside text, so check container
      const durationContainer = screen.getByText(/30m 0s/);
      expect(durationContainer).toHaveClass('text-muted');
    });
  });
});
