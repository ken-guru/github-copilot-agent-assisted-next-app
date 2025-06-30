import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityManager from '@/components/ActivityManager';
import { TimelineEntry } from '@/types';

// Mock the ActivityButton component
jest.mock('@/components/ActivityButton', () => {
  return {
    ActivityButton: ({ activity }: { activity: any }) => (
      <div data-testid={`activity-button-${activity.id}`}>
        {activity.name}
      </div>
    )
  };
});

// Mock the ActivityForm component
jest.mock('@/components/ActivityForm', () => {
  return function MockActivityForm({ onAddActivity }: { onAddActivity: (name: string) => void }) {
    return (
      <div data-testid="activity-form">
        <button onClick={() => onAddActivity('Test Activity')}>Add Activity</button>
      </div>
    );
  };
});

describe('ActivityManager Full Width Layout', () => {
  const mockProps = {
    onActivitySelect: jest.fn(),
    onActivityRemove: jest.fn(),
    currentActivityId: null,
    completedActivityIds: [],
    timelineEntries: [] as TimelineEntry[],
    isTimeUp: false,
    elapsedTime: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render activities in full-width single column layout', () => {
    render(<ActivityManager {...mockProps} />);

    // Wait for default activities to be initialized
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).toBeInTheDocument();

    // Check that all activity columns have xs={12} for full width
    const activityColumns = screen.getAllByTestId(/^activity-column-/);
    
    activityColumns.forEach((column) => {
      // Check that the column has Bootstrap classes for full width
      expect(column).toHaveClass('col-12');
      
      // Ensure it does not have medium or large breakpoint classes that would create multi-column layout
      expect(column).not.toHaveClass('col-md-6');
      expect(column).not.toHaveClass('col-lg-4');
    });
  });

  it('should maintain single column layout on all screen sizes', () => {
    render(<ActivityManager {...mockProps} />);

    const activityList = screen.getByTestId('activity-list');
    expect(activityList).toBeInTheDocument();

    // Get all activity columns
    const activityColumns = screen.getAllByTestId(/^activity-column-/);

    activityColumns.forEach((column) => {
      // Each activity should span the full width (12 columns) on all breakpoints
      expect(column).toHaveClass('col-12');
      
      // Verify no responsive breakpoint classes that would create multiple columns
      const classList = Array.from(column.classList);
      const hasMultiColumnClasses = classList.some(className => 
        className.includes('col-sm-') || 
        className.includes('col-md-') || 
        className.includes('col-lg-') || 
        className.includes('col-xl-') ||
        className.includes('col-xxl-')
      );
      
      expect(hasMultiColumnClasses).toBe(false);
    });
  });

  it('should render each activity as a separate row in the layout', () => {
    render(<ActivityManager {...mockProps} />);

    // Check that activities are in a Bootstrap Row with proper gap
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).toHaveClass('row');
    expect(activityList).toHaveClass('gy-3'); // Vertical gap between rows

    // Each activity should be in its own column that spans full width
    const activityColumns = screen.getAllByTestId(/^activity-column-/);
    
    // Should have the default activities (Homework, Reading, Play Time, Chores)
    expect(activityColumns).toHaveLength(4);
    
    activityColumns.forEach((column) => {
      expect(column).toHaveClass('col-12');
    });
  });

  it('should have consistent spacing between full-width activities', () => {
    render(<ActivityManager {...mockProps} />);

    const activityList = screen.getByTestId('activity-list');
    
    // Check that the row has proper gap classes for spacing
    expect(activityList).toHaveClass('gy-3'); // Vertical gap
    
    // Should not have horizontal gap since we're using single column
    expect(activityList).not.toHaveClass('gx-3');
  });

  it('should render activity form in full-width column', () => {
    render(<ActivityManager {...mockProps} />);

    const activityFormColumn = screen.getByTestId('activity-form-column');
    
    // Activity form should also span full width
    expect(activityFormColumn).toHaveClass('col-12');
    expect(activityFormColumn).toHaveClass('mb-3'); // Bottom margin
    
    // Should not have responsive breakpoints
    expect(activityFormColumn).not.toHaveClass('col-md-6');
    expect(activityFormColumn).not.toHaveClass('col-lg-4');
  });
});
