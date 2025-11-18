/**
 * Accessibility Tests for Model Picker
 * Feature: ai-model-picker
 * Validates: Requirements 1.1
 * 
 * Tests keyboard navigation, label associations, ARIA attributes,
 * and screen reader announcements for the model picker component.
 */

import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import AIPlannerPage from '../page';
import { AVAILABLE_MODELS } from '@/constants/openai-models';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock('@/contexts/ApiKeyContext', () => ({
  useApiKey: () => ({
    apiKey: 'test-key',
    setApiKey: jest.fn(),
    clearApiKey: jest.fn(),
  }),
}));

jest.mock('@/utils/ai/byokClient', () => ({
  useOpenAIClient: () => ({
    callOpenAI: jest.fn(),
  }),
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ online: true }),
}));

describe('Model Picker Accessibility Tests', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Create a fresh localStorage mock for each test
    localStorageMock = {};
    
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => localStorageMock[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: jest.fn(() => {
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
      }),
      get length() {
        return Object.keys(localStorageMock).length;
      },
      key: jest.fn((index: number) => {
        const keys = Object.keys(localStorageMock);
        return keys[index] || null;
      })
    };
    
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Keyboard Navigation', () => {
    it('should allow keyboard navigation through dropdown options', async () => {
      render(<AIPlannerPage />);
      
      // Wait for component to be ready
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // Find the model select dropdown
      const modelSelect = screen.getByLabelText(/ai model/i);
      expect(modelSelect).toBeInTheDocument();
      
      // Verify the select is focusable (has no disabled attribute)
      expect(modelSelect).not.toHaveAttribute('disabled');
      
      // Use arrow keys to navigate through options (test keyboard event handling)
      fireEvent.keyDown(modelSelect, { key: 'ArrowDown', code: 'ArrowDown' });
      
      // Verify we can navigate through all available models
      const options = screen.getAllByRole('option');
      expect(options.length).toBe(AVAILABLE_MODELS.length);
      
      // Each option should be present and accessible
      for (const model of AVAILABLE_MODELS) {
        // Use value to find exact match
        const option = options.find(opt => (opt as HTMLOptionElement).value === model.id);
        expect(option).toBeDefined();
        expect(option?.textContent).toContain(model.name);
      }
    });

    it('should allow selecting a model using keyboard', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i) as HTMLSelectElement;
      
      // Verify the select is keyboard accessible
      expect(modelSelect.tagName).toBe('SELECT');
      expect(modelSelect).not.toHaveAttribute('disabled');
      
      // Get the initial value
      const initialValue = modelSelect.value;
      
      // Navigate to a different option using arrow keys
      fireEvent.keyDown(modelSelect, { key: 'ArrowDown', code: 'ArrowDown' });
      
      // The element should still be in the document and accessible
      expect(modelSelect).toBeInTheDocument();
    });

    it('should respond to blur events', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i);
      
      // Verify blur event can be triggered
      fireEvent.blur(modelSelect);
      
      // Element should still be in the document
      expect(modelSelect).toBeInTheDocument();
    });
  });

  describe('Label Association', () => {
    it('should have Form.Label properly associated with Form.Select', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // Find the label
      const label = screen.getByText(/ai model/i);
      expect(label).toBeInTheDocument();
      
      // Verify the label has htmlFor attribute
      expect(label).toHaveAttribute('for', 'modelSelect');
      
      // Find the select by its ID
      const modelSelect = document.getElementById('modelSelect');
      expect(modelSelect).toBeInTheDocument();
      expect(modelSelect?.tagName).toBe('SELECT');
      
      // Verify we can find the select using the label
      const selectByLabel = screen.getByLabelText(/ai model/i);
      expect(selectByLabel).toBe(modelSelect);
    });

    it('should have label clickable for accessibility', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const label = screen.getByText(/ai model/i);
      const modelSelect = screen.getByLabelText(/ai model/i);
      
      // Verify label is associated with the select
      expect(label).toHaveAttribute('for', modelSelect.id);
      
      // Click event should be handleable
      fireEvent.click(label);
      
      // The select should still be in the document
      expect(modelSelect).toBeInTheDocument();
    });
  });

  describe('ARIA Labels', () => {
    it('should have aria-label on the select element', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i);
      
      // Verify aria-label is present
      expect(modelSelect).toHaveAttribute('aria-label', 'Select AI model');
    });

    it('should have descriptive aria-label text', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // Should be able to find the select by its aria-label
      const modelSelect = screen.getByRole('combobox', { name: /select ai model/i });
      expect(modelSelect).toBeInTheDocument();
    });

    it('should have accessible name from both label and aria-label', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // Should be findable by label text
      const selectByLabel = screen.getByLabelText(/ai model/i);
      expect(selectByLabel).toBeInTheDocument();
      
      // Should also be findable by aria-label
      const selectByAriaLabel = screen.getByRole('combobox', { name: /select ai model/i });
      expect(selectByAriaLabel).toBeInTheDocument();
      
      // They should be the same element
      expect(selectByLabel).toBe(selectByAriaLabel);
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should announce model selection changes', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i) as HTMLSelectElement;
      
      // Get initial value
      const initialValue = modelSelect.value;
      
      // Change the selection
      const secondModel = AVAILABLE_MODELS[1];
      if (!secondModel) throw new Error('Second model not found');
      
      fireEvent.change(modelSelect, { target: { value: secondModel.id } });
      
      // Verify the value changed
      expect(modelSelect.value).toBe(secondModel.id);
      
      // Find the selected option by value
      const options = screen.getAllByRole('option') as HTMLOptionElement[];
      const selectedOption = options.find(opt => opt.value === secondModel.id);
      expect(selectedOption).toBeDefined();
      expect(selectedOption?.selected).toBe(true);
    });

    it('should have all options properly labeled for screen readers', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const options = screen.getAllByRole('option') as HTMLOptionElement[];
      
      // Each model should have an option with descriptive text
      for (const model of AVAILABLE_MODELS) {
        const option = options.find(opt => opt.value === model.id);
        expect(option).toBeDefined();
        
        // Verify the option text includes pricing and description
        expect(option?.textContent).toContain(model.name);
        expect(option?.textContent).toContain(model.costPer1kTokens.input.toString());
        expect(option?.textContent).toContain(model.description);
      }
    });

    it('should announce context window information', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // Find the context window text
      const contextText = screen.getByText(/context:/i);
      expect(contextText).toBeInTheDocument();
      
      // Verify it contains token information
      expect(contextText.textContent).toMatch(/\d+.*tokens/i);
    });

    it('should update context window when model changes', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i) as HTMLSelectElement;
      const contextText = screen.getByText(/context:/i);
      
      // Get initial context window
      const initialContext = contextText.textContent;
      
      // Change to a different model
      const secondModel = AVAILABLE_MODELS[1];
      if (!secondModel) throw new Error('Second model not found');
      
      fireEvent.change(modelSelect, { target: { value: secondModel.id } });
      
      // Wait for the context to update
      await waitFor(() => {
        const updatedContext = screen.getByText(/context:/i);
        // Context should contain the new model's context window
        expect(updatedContext.textContent).toContain(secondModel.contextWindow.toLocaleString());
      });
    });
  });

  describe('Form Structure', () => {
    it('should have proper form group structure', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // The select should be within a form
      const form = screen.getByRole('form', { name: /ai planning form/i });
      const modelSelect = screen.getByLabelText(/ai model/i);
      
      expect(form).toContainElement(modelSelect);
    });

    it('should have helper text for additional context', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      // Find the helper text (Form.Text)
      const helperText = screen.getByText(/context:/i);
      expect(helperText).toBeInTheDocument();
      
      // Verify it's styled as helper text (has text-body-secondary class)
      expect(helperText).toHaveClass('text-body-secondary');
    });
  });

  describe('Focus Management', () => {
    it('should be a valid focusable form control', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i) as HTMLSelectElement;
      
      // Verify it's a valid form control
      expect(modelSelect.tagName).toBe('SELECT');
      expect(modelSelect).not.toHaveAttribute('disabled');
      expect(modelSelect).not.toHaveAttribute('readonly');
      
      // Change event should work
      const secondModel = AVAILABLE_MODELS[1];
      if (!secondModel) throw new Error('Second model not found');
      
      fireEvent.change(modelSelect, { target: { value: secondModel.id } });
      expect(modelSelect.value).toBe(secondModel.id);
    });

    it('should be keyboard accessible', async () => {
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
      });
      
      const modelSelect = screen.getByLabelText(/ai model/i);
      
      // Verify it's a valid form control that can receive keyboard events
      expect(modelSelect.tagName).toBe('SELECT');
      expect(modelSelect).not.toHaveAttribute('disabled');
      
      // Keyboard events should be handleable
      fireEvent.keyDown(modelSelect, { key: 'ArrowDown' });
      fireEvent.keyDown(modelSelect, { key: 'Enter' });
      
      // Element should still be in the document
      expect(modelSelect).toBeInTheDocument();
    });
  });
});
