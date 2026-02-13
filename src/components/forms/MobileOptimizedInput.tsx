'use client';
import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';

interface MobileOptimizedInputProps {
  label?: string;
  error?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'none';
  bsSize?: FormControlProps['size'];
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  pattern?: string;
}

export const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ label, error, inputMode, className, bsSize, ...props }, ref) => (
    <Form.Group className="mobile-form-group">
      {label && <Form.Label className="mobile-form-label">{label}</Form.Label>}
      <Form.Control 
        ref={ref} 
        className={`mobile-form-input ${className || ''}`}
        isInvalid={!!error} 
        inputMode={inputMode}
        size={bsSize}
        {...props} 
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
);

MobileOptimizedInput.displayName = 'MobileOptimizedInput';
