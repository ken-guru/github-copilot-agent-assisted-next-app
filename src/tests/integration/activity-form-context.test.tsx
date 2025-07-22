/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityForm from '../../components/feature/ActivityForm';
import { Activity } from '../../types/activity';

// Mock the theme hook
jest.mock('../../hooks/useThemeReactive', () => ({
  useThemeReactive: () => 'light'
}));

// Mock the color utilities
jest.mock('../../utils/colors', () => ({
  getActivityColorsForTheme: () => [
    { background: '#ff0000', border: '#cc0000' },
    { background: '#00ff00', border: '#00cc00' }
  ],
  getSmartColorIndex: () => 0
}));

jest.mock('../../utils/colorNames', () => ({
  getColorName: (index: number) => `Color ${index}`
}));

describe('ActivityForm Context-Based Behavior', () => {
  const mockActivity: Activity = {
    id: 'test-activity-1',
    name: 'Test Activity',
    description: 'Test Description',
    colorIndex: 0,
    createdAt: '2025-07-22T00:00:00Z',
    isActive: true
  };

  const defaultProps = {
    onAddActivity: jest.fn(),
    existingActivities: [],
    isDisabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Simplified Form Context (Timeline/Timer Running)', () => {
    it('shows only name field when isSimplified=true', () => {
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
        />
      );

      // Name field should be visible
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/quick add activity name/i)).toBeInTheDocument();

      // Description and color fields should NOT be present
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/color/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /color/i })).not.toBeInTheDocument();
    });

    it('shows submit button in simplified mode', () => {
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /add activity/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('handles form submission with only name field in simplified mode', async () => {
      const mockOnAddActivity = jest.fn();
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          onAddActivity={mockOnAddActivity}
        />
      );

      // Fill in the name field
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Quick Activity' } });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /add activity/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Quick Activity',
            description: '', // Should be empty in simplified mode
            colorIndex: 0 // Should use smart color selection
          })
        );
      });
    });

    it('clears form after successful submission in simplified mode', async () => {
      const mockOnAddActivity = jest.fn();
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          onAddActivity={mockOnAddActivity}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      
      // Fill and submit
      fireEvent.change(nameInput, { target: { value: 'Quick Activity' } });
      fireEvent.click(screen.getByRole('button', { name: /add activity/i }));

      // Form should be cleared after submission
      await waitFor(() => {
        expect(nameInput).toHaveValue('');
      });
    });

    it('handles disabled state in simplified mode', () => {
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          isDisabled={true}
        />
      );

      expect(screen.getByLabelText(/name/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /add activity/i })).toBeDisabled();
    });

    it('shows validation error for empty name in simplified mode', async () => {
      const mockOnSubmit = jest.fn();
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          onSubmit={mockOnSubmit}
        />
      );

      // Try to submit with empty name
      fireEvent.click(screen.getByRole('button', { name: /add activity/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(null); // Should signal error
      });
    });
  });

  describe('Full Form Context (Setup/Configuration)', () => {
    it('shows all fields when isSimplified=false', () => {
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={false}
        />
      );

      // All fields should be visible
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /color/i })).toBeInTheDocument(); // Color dropdown button
      
      // Should not have simplified placeholder
      expect(screen.queryByPlaceholderText(/quick add activity name/i)).not.toBeInTheDocument();
    });

    it('handles full form submission with all fields', async () => {
      const mockOnAddActivity = jest.fn();
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={false}
          onAddActivity={mockOnAddActivity}
        />
      );

      // Fill all fields
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Full Activity' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Full Description' } });

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /add activity/i }));

      await waitFor(() => {
        expect(mockOnAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Full Activity',
            description: 'Full Description',
            colorIndex: 0
          })
        );
      });
    });
  });

  describe('Context Switching Behavior', () => {
    it('preserves name when switching from full to simplified mode', () => {
      const { rerender } = render(
        <ActivityForm
          {...defaultProps}
          isSimplified={false}
        />
      );

      // Fill name in full mode
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });

      // Switch to simplified mode
      rerender(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
        />
      );

      // Name should be preserved
      expect(screen.getByLabelText(/name/i)).toHaveValue('Test Activity');
      
      // Description and color fields should be gone
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/color/i)).not.toBeInTheDocument();
    });

    it('shows full form when switching from simplified to full mode', () => {
      const { rerender } = render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
        />
      );

      // Fill name in simplified mode
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Activity' } });

      // Switch to full mode
      rerender(
        <ActivityForm
          {...defaultProps}
          isSimplified={false}
        />
      );

      // All fields should now be visible
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /color/i })).toBeInTheDocument(); // Color dropdown button

      // Name should be preserved
      expect(screen.getByLabelText(/name/i)).toHaveValue('Test Activity');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when provided', () => {
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          error="Test error message"
        />
      );

      expect(screen.getByTestId('activity-form-error')).toHaveTextContent('Test error message');
    });

    it('focuses name input when error occurs', () => {
      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          error="Test error message"
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveFocus();
    });
  });

  describe('Smart Color Selection', () => {
    it('uses smart color selection in simplified mode', async () => {
      const mockOnAddActivity = jest.fn();
      const existingActivities = [mockActivity];

      render(
        <ActivityForm
          {...defaultProps}
          isSimplified={true}
          onAddActivity={mockOnAddActivity}
          existingActivities={existingActivities}
        />
      );

      // Submit with name
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Activity' } });
      fireEvent.click(screen.getByRole('button', { name: /add activity/i }));

      await waitFor(() => {
        expect(mockOnAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Activity',
            description: '',
            colorIndex: expect.any(Number) // Should use smart selection
          })
        );
      });
    });
  });
});
