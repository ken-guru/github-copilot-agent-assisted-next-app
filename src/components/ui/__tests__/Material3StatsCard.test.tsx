import React from 'react';
import { render, screen } from '@testing-library/react';
import { Material3StatsCard } from '../Material3StatsCard';

describe('Material3StatsCard', () => {
  it('renders with required props', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test Metric"
        value="42"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    const label = screen.getByText('Test Metric');
    const value = screen.getByText('42');
    
    expect(card).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });

  it('renders with numeric value', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Count"
        value={123}
      />
    );
    
    const value = screen.getByText('123');
    expect(value).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <span data-testid="test-icon">📊</span>;
    
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="With Icon"
        value="100"
        icon={<TestIcon />}
      />
    );
    
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders trend indicators correctly', () => {
    const { rerender } = render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Trending Up"
        value="100"
        trend="up"
      />
    );
    
    let trendIndicator = screen.getByLabelText('Trend: up');
    expect(trendIndicator).toBeInTheDocument();
    expect(trendIndicator).toHaveTextContent('↗');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Trending Down"
        value="50"
        trend="down"
      />
    );
    
    trendIndicator = screen.getByLabelText('Trend: down');
    expect(trendIndicator).toHaveTextContent('↘');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Neutral"
        value="75"
        trend="neutral"
      />
    );
    
    trendIndicator = screen.getByLabelText('Trend: neutral');
    expect(trendIndicator).toHaveTextContent('→');
  });

  it('renders secondary value when provided', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Primary Metric"
        value="100"
        secondaryValue="vs 90 last week"
      />
    );
    
    const secondaryValue = screen.getByText('vs 90 last week');
    expect(secondaryValue).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        size="compact"
      />
    );
    
    let card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('size-compact');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        size="comfortable"
      />
    );
    
    card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('size-comfortable');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        size="spacious"
      />
    );
    
    card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('size-spacious');
  });

  it('applies value color classes correctly', () => {
    const { rerender } = render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        valueColor="primary"
      />
    );
    
    let card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('value-color-primary');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        valueColor="error"
      />
    );
    
    card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('value-color-error');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        valueColor="success"
      />
    );
    
    card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('value-color-success');
  });

  it('applies trend classes correctly', () => {
    const { rerender } = render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        trend="up"
      />
    );
    
    let card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('trend-up');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        trend="down"
      />
    );
    
    card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('trend-down');
    
    rerender(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        trend="neutral"
      />
    );
    
    card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('trend-neutral');
  });

  it('uses default summary card shape', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('shape-summaryCard');
  });

  it('uses default elevation', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('elevation-level1');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <Material3StatsCard
        ref={ref}
        data-testid="stats-card"
        label="Test"
        value="100"
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('stats-card'));
  });

  it('applies custom className', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        className="custom-stats"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('custom-stats');
  });

  it('passes through container props', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        interactive
        colorRole="primary"
        contentState="active"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    expect(card).toHaveClass('interactive');
    expect(card).toHaveClass('color-primary');
    expect(card).toHaveClass('state-active');
  });

  it('has proper semantic structure', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test Metric"
        value="100"
        icon={<span data-testid="icon">📊</span>}
        secondaryValue="Secondary"
        trend="up"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    const content = card.querySelector('.content');
    const icon = card.querySelector('.icon');
    const textContent = card.querySelector('.textContent');
    const label = card.querySelector('.label');
    const value = card.querySelector('.value');
    const secondaryValue = card.querySelector('.secondaryValue');
    const trendIndicator = card.querySelector('.trendIndicator');
    
    expect(content).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(textContent).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(secondaryValue).toBeInTheDocument();
    expect(trendIndicator).toBeInTheDocument();
  });

  it('does not render optional elements when not provided', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Simple"
        value="100"
      />
    );
    
    const card = screen.getByTestId('stats-card');
    const icon = card.querySelector('.icon');
    const secondaryValue = card.querySelector('.secondaryValue');
    const trendIndicator = card.querySelector('.trendIndicator');
    
    expect(icon).not.toBeInTheDocument();
    expect(secondaryValue).not.toBeInTheDocument();
    expect(trendIndicator).not.toBeInTheDocument();
  });

  it('has accessible trend indicator', () => {
    render(
      <Material3StatsCard
        data-testid="stats-card"
        label="Test"
        value="100"
        trend="up"
      />
    );
    
    const trendIndicator = screen.getByLabelText('Trend: up');
    expect(trendIndicator).toHaveAttribute('aria-label', 'Trend: up');
  });
});