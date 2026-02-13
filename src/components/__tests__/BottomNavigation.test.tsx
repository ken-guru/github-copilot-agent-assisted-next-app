import React from 'react';
import { render, screen } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('BottomNavigation Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUsePathname = require('next/navigation').usePathname;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all navigation items', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<BottomNavigation />);
    
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  test('marks home as active when on home page', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<BottomNavigation />);
    
    const timerLink = screen.getByText('Timer').closest('a');
    expect(timerLink).toHaveClass('active');
  });

  test('marks activities as active when on activities page', () => {
    mockUsePathname.mockReturnValue('/activities');
    
    render(<BottomNavigation />);
    
    const activitiesLink = screen.getByText('Activities').closest('a');
    expect(activitiesLink).toHaveClass('active');
  });

  test('marks AI as active when on AI page', () => {
    mockUsePathname.mockReturnValue('/ai');
    
    render(<BottomNavigation />);
    
    const aiLink = screen.getByText('AI').closest('a');
    expect(aiLink).toHaveClass('active');
  });

  test('has proper aria attributes', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<BottomNavigation />);
    
    const nav = screen.getByRole('navigation', { name: 'Bottom navigation' });
    expect(nav).toBeInTheDocument();
    
    const timerLink = screen.getByText('Timer').closest('a');
    expect(timerLink).toHaveAttribute('aria-current', 'page');
  });
});
