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
});
