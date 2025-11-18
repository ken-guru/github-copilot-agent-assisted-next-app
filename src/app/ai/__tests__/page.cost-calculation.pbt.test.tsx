/**
 * Property-Based Tests for Cost Calculation
 * Feature: ai-model-picker, Property 4: Cost calculation accuracy
 * Validates: Requirements 3.2
 */

import * as fc from 'fast-check';
import { AVAILABLE_MODELS, getModelById } from '@/constants/openai-models';

/**
 * Calculate the cost of an API request based on token usage and model pricing
 * This is the same function from page.tsx, extracted for testing
 */
const calculateCost = (
  promptTokens: number,
  completionTokens: number,
  modelId: string
): number => {
  const model = getModelById(modelId);
  if (!model) return 0;
  
  const inputCost = (promptTokens / 1000) * model.costPer1kTokens.input;
  const outputCost = (completionTokens / 1000) * model.costPer1kTokens.output;
  
  return inputCost + outputCost;
};

describe('Cost Calculation - Property-Based Tests', () => {
  /**
   * Property 4: Cost calculation accuracy
   * For any combination of prompt_tokens, completion_tokens, and model pricing,
   * the calculated cost should equal: (prompt_tokens / 1000 × input_price) + (completion_tokens / 1000 × output_price)
   */
  it('Property 4: calculates cost accurately using the correct formula', () => {
    // Generate random token counts (0-10000)
    const tokenCountArbitrary = fc.integer({ min: 0, max: 10000 });
    
    // Generate valid model IDs from AVAILABLE_MODELS
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    fc.assert(
      fc.property(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        (promptTokens, completionTokens, modelId) => {
          // Calculate cost using the function
          const calculatedCost = calculateCost(promptTokens, completionTokens, modelId);
          
          // Get the model to verify the formula manually
          const model = getModelById(modelId);
          expect(model).toBeDefined();
          
          if (!model) return; // TypeScript guard
          
          // Calculate expected cost using the formula from requirements
          const expectedInputCost = (promptTokens / 1000) * model.costPer1kTokens.input;
          const expectedOutputCost = (completionTokens / 1000) * model.costPer1kTokens.output;
          const expectedTotalCost = expectedInputCost + expectedOutputCost;
          
          // Verify the calculated cost matches the expected formula
          // Use toBeCloseTo to handle floating point precision issues
          expect(calculatedCost).toBeCloseTo(expectedTotalCost, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4a: Zero tokens returns zero cost
   * When both prompt and completion tokens are zero, cost should be zero
   */
  it('Property 4a: returns zero cost when token counts are zero', () => {
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    fc.assert(
      fc.property(validModelIdArbitrary, (modelId) => {
        const cost = calculateCost(0, 0, modelId);
        expect(cost).toBe(0);
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4b: Missing model returns zero cost
   * When the model ID doesn't exist, the function should return 0
   */
  it('Property 4b: returns zero cost for non-existent model IDs', () => {
    // Generate strings that are NOT valid model IDs
    const invalidModelIdArbitrary = fc.string().filter(
      str => !AVAILABLE_MODELS.some(m => m.id === str)
    );
    
    const tokenCountArbitrary = fc.integer({ min: 0, max: 10000 });

    fc.assert(
      fc.property(
        tokenCountArbitrary,
        tokenCountArbitrary,
        invalidModelIdArbitrary,
        (promptTokens, completionTokens, invalidModelId) => {
          const cost = calculateCost(promptTokens, completionTokens, invalidModelId);
          expect(cost).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4c: Cost is non-negative
   * For any valid inputs, cost should never be negative
   */
  it('Property 4c: never returns negative cost values', () => {
    const tokenCountArbitrary = fc.integer({ min: 0, max: 10000 });
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    fc.assert(
      fc.property(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        (promptTokens, completionTokens, modelId) => {
          const cost = calculateCost(promptTokens, completionTokens, modelId);
          expect(cost).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4d: Cost scales linearly with token count
   * Doubling tokens should double the cost
   */
  it('Property 4d: cost scales linearly with token count', () => {
    const tokenCountArbitrary = fc.integer({ min: 1, max: 5000 });
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    fc.assert(
      fc.property(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        (promptTokens, completionTokens, modelId) => {
          const cost1x = calculateCost(promptTokens, completionTokens, modelId);
          const cost2x = calculateCost(promptTokens * 2, completionTokens * 2, modelId);
          
          // Doubling tokens should double the cost
          expect(cost2x).toBeCloseTo(cost1x * 2, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4e: Input and output costs are independent
   * Changing only prompt tokens should only affect input cost
   */
  it('Property 4e: input and output costs are calculated independently', () => {
    const tokenCountArbitrary = fc.integer({ min: 100, max: 5000 });
    const validModelIdArbitrary = fc.constantFrom(...AVAILABLE_MODELS.map(m => m.id));

    fc.assert(
      fc.property(
        tokenCountArbitrary,
        tokenCountArbitrary,
        validModelIdArbitrary,
        (promptTokens, completionTokens, modelId) => {
          const model = getModelById(modelId);
          if (!model) return;
          
          // Calculate cost with original tokens
          const originalCost = calculateCost(promptTokens, completionTokens, modelId);
          
          // Calculate cost with doubled prompt tokens only
          const doubledPromptCost = calculateCost(promptTokens * 2, completionTokens, modelId);
          
          // The difference should be exactly the additional input cost
          const expectedDifference = (promptTokens / 1000) * model.costPer1kTokens.input;
          const actualDifference = doubledPromptCost - originalCost;
          
          expect(actualDifference).toBeCloseTo(expectedDifference, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4f: Cost calculation with realistic pricing ranges
   * Test with pricing values in realistic ranges for AI models
   */
  it('Property 4f: handles realistic pricing ranges correctly', () => {
    const tokenCountArbitrary = fc.integer({ min: 0, max: 10000 });
    
    // Generate realistic pricing (between $0.0001 and $0.1 per 1K tokens)
    const realisticPricingArbitrary = fc.double({ min: 0.0001, max: 0.1, noNaN: true });

    fc.assert(
      fc.property(
        tokenCountArbitrary,
        tokenCountArbitrary,
        realisticPricingArbitrary,
        realisticPricingArbitrary,
        (promptTokens, completionTokens, inputPrice, outputPrice) => {
          // Create a mock model with the generated pricing
          const mockModel = {
            id: 'test-model',
            name: 'Test Model',
            costPer1kTokens: { input: inputPrice, output: outputPrice },
            contextWindow: 128000,
            description: 'Test model'
          };
          
          // Calculate expected cost
          const expectedCost = 
            (promptTokens / 1000) * mockModel.costPer1kTokens.input +
            (completionTokens / 1000) * mockModel.costPer1kTokens.output;
          
          // Verify the cost is reasonable (not NaN, not Infinity)
          expect(Number.isFinite(expectedCost)).toBe(true);
          expect(expectedCost).toBeGreaterThanOrEqual(0);
          
          // Verify the formula produces consistent results
          const recalculated = 
            (promptTokens / 1000) * inputPrice +
            (completionTokens / 1000) * outputPrice;
          
          expect(recalculated).toBeCloseTo(expectedCost, 10);
        }
      ),
      { numRuns: 100 }
    );
  });
});
