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
    // No longer has toggle navigation button - removed for simplification (Issue #245)
    expect(screen.getByLabelText('Go to Timer')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to Activities Management')).toBeInTheDocument();
  });

  it('is simplified (no navbar-toggler needed)', () => {
    render(<Navigation />);
    // Verify simplified navigation doesn't have toggle button (Issue #245 fix)
    const toggleButton = screen.queryByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).not.toBeInTheDocument();
    
    // All navigation items should be visible
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
  });
});
