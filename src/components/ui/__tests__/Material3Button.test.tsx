import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Material3Button, Material3IconButton, Material3FAB } from '../Material3Button';

// Mock the motion system hook
jest.mock('@/hooks/useMotionSystem', () => ({
  useMicroInteraction: () => ({
    isActive: false,
    activate: jest.fn(),
    deactivate: jest.fn()
  })
}));

describe('Material3Button', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Material3Button>Click me</Material3Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('md-button');
      expect(button).toHaveClass('md-button--filled');
      expect(button).toHaveClass('md-button--medium');
      expect(button).toHaveClass('md-button--primary');
    });

    it('renders with custom variant', () => {
      render(<Material3Button variant="outlined">Outlined Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('md-button--outlined');
    });

    it('renders with custom size', () => {
      render(<Material3Button size="large">Large Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('md-button--large');
    });

    it('renders with custom color role', () => {
      render(<Material3Button colorRole="secondary">Secondary Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('md-button--secondary');
    });

    it('renders as full width', () => {
      render(<Material3Button fullWidth>Full Width Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('md-button--full-width');
    });
  });

  describe('Button Variants', () => {
    const variants = ['filled', 'outlined', 'text', 'elevated', 'tonal'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Material3Button variant={variant}>{variant} Button</Material3Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass(`md-button--${variant}`);
      });
    });
  });

  describe('Button Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Material3Button size={size}>{size} Button</Material3Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass(`md-button--${size}`);
      });
    });
  });

  describe('Color Roles', () => {
    const colorRoles = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colorRoles.forEach(colorRole => {
      it(`renders ${colorRole} color role correctly`, () => {
        render(<Material3Button colorRole={colorRole}>{colorRole} Button</Material3Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass(`md-button--${colorRole}`);
      });
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('renders with start icon', () => {
      render(
        <Material3Button startIcon={<TestIcon />}>
          Button with Start Icon
        </Material3Button>
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Button with Start Icon')).toBeInTheDocument();
    });

    it('renders with end icon', () => {
      render(
        <Material3Button endIcon={<TestIcon />}>
          Button with End Icon
        </Material3Button>
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Button with End Icon')).toBeInTheDocument();
    });

    it('renders with both start and end icons', () => {
      render(
        <Material3Button 
          startIcon={<TestIcon />} 
          endIcon={<span data-testid="end-icon">End</span>}
        >
          Button with Both Icons
        </Material3Button>
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
      expect(screen.getByText('Button with Both Icons')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders loading state correctly', () => {
      render(<Material3Button loading>Loading Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('md-button--loading');
      expect(button).toBeDisabled();
      
      // Check for loading spinner
      const spinner = button.querySelector('.md-button__loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('hides icons when loading', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;
      
      render(
        <Material3Button loading startIcon={<TestIcon />} endIcon={<TestIcon />}>
          Loading Button
        </Material3Button>
      );
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('shows loading text when provided', () => {
      render(<Material3Button loading>Loading...</Material3Button>);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('renders disabled state correctly', () => {
      render(<Material3Button disabled>Disabled Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('md-button--disabled');
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Material3Button disabled onClick={handleClick}>
          Disabled Button
        </Material3Button>
      );
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = jest.fn();
      render(<Material3Button onClick={handleClick}>Clickable Button</Material3Button>);
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles mouse events for press state', () => {
      render(<Material3Button>Interactive Button</Material3Button>);
      
      const button = screen.getByRole('button');
      
      fireEvent.mouseDown(button);
      expect(button).toHaveClass('md-button--pressed');
      
      fireEvent.mouseUp(button);
      expect(button).not.toHaveClass('md-button--pressed');
    });

    it('handles mouse leave to reset press state', () => {
      render(<Material3Button>Interactive Button</Material3Button>);
      
      const button = screen.getByRole('button');
      
      fireEvent.mouseDown(button);
      expect(button).toHaveClass('md-button--pressed');
      
      fireEvent.mouseLeave(button);
      expect(button).not.toHaveClass('md-button--pressed');
    });
  });

  describe('Ripple Effect', () => {
    it('creates ripple on click by default', async () => {
      render(<Material3Button>Ripple Button</Material3Button>);
      
      const button = screen.getByRole('button');
      fireEvent.mouseDown(button, { clientX: 50, clientY: 50 });
      
      const rippleContainer = button.querySelector('.md-button__ripple-container');
      expect(rippleContainer).toBeInTheDocument();
      
      // Wait for ripple to be created
      await waitFor(() => {
        const ripple = button.querySelector('.md-button__ripple');
        expect(ripple).toBeInTheDocument();
      });
    });

    it('does not create ripple when disabled', () => {
      render(<Material3Button disableRipple>No Ripple Button</Material3Button>);
      
      const button = screen.getByRole('button');
      const rippleContainer = button.querySelector('.md-button__ripple-container');
      expect(rippleContainer).not.toBeInTheDocument();
    });

    it('does not create ripple when button is disabled', () => {
      render(<Material3Button disabled>Disabled Button</Material3Button>);
      
      const button = screen.getByRole('button');
      fireEvent.mouseDown(button, { clientX: 50, clientY: 50 });
      
      const ripple = button.querySelector('.md-button__ripple');
      expect(ripple).not.toBeInTheDocument();
    });

    it('does not create ripple when loading', () => {
      render(<Material3Button loading>Loading Button</Material3Button>);
      
      const button = screen.getByRole('button');
      fireEvent.mouseDown(button, { clientX: 50, clientY: 50 });
      
      const ripple = button.querySelector('.md-button__ripple');
      expect(ripple).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports custom aria attributes', () => {
      render(
        <Material3Button aria-label="Custom label" aria-describedby="description">
          Button
        </Material3Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('is focusable by default', () => {
      render(<Material3Button>Focusable Button</Material3Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      render(<Material3Button disabled>Disabled Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<Material3Button className="custom-class">Custom Button</Material3Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('md-button');
    });

    it('forwards HTML button props', () => {
      render(
        <Material3Button 
          id="custom-id" 
          data-testid="custom-button"
          title="Custom title"
        >
          Custom Props Button
        </Material3Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'custom-id');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Custom title');
    });
  });
});

describe('Material3IconButton', () => {
  const TestIcon = () => <span data-testid="test-icon">Icon</span>;

  it('renders icon button correctly', () => {
    render(
      <Material3IconButton 
        icon={<TestIcon />} 
        aria-label="Icon button"
      />
    );
    
    const button = screen.getByRole('button', { name: /icon button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('md-icon-button');
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('requires aria-label for accessibility', () => {
    render(
      <Material3IconButton 
        icon={<TestIcon />} 
        aria-label="Required label"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Required label');
  });

  it('applies default text variant', () => {
    render(
      <Material3IconButton 
        icon={<TestIcon />} 
        aria-label="Default variant"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('md-button--text');
  });

  it('supports custom variant', () => {
    render(
      <Material3IconButton 
        icon={<TestIcon />} 
        variant="filled"
        aria-label="Filled icon button"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('md-button--filled');
  });
});

describe('Material3FAB', () => {
  const TestIcon = () => <span data-testid="test-icon">Icon</span>;

  it('renders FAB correctly', () => {
    render(
      <Material3FAB 
        icon={<TestIcon />} 
        aria-label="Floating action button"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('md-fab');
    expect(button).toHaveClass('md-fab--large');
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders small FAB variant', () => {
    render(
      <Material3FAB 
        icon={<TestIcon />} 
        variant="small"
        aria-label="Small FAB"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('md-fab--small');
  });

  it('renders extended FAB with label', () => {
    render(
      <Material3FAB 
        icon={<TestIcon />} 
        variant="extended"
        label="Create"
        aria-label="Extended FAB"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('md-fab--extended');
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('does not render label for non-extended variants', () => {
    render(
      <Material3FAB 
        icon={<TestIcon />} 
        variant="large"
        label="Should not show"
        aria-label="Large FAB"
      />
    );
    
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('uses filled variant by default', () => {
    render(
      <Material3FAB 
        icon={<TestIcon />} 
        aria-label="Default FAB"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('md-button--filled');
  });
});

describe('Button Integration', () => {
  it('works with form submission', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    
    render(
      <form onSubmit={handleSubmit}>
        <Material3Button type="submit">Submit</Material3Button>
      </form>
    );
    
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLButtonElement>();
    
    render(<Material3Button ref={ref}>Ref Button</Material3Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain('Ref Button');
  });
});