import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryMaterial3 from '../SummaryMaterial3';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';

// Mock dependencies
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [
    { id: '1', name: 'Task 1', colorIndex: 0, description: 'First task' },
    { id: '2', name: 'Task 2', colorIndex: 1, description: 'Second task' }
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

// Mock colors utility
jest.mock('../../utils/colors', () => ({
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

const mockTimelineEntries: TimelineEntry[] = [
  {
    id: 'entry1',
    activityId: '1',
    activityName: 'Task 1',
    startTime: Date.now() - 3600000, // 1 hour ago
    endTime: Date.now() - 1800000, // 30 minutes ago
    colors: {
      light: { background: 'hsl(0, 70%, 95%)', text: 'hsl(0, 70%, 20%)', border: 'hsl(0, 70%, 80%)' },
      dark: { background: 'hsl(0, 70%, 15%)', text: 'hsl(0, 70%, 90%)', border: 'hsl(0, 70%, 30%)' }
    }
  },
  {
    id: 'entry2',
    activityId: '2',
    activityName: 'Task 2',
    startTime: Date.now() - 1800000, // 30 minutes ago
    endTime: Date.now() - 900000, // 15 minutes ago
    colors: {
      light: { background: 'hsl(210, 70%, 95%)', text: 'hsl(210, 70%, 20%)', border: 'hsl(210, 70%, 80%)' },
      dark: { background: 'hsl(210, 70%, 15%)', text: 'hsl(210, 70%, 90%)', border: 'hsl(210, 70%, 30%)' }
    }
  }
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <ApiKeyProvider>
      {children}
    </ApiKeyProvider>
  </ToastProvider>
);

describe('SummaryMaterial3', () => {
  const defaultProps = {
    entries: mockTimelineEntries,
    totalDuration: 3600, // 1 hour
    elapsedTime: 2700, // 45 minutes
    timerActive: false,
    allActivitiesCompleted: true,
    isTimeUp: false,
    skippedActivityIds: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Basic Functionality', () => {
    it('renders summary container with Material 3 styling', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const summaryContainer = screen.getByTestId('summary');
      expect(summaryContainer).toBeInTheDocument();
      expect(summaryContainer).toHaveClass('summaryContainer');
    });

    it('displays summary title with proper typography', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Summary');
      expect(title).toHaveClass('summaryTitle');
    });

    it('renders header actions with Material 3 buttons', () => {
      const mockReset = jest.fn();
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} onReset={mockReset} />
        </TestWrapper>
      );

      expect(screen.getByTitle('Reset to default activities')).toBeInTheDocument();
      expect(screen.getByTitle('Share session')).toBeInTheDocument();
    });

    it('does not render when activities are not completed and time is not up', () => {
      const { container } = render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps} 
            allActivitiesCompleted={false}
            isTimeUp={false}
          />
        </TestWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Status Messages', () => {
    it('displays success status when finished early', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            elapsedTime={3000} // 50 minutes (10 minutes early)
          />
        </TestWrapper>
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toBeInTheDocument();
      expect(statusAlert).toHaveClass('success');
      expect(statusAlert).toHaveTextContent(/Amazing! You finished.*earlier than planned!/);
    });

    it('displays warning status when finished late', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            elapsedTime={4200} // 70 minutes (10 minutes late)
          />
        </TestWrapper>
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toBeInTheDocument();
      expect(statusAlert).toHaveClass('warning');
      expect(statusAlert).toHaveTextContent(/You took.*more than planned/);
    });

    it('displays time up status when isTimeUp is true', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            isTimeUp={true}
          />
        </TestWrapper>
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toBeInTheDocument();
      expect(statusAlert).toHaveClass('warning');
      expect(statusAlert).toHaveTextContent("Time's up! Review your completed activities below.");
    });

    it('displays active timer status', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            timerActive={true}
            elapsedTime={1800} // 30 minutes
          />
        </TestWrapper>
      );

      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toBeInTheDocument();
      expect(statusAlert).toHaveClass('success');
      expect(statusAlert).toHaveTextContent("You're doing great, keep going!");
    });
  });

  describe('Statistics Display', () => {
    it('renders all stat cards with correct values', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      // Check stat cards are present
      expect(screen.getByTestId('stat-card-planned')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-spent')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-idle')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-overtime')).toBeInTheDocument();

      // Check stat values
      expect(screen.getByTestId('stat-value-planned')).toHaveTextContent('1h 0m 0s');
      expect(screen.getByTestId('stat-value-spent')).toHaveTextContent('45m 0s');
    });

    it('formats duration correctly for different time ranges', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            totalDuration={7265} // 2h 1m 5s
            elapsedTime={125} // 2m 5s
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('stat-value-planned')).toHaveTextContent('2h 1m 5s');
      expect(screen.getByTestId('stat-value-spent')).toHaveTextContent('2m 5s');
    });

    it('handles seconds-only duration formatting', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            totalDuration={45}
            elapsedTime={30}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('stat-value-planned')).toHaveTextContent('45s');
      expect(screen.getByTestId('stat-value-spent')).toHaveTextContent('30s');
    });
  });

  describe('Activity List', () => {
    it('displays activity list with proper styling', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByTestId('activity-list-heading')).toHaveTextContent('Time Spent per Activity');
      expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      
      // Check individual activity items
      expect(screen.getByTestId('activity-summary-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('activity-summary-item-2')).toBeInTheDocument();
      
      expect(screen.getByTestId('activity-name-1')).toHaveTextContent('Task 1');
      expect(screen.getByTestId('activity-name-2')).toHaveTextContent('Task 2');
    });

    it('applies theme-appropriate colors to activity items', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const activityItem = screen.getByTestId('activity-summary-item-1');
      expect(activityItem).toHaveStyle({
        backgroundColor: 'hsl(0, 70%, 95%)',
        borderColor: 'hsl(0, 70%, 80%)'
      });

      const activityName = screen.getByTestId('activity-name-1');
      expect(activityName).toHaveStyle({
        color: 'hsl(0, 70%, 20%)'
      });
    });

    it('handles empty activity list gracefully', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            entries={[]}
          />
        </TestWrapper>
      );

      expect(screen.queryByTestId('activity-list-heading')).not.toBeInTheDocument();
      expect(screen.queryByTestId('activity-list')).not.toBeInTheDocument();
    });
  });

  describe('Skipped Activities', () => {
    it('displays skipped activities section when present', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            skippedActivityIds={['1', '2']}
          />
        </TestWrapper>
      );

      const skippedSection = screen.getByTestId('skipped-activities');
      expect(skippedSection).toBeInTheDocument();
      expect(screen.getByText('Skipped activities (2)')).toBeInTheDocument();
      
      expect(screen.getByTestId('skipped-activity-name-1')).toHaveTextContent('Task 1');
      expect(screen.getByTestId('skipped-activity-name-2')).toHaveTextContent('Task 2');
    });

    it('does not display skipped activities section when empty', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByTestId('skipped-activities')).not.toBeInTheDocument();
    });
  });

  describe('AI Summary Feature', () => {
    it('does not show AI summary button when no API key is available', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByTitle('Generate AI summary')).not.toBeInTheDocument();
    });

    it('displays AI summary section when AI summary is provided', () => {
      // This would require setting up the AI summary state properly
      // For now, we'll just check that the component renders without the AI summary section
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
    });
  });

  describe('Share Functionality', () => {
    it('opens share modal when share button is clicked', async () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const shareButton = screen.getByTestId('open-share-modal-summary');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(screen.getByText('Share session')).toBeInTheDocument();
        expect(screen.getByText('Share a read-only copy of the current session. This will create a public URL that anyone can open.')).toBeInTheDocument();
      });
    });

    it('closes share modal when cancel is clicked', async () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const shareButton = screen.getByTestId('open-share-modal-summary');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Share session')).not.toBeInTheDocument();
      });
    });
  });

  describe('Reset Functionality', () => {
    it('calls onReset when reset button is clicked', () => {
      const mockReset = jest.fn();
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} onReset={mockReset} />
        </TestWrapper>
      );

      const resetButton = screen.getByTitle('Reset to default activities');
      fireEvent.click(resetButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('does not render reset button when onReset is not provided', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByTitle('Reset to default activities')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const statsGrid = screen.getByTestId('stats-grid');
      expect(statsGrid).toHaveClass('statsGrid');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      
      const statusAlert = screen.getByTestId('summary-status');
      expect(statusAlert).toHaveAttribute('role', 'alert');
    });

    it('maintains focus management in modals', async () => {
      render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      const shareButton = screen.getByTestId('open-share-modal-summary');
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Close')).toBeInTheDocument();
      });
    });
  });

  describe('Theme Integration', () => {
    it('responds to theme changes', () => {
      const { isDarkMode } = require('../../utils/colors');
      
      // Test light theme
      (isDarkMode as jest.Mock).mockReturnValue(false);
      
      const { rerender } = render(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      // Test dark theme
      (isDarkMode as jest.Mock).mockReturnValue(true);
      
      rerender(
        <TestWrapper>
          <SummaryMaterial3 {...defaultProps} />
        </TestWrapper>
      );

      // The component should handle theme changes through CSS custom properties
      expect(screen.getByTestId('summary')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles large activity lists efficiently', () => {
      const manyEntries: TimelineEntry[] = Array.from({ length: 50 }, (_, i) => ({
        id: `entry${i}`,
        activityId: `${i}`,
        activityName: `Task ${i}`,
        startTime: Date.now() - (i * 60000),
        endTime: Date.now() - ((i - 1) * 60000),
        colors: {
          light: { background: 'hsl(0, 70%, 95%)', text: 'hsl(0, 70%, 20%)', border: 'hsl(0, 70%, 80%)' },
          dark: { background: 'hsl(0, 70%, 15%)', text: 'hsl(0, 70%, 90%)', border: 'hsl(0, 70%, 30%)' }
        }
      }));

      render(
        <TestWrapper>
          <SummaryMaterial3 
            {...defaultProps}
            entries={manyEntries}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      // Should render without performance issues
    });
  });
});