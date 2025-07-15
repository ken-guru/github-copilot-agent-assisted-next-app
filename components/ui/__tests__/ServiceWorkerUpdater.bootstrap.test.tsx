import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceWorkerUpdater from '../ServiceWorkerUpdater';

describe('ServiceWorkerUpdater Bootstrap Integration', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing window listeners
    if (typeof window !== 'undefined') {
      window.ServiceWorkerUpdaterAPI = undefined;
    }
  });

  const renderComponent = () => {
    return render(
      <ServiceWorkerUpdater 
        onUpdate={mockOnUpdate}
        onDismiss={mockOnDismiss}
        show={true}
      />
    );
  };

  describe('Bootstrap Toast Structure', () => {
    test('uses Bootstrap Toast component structure', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveClass('toast');
      expect(toastElement).toHaveClass('show');
      expect(toastElement).toHaveClass('position-fixed');
      expect(toastElement).toHaveClass('bottom-0');
      expect(toastElement).toHaveClass('end-0');
      expect(toastElement).toHaveClass('m-3');
    });

    test('applies proper Bootstrap Toast styling', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveClass('bg-success');
      expect(toastElement).toHaveClass('text-white');
      expect(toastElement).toHaveAttribute('role', 'alert');
    });

    test('uses Bootstrap Toast header structure', () => {
      const { container } = renderComponent();
      const headerElement = container.querySelector('.toast-header');
      
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveClass('toast-header');
      expect(headerElement).toHaveClass('bg-success');
      expect(headerElement).toHaveClass('text-white');
    });

    test('uses Bootstrap Toast body structure', () => {
      const { container } = renderComponent();
      const bodyElement = container.querySelector('.toast-body');
      
      expect(bodyElement).toBeInTheDocument();
      expect(bodyElement).toHaveClass('toast-body');
    });
  });

  describe('Bootstrap Button Integration', () => {
    test('update button uses Bootstrap styling', () => {
      renderComponent();
      const updateButton = screen.getByTestId('update-button');
      
      expect(updateButton).toHaveClass('btn');
      expect(updateButton).toHaveClass('btn-light');
      expect(updateButton).toHaveClass('btn-sm');
      expect(updateButton).toHaveClass('me-2');
    });

    test('dismiss button uses Bootstrap styling', () => {
      renderComponent();
      const dismissButton = screen.getByTestId('dismiss-button');
      
      expect(dismissButton).toHaveClass('btn');
      expect(dismissButton).toHaveClass('btn-outline-light');
      expect(dismissButton).toHaveClass('btn-sm');
    });

    test('buttons maintain functionality with Bootstrap classes', () => {
      renderComponent();
      
      const updateButton = screen.getByTestId('update-button');
      const dismissButton = screen.getByTestId('dismiss-button');
      
      fireEvent.click(updateButton);
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      
      fireEvent.click(dismissButton);
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Bootstrap Typography Classes', () => {
    test('uses Bootstrap typography for title', () => {
      const { container } = renderComponent();
      const titleElement = container.querySelector('[data-testid="update-title"]');
      
      expect(titleElement).toHaveClass('h6');
      expect(titleElement).toHaveClass('mb-0');
      expect(titleElement).toHaveClass('fw-bold');
    });

    test('uses Bootstrap typography for message', () => {
      const { container } = renderComponent();
      const messageElement = container.querySelector('[data-testid="update-message"]');
      
      expect(messageElement).toHaveClass('mb-0');
      expect(messageElement).toHaveClass('small');
    });
  });

  describe('Bootstrap Responsive Design', () => {
    test('applies responsive positioning classes', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveClass('m-3');
      expect(toastElement).toHaveClass('position-fixed');
      expect(toastElement).toHaveClass('bottom-0');
      expect(toastElement).toHaveClass('end-0');
    });

    test('uses Bootstrap responsive width classes', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      // Toast should have a max width but be responsive
      expect(toastElement).toHaveStyle('max-width: 350px');
    });
  });

  describe('Bootstrap Animation and Interaction', () => {
    test('uses Bootstrap Toast show class for visibility', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveClass('show');
    });

    test('applies proper Bootstrap z-index', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveStyle('z-index: 1080'); // Bootstrap Toast z-index
    });
  });

  describe('Bootstrap Accessibility Integration', () => {
    test('maintains ARIA attributes with Bootstrap structure', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveAttribute('role', 'alert');
      expect(toastElement).toHaveAttribute('aria-live', 'assertive');
      expect(toastElement).toHaveAttribute('aria-atomic', 'true');
    });

    test('buttons have proper accessibility with Bootstrap classes', () => {
      renderComponent();
      
      const updateButton = screen.getByTestId('update-button');
      const dismissButton = screen.getByTestId('dismiss-button');
      
      expect(updateButton).toHaveAttribute('type', 'button');
      expect(dismissButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Bootstrap Icon Integration', () => {
    test('uses Bootstrap Icons for update icon', () => {
      const { container } = renderComponent();
      const iconElement = container.querySelector('[data-testid="update-icon"]');
      
      expect(iconElement).toHaveClass('bi');
      expect(iconElement).toHaveClass('bi-arrow-clockwise');
      expect(iconElement).toHaveClass('me-2');
    });
  });

  describe('Bootstrap Color Theming', () => {
    test('uses Bootstrap success variant for positive update message', () => {
      const { container } = renderComponent();
      const toastElement = container.querySelector('[data-testid="update-notification"]');
      
      expect(toastElement).toHaveClass('bg-success');
      expect(toastElement).toHaveClass('text-white');
    });

    test('buttons maintain contrast with Bootstrap utilities', () => {
      renderComponent();
      
      const updateButton = screen.getByTestId('update-button');
      const dismissButton = screen.getByTestId('dismiss-button');
      
      expect(updateButton).toHaveClass('btn-light'); // Good contrast on success background
      expect(dismissButton).toHaveClass('btn-outline-light'); // Outline variant for secondary action
    });
  });

  describe('Bootstrap Layout Flexbox', () => {
    test('uses Bootstrap flex utilities for button layout', () => {
      const { container } = renderComponent();
      const buttonContainer = container.querySelector('[data-testid="button-container"]');
      
      expect(buttonContainer).toHaveClass('d-flex');
      expect(buttonContainer).toHaveClass('gap-2');
      expect(buttonContainer).toHaveClass('mt-2');
    });

    test('applies proper Bootstrap spacing utilities', () => {
      const { container } = renderComponent();
      const headerElement = container.querySelector('.toast-header');
      const bodyElement = container.querySelector('.toast-body');
      
      expect(headerElement).toHaveClass('px-3');
      expect(headerElement).toHaveClass('py-2');
      expect(bodyElement).toHaveClass('px-3');
      expect(bodyElement).toHaveClass('pb-3');
    });
  });
});
