/**
 * Property-Based Tests for Cost Display
 * Feature: ai-model-picker
 * Property 5: Cost display triggers toast - Validates: Requirements 3.3
 * Property 6: Cost formatting precision - Validates: Requirements 3.5
 * Property 7: Token usage extraction - Validates: Requirements 3.1
 */

import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import AIPlannerPage from '../page';
import { AVAILABLE_MODELS } from '@/constants/openai-models';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock network status hook
jest.mock('@/hooks/useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ online: true }),
}));

// Mock the toast context
const mockAddToast = jest.fn();
jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

// Mock the API key context to provide a key
jest.mock('@/contexts/ApiKeyContext', () => ({
  useApiKey: () => ({
    apiKey: 'sk-test-key-123',
    setApiKey: jest.fn(),
    clearApiKey: jest.fn(),
  }),
}));

// Mock the OpenAI client
const mockCallOpenAI = jest.fn();
jest.mock('@/utils/ai/byokClient', () => ({
  useOpenAIClient: () => ({
    callOpenAI: mockCallOpenAI,
  }),
}));

describe('Cost Display - Property-Based Tests', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockCallOpenAI.mockClear();
    mockAddToast.mockClear();
    
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

  /**
   * Property 5: Cost display triggers toast
   * For any successful AI request with usage data, a toast notification should appear displaying the calculated cost
   * Validates: Requirements 3.3
   */
  it('Property 5: successful request with usage data triggers cost toast', async () => {
    // Generate random token counts
    const tokenCountArbitrary = fc.integer({ min: 1, max: 10000 });
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        async (promptTokens, completionTokens, modelId) => {
          // Clear mocks for this iteration
          mockAddToast.mockClear();
          mockCallOpenAI.mockClear();
          Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
          
          // Set the selected model in localStorage
          localStorageMock['selected_ai_model'] = modelId;
          
          // Mock successful API response with usage data
          mockCallOpenAI.mockResolvedValueOnce({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    activities: [
                      { title: 'Test Activity', description: 'Test', duration: 30 }
                    ]
                  })
                }
              }
            ],
            usage: {
              prompt_tokens: promptTokens,
              completion_tokens: completionTokens,
              total_tokens: promptTokens + completionTokens
            }
          });
          
          // Render the component
          render(<AIPlannerPage />);
          
          // Wait for the component to be ready
          await waitFor(() => {
            const forms = screen.getAllByRole('form', { name: /ai planning form/i });
            expect(forms.length).toBeGreaterThan(0);
          });
          
          // Submit the form
          const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
          fireEvent.click(submitButton);
          
          // Wait for the addToast to be called with cost information
          await waitFor(() => {
            const costToastCall = mockAddToast.mock.calls.find(call => 
              call[0]?.message?.includes('Request cost:')
            );
            expect(costToastCall).toBeDefined();
          }, { timeout: 3000 });
          
          cleanup();
        }
      ),
      { numRuns: 20 } // Reduced runs for integration tests
    );
  });

  /**
   * Property 6: Cost formatting precision
   * For any calculated cost value, the displayed string should format the amount with exactly 4 decimal places
   * Validates: Requirements 3.5
   */
  it('Property 6: cost is formatted with exactly 4 decimal places', async () => {
    // Generate various cost values by controlling token counts
    const tokenCountArbitrary = fc.integer({ min: 1, max: 10000 });
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        async (promptTokens, completionTokens, modelId) => {
          // Clear mocks for this iteration
          mockAddToast.mockClear();
          mockCallOpenAI.mockClear();
          Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
          
          // Set the selected model in localStorage
          localStorageMock['selected_ai_model'] = modelId;
          
          // Mock successful API response
          mockCallOpenAI.mockResolvedValueOnce({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    activities: [
                      { title: 'Test Activity', description: 'Test', duration: 30 }
                    ]
                  })
                }
              }
            ],
            usage: {
              prompt_tokens: promptTokens,
              completion_tokens: completionTokens,
              total_tokens: promptTokens + completionTokens
            }
          });
          
          // Render the component
          render(<AIPlannerPage />);
          
          // Wait for the component to be ready
          await waitFor(() => {
            const forms = screen.getAllByRole('form', { name: /ai planning form/i });
            expect(forms.length).toBeGreaterThan(0);
          });
          
          // Submit the form
          const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
          fireEvent.click(submitButton);
          
          // Wait for the addToast to be called and verify format
          await waitFor(() => {
            const costToastCall = mockAddToast.mock.calls.find(call => 
              call[0]?.message?.includes('Request cost:')
            );
            expect(costToastCall).toBeDefined();
            
            if (costToastCall) {
              const message = costToastCall[0].message;
              // Extract the cost value from "Request cost: X.XXXX"
              const costMatch = message.match(/request cost:\s*(\d+\.\d+)/i);
              
              if (costMatch) {
                const costString = costMatch[1];
                const decimalPart = costString.split('.')[1];
                
                // Verify exactly 4 decimal places
                expect(decimalPart).toBeDefined();
                expect(decimalPart?.length).toBe(4);
              }
            }
          }, { timeout: 3000 });
          
          cleanup();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 7: Token usage extraction
   * For any OpenAI response containing a usage field, the system should successfully extract
   * prompt_tokens and completion_tokens without errors
   * Validates: Requirements 3.1
   */
  it('Property 7: successfully extracts token usage from response', async () => {
    const tokenCountArbitrary = fc.integer({ min: 0, max: 10000 });
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        async (promptTokens, completionTokens, modelId) => {
          // Clear mocks for this iteration
          mockAddToast.mockClear();
          mockCallOpenAI.mockClear();
          Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
          
          // Set the selected model in localStorage
          localStorageMock['selected_ai_model'] = modelId;
          
          // Mock response with usage field
          mockCallOpenAI.mockResolvedValueOnce({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    activities: [
                      { title: 'Test Activity', description: 'Test', duration: 30 }
                    ]
                  })
                }
              }
            ],
            usage: {
              prompt_tokens: promptTokens,
              completion_tokens: completionTokens,
              total_tokens: promptTokens + completionTokens
            }
          });
          
          // Render the component
          render(<AIPlannerPage />);
          
          // Wait for the component to be ready
          await waitFor(() => {
            const forms = screen.getAllByRole('form', { name: /ai planning form/i });
            expect(forms.length).toBeGreaterThan(0);
          });
          
          // Submit the form
          const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
          fireEvent.click(submitButton);
          
          // The test passes if no errors are thrown and the page doesn't crash
          // We verify this by checking that addToast was called (either cost or success)
          await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalled();
          }, { timeout: 3000 });
          
          cleanup();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 7a: Missing usage data doesn't crash or show cost toast
   * When the OpenAI response does not include usage data, the system should skip cost display without errors
   * Validates: Requirements 3.4
   */
  it('Property 7a: missing usage data does not crash or show cost toast', async () => {
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    await fc.assert(
      fc.asyncProperty(
        validModelIdArbitrary,
        async (modelId) => {
          // Clear mocks for this iteration
          mockAddToast.mockClear();
          mockCallOpenAI.mockClear();
          Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
          
          // Set the selected model in localStorage
          localStorageMock['selected_ai_model'] = modelId;
          
          // Mock response WITHOUT usage field
          mockCallOpenAI.mockResolvedValueOnce({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    activities: [
                      { title: 'Test Activity', description: 'Test', duration: 30 }
                    ]
                  })
                }
              }
            ]
            // No usage field
          });
          
          // Render the component
          render(<AIPlannerPage />);
          
          // Wait for the component to be ready
          await waitFor(() => {
            const forms = screen.getAllByRole('form', { name: /ai planning form/i });
            expect(forms.length).toBeGreaterThan(0);
          });
          
          // Submit the form
          const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
          fireEvent.click(submitButton);
          
          // Wait for success toast (activities replaced)
          await waitFor(() => {
            const successToastCall = mockAddToast.mock.calls.find(call => 
              call[0]?.message?.includes('Activities replaced')
            );
            expect(successToastCall).toBeDefined();
          }, { timeout: 3000 });
          
          // Verify NO cost toast was called
          const costToastCall = mockAddToast.mock.calls.find(call => 
            call[0]?.message?.includes('Request cost:')
          );
          expect(costToastCall).toBeUndefined();
          
          cleanup();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property 6a: Various cost values format correctly
   * Test that costs ranging from very small (0.0001) to larger (1.0000) all format with 4 decimal places
   */
  it('Property 6a: various cost values format correctly with 4 decimals', async () => {
    // Create specific token combinations that will produce costs in different ranges
    const testCases = [
      { promptTokens: 1, completionTokens: 1 },      // Very small cost
      { promptTokens: 100, completionTokens: 100 },  // Small cost
      { promptTokens: 1000, completionTokens: 1000 }, // Medium cost
      { promptTokens: 5000, completionTokens: 5000 }, // Larger cost
    ];

    for (const { promptTokens, completionTokens } of testCases) {
      // Clear mocks for this iteration
      mockAddToast.mockClear();
      mockCallOpenAI.mockClear();
      Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
      
      // Use the most expensive model to get higher costs
      const expensiveModel = AVAILABLE_MODELS.reduce((prev, curr) => 
        (curr.costPer1kTokens.input + curr.costPer1kTokens.output) > 
        (prev.costPer1kTokens.input + prev.costPer1kTokens.output) ? curr : prev
      );
      
      localStorageMock['selected_ai_model'] = expensiveModel.id;
      
      mockCallOpenAI.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                activities: [
                  { title: 'Test Activity', description: 'Test', duration: 30 }
                ]
              })
            }
          }
        ],
        usage: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens
        }
      });
      
      render(<AIPlannerPage />);
      
      await waitFor(() => {
        const forms = screen.getAllByRole('form', { name: /ai planning form/i });
        expect(forms.length).toBeGreaterThan(0);
      });
      
      const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const costToastCall = mockAddToast.mock.calls.find(call => 
          call[0]?.message?.includes('Request cost:')
        );
        expect(costToastCall).toBeDefined();
        
        if (costToastCall) {
          const message = costToastCall[0].message;
          const costMatch = message.match(/request cost:\s*(\d+\.\d+)/i);
          
          if (costMatch) {
            const costString = costMatch[1];
            const decimalPart = costString.split('.')[1];
            expect(decimalPart?.length).toBe(4);
          }
        }
      }, { timeout: 3000 });
      
      cleanup();
    }
  });

  /**
   * Property 5a: Cost toast has correct variant
   * The cost display toast should use 'info' variant as specified
   */
  it('Property 5a: cost toast uses info variant', async () => {
    // Clear mocks
    mockAddToast.mockClear();
    mockCallOpenAI.mockClear();
    Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
    
    mockCallOpenAI.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              activities: [
                { title: 'Test Activity', description: 'Test', duration: 30 }
              ]
            })
          }
        }
      ],
      usage: {
        prompt_tokens: 1000,
        completion_tokens: 500,
        total_tokens: 1500
      }
    });
    
    render(<AIPlannerPage />);
    
    await waitFor(() => {
      const forms = screen.getAllByRole('form', { name: /ai planning form/i });
      expect(forms.length).toBeGreaterThan(0);
    });
    
    const submitButton = screen.getByRole('button', { name: /generate ai plan/i });
    fireEvent.click(submitButton);
    
    // Wait for the toast to be called and verify variant
    await waitFor(() => {
      const costToastCall = mockAddToast.mock.calls.find(call => 
        call[0]?.message?.includes('Request cost:')
      );
      expect(costToastCall).toBeDefined();
      
      // Verify the variant is 'info'
      if (costToastCall) {
        expect(costToastCall[0].variant).toBe('info');
      }
    }, { timeout: 3000 });
  });
});
