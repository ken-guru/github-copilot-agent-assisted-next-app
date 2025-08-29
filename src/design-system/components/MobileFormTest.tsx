/**
 * Mobile Form Components Test
 * Quick validation of mobile-optimized Input and TextArea components
 */

import React from 'react';
import Material3Input from '../components/Input';
import Material3TextArea from '../components/TextArea';
import { ValidationRules, validateField, ValidationRule } from '../utils/form-validation';
import { getKeyboardConfig } from '../utils/contextual-keyboard';

export default function MobileFormTest() {
  const [formData, setFormData] = React.useState({
    email: '',
    phone: '',
    message: ''
  });

  const [validation, setValidation] = React.useState({
    email: { isValid: true, errors: [], warnings: [] },
    phone: { isValid: true, errors: [], warnings: [] },
    message: { isValid: true, errors: [], warnings: [] }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate on change
    let rules: ValidationRule[];
    switch (field) {
      case 'email':
        rules = [ValidationRules.required(), ValidationRules.email()];
        break;
      case 'phone':
        rules = [ValidationRules.phone()];
        break;
      case 'message':
        rules = [ValidationRules.required(), ValidationRules.minLength(10)];
        break;
      default:
        rules = [];
    }
    
    const result = validateField(value, rules);
    setValidation(prev => ({ ...prev, [field]: result }));
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Mobile Form Test</h2>
      
      {/* Email Input */}
      <Material3Input
        label="Email Address"
        keyboardType="email"
        autocomplete="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={!validation.email.isValid}
        errorText={validation.email.errors[0]}
        mobileOptimized={true}
        touchFeedback={true}
        fullWidth
      />

      {/* Phone Input */}
      <Material3Input
        label="Phone Number"
        keyboardType="tel"
        autocomplete="tel"
        value={formData.phone}
        onChange={(e) => handleInputChange('phone', e.target.value)}
        error={!validation.phone.isValid}
        errorText={validation.phone.errors[0]}
        helperText="Enter your phone number"
        mobileOptimized={true}
        touchFeedback={true}
        fullWidth
      />

      {/* Message TextArea */}
      <Material3TextArea
        label="Message"
        value={formData.message}
        onChange={(e) => handleInputChange('message', e.target.value)}
        error={!validation.message.isValid}
        errorText={validation.message.errors[0]}
        helperText="Minimum 10 characters"
        minRows={4}
        maxRows={8}
        mobileOptimized={true}
        touchFeedback={true}
        autoResize={true}
        fullWidth
      />

      {/* Keyboard Configuration Display */}
      <div className="mt-8 p-4 bg-surface-container rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Keyboard Configurations</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Email:</strong> {JSON.stringify(getKeyboardConfig('email'), null, 2)}
          </div>
          <div>
            <strong>Phone:</strong> {JSON.stringify(getKeyboardConfig('tel'), null, 2)}
          </div>
        </div>
      </div>

      {/* Form Summary */}
      <div className="mt-6 p-4 bg-surface-container rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Form State</h3>
        <pre className="text-xs bg-surface-container-high p-2 rounded overflow-auto">
          {JSON.stringify({ formData, validation }, null, 2)}
        </pre>
      </div>
    </div>
  );
}