/**
 * Tests for MobileOptimizationShowcase component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileOptimizationShowcase } from '../MobileOptimizationShowcase';

// Mock the mobile optimizations hook
jest.mock('../../hooks/useMobileOptimizations', () => ({
  useMobileOptimizations: () => ({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    orientation: 'portrait',
    viewportSize: 'md',
    shouldEnableHover: () => true,
  }),
}));

// Mock alert
global.alert = jest.fn();

describe('MobileOptimizationShowcase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render showcase with all sections', () => {
    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Mobile Optimization Showcase')).toBeInTheDocument();
    expect(screen.getByText('Device Information')).toBeInTheDocument();
    expect(screen.getByText('Touch-Optimized Buttons')).toBeInTheDocument();
    expect(screen.getByText('Mobile-Optimized Form')).toBeInTheDocument();
    expect(screen.getByText('Responsive Grid Layout')).toBeInTheDocument();
    expect(screen.getByText('Touch Feedback Demo')).toBeInTheDocument();
    expect(screen.getByText('Orientation-Aware Layout')).toBeInTheDocument();
  });

  test('should display device information correctly', () => {
    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Desktop')).toBeInTheDocument(); // Device Type
    expect(screen.getByText('No')).toBeInTheDocument(); // Touch Support
    expect(screen.getByText('portrait')).toBeInTheDocument(); // Orientation
    expect(screen.getByText('md')).toBeInTheDocument(); // Viewport Size
    expect(screen.getByText('Yes')).toBeInTheDocument(); // Hover Support
  });

  test('should render touch-optimized buttons', () => {
    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Primary Action')).toBeInTheDocument();
    expect(screen.getByText('Secondary Action')).toBeInTheDocument();
    expect(screen.getByText('Text Button')).toBeInTheDocument();
    expect(screen.getByText('Elevated')).toBeInTheDocument();
    expect(screen.getByText('Tonal')).toBeInTheDocument();
  });

  test('should render mobile-optimized form fields', () => {
    render(<MobileOptimizationShowcase />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  test('should handle form input changes', () => {
    render(<MobileOptimizationShowcase />);

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  test('should handle form submission', async () => {
    render(<MobileOptimizationShowcase />);

    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    // Should show loading state
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText('Submit Form')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(global.alert).toHaveBeenCalledWith('Form submitted successfully!');
  });

  test('should render responsive grid items', () => {
    render(<MobileOptimizationShowcase />);

    // Should render 8 grid items
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(`Item ${i}`)).toBeInTheDocument();
    }
  });

  test('should render touch feedback demo buttons', () => {
    render(<MobileOptimizationShowcase />);

    // Should render emoji buttons
    const emojiButtons = ['🎵', '🎮', '🎪', '🎭', '🎨', '🎯'];
    emojiButtons.forEach(emoji => {
      expect(screen.getByText(emoji)).toBeInTheDocument();
    });
  });

  test('should display current orientation', () => {
    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Current orientation:')).toBeInTheDocument();
    expect(screen.getByText('portrait')).toBeInTheDocument();
  });

  test('should adapt to mobile environment', () => {
    // Mock mobile environment
    const mockUseMobileOptimizations = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseMobileOptimizations.useMobileOptimizations.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isTouch: true,
      orientation: 'portrait',
      viewportSize: 'xs',
      shouldEnableHover: () => false,
    });

    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Mobile')).toBeInTheDocument(); // Device Type
    expect(screen.getByText('Yes')).toBeInTheDocument(); // Touch Support
    expect(screen.getByText('xs')).toBeInTheDocument(); // Viewport Size
    expect(screen.getByText('No')).toBeInTheDocument(); // Hover Support
  });

  test('should adapt to tablet environment', () => {
    // Mock tablet environment
    const mockUseMobileOptimizations = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseMobileOptimizations.useMobileOptimizations.mockReturnValue({
      isMobile: false,
      isTablet: true,
      isTouch: true,
      orientation: 'landscape',
      viewportSize: 'md',
      shouldEnableHover: () => false,
    });

    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Tablet')).toBeInTheDocument(); // Device Type
    expect(screen.getByText('landscape')).toBeInTheDocument(); // Orientation
  });

  test('should show appropriate touch feedback message', () => {
    const { rerender } = render(<MobileOptimizationShowcase />);

    // Desktop message
    expect(screen.getByText(/Hover and click the buttons below/)).toBeInTheDocument();

    // Mock touch environment
    const mockUseMobileOptimizations = jest.requireMock('../../hooks/useMobileOptimizations');
    mockUseMobileOptimizations.useMobileOptimizations.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isTouch: true,
      orientation: 'portrait',
      viewportSize: 'xs',
      shouldEnableHover: () => false,
    });

    rerender(<MobileOptimizationShowcase />);

    // Touch message
    expect(screen.getByText(/Touch the buttons below to see ripple effects/)).toBeInTheDocument();
  });

  test('should handle button clicks in touch demo', () => {
    render(<MobileOptimizationShowcase />);

    const emojiButton = screen.getByText('🎵');
    fireEvent.click(emojiButton);

    // Button should be clickable (no errors thrown)
    expect(emojiButton).toBeInTheDocument();
  });

  test('should render form helper texts', () => {
    render(<MobileOptimizationShowcase />);

    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    expect(screen.getByText('Include country code')).toBeInTheDocument();
    expect(screen.getByText('Tell us how we can help')).toBeInTheDocument();
  });

  test('should have proper input types and modes', () => {
    render(<MobileOptimizationShowcase />);

    const emailInput = screen.getByLabelText('Email Address');
    const phoneInput = screen.getByLabelText('Phone Number');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('inputMode', 'email');
    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('inputMode', 'tel');
  });
});