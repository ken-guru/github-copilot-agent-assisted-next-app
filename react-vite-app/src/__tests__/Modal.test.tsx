import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
  describe('Basic Rendering', () => {
    it('renders modal when open is true', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render modal when open is false', () => {
      render(
        <Modal open={false} onClose={() => {}}>
          <div>Modal content</div>
        </Modal>
      );
      const modal = screen.queryByRole('dialog');
      expect(modal).not.toBeInTheDocument();
    });

    it('renders modal title when provided', () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );
      const title = screen.getByText('Test Modal');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
    });

    it('renders modal description when provided', () => {
      render(
        <Modal open onClose={() => {}} description="This is a test modal">
          <div>Modal content</div>
        </Modal>
      );
      const description = screen.getByText('This is a test modal');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(
        <Modal open onClose={() => {}} size="sm">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-sm');
    });

    it('applies default/medium size classes', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-md');
    });

    it('applies large size classes', () => {
      render(
        <Modal open onClose={() => {}} size="lg">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-lg');
    });

    it('applies extra large size classes', () => {
      render(
        <Modal open onClose={() => {}} size="xl">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-xl');
    });

    it('applies full size classes', () => {
      render(
        <Modal open onClose={() => {}} size="full">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-full', 'mx-4');
    });
  });

  describe('Close Behavior', () => {
    it('calls onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose} title="Test Modal">
          <div>Content</div>
        </Modal>
      );
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose}>
          <div>Content</div>
        </Modal>
      );
      // Click on the overlay (backdrop)
      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay!);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose}>
          <div>Content</div>
        </Modal>
      );
      const content = screen.getByText('Content');
      fireEvent.click(content);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose}>
          <div>Content</div>
        </Modal>
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when other keys are pressed', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose}>
          <div>Content</div>
        </Modal>
      );
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Disable Close Options', () => {
    it('does not render close button when showCloseButton is false', () => {
      render(
        <Modal open onClose={() => {}} showCloseButton={false} title="Test Modal">
          <div>Content</div>
        </Modal>
      );
      const closeButton = screen.queryByRole('button', { name: /close/i });
      expect(closeButton).not.toBeInTheDocument();
    });

    it('does not close on overlay click when closeOnOverlayClick is false', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose} closeOnOverlayClick={false}>
          <div>Content</div>
        </Modal>
      );
      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay!);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not close on Escape key when closeOnEscape is false', () => {
      const handleClose = vi.fn();
      render(
        <Modal open onClose={handleClose} closeOnEscape={false}>
          <div>Content</div>
        </Modal>
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('labels modal with title when provided', () => {
      render(
        <Modal open onClose={() => {}} title="Test Modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      const title = screen.getByText('Test Modal');
      expect(modal).toHaveAttribute('aria-labelledby', title.id);
    });

    it('describes modal with description when provided', () => {
      render(
        <Modal open onClose={() => {}} description="This is a test modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      const description = screen.getByText('This is a test modal');
      expect(modal).toHaveAttribute('aria-describedby', description.id);
    });

    it('focuses first focusable element when opened', () => {
      render(
        <Modal open onClose={() => {}}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );
      // The close button is the first focusable element in DOM order
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toHaveFocus();
    });

    it('traps focus within modal', () => {
      render(
        <Modal open onClose={() => {}}>
          <button>Button 1</button>
          <button>Button 2</button>
        </Modal>
      );
      const button1 = screen.getByText('Button 1');
      const button2 = screen.getByText('Button 2');
      
      // Tab should move focus to next element
      fireEvent.keyDown(button1, { key: 'Tab' });
      expect(button2).toHaveFocus();
      
      // Tab from last element should wrap to first
      fireEvent.keyDown(button2, { key: 'Tab' });
      expect(button1).toHaveFocus();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(
        <Modal open onClose={() => {}} className="custom-modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('custom-modal');
    });

    it('merges custom className with default classes', () => {
      render(
        <Modal open onClose={() => {}} className="custom-modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('custom-modal');
      expect(modal).toHaveClass('bg-white'); // Default class should still be present
    });
  });

  describe('Portal Rendering', () => {
    it('renders modal in document body by default', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal.closest('body')).toBeTruthy();
    });
  });
});
