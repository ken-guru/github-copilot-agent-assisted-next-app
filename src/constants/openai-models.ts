export interface ModelInfo {
  id: string;                    // OpenAI model identifier
  name: string;                  // Display name
  costPer1kTokens: {
    input: number;               // Cost per 1K input tokens (USD)
    output: number;              // Cost per 1K output tokens (USD)
  };
  contextWindow: number;         // Maximum tokens
  description: string;           // Brief description for dropdown
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    costPer1kTokens: { input: 0.00015, output: 0.0006 },
    contextWindow: 128000,
    description: 'Fast and affordable - best for simple tasks'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    costPer1kTokens: { input: 0.0025, output: 0.01 },
    contextWindow: 128000,
    description: 'Balanced performance and cost'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    costPer1kTokens: { input: 0.01, output: 0.03 },
    contextWindow: 128000,
    description: 'Highest quality for complex planning'
  }
];

export const DEFAULT_MODEL_ID = 'gpt-4o-mini';

/**
 * Helper function to get a model by its ID
 * @param id - The model ID to search for
 * @returns The ModelInfo object if found, undefined otherwise
 */
export function getModelById(id: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}
