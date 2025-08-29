/**
 * Material 3 Contextual Keyboard Utilities
 * Smart keyboard type detection and input mode optimization for mobile forms
 */

import { isTouchDevice } from './mobile-touch';

export interface KeyboardConfig {
  inputType: string;
  inputMode: string;
  autocomplete?: string;
  autocapitalize?: string;
  autocorrect?: string;
  spellcheck?: boolean;
  pattern?: string;
  enterkeyhint?: string;
}

export type ContextualKeyboardType = 
  | 'text'
  | 'email' 
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'numeric'
  | 'decimal'
  | 'name'
  | 'address'
  | 'credit-card'
  | 'date'
  | 'time';

/**
 * Get optimal keyboard configuration for different input contexts
 */
export function getKeyboardConfig(type: ContextualKeyboardType): KeyboardConfig {
  const configs: Record<ContextualKeyboardType, KeyboardConfig> = {
    text: {
      inputType: 'text',
      inputMode: 'text',
      autocapitalize: 'sentences',
      autocorrect: 'on',
      spellcheck: true
    },

    email: {
      inputType: 'email',
      inputMode: 'email',
      autocomplete: 'email',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      enterkeyhint: 'next'
    },

    password: {
      inputType: 'password',
      inputMode: 'text',
      autocomplete: 'current-password',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      enterkeyhint: 'done'
    },

    tel: {
      inputType: 'tel',
      inputMode: 'tel',
      autocomplete: 'tel',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      pattern: '[0-9\\s\\-\\(\\)\\+]*',
      enterkeyhint: 'done'
    },

    url: {
      inputType: 'url',
      inputMode: 'url',
      autocomplete: 'url',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      enterkeyhint: 'go'
    },

    search: {
      inputType: 'search',
      inputMode: 'search',
      autocapitalize: 'none',
      autocorrect: 'on',
      spellcheck: true,
      enterkeyhint: 'search'
    },

    numeric: {
      inputType: 'text',
      inputMode: 'numeric',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      pattern: '[0-9]*',
      enterkeyhint: 'done'
    },

    decimal: {
      inputType: 'text',
      inputMode: 'decimal',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      pattern: '[0-9]*\\.?[0-9]*',
      enterkeyhint: 'done'
    },

    name: {
      inputType: 'text',
      inputMode: 'text',
      autocomplete: 'name',
      autocapitalize: 'words',
      autocorrect: 'off',
      spellcheck: false,
      enterkeyhint: 'next'
    },

    address: {
      inputType: 'text',
      inputMode: 'text',
      autocomplete: 'street-address',
      autocapitalize: 'words',
      autocorrect: 'on',
      spellcheck: false,
      enterkeyhint: 'next'
    },

    'credit-card': {
      inputType: 'text',
      inputMode: 'numeric',
      autocomplete: 'cc-number',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      pattern: '[0-9\\s]*',
      enterkeyhint: 'done'
    },

    date: {
      inputType: 'date',
      inputMode: 'numeric',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      enterkeyhint: 'done'
    },

    time: {
      inputType: 'time',
      inputMode: 'numeric',
      autocapitalize: 'none',
      autocorrect: 'off',
      spellcheck: false,
      enterkeyhint: 'done'
    }
  };

  return configs[type];
}

/**
 * Convert keyboard config to HTML input attributes
 */
export function keyboardConfigToAttributes(config: KeyboardConfig): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {
    type: config.inputType,
    inputMode: config.inputMode
  };

  if (config.autocomplete) attributes.autoComplete = config.autocomplete;
  if (config.autocapitalize) attributes.autoCapitalize = config.autocapitalize;
  if (config.autocorrect) attributes.autoCorrect = config.autocorrect;
  if (config.spellcheck !== undefined) attributes.spellCheck = config.spellcheck;
  if (config.pattern) attributes.pattern = config.pattern;
  if (config.enterkeyhint) attributes.enterKeyHint = config.enterkeyhint;

  return attributes;
}

/**
 * Detect optimal keyboard type based on field name or content
 */
export function detectKeyboardType(fieldName: string, placeholder?: string, label?: string): ContextualKeyboardType {
  const text = `${fieldName} ${placeholder || ''} ${label || ''}`.toLowerCase();

  // Email detection
  if (text.includes('email') || text.includes('e-mail')) {
    return 'email';
  }

  // Phone detection
  if (text.includes('phone') || text.includes('tel') || text.includes('mobile') || text.includes('cell')) {
    return 'tel';
  }

  // Password detection
  if (text.includes('password') || text.includes('pass') || text.includes('pwd')) {
    return 'password';
  }

  // URL detection
  if (text.includes('url') || text.includes('website') || text.includes('link')) {
    return 'url';
  }

  // Search detection
  if (text.includes('search') || text.includes('find') || text.includes('query')) {
    return 'search';
  }

  // Name detection
  if (text.includes('name') || text.includes('first') || text.includes('last') || text.includes('full')) {
    return 'name';
  }

  // Address detection
  if (text.includes('address') || text.includes('street') || text.includes('city') || text.includes('zip') || text.includes('postal')) {
    return 'address';
  }

  // Numeric detection
  if (text.includes('number') || text.includes('age') || text.includes('year') || text.includes('quantity') || text.includes('amount')) {
    return 'numeric';
  }

  // Decimal detection
  if (text.includes('price') || text.includes('cost') || text.includes('rate') || text.includes('percent')) {
    return 'decimal';
  }

  // Credit card detection
  if (text.includes('card') || text.includes('credit') || text.includes('cc')) {
    return 'credit-card';
  }

  // Date detection
  if (text.includes('date') || text.includes('birthday') || text.includes('birth')) {
    return 'date';
  }

  // Time detection
  if (text.includes('time') || text.includes('hour') || text.includes('minute')) {
    return 'time';
  }

  return 'text';
}

/**
 * Enhanced input props for mobile optimization
 */
export function getMobileInputProps(
  keyboardType: ContextualKeyboardType,
  options: {
    fieldName?: string;
    required?: boolean;
    maxLength?: number;
    placeholder?: string;
    label?: string;
  } = {}
): Record<string, string | boolean | number | undefined> {
  const isTouch = isTouchDevice();
  const config = getKeyboardConfig(keyboardType);
  
  if (!isTouch) {
    // Return minimal config for desktop
    return {
      type: config.inputType,
      autoComplete: config.autocomplete,
      maxLength: options.maxLength,
      placeholder: options.placeholder
    };
  }

  const attributes = keyboardConfigToAttributes(config);
  
  return {
    ...attributes,
    maxLength: options.maxLength,
    placeholder: options.placeholder,
    // Add accessibility improvements for mobile
    'aria-label': options.label,
    'aria-required': options.required,
    // Mobile-specific improvements
    autoFocus: false, // Avoid auto-focus on mobile to prevent keyboard jumping
    tabIndex: 0
  };
}

/**
 * Smart form progression for mobile
 */
export class MobileFormProgressionManager {
  private formElement: HTMLFormElement;
  private currentFieldIndex: number = 0;
  private fields: HTMLInputElement[] = [];

  constructor(formElement: HTMLFormElement) {
    this.formElement = formElement;
    this.initializeFields();
    this.setupKeyboardNavigation();
  }

  private initializeFields() {
    this.fields = Array.from(
      this.formElement.querySelectorAll('input, textarea, select')
    ).filter(field => {
      if (field instanceof HTMLInputElement) {
        return !field.disabled && !field.readOnly && field.type !== 'hidden';
      }
      if (field instanceof HTMLTextAreaElement) {
        return !field.disabled && !field.readOnly;
      }
      if (field instanceof HTMLSelectElement) {
        return !field.disabled;
      }
      return false;
    }) as HTMLInputElement[];
  }

  private setupKeyboardNavigation() {
    if (!isTouchDevice()) return;

    this.fields.forEach((field, index) => {
      field.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.handleEnterKey(index);
        }
      });

      field.addEventListener('focus', () => {
        this.currentFieldIndex = index;
      });
    });
  }

  private handleEnterKey(fieldIndex: number) {
    const currentField = this.fields[fieldIndex];
    if (!currentField) return;
    
    const config = this.getFieldKeyboardConfig(currentField);

    switch (config.enterkeyhint) {
      case 'next':
        this.focusNextField();
        break;
      case 'done':
        this.handleFormSubmission();
        break;
      case 'search':
        this.handleSearch();
        break;
      case 'go':
        this.handleFormSubmission();
        break;
      default:
        this.focusNextField();
        break;
    }
  }

  private getFieldKeyboardConfig(field: HTMLInputElement): KeyboardConfig {
    const keyboardType = detectKeyboardType(
      field.name || field.id,
      field.placeholder,
      field.getAttribute('aria-label') || ''
    );
    return getKeyboardConfig(keyboardType);
  }

  public focusNextField() {
    const nextIndex = this.currentFieldIndex + 1;
    if (nextIndex < this.fields.length && this.fields[nextIndex]) {
      this.fields[nextIndex].focus();
    } else {
      this.handleFormSubmission();
    }
  }

  public focusPreviousField() {
    const prevIndex = this.currentFieldIndex - 1;
    if (prevIndex >= 0 && this.fields[prevIndex]) {
      this.fields[prevIndex].focus();
    }
  }

  private handleFormSubmission() {
    // Blur current field to hide keyboard
    const currentField = this.fields[this.currentFieldIndex];
    if (currentField) {
      currentField.blur();
    }

    // Trigger form submission
    const submitButton = this.formElement.querySelector('button[type="submit"], input[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
    } else {
      this.formElement.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }

  private handleSearch() {
    // Similar to form submission but for search contexts
    this.handleFormSubmission();
  }

  public getCurrentField(): HTMLInputElement | null {
    return this.fields[this.currentFieldIndex] || null;
  }

  public getFieldCount(): number {
    return this.fields.length;
  }

  public getCurrentFieldIndex(): number {
    return this.currentFieldIndex;
  }
}

/**
 * Utility to enhance existing forms with mobile keyboard optimization
 */
export function enhanceFormForMobile(formElement: HTMLFormElement): MobileFormProgressionManager {
  const inputs = formElement.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      const keyboardType = detectKeyboardType(
        input.name || input.id,
        input.placeholder,
        input.getAttribute('aria-label') || ''
      );
      
      const mobileProps = getMobileInputProps(keyboardType, {
        fieldName: input.name || input.id,
        required: input.required,
        maxLength: input.maxLength > 0 ? input.maxLength : undefined,
        placeholder: input.placeholder,
        label: input.getAttribute('aria-label') || ''
      });

      // Apply mobile optimization attributes
      Object.entries(mobileProps).forEach(([key, value]) => {
        if (key === 'type' && input instanceof HTMLInputElement && input.type !== 'hidden') {
          // Create a new input element with the correct type since type is readonly
          const newInput = document.createElement('input');
          newInput.type = value as string;
          
          // Copy all attributes except type
          Array.from(input.attributes).forEach(attr => {
            if (attr.name !== 'type') {
              newInput.setAttribute(attr.name, attr.value);
            }
          });
          
          // Replace the old input with the new one
          if (input.parentNode) {
            input.parentNode.replaceChild(newInput, input);
          }
        } else if (key.startsWith('aria-') || key === 'autoComplete' || key === 'inputMode') {
          input.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), String(value));
        }
      });
    }
  });

  return new MobileFormProgressionManager(formElement);
}

/**
 * Export common keyboard configurations for quick access
 */
export const CommonKeyboardConfigs = {
  email: () => getKeyboardConfig('email'),
  phone: () => getKeyboardConfig('tel'),
  password: () => getKeyboardConfig('password'),
  search: () => getKeyboardConfig('search'),
  numeric: () => getKeyboardConfig('numeric'),
  url: () => getKeyboardConfig('url'),
  name: () => getKeyboardConfig('name')
} as const;