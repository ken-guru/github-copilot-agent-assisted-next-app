# Implementation Plan

- [x] 1. Create model configuration constants file
  - Create `src/constants/openai-models.ts` with ModelInfo interface
  - Define AVAILABLE_MODELS array with 3-5 OpenAI models (gpt-4o-mini, gpt-4o, gpt-4-turbo)
  - Include current pricing: gpt-4o-mini ($0.00015/$0.0006), gpt-4o ($0.0025/$0.01), gpt-4-turbo ($0.01/$0.03)
  - Export DEFAULT_MODEL_ID constant ('gpt-4o-mini')
  - Export getModelById helper function
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 1.1 Write unit tests for model configuration
  - **Property 3: Context window display matches selected model**
  - **Validates: Requirements 2.3**
  - Test AVAILABLE_MODELS has 3-5 entries
  - Test each model has required fields (id, name, costPer1kTokens, contextWindow, description)
  - Test DEFAULT_MODEL_ID exists in AVAILABLE_MODELS
  - Test getModelById returns correct model or undefined
  - _Requirements: 4.3_

- [x] 2. Add model selection state management to AI page
  - Import AVAILABLE_MODELS, DEFAULT_MODEL_ID, getModelById from constants
  - Add selectedModelId state with useState (default: DEFAULT_MODEL_ID)
  - Add useEffect to load model from localStorage on mount (after ready check)
  - Validate loaded model ID exists in AVAILABLE_MODELS, fallback to default if invalid
  - Add handleModelChange function to update state and save to localStorage
  - Wrap localStorage operations in try-catch for graceful error handling
  - _Requirements: 1.2, 1.4, 1.5_

- [x] 2.1 Write property test for model selection persistence
  - **Property 1: Model selection persistence round-trip**
  - **Validates: Requirements 1.2, 1.4**
  - Generate random valid model IDs from AVAILABLE_MODELS
  - Test save to localStorage, component remount, verify same model selected
  - Test invalid stored ID falls back to DEFAULT_MODEL_ID
  - Test localStorage unavailable doesn't crash (graceful degradation)
  - _Requirements: 1.2, 1.4, 1.5_

- [x] 3. Add model picker UI component
  - Add Form.Group after API key confirmation message (Alert variant="info"), before prompt textarea
  - Add Form.Label with htmlFor="modelSelect" and text "AI Model"
  - Add Form.Select with id, value, onChange, and aria-label
  - Map AVAILABLE_MODELS to option elements with key, value, and display text
  - Display text format: "{name} - ${input_cost}/1K tokens - {description}"
  - Add Form.Text below dropdown showing context window: "Context: {contextWindow} tokens"
  - Use currentModel = getModelById(selectedModelId) || AVAILABLE_MODELS[0]
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_

- [x] 3.1 Write accessibility tests for model picker
  - Test keyboard navigation through dropdown
  - Test Form.Label properly associated with Form.Select
  - Test ARIA labels present and descriptive
  - Test screen reader announces model selection changes
  - _Requirements: 1.1_

- [x] 4. Replace hardcoded model with selected model in API request
  - In handlePlan function, locate the payload object (around line 90)
  - Replace hardcoded 'gpt-4o-mini' with selectedModelId variable
  - Verify payload structure: { model: selectedModelId, messages: [...], response_format: {...} }
  - _Requirements: 1.3_

- [x] 4.1 Write property test for API payload correctness
  - **Property 2: Selected model used in API requests**
  - **Validates: Requirements 1.3**
  - Generate random model selections from AVAILABLE_MODELS
  - Mock callOpenAI function
  - Trigger AI plan generation
  - Verify payload.model matches selected model (not hardcoded 'gpt-4o-mini')
  - _Requirements: 1.3_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Add cost calculation function
  - Create calculateCost function accepting promptTokens, completionTokens, modelId
  - Get model using getModelById, return 0 if not found
  - Calculate: (promptTokens / 1000 × input_price) + (completionTokens / 1000 × output_price)
  - Return cost as number
  - Add function inside AIPlannerPage component or as a separate utility
  - _Requirements: 3.2_

- [x] 6.1 Write property test for cost calculation
  - **Property 4: Cost calculation accuracy**
  - **Validates: Requirements 3.2**
  - Generate random token counts (0-10000)
  - Generate random pricing values (realistic ranges)
  - Verify formula: (prompt_tokens / 1000 × input_price) + (completion_tokens / 1000 × output_price)
  - Test with zero tokens returns 0
  - Test with missing model returns 0
  - _Requirements: 3.2_

- [x] 7. Add cost display after API response
  - In handlePlan, after successful callOpenAI response (after line 95 where data is assigned)
  - Check if response.usage exists
  - Extract prompt_tokens and completion_tokens from response.usage
  - Call calculateCost with tokens and selectedModelId
  - Display cost in info toast: `Request cost: $${cost.toFixed(4)}`
  - If no usage data, skip cost display (no error)
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 7.1 Write property tests for cost display
  - **Property 5: Cost display triggers toast**
  - **Validates: Requirements 3.3**
  - **Property 6: Cost formatting precision**
  - **Validates: Requirements 3.5**
  - **Property 7: Token usage extraction**
  - **Validates: Requirements 3.1**
  - Test successful request with usage data triggers toast
  - Test cost formatted with exactly 4 decimal places
  - Test various cost values (0.0001 to 1.0000) format correctly
  - Test missing usage data doesn't crash or show toast
  - Test token extraction from response.usage field
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 8. Write integration tests for end-to-end flow
  - Test: Load page with no stored model → Verify default selected
  - Test: Select different model → Verify dropdown updates and localStorage saves
  - Test: Generate AI plan → Verify correct model in API call
  - Test: Reload page → Verify selection persisted
  - Test: Cost display flow with mocked response
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
