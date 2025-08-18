import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityModificationWarningModal, { ActivityModificationWarningModalRef } from '../ActivityModificationWarningModal';

describe('ActivityModificationWarningModal', () => {
  let modalRef: React.MutableRefObject<ActivityModificationWarningModalRef | null>;

  beforeEach(() => {
    modalRef = React.createRef<ActivityModificationWarningModalRef>();
  });

  const renderModal = (props = {}) => {
    const TestComponent = () => (
      <ActivityModificationWarningModal
        ref={modalRef}
        {...props}
      />
    );
    return render(<TestComponent />);
  };

  describe('Modal Display', () => {
    it('should not be visible initially', () => {
      renderModal();
      
      const modal = screen.queryByTestId('activity-modification-warning-modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should show modal when showModal is called', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal({
        operationType: 'create',
        operationDescription: 'adding new activities'
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('activity-modification-warning-modal')).toBeInTheDocument();
      });
      
      // Clean up promise
      if (confirmPromise) {
        modalRef.current?.hideModal();
        await confirmPromise;
      }
    });

    it('should hide modal when hideModal is called', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal();
      
      await waitFor(() => {
        expect(screen.getByTestId('activity-modification-warning-modal')).toBeInTheDocument();
      });
      
      modalRef.current?.hideModal();
      
      await waitFor(() => {
        expect(screen.queryByTestId('activity-modification-warning-modal')).not.toBeInTheDocument();
      });
      
      // Verify promise resolves to false
      await expect(confirmPromise).resolves.toBe(false);
    });
  });

  describe('Operation Types', () => {
    const operationTypes = [
      { type: 'create' as const, title: 'Confirm Activity Creation', icon: 'bi-plus-circle' },
      { type: 'edit' as const, title: 'Confirm Activity Edit', icon: 'bi-pencil' },
      { type: 'delete' as const, title: 'Confirm Activity Deletion', icon: 'bi-trash' },
      { type: 'ai-generate' as const, title: 'Confirm AI Activity Generation', icon: 'bi-stars' }
    ];

    operationTypes.forEach(({ type, title, icon }) => {
      it(`should display correct title and icon for ${type} operation`, async () => {
        renderModal();
        
        const confirmPromise = modalRef.current?.showModal({
          operationType: type,
          operationDescription: `test ${type} operation`
        });
        
        await waitFor(() => {
          expect(screen.getByText(title)).toBeInTheDocument();
          expect(document.querySelector(`.${icon}`)).toBeInTheDocument();
        });
        
        // Clean up
        modalRef.current?.hideModal();
        await confirmPromise;
      });
    });

    it('should use custom operation description when provided', async () => {
      renderModal();
      
      const customDescription = 'performing custom activity operation';
      const confirmPromise = modalRef.current?.showModal({
        operationType: 'edit',
        operationDescription: customDescription
      });
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp(customDescription))).toBeInTheDocument();
      });
      
      // Clean up
      modalRef.current?.hideModal();
      await confirmPromise;
    });
  });

  describe('User Interactions', () => {
    it('should resolve to true when user confirms', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal({
        operationType: 'create'
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('activity-modification-warning-confirm')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByTestId('activity-modification-warning-confirm'));
      
      await expect(confirmPromise).resolves.toBe(true);
    });

    it('should resolve to false when user cancels', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal({
        operationType: 'delete'
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('activity-modification-warning-cancel')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByTestId('activity-modification-warning-cancel'));
      
      await expect(confirmPromise).resolves.toBe(false);
    });

    it('should resolve to false when modal is closed via backdrop/escape', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal();
      
      await waitFor(() => {
        expect(screen.getByTestId('activity-modification-warning-modal')).toBeInTheDocument();
      });
      
      // Simulate backdrop click by calling hideModal directly
      modalRef.current?.hideModal();
      
      await expect(confirmPromise).resolves.toBe(false);
    });
  });

  describe('Button Variants', () => {
    const buttonVariants = [
      { type: 'create' as const, variant: 'warning', text: 'Continue Adding' },
      { type: 'edit' as const, variant: 'warning', text: 'Continue Editing' },
      { type: 'delete' as const, variant: 'danger', text: 'Continue Deleting' },
      { type: 'ai-generate' as const, variant: 'primary', text: 'Continue with AI' }
    ];

    buttonVariants.forEach(({ type, variant, text }) => {
      it(`should display correct button variant and text for ${type}`, async () => {
        renderModal();
        
        const confirmPromise = modalRef.current?.showModal({
          operationType: type
        });
        
        await waitFor(() => {
          const confirmButton = screen.getByTestId('activity-modification-warning-confirm');
          expect(confirmButton).toBeInTheDocument();
          expect(confirmButton).toHaveTextContent(text);
          expect(confirmButton).toHaveClass(`btn-${variant}`);
        });
        
        // Clean up
        modalRef.current?.hideModal();
        await confirmPromise;
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal({
        operationType: 'edit'
      });
      
      await waitFor(() => {
        const modal = screen.getByTestId('activity-modification-warning-modal');
        expect(modal).toBeInTheDocument();
        
        // Check for aria-hidden on icons
        const icons = document.querySelectorAll('[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);
        
        // Check for modal role
        expect(modal.closest('[role="dialog"]')).toBeInTheDocument();
      });
      
      // Clean up
      modalRef.current?.hideModal();
      await confirmPromise;
    });

    it('should be keyboard accessible', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal();
      
      await waitFor(() => {
        const cancelButton = screen.getByTestId('activity-modification-warning-cancel');
        const confirmButton = screen.getByTestId('activity-modification-warning-confirm');
        
        expect(cancelButton).toBeInTheDocument();
        expect(confirmButton).toBeInTheDocument();
        
        // Both buttons should be focusable
        expect(cancelButton.tabIndex).not.toBe(-1);
        expect(confirmButton.tabIndex).not.toBe(-1);
      });
      
      // Clean up
      modalRef.current?.hideModal();
      await confirmPromise;
    });
  });

  describe('Default Props', () => {
    it('should use default operation type when none provided', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal();
      
      await waitFor(() => {
        expect(screen.getByText('Confirm Activity Edit')).toBeInTheDocument();
      });
      
      // Clean up
      modalRef.current?.hideModal();
      await confirmPromise;
    });

    it('should use default description when none provided', async () => {
      renderModal();
      
      const confirmPromise = modalRef.current?.showModal({
        operationType: 'create'
      });
      
      await waitFor(() => {
        expect(screen.getByText(/adding new activities/)).toBeInTheDocument();
      });
      
      // Clean up
      modalRef.current?.hideModal();
      await confirmPromise;
    });
  });

  describe('Error Handling', () => {
    it('should handle multiple showModal calls gracefully', async () => {
      renderModal();
      
      const firstPromise = modalRef.current?.showModal({ operationType: 'create' });
      const secondPromise = modalRef.current?.showModal({ operationType: 'edit' });
      
      await waitFor(() => {
        expect(screen.getByTestId('activity-modification-warning-modal')).toBeInTheDocument();
      });
      
      // Clean up both promises
      modalRef.current?.hideModal();
      await Promise.all([firstPromise, secondPromise]);
    });
  });
});
