import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../src/app/page';

// Mock components used in the Home page
jest.mock('@/components/TimeSetup', () => {
  return function MockedTimeSetup() {
    return <div data-testid="time-setup">Time Setup Mock</div>;
  };
});

jest.mock('@/components/ActivityManager', () => {
  return function MockedActivityManager() {
    return <div data-testid="activity-manager">Activity Manager Mock</div>;
  };
});

jest.mock('@/components/Timeline', () => {
  return function MockedTimeline() {
    return <div data-testid="timeline">Timeline Mock</div>;
  };
});

jest.mock('@/components/Summary', () => {
  return function MockedSummary() {
    return <div data-testid="summary">Summary Mock</div>;
  };
});

jest.mock('@/components/ProgressBar', () => {
  return function MockedProgressBar() {
    return <div data-testid="progress-bar">Progress Bar Mock</div>;
  };
});

jest.mock('@/components/ThemeToggle', () => {
  return function MockedThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle Mock</div>;
  };
});

jest.mock('@/components/OfflineIndicator', () => {
  return function MockedOfflineIndicator() {
    return <div data-testid="offline-indicator">Offline Indicator Mock</div>;
  };
});

jest.mock('@/components/ConfirmationDialog', () => {
  return function MockedConfirmationDialog() {
    return <div data-testid="confirmation-dialog">Confirmation Dialog Mock</div>;
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Home component', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Mr. Timely' })).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('offline-indicator')).toBeInTheDocument();
  });

  it('renders the setup state', () => {
    render(<Home />);
    expect(screen.getByTestId('time-setup')).toBeInTheDocument();
  });

  it('renders the activity state', () => {
    render(<Home />);
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('renders the completed state', () => {
    render(<Home />);
    expect(screen.getByTestId('summary')).toBeInTheDocument();
  });
});