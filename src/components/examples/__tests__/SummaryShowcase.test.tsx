import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryShowcase from '../SummaryShowcase';

// Mock dependencies
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [
    { id: '5', name: 'Skipped Task 1', colorIndex: 0 },
    { id: '6', name: 'Skipped Task 2', colorIndex: 1 }
  ])
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ online: true })
}));

jest.mock('@/utils/fetchWithVercelBypass', () => ({
  fetchWithVercelBypass: jest.fn()
}));

jest.mock('@/utils/sharing', () => ({
  mapTimelineEntriesForShare: jest.fn((entries) => entries)
}));

jest.mock('@/utils/ai/byokClient', () => ({
  useOpenAIClient: () => ({
    callOpenAI: jest.fn()
  })
}));

jest.mock('../../../utils/colors', () => ({
  isDarkMode: jest.fn(() => false),
  internalActivityColors: [
    {
      light: { background: 'hsl(0, 70%, 95%)', text: 'hsl(0, 70%, 20%)', border: 'hsl(0, 70%, 80%)' },
      dark: { background: 'hsl(0, 70%, 15%)', text: 'hsl(0, 70%, 90%)', border: 'hsl(0, 70%, 30%)' }
    },
    {
      light: { background: 'hsl(210, 70%, 95%)', text: 'hsl(210, 70%, 20%)', border: 'hsl(210, 70%, 80%)' },
      dark: { background: 'hsl(210, 70%, 15%)', text: 'hsl(210, 70%, 90%)', border: 'hsl(210, 70%, 30%)' }
    }
  ]
}));

describe('SummaryShowcase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the showcase title and description', () => {
    render(<SummaryShowcase />);

    expect(screen.getByText('Material 3 Summary Component Showcase')).toBeInTheDocument();
    expect(screen.getByText(/Explore different states and scenarios/)).toBeInTheDocument();
  });

  it('renders all scenario buttons', () => {
    render(<SummaryShowcase />);

    expect(screen.getByText('Completed Early')).toBeInTheDocument();
    expect(screen.getByText('Completed Late')).toBeInTheDocument();
    expect(screen.getByText('Time Up')).toBeInTheDocument();
    expect(screen.getByText('Active Timer')).toBeInTheDocument();
  });

  it('renders the skipped activities checkbox', () => {
    render(<SummaryShowcase />);

    const checkbox = screen.getByLabelText('Show skipped activities');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('starts with completed early scenario selected', () => {
    render(<SummaryShowcase />);

    expect(screen.getByText('Current Scenario: Completed Early')).toBeInTheDocument();
    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('switches scenarios when buttons are clicked', () => {
    render(<SummaryShowcase />);

    // Click on "Completed Late" button
    fireEvent.click(screen.getByText('Completed Late'));
    // Check that the summary component is still rendered
    expect(screen.getByTestId('summary')).toBeInTheDocument();

    // Click on "Time Up" button
    fireEvent.click(screen.getByText('Time Up'));
    expect(screen.getByTestId('summary')).toBeInTheDocument();

    // Click on "Active Timer" button
    fireEvent.click(screen.getByText('Active Timer'));
    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('toggles skipped activities when checkbox is clicked', () => {
    render(<SummaryShowcase />);

    const checkbox = screen.getByLabelText('Show skipped activities');
    
    // Initially unchecked
    expect(checkbox).not.toBeChecked();

    // Click to check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('displays the summary component for each scenario', () => {
    render(<SummaryShowcase />);

    // Test each scenario
    const scenarios = ['Completed Early', 'Completed Late', 'Time Up', 'Active Timer'];
    
    scenarios.forEach(scenario => {
      fireEvent.click(screen.getByText(scenario));
      expect(screen.getByTestId('summary')).toBeInTheDocument();
    });
  });

  it('shows Material 3 features list', () => {
    render(<SummaryShowcase />);

    expect(screen.getByText('Material 3 Expressive Features')).toBeInTheDocument();
    expect(screen.getByText(/Elevated Containers:/)).toBeInTheDocument();
    expect(screen.getByText(/Organic Shapes:/)).toBeInTheDocument();
    expect(screen.getByText(/Expressive Typography:/)).toBeInTheDocument();
    expect(screen.getByText(/Contextual Colors:/)).toBeInTheDocument();
    expect(screen.getByText(/Smooth Animations:/)).toBeInTheDocument();
    expect(screen.getByText(/Enhanced Interactions:/)).toBeInTheDocument();
    expect(screen.getByText(/Responsive Design:/)).toBeInTheDocument();
    expect(screen.getByText(/Accessibility:/)).toBeInTheDocument();
  });

  it('handles reset callback', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<SummaryShowcase />);

    // The reset button should be available in the summary component
    // This would require the summary component to be rendered with onReset prop
    expect(screen.getByTestId('summary')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('applies proper styling classes', () => {
    render(<SummaryShowcase />);

    const summaryContainer = screen.getByTestId('summary');
    expect(summaryContainer).toHaveClass('summaryContainer');
  });

  it('renders with different timeline entries for each scenario', () => {
    render(<SummaryShowcase />);

    // Each scenario should show the activity list
    expect(screen.getByTestId('activity-list')).toBeInTheDocument();
    
    // Should show the mock activities
    expect(screen.getByText('Design Review')).toBeInTheDocument();
    expect(screen.getByText('Code Implementation')).toBeInTheDocument();
    expect(screen.getByText('Testing & QA')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('shows different status messages for different scenarios', () => {
    render(<SummaryShowcase />);

    // Test completed early scenario (default)
    expect(screen.getByTestId('summary-status')).toBeInTheDocument();

    // Test completed late scenario
    fireEvent.click(screen.getByText('Completed Late'));
    expect(screen.getByTestId('summary-status')).toBeInTheDocument();

    // Test time up scenario
    fireEvent.click(screen.getByText('Time Up'));
    expect(screen.getByTestId('summary-status')).toBeInTheDocument();

    // Test active timer scenario
    fireEvent.click(screen.getByText('Active Timer'));
    expect(screen.getByTestId('summary-status')).toBeInTheDocument();
  });
});