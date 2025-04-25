import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OvertimeIndicator from '../OvertimeIndicator';
import { ThemeProvider } from '../../context/ThemeContext';

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

describe('OvertimeIndicator Component', () => {
  test('displays overtime message when overtime is true', () => {
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={120} />
      </ThemeProvider>
    );
    
    const indicator = screen.getByTestId('overtime-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent(/overtime/i);
    expect(indicator).toHaveTextContent(/2:00/); // 120 seconds formatted
  });
  
  test('is not displayed when overtime is false', () => {
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={false} overtimeDuration={0} />
      </ThemeProvider>
    );
    
    const indicator = screen.queryByTestId('overtime-indicator');
    expect(indicator).not.toBeInTheDocument();
  });
  
  test('applies pulsing animation when in overtime', () => {
    render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={60} />
      </ThemeProvider>
    );
    
    const indicator = screen.getByTestId('overtime-indicator');
    expect(indicator).toHaveClass('pulsing');
  });
  
  test('formats overtime duration correctly', () => {
    // Test with various durations
    const { rerender } = render(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={65} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('overtime-indicator')).toHaveTextContent(/1:05/);
    
    rerender(
      <ThemeProvider>
        <OvertimeIndicator isOvertime={true} overtimeDuration={3665} />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('overtime-indicator')).toHaveTextContent(/1:01:05/);
  });
});
