import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  test('renders the 404 title', () => {
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  test('renders the error description', () => {
    expect(screen.getByText(/page you are looking for does not exist/i)).toBeInTheDocument();
  });

  test('provides a link back to the home page', () => {
    const homeLink = screen.getByText('Return to Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.tagName).toBe('A');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('has proper accessibility attributes', () => {
    // Changed test to look for correct role
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
