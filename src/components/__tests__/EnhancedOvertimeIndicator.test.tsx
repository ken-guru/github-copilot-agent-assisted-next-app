import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OvertimeIndicator from '../OvertimeIndicator';
import { ThemeProvider } from '../../context/ThemeContext';
import { useViewport } from '../../hooks/useViewport';

// Mock the useViewport hook
jest.mock('../../hooks/useViewport', () => ({
  useViewport: jest.fn()
}));

// Mock the formatDuration function if needed
jest.mock('../../utils/time/timeFormatters', () => ({
  formatDuration: (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}), { virtual: true });

// Mock the navigator.vibrate API
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
  configurable: true
});

describe('Enhanced OvertimeIndicator for Mobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default mock values for useViewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false
    });
  });
  
  test('applies mobile-specific classes on mobile devices', () => {
    // Mock mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    const indicator = screen.getByTestId('overtime-indicator');
    expect(indicator).toHaveClass('mobile');
    expect(indicator).toHaveClass('banner');
  });
  
  test('uses larger text on mobile devices', () => {
    // Mock mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    const duration = screen.getByTestId('overtime-duration');
    expect(duration).toHaveClass('mobileDuration');
  });
  
  test('shows banner style on mobile devices', () => {
    // Mock mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    const indicator = screen.getByTestId('overtime-indicator');
    expect(indicator).toHaveClass('banner');
  });
  
  test('does not add mobile classes on desktop', () => {
    // Mock desktop viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: false,
      hasTouch: false
    });
    
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    const indicator = screen.getByTestId('overtime-indicator');
    expect(indicator).not.toHaveClass('mobile');
    expect(indicator).not.toHaveClass('banner');
  });
  
  test('triggers haptic feedback when entering overtime state', () => {
    // Test for devices with vibration support
    Object.defineProperty(navigator, 'vibrate', { value: mockVibrate });
    
    // Mock mobile viewport with touch support
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    // Initialize in non-overtime state
    const { rerender } = render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={false} overtimeDuration={0} />
      </ThemeProvider>
    );
    
    // Switch to overtime state
    rerender(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    // Verify vibration was triggered
    expect(mockVibrate).toHaveBeenCalledWith([200, 100, 200]);
  });
  
  test('does not trigger haptic feedback on non-vibration devices', () => {
    // Test for devices without vibration support
    Object.defineProperty(navigator, 'vibrate', { value: undefined });
    
    // Mock mobile viewport with touch support
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    // Initialize in non-overtime state
    const { rerender } = render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={false} overtimeDuration={0} />
      </ThemeProvider>
    );
    
    // Switch to overtime state
    rerender(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    // Verify no errors occur when vibration is not supported
    expect(screen.getByTestId('overtime-indicator')).toBeInTheDocument();
  });
  
  test('increases animation intensity on mobile devices', () => {
    // Mock mobile viewport
    (useViewport as jest.Mock).mockReturnValue({
      isMobile: true,
      hasTouch: true
    });
    
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    const indicator = screen.getByTestId('overtime-indicator');
    expect(indicator).toHaveClass('intensePulsing');
  });
});
