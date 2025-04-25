import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwipeActions from '../SwipeActions';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

describe('SwipeActions Component', () => {
  const mockLeftAction = jest.fn();
  const mockRightAction = jest.fn();
  
  const defaultProps = {
    leftAction: {
      label: 'Delete',
      icon: <span>🗑️</span>,
      handler: mockLeftAction,
      color: '#f44336'
    },
    rightAction: {
      label: 'Archive',
      icon: <span>📁</span>,
      handler: mockRightAction,
      color: '#4caf50'
    }
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default to mobile viewport with touch capability
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true,
      width: 375,
      height: 667
    });
  });
  
  test('renders children without modification initially', () => {
    render(
      <SwipeActions {...defaultProps}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent('Test Content');
    
    // Actions should be present but not visible
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });
  
  test('shows left action when swiped right', () => {
    render(
      <SwipeActions {...defaultProps}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    
    // Start from middle
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 100 }]
    });
    
    // Swipe right
    fireEvent.touchMove(container, {
      touches: [{ clientX: 300, clientY: 100 }]
    });
    
    const content = screen.getByTestId('swipe-content');
    expect(content).toHaveStyle('transform: translateX(100px)');
    
    // Action should be visible
    const leftActionElement = screen.getByTestId('left-action');
    expect(leftActionElement).toBeVisible();
  });
  
  test('shows right action when swiped left', () => {
    render(
      <SwipeActions {...defaultProps}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    
    // Start from middle
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 100 }]
    });
    
    // Swipe left
    fireEvent.touchMove(container, {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    
    const content = screen.getByTestId('swipe-content');
    expect(content).toHaveStyle('transform: translateX(-100px)');
    
    // Action should be visible
    const rightActionElement = screen.getByTestId('right-action');
    expect(rightActionElement).toBeVisible();
  });
  
  test('triggers left action when swiped enough and released', () => {
    render(
      <SwipeActions {...defaultProps} actionThreshold={75}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    
    // Start from middle
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 100 }]
    });
    
    // Swipe right past threshold
    fireEvent.touchMove(container, {
      touches: [{ clientX: 300, clientY: 100 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Left action should be called
    expect(mockLeftAction).toHaveBeenCalledTimes(1);
    expect(mockRightAction).not.toHaveBeenCalled();
  });
  
  test('triggers right action when swiped enough and released', () => {
    render(
      <SwipeActions {...defaultProps} actionThreshold={75}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    
    // Start from middle
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 100 }]
    });
    
    // Swipe left past threshold
    fireEvent.touchMove(container, {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Right action should be called
    expect(mockRightAction).toHaveBeenCalledTimes(1);
    expect(mockLeftAction).not.toHaveBeenCalled();
  });
  
  test('resets position when not swiped enough', () => {
    render(
      <SwipeActions {...defaultProps} actionThreshold={120}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    
    // Start from middle
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 100 }]
    });
    
    // Swipe right, but not past threshold
    fireEvent.touchMove(container, {
      touches: [{ clientX: 300, clientY: 100 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Neither action should be called
    expect(mockLeftAction).not.toHaveBeenCalled();
    expect(mockRightAction).not.toHaveBeenCalled();
    
    // Content should animate back to original position
    const content = screen.getByTestId('swipe-content');
    expect(content).toHaveStyle('transform: translateX(0px)');
  });
  
  test('provides haptic feedback when crossing threshold', () => {
    // Mock navigator.vibrate
    const mockVibrate = jest.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: mockVibrate,
      writable: true,
      configurable: true
    });
    
    render(
      <SwipeActions {...defaultProps} actionThreshold={75} useHapticFeedback={true}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    
    // Start from middle
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 100 }]
    });
    
    // Swipe just below threshold
    fireEvent.touchMove(container, {
      touches: [{ clientX: 274, clientY: 100 }]
    });
    
    // Vibrate should not be called yet
    expect(mockVibrate).not.toHaveBeenCalled();
    
    // Swipe past threshold
    fireEvent.touchMove(container, {
      touches: [{ clientX: 276, clientY: 100 }]
    });
    
    // Vibrate should be called once when crossing threshold
    expect(mockVibrate).toHaveBeenCalledTimes(1);
    expect(mockVibrate).toHaveBeenCalledWith([10]);
  });
  
  test('does not apply SwipeActions on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(
      <SwipeActions {...defaultProps}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    // Should just render children without swipe functionality
    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    
    // Container should not have swipeContainer class
    const container = screen.getByTestId('swipe-actions-container');
    expect(container).not.toHaveClass('swipeContainer');
    
    // Actions should not be rendered
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
  });
  
  test('provides fallback buttons for accessibility', () => {
    render(
      <SwipeActions {...defaultProps} showActionButtons={true}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    // Action buttons should be rendered
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    const archiveButton = screen.getByRole('button', { name: /archive/i });
    
    expect(deleteButton).toBeInTheDocument();
    expect(archiveButton).toBeInTheDocument();
    
    // Click delete button
    fireEvent.click(deleteButton);
    expect(mockLeftAction).toHaveBeenCalledTimes(1);
    
    // Click archive button
    fireEvent.click(archiveButton);
    expect(mockRightAction).toHaveBeenCalledTimes(1);
  });
  
  test('respects reduced motion preferences', () => {
    // Mock matchMedia for prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }))
    });
    
    render(
      <SwipeActions {...defaultProps}>
        <div data-testid="child-content">Test Content</div>
      </SwipeActions>
    );
    
    const container = screen.getByTestId('swipe-actions-container');
    expect(container).toHaveClass('reduceMotion');
  });
});
