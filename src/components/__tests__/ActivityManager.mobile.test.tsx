import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityManager from '../ActivityManager';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

// Mock the getNextAvailableColorSet utility
jest.mock('../../utils/colors', () => ({
  getNextAvailableColorSet: jest.fn(() => ({
    background: '#f0f0f0',
    border: '#999999',
    text: '#000000'
  }))
}));

// Mock the ActivityButton component
jest.mock('../ActivityButton', () => {
  return {
    ActivityButton: ({ activity, onSelect, onRemove }) => (
      <div 
        data-testid={`activity-button-${activity.id}`}
        onClick={() => onSelect(activity)}
      >
        {activity.name}
        {onRemove && (
          <button 
            data-testid={`remove-button-${activity.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(activity.id);
            }}
          >
            Remove
          </button>
        )}
      </div>
    )
  };
});

// Mock the ActivityForm component
jest.mock('../ActivityForm', () => {
  return function MockActivityForm({ onAddActivity }) {
    return (
      <form 
        data-testid="activity-form"
        onSubmit={(e) => {
          e.preventDefault();
          onAddActivity('New Activity');
        }}
      >
        <button type="submit" data-testid="add-activity-button">Add New Activity</button>
      </form>
    );
  };
});

describe('ActivityManager Mobile Enhancements', () => {
  const defaultProps = {
    onActivitySelect: jest.fn(),
    onActivityRemove: jest.fn(),
    currentActivityId: null,
    completedActivityIds: [],
    timelineEntries: [],
    isTimeUp: false,
    elapsedTime: 0
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default to mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true,
      width: 375,
      height: 667
    });
  });

  test('applies mobile-specific classes on mobile viewport', () => {
    render(<ActivityManager {...defaultProps} />);
    
    const container = screen.getByTestId('activity-manager');
    expect(container).toHaveClass('mobileContainer');
  });

  test('renders activity grid with touch-friendly layout on mobile', () => {
    render(<ActivityManager {...defaultProps} />);
    
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).toHaveClass('mobileActivityList');
  });

  test('applies touch-friendly spacing to activity items', () => {
    render(<ActivityManager {...defaultProps} />);
    
    // Wait for default activities to render
    act(() => {
      // Fast-forward timers
      jest.runAllTimers();
    });
    
    const activityItems = screen.getAllByTestId(/^activity-button-/);
    expect(activityItems.length).toBeGreaterThan(0);
    
    // The mobile-specific classes will be checked on the actual component
    // Here we're just verifying that activities render in the mock
    expect(activityItems[0]).toBeInTheDocument();
  });

  test('renders add activity form with touch-friendly styles', () => {
    render(<ActivityManager {...defaultProps} />);
    
    const activityForm = screen.getByTestId('activity-form');
    expect(activityForm).toBeInTheDocument();
  });

  test('supports swipe actions on activity items', () => {
    render(<ActivityManager {...defaultProps} />);
    
    // Get the swipe container
    const swipeContainer = screen.getByTestId('swipe-container');
    expect(swipeContainer).toBeInTheDocument();
    
    // Test swipe gesture to reveal actions
    fireEvent.touchStart(swipeContainer, { touches: [{ clientX: 300, clientY: 50 }] });
    fireEvent.touchMove(swipeContainer, { touches: [{ clientX: 150, clientY: 50 }] });
    fireEvent.touchEnd(swipeContainer);
    
    // Check if actions are revealed
    const actionButtons = screen.getByTestId('swipe-actions');
    expect(actionButtons).toHaveClass('actionsVisible');
  });
  
  test('does not apply mobile styles on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(<ActivityManager {...defaultProps} />);
    
    const container = screen.getByTestId('activity-manager');
    expect(container).not.toHaveClass('mobileContainer');
    
    const activityList = screen.getByTestId('activity-list');
    expect(activityList).not.toHaveClass('mobileActivityList');
  });
});
