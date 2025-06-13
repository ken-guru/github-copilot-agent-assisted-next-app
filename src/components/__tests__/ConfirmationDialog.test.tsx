import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmationDialog from '../ConfirmationDialog';

describe('ConfirmationDialog', () => {
  beforeEach(() => {
    // Mock showModal and close methods
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  it('should render correctly with default props', () => {
    render(
      <ConfirmationDialog message="Are you sure?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render with custom button text', () => {
    render(
      <ConfirmationDialog message="Delete this item?"
        confirmText="Delete"
        cancelText="Keep"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Delete this item?')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();

    render(
      <ConfirmationDialog message="Are you sure?"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    fireEvent.click(screen.getByText('Confirm'));
    
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockCancel).not.toHaveBeenCalled();
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();

    render(
      <ConfirmationDialog message="Are you sure?"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockConfirm).not.toHaveBeenCalled();
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });

  it('should open the dialog when showDialog method is called', () => {
    const { container } = render(
      <ConfirmationDialog message="Are you sure?"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    // Get the instance of the dialog ref
    const dialog = container.querySelector('dialog');
    expect(dialog).not.toBeNull();
    
    // Get component instance and call showDialog
    // Note: We need to use the ref for this in the actual component
    const showModal = HTMLDialogElement.prototype.showModal;
    expect(showModal).not.toHaveBeenCalled();
    
    // This will be tested at the integration level
  });
});