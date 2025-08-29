import React from 'react';
import { render, screen } from '@testing-library/react';
import { Material3InputGroup } from '../Material3InputGroup';
import { Material3TextField } from '../Material3TextField';
import { Material3Button } from '../Material3Button';

describe('Material3InputGroup', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          <Material3TextField label="Search" data-testid="search-field" />
          <Material3Button data-testid="search-button">Search</Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toBeInTheDocument();
      expect(screen.getByTestId('search-field')).toBeInTheDocument();
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Material3InputGroup className="custom-class" data-testid="input-group">
          <div>Content</div>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('applies attached variant (default)', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          <Material3TextField label="Field" data-testid="field" />
          <Material3Button data-testid="button">Button</Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('attached');
    });

    it('applies spaced variant', () => {
      render(
        <Material3InputGroup variant="spaced" data-testid="input-group">
          <Material3TextField label="Field" data-testid="field" />
          <Material3Button data-testid="button">Button</Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('spaced');
    });
  });

  describe('Alignment', () => {
    it('applies stretch alignment (default)', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          <div>Content</div>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('align-stretch');
    });

    it('applies start alignment', () => {
      render(
        <Material3InputGroup align="start" data-testid="input-group">
          <div>Content</div>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('align-start');
    });

    it('applies center alignment', () => {
      render(
        <Material3InputGroup align="center" data-testid="input-group">
          <div>Content</div>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('align-center');
    });

    it('applies end alignment', () => {
      render(
        <Material3InputGroup align="end" data-testid="input-group">
          <div>Content</div>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toHaveClass('align-end');
    });
  });

  describe('Layout Behavior', () => {
    it('creates proper attached layout structure', () => {
      render(
        <Material3InputGroup variant="attached" data-testid="input-group">
          <Material3TextField label="Search" data-testid="search-field" />
          <Material3Button data-testid="search-button">Search</Material3Button>
        </Material3InputGroup>
      );
      
      const inputGroup = screen.getByTestId('input-group');
      expect(inputGroup).toHaveClass('attached');
      
      // Check that children are properly positioned
      const children = inputGroup.children;
      expect(children).toHaveLength(2);
    });

    it('creates proper spaced layout structure', () => {
      render(
        <Material3InputGroup variant="spaced" data-testid="input-group">
          <Material3TextField label="Field 1" data-testid="field-1" />
          <Material3TextField label="Field 2" data-testid="field-2" />
        </Material3InputGroup>
      );
      
      const inputGroup = screen.getByTestId('input-group');
      expect(inputGroup).toHaveClass('spaced');
    });
  });

  describe('Multiple Children', () => {
    it('handles multiple children correctly', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          <Material3TextField label="Field 1" data-testid="field-1" />
          <Material3TextField label="Field 2" data-testid="field-2" />
          <Material3Button data-testid="button">Action</Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('field-1')).toBeInTheDocument();
      expect(screen.getByTestId('field-2')).toBeInTheDocument();
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });
  });

  describe('Common Use Cases', () => {
    it('works as search input group', () => {
      render(
        <Material3InputGroup data-testid="search-group">
          <Material3TextField 
            label="Search"
            placeholder="Enter search terms..."
            data-testid="search-input"
          />
          <Material3Button variant="filled" data-testid="search-button">
            Search
          </Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('search-group')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter search terms...')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('works as form input with action button', () => {
      render(
        <Material3InputGroup data-testid="form-group">
          <Material3TextField 
            label="Email Address"
            type="email"
            data-testid="email-input"
          />
          <Material3Button variant="outlined" data-testid="verify-button">
            Verify
          </Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('form-group')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Verify')).toBeInTheDocument();
    });

    it('works with spaced variant for better mobile UX', () => {
      render(
        <Material3InputGroup variant="spaced" data-testid="mobile-group">
          <Material3TextField 
            label="Amount"
            type="number"
            data-testid="amount-input"
          />
          <Material3Button variant="filled" data-testid="calculate-button">
            Calculate
          </Material3Button>
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('mobile-group')).toHaveClass('spaced');
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Calculate')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper focus order', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          <Material3TextField label="Field" data-testid="field" />
          <Material3Button data-testid="button">Button</Material3Button>
        </Material3InputGroup>
      );
      
      const field = screen.getByTestId('field');
      const button = screen.getByTestId('button');
      
      // Button should come after field in document order
      expect(field.compareDocumentPosition(button)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('works with form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Material3InputGroup data-testid="input-group">
            <Material3TextField 
              name="searchTerm"
              label="Search"
              data-testid="search-field"
            />
            <Material3Button type="submit" data-testid="submit-button">
              Search
            </Material3Button>
          </Material3InputGroup>
        </form>
      );
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Edge Cases', () => {
    it('handles single child', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          <Material3TextField label="Single Field" data-testid="single-field" />
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toBeInTheDocument();
      expect(screen.getByTestId('single-field')).toBeInTheDocument();
    });

    it('handles empty children', () => {
      render(
        <Material3InputGroup data-testid="input-group">
          {null}
          {undefined}
          {false}
        </Material3InputGroup>
      );
      
      expect(screen.getByTestId('input-group')).toBeInTheDocument();
    });
  });
});