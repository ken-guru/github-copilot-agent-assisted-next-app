/**
 * Tests for Material 3 Card Component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3Card from '../components/Card';

describe('Material3Card', () => {
  test('renders with default props', () => {
    render(
      <Material3Card>
        <p>Card content</p>
      </Material3Card>
    );
    
    const card = screen.getByText('Card content').closest('div');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-surface-container-low', 'm3-elevation-1');
  });

  test('renders different variants correctly', () => {
    const { rerender } = render(
      <Material3Card variant="filled">
        <p>Filled card</p>
      </Material3Card>
    );
    let card = screen.getByText('Filled card').closest('div');
    expect(card).toHaveClass('bg-surface-container-highest');

    rerender(
      <Material3Card variant="outlined">
        <p>Outlined card</p>
      </Material3Card>
    );
    card = screen.getByText('Outlined card').closest('div');
    expect(card).toHaveClass('bg-surface', 'border', 'border-outline-variant');
  });

  test('renders with header', () => {
    render(
      <Material3Card header="Card Title">
        <p>Content</p>
      </Material3Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('m3-title-medium');
  });

  test('renders with custom header component', () => {
    const CustomHeader = () => <div data-testid="custom-header">Custom Header</div>;
    
    render(
      <Material3Card header={<CustomHeader />}>
        <p>Content</p>
      </Material3Card>
    );
    
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  test('renders with actions', () => {
    const actions = (
      <>
        <button>Cancel</button>
        <button>Save</button>
      </>
    );
    
    render(
      <Material3Card actions={actions}>
        <p>Content</p>
      </Material3Card>
    );
    
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('renders with media content', () => {
    const media = <img src="test.jpg" alt="Test" data-testid="card-media" />;
    
    render(
      <Material3Card media={media}>
        <p>Content</p>
      </Material3Card>
    );
    
    expect(screen.getByTestId('card-media')).toBeInTheDocument();
  });

  test('handles different padding options', () => {
    const { rerender } = render(
      <Material3Card padding="small">
        <p data-testid="content">Content</p>
      </Material3Card>
    );
    let contentContainer = screen.getByTestId('content').parentElement;
    expect(contentContainer).toHaveClass('p-3');

    rerender(
      <Material3Card padding="large">
        <p data-testid="content">Content</p>
      </Material3Card>
    );
    contentContainer = screen.getByTestId('content').parentElement;
    expect(contentContainer).toHaveClass('p-6');

    rerender(
      <Material3Card padding="none">
        <p data-testid="content">Content</p>
      </Material3Card>
    );
    contentContainer = screen.getByTestId('content').parentElement;
    expect(contentContainer).not.toHaveClass('p-3', 'p-4', 'p-6');
  });

  test('handles interactive state correctly', () => {
    const handleClick = jest.fn();
    
    render(
      <Material3Card interactive onClick={handleClick}>
        <p>Interactive card</p>
      </Material3Card>
    );
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('cursor-pointer', 'm3-motion-card');
    expect(card).toHaveAttribute('tabIndex', '0');
    
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('handles keyboard navigation for interactive cards', () => {
    const handleClick = jest.fn();
    
    render(
      <Material3Card interactive onClick={handleClick}>
        <p>Interactive card</p>
      </Material3Card>
    );
    
    const card = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Test Space key
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  test('does not handle clicks when not interactive', () => {
    const handleClick = jest.fn();
    
    render(
      <Material3Card onClick={handleClick}>
        <p>Non-interactive card</p>
      </Material3Card>
    );
    
    const card = screen.getByText('Non-interactive card').closest('div');
    expect(card).not.toHaveAttribute('role', 'button');
    expect(card).not.toHaveAttribute('tabIndex');
  });

  test('creates ripple effect on interactive click', async () => {
    render(
      <Material3Card interactive>
        <p>Ripple test</p>
      </Material3Card>
    );
    
    const card = screen.getByRole('button');
    fireEvent.click(card);

    // Check if ripple element is created
    await waitFor(() => {
      const ripple = card.querySelector('span[style*="animation: ripple"]');
      expect(ripple).toBeInTheDocument();
    });
  });

  test('applies different shapes correctly', () => {
    const { rerender } = render(
      <Material3Card shape="sm">
        <p>Small shape</p>
      </Material3Card>
    );
    let card = screen.getByText('Small shape').closest('div');
    expect(card).toHaveClass('m3-shape-sm');

    rerender(
      <Material3Card shape="xl">
        <p>Extra large shape</p>
      </Material3Card>
    );
    card = screen.getByText('Extra large shape').closest('div');
    expect(card).toHaveClass('m3-shape-xl');
  });

  test('applies custom elevation', () => {
    render(
      <Material3Card elevation={4}>
        <p>High elevation</p>
      </Material3Card>
    );
    
    const card = screen.getByText('High elevation').closest('div');
    expect(card).toHaveClass('m3-elevation-4');
  });

  test('applies custom className', () => {
    render(
      <Material3Card className="custom-card-class">
        <p>Custom class</p>
      </Material3Card>
    );
    
    const card = screen.getByText('Custom class').closest('div');
    expect(card).toHaveClass('custom-card-class');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Material3Card ref={ref}>
        <p>Ref test</p>
      </Material3Card>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  test('handles complex layout with all sections', () => {
    const media = <div data-testid="media">Media content</div>;
    const actions = <button data-testid="action">Action</button>;
    
    render(
      <Material3Card
        header="Card Header"
        media={media}
        actions={actions}
        padding="medium"
      >
        <p data-testid="main-content">Main content</p>
      </Material3Card>
    );
    
    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  test('maintains proper section order', () => {
    const media = <div data-testid="media">Media</div>;
    const actions = <button data-testid="action">Action</button>;
    
    render(
      <Material3Card
        header="Header"
        media={media}
        actions={actions}
      >
        <p data-testid="content">Content</p>
      </Material3Card>
    );
    
    const card = screen.getByText('Header').closest('div');
    const sections = Array.from(card?.children || []);
    
    // Header should be first
    expect(sections[0]).toContainHTML('Header');
    // Media should be second
    expect(sections[1]).toContainElement(screen.getByTestId('media'));
    // Content should be third
    expect(sections[2]).toContainElement(screen.getByTestId('content'));
    // Actions should be last
    expect(sections[3]).toContainElement(screen.getByTestId('action'));
  });
});