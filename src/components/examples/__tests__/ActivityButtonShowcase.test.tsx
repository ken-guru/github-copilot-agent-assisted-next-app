import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ActivityButtonShowcase } from '../ActivityButtonShowcase';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('@/hooks/useMotionSystem', () => ({
  useMotionSystem: () => ({
    transitions: {
      cardHover: { transform: 'translateY(-2px)' },
      focus: { enter: {}, exit: {} }
    }
  })
}));

jest.mock('@/hooks/useThemeReactive', () => ({
  useThemeReactive: () => 'light'
}));

jest.mock('@/utils/colors', () => ({
  getActivityColorsForTheme: () => [
    { background: 'hsl(200, 60%, 95%)', text: 'hsl(200, 60%, 25%)', border: 'hsl(200, 60%, 35%)' },
    { background: 'hsl(120, 60%, 95%)', text: 'hsl(120, 60%, 25%)', border: 'hsl(120, 60%, 35%)' },
    { background: 'hsl(60, 60%, 95%)', text: 'hsl(60, 60%, 25%)', border: 'hsl(60, 60%, 35%)' },
    { background: 'hsl(300, 60%, 95%)', text: 'hsl(300, 60%, 25%)', border: 'hsl(300, 60%, 35%)' }
  ]
}));

describe('ActivityButtonShowcase', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders showcase with all activity buttons', () => {
    render(<ActivityButtonShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Activity Buttons')).toBeInTheDocument();
    expect(screen.getByText('Design Review')).toBeInTheDocument();
    expect(screen.getByText('Code Implementation')).toBeInTheDocument();
    expect(screen.getByText('Testing & QA')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('allows starting and completing activities', async () => {
    render(<ActivityButtonShowcase />);
    
    // Start an activity
    const startButton = screen.getByTestId('start-activity-design-review');
    fireEvent.click(startButton);
    
    // Should show complete button
    await waitFor(() => {
      expect(screen.getByTestId('complete-activity-design-review')).toBeInTheDocument();
    });
    
    // Complete the activity
    const completeButton = screen.getByTestId('complete-activity-design-review');
    fireEvent.click(completeButton);
    
    // Should show completed state
    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  it('shows elapsed time for running activities', async () => {
    render(<ActivityButtonShowcase />);
    
    // Start an activity
    const startButton = screen.getByTestId('start-activity-code-implementation');
    fireEvent.click(startButton);
    
    // Wait for timer to start
    await waitFor(() => {
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });
    
    // Advance timer
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('00:03')).toBeInTheDocument();
    });
  });

  it('allows removing activities', async () => {
    render(<ActivityButtonShowcase />);
    
    // Remove an activity (using correct kebab-case conversion)
    const removeButton = screen.getByTestId('remove-activity-testing-qa');
    fireEvent.click(removeButton);
    
    // Activity should be removed
    await waitFor(() => {
      expect(screen.queryByText('Testing & QA')).not.toBeInTheDocument();
    });
  });

  it('resets showcase state when reset button is clicked', async () => {
    render(<ActivityButtonShowcase />);
    
    // Start an activity
    const startButton = screen.getByTestId('start-activity-documentation');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('complete-activity-documentation')).toBeInTheDocument();
    });
    
    // Reset showcase
    const resetButton = screen.getByText('Reset Showcase');
    fireEvent.click(resetButton);
    
    // Should return to initial state
    await waitFor(() => {
      expect(screen.getByTestId('start-activity-documentation')).toBeInTheDocument();
      expect(screen.queryByTestId('complete-activity-documentation')).not.toBeInTheDocument();
    });
  });

  it('displays Material 3 features information', () => {
    render(<ActivityButtonShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Features')).toBeInTheDocument();
    expect(screen.getByText(/Organic card shapes with varied corner radius/)).toBeInTheDocument();
    expect(screen.getByText(/Dynamic color application based on activity state/)).toBeInTheDocument();
    expect(screen.getByText(/Expressive hover states with subtle scale/)).toBeInTheDocument();
  });

  it('handles multiple activities in different states', async () => {
    render(<ActivityButtonShowcase />);
    
    // Start and complete first activity
    fireEvent.click(screen.getByTestId('start-activity-design-review'));
    
    await waitFor(() => {
      expect(screen.getByTestId('complete-activity-design-review')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('complete-activity-design-review'));
    
    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
    
    // Start second activity
    fireEvent.click(screen.getByTestId('start-activity-code-implementation'));
    
    await waitFor(() => {
      // First should be completed
      expect(screen.getByText('Done')).toBeInTheDocument();
      // Second should be running
      expect(screen.getByTestId('complete-activity-code-implementation')).toBeInTheDocument();
      // Others should be idle
      expect(screen.getByTestId('start-activity-testing-qa')).toBeInTheDocument();
      expect(screen.getByTestId('start-activity-documentation')).toBeInTheDocument();
    });
  });
});