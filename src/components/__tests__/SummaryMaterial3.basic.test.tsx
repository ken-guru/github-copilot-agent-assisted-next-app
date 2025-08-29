import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryMaterial3 from '../SummaryMaterial3';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';

// Mock all external dependencies
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [])
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

jest.mock('../../utils/colors', () => ({
  isDarkMode: jest.fn(() => false),
  internalActivityColors: []
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <ApiKeyProvider>
      {children}
    </ApiKeyProvider>
  </ToastProvider>
);

describe('SummaryMaterial3 Basic Tests', () => {
  const basicProps = {
    entries: [] as TimelineEntry[],
    totalDuration: 3600,
    elapsedTime: 2700,
    timerActive: false,
    allActivitiesCompleted: true,
    isTimeUp: false,
    skippedActivityIds: []
  };

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <SummaryMaterial3 {...basicProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('displays the summary title', () => {
    render(
      <TestWrapper>
        <SummaryMaterial3 {...basicProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('shows stats grid', () => {
    render(
      <TestWrapper>
        <SummaryMaterial3 {...basicProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('stats-grid')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-planned')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-spent')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-idle')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-overtime')).toBeInTheDocument();
  });

  it('returns null when not completed and time is not up', () => {
    const { container } = render(
      <TestWrapper>
        <SummaryMaterial3 
          {...basicProps}
          allActivitiesCompleted={false}
          isTimeUp={false}
        />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when time is up even if not completed', () => {
    render(
      <TestWrapper>
        <SummaryMaterial3 
          {...basicProps}
          allActivitiesCompleted={false}
          isTimeUp={true}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });

  it('applies Material 3 CSS classes', () => {
    render(
      <TestWrapper>
        <SummaryMaterial3 {...basicProps} />
      </TestWrapper>
    );

    const container = screen.getByTestId('summary');
    expect(container).toHaveClass('summaryContainer');
  });
});