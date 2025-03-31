import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <Card className="custom-class">
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });

  it('renders with a title when provided', () => {
    render(
      <Card title="Card Title">
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders with actions when provided', () => {
    const ActionComponent = () => <button>Action</button>;
    
    render(
      <Card actions={<ActionComponent />}>
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('applies elevated style when specified', () => {
    render(
      <Card elevated>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('elevated');
  });

  it('renders with padding variation', () => {
    const { rerender } = render(
      <Card padding="small">
        <p>Test Content</p>
      </Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toHaveClass('paddingSmall');
    
    rerender(
      <Card padding="large">
        <p>Test Content</p>
      </Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('paddingLarge');
  });

  it('renders with borderless style when specified', () => {
    render(
      <Card borderless>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('borderless');
  });

  it('renders with custom data-testid', () => {
    render(
      <Card testId="custom-card">
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });

  it('renders with fullWidth style when specified', () => {
    render(
      <Card fullWidth>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('fullWidth');
  });
});