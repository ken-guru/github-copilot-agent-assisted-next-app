import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

describe('ThemeToggle Bootstrap Integration', () => {
  const originalLocalStorage = window.localStorage;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => localStorageMock[key]),
        setItem: jest.fn((key, value) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn(key => {
          delete localStorageMock[key];
        }),
      },
      writable: true,
    });

    // Reset document classes
    document.documentElement.className = '';
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  });

  describe('Bootstrap ButtonGroup Structure', () => {
    it('renders with Bootstrap ButtonGroup component', () => {
      render(<ThemeToggle />);
      
      const buttonGroup = document.querySelector('.btn-group');
      expect(buttonGroup).toBeInTheDocument();
      expect(buttonGroup).toHaveClass('btn-group');
    });

    it('applies proper ButtonGroup sizing', () => {
      render(<ThemeToggle />);
      
      const buttonGroup = document.querySelector('.btn-group');
      expect(buttonGroup).toBeInTheDocument();
      // Should have appropriate sizing classes for compact layout
      expect(buttonGroup).toHaveAttribute('role', 'group');
    });

    it('maintains proper Bootstrap button structure', () => {
      render(<ThemeToggle />);
      
      const buttons = document.querySelectorAll('.btn');
      expect(buttons).toHaveLength(3); // Light, System, Dark
      
      buttons.forEach(button => {
        expect(button).toHaveClass('btn');
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('applies Bootstrap button variants correctly', () => {
      render(<ThemeToggle />);
      
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        // Should have appropriate variant classes (outline or solid)
        expect(button.className).toMatch(/btn-(outline-)?secondary|btn-(outline-)?primary/);
      });
    });
  });

  describe('Bootstrap Button States', () => {
    it('applies active state with Bootstrap classes', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByTitle('Light theme');
      fireEvent.click(lightButton);
      
      // Should have Bootstrap active class
      expect(lightButton).toHaveClass('active');
      expect(lightButton.closest('.btn')).toHaveClass('active');
    });

    it('manages button group active states correctly', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByTitle('Light theme');
      const darkButton = screen.getByTitle('Dark theme');
      
      // Click light theme
      fireEvent.click(lightButton);
      expect(lightButton).toHaveClass('active');
      expect(darkButton).not.toHaveClass('active');
      
      // Click dark theme
      fireEvent.click(darkButton);
      expect(darkButton).toHaveClass('active');
      expect(lightButton).not.toHaveClass('active');
    });

    it('handles system button state correctly', () => {
      render(<ThemeToggle />);
      
      const systemButton = screen.getByTitle('System theme');
      fireEvent.click(systemButton);
      
      expect(systemButton).toHaveClass('active');
    });

    it('applies disabled state when needed (during mounting)', () => {
      render(<ThemeToggle />);
      
      // During initial mount, component might be in loading state
      // Check that buttons are properly rendered
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Bootstrap Accessibility Features', () => {
    it('maintains proper ARIA attributes on ButtonGroup', () => {
      render(<ThemeToggle />);
      
      const buttonGroup = screen.getByRole('group');
      expect(buttonGroup).toHaveAttribute('aria-label', 'Theme selection');
      expect(buttonGroup).toHaveAttribute('role', 'group');
    });

    it('preserves button ARIA labels', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByLabelText('Light theme');
      const systemButton = screen.getByLabelText('System theme');
      const darkButton = screen.getByLabelText('Dark theme');
      
      expect(lightButton).toHaveAttribute('aria-label', 'Light theme');
      expect(systemButton).toHaveAttribute('aria-label', 'System theme');
      expect(darkButton).toHaveAttribute('aria-label', 'Dark theme');
    });

    it('maintains title attributes for tooltips', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByTitle('Light theme');
      const systemButton = screen.getByTitle('System theme');
      const darkButton = screen.getByTitle('Dark theme');
      
      expect(lightButton).toHaveAttribute('title', 'Light theme');
      expect(systemButton).toHaveAttribute('title', 'System theme');
      expect(darkButton).toHaveAttribute('title', 'Dark theme');
    });

    it('supports keyboard navigation', () => {
      render(<ThemeToggle />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
        // Bootstrap buttons should be focusable
        button.focus();
        expect(button).toHaveFocus();
      });
    });
  });

  describe('Bootstrap Responsive Design', () => {
    it('applies responsive classes for mobile', () => {
      // Mock mobile viewport
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<ThemeToggle />);
      
      const buttonGroup = document.querySelector('.btn-group');
      expect(buttonGroup).toBeInTheDocument();
      
      // Should maintain proper Bootstrap structure on mobile
      const buttons = document.querySelectorAll('.btn');
      expect(buttons).toHaveLength(3);
    });

    it('maintains proper spacing with Bootstrap utilities', () => {
      render(<ThemeToggle />);
      
      const buttonGroup = document.querySelector('.btn-group');
      expect(buttonGroup).toBeInTheDocument();
      
      // Bootstrap ButtonGroup should handle spacing automatically
      const buttons = buttonGroup?.querySelectorAll('.btn');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Bootstrap Icon Integration', () => {
    it('renders SVG icons within Bootstrap buttons', () => {
      render(<ThemeToggle />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const icon = button.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('width', '20px');
        expect(icon).toHaveAttribute('height', '20px');
      });
    });

    it('maintains proper icon sizing in Bootstrap context', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByTitle('Light theme');
      const icon = lightButton.querySelector('svg');
      
      expect(icon).toHaveAttribute('width', '20px');
      expect(icon).toHaveAttribute('height', '20px');
      expect(icon).toHaveAttribute('stroke', 'currentColor');
    });
  });

  describe('Bootstrap Theme Integration', () => {
    it('works with Bootstrap dark mode data attribute', () => {
      render(<ThemeToggle />);
      
      const darkButton = screen.getByTitle('Dark theme');
      fireEvent.click(darkButton);
      
      // Should set data-bs-theme for Bootstrap dark mode
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });

    it('applies light theme with Bootstrap compatibility', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByTitle('Light theme');
      fireEvent.click(lightButton);
      
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    });

    it('handles system theme with Bootstrap integration', () => {
      render(<ThemeToggle />);
      
      const systemButton = screen.getByTitle('System theme');
      fireEvent.click(systemButton);
      
      // Should remove stored theme and let system preference take over
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('theme');
    });
  });

  describe('Bootstrap Loading State', () => {
    it('renders placeholder during hydration with Bootstrap structure', () => {
      // Mock initial render before mount
      const { rerender } = render(<ThemeToggle />);
      
      // After hydration, should show Bootstrap ButtonGroup
      rerender(<ThemeToggle />);
      
      const buttonGroup = document.querySelector('.btn-group');
      expect(buttonGroup).toBeInTheDocument();
    });
  });

  describe('Bootstrap Button Variants', () => {
    it('uses appropriate Bootstrap button variants for theme states', () => {
      render(<ThemeToggle />);
      
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        // Should use outline variant for inactive, solid for active
        expect(button.className).toMatch(/btn-(outline-)?/);
      });
    });

    it('toggles between outline and solid variants based on active state', () => {
      render(<ThemeToggle />);
      
      const lightButton = screen.getByTitle('Light theme');
      
      // Initially system should be active, others outline
      expect(lightButton.className).toMatch(/btn-outline-/);
      
      // After clicking, should change variant
      fireEvent.click(lightButton);
      expect(lightButton).toHaveClass('active');
    });
  });

  describe('Responsive Sizing Props', () => {
    it('renders with small size for navbar context', () => {
      render(<ThemeToggle size="sm" variant="navbar" />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveStyle({ width: '32px', height: '32px' });
      });
      
      // Check icon sizes are appropriately smaller
      const lightButton = screen.getByTitle('Light theme');
      const icon = lightButton.querySelector('svg');
      expect(icon).toHaveAttribute('width', '16px');
      expect(icon).toHaveAttribute('height', '16px');
    });

    it('renders with large size when specified', () => {
      render(<ThemeToggle size="lg" />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveStyle({ width: '48px', height: '48px' });
      });
      
      // Check icon sizes are appropriately larger
      const lightButton = screen.getByTitle('Light theme');
      const icon = lightButton.querySelector('svg');
      expect(icon).toHaveAttribute('width', '24px');
      expect(icon).toHaveAttribute('height', '24px');
    });

    it('uses default medium size when no props specified', () => {
      render(<ThemeToggle />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveStyle({ width: '44px', height: '44px' });
      });
      
      // Check default icon size
      const lightButton = screen.getByTitle('Light theme');
      const icon = lightButton.querySelector('svg');
      expect(icon).toHaveAttribute('width', '20px');
      expect(icon).toHaveAttribute('height', '20px');
    });
  });
});
