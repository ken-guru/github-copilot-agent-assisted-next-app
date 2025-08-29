/**
 * Material 3 Form Validation Utilities
 * Mobile-optimized form validation with touch-friendly feedback
 */

import { isTouchDevice } from './mobile-touch';

export interface ValidationRule {
  validator: (value: string) => boolean;
  message: string;
  type?: 'error' | 'warning';
}

export interface FormFieldConfig {
  name: string;
  label: string;
  required?: boolean;
  rules?: ValidationRule[];
  mobileKeyboard?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal';
  autocomplete?: string;
  debounceMs?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FormValidationState {
  [fieldName: string]: ValidationResult;
}

/**
 * Common validation rules for mobile-optimized forms
 */
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validator: (value: string) => value.trim().length > 0,
    message,
    type: 'error'
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validator: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
    type: 'error'
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validator: (value: string) => {
      // More flexible phone validation for international numbers
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    },
    message,
    type: 'error'
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validator: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
    type: 'error'
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    validator: (value: string) => value.length >= length,
    message: message || `Must be at least ${length} characters`,
    type: 'error'
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    validator: (value: string) => value.length <= length,
    message: message || `Must be no more than ${length} characters`,
    type: 'error'
  }),

  numeric: (message = 'Please enter a valid number'): ValidationRule => ({
    validator: (value: string) => !isNaN(Number(value)) && !isNaN(parseFloat(value)),
    message,
    type: 'error'
  }),

  alphanumeric: (message = 'Only letters and numbers are allowed'): ValidationRule => ({
    validator: (value: string) => /^[a-zA-Z0-9]*$/.test(value),
    message,
    type: 'error'
  }),

  strongPassword: (message = 'Password must contain at least 8 characters, including uppercase, lowercase, and number'): ValidationRule => ({
    validator: (value: string) => {
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      return strongRegex.test(value);
    },
    message,
    type: 'error'
  }),

  // Mobile-specific validations
  touchFriendlyLength: (message = 'Consider shorter text for better mobile experience'): ValidationRule => ({
    validator: (value: string) => !isTouchDevice() || value.length <= 50,
    message,
    type: 'warning'
  })
};

/**
 * Validates a single field value against its rules
 */
export function validateField(value: string, rules: ValidationRule[] = []): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of rules) {
    if (!rule.validator(value)) {
      if (rule.type === 'warning') {
        warnings.push(rule.message);
      } else {
        errors.push(rule.message);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates an entire form state
 */
export function validateForm(
  formData: Record<string, string>, 
  config: FormFieldConfig[]
): FormValidationState {
  const result: FormValidationState = {};

  for (const field of config) {
    const value = formData[field.name] || '';
    const rules = [...(field.rules || [])];

    // Add required rule if specified
    if (field.required) {
      rules.unshift(ValidationRules.required());
    }

    result[field.name] = validateField(value, rules);
  }

  return result;
}

/**
 * Checks if the entire form is valid
 */
export function isFormValid(validationState: FormValidationState): boolean {
  return Object.values(validationState).every(field => field.isValid);
}

/**
 * Gets all error messages from form validation state
 */
export function getFormErrors(validationState: FormValidationState): string[] {
  return Object.values(validationState)
    .flatMap(field => field.errors);
}

/**
 * Gets all warning messages from form validation state
 */
export function getFormWarnings(validationState: FormValidationState): string[] {
  return Object.values(validationState)
    .flatMap(field => field.warnings);
}

/**
 * Debounced validation for real-time feedback
 */
export function createDebouncedValidator(
  validator: (value: string) => ValidationResult,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (value: string, callback: (result: ValidationResult) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validator(value);
      callback(result);
    }, delay);
  };
}

/**
 * Mobile form configuration presets
 */
export const MobileFormPresets = {
  contactForm: (): FormFieldConfig[] => [
    {
      name: 'name',
      label: 'Full Name',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'name',
      rules: [
        ValidationRules.minLength(2),
        ValidationRules.touchFriendlyLength()
      ]
    },
    {
      name: 'email',
      label: 'Email Address',
      required: true,
      mobileKeyboard: 'email',
      autocomplete: 'email',
      rules: [
        ValidationRules.email()
      ]
    },
    {
      name: 'phone',
      label: 'Phone Number',
      mobileKeyboard: 'tel',
      autocomplete: 'tel',
      rules: [
        ValidationRules.phone()
      ]
    },
    {
      name: 'message',
      label: 'Message',
      required: true,
      mobileKeyboard: 'text',
      rules: [
        ValidationRules.minLength(10),
        ValidationRules.maxLength(500)
      ]
    }
  ],

  registrationForm: (formData?: Record<string, string>): FormFieldConfig[] => [
    {
      name: 'email',
      label: 'Email Address',
      required: true,
      mobileKeyboard: 'email',
      autocomplete: 'email',
      rules: [
        ValidationRules.email()
      ]
    },
    {
      name: 'password',
      label: 'Password',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'new-password',
      rules: [
        ValidationRules.strongPassword()
      ]
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'new-password',
      rules: formData ? [
        {
          validator: (value: string) => value === formData.password,
          message: 'Passwords do not match',
          type: 'error'
        } as ValidationRule
      ] : []
    }
  ],

  addressForm: (): FormFieldConfig[] => [
    {
      name: 'street',
      label: 'Street Address',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'street-address'
    },
    {
      name: 'city',
      label: 'City',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'address-level2'
    },
    {
      name: 'state',
      label: 'State/Province',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'address-level1'
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'postal-code'
    },
    {
      name: 'country',
      label: 'Country',
      required: true,
      mobileKeyboard: 'text',
      autocomplete: 'country'
    }
  ]
};

/**
 * Form accessibility helpers for mobile
 */
export const MobileFormAccessibility = {
  /**
   * Generate ARIA attributes for form fields
   */
  getAriaAttributes: (
    fieldName: string, 
    validation: ValidationResult,
    helperId?: string
  ) => ({
    'aria-invalid': !validation.isValid,
    'aria-describedby': helperId,
    'aria-required': true
  }),

  /**
   * Generate appropriate input modes for mobile keyboards
   */
  getInputMode: (keyboardType: string) => {
    const modes: Record<string, string> = {
      email: 'email',
      tel: 'tel',
      url: 'url',
      numeric: 'numeric',
      decimal: 'decimal',
      text: 'text'
    };
    return modes[keyboardType] || 'text';
  },

  /**
   * Get focus management attributes for mobile forms
   */
  getFocusAttributes: (isTouch: boolean) => ({
    autoFocus: !isTouch, // Avoid auto-focus on touch devices
    tabIndex: 0
  })
};