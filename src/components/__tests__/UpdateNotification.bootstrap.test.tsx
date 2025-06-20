import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdateNotification } from '../UpdateNotification';

// Mock timers for auto-dismiss functionality
jest.useFakeTimers();

describe('UpdateNotification - Bootstrap Integration', () => {
  const defaultProps = {
    message: 'Test update notification',
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

  describe('Bootstrap Toast Integration', () => {
    it('renders as Bootstrap Toast with correct structure', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      // Should render as toast container
      const toast = screen.getByTestId('update-notification');
      expect(toast).toBeInTheDocument();
      
      // Should have Bootstrap toast classes
      expect(toast).toHaveClass('toast');
      expect(toast).toHaveClass('show');
    });

    it('has correct Bootstrap Toast ARIA attributes', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toHaveAttribute('role', 'alert');
      expect(toast).toHaveAttribute('aria-live', 'assertive');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });

    it('displays message in toast body', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toastBody = screen.getByTestId('update-notification-message');
      expect(toastBody).toHaveClass('toast-body');
      expect(toastBody).toHaveTextContent('Test update notification');
    });

    it('has Bootstrap close button with correct styling', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const closeButton = screen.getByTestId('update-notification-dismiss');
      expect(closeButton).toHaveClass('btn-close');
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('renders with fixed positioning for overlay display', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toastContainer = screen.getByTestId('update-notification').parentElement;
      expect(toastContainer).toHaveClass('position-fixed');
    });

    it('applies correct Bootstrap positioning classes', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toastContainer = screen.getByTestId('update-notification').parentElement;
      expect(toastContainer).toHaveClass('bottom-0');
      expect(toastContainer).toHaveClass('end-0');
      expect(toastContainer).toHaveClass('p-3');
    });
  });

  describe('Bootstrap Toast Behavior', () => {
    it('handles auto-dismiss with Bootstrap fade animation', async () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toHaveClass('show');
      
      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
      });
      
      expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
    });

    it('handles manual dismiss via close button', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const closeButton = screen.getByTestId('update-notification-dismiss');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
      expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard navigation for close button', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const closeButton = screen.getByTestId('update-notification-dismiss');
      closeButton.focus();
      
      expect(closeButton).toHaveFocus();
      
      // Test Enter key
      fireEvent.keyDown(closeButton, { key: 'Enter', code: 'Enter' });
      fireEvent.click(closeButton);
      
      expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Bootstrap Theming and Styling', () => {
    it('uses Bootstrap info variant by default', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toHaveClass('bg-info');
      expect(toast).toHaveClass('text-white');
    });

    it('maintains Bootstrap responsive behavior', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toastContainer = screen.getByTestId('update-notification').parentElement;
      // Bootstrap responsive classes should be present
      expect(toastContainer).toHaveStyle({ zIndex: '1055' });
    });

    it('handles long messages with Bootstrap text utilities', () => {
      const longMessage = 'This is a very long update notification message that should wrap properly using Bootstrap typography utilities and maintain good readability across different screen sizes.';
      
      render(<UpdateNotification {...defaultProps} message={longMessage} />);
      
      const messageElement = screen.getByTestId('update-notification-message');
      expect(messageElement).toHaveTextContent(longMessage);
      expect(messageElement).toHaveClass('toast-body');
    });

    it('supports Bootstrap dark mode compatibility', () => {
      // Add data-bs-theme="dark" to test dark mode
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toBeInTheDocument();
      
      // Clean up
      document.documentElement.removeAttribute('data-bs-theme');
    });
  });

  describe('Bootstrap Toast Animation and Transitions', () => {
    it('renders with Bootstrap fade transition classes', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toHaveClass('fade');
      expect(toast).toHaveClass('show');
    });

    it('maintains performance with Bootstrap transitions', () => {
      const { rerender } = render(<UpdateNotification {...defaultProps} />);
      
      // Should not cause performance issues with re-renders
      rerender(<UpdateNotification {...defaultProps} message="Updated message" />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toBeInTheDocument();
      expect(screen.getByTestId('update-notification-message')).toHaveTextContent('Updated message');
    });
  });

  describe('SSR and Bootstrap Compatibility', () => {
    it('renders consistently in SSR environment', () => {
      // Simulate SSR by temporarily removing window
      const originalWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window = undefined;
      
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveClass('toast');
      
      // Restore window
      global.window = originalWindow;
    });

    it('handles Bootstrap CSS hydration correctly', () => {
      render(<UpdateNotification {...defaultProps} />);
      
      const toast = screen.getByTestId('update-notification');
      // Should have Bootstrap classes immediately
      expect(toast).toHaveClass('toast', 'show', 'fade');
    });
  });
});
