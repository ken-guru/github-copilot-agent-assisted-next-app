/**
 * Integration Tests for AI Model Picker End-to-End Flow
 * Tests the complete user journey from page load to model selection to API calls
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */

import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import AIPlannerPage from '../page';
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from '@/constants/openai-models';

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
    apiKey: 'test-api-key-12345',
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

describe('AI Model Picker - Integration Tests', () => {
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

    // Reset all mocks
    mockPush.mockClear();
    mockAddToast.mockClear();
    mockCallOpenAI.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Test 1: Load page with no stored model → Verify default selected
   * Validates: Requirements 1.1, 1.5
   */
  it('should load page with default model when no model is stored', async () => {
    // Ensure localStorage is empty
    expect(localStorageMock['selected_ai_model']).toBeUndefined();

    // Render the page
    render(<AIPlannerPage />);

    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Find the model select dropdown
    const modelSelect = screen.getByLabelText(/select ai model/i);
    expect(modelSelect).toBeInTheDocument();

    // Verify default model is selected
    expect(modelSelect).toHaveValue(DEFAULT_MODEL_ID);

    // Verify the default model info is displayed
    const defaultModel = AVAILABLE_MODELS.find(m => m.id === DEFAULT_MODEL_ID);
    expect(defaultModel).toBeDefined();
    
    // Check that context window is displayed
    const contextText = screen.getByText(new RegExp(`Context: ${defaultModel!.contextWindow.toLocaleString()} tokens`, 'i'));
    expect(contextText).toBeInTheDocument();
  });

  /**
   * Test 2: Select different model → Verify dropdown updates and localStorage saves
   * Validates: Requirements 1.1, 1.2
   */
  it('should update dropdown and save to localStorage when user selects a different model', async () => {
    // Render the page
    render(<AIPlannerPage />);

    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Find the model select dropdown
    const modelSelect = screen.getByLabelText(/select ai model/i) as HTMLSelectElement;

    // Select a different model (not the default)
    const differentModel = AVAILABLE_MODELS.find(m => m.id !== DEFAULT_MODEL_ID);
    expect(differentModel).toBeDefined();

    fireEvent.change(modelSelect, { target: { value: differentModel!.id } });

    // Verify the dropdown value updated
    expect(modelSelect.value).toBe(differentModel!.id);

    // Verify localStorage was updated
    await waitFor(() => {
      expect(localStorageMock['selected_ai_model']).toBe(differentModel!.id);
    });

    // Verify the context window updated
    const contextText = screen.getByText(new RegExp(`Context: ${differentModel!.contextWindow.toLocaleString()} tokens`, 'i'));
    expect(contextText).toBeInTheDocument();
  });

  /**
   * Test 3: Generate AI plan → Verify correct model in API call
   * Validates: Requirements 1.3
   */
  it('should use selected model in API request when generating AI plan', async () => {
    // Mock successful API response
    mockCallOpenAI.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            activities: [
              { title: 'Study React', description: 'Learn hooks', duration: 30 },
              { title: 'Break', description: 'Rest', duration: 10 }
            ]
          })
        }
      }],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150
      }
    });

    // Render the page
    render(<AIPlannerPage />);

    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Select a specific model
    const testModel = AVAILABLE_MODELS[1]; // Use second model
    const modelSelect = screen.getByLabelText(/select ai model/i);
    fireEvent.change(modelSelect, { target: { value: testModel.id } });

    // Find and fill the prompt textarea
    const promptTextarea = screen.getByLabelText(/describe your session/i);
    fireEvent.change(promptTextarea, { target: { value: 'Test prompt for AI planning' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(submitButton);

    // Wait for API call to complete
    await waitFor(() => {
      expect(mockCallOpenAI).toHaveBeenCalled();
    });

    // Verify the API was called with the correct model
    expect(mockCallOpenAI).toHaveBeenCalledWith(
      '/v1/chat/completions',
      expect.objectContaining({
        model: testModel.id
      })
    );

    // Verify the model in the payload is NOT the hardcoded default
    const callArgs = mockCallOpenAI.mock.calls[0];
    const payload = callArgs[1];
    expect(payload.model).toBe(testModel.id);
    expect(payload.model).not.toBe('gpt-4o-mini'); // Ensure not hardcoded
  });

  /**
   * Test 4: Reload page → Verify selection persisted
   * Validates: Requirements 1.4
   */
  it('should restore previously selected model after page reload', async () => {
    // First render: Select a model
    const selectedModel = AVAILABLE_MODELS[2]; // Use third model
    localStorageMock['selected_ai_model'] = selectedModel.id;

    // Render the page (simulating page load)
    const { unmount } = render(<AIPlannerPage />);

    // Wait for the component to be ready
    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Wait for localStorage to be read
    await waitFor(() => {
      expect(global.localStorage.getItem).toHaveBeenCalledWith('selected_ai_model');
    });

    // Verify the model select has the correct value
    const modelSelect = screen.getByLabelText(/select ai model/i);
    await waitFor(() => {
      expect(modelSelect).toHaveValue(selectedModel.id);
    });

    // Verify the context window matches the selected model
    const contextText = screen.getByText(new RegExp(`Context: ${selectedModel.contextWindow.toLocaleString()} tokens`, 'i'));
    expect(contextText).toBeInTheDocument();

    // Unmount and remount to simulate page reload
    unmount();
    cleanup();

    // Second render: Verify persistence
    render(<AIPlannerPage />);

    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Verify the model is still selected after "reload"
    const modelSelectAfterReload = screen.getByLabelText(/select ai model/i);
    await waitFor(() => {
      expect(modelSelectAfterReload).toHaveValue(selectedModel.id);
    });
  });

  /**
   * Test 5: Cost display flow with mocked response
   * Validates: Requirements 3.1, 3.3, 3.4, 3.5
   */
  it('should display cost after successful API request with usage data', async () => {
    // Select a model with known pricing
    const testModel = AVAILABLE_MODELS.find(m => m.id === 'gpt-4o-mini');
    expect(testModel).toBeDefined();

    // Mock API response with usage data
    const mockUsage = {
      prompt_tokens: 1000,
      completion_tokens: 500,
      total_tokens: 1500
    };

    mockCallOpenAI.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            activities: [
              { title: 'Study', description: 'Learn', duration: 30 }
            ]
          })
        }
      }],
      usage: mockUsage
    });

    // Render the page
    render(<AIPlannerPage />);

    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Ensure the test model is selected
    const modelSelect = screen.getByLabelText(/select ai model/i);
    fireEvent.change(modelSelect, { target: { value: testModel!.id } });

    // Submit the form
    const promptTextarea = screen.getByLabelText(/describe your session/i);
    fireEvent.change(promptTextarea, { target: { value: 'Test prompt' } });

    const submitButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(submitButton);

    // Wait for API call and cost calculation
    await waitFor(() => {
      expect(mockCallOpenAI).toHaveBeenCalled();
    });

    // Calculate expected cost
    const expectedCost = 
      (mockUsage.prompt_tokens / 1000) * testModel!.costPer1kTokens.input +
      (mockUsage.completion_tokens / 1000) * testModel!.costPer1kTokens.output;

    // Verify cost toast was displayed with correct format (4 decimal places)
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `Request cost: $${expectedCost.toFixed(4)}`,
          variant: 'info'
        })
      );
    });
  });

  /**
   * Test 6: Cost display handles missing usage data gracefully
   * Validates: Requirements 3.4
   */
  it('should not crash or show cost when usage data is missing', async () => {
    // Mock API response WITHOUT usage data
    mockCallOpenAI.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            activities: [
              { title: 'Study', description: 'Learn', duration: 30 }
            ]
          })
        }
      }]
      // No usage field
    });

    // Render the page
    render(<AIPlannerPage />);

    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Submit the form
    const promptTextarea = screen.getByLabelText(/describe your session/i);
    fireEvent.change(promptTextarea, { target: { value: 'Test prompt' } });

    const submitButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(submitButton);

    // Wait for API call
    await waitFor(() => {
      expect(mockCallOpenAI).toHaveBeenCalled();
    });

    // Verify no cost toast was shown (only success toast)
    await waitFor(() => {
      const costToastCalls = mockAddToast.mock.calls.filter(
        call => call[0].message.includes('Request cost')
      );
      expect(costToastCalls.length).toBe(0);
    });

    // Verify the page didn't crash - success toast should be shown
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Activities replaced'),
          variant: 'success'
        })
      );
    });
  });

  /**
   * Test 7: Complete end-to-end flow
   * Validates: Requirements 1.1, 1.2, 1.3, 1.4
   */
  it('should complete full user journey: load → select → generate → reload', async () => {
    // Mock successful API response
    mockCallOpenAI.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            activities: [
              { title: 'Study', description: 'Learn', duration: 30 }
            ]
          })
        }
      }],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150
      }
    });

    // Step 1: Load page with no stored model
    const { unmount } = render(<AIPlannerPage />);

    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Verify default model is selected
    let modelSelect = screen.getByLabelText(/select ai model/i);
    expect(modelSelect).toHaveValue(DEFAULT_MODEL_ID);

    // Step 2: Select a different model
    const selectedModel = AVAILABLE_MODELS.find(m => m.id !== DEFAULT_MODEL_ID);
    expect(selectedModel).toBeDefined();

    fireEvent.change(modelSelect, { target: { value: selectedModel!.id } });

    // Verify localStorage was updated
    await waitFor(() => {
      expect(localStorageMock['selected_ai_model']).toBe(selectedModel!.id);
    });

    // Step 3: Generate AI plan with selected model
    const promptTextarea = screen.getByLabelText(/describe your session/i);
    fireEvent.change(promptTextarea, { target: { value: 'Complete flow test' } });

    const submitButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(submitButton);

    // Verify API was called with correct model
    await waitFor(() => {
      expect(mockCallOpenAI).toHaveBeenCalledWith(
        '/v1/chat/completions',
        expect.objectContaining({
          model: selectedModel!.id
        })
      );
    });

    // Step 4: Simulate page reload
    unmount();
    cleanup();

    // Clear mocks but keep localStorage
    mockCallOpenAI.mockClear();
    mockAddToast.mockClear();

    // Render again (simulating reload)
    render(<AIPlannerPage />);

    await waitFor(() => {
      expect(screen.getByRole('form', { name: /ai planning form/i })).toBeInTheDocument();
    });

    // Verify the model selection persisted
    modelSelect = screen.getByLabelText(/select ai model/i);
    await waitFor(() => {
      expect(modelSelect).toHaveValue(selectedModel!.id);
    });

    // Verify we can still generate with the persisted model
    mockCallOpenAI.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            activities: [
              { title: 'Study 2', description: 'Learn more', duration: 30 }
            ]
          })
        }
      }]
    });

    const promptTextareaAfterReload = screen.getByLabelText(/describe your session/i);
    fireEvent.change(promptTextareaAfterReload, { target: { value: 'After reload test' } });

    const submitButtonAfterReload = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(submitButtonAfterReload);

    // Verify API still uses the persisted model
    await waitFor(() => {
      expect(mockCallOpenAI).toHaveBeenCalledWith(
        '/v1/chat/completions',
        expect.objectContaining({
          model: selectedModel!.id
        })
      );
    });
  });
});
