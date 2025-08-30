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
    // Bootstrap Nav.Link components provide basic accessibility
    expect(screen.getByTestId('timer-nav-item')).toBeInTheDocument();
    expect(screen.getByTestId('activities-nav-item')).toBeInTheDocument();
  });

  it('has responsive mobile navigation with toggle', () => {
    render(<Navigation />);
    // Bootstrap implementation includes a toggle button for mobile responsiveness
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
    
    // All navigation items should be present
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });
});
