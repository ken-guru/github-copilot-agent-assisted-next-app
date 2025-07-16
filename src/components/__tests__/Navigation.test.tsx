import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '../Navigation';
import '@testing-library/jest-dom';

describe('Navigation', () => {
  it('renders Timer and Activities links', () => {
    render(<Navigation />);
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });

  it('has accessible ARIA labels', () => {
    render(<Navigation />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle navigation')).toBeInTheDocument();
  });

  it('is responsive (has navbar-toggler)', () => {
    render(<Navigation />);
    expect(screen.getByRole('button', { name: /toggle navigation/i })).toBeInTheDocument();
  });
});
