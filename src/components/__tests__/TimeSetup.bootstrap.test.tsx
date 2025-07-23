import { render, screen, fireEvent } from '@testing-library/react';
import TimeSetup from '../TimeSetup';

describe('TimeSetup Bootstrap Integration', () => {
  const mockOnTimeSet = jest.fn();

  beforeEach(() => {
    mockOnTimeSet.mockClear();
    // Mock Date.now for consistent testing
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2023-01-01T10:00:00.000Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Bootstrap Component Structure', () => {
    it('renders with Bootstrap Card structure', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const container = screen.getByTestId('time-setup');
      expect(container).toHaveClass('card');
    });

    it('renders heading with Bootstrap typography', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const heading = screen.getByRole('heading', { name: 'Set Time' });
      expect(heading).toHaveClass('mb-0');
      
      // Check that it's properly contained within a card-header
      const cardHeader = heading.closest('.card-header');
      expect(cardHeader).toBeInTheDocument();
    });

    it('renders mode selector with Bootstrap button group', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const buttonGroup = screen.getByRole('group', { name: /time setup mode/i });
      expect(buttonGroup).toHaveClass('btn-group', 'w-100', 'mb-3');
      
      const durationBtn = screen.getByRole('button', { name: 'Set Duration' });
      const deadlineBtn = screen.getByRole('button', { name: 'Set Deadline' });
      
      expect(durationBtn).toHaveClass('btn', 'btn-primary');
      expect(deadlineBtn).toHaveClass('btn', 'btn-outline-primary');
    });

    it('updates button states when switching modes', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const durationBtn = screen.getByRole('button', { name: 'Set Duration' });
      const deadlineBtn = screen.getByRole('button', { name: 'Set Deadline' });
      
      // Initially duration is active
      expect(durationBtn).toHaveClass('btn-primary');
      expect(deadlineBtn).toHaveClass('btn-outline-primary');
      
      // Switch to deadline mode
      fireEvent.click(deadlineBtn);
      
      expect(durationBtn).toHaveClass('btn-outline-primary');
      expect(deadlineBtn).toHaveClass('btn-primary');
    });
  });

  describe('Bootstrap Form Components', () => {
    it('renders duration form with Bootstrap structure', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const form = screen.getByRole('form');
      // Form is inside Card.Body, so check that it's properly contained
      const cardBody = form.closest('.card-body');
      expect(cardBody).toBeInTheDocument();
      
      // Check for Bootstrap row and columns
      const inputContainer = screen.getByTestId('duration-inputs');
      expect(inputContainer).toHaveClass('row', 'g-3');
      
      // Check individual input groups
      const hoursGroup = screen.getByTestId('hours-input-group');
      const minutesGroup = screen.getByTestId('minutes-input-group');  
      const secondsGroup = screen.getByTestId('seconds-input-group');
      
      expect(hoursGroup).toHaveClass('col-md-4');
      expect(minutesGroup).toHaveClass('col-md-4');
      expect(secondsGroup).toHaveClass('col-md-4');
    });

    it('renders form inputs with Bootstrap classes', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByLabelText('Hours');
      const minutesInput = screen.getByLabelText('Minutes');
      const secondsInput = screen.getByLabelText('Seconds');
      
      expect(hoursInput).toHaveClass('form-control');
      expect(minutesInput).toHaveClass('form-control');
      expect(secondsInput).toHaveClass('form-control');
    });

    it('renders form labels with Bootstrap classes', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const hoursLabel = screen.getByText('Hours');
      const minutesLabel = screen.getByText('Minutes');
      const secondsLabel = screen.getByText('Seconds');
      
      expect(hoursLabel).toHaveClass('form-label');
      expect(minutesLabel).toHaveClass('form-label');
      expect(secondsLabel).toHaveClass('form-label');
    });

    it('renders deadline form with Bootstrap structure', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      // Switch to deadline mode
      fireEvent.click(screen.getByRole('button', { name: 'Set Deadline' }));
      
      const deadlineGroup = screen.getByTestId('deadline-input-group');
      expect(deadlineGroup).toBeInTheDocument(); // Remove mb-3 class test as it was part of the fix
      
      const deadlineInput = screen.getByLabelText('Deadline Time');
      expect(deadlineInput).toHaveClass('form-control');
      
      const deadlineLabel = screen.getByText('Deadline Time');
      expect(deadlineLabel).toHaveClass('form-label');
    });

    it('renders submit button with Bootstrap classes', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const submitButton = screen.getByRole('button', { name: 'Set Time' });
      expect(submitButton).toHaveClass('btn', 'btn-success', 'w-100');
    });
  });

  describe('Bootstrap Responsive Behavior', () => {
    it('applies responsive grid classes to duration inputs', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const hoursGroup = screen.getByTestId('hours-input-group');
      const minutesGroup = screen.getByTestId('minutes-input-group');
      const secondsGroup = screen.getByTestId('seconds-input-group');
      
      // Should be full width on small screens, third width on medium+
      expect(hoursGroup).toHaveClass('col-12', 'col-md-4');
      expect(minutesGroup).toHaveClass('col-12', 'col-md-4');
      expect(secondsGroup).toHaveClass('col-12', 'col-md-4');
    });

    it('maintains Bootstrap spacing utilities', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const container = screen.getByTestId('time-setup');
      expect(container).toHaveClass('mb-4');
      
      const buttonGroup = screen.getByRole('group', { name: /time setup mode/i });
      expect(buttonGroup).toHaveClass('mb-3');
    });
  });

  describe('Bootstrap Form Validation States', () => {
    it('maintains Bootstrap form structure during interactions', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByLabelText('Hours');
      fireEvent.change(hoursInput, { target: { value: '2' } });
      
      // Input should maintain Bootstrap classes after value change
      expect(hoursInput).toHaveClass('form-control');
      expect(hoursInput).toHaveValue(2);
    });

    it('preserves Bootstrap structure during mode switching', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      // Switch modes and verify Bootstrap structure is maintained
      fireEvent.click(screen.getByRole('button', { name: 'Set Deadline' }));
      
      const deadlineInput = screen.getByLabelText('Deadline Time');
      expect(deadlineInput).toHaveClass('form-control');
      
      // Switch back
      fireEvent.click(screen.getByRole('button', { name: 'Set Duration' }));
      
      const hoursInput = screen.getByLabelText('Hours');
      expect(hoursInput).toHaveClass('form-control');
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper form accessibility with Bootstrap', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      // Check form has proper role
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Check button group has proper role and label
      const buttonGroup = screen.getByRole('group', { name: /time setup mode/i });
      expect(buttonGroup).toHaveAttribute('role', 'group');
      expect(buttonGroup).toHaveAttribute('aria-label', 'Time setup mode selection');
    });

    it('provides proper label associations', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const hoursInput = screen.getByLabelText('Hours');
      const minutesInput = screen.getByLabelText('Minutes');
      const secondsInput = screen.getByLabelText('Seconds');
      
      expect(hoursInput).toHaveAttribute('id', 'hours');
      expect(minutesInput).toHaveAttribute('id', 'minutes');
      expect(secondsInput).toHaveAttribute('id', 'seconds');
    });

    it('maintains accessibility in deadline mode', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Set Deadline' }));
      
      const deadlineInput = screen.getByLabelText('Deadline Time');
      expect(deadlineInput).toHaveAttribute('id', 'deadlineTime');
    });
  });

  describe('Bootstrap Theme Integration', () => {
    it('uses Bootstrap button variants correctly', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const durationBtn = screen.getByRole('button', { name: 'Set Duration' });
      const deadlineBtn = screen.getByRole('button', { name: 'Set Deadline' });
      const submitBtn = screen.getByRole('button', { name: 'Set Time' });
      
      // Primary button for active mode
      expect(durationBtn).toHaveClass('btn-primary');
      expect(deadlineBtn).toHaveClass('btn-outline-primary');
      
      // Success variant for submit action
      expect(submitBtn).toHaveClass('btn-success');
    });

    it('applies consistent Bootstrap spacing', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      const inputContainer = screen.getByTestId('duration-inputs');
      expect(inputContainer).toHaveClass('g-3'); // Bootstrap gutter spacing
    });
  });

  describe('Bootstrap Form Functionality', () => {
    it('submits form with Bootstrap structure intact', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      // Set values
      fireEvent.change(screen.getByLabelText('Hours'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '30' } });
      
      // Submit
      fireEvent.click(screen.getByRole('button', { name: 'Set Time' }));
      
      // Verify callback was called and Bootstrap structure preserved
      expect(mockOnTimeSet).toHaveBeenCalledWith(5400); // 1h 30m
      
      const form = screen.getByRole('form');
      const cardBody = form.closest('.card-body');
      expect(cardBody).toBeInTheDocument();
    });

    it('handles deadline submission with Bootstrap components', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      
      // Switch to deadline mode
      fireEvent.click(screen.getByRole('button', { name: 'Set Deadline' }));
      
      // Set deadline
      fireEvent.change(screen.getByLabelText('Deadline Time'), { target: { value: '14:00' } });
      
      // Submit
      fireEvent.click(screen.getByRole('button', { name: 'Set Time' }));
      
      // Verify callback was called
      expect(mockOnTimeSet).toHaveBeenCalled();
      
      // Verify Bootstrap structure maintained
      const form = screen.getByRole('form');
      const cardBody = form.closest('.card-body');
      expect(cardBody).toBeInTheDocument();
    });

    it('allows setting 0 minutes and nonzero seconds', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      // Set 0 minutes, 30 seconds
      fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Seconds'), { target: { value: '30' } });
      // Submit
      fireEvent.click(screen.getByRole('button', { name: 'Set Time' }));
      // Should call with 30 seconds
      expect(mockOnTimeSet).toHaveBeenCalledWith(30);
    });

    it('allows setting all fields to zero and starts timer (overtime)', () => {
      render(<TimeSetup onTimeSet={mockOnTimeSet} />);
      // Set all fields to zero
      fireEvent.change(screen.getByLabelText('Hours'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText('Seconds'), { target: { value: '0' } });
      // Submit
      fireEvent.click(screen.getByRole('button', { name: 'Set Time' }));
      // Should call with 0 seconds (overtime)
      expect(mockOnTimeSet).toHaveBeenCalledWith(0);
    });
  });
});
