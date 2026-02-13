'use client';
import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'none';
}

export const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ label, error, inputMode, className, ...props }, ref) => (
    <Form.Group className="mobile-form-group">
      {label && <Form.Label className="mobile-form-label">{label}</Form.Label>}
      <Form.Control 
        ref={ref} 
        className={`mobile-form-input ${className || ''}`}
        isInvalid={!!error} 
        inputMode={inputMode}
        {...props} 
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
);

MobileOptimizedInput.displayName = 'MobileOptimizedInput';
