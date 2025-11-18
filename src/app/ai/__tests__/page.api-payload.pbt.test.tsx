/**
 * Property-Based Tests for API Payload Correctness
 * Feature: ai-model-picker, Property 2: Selected model used in API requests
 * Validates: Requirements 1.3
 */

import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import AIPlannerPage from '../page';
import { AVAILABLE_MODELS } from '@/constants/openai-models';

// Mock dependencies
const mockPush = jest.fn();
const mockAddToast = jest.fn();
const mockCallOpenAI = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

jest.mock('@/contexts/ApiKeyContext', () => ({
  useApiKey: () => ({
    apiKey: 'test-key-sk-1234567890',
    setApiKey: jest.fn(),
    clearApiKey: jest.fn(),
  }),
}));

jest.mock('@/utils/ai/byokClient', () => ({
  useOpenAIClient: () => ({
    callOpenAI: mockCallOpenAI,
  }),
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ online: true }),
}));

describe('API Payload Correctness - Property-Based Tests', () => {
  let localStorageMock: Record<string, string>;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Save original localStorage
    originalLocalStorage = global.localStorage;
    
    // Create a fresh localStorage mock for each test
    localStorageMock = {};
    
    // Mock window.localStorage
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

    // Reset mocks
    mockPush.mockClear();
    mockAddToast.mockClear();
    mockCallOpenAI.mockClear();
    
    // Mock successful API response
    mockCallOpenAI.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            activities: [
              { title: 'Test Activity', description: 'Test description', duration: 30 }
            ]
          })
        }
      }]
    });
  });

  afterEach(() => {
    cleanup();
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true
    });
  });

  /**
   * Property 2: Selected model used in API requests
   * For any model selection from AVAILABLE_MODELS, when an AI plan is generated,
   * the API payload should contain the selected model ID (not hardcoded 'gpt-4o-mini')
   */
  it('Property 2: uses selected model in API requests, not hardcoded gpt-4o-mini', async () => {
    // Generate arbitrary valid model IDs from AVAILABLE_MODELS
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(validModelIdArbitrary, async (modelId) => {
        // Clear localStorage and mocks before each iteration
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
        mockCallOpenAI.mockClear();
        
        // Set the selected model in localStorage
        localStorageMock['selected_ai_model'] = modelId;
        
        // Render the component
        const { unmount } = render(<AIPlannerPage />);
        
        // Wait for the component to be ready and load from localStorage
        await waitFor(() => {
          const forms = screen.queryAllByRole('form', { name: /ai planning form/i });
          expect(forms.length).toBeGreaterThan(0);
        }, { timeout: 3000 });
        
        // Wait for localStorage to be read
        await waitFor(() => {
          expect(global.localStorage.getItem).toHaveBeenCalledWith('selected_ai_model');
        }, { timeout: 3000 });
        
        // Find the form and submit button
        const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
        
        // Trigger AI plan generation
        fireEvent.click(submitButton);
        
        // Wait for the API call to be made
        await waitFor(() => {
          expect(mockCallOpenAI).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        // Verify the API was called with the correct model
        expect(mockCallOpenAI).toHaveBeenCalledTimes(1);
        const callArgs = mockCallOpenAI.mock.calls[0];
        expect(callArgs[0]).toBe('/v1/chat/completions');
        
        const payload = callArgs[1];
        expect(payload).toBeDefined();
        expect(payload.model).toBe(modelId);
        
        // Verify it's NOT the hardcoded 'gpt-4o-mini' when a different model is selected
        if (modelId !== 'gpt-4o-mini') {
          expect(payload.model).not.toBe('gpt-4o-mini');
        }
        
        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2b: API payload structure is correct for all models
   * For any model selection, the payload should have the correct structure
   */
  it('Property 2b: maintains correct API payload structure for all model selections', async () => {
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(validModelIdArbitrary, async (modelId) => {
        // Clear localStorage and mocks before each iteration
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
        mockCallOpenAI.mockClear();
        
        // Set the selected model in localStorage
        localStorageMock['selected_ai_model'] = modelId;
        
        // Render the component
        const { unmount } = render(<AIPlannerPage />);
        
        // Wait for the component to be ready
        await waitFor(() => {
          const forms = screen.queryAllByRole('form', { name: /ai planning form/i });
          expect(forms.length).toBeGreaterThan(0);
        }, { timeout: 3000 });
        
        // Wait for localStorage to be read
        await waitFor(() => {
          expect(global.localStorage.getItem).toHaveBeenCalledWith('selected_ai_model');
        }, { timeout: 3000 });
        
        // Find and click the submit button
        const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
        fireEvent.click(submitButton);
        
        // Wait for the API call
        await waitFor(() => {
          expect(mockCallOpenAI).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        // Verify payload structure
        const payload = mockCallOpenAI.mock.calls[0][1];
        
        // Check all required fields are present
        expect(payload).toHaveProperty('model');
        expect(payload).toHaveProperty('messages');
        expect(payload).toHaveProperty('response_format');
        
        // Verify model matches selection
        expect(payload.model).toBe(modelId);
        
        // Verify messages structure
        expect(Array.isArray(payload.messages)).toBe(true);
        expect(payload.messages.length).toBeGreaterThan(0);
        
        // Verify response_format
        expect(payload.response_format).toEqual({ type: 'json_object' });
        
        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2c: Model selection persists across multiple API calls
   * For any model selection, multiple API calls should use the same model
   */
  it('Property 2c: consistently uses selected model across multiple API calls', async () => {
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(validModelIdArbitrary, async (modelId) => {
        // Clear localStorage and mocks before each iteration
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
        mockCallOpenAI.mockClear();
        
        // Set the selected model in localStorage
        localStorageMock['selected_ai_model'] = modelId;
        
        // Render the component
        const { unmount } = render(<AIPlannerPage />);
        
        // Wait for the component to be ready
        await waitFor(() => {
          const forms = screen.queryAllByRole('form', { name: /ai planning form/i });
          expect(forms.length).toBeGreaterThan(0);
        }, { timeout: 3000 });
        
        // Wait for localStorage to be read
        await waitFor(() => {
          expect(global.localStorage.getItem).toHaveBeenCalledWith('selected_ai_model');
        }, { timeout: 3000 });
        
        // Make first API call
        const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
          expect(mockCallOpenAI).toHaveBeenCalledTimes(1);
        }, { timeout: 3000 });
        
        const firstCallPayload = mockCallOpenAI.mock.calls[0][1];
        expect(firstCallPayload.model).toBe(modelId);
        
        // Make second API call (after first completes)
        await waitFor(() => {
          const button = screen.getByRole('button', { name: /generate ai plan/i });
          expect(button).not.toBeDisabled();
        }, { timeout: 3000 });
        
        fireEvent.click(submitButton);
        
        await waitFor(() => {
          expect(mockCallOpenAI).toHaveBeenCalledTimes(2);
        }, { timeout: 3000 });
        
        const secondCallPayload = mockCallOpenAI.mock.calls[1][1];
        expect(secondCallPayload.model).toBe(modelId);
        
        // Both calls should use the same model
        expect(firstCallPayload.model).toBe(secondCallPayload.model);
        
        // Clean up
        unmount();
      }),
      { numRuns: 50 } // Fewer runs since we're making multiple API calls per iteration
    );
  });
});
