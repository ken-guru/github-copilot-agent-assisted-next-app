/**
 * Tests for AnimationShowcase component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnimationShowcase } from '../AnimationShowcase';

// Mock the animation hooks and components
jest.mock('../../ui/Material3AnimatedButton', () => ({
  Material3AnimatedButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="animated-button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('../../ui/Material3AnimatedTextField', () => ({
  Material3AnimatedTextField: (props: any) => (
    <input data-testid="animated-textfield" {...props} />
  ),
}));

jest.mock('../../ui/Material3PageTransition', () => ({
  Material3PageTransition: ({ children }: any) => (
    <div data-testid="page-transition">{children}</div>
  ),
  usePageTransition: () => ({
    transitionKey: 'test-key',
    triggerTransition: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useAnimations', () => ({
  useLoadingAnimation: () => ({
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    isLoading: false,
  }),
  useMicroInteractions: () => ({
    triggerClick: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerValidationError: jest.fn(),
  }),
}));

describe('AnimationShowcase', () => {
  it('should render all sections', () => {
    render(<AnimationShowcase />);

    expect(screen.getByText('Material 3 Expressive Animations')).toBeInTheDocument();
    expect(screen.getByText('Animated Buttons')).toBeInTheDocument();
    expect(screen.getByText('Animated Text Fields')).toBeInTheDocument();
    expect(screen.getByText('Page Transitions')).toBeInTheDocument();
    expect(screen.getByText('Micro-interactions')).toBeInTheDocument();
    expect(screen.getByText('Loading Animations')).toBeInTheDocument();
    expect(screen.getByText('Performance Features')).toBeInTheDocument();
  });

  it('should render animated buttons', () => {
    render(<AnimationShowcase />);

    const buttons = screen.getAllByTestId('animated-button');
    expect(buttons).toHaveLength(4);

    expect(screen.getByText('Loading Demo')).toBeInTheDocument();
    expect(screen.getByText('Success Demo')).toBeInTheDocument();
    expect(screen.getByText('Error Demo')).toBeInTheDocument();
    expect(screen.getByText('All Animations')).toBeInTheDocument();
  });

  it('should render animated text fields', () => {
    render(<AnimationShowcase />);

    const textFields = screen.getAllByTestId('animated-textfield');
    expect(textFields).toHaveLength(4);
  });

  it('should render text field demo controls', () => {
    render(<AnimationShowcase />);

    expect(screen.getByText('Trigger Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Success')).toBeInTheDocument();
    expect(screen.getByText('Trigger Loading')).toBeInTheDocument();
  });

  it('should handle button demo interactions', async () => {
    render(<AnimationShowcase />);

    const loadingButton = screen.getByText('Loading Demo');
    fireEvent.click(loadingButton);

    // Button should be clickable
    expect(loadingButton).toBeInTheDocument();
  });

  it('should handle text field demo controls', () => {
    render(<AnimationShowcase />);

    const errorButton = screen.getByText('Trigger Error');
    const successButton = screen.getByText('Trigger Success');
    const loadingButton = screen.getByText('Trigger Loading');

    fireEvent.click(errorButton);
    fireEvent.click(successButton);
    fireEvent.click(loadingButton);

    // Controls should be clickable
    expect(errorButton).toBeInTheDocument();
    expect(successButton).toBeInTheDocument();
    expect(loadingButton).toBeInTheDocument();
  });

  it('should render page transition demo', () => {
    render(<AnimationShowcase />);

    expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Next Page')).toBeInTheDocument();
  });

  it('should handle page transition', () => {
    render(<AnimationShowcase />);

    const nextPageButton = screen.getByText('Next Page');
    fireEvent.click(nextPageButton);

    // Should still render the page transition component
    expect(screen.getByTestId('page-transition')).toBeInTheDocument();
  });

  it('should render micro-interaction cards', () => {
    render(<AnimationShowcase />);

    expect(screen.getByText('Click Animation')).toBeInTheDocument();
    expect(screen.getByText('Success Animation')).toBeInTheDocument();
    expect(screen.getByText('Error Animation')).toBeInTheDocument();
  });

  it('should handle micro-interaction clicks', () => {
    render(<AnimationShowcase />);

    const clickCard = screen.getByText('Click Animation').closest('div');
    const successCard = screen.getByText('Success Animation').closest('div');
    const errorCard = screen.getByText('Error Animation').closest('div');

    if (clickCard) fireEvent.click(clickCard);
    if (successCard) fireEvent.click(successCard);
    if (errorCard) fireEvent.click(errorCard);

    // Cards should be clickable
    expect(clickCard).toBeInTheDocument();
    expect(successCard).toBeInTheDocument();
    expect(errorCard).toBeInTheDocument();
  });

  it('should render loading animation examples', () => {
    render(<AnimationShowcase />);

    expect(screen.getByText('Pulse Loading')).toBeInTheDocument();
    expect(screen.getByText('Wave Loading')).toBeInTheDocument();
    expect(screen.getByText('Skeleton Loading')).toBeInTheDocument();
    expect(screen.getByText('Organic Loading')).toBeInTheDocument();
  });

  it('should render performance information', () => {
    render(<AnimationShowcase />);

    expect(screen.getByText('Reduced Motion Support')).toBeInTheDocument();
    expect(screen.getByText('Device Optimization')).toBeInTheDocument();
    expect(screen.getByText('Performance Monitoring')).toBeInTheDocument();
    expect(screen.getByText('GPU Acceleration')).toBeInTheDocument();
  });

  it('should have proper accessibility structure', () => {
    render(<AnimationShowcase />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Material 3 Expressive Animations');

    const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(sectionHeadings.length).toBeGreaterThan(0);
  });

  it('should render page features', () => {
    render(<AnimationShowcase />);

    expect(screen.getByText('Expressive Motion')).toBeInTheDocument();
    expect(screen.getByText('Performance Optimized')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Aware')).toBeInTheDocument();
  });

  it('should handle state changes properly', async () => {
    render(<AnimationShowcase />);

    // Test button state changes
    const loadingButton = screen.getByText('Loading Demo');
    fireEvent.click(loadingButton);

    // Test text field controls
    const triggerErrorButton = screen.getByText('Trigger Error');
    fireEvent.click(triggerErrorButton);

    // Components should remain in the document
    expect(loadingButton).toBeInTheDocument();
    expect(triggerErrorButton).toBeInTheDocument();
  });

  it('should render with proper CSS classes', () => {
    render(<AnimationShowcase />);

    const showcase = screen.getByText('Material 3 Expressive Animations').closest('div');
    expect(showcase).toHaveClass('showcase');
  });
});