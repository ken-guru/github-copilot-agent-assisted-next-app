import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityButton } from '../ActivityButton';
import { jest } from '@jest/globals';

describe('ActivityButton - Drag and Drop', () => {
  const defaultActivity = {
    id: 'test1',
    name: 'Test Activity',
    colorIndex: 0,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  const defaultProps = {
    activity: defaultActivity,
    isCompleted: false,
    isRunning: false,
    onSelect: jest.fn(),
    timelineEntries: [],
    elapsedTime: 0
  };

  const dragProps = {
    draggable: true,
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    onDragOver: jest.fn(),
    onDragEnter: jest.fn(),
    onDragLeave: jest.fn(),
    onDrop: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Drag Handle', () => {
    it('shows drag handle when draggable is true', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const dragHandle = screen.getByLabelText('Drag handle for reordering activity');
      expect(dragHandle).toBeInTheDocument();
      expect(dragHandle.querySelector('svg')).toBeInTheDocument();
    });

    it('does not show drag handle when draggable is false', () => {
      render(<ActivityButton {...defaultProps} draggable={false} />);
      
      const dragHandle = screen.queryByLabelText('Drag handle for reordering activity');
      expect(dragHandle).not.toBeInTheDocument();
    });

    it('does not show drag handle when draggable is not provided', () => {
      render(<ActivityButton {...defaultProps} />);
      
      const dragHandle = screen.queryByLabelText('Drag handle for reordering activity');
      expect(dragHandle).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const dragHandle = screen.getByLabelText('Drag handle for reordering activity');
      expect(dragHandle).toHaveAttribute('title', 'Drag to reorder');
      expect(dragHandle).toHaveAttribute('aria-label', 'Drag handle for reordering activity');
    });
  });

  describe('Drag Attributes', () => {
    it('sets draggable attribute when draggable is true', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveAttribute('draggable', 'true');
    });

    it('sets draggable attribute to false when draggable is false', () => {
      render(<ActivityButton {...defaultProps} draggable={false} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveAttribute('draggable', 'false');
    });

    it('sets proper ARIA attributes for draggable elements', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('aria-grabbed', 'false');
    });

    it('updates aria-grabbed when isDragging is true', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isDragging={true} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveAttribute('aria-grabbed', 'true');
    });
  });

  describe('Drag Event Handlers', () => {
    it('calls onDragStart with activity id when drag starts', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      fireEvent.dragStart(card!);
      
      expect(dragProps.onDragStart).toHaveBeenCalledWith('test1');
    });

    it('calls onDragEnd when drag ends', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      fireEvent.dragEnd(card!);
      
      expect(dragProps.onDragEnd).toHaveBeenCalled();
    });

    it('calls onDragOver with activity id when dragged over', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      fireEvent.dragOver(card!);
      
      expect(dragProps.onDragOver).toHaveBeenCalledWith('test1');
    });

    it('calls onDragEnter with activity id when drag enters', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      fireEvent.dragEnter(card!);
      
      expect(dragProps.onDragEnter).toHaveBeenCalledWith('test1');
    });

    it('calls onDragLeave when drag leaves', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      fireEvent.dragLeave(card!);
      
      expect(dragProps.onDragLeave).toHaveBeenCalled();
    });

    it('calls onDrop with activity id when dropped', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      fireEvent.drop(card!);
      
      expect(dragProps.onDrop).toHaveBeenCalledWith('test1');
    });

    it('prevents default behavior on dragOver and dragEnter', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      
      const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true });
      const dragEnterEvent = new Event('dragenter', { bubbles: true, cancelable: true });
      
      fireEvent(card!, dragOverEvent);
      fireEvent(card!, dragEnterEvent);
      
      expect(dragOverEvent.defaultPrevented).toBe(true);
      expect(dragEnterEvent.defaultPrevented).toBe(true);
    });

    it('prevents default behavior on drop', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
      
      fireEvent(card!, dropEvent);
      
      expect(dropEvent.defaultPrevented).toBe(true);
    });

    it('stops propagation on all drag events', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      
      const events = ['dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'];
      
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
        
        fireEvent(card!, event);
        
        expect(stopPropagationSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Visual States', () => {
    it('applies dragging class when isDragging is true', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isDragging={true} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveClass('dragging');
    });

    it('applies drag-over class when isDraggedOver is true', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isDraggedOver={true} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveClass('dragOver');
    });

    it('applies both classes when both states are true', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isDragging={true} isDraggedOver={true} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).toHaveClass('dragging');
      expect(card).toHaveClass('dragOver');
    });

    it('does not apply drag classes when states are false', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isDragging={false} isDraggedOver={false} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      expect(card).not.toHaveClass('dragging');
      expect(card).not.toHaveClass('dragOver');
    });
  });

  describe('Integration with Existing Functionality', () => {
    it('maintains existing click functionality when draggable', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} />);
      
      const startButton = screen.getByRole('button', { name: 'Start' });
      fireEvent.click(startButton);
      
      expect(defaultProps.onSelect).toHaveBeenCalledWith(defaultActivity);
    });

    it('maintains remove functionality when draggable', () => {
      const onRemove = jest.fn();
      render(<ActivityButton {...defaultProps} {...dragProps} onRemove={onRemove} />);
      
      const removeButton = screen.getByRole('button', { name: 'Remove' });
      fireEvent.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledWith('test1');
    });

    it('shows timer when running and draggable', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isRunning={true} elapsedTime={30} />);
      
      expect(screen.getByText('00:30')).toBeInTheDocument();
    });

    it('shows completed badge when completed and draggable', () => {
      render(<ActivityButton {...defaultProps} {...dragProps} isCompleted={true} />);
      
      const completedBadge = screen.getByLabelText('Completed');
      expect(completedBadge).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing drag handlers gracefully', () => {
      render(<ActivityButton {...defaultProps} draggable={true} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      
      // Should not throw errors when handlers are not provided
      expect(() => {
        fireEvent.dragStart(card!);
        fireEvent.dragEnd(card!);
        fireEvent.dragOver(card!);
        fireEvent.dragEnter(card!);
        fireEvent.dragLeave(card!);
        fireEvent.drop(card!);
      }).not.toThrow();
    });

    it('handles undefined activity id gracefully', () => {
      const activityWithoutId = { ...defaultActivity, id: '' };
      
      render(<ActivityButton {...defaultProps} {...dragProps} activity={activityWithoutId} />);
      
      const card = screen.getByText('Test Activity').closest('.card');
      
      expect(() => {
        fireEvent.dragStart(card!);
        fireEvent.dragOver(card!);
      }).not.toThrow();
    });
  });
});