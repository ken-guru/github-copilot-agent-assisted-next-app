import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';
import '@testing-library/jest-dom';

// Router mock
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

// Global timer mock (default: not running)
const mockUseGlobalTimer = jest.fn(() => ({ isTimerRunning: false }));
jest.mock('../../contexts/GlobalTimerContext', () => ({
  useGlobalTimer: () => mockUseGlobalTimer(),
}));

// Helper: get link element by href, optionally scoped by a container (e.g., specific nav item)
const getLinkByHref = (container: HTMLElement, href: string): HTMLAnchorElement => {
  const anchors = container.querySelectorAll('a');
  for (const a of Array.from(anchors)) {
    if (a.getAttribute('href') === href) return a as HTMLAnchorElement;
  }
  throw new Error(`Link with href ${href} not found`);
};

describe('Navigation', () => {
  it('renders Timer and Activities links', () => {
    render(<Navigation />);
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });

  it('has accessible ARIA labels', () => {
    render(<Navigation />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    // No longer has toggle navigation button - removed for simplification (Issue #245)
    expect(screen.getByLabelText('Go to Timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to Activities Management')).toBeInTheDocument();
  });

  it('is simplified (no navbar-toggler needed)', () => {
    render(<Navigation />);
    // Verify simplified navigation doesn't have toggle button (Issue #245 fix)
    const toggleButton = screen.queryByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).not.toBeInTheDocument();
    
    // All navigation items should be visible
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });

  it('updates Timer link aria-label based on timer running state', () => {
    // Running
    mockUseGlobalTimer.mockReturnValueOnce({ isTimerRunning: true });
  const { unmount } = render(<Navigation />);
  const timerItem = screen.getByTestId('timer-nav-item');
  const timerLink = getLinkByHref(timerItem, '/');
    expect(timerLink).toHaveAttribute('aria-label', 'Go to Active Timer');
    unmount();

    // Not running
    mockUseGlobalTimer.mockReturnValueOnce({ isTimerRunning: false });
  render(<Navigation />);
  const timerItem2 = screen.getByTestId('timer-nav-item');
  const timerLink2 = getLinkByHref(timerItem2, '/');
    expect(timerLink2).toHaveAttribute('aria-label', 'Go to Timer Setup');
  });

  it('shows confirm dialog on away navigation during active session and proceeds on Leave', () => {
    mockUseGlobalTimer.mockReturnValueOnce({ isTimerRunning: true });
  render(<Navigation />);
  const activitiesItem = screen.getByTestId('activities-nav-item');
  const activitiesLink = getLinkByHref(activitiesItem, '/activities');
    fireEvent.click(activitiesLink);

    // Dialog
    expect(screen.getByText('You have an active timer running. Do you want to leave this page?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Leave' }));
    expect(mockPush).toHaveBeenCalledWith('/activities');
  });

  it('stays on page when clicking Stay in confirm dialog', () => {
    mockUseGlobalTimer.mockReturnValueOnce({ isTimerRunning: true });
  render(<Navigation />);
  const aiItem = screen.getByTestId('ai-nav-item');
  const aiLink = getLinkByHref(aiItem, '/ai');
    fireEvent.click(aiLink);
    fireEvent.click(screen.getByRole('button', { name: 'Stay' }));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not show confirm dialog when clicking Timer during active session', () => {
    mockUseGlobalTimer.mockReturnValueOnce({ isTimerRunning: true });
  render(<Navigation />);
  const timerItem = screen.getByTestId('timer-nav-item');
  const timerLink = getLinkByHref(timerItem, '/');
    fireEvent.click(timerLink);
    expect(screen.queryByText('You have an active timer running. Do you want to leave this page?')).toBeNull();
  });
});
