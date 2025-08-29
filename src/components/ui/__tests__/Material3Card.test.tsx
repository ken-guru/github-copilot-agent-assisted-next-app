import React from 'react';
import { render, screen } from '@testing-library/react';
import { Material3Card } from '../Material3Card';

describe('Material3Card', () => {
  it('renders with default props', () => {
    render(
      <Material3Card data-testid="card">
        Card content
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Card content');
  });

  it('renders header when provided', () => {
    render(
      <Material3Card
        data-testid="card"
        header={<h2>Card Header</h2>}
      >
        Card content
      </Material3Card>
    );
    
    const header = screen.getByText('Card Header');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('H2');
  });

  it('renders footer when provided', () => {
    render(
      <Material3Card
        data-testid="card"
        footer={<p>Card Footer</p>}
      >
        Card content
      </Material3Card>
    );
    
    const footer = screen.getByText('Card Footer');
    expect(footer).toBeInTheDocument();
    expect(footer.tagName).toBe('P');
  });

  it('renders actions when provided', () => {
    render(
      <Material3Card
        data-testid="card"
        actions={
          <>
            <button>Action 1</button>
            <button>Action 2</button>
          </>
        }
      >
        Card content
      </Material3Card>
    );
    
    const action1 = screen.getByText('Action 1');
    const action2 = screen.getByText('Action 2');
    
    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
  });

  it('renders both footer and actions', () => {
    render(
      <Material3Card
        data-testid="card"
        footer={<p>Footer text</p>}
        actions={<button>Action</button>}
      >
        Card content
      </Material3Card>
    );
    
    const footer = screen.getByText('Footer text');
    const action = screen.getByText('Action');
    
    expect(footer).toBeInTheDocument();
    expect(action).toBeInTheDocument();
  });

  it('applies padding classes correctly', () => {
    const { rerender } = render(
      <Material3Card data-testid="card" padding="none">
        Content
      </Material3Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toHaveClass('padding-none');
    
    rerender(
      <Material3Card data-testid="card" padding="compact">
        Content
      </Material3Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('padding-compact');
    
    rerender(
      <Material3Card data-testid="card" padding="comfortable">
        Content
      </Material3Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('padding-comfortable');
    
    rerender(
      <Material3Card data-testid="card" padding="spacious">
        Content
      </Material3Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('padding-spacious');
  });

  it('uses default card shape', () => {
    render(
      <Material3Card data-testid="card">
        Content
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shape-cardElevated');
  });

  it('uses default elevation', () => {
    render(
      <Material3Card data-testid="card">
        Content
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('elevation-level1');
  });

  it('applies custom variant', () => {
    const { rerender } = render(
      <Material3Card data-testid="card" variant="filled">
        Content
      </Material3Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toHaveClass('variant-filled');
    
    rerender(
      <Material3Card data-testid="card" variant="outlined">
        Content
      </Material3Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('variant-outlined');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <Material3Card ref={ref} data-testid="card">
        Content
      </Material3Card>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('card'));
  });

  it('applies custom className', () => {
    render(
      <Material3Card data-testid="card" className="custom-card">
        Content
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
  });

  it('passes through container props', () => {
    render(
      <Material3Card
        data-testid="card"
        interactive
        focusable
        colorRole="primary"
        contentState="active"
      >
        Content
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('interactive');
    expect(card).toHaveClass('focusable');
    expect(card).toHaveClass('color-primary');
    expect(card).toHaveClass('state-active');
  });

  it('has proper semantic structure', () => {
    render(
      <Material3Card
        data-testid="card"
        header={<h2>Header</h2>}
        footer={<p>Footer</p>}
        actions={<button>Action</button>}
      >
        Body content
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    const header = card.querySelector('.header');
    const body = card.querySelector('.body');
    const footer = card.querySelector('.footer');
    const actions = card.querySelector('.actions');
    
    expect(header).toBeInTheDocument();
    expect(body).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
    
    expect(body).toHaveTextContent('Body content');
  });

  it('does not render footer section when no footer or actions provided', () => {
    render(
      <Material3Card data-testid="card">
        Content only
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    const footer = card.querySelector('.footer');
    
    expect(footer).not.toBeInTheDocument();
  });

  it('does not render header section when no header provided', () => {
    render(
      <Material3Card data-testid="card">
        Content only
      </Material3Card>
    );
    
    const card = screen.getByTestId('card');
    const header = card.querySelector('.header');
    
    expect(header).not.toBeInTheDocument();
  });
});