// Unit tests for OpenAI model configuration
import {
  ModelInfo,
  AVAILABLE_MODELS,
  DEFAULT_MODEL_ID,
  getModelById
} from '../openai-models';

describe('OpenAI Models Configuration', () => {
  describe('AVAILABLE_MODELS array', () => {
    it('should have between 3 and 5 models', () => {
      expect(AVAILABLE_MODELS.length).toBeGreaterThanOrEqual(3);
      expect(AVAILABLE_MODELS.length).toBeLessThanOrEqual(5);
    });

    it('should have all required fields for each model', () => {
      AVAILABLE_MODELS.forEach((model) => {
        // Check that all required fields exist
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('name');
        expect(model).toHaveProperty('costPer1kTokens');
        expect(model).toHaveProperty('contextWindow');
        expect(model).toHaveProperty('description');

        // Check field types
        expect(typeof model.id).toBe('string');
        expect(typeof model.name).toBe('string');
        expect(typeof model.contextWindow).toBe('number');
        expect(typeof model.description).toBe('string');

        // Check costPer1kTokens structure
        expect(model.costPer1kTokens).toHaveProperty('input');
        expect(model.costPer1kTokens).toHaveProperty('output');
        expect(typeof model.costPer1kTokens.input).toBe('number');
        expect(typeof model.costPer1kTokens.output).toBe('number');

        // Check that values are positive
        expect(model.contextWindow).toBeGreaterThan(0);
        expect(model.costPer1kTokens.input).toBeGreaterThan(0);
        expect(model.costPer1kTokens.output).toBeGreaterThan(0);

        // Check that strings are non-empty
        expect(model.id.length).toBeGreaterThan(0);
        expect(model.name.length).toBeGreaterThan(0);
        expect(model.description.length).toBeGreaterThan(0);
      });
    });

    it('should have unique model IDs', () => {
      const ids = AVAILABLE_MODELS.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('DEFAULT_MODEL_ID', () => {
    it('should exist in AVAILABLE_MODELS', () => {
      const modelIds = AVAILABLE_MODELS.map(m => m.id);
      expect(modelIds).toContain(DEFAULT_MODEL_ID);
    });

    it('should be a non-empty string', () => {
      expect(typeof DEFAULT_MODEL_ID).toBe('string');
      expect(DEFAULT_MODEL_ID.length).toBeGreaterThan(0);
    });
  });

  describe('getModelById', () => {
    it('should return the correct model when given a valid ID', () => {
      AVAILABLE_MODELS.forEach((expectedModel) => {
        const result = getModelById(expectedModel.id);
        expect(result).toBeDefined();
        expect(result).toEqual(expectedModel);
      });
    });

    it('should return undefined when given an invalid ID', () => {
      const result = getModelById('non-existent-model-id');
      expect(result).toBeUndefined();
    });

    it('should return undefined when given an empty string', () => {
      const result = getModelById('');
      expect(result).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      // Assuming model IDs are lowercase
      const firstModel = AVAILABLE_MODELS[0];
      const uppercaseId = firstModel.id.toUpperCase();
      
      if (uppercaseId !== firstModel.id) {
        const result = getModelById(uppercaseId);
        expect(result).toBeUndefined();
      }
    });
  });

  describe('Property 3: Context window display matches selected model', () => {
    it('should have context window values that match the model configuration', () => {
      // For any selected model, the context window should match
      AVAILABLE_MODELS.forEach((model) => {
        const retrievedModel = getModelById(model.id);
        expect(retrievedModel).toBeDefined();
        expect(retrievedModel?.contextWindow).toBe(model.contextWindow);
      });
    });

    it('should maintain context window integrity across lookups', () => {
      // Multiple lookups of the same model should return the same context window
      const firstModel = AVAILABLE_MODELS[0];
      const lookup1 = getModelById(firstModel.id);
      const lookup2 = getModelById(firstModel.id);
      
      expect(lookup1?.contextWindow).toBe(lookup2?.contextWindow);
      expect(lookup1?.contextWindow).toBe(firstModel.contextWindow);
    });
  });

  describe('Model pricing validation', () => {
    it('should have realistic pricing values', () => {
      AVAILABLE_MODELS.forEach((model) => {
        // Input costs should be less than $1 per 1K tokens (sanity check)
        expect(model.costPer1kTokens.input).toBeLessThan(1);
        // Output costs should be less than $1 per 1K tokens (sanity check)
        expect(model.costPer1kTokens.output).toBeLessThan(1);
        // Output typically costs more than input
        expect(model.costPer1kTokens.output).toBeGreaterThanOrEqual(model.costPer1kTokens.input);
      });
    });
  });
});
