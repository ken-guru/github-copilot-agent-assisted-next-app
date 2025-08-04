import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OvertimeWarning from '../OvertimeWarning';

describe('OvertimeWarning Component', () => {
  const defaultProps = {
    timeOverage: 125, // 2 minutes 5 seconds
    onExtendDuration: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders overtime warning message', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    expect(screen.getByText('Overtime!')).toBeInTheDocument();
    expect(screen.getByText('2m 5s over planned time')).toBeInTheDocument();
  });

  it('formats overtime display correctly for seconds only', () => {
    render(<OvertimeWarning timeOverage={45} onExtendDuration={defaultProps.onExtendDuration} />);
    
    expect(screen.getByText('45s over planned time')).toBeInTheDocument();
  });

  it('formats overtime display correctly for minutes and seconds', () => {
    render(<OvertimeWarning timeOverage={185} onExtendDuration={defaultProps.onExtendDuration} />);
    
    expect(screen.getByText('3m 5s over planned time')).toBeInTheDocument();
  });

  it('formats overtime display correctly for exact minutes', () => {
    render(<OvertimeWarning timeOverage={120} onExtendDuration={defaultProps.onExtendDuration} />);
    
    expect(screen.getByText('2m 0s over planned time')).toBeInTheDocument();
  });

  it('renders extend duration button when callback provided', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const extendButton = screen.getByRole('button', { name: /add 1 min/i });
    expect(extendButton).toBeInTheDocument();
    expect(extendButton).toHaveAttribute('title', 'Add 1 minute to continue');
  });

  it('does not render extend duration button when callback not provided', () => {
    render(<OvertimeWarning timeOverage={125} />);
    
    expect(screen.queryByRole('button', { name: /add 1 min/i })).not.toBeInTheDocument();
  });

  it('calls onExtendDuration when extend button clicked', () => {
    const mockExtend = jest.fn();
    render(<OvertimeWarning timeOverage={125} onExtendDuration={mockExtend} />);
    
    const extendButton = screen.getByRole('button', { name: /add 1 min/i });
    fireEvent.click(extendButton);
    
    expect(mockExtend).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveClass('alert-warning');
    
    const icon = warning.querySelector('i[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has consistent layout styling to match ActivityForm', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveClass('mb-3');
    expect(warning).toHaveClass('d-flex');
    expect(warning).toHaveClass('align-items-center');
    expect(warning).toHaveClass('justify-content-between');
  });

  it('handles zero overtime gracefully', () => {
    render(<OvertimeWarning timeOverage={0} onExtendDuration={defaultProps.onExtendDuration} />);
    
    expect(screen.getByText('0s over planned time')).toBeInTheDocument();
  });

  it('displays Bootstrap warning variant styling', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveClass('alert-warning');
    
    const button = screen.getByRole('button', { name: /add 1 min/i });
    expect(button).toHaveClass('btn-outline-warning');
  });
});
