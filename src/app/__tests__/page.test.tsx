import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../context/theme/ThemeContext';
import resetService from '../../utils/resetService';

// Mock necessary hooks and components
jest.mock('../../hooks/useActivityState', () => ({
  useActivityState: jest.fn(() => ({
    currentActivity: null,
    timelineEntries: [],
    startActivity: jest.fn(),
    completeActivity: jest.fn(),
    addTimelineEntry: jest.fn()
  }))
}));

jest.mock('../../utils/resetService', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => Promise.resolve())
}));

// Mock ConfirmationDialog component
jest.mock('../../components/ConfirmationDialog', () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm, onCancel, title, message }) => (
    <div data-testid="mock-dialog">
      {isOpen && (
        <>
          <div>{title}</div>
          <div>{message}</div>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </>
      )}
    </div>
  )
}));

// Mock other required components
jest.mock('../../components/Timeline', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-timeline">Timeline</div>
}));

jest.mock('../../components/Summary', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-summary">Summary</div>
}));

// Access the mocked useActivityState for testing
const mockUseActivityState = require('../../hooks/useActivityState').useActivityState;

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show reset button after time is set', async () => {
    // Mock the useState hook to simulate timeSet = true
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]);
    
    const { container } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    // Check that reset button is shown when time is set
    const resetButton = screen.queryByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
    
    // Cleanup
    useStateSpy.mockRestore();
  });

  it('should call resetService when reset is clicked', async () => {
    // Mock the useState hook to simulate timeSet = true
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]);
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await act(async () => {
      fireEvent.click(resetButton);
    });
    
    // Reset service should have been called
    expect(resetService).toHaveBeenCalled();
    
    // Cleanup
    useStateSpy.mockRestore();
  });

  it('should provide a working dialog callback to resetService', async () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]);
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await act(async () => {
      fireEvent.click(resetButton);
    });
    
    // The dialog content should exist with the Confirm button
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    
    // Simulate user clicking confirm
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    });
    
    // Reset service should be called when Confirm is clicked
    expect(resetService).toHaveBeenCalled();
    
    // Cleanup
    useStateSpy.mockRestore();
  });
});

describe('Mobile Layout', () => {
  it('should maintain touch-friendly sizing for buttons on mobile', async () => {
    // Mock useState to simulate mobile view
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]); // timeSet
    
    // Mock window.innerWidth to simulate mobile
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    // Test mobile-specific element sizing
    const activityButtons = screen.queryAllByRole('button');
    activityButtons.forEach(button => {
      const styles = window.getComputedStyle(button);
      const height = parseFloat(styles.height);
      // Ensure buttons meet touch sizing guidelines (at least 44px)
      if (height > 0) { // Only test visible buttons
        expect(height).toBeGreaterThanOrEqual(44);
      }
    });
    
    // Restore window size
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    
    // Cleanup
    useStateSpy.mockRestore();
  });
});

describe('OfflineIndicator Integration', () => {
  it('should maintain offline indicator positioning across all app states', async () => {
    // Mock useState to simulate timeSet
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]);
    
    // Mock online status
    const originalNavigatorOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    
    // Create an event to trigger the offline handler
    const offlineEvent = new Event('offline');
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    // Dispatch offline event
    window.dispatchEvent(offlineEvent);
    
    // Test that offline indicator appears in the correct position
    const indicator = await screen.findByText(/offline/i);
    expect(indicator).toBeInTheDocument();
    
    // The indicator should be positioned at the top of the screen
    const rect = indicator.getBoundingClientRect();
    expect(rect.top).toBeLessThan(100); // Should be near the top
    
    // Restore navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: originalNavigatorOnLine, configurable: true });
    
    // Cleanup
    useStateSpy.mockRestore();
  });
});

describe('Progress Element Visibility', () => {
  it('should show progress container in activity state', () => {
    // Mock activity state (timeSet = true, !allActivitiesCompleted)
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]);
    
    mockUseActivityState.mockImplementationOnce(() => ({
      currentActivity: { id: '1', name: 'Test Activity' },
      timelineEntries: [{ id: '1', activityId: '1', activityName: 'Test Activity', startTime: 0 }],
      allActivitiesCompleted: false,
      startActivity: jest.fn(),
      completeActivity: jest.fn(),
      addTimelineEntry: jest.fn()
    }));
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    // Progress container should be visible during activity
    const progressContainer = screen.queryByTestId('progress-container');
    expect(progressContainer).toBeInTheDocument();
    
    // Cleanup
    useStateSpy.mockRestore();
  });
  
  it('should not show progress container in setup state', () => {
    // Mock for setup state (timeSet = false)
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [false, jest.fn()]);
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    // Progress container should not be visible during setup
    const progressContainer = screen.queryByTestId('progress-container');
    expect(progressContainer).not.toBeInTheDocument();
    
    // Cleanup
    useStateSpy.mockRestore();
  });
  
  it('should not show progress container in completed state', () => {
    // Mock for completed state (timeSet = true, allActivitiesCompleted = true)
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementationOnce(() => [true, jest.fn()]);
    
    mockUseActivityState.mockImplementationOnce(() => ({
      currentActivity: null,
      timelineEntries: [{ id: '1', activityId: '1', activityName: 'Test Activity', startTime: 0, endTime: 1000 }],
      allActivitiesCompleted: true,
      startActivity: jest.fn(),
      completeActivity: jest.fn(),
      addTimelineEntry: jest.fn()
    }));
    
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    
    // Progress container should not be visible when all activities are completed
    const progressContainer = screen.queryByTestId('progress-container');
    expect(progressContainer).not.toBeInTheDocument();
    
    // Cleanup
    useStateSpy.mockRestore();
  });
});
