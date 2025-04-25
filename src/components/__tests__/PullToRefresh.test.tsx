import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PullToRefresh from '../PullToRefresh';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

describe('PullToRefresh Component', () => {
  const mockOnRefresh = jest.fn();
  
  const TestChildComponent = () => (
    <div data-testid="test-content">
      Test Content
    </div>
  );
  
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
  
  test('renders children components', () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
  });
  
  test('shows pull indicator when dragging down', () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    
    // Simulate pull down
    fireEvent.touchStart(container, {
      touches: [{ clientY: 100 }]
    });
    
    // Move down 70px (not enough to trigger refresh)
    fireEvent.touchMove(container, {
      touches: [{ clientY: 170 }]
    });
    
    const indicator = screen.getByTestId('pull-indicator');
    expect(indicator).toBeVisible();
    expect(indicator).toHaveStyle('transform: translateY(70px)');
  });
  
  test('triggers refresh when pulled down past threshold', () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh} pullThreshold={100}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    
    // Simulate pull down past threshold
    fireEvent.touchStart(container, {
      touches: [{ clientY: 100 }]
    });
    
    // Move down 150px (more than threshold)
    fireEvent.touchMove(container, {
      touches: [{ clientY: 250 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Should show loading state
    const loadingIndicator = screen.getByTestId('refresh-loading-indicator');
    expect(loadingIndicator).toBeVisible();
    
    // Should call onRefresh
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });
  
  test('does not trigger refresh when not pulled enough', () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh} pullThreshold={100}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    
    // Simulate pull down below threshold
    fireEvent.touchStart(container, {
      touches: [{ clientY: 100 }]
    });
    
    // Move down 70px (less than threshold)
    fireEvent.touchMove(container, {
      touches: [{ clientY: 170 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Should not call onRefresh
    expect(mockOnRefresh).not.toHaveBeenCalled();
  });
  
  test('resets pull state after touch ends', async () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    
    // Simulate pull down
    fireEvent.touchStart(container, {
      touches: [{ clientY: 100 }]
    });
    
    // Move down 70px
    fireEvent.touchMove(container, {
      touches: [{ clientY: 170 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Let animation complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    
    // Indicator should return to original position
    const indicator = screen.getByTestId('pull-indicator');
    expect(indicator).toHaveStyle('transform: translateY(0px)');
  });
  
  test('provides button alternative for accessibility', () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh} showRefreshButton={true}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeInTheDocument();
    
    // Click refresh button
    fireEvent.click(refreshButton);
    
    // Should call onRefresh
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });
  
  test('honors disablePullToRefresh prop', () => {
    render(
      <PullToRefresh onRefresh={mockOnRefresh} disablePullToRefresh={true}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    
    // Simulate pull down past threshold
    fireEvent.touchStart(container, {
      touches: [{ clientY: 100 }]
    });
    
    // Move down 150px (more than default threshold)
    fireEvent.touchMove(container, {
      touches: [{ clientY: 250 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Should not call onRefresh
    expect(mockOnRefresh).not.toHaveBeenCalled();
    
    // Pull indicator should not be visible
    const indicator = screen.queryByTestId('pull-indicator');
    expect(indicator).not.toBeVisible();
  });
  
  test('is not rendered on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false,
      width: 1024,
      height: 768
    });
    
    render(
      <PullToRefresh onRefresh={mockOnRefresh}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    // Should render children without pull-to-refresh functionality
    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    
    // Pull to refresh container should not have pull-to-refresh class
    const container = screen.queryByTestId('pull-to-refresh-container');
    expect(container).not.toHaveClass('pullToRefresh');
  });
  
  test('supports haptic feedback when available', () => {
    // Mock navigator.vibrate
    const mockVibrate = jest.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: mockVibrate,
      writable: true,
      configurable: true
    });
    
    render(
      <PullToRefresh onRefresh={mockOnRefresh} useHapticFeedback={true}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    
    // Simulate pull down past threshold
    fireEvent.touchStart(container, {
      touches: [{ clientY: 100 }]
    });
    
    // Move down 150px (more than default threshold)
    fireEvent.touchMove(container, {
      touches: [{ clientY: 250 }]
    });
    
    // Release
    fireEvent.touchEnd(container);
    
    // Should call vibrate
    expect(mockVibrate).toHaveBeenCalledWith([15]);
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
      <PullToRefresh onRefresh={mockOnRefresh}>
        <TestChildComponent />
      </PullToRefresh>
    );
    
    const container = screen.getByTestId('pull-to-refresh-container');
    expect(container).toHaveClass('reduceMotion');
  });
});
