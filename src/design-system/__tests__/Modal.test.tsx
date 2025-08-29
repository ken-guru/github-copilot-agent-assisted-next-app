/**
 * Tests for Material 3 Modal Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3Modal from '../components/Modal';

// Mock createPortal for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: React.ReactNode) => children,
}));

describe('Material3Modal', () => {
  beforeEach(() => {
    // Reset document.body
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  test('renders when open', () => {
    render(
      <Material3Modal open onClose={() => {}}>
        <p>Modal content</p>
      </Material3Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <Material3Modal open={false} onClose={() => {}}>
        <p>Modal content</p>
      </Material3Modal>
    );
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders with title', () => {
    render(
      <Material3Modal open onClose={() => {}} title="Modal Title">
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('m3-headline-small');
  });

  test('renders with actions', () => {
    const actions = (
      <>
        <button>Cancel</button>
        <button>Save</button>
      </>
    );
    
    render(
      <Material3Modal open onClose={() => {}} actions={actions}>
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('handles different sizes', () => {
    const { rerender } = render(
      <Material3Modal open onClose={() => {}} size="small">
        <p>Small modal</p>
      </Material3Modal>
    );
    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-sm');

    rerender(
      <Material3Modal open onClose={() => {}} size="large">
        <p>Large modal</p>
      </Material3Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-4xl');

    rerender(
      <Material3Modal open onClose={() => {}} size="fullscreen">
        <p>Fullscreen modal</p>
      </Material3Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('w-full', 'h-full');
  });

  test('handles backdrop click when closeOnBackdropClick is true', () => {
    const handleClose = jest.fn();
    render(
      <Material3Modal open onClose={handleClose} closeOnBackdropClick>
        <p>Content</p>
      </Material3Modal>
    );
    
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not close on backdrop click when closeOnBackdropClick is false', () => {
    const handleClose = jest.fn();
    render(
      <Material3Modal open onClose={handleClose} closeOnBackdropClick={false}>
        <p>Content</p>
      </Material3Modal>
    );
    
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('does not close when clicking inside modal content', () => {
    const handleClose = jest.fn();
    render(
      <Material3Modal open onClose={handleClose} closeOnBackdropClick>
        <p>Content</p>
      </Material3Modal>
    );
    
    const content = screen.getByText('Content');
    fireEvent.click(content);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('handles Escape key press when closeOnEscape is true', () => {
    const handleClose = jest.fn();
    render(
      <Material3Modal open onClose={handleClose} closeOnEscape>
        <p>Content</p>
      </Material3Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not close on Escape when closeOnEscape is false', () => {
    const handleClose = jest.fn();
    render(
      <Material3Modal open onClose={handleClose} closeOnEscape={false}>
        <p>Content</p>
      </Material3Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('manages body scroll lock', () => {
    const { rerender } = render(
      <Material3Modal open onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Material3Modal open={false} onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(document.body.style.overflow).toBe('');
  });

  test('handles different variants', () => {
    const { rerender } = render(
      <Material3Modal open onClose={() => {}} variant="basic">
        <p>Basic modal</p>
      </Material3Modal>
    );
    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-md');

    rerender(
      <Material3Modal open onClose={() => {}} variant="fullscreen">
        <p>Fullscreen modal</p>
      </Material3Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('w-full', 'h-full');
  });

  test('renders with elevation', () => {
    render(
      <Material3Modal open onClose={() => {}} elevation={5}>
        <p>High elevation modal</p>
      </Material3Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('m3-elevation-5');
  });

  test('applies custom shape', () => {
    render(
      <Material3Modal open onClose={() => {}} shape="sm">
        <p>Small shape modal</p>
      </Material3Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('m3-shape-sm');
  });

  test('calls onOpenChange when provided', () => {
    const handleOpenChange = jest.fn();
    render(
      <Material3Modal open onClose={() => {}} onOpenChange={handleOpenChange} closeOnBackdropClick>
        <p>Content</p>
      </Material3Modal>
    );
    
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  test('applies custom className', () => {
    render(
      <Material3Modal open onClose={() => {}} className="custom-modal-class">
        <p>Content</p>
      </Material3Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-modal-class');
  });

  test('handles animation classes', async () => {
    render(
      <Material3Modal open onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    const backdrop = screen.getByTestId('modal-backdrop');
    const dialog = screen.getByRole('dialog');
    
    expect(backdrop).toHaveClass('animate-fade-in');
    expect(dialog).toHaveClass('animate-slide-up');
  });

  test('manages focus trap', async () => {
    render(
      <Material3Modal open onClose={() => {}}>
        <button>First button</button>
        <button>Second button</button>
        <input type="text" placeholder="Input field" />
      </Material3Modal>
    );
    
    // Modal should be focused initially
    const dialog = screen.getByRole('dialog');
    expect(document.activeElement).toBe(dialog);
    
    // Tab should cycle through focusable elements
    fireEvent.keyDown(dialog, { key: 'Tab' });
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First button' }));
    });
  });

  test('restores focus on close', () => {
    const button = document.createElement('button');
    button.textContent = 'Trigger';
    document.body.appendChild(button);
    button.focus();
    
    const { rerender } = render(
      <Material3Modal open onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    rerender(
      <Material3Modal open={false} onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(document.activeElement).toBe(button);
  });

  test('handles multiple modals (stacking)', () => {
    render(
      <>
        <Material3Modal open onClose={() => {}}>
          <p>First modal</p>
        </Material3Modal>
        <Material3Modal open onClose={() => {}}>
          <p>Second modal</p>
        </Material3Modal>
      </>
    );
    
    const modals = screen.getAllByRole('dialog');
    expect(modals).toHaveLength(2);
  });

  test('prevents scrolling of background content', () => {
    render(
      <Material3Modal open onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('handles long content with scrolling', () => {
    const longContent = Array.from({ length: 100 }, (_, i) => (
      <p key={i}>Line {i + 1}</p>
    ));
    
    render(
      <Material3Modal open onClose={() => {}}>
        {longContent}
      </Material3Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('overflow-y-auto');
  });

  test('supports aria attributes', () => {
    render(
      <Material3Modal
        open
        onClose={() => {}}
        title="Accessible Modal"
        aria-describedby="modal-description"
      >
        <p id="modal-description">This modal has proper accessibility</p>
      </Material3Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('cleanup on unmount', () => {
    const { unmount } = render(
      <Material3Modal open onClose={() => {}}>
        <p>Content</p>
      </Material3Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('');
  });
});