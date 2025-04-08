import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

// Mock next/link to avoid router errors in tests
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('NotFound Page', () => {
  it('renders the 404 error message', () => {
    render(<NotFound />);
    
    // Check for 404 text
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
  
  it('provides a way to return to the home page', () => {
    render(<NotFound />);
    
    // Check for link back to home
    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
  
  it('has proper accessibility attributes', () => {
    render(<NotFound />);
    
    // Check that the page has proper landmark regions
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
