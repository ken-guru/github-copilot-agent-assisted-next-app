import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwipeableActivityCard } from '../SwipeableActivityCard';

// Mock react-swipeable
jest.mock('react-swipeable', () => ({
  useSwipeable: jest.fn(() => ({}))
}));

describe('SwipeableActivityCard Component', () => {
  const mockActivity = {
    id: 'test-activity-1',
    name: 'Test Activity'
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children correctly', () => {
    render(
      <SwipeableActivityCard activity={mockActivity} onDelete={mockOnDelete}>
        <div>Test Content</div>
      </SwipeableActivityCard>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders delete button', () => {
    render(
      <SwipeableActivityCard activity={mockActivity} onDelete={mockOnDelete}>
        <div>Test Content</div>
      </SwipeableActivityCard>
    );
    
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <SwipeableActivityCard activity={mockActivity} onDelete={mockOnDelete}>
        <div>Test Content</div>
      </SwipeableActivityCard>
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockActivity.id);
  });

  test('has proper swipeable wrapper structure', () => {
    const { container } = render(
      <SwipeableActivityCard activity={mockActivity} onDelete={mockOnDelete}>
        <div>Test Content</div>
      </SwipeableActivityCard>
    );
    
    expect(container.querySelector('.swipeable-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.swipeable-content')).toBeInTheDocument();
    expect(container.querySelector('.swipeable-actions')).toBeInTheDocument();
  });
});
