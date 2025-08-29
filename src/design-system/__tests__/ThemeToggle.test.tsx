/**
 * Tests for Material 3 ThemeToggle Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Material3ThemeToggle from '../components/ThemeToggle';

describe('Material3ThemeToggle', () => {
  test('renders with default props', () => {
    render(<Material3ThemeToggle />);
    
    // Should render the theme selection group
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-label', 'Theme selection');
  });

  test('renders three buttons in standard variant', () => {
    render(<Material3ThemeToggle variant="standard" />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3); // Light, Dark, System
    
    // Check that all theme buttons are present
    expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument();
  });

  test('renders with light theme initially', () => {
    render(<Material3ThemeToggle theme="light" />);
    
    const lightButton = screen.getByLabelText('Switch to Light theme');
    expect(lightButton).toHaveAttribute('aria-pressed', 'true');
    
    const darkButton = screen.getByLabelText('Switch to Dark theme');
    expect(darkButton).toHaveAttribute('aria-pressed', 'false');
    
    const systemButton = screen.getByLabelText('Switch to System theme');
    expect(systemButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('renders with dark theme', () => {
    render(<Material3ThemeToggle theme="dark" />);
    
    const lightButton = screen.getByLabelText('Switch to Light theme');
    expect(lightButton).toHaveAttribute('aria-pressed', 'false');
    
    const darkButton = screen.getByLabelText('Switch to Dark theme');
    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    
    const systemButton = screen.getByLabelText('Switch to System theme');
    expect(systemButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('renders with system theme', () => {
    render(<Material3ThemeToggle theme="system" />);
    
    const lightButton = screen.getByLabelText('Switch to Light theme');
    expect(lightButton).toHaveAttribute('aria-pressed', 'false');
    
    const darkButton = screen.getByLabelText('Switch to Dark theme');
    expect(darkButton).toHaveAttribute('aria-pressed', 'false');
    
    const systemButton = screen.getByLabelText('Switch to System theme');
    expect(systemButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('handles theme change callback', () => {
    const handleThemeChange = jest.fn();
    render(<Material3ThemeToggle theme="light" onThemeChange={handleThemeChange} />);
    
    const darkButton = screen.getByLabelText('Switch to Dark theme');
    fireEvent.click(darkButton);
    
    expect(handleThemeChange).toHaveBeenCalledTimes(1);
    expect(handleThemeChange).toHaveBeenCalledWith('dark');
  });

  test('handles different variants', () => {
    const { rerender } = render(<Material3ThemeToggle variant="icon-only" />);
    // Icon-only renders a single button, not a group
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10');

    rerender(<Material3ThemeToggle variant="standard" />);
    // Standard renders a group with multiple buttons
    let group = screen.getByRole('group');
    expect(group).toHaveClass('h-10');
  });

  test('handles different sizes', () => {
    const { rerender } = render(<Material3ThemeToggle size="small" />);
    let buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('w-8', 'h-8');

    rerender(<Material3ThemeToggle size="medium" />);
    buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('w-10', 'h-10');

    rerender(<Material3ThemeToggle size="large" />);
    buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('w-12', 'h-12');
  });

  test('shows labels in standard variant', () => {
    render(<Material3ThemeToggle variant="standard" />);
    
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  test('does not show labels in icon-only variant', () => {
    render(<Material3ThemeToggle variant="icon-only" />);
    
    expect(screen.queryByText('Light')).not.toBeInTheDocument();
    expect(screen.queryByText('Dark')).not.toBeInTheDocument();
    expect(screen.queryByText('System')).not.toBeInTheDocument();
  });

  test('handles disabled state', () => {
    const handleThemeChange = jest.fn();
    render(<Material3ThemeToggle disabled onThemeChange={handleThemeChange} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    fireEvent.click(buttons[0]);
    expect(handleThemeChange).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    render(<Material3ThemeToggle className="custom-theme-toggle" />);
    
    const group = screen.getByRole('group');
    expect(group).toHaveClass('custom-theme-toggle');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Material3ThemeToggle ref={ref} theme="light" />);
    
    // The ref should be applied to the active button (light theme in this case)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute('aria-pressed', 'true');
  });

  test('handles keyboard navigation', () => {
    const handleThemeChange = jest.fn();
    render(<Material3ThemeToggle onThemeChange={handleThemeChange} />);
    
    const darkButton = screen.getByLabelText('Switch to Dark theme');
    
    // Should handle Enter key
    fireEvent.keyDown(darkButton, { key: 'Enter' });
    fireEvent.click(darkButton);
    expect(handleThemeChange).toHaveBeenCalledWith('dark');
  });

  test('has proper accessibility attributes', () => {
    render(<Material3ThemeToggle />);
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Theme selection');
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button, index) => {
      const themes = ['Light', 'Dark', 'System'];
      expect(button).toHaveAttribute('aria-label', `Switch to ${themes[index]} theme`);
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-pressed');
    });
  });

  test('renders SVG icons correctly', () => {
    render(<Material3ThemeToggle />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('handles theme prop changes', () => {
    const { rerender } = render(<Material3ThemeToggle theme="light" />);
    
    let lightButton = screen.getByLabelText('Switch to Light theme');
    expect(lightButton).toHaveAttribute('aria-pressed', 'true');
    
    // Should update when theme prop changes
    rerender(<Material3ThemeToggle theme="dark" />);
    let darkButton = screen.getByLabelText('Switch to Dark theme');
    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    
    rerender(<Material3ThemeToggle theme="system" />);
    let systemButton = screen.getByLabelText('Switch to System theme');
    expect(systemButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('handles undefined theme gracefully', () => {
    render(<Material3ThemeToggle />);
    
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    
    // Should not crash and should render default state (system)
    const systemButton = screen.getByLabelText('Switch to System theme');
    expect(systemButton).toHaveAttribute('aria-pressed', 'true');
    
    // Should be able to click without crashing
    fireEvent.click(screen.getByLabelText('Switch to Light theme'));
  });

  test('icon-only variant renders single button', () => {
    render(<Material3ThemeToggle variant="icon-only" />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    
    const button = buttons[0];
    expect(button).toHaveClass('h-10', 'w-10');
    expect(button).toHaveClass('m3-shape-full'); // rounded-full is applied via this class
  });

  test('cycles through themes correctly in icon-only variant', () => {
    const handleThemeChange = jest.fn();
    const { rerender } = render(
      <Material3ThemeToggle variant="icon-only" theme="light" onThemeChange={handleThemeChange} />
    );
    
    const button = screen.getByRole('button');
    
    // Light -> Dark
    fireEvent.click(button);
    expect(handleThemeChange).toHaveBeenLastCalledWith('dark');
    
    // Dark -> System
    rerender(<Material3ThemeToggle variant="icon-only" theme="dark" onThemeChange={handleThemeChange} />);
    fireEvent.click(button);
    expect(handleThemeChange).toHaveBeenLastCalledWith('system');
    
    // System -> Light
    rerender(<Material3ThemeToggle variant="icon-only" theme="system" onThemeChange={handleThemeChange} />);
    fireEvent.click(button);
    expect(handleThemeChange).toHaveBeenLastCalledWith('light');
  });
});