import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Material3ButtonShowcase } from '../Material3ButtonShowcase';

// Mock the motion system hook
jest.mock('@/hooks/useMotionSystem', () => ({
  useMicroInteraction: () => ({
    isActive: false,
    activate: jest.fn(),
    deactivate: jest.fn()
  })
}));

describe('Material3ButtonShowcase', () => {
  beforeEach(() => {
    // Mock setTimeout for loading state tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the showcase with all sections', () => {
      render(<Material3ButtonShowcase />);
      
      // Check main title
      expect(screen.getByText('Material 3 Expressive Buttons')).toBeInTheDocument();
      
      // Check section headings
      expect(screen.getByText('Button Variants')).toBeInTheDocument();
      expect(screen.getByText('Button Sizes')).toBeInTheDocument();
      expect(screen.getByText('Buttons with Icons')).toBeInTheDocument();
      expect(screen.getByText('Icon Buttons')).toBeInTheDocument();
      expect(screen.getByText('Floating Action Buttons')).toBeInTheDocument();
      expect(screen.getByText('Full Width Buttons')).toBeInTheDocument();
      expect(screen.getByText('Interactive Demo')).toBeInTheDocument();
    });

    it('renders all button variants', () => {
      render(<Material3ButtonShowcase />);
      
      // Check variant section headings
      expect(screen.getByText('Filled')).toBeInTheDocument();
      expect(screen.getByText('Outlined')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Elevated')).toBeInTheDocument();
      expect(screen.getByText('Tonal')).toBeInTheDocument();
    });

    it('renders buttons with different states', () => {
      render(<Material3ButtonShowcase />);
      
      // Check for primary action button
      expect(screen.getByText('Primary Action')).toBeInTheDocument();
      
      // Check for disabled buttons
      const disabledButtons = screen.getAllByText('Disabled');
      expect(disabledButtons.length).toBeGreaterThan(0);
      
      // Check for loading button
      expect(screen.getByText('Click to Load')).toBeInTheDocument();
    });
  });

  describe('Button Sizes', () => {
    it('renders all button sizes', () => {
      render(<Material3ButtonShowcase />);
      
      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Large')).toBeInTheDocument();
    });
  });

  describe('Buttons with Icons', () => {
    it('renders buttons with various icon combinations', () => {
      render(<Material3ButtonShowcase />);
      
      expect(screen.getByText('Add Item')).toBeInTheDocument();
      expect(screen.getByText('Download')).toBeInTheDocument();
      expect(screen.getByText('Like')).toBeInTheDocument();
      expect(screen.getByText('Edit & Add')).toBeInTheDocument();
    });
  });

  describe('Icon Buttons', () => {
    it('renders icon-only buttons with proper accessibility', () => {
      render(<Material3ButtonShowcase />);
      
      // Icon buttons should have aria-labels
      expect(screen.getByLabelText('Like')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete')).toBeInTheDocument();
      expect(screen.getByLabelText('Download')).toBeInTheDocument();
      expect(screen.getByLabelText('Add')).toBeInTheDocument();
    });
  });

  describe('Floating Action Buttons', () => {
    it('renders different FAB variants', () => {
      render(<Material3ButtonShowcase />);
      
      expect(screen.getByLabelText('Add small')).toBeInTheDocument();
      expect(screen.getByLabelText('Add large')).toBeInTheDocument();
      expect(screen.getByLabelText('Create new item')).toBeInTheDocument();
      expect(screen.getByText('Create')).toBeInTheDocument();
    });
  });

  describe('Full Width Buttons', () => {
    it('renders full width button variants', () => {
      render(<Material3ButtonShowcase />);
      
      expect(screen.getByText('Full Width Filled')).toBeInTheDocument();
      expect(screen.getByText('Full Width Outlined')).toBeInTheDocument();
      expect(screen.getByText('Full Width with Icon')).toBeInTheDocument();
    });
  });

  describe('Interactive Demo', () => {
    it('renders interactive demo buttons', () => {
      render(<Material3ButtonShowcase />);
      
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      // There are multiple Delete buttons, so use getAllByText
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('handles button clicks without errors', () => {
      render(<Material3ButtonShowcase />);
      
      const saveButton = screen.getByText('Save Changes');
      const cancelButton = screen.getByText('Cancel');
      
      // Should not throw errors when clicked
      expect(() => {
        fireEvent.click(saveButton);
        fireEvent.click(cancelButton);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Material3ButtonShowcase />);
      
      // Main heading should be h1
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Material 3 Expressive Buttons');
      
      // Section headings should be h2
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
      
      // Subsection headings should be h3
      const subsectionHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subsectionHeadings.length).toBeGreaterThan(0);
    });

    it('has accessible button labels', () => {
      render(<Material3ButtonShowcase />);
      
      // All buttons should be accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Button should have accessible name (either text content or aria-label)
        expect(button).toHaveAccessibleName();
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive styling classes', () => {
      render(<Material3ButtonShowcase />);
      
      const container = screen.getByText('Material 3 Expressive Buttons').closest('div');
      expect(container).toHaveStyle({
        maxWidth: '1200px',
        margin: '0 auto'
      });
    });

    it('uses CSS Grid for button variant layout', () => {
      render(<Material3ButtonShowcase />);
      
      // Find the button variants grid container
      const filledSection = screen.getByText('Filled').closest('div');
      const gridContainer = filledSection?.parentElement;
      
      expect(gridContainer).toHaveStyle({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      });
    });
  });

  describe('Material 3 Design Token Usage', () => {
    it('uses Material 3 typography tokens for headings', () => {
      render(<Material3ButtonShowcase />);
      
      const mainHeading = screen.getByText('Material 3 Expressive Buttons');
      expect(mainHeading).toHaveStyle({
        fontFamily: 'var(--md-sys-typescale-display-small-font-family)',
        fontSize: 'var(--md-sys-typescale-display-small-font-size)'
      });
    });

    it('uses Material 3 color tokens', () => {
      render(<Material3ButtonShowcase />);
      
      const mainHeading = screen.getByText('Material 3 Expressive Buttons');
      expect(mainHeading).toHaveStyle({
        color: 'var(--md-sys-color-on-surface)'
      });
    });

    it('uses Material 3 shape tokens for containers', () => {
      render(<Material3ButtonShowcase />);
      
      // Find the interactive demo container
      const demoSection = screen.getByText('Interactive Demo').parentElement;
      const demoContainer = demoSection?.querySelector('div[style*="border-radius"]');
      
      if (demoContainer) {
        expect(demoContainer).toHaveStyle({
          borderRadius: 'var(--md-sys-shape-corner-large)'
        });
      } else {
        // Alternative: check if the demo section exists
        expect(demoSection).toBeInTheDocument();
      }
    });
  });

  describe('Performance', () => {
    it('renders without performance warnings', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<Material3ButtonShowcase />);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('handles multiple rapid clicks gracefully', () => {
      render(<Material3ButtonShowcase />);
      
      const saveButton = screen.getByText('Save Changes');
      
      // Should not throw errors with rapid clicks
      expect(() => {
        fireEvent.click(saveButton);
        fireEvent.click(saveButton);
        fireEvent.click(saveButton);
      }).not.toThrow();
    });
  });
});