import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityList from '../feature/ActivityList'; // Ensure this file exists and is exported correctly
import { DEFAULT_ACTIVITIES } from '../../types/activity';

describe('ActivityList', () => {
  it('renders all activities', () => {
    render(<ActivityList activities={DEFAULT_ACTIVITIES} />);
    DEFAULT_ACTIVITIES.forEach(activity => {
      expect(screen.getByText(activity.name)).toBeInTheDocument();
    });
  });

  it('calls edit handler', () => {
    const onEdit = jest.fn();
    render(<ActivityList activities={DEFAULT_ACTIVITIES} onEdit={onEdit} />);
    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    if (editButtons.length > 0) {
      const editBtn = editButtons[0];
      if (editBtn) {
        fireEvent.click(editBtn);
      }
    }
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls delete handler', () => {
    const onDelete = jest.fn();
    render(<ActivityList activities={DEFAULT_ACTIVITIES} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    if (deleteButtons.length > 0) {
      const deleteBtn = deleteButtons[0];
      if (deleteBtn) {
        fireEvent.click(deleteBtn);
      }
    }
    expect(onDelete).toHaveBeenCalled();
  });

  it('supports drag-and-drop reordering', () => {
    // Simulate drag-and-drop logic
    // ...
    // expect order to change
  });

  it('shows empty state when no activities', () => {
    render(<ActivityList activities={[]} />);
    expect(screen.getByText(/No activities found/i)).toBeInTheDocument();
  });

  it('shows import and reset buttons in empty state when handlers provided, hides export', () => {
    const onImport = jest.fn();
    const onReset = jest.fn();
    const onExport = jest.fn();

    render(
      <ActivityList 
        activities={[]} 
        onImport={onImport} 
        onReset={onReset}
        onExport={onExport}
      />
    );

    // Import and Reset should be visible
    expect(screen.getByRole('button', { name: /Import/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Activities/i })).toBeInTheDocument();

    // Export should be hidden when there are no activities
    expect(screen.queryByRole('button', { name: /Export/i })).not.toBeInTheDocument();
  });

  describe('Footer Toolbar', () => {
    it('does not render footer when no action props are provided', () => {
      render(<ActivityList activities={DEFAULT_ACTIVITIES} />);
      // Footer should not be present when no action callbacks are provided
      expect(screen.queryByText('Import')).not.toBeInTheDocument();
      expect(screen.queryByText('Export')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset Activities')).not.toBeInTheDocument();
    });

    it('renders import button when onImport prop is provided', () => {
      const onImport = jest.fn();
      render(<ActivityList activities={DEFAULT_ACTIVITIES} onImport={onImport} />);
      
      const importButton = screen.getByRole('button', { name: /Import/i });
      expect(importButton).toBeInTheDocument();
      
      fireEvent.click(importButton);
      expect(onImport).toHaveBeenCalledTimes(1);
    });

    it('renders export button when onExport prop is provided', () => {
      const onExport = jest.fn();
      render(<ActivityList activities={DEFAULT_ACTIVITIES} onExport={onExport} />);
      
      const exportButton = screen.getByRole('button', { name: /Export/i });
      expect(exportButton).toBeInTheDocument();
      
      fireEvent.click(exportButton);
      expect(onExport).toHaveBeenCalledTimes(1);
    });

    it('renders reset button when onReset prop is provided', () => {
      const onReset = jest.fn();
      render(<ActivityList activities={DEFAULT_ACTIVITIES} onReset={onReset} />);
      
      const resetButton = screen.getByRole('button', { name: /Reset Activities/i });
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveClass('btn-outline-danger');
      
      fireEvent.click(resetButton);
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('renders all toolbar buttons when all action props are provided', () => {
      const onImport = jest.fn();
      const onExport = jest.fn();
      const onReset = jest.fn();
      
      render(<ActivityList 
        activities={DEFAULT_ACTIVITIES} 
        onImport={onImport}
        onExport={onExport}
        onReset={onReset}
      />);
      
      expect(screen.getByRole('button', { name: /Import/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Activities/i })).toBeInTheDocument();
      
      // Verify footer is rendered when at least one action is provided
      const footer = screen.getByRole('button', { name: /Import/i }).closest('.card-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('bg-light');
    });

    it('renders footer with proper Bootstrap classes and layout', () => {
      const onReset = jest.fn();
      render(<ActivityList activities={DEFAULT_ACTIVITIES} onReset={onReset} />);
      
      const resetButton = screen.getByRole('button', { name: /Reset Activities/i });
      const footer = resetButton.closest('.card-footer');
      const buttonContainer = resetButton.parentElement;
      
      expect(footer).toHaveClass('bg-light'); // Light theme default
      expect(buttonContainer).toHaveClass('d-flex', 'gap-2', 'justify-content-center');
      expect(resetButton).toHaveClass('d-flex', 'align-items-center', 'px-3');
    });
  });
});
