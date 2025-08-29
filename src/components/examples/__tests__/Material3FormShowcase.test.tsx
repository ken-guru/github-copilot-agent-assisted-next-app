import React from 'react';
import { render, screen } from '@testing-library/react';
import { Material3FormShowcase } from '../Material3FormShowcase';

describe('Material3FormShowcase', () => {
  it('renders showcase with all sections', () => {
    render(<Material3FormShowcase />);
    
    expect(screen.getByText('Material 3 Expressive Form Components')).toBeInTheDocument();
    expect(screen.getByText('Text Fields')).toBeInTheDocument();
    expect(screen.getByText('Input Groups')).toBeInTheDocument();
    expect(screen.getByText('Form Groups')).toBeInTheDocument();
    expect(screen.getByText('Field States')).toBeInTheDocument();
    expect(screen.getByText('Complex Components')).toBeInTheDocument();
  });

  it('renders form fields correctly', () => {
    render(<Material3FormShowcase />);
    
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('renders different field states', () => {
    render(<Material3FormShowcase />);
    
    expect(screen.getByDisplayValue('Cannot edit this')).toBeDisabled();
    expect(screen.getByDisplayValue('Read only content')).toHaveAttribute('readonly');
    expect(screen.getByDisplayValue('Invalid input')).toBeInTheDocument();
  });

  it('renders complex components', () => {
    render(<Material3FormShowcase />);
    
    expect(screen.getByText('Activity Form')).toBeInTheDocument();
    expect(screen.getByText('Time Setup')).toBeInTheDocument();
  });
});