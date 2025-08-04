import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OvertimeWarning from '../OvertimeWarning';

describe('OvertimeWarning Component', () => {
  const defaultProps = {
    timeOverage: 125, // 2 minutes 5 seconds
  };

  it('renders overtime warning message', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    expect(screen.getByText('Overtime by 2m 5s')).toBeInTheDocument();
  });

  it('formats overtime display correctly for seconds only', () => {
    render(<OvertimeWarning timeOverage={45} />);
    
    expect(screen.getByText('Overtime by 45s')).toBeInTheDocument();
  });

  it('formats overtime display correctly for minutes and seconds', () => {
    render(<OvertimeWarning timeOverage={185} />);
    
    expect(screen.getByText('Overtime by 3m 5s')).toBeInTheDocument();
  });

  it('formats overtime display correctly for exact minutes', () => {
    render(<OvertimeWarning timeOverage={120} />);
    
    expect(screen.getByText('Overtime by 2m 0s')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveAttribute('role', 'alert');
    
    const icon = warning.querySelector('i[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has Bootstrap toast-like styling', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveClass('mb-3', 'p-2', 'border', 'border-warning', 'rounded', 'bg-warning-subtle', 'd-flex', 'align-items-center');
    expect(warning).toHaveStyle('min-height: 38px');
  });

  it('displays warning icon and text correctly', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    const icon = warning.querySelector('i.bi-exclamation-triangle-fill');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('me-2', 'text-warning');
    
    const text = warning.querySelector('small.text-warning-emphasis');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('mb-0');
  });

  it('handles zero overtime gracefully', () => {
    render(<OvertimeWarning timeOverage={0} />);
    
    expect(screen.getByText('Overtime by 0s')).toBeInTheDocument();
  });

  it('has consistent min-height to prevent layout shifting', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveStyle('min-height: 38px');
  });

  it('uses Bootstrap warning color scheme', () => {
    render(<OvertimeWarning {...defaultProps} />);
    
    const warning = screen.getByTestId('overtime-warning');
    expect(warning).toHaveClass('border-warning', 'bg-warning-subtle');
    
    const icon = warning.querySelector('i');
    expect(icon).toHaveClass('text-warning');
    
    const text = warning.querySelector('small');
    expect(text).toHaveClass('text-warning-emphasis');
  });
});
