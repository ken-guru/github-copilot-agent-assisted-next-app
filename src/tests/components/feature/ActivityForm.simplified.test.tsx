import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityForm from '@/components/feature/ActivityForm';
import { Activity } from '@/types/activity';
import { jest } from '@jest/globals';

// Mock the hooks and utilities
jest.mock('@/hooks/useThemeReactive', () => ({
  useThemeReactive: jest.fn(() => 'light')
}));

jest.mock('@/utils/colors', () => ({
  getActivityColorsForTheme: jest.fn(() => [
    { background: '#ff0000', border: '#cc0000' }, // red
    { background: '#00ff00', border: '#00cc00' }, // green
    { background: '#0000ff', border: '#0000cc' }, // blue
  ]),
  getSmartColorIndex: jest.fn(() => 0)
}));

jest.mock('@/utils/colorNames', () => ({
  getColorName: jest.fn((index: number) => `Color ${index}`)
}));

describe('ActivityForm - Simplified Mode', () => {
  const mockOnAddActivity = jest.fn();

  const defaultProps = {
    onAddActivity: mockOnAddActivity,
    isDisabled: false,
    existingActivities: [] as Activity[],
  };

  const simplifiedProps = {
    ...defaultProps,
    isSimplified: true, // Use isSimplified prop for timeline/simplified context
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full form mode (when timers not running)', () => {
    it('should show all three fields in full mode', () => {
      render(<ActivityForm {...defaultProps} />);
      
      // Should show name, description, and color fields
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Color')).toBeInTheDocument();
    });

    it('should allow user to set description and color in full mode', async () => {
      render(<ActivityForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText('Name');
      const descriptionInput = screen.getByLabelText('Description');
      
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockOnAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Activity',
            description: 'Test Description',
            colorIndex: 0, // from smart color selection
          })
        );
      });
    });
  });

  describe('Simplified form mode (timeline context)', () => {
    it('should show only name field when isSimplified is true', () => {
      // This test will fail initially until we implement the simplified mode
      render(<ActivityForm {...simplifiedProps} />);
      
      // Should show only name field
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      
      // Should NOT show description or color fields
      expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Color')).not.toBeInTheDocument();
    });

    it('should auto-assign color and leave description empty in simplified mode', async () => {
      // This test will fail initially until we implement the simplified mode
      render(<ActivityForm {...simplifiedProps} />);
      
      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'Quick Activity' } });
      
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockOnAddActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Quick Activity',
            description: '', // Should be empty in simplified mode
            colorIndex: 0, // Should be auto-assigned
          })
        );
      });
    });

    it('should still respect isDisabled prop in simplified mode', () => {
      render(<ActivityForm {...simplifiedProps} isDisabled={true} />);
      
      const nameInput = screen.getByLabelText('Name');
      const submitButton = screen.getByRole('button', { name: /add/i });
      
      expect(nameInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should show placeholder indicating quick add mode', () => {
      render(<ActivityForm {...simplifiedProps} />);
      
      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toHaveAttribute('placeholder', expect.stringContaining('Quick'));
    });
  });

  describe('Mode switching behavior', () => {
    it('should switch from full to simplified mode when timer starts', () => {
      const { rerender } = render(<ActivityForm {...defaultProps} />);
      
      // Initially in full mode
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Color')).toBeInTheDocument();
      
      // Switch to simplified mode
      rerender(<ActivityForm {...defaultProps} isSimplified={true} />);
      
      // Should now be in simplified mode
      expect(screen.queryByLabelText('Description')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Color')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('should maintain form data when switching modes', () => {
      const { rerender } = render(<ActivityForm {...defaultProps} />);
      
      // Enter some data in full mode
      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });
      
      // Switch to simplified mode
      rerender(<ActivityForm {...defaultProps} isSimplified={true} />);
      
      // Name should be preserved
      const simplifiedNameInput = screen.getByLabelText('Name');
      expect(simplifiedNameInput).toHaveValue('Test Activity');
    });
  });
});
