import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdateNotification } from '../UpdateNotification';

// Mock timers for auto-dismiss functionality
jest.useFakeTimers();

describe('UpdateNotification', () => {
  const defaultProps = {
    message: 'Test update message',
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders the notification with message', () => {
    render(<UpdateNotification {...defaultProps} />);
    
    expect(screen.getByTestId('update-notification')).toBeInTheDocument();
    expect(screen.getByTestId('update-notification-message')).toHaveTextContent('Test update message');
  });

  it('has correct accessibility attributes', () => {
    render(<UpdateNotification {...defaultProps} />);
    
    const notification = screen.getByTestId('update-notification');
    expect(notification).toHaveAttribute('role', 'alert');
    expect(notification).toHaveAttribute('aria-live', 'assertive');
    expect(notification).toHaveAttribute('aria-atomic', 'true');
    
    const dismissButton = screen.getByTestId('update-notification-dismiss');
    expect(dismissButton).toHaveAttribute('aria-label', 'Close');
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    render(<UpdateNotification {...defaultProps} />);
    
    const dismissButton = screen.getByTestId('update-notification-dismiss');
    fireEvent.click(dismissButton);
    
    expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides notification when dismiss button is clicked', () => {
    render(<UpdateNotification {...defaultProps} />);
    
    const dismissButton = screen.getByTestId('update-notification-dismiss');
    fireEvent.click(dismissButton);
    
    expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
  });

  it('auto-dismisses after 5 seconds', async () => {
    render(<UpdateNotification {...defaultProps} />);
    
    expect(screen.getByTestId('update-notification')).toBeInTheDocument();
    
    // Fast-forward time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
    });
    
    expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
  });

  it('clears timeout when component unmounts', () => {
    const { unmount } = render(<UpdateNotification {...defaultProps} />);
    
    // Verify notification is visible
    expect(screen.getByTestId('update-notification')).toBeInTheDocument();
    
    // Unmount component
    unmount();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // onDismiss should not be called since component was unmounted
    expect(defaultProps.onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss multiple times if clicked multiple times', () => {
    render(<UpdateNotification {...defaultProps} />);
    
    const dismissButton = screen.getByTestId('update-notification-dismiss');
    
    // Click multiple times quickly
    fireEvent.click(dismissButton);
    fireEvent.click(dismissButton);
    fireEvent.click(dismissButton);
    
    // Should only be called once since notification is hidden after first click
    expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
  });

  it('handles empty message gracefully', () => {
    render(<UpdateNotification {...defaultProps} message="" />);
    
    const messageElement = screen.getByTestId('update-notification-message');
    expect(messageElement).toHaveTextContent('');
    expect(messageElement).toBeInTheDocument();
  });

  it('maintains focus management for accessibility', () => {
    render(<UpdateNotification {...defaultProps} />);
    
    const dismissButton = screen.getByTestId('update-notification-dismiss');
    dismissButton.focus();
    
    expect(dismissButton).toHaveFocus();
    
    // Verify button is focusable and has correct Bootstrap classes
    expect(dismissButton.tagName).toBe('BUTTON');
    expect(dismissButton).toHaveClass('btn-close');
  });
});
