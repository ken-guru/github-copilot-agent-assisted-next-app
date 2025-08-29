import React from 'react';
import { render, screen } from '@testing-library/react';
import { Material3FormGroup } from '../Material3FormGroup';
import { Material3TextField } from '../Material3TextField';

describe('Material3FormGroup', () => {
  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <Material3TextField label="Field 1" data-testid="field-1" />
          <Material3TextField label="Field 2" data-testid="field-2" />
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toBeInTheDocument();
      expect(screen.getByTestId('field-1')).toBeInTheDocument();
      expect(screen.getByTestId('field-2')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Material3FormGroup className="custom-class" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('custom-class');
    });
  });

  describe('Spacing Variants', () => {
    it('applies compact spacing', () => {
      render(
        <Material3FormGroup spacing="compact" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('compact');
    });

    it('applies comfortable spacing (default)', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('comfortable');
    });

    it('applies spacious spacing', () => {
      render(
        <Material3FormGroup spacing="spacious" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('spacious');
    });
  });

  describe('Direction', () => {
    it('applies column direction (default)', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('column');
    });

    it('applies row direction', () => {
      render(
        <Material3FormGroup direction="row" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('row');
    });
  });

  describe('Alignment', () => {
    it('applies stretch alignment (default)', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('align-stretch');
    });

    it('applies start alignment', () => {
      render(
        <Material3FormGroup align="start" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('align-start');
    });

    it('applies center alignment', () => {
      render(
        <Material3FormGroup align="center" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('align-center');
    });

    it('applies end alignment', () => {
      render(
        <Material3FormGroup align="end" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('align-end');
    });
  });

  describe('Justification', () => {
    it('applies start justification (default)', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('justify-start');
    });

    it('applies center justification', () => {
      render(
        <Material3FormGroup justify="center" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('justify-center');
    });

    it('applies space-between justification', () => {
      render(
        <Material3FormGroup justify="space-between" data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('justify-space-between');
    });
  });

  describe('Wrap', () => {
    it('does not wrap by default', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).not.toHaveClass('wrap');
    });

    it('applies wrap when enabled', () => {
      render(
        <Material3FormGroup wrap data-testid="form-group">
          <div>Content</div>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('form-group')).toHaveClass('wrap');
    });
  });

  describe('Complex Layouts', () => {
    it('handles row layout with multiple fields', () => {
      render(
        <Material3FormGroup direction="row" spacing="comfortable" data-testid="form-group">
          <Material3TextField label="First Name" data-testid="first-name" />
          <Material3TextField label="Last Name" data-testid="last-name" />
        </Material3FormGroup>
      );
      
      const formGroup = screen.getByTestId('form-group');
      expect(formGroup).toHaveClass('row');
      expect(formGroup).toHaveClass('comfortable');
      expect(screen.getByTestId('first-name')).toBeInTheDocument();
      expect(screen.getByTestId('last-name')).toBeInTheDocument();
    });

    it('handles nested form groups', () => {
      render(
        <Material3FormGroup spacing="spacious" data-testid="outer-group">
          <Material3TextField label="Email" data-testid="email" />
          <Material3FormGroup direction="row" spacing="compact" data-testid="inner-group">
            <Material3TextField label="First Name" data-testid="first-name" />
            <Material3TextField label="Last Name" data-testid="last-name" />
          </Material3FormGroup>
        </Material3FormGroup>
      );
      
      expect(screen.getByTestId('outer-group')).toHaveClass('spacious', 'column');
      expect(screen.getByTestId('inner-group')).toHaveClass('compact', 'row');
      expect(screen.getByTestId('email')).toBeInTheDocument();
      expect(screen.getByTestId('first-name')).toBeInTheDocument();
      expect(screen.getByTestId('last-name')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper focus order in column layout', () => {
      render(
        <Material3FormGroup data-testid="form-group">
          <Material3TextField label="Field 1" data-testid="field-1" />
          <Material3TextField label="Field 2" data-testid="field-2" />
          <Material3TextField label="Field 3" data-testid="field-3" />
        </Material3FormGroup>
      );
      
      const field1 = screen.getByTestId('field-1');
      const field2 = screen.getByTestId('field-2');
      const field3 = screen.getByTestId('field-3');
      
      // Fields should be in document order for proper tab navigation
      expect(field1.compareDocumentPosition(field2)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(field2.compareDocumentPosition(field3)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('maintains proper focus order in row layout', () => {
      render(
        <Material3FormGroup direction="row" data-testid="form-group">
          <Material3TextField label="Field 1" data-testid="field-1" />
          <Material3TextField label="Field 2" data-testid="field-2" />
        </Material3FormGroup>
      );
      
      const field1 = screen.getByTestId('field-1');
      const field2 = screen.getByTestId('field-2');
      
      // Fields should be in document order for proper tab navigation
      expect(field1.compareDocumentPosition(field2)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });
});