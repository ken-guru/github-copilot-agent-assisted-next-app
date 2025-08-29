import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityFormMaterial3 from '../ActivityFormMaterial3';

describe('ActivityFormMaterial3', () => {
  const mockOnAddActivity = jest.fn();

  beforeEach(() => {
    mockOnAddActivity.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders form with input and button', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      expect(screen.getByTestId('activity-form-material3')).toBeInTheDocument();
      expect(screen.getByTestId('activity-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('add-activity-button')).toBeInTheDocument();
      expect(screen.getByLabelText('Activity Name')).toBeInTheDocument();
    });

    it('shows correct placeholder when enabled', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      expect(input).toHaveAttribute('placeholder', 'Enter new activity name');
    });

    it('shows disabled state correctly', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={true} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('placeholder', 'Time is up!');
      expect(button).toBeDisabled();
      expect(screen.getByText('Cannot add activities when timer has ended')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('handles text input correctly', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      
      await user.type(input, 'New Activity');
      
      expect(input).toHaveValue('New Activity');
    });

    it('submits form with valid input', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      await user.type(input, 'Test Activity');
      await user.click(button);
      
      expect(mockOnAddActivity).toHaveBeenCalledWith('Test Activity');
      expect(input).toHaveValue(''); // Should clear after submission
    });

    it('submits form on Enter key', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      
      await user.type(input, 'Keyboard Activity');
      await user.keyboard('{Enter}');
      
      expect(mockOnAddActivity).toHaveBeenCalledWith('Keyboard Activity');
    });

    it('trims whitespace from input', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      await user.type(input, '  Trimmed Activity  ');
      await user.click(button);
      
      expect(mockOnAddActivity).toHaveBeenCalledWith('Trimmed Activity');
    });
  });

  describe('Validation', () => {
    it('shows error for empty input', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const button = screen.getByTestId('add-activity-button');
      
      await user.click(button);
      
      expect(screen.getByText('Activity name is required')).toBeInTheDocument();
      expect(mockOnAddActivity).not.toHaveBeenCalled();
    });

    it('shows error for whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      await user.type(input, '   ');
      await user.click(button);
      
      expect(screen.getByText('Activity name is required')).toBeInTheDocument();
      expect(mockOnAddActivity).not.toHaveBeenCalled();
    });

    it('shows error for input exceeding max length', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      const longText = 'a'.repeat(101); // Exceeds 100 character limit
      await user.type(input, longText);
      await user.click(button);
      
      expect(screen.getByText('Activity name must be 100 characters or less')).toBeInTheDocument();
      expect(mockOnAddActivity).not.toHaveBeenCalled();
    });

    it('clears error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      // First trigger an error
      await user.click(button);
      expect(screen.getByText('Activity name is required')).toBeInTheDocument();
      
      // Then start typing to clear the error
      await user.type(input, 'a');
      
      await waitFor(() => {
        expect(screen.queryByText('Activity name is required')).not.toBeInTheDocument();
      });
    });

    it('shows error when trying to add activity while disabled', async () => {
      const user = userEvent.setup();
      
      // Start with enabled state
      const { rerender } = render(
        <ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />
      );
      
      const input = screen.getByTestId('activity-name-input');
      await user.type(input, 'Test Activity');
      
      // Then disable and try to submit
      rerender(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={true} />);
      
      const form = screen.getByTestId('activity-form-material3');
      fireEvent.submit(form);
      
      expect(screen.getByText('Cannot add activities when time is up')).toBeInTheDocument();
      expect(mockOnAddActivity).not.toHaveBeenCalled();
    });
  });

  describe('Button State', () => {
    it('disables submit button when input is empty', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const button = screen.getByTestId('add-activity-button');
      expect(button).toBeDisabled();
    });

    it('enables submit button when input has value', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      expect(button).toBeDisabled();
      
      await user.type(input, 'Test');
      
      expect(button).not.toBeDisabled();
    });

    it('disables submit button when form is disabled', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={true} />);
      
      const button = screen.getByTestId('add-activity-button');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const form = screen.getByTestId('activity-form-material3');
      expect(form).toHaveAttribute('role', 'form');
      
      const input = screen.getByTestId('activity-name-input');
      expect(input).toHaveAccessibleName('Activity Name');
      
      const button = screen.getByTestId('add-activity-button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const button = screen.getByTestId('add-activity-button');
      await user.click(button);
      
      const errorMessage = screen.getByText('Activity name is required');
      expect(errorMessage.closest('[role="alert"]')).toBeInTheDocument();
    });

    it('maintains focus management', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      
      await user.click(input);
      expect(input).toHaveFocus();
      
      await user.tab();
      const button = screen.getByTestId('add-activity-button');
      expect(button).toHaveFocus();
    });
  });

  describe('Material 3 Integration', () => {
    it('uses Material 3 components correctly', () => {
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      // Check that Material 3 components are being used
      const inputGroup = screen.getByTestId('activity-form-input-group');
      expect(inputGroup).toHaveClass('attached'); // Material3InputGroup attached variant
      
      const input = screen.getByTestId('activity-name-input');
      expect(input.closest('.textField')).toBeInTheDocument(); // Material3TextField
      
      const button = screen.getByTestId('add-activity-button');
      expect(button.closest('.button')).toBeInTheDocument(); // Material3Button
    });

    it('applies error styling correctly', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const button = screen.getByTestId('add-activity-button');
      await user.click(button);
      
      const input = screen.getByTestId('activity-name-input');
      expect(input.closest('.textField')).toHaveClass('error');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid form submissions', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      await user.type(input, 'Activity 1');
      await user.click(button);
      
      // Immediately try to submit again (should be prevented by empty input)
      await user.click(button);
      
      expect(mockOnAddActivity).toHaveBeenCalledTimes(1);
      expect(mockOnAddActivity).toHaveBeenCalledWith('Activity 1');
    });

    it('handles special characters in activity names', async () => {
      const user = userEvent.setup();
      render(<ActivityFormMaterial3 onAddActivity={mockOnAddActivity} isDisabled={false} />);
      
      const input = screen.getByTestId('activity-name-input');
      const button = screen.getByTestId('add-activity-button');
      
      const specialText = 'Activity with émojis 🎯 & symbols!';
      await user.type(input, specialText);
      await user.click(button);
      
      expect(mockOnAddActivity).toHaveBeenCalledWith(specialText);
    });
  });
});