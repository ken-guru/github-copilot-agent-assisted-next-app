import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Material3Container } from '../Material3Container';

describe('Material3Container', () => {
  it('renders with default props', () => {
    render(
      <Material3Container data-testid="container">
        Test content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Test content');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <Material3Container data-testid="container" variant="elevated">
        Content
      </Material3Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toHaveClass('variant-elevated');
    
    rerender(
      <Material3Container data-testid="container" variant="filled">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('variant-filled');
    
    rerender(
      <Material3Container data-testid="container" variant="outlined">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('variant-outlined');
  });

  it('applies elevation classes correctly', () => {
    const { rerender } = render(
      <Material3Container data-testid="container" elevation="level0">
        Content
      </Material3Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toHaveClass('elevation-level0');
    
    rerender(
      <Material3Container data-testid="container" elevation="level3">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('elevation-level3');
  });

  it('applies shape classes correctly', () => {
    const { rerender } = render(
      <Material3Container data-testid="container" shape="small">
        Content
      </Material3Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toHaveClass('shape-small');
    
    rerender(
      <Material3Container data-testid="container" shape="asymmetricMedium">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('shape-asymmetricMedium');
    
    rerender(
      <Material3Container data-testid="container" shape="activityCard">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('shape-activityCard');
  });

  it('applies color role classes correctly', () => {
    const { rerender } = render(
      <Material3Container data-testid="container" colorRole="primary">
        Content
      </Material3Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toHaveClass('color-primary');
    
    rerender(
      <Material3Container data-testid="container" colorRole="surfaceContainerHigh">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('color-surfaceContainerHigh');
  });

  it('applies content state classes correctly', () => {
    const { rerender } = render(
      <Material3Container data-testid="container" contentState="active">
        Content
      </Material3Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toHaveClass('state-active');
    
    rerender(
      <Material3Container data-testid="container" contentState="loading">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('state-loading');
    
    rerender(
      <Material3Container data-testid="container" contentState="error">
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('state-error');
  });

  it('handles interactive behavior correctly', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    
    render(
      <Material3Container
        data-testid="container"
        interactive
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('interactive');
    
    fireEvent.mouseEnter(container);
    expect(onMouseEnter).toHaveBeenCalled();
    
    fireEvent.mouseLeave(container);
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('handles focusable behavior correctly', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    
    render(
      <Material3Container
        data-testid="container"
        focusable
        onFocus={onFocus}
        onBlur={onBlur}
      >
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('focusable');
    expect(container).toHaveAttribute('tabIndex', '0');
    
    fireEvent.focus(container);
    expect(onFocus).toHaveBeenCalled();
    
    fireEvent.blur(container);
    expect(onBlur).toHaveBeenCalled();
  });

  it('applies responsive classes when enabled', () => {
    render(
      <Material3Container data-testid="container" responsive>
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('responsive');
  });

  it('applies motion classes when enabled', () => {
    render(
      <Material3Container data-testid="container" enableMotion>
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('motion');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <Material3Container ref={ref} data-testid="container">
        Content
      </Material3Container>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('container'));
  });

  it('applies custom className', () => {
    render(
      <Material3Container data-testid="container" className="custom-class">
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(
      <Material3Container
        data-testid="container"
        data-custom="value"
        aria-label="Custom container"
      >
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('data-custom', 'value');
    expect(container).toHaveAttribute('aria-label', 'Custom container');
  });

  it('sets role attribute for interactive containers', () => {
    render(
      <Material3Container data-testid="container" interactive>
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('role', 'button');
  });

  it('does not set role attribute for non-interactive containers', () => {
    render(
      <Material3Container data-testid="container">
        Content
      </Material3Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).not.toHaveAttribute('role');
  });

  it('handles elevation changes based on content state', () => {
    const { rerender } = render(
      <Material3Container
        data-testid="container"
        elevation="level1"
        contentState="default"
      >
        Content
      </Material3Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toHaveClass('elevation-level1');
    
    rerender(
      <Material3Container
        data-testid="container"
        elevation="level1"
        contentState="active"
      >
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('elevation-level2');
    
    rerender(
      <Material3Container
        data-testid="container"
        elevation="level1"
        contentState="loading"
      >
        Content
      </Material3Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toHaveClass('elevation-level0');
  });
});