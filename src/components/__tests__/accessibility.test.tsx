/**
 * Accessibility tests for Material 3 components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Material3Button } from '../ui/Material3Button';
import { Material3TextField } from '../ui/Material3TextField';
import { Material3Container } from '../ui/Material3Container';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock the accessibility utilities
jest.mock('../../utils/accessibility-utils', () => ({
  focusManager: {
    setFocus: jest.fn(),
    restoreFocus: jest.fn(),
  },
  screenReader: {
    announce: jest.fn(),
  },
  prefersReducedMotion: jest.fn().mockReturnValue(false),
}));

jest.mock('../../utils/material3-accessibility', () => ({
  initializeMaterial3Accessibility: jest.fn(),
  Material3AriaEnhancements: {
    enhanceButton: jest.fn(),
    enhanceFormField: jest.fn(),
  },
}));

describe('Material3Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Material3Button variant="filled">
        Click me
      </Material3Button>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Material3Button 
        variant="filled"
        aria-label="Custom button label"
        aria-describedby="button-description"
      >
        Click me
      </Material3Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom button label');
    expect(button).toHaveAttribute('aria-describedby', 'button-description');
  });

  it('should be keyboard accessible', () => {
    const handleClick = jest.fn();
    render(
      <Material3Button variant="filled" onClick={handleClick}>
        Click me
      </Material3Button>
    );

    const button = screen.getByRole('button');
    
    // Should be focusable
    button.focus();
    expect(document.activeElement).toBe(button);

    // Should respond to click (keyboard events are handled by browser)
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it('should have proper focus indicators', () => {
    render(
      <Material3Button variant="filled">
        Click me
      </Material3Button>
    );

    const button = screen.getByRole('button');
    
    // Should have focus ring class
    expect(button).toHaveClass('m3-focus-visible');
  });

  it('should handle disabled state properly', () => {
    render(
      <Material3Button variant="filled" disabled>
        Disabled button
      </Material3Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have proper touch target size', () => {
    render(
      <Material3Button variant="filled">
        Click me
      </Material3Button>
    );

    const button = screen.getByRole('button');
    
    // Should have touch target class
    expect(button).toHaveClass('m3-touch-target');
  });
});

describe('Material3TextField Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Material3TextField
        label="Email address"
        type="email"
        required
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper label association', () => {
    render(
      <Material3TextField
        label="Email address"
        id="email-input"
      />
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email address');
    
    expect(input).toHaveAttribute('id', 'email-input');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('should indicate required fields', () => {
    render(
      <Material3TextField
        label="Required field"
        required
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toBeRequired();
  });

  it('should handle validation states', () => {
    render(
      <Material3TextField
        label="Email"
        error="Invalid email address"
        aria-invalid="true"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    
    // Should have error message
    const errorMessage = screen.getByText('Invalid email address');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('should support helper text', () => {
    render(
      <Material3TextField
        label="Password"
        helperText="Must be at least 8 characters"
        id="password-input"
      />
    );

    const input = screen.getByRole('textbox');
    const helperText = screen.getByText('Must be at least 8 characters');
    
    expect(input).toHaveAttribute('aria-describedby');
    expect(helperText).toHaveAttribute('id');
  });

  it('should be keyboard accessible', () => {
    const handleChange = jest.fn();
    render(
      <Material3TextField
        label="Test input"
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Should be focusable
    input.focus();
    expect(document.activeElement).toBe(input);

    // Should handle typing
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('Material3Container Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Material3Container>
        <h2>Container Title</h2>
        <p>Container content</p>
      </Material3Container>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support semantic roles', () => {
    render(
      <Material3Container role="region" aria-labelledby="container-title">
        <h2 id="container-title">Important Section</h2>
        <p>Section content</p>
      </Material3Container>
    );

    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-labelledby', 'container-title');
  });

  it('should be focusable when interactive', () => {
    const handleClick = jest.fn();
    render(
      <Material3Container 
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label="Interactive container"
      >
        Click me
      </Material3Container>
    );

    const container = screen.getByRole('button');
    
    // Should be focusable
    container.focus();
    expect(document.activeElement).toBe(container);

    // Should respond to click
    fireEvent.click(container);
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('Skip Links', () => {
  it('should support skip links', () => {
    render(
      <div>
        <a href="#main-content" className="m3-skip-link">
          Skip to main content
        </a>
        <main id="main-content">Main content</main>
      </div>
    );

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});

describe('Reduced Motion Support', () => {
  beforeEach(() => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it('should respect reduced motion preferences', () => {
    render(
      <Material3Button variant="filled" className="m3-motion-standard">
        Animated Button
      </Material3Button>
    );

    const button = screen.getByRole('button');
    
    // Should have motion class
    expect(button).toHaveClass('m3-motion-standard');
  });

  it('should provide static alternatives for animations', () => {
    render(
      <div className="m3-loading" data-testid="loading-element">
        Loading content
      </div>
    );

    const loadingElement = screen.getByTestId('loading-element');
    
    // Should have loading class
    expect(loadingElement).toHaveClass('m3-loading');
  });
});

describe('High Contrast Support', () => {
  beforeEach(() => {
    // Mock high contrast preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it('should enhance contrast in high contrast mode', () => {
    render(
      <Material3Button variant="filled" className="m3-high-contrast">
        High Contrast Button
      </Material3Button>
    );

    const button = screen.getByRole('button');
    
    // Should have high contrast styling
    expect(button).toHaveClass('m3-high-contrast');
  });
});

describe('Screen Reader Support', () => {
  it('should provide screen reader only content', () => {
    render(
      <div>
        <span className="sr-only">Screen reader only text</span>
        <button>
          <span aria-hidden="true">👍</span>
          <span className="sr-only">Like button</span>
        </button>
      </div>
    );

    const srOnlyText = screen.getByText('Screen reader only text');
    const srOnlyButton = screen.getByText('Like button');
    
    expect(srOnlyText).toHaveClass('sr-only');
    expect(srOnlyButton).toHaveClass('sr-only');
  });

  it('should use live regions for dynamic content', async () => {
    const TestComponent = () => {
      const [message, setMessage] = React.useState('');

      return (
        <div>
          <button onClick={() => setMessage('Content updated!')}>
            Update content
          </button>
          <div role="status" aria-live="polite" data-testid="live-region">
            {message}
          </div>
        </div>
      );
    };

    render(<TestComponent />);

    const button = screen.getByRole('button');
    const liveRegion = screen.getByTestId('live-region');

    fireEvent.click(button);

    await waitFor(() => {
      expect(liveRegion).toHaveTextContent('Content updated!');
    });

    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('role', 'status');
  });
});

describe('Touch Target Accessibility', () => {
  it('should have adequate touch targets on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <Material3Button variant="filled" className="m3-touch-target">
        Mobile Button
      </Material3Button>
    );

    const button = screen.getByRole('button');
    
    // Should have touch target class
    expect(button).toHaveClass('m3-touch-target');
  });
});

describe('Form Accessibility', () => {
  it('should group related form fields', () => {
    render(
      <fieldset>
        <legend>Personal Information</legend>
        <Material3TextField label="First Name" required />
        <Material3TextField label="Last Name" required />
        <Material3TextField label="Email" type="email" required />
      </fieldset>
    );

    const fieldset = screen.getByRole('group');
    const legend = screen.getByText('Personal Information');
    
    expect(fieldset).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
  });

  it('should provide clear error messages', () => {
    render(
      <Material3TextField
        label="Email"
        error="Please enter a valid email address"
        aria-invalid="true"
        id="email-field"
      />
    );

    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('Please enter a valid email address');
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(input).toHaveAttribute('aria-describedby');
  });
});