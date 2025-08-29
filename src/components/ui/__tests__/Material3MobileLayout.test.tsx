/**
 * Tests for Material3MobileLayout components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Material3MobileLayout,
  Material3MobileContainer,
  Material3MobileGrid,
  Material3MobileStack,
} from '../Material3MobileLayout';

// Mock the mobile optimizations hook
jest.mock('../../hooks/useMobileOptimizations', () => ({
  useMobileOptimizations: () => ({
    isMobile: false,
    isTablet: false,
    orientation: 'portrait',
    viewportSize: 'md',
  }),
  useOrientationChange: jest.fn(),
}));

describe('Material3MobileLayout', () => {
  test('should render layout with default props', () => {
    render(
      <Material3MobileLayout>
        <div>Content</div>
      </Material3MobileLayout>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('should render with header and footer', () => {
    render(
      <Material3MobileLayout
        header={<div>Header</div>}
        footer={<div>Footer</div>}
      >
        <div>Main content</div>
      </Material3MobileLayout>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('should apply variant classes', () => {
    const { rerender } = render(
      <Material3MobileLayout variant="page">
        <div data-testid="content">Page content</div>
      </Material3MobileLayout>
    );

    let layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('page');

    rerender(
      <Material3MobileLayout variant="modal">
        <div data-testid="content">Modal content</div>
      </Material3MobileLayout>
    );

    layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('modal');

    rerender(
      <Material3MobileLayout variant="card">
        <div data-testid="content">Card content</div>
      </Material3MobileLayout>
    );

    layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('card');
  });

  test('should apply spacing classes', () => {
    const { rerender } = render(
      <Material3MobileLayout spacing="compact">
        <div data-testid="content">Compact content</div>
      </Material3MobileLayout>
    );

    let layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('compact');

    rerender(
      <Material3MobileLayout spacing="comfortable">
        <div data-testid="content">Comfortable content</div>
      </Material3MobileLayout>
    );

    layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('comfortable');

    rerender(
      <Material3MobileLayout spacing="spacious">
        <div data-testid="content">Spacious content</div>
      </Material3MobileLayout>
    );

    layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('spacious');
  });

  test('should apply mobile and tablet classes', () => {
    // Mock mobile environment
    const mockUseMobileOptimizations = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseMobileOptimizations.useMobileOptimizations.mockReturnValue({
      isMobile: true,
      isTablet: false,
      orientation: 'portrait',
      viewportSize: 'xs',
    });

    render(
      <Material3MobileLayout>
        <div data-testid="content">Mobile content</div>
      </Material3MobileLayout>
    );

    const layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('mobile');
    expect(layout).toHaveClass('portrait');
    expect(layout).toHaveClass('xs');
  });

  test('should apply safe area and touch scroll classes', () => {
    render(
      <Material3MobileLayout useSafeArea touchScroll>
        <div data-testid="content">Safe area content</div>
      </Material3MobileLayout>
    );

    const layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('safeArea');
    expect(layout).toHaveClass('touchScroll');
  });

  test('should apply custom className', () => {
    render(
      <Material3MobileLayout className="custom-layout">
        <div data-testid="content">Custom content</div>
      </Material3MobileLayout>
    );

    const layout = screen.getByTestId('content').closest('.layout');
    expect(layout).toHaveClass('custom-layout');
  });
});

describe('Material3MobileContainer', () => {
  test('should render container with default props', () => {
    render(
      <Material3MobileContainer>
        <div>Container content</div>
      </Material3MobileContainer>
    );

    expect(screen.getByText('Container content')).toBeInTheDocument();
  });

  test('should apply size classes', () => {
    const { rerender } = render(
      <Material3MobileContainer size="small">
        <div data-testid="content">Small container</div>
      </Material3MobileContainer>
    );

    let container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('size-small');

    rerender(
      <Material3MobileContainer size="large">
        <div data-testid="content">Large container</div>
      </Material3MobileContainer>
    );

    container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('size-large');
  });

  test('should apply centered class', () => {
    render(
      <Material3MobileContainer centered>
        <div data-testid="content">Centered container</div>
      </Material3MobileContainer>
    );

    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('centered');
  });

  test('should apply padding classes', () => {
    render(
      <Material3MobileContainer padding="large">
        <div data-testid="content">Padded container</div>
      </Material3MobileContainer>
    );

    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveClass('padding-large');
  });
});

describe('Material3MobileGrid', () => {
  test('should render grid with default props', () => {
    render(
      <Material3MobileGrid>
        <div>Grid item 1</div>
        <div>Grid item 2</div>
      </Material3MobileGrid>
    );

    expect(screen.getByText('Grid item 1')).toBeInTheDocument();
    expect(screen.getByText('Grid item 2')).toBeInTheDocument();
  });

  test('should apply gap classes', () => {
    const { rerender } = render(
      <Material3MobileGrid gap="small">
        <div data-testid="item">Grid item</div>
      </Material3MobileGrid>
    );

    let grid = screen.getByTestId('item').parentElement;
    expect(grid).toHaveClass('gap-small');

    rerender(
      <Material3MobileGrid gap="large">
        <div data-testid="item">Grid item</div>
      </Material3MobileGrid>
    );

    grid = screen.getByTestId('item').parentElement;
    expect(grid).toHaveClass('gap-large');
  });

  test('should handle auto-fit columns', () => {
    render(
      <Material3MobileGrid autoFit minColumnWidth="200px">
        <div data-testid="item">Auto-fit item</div>
      </Material3MobileGrid>
    );

    const grid = screen.getByTestId('item').parentElement;
    expect(grid).toHaveClass('autoFit');
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    });
  });

  test('should handle responsive columns', () => {
    render(
      <Material3MobileGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
        <div data-testid="item">Responsive item</div>
      </Material3MobileGrid>
    );

    const grid = screen.getByTestId('item').parentElement;
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(3, 1fr)', // md viewport = 3 columns
    });
  });

  test('should handle fixed number of columns', () => {
    render(
      <Material3MobileGrid columns={2}>
        <div data-testid="item">Fixed columns item</div>
      </Material3MobileGrid>
    );

    const grid = screen.getByTestId('item').parentElement;
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(2, 1fr)',
    });
  });
});

describe('Material3MobileStack', () => {
  test('should render stack with default props', () => {
    render(
      <Material3MobileStack>
        <div>Stack item 1</div>
        <div>Stack item 2</div>
      </Material3MobileStack>
    );

    expect(screen.getByText('Stack item 1')).toBeInTheDocument();
    expect(screen.getByText('Stack item 2')).toBeInTheDocument();
  });

  test('should apply direction classes', () => {
    const { rerender } = render(
      <Material3MobileStack direction="vertical">
        <div data-testid="item">Vertical item</div>
      </Material3MobileStack>
    );

    let stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('direction-vertical');

    rerender(
      <Material3MobileStack direction="horizontal">
        <div data-testid="item">Horizontal item</div>
      </Material3MobileStack>
    );

    stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('direction-horizontal');
  });

  test('should apply alignment classes', () => {
    const { rerender } = render(
      <Material3MobileStack align="center">
        <div data-testid="item">Centered item</div>
      </Material3MobileStack>
    );

    let stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('align-center');

    rerender(
      <Material3MobileStack align="end">
        <div data-testid="item">End-aligned item</div>
      </Material3MobileStack>
    );

    stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('align-end');
  });

  test('should apply justification classes', () => {
    render(
      <Material3MobileStack justify="between">
        <div data-testid="item">Justified item</div>
      </Material3MobileStack>
    );

    const stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('justify-between');
  });

  test('should apply wrap class', () => {
    render(
      <Material3MobileStack wrap>
        <div data-testid="item">Wrapped item</div>
      </Material3MobileStack>
    );

    const stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('wrap');
  });

  test('should apply gap classes', () => {
    render(
      <Material3MobileStack gap="large">
        <div data-testid="item">Gapped item</div>
      </Material3MobileStack>
    );

    const stack = screen.getByTestId('item').parentElement;
    expect(stack).toHaveClass('gap-large');
  });
});