import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PWAInstallPrompt } from '../PWAInstallPrompt';

describe('PWAInstallPrompt Component', () => {
  let mockPromptEvent: any;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock the beforeinstallprompt event
    mockPromptEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };
  });

  test('does not show initially', () => {
    render(<PWAInstallPrompt />);
    expect(screen.queryByText(/Install Mr. Timely/i)).not.toBeInTheDocument();
  });

  test('shows prompt after beforeinstallprompt event and timeout', async () => {
    jest.useFakeTimers();
    
    render(<PWAInstallPrompt />);
    
    // Trigger the beforeinstallprompt event
    window.dispatchEvent(new Event('beforeinstallprompt'));
    
    // Fast-forward time by 30 seconds
    jest.advanceTimersByTime(30000);
    
    await waitFor(() => {
      expect(screen.getByText(/Install Mr. Timely/i)).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test('does not show if previously dismissed', () => {
    jest.useFakeTimers();
    localStorage.setItem('pwa-dismissed', 'true');
    
    render(<PWAInstallPrompt />);
    
    window.dispatchEvent(new Event('beforeinstallprompt'));
    jest.advanceTimersByTime(30000);
    
    expect(screen.queryByText(/Install Mr. Timely/i)).not.toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('renders with proper content and structure', async () => {
    jest.useFakeTimers();
    
    render(<PWAInstallPrompt />);
    
    window.dispatchEvent(new Event('beforeinstallprompt'));
    jest.advanceTimersByTime(30000);
    
    await waitFor(() => {
      expect(screen.getByText(/Install Mr. Timely/i)).toBeInTheDocument();
      expect(screen.getByText(/Add to your home screen/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Install App/i })).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test('sets dismissed flag when alert is closed', async () => {
    jest.useFakeTimers();
    
    render(<PWAInstallPrompt />);
    
    window.dispatchEvent(new Event('beforeinstallprompt'));
    jest.advanceTimersByTime(30000);
    
    await waitFor(() => {
      expect(screen.getByText(/Install Mr. Timely/i)).toBeInTheDocument();
    });
    
    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(localStorage.getItem('pwa-dismissed')).toBe('true');
    
    jest.useRealTimers();
  });
});
