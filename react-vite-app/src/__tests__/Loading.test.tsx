import { render, screen } from '@testing-library/react';
import { Loading } from '@/components/ui/Loading';

describe('Loading', () => {
  describe('Basic Rendering', () => {
    it('renders loading spinner by default', () => {
      render(<Loading />);
      const loading = screen.getByRole('status');
      expect(loading).toBeInTheDocument();
      expect(loading).toHaveAttribute('aria-label', 'Loading');
    });

    it('renders with custom aria-label', () => {
      render(<Loading aria-label="Processing data" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveAttribute('aria-label', 'Processing data');
    });

    it('renders loading text when provided', () => {
      render(<Loading text="Loading content..." />);
      const loadingText = screen.getByText('Loading content...');
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe('Spinner Types', () => {
    it('renders spinner type by default', () => {
      render(<Loading />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('animate-spin');
    });

    it('renders dots type', () => {
      render(<Loading type="dots" />);
      const dots = screen.getByRole('status');
      expect(dots).toHaveClass('flex', 'space-x-1');
      
      // Should have 3 dots
      const dotElements = dots.querySelectorAll('.animate-bounce');
      expect(dotElements).toHaveLength(3);
    });

    it('renders pulse type', () => {
      render(<Loading type="pulse" />);
      const pulse = screen.getByRole('status');
      expect(pulse).toHaveClass('animate-pulse');
    });

    it('renders bars type', () => {
      render(<Loading type="bars" />);
      const bars = screen.getByRole('status');
      expect(bars).toHaveClass('flex', 'space-x-1');
      
      // Should have 3 bars
      const barElements = bars.querySelectorAll('.animate-pulse');
      expect(barElements).toHaveLength(3);
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(<Loading size="sm" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('w-4', 'h-4');
    });

    it('applies default/medium size classes', () => {
      render(<Loading />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('w-6', 'h-6');
    });

    it('applies large size classes', () => {
      render(<Loading size="lg" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('w-8', 'h-8');
    });

    it('applies extra large size classes', () => {
      render(<Loading size="xl" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('w-12', 'h-12');
    });
  });

  describe('Colors', () => {
    it('applies primary color by default', () => {
      render(<Loading />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('text-blue-600');
    });

    it('applies secondary color', () => {
      render(<Loading color="secondary" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('text-gray-600');
    });

    it('applies success color', () => {
      render(<Loading color="success" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('text-green-600');
    });

    it('applies warning color', () => {
      render(<Loading color="warning" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('text-yellow-600');
    });

    it('applies error color', () => {
      render(<Loading color="error" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('text-red-600');
    });
  });

  describe('Centered Layout', () => {
    it('applies centered layout when specified', () => {
      render(<Loading centered />);
      const container = screen.getByRole('status').parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('applies min height when centered', () => {
      render(<Loading centered />);
      const container = screen.getByRole('status').parentElement;
      expect(container).toHaveClass('min-h-[100px]');
    });

    it('does not add centered classes by default', () => {
      render(<Loading />);
      const loading = screen.getByRole('status');
      expect(loading.parentElement).not.toHaveClass('flex');
    });
  });

  describe('Fullscreen Mode', () => {
    it('applies fullscreen overlay when specified', () => {
      render(<Loading fullscreen />);
      const overlay = screen.getByRole('status').parentElement;
      expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-white/80', 'dark:bg-gray-900/80');
    });

    it('centers content in fullscreen mode', () => {
      render(<Loading fullscreen />);
      const overlay = screen.getByRole('status').parentElement;
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('applies high z-index for fullscreen', () => {
      render(<Loading fullscreen />);
      const overlay = screen.getByRole('status').parentElement;
      expect(overlay).toHaveClass('z-50');
    });
  });

  describe('Text Display', () => {
    it('renders text below spinner when both provided', () => {
      render(<Loading text="Loading..." />);
      const loadingText = screen.getByText('Loading...');
      const container = loadingText.parentElement;
      expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'space-y-2');
    });

    it('applies text styling', () => {
      render(<Loading text="Loading..." />);
      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toHaveClass('text-sm', 'text-gray-600', 'dark:text-gray-400');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Loading className="custom-loading" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('custom-loading');
    });

    it('merges custom className with default classes', () => {
      render(<Loading className="custom-loading" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveClass('custom-loading');
      expect(loading).toHaveClass('animate-spin'); // Default class should still be present
    });
  });

  describe('Accessibility', () => {
    it('includes proper ARIA attributes', () => {
      render(<Loading />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveAttribute('role', 'status');
      expect(loading).toHaveAttribute('aria-label', 'Loading');
    });

    it('supports custom aria-label', () => {
      render(<Loading aria-label="Custom loading message" />);
      const loading = screen.getByRole('status');
      expect(loading).toHaveAttribute('aria-label', 'Custom loading message');
    });

    it('is hidden from screen readers when text is provided', () => {
      render(<Loading text="Loading..." />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
