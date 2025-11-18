# Design Document

## Overview

The AI Model Picker adds a simple dropdown to the AI Session Planner page that allows users to select from 3-5 OpenAI models. The implementation uses static configuration stored in a TypeScript constants file, displays pricing information inline in the dropdown, persists the selection to localStorage, and optionally displays actual request costs after API calls complete.

This design maintains the application's existing architecture:
- Client-side only (no server components)
- BYOK security model (API keys in memory only)
- Bootstrap UI components
- React hooks for state management
- localStorage for non-sensitive preferences

## Architecture

### Component Structure

```
src/app/ai/page.tsx (existing)
├── Model selection state (new)
├── Model picker UI (new Form.Group)
└── Cost calculation logic (new, optional)

src/constants/openai-models.ts (new)
└── Static model configuration

src/contexts/ApiKeyContext.tsx (existing, no changes)
```

### Data Flow

1. **Page Load**: Load selected model from localStorage, default to 'gpt-4o-mini'
2. **Model Selection**: User selects model → Save to localStorage → Update state
3. **AI Request**: Use selected model in API payload instead of hardcoded value
4. **Response**: Extract usage data → Calculate cost → Display in toast (optional)

## Components and Interfaces

### Model Configuration (src/constants/openai-models.ts)

```typescript
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

// Helper to get model by ID
export function getModelById(id: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(m => m.id === id);
}
```

### State Management (in src/app/ai/page.tsx)

```typescript
// Add to existing state
const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);

// Load from localStorage on mount (after ready check)
useEffect(() => {
  if (!ready) return;
  try {
    const saved = localStorage.getItem('selected_ai_model');
    if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
      setSelectedModelId(saved);
    }
  } catch {
    // Ignore storage errors, use default
  }
}, [ready]);

// Save to localStorage on change
const handleModelChange = (modelId: string) => {
  setSelectedModelId(modelId);
  try {
    localStorage.setItem('selected_ai_model', modelId);
  } catch {
    // Ignore storage errors
  }
};

// Get current model info
const currentModel = getModelById(selectedModelId) || AVAILABLE_MODELS[0];
```

### UI Component (in src/app/ai/page.tsx)

```tsx
{/* Add after API key is confirmed, before prompt textarea */}
<Form.Group className="mb-3">
  <Form.Label htmlFor="modelSelect">AI Model</Form.Label>
  <Form.Select
    id="modelSelect"
    value={selectedModelId}
    onChange={(e) => handleModelChange(e.target.value)}
    aria-label="Select AI model"
  >
    {AVAILABLE_MODELS.map(model => (
      <option key={model.id} value={model.id}>
        {model.name} - ${model.costPer1kTokens.input}/1K tokens - {model.description}
      </option>
    ))}
  </Form.Select>
  <Form.Text className="text-body-secondary">
    Context: {currentModel.contextWindow.toLocaleString()} tokens
  </Form.Text>
</Form.Group>
```

### API Request Update

```typescript
// In handlePlan function, replace hardcoded model
const payload = {
  model: selectedModelId,  // Changed from 'gpt-4o-mini'
  messages: [
    { role: 'system', content: 'You are planning study/work sessions.' },
    { role: 'user', content: `${prompt}\n\nReturn strict JSON: {"activities": [...]}` }
  ],
  response_format: { type: 'json_object' }
};
```

### Cost Calculation (Optional)

```typescript
// Add helper function
function calculateCost(
  promptTokens: number,
  completionTokens: number,
  modelId: string
): number {
  const model = getModelById(modelId);
  if (!model) return 0;
  
  const inputCost = (promptTokens / 1000) * model.costPer1kTokens.input;
  const outputCost = (completionTokens / 1000) * model.costPer1kTokens.output;
  
  return inputCost + outputCost;
}

// In handlePlan, after successful response
const response = await callOpenAI('/v1/chat/completions', payload);

// Extract usage if available
if (response.usage) {
  const { prompt_tokens, completion_tokens } = response.usage;
  const cost = calculateCost(prompt_tokens, completion_tokens, selectedModelId);
  
  addToast({
    message: `Request cost: $${cost.toFixed(4)}`,
    variant: 'info'
  });
}
```

## Data Models

### ModelInfo Interface

| Field | Type | Description |
|-------|------|-------------|
| id | string | OpenAI model identifier (e.g., 'gpt-4o-mini') |
| name | string | Human-readable display name |
| costPer1kTokens.input | number | Cost per 1,000 input tokens in USD |
| costPer1kTokens.output | number | Cost per 1,000 output tokens in USD |
| contextWindow | number | Maximum tokens the model can process |
| description | string | Brief description for UI display |

### localStorage Schema

```typescript
// Key: 'selected_ai_model'
// Value: string (model ID)
// Example: 'gpt-4o-mini'
```

### OpenAI Response Usage Field

```typescript
interface ChatCompletionUsage {
  prompt_tokens: number;      // Input tokens used
  completion_tokens: number;  // Output tokens generated
  total_tokens: number;       // Sum of above
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Model selection persistence round-trip

*For any* valid model ID from AVAILABLE_MODELS, if a user selects it and the page remounts, the same model should be selected
**Validates: Requirements 1.2, 1.4**

### Property 2: Selected model used in API requests

*For any* model selection, when an AI plan is generated, the API payload should contain the selected model ID (not the hardcoded 'gpt-4o-mini')
**Validates: Requirements 1.3**

### Property 3: Context window display matches selected model

*For any* selected model, the displayed context window size should match the contextWindow value from the model's configuration
**Validates: Requirements 2.3**

### Property 4: Cost calculation accuracy

*For any* combination of prompt_tokens, completion_tokens, and model pricing, the calculated cost should equal: (prompt_tokens / 1000 × input_price) + (completion_tokens / 1000 × output_price)
**Validates: Requirements 3.2**

### Property 5: Cost display triggers toast

*For any* successful AI request with usage data, a toast notification should appear displaying the calculated cost
**Validates: Requirements 3.3**

### Property 6: Cost formatting precision

*For any* calculated cost value, the displayed string should format the amount with exactly 4 decimal places (e.g., "$0.0023")
**Validates: Requirements 3.5**

### Property 7: Token usage extraction

*For any* OpenAI response containing a usage field, the system should successfully extract prompt_tokens and completion_tokens without errors
**Validates: Requirements 3.1**

## Error Handling

### localStorage Unavailability

**Scenario**: localStorage is blocked by browser settings or privacy mode

**Handling**:
- Wrap all localStorage calls in try-catch blocks
- Default to 'gpt-4o-mini' if read fails
- Silently ignore write failures
- No error messages to user (graceful degradation)

```typescript
try {
  const saved = localStorage.getItem('selected_ai_model');
  if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
    setSelectedModelId(saved);
  }
} catch {
  // Use default, no error message
}
```

### Invalid Stored Model ID

**Scenario**: localStorage contains a model ID that no longer exists in AVAILABLE_MODELS

**Handling**:
- Validate stored ID against AVAILABLE_MODELS array
- Fall back to DEFAULT_MODEL_ID if invalid
- Overwrite localStorage with valid default

```typescript
const saved = localStorage.getItem('selected_ai_model');
if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
  setSelectedModelId(saved);
} else {
  setSelectedModelId(DEFAULT_MODEL_ID);
  localStorage.setItem('selected_ai_model', DEFAULT_MODEL_ID);
}
```

### Missing Usage Data

**Scenario**: OpenAI response doesn't include usage field (rare but possible)

**Handling**:
- Check for existence of response.usage before accessing
- Skip cost calculation and display if missing
- No error message (optional feature)

```typescript
if (response.usage) {
  const { prompt_tokens, completion_tokens } = response.usage;
  const cost = calculateCost(prompt_tokens, completion_tokens, selectedModelId);
  addToast({ message: `Request cost: $${cost.toFixed(4)}`, variant: 'info' });
}
// If no usage data, simply don't show cost
```

### Model Not Found

**Scenario**: getModelById returns undefined (defensive programming)

**Handling**:
- Return 0 cost if model not found
- Use first model in array as fallback for UI display

```typescript
function calculateCost(promptTokens: number, completionTokens: number, modelId: string): number {
  const model = getModelById(modelId);
  if (!model) return 0;
  // ... calculation
}

const currentModel = getModelById(selectedModelId) || AVAILABLE_MODELS[0];
```

## Testing Strategy

### Unit Tests

**Model Configuration Tests** (src/constants/openai-models.test.ts):
- Verify AVAILABLE_MODELS array has 3-5 entries
- Verify each model has all required fields
- Verify DEFAULT_MODEL_ID exists in AVAILABLE_MODELS
- Verify getModelById returns correct model or undefined

**Cost Calculation Tests** (src/app/ai/page.test.tsx):
- Test calculateCost with known token counts and pricing
- Test calculateCost with zero tokens
- Test calculateCost with missing model (returns 0)
- Test cost formatting with various decimal values

**localStorage Persistence Tests**:
- Test model selection saves to localStorage
- Test page load reads from localStorage
- Test invalid stored ID falls back to default
- Test localStorage unavailable doesn't crash

### Property-Based Tests

**Property 1: Round-trip persistence**
- Generate random valid model IDs
- Save to localStorage, clear state, reload
- Verify same model is selected

**Property 2: API payload correctness**
- Generate random model selections
- Mock API call
- Verify payload.model matches selection

**Property 3: Cost calculation formula**
- Generate random token counts (0-10000)
- Generate random pricing (realistic ranges)
- Verify formula: (prompt/1000 × input) + (completion/1000 × output)

**Property 4: Cost formatting**
- Generate random cost values (0.0001 to 1.0000)
- Verify all formatted strings have exactly 4 decimal places

### Integration Tests

**End-to-End Model Selection Flow**:
1. Load page (no stored model) → Verify default selected
2. Select different model → Verify dropdown updates
3. Generate AI plan → Verify correct model in API call
4. Reload page → Verify selection persisted

**Cost Display Flow** (if implemented):
1. Select model with known pricing
2. Mock API response with known token counts
3. Verify toast displays correct calculated cost

### Accessibility Tests

- Keyboard navigation through model dropdown
- Screen reader announces model selection changes
- Form.Label properly associated with Form.Select
- ARIA labels present and descriptive

## Implementation Notes

### File Changes Required

1. **Create**: `src/constants/openai-models.ts` (new file)
   - Export ModelInfo interface
   - Export AVAILABLE_MODELS array
   - Export DEFAULT_MODEL_ID constant
   - Export getModelById helper

2. **Modify**: `src/app/ai/page.tsx`
   - Import model constants
   - Add selectedModelId state
   - Add useEffect for localStorage load
   - Add handleModelChange function
   - Add Form.Group for model picker
   - Replace hardcoded 'gpt-4o-mini' with selectedModelId
   - (Optional) Add calculateCost function
   - (Optional) Add cost display after API response

3. **Create**: `src/constants/openai-models.test.ts` (new file)
   - Unit tests for model configuration
   - Tests for getModelById helper

4. **Modify**: `src/app/ai/page.test.tsx` (if exists)
   - Add tests for model selection
   - Add tests for localStorage persistence
   - Add tests for cost calculation

### Dependencies

No new dependencies required. Uses existing:
- React (useState, useEffect)
- Bootstrap (Form.Select, Form.Group, Form.Label, Form.Text)
- localStorage (browser API)

### Performance Considerations

- Model dropdown renders 3-5 options (negligible performance impact)
- localStorage operations are synchronous but fast (< 1ms)
- Cost calculation is simple arithmetic (< 1ms)
- No network requests for model list (static configuration)

### Security Considerations

- Model selection stored in localStorage (non-sensitive data)
- API keys remain in memory only (existing security model unchanged)
- No server-side storage or transmission of model preferences
- Cost calculation happens client-side (no data leakage)

### Browser Compatibility

- localStorage: Supported in all modern browsers
- Form.Select: Bootstrap component, works everywhere Bootstrap works
- Number.toLocaleString(): Supported in all modern browsers
- No polyfills required

### Future Enhancements (Out of Scope)

These are explicitly NOT part of this implementation:
- Dynamic model discovery via API
- Multi-provider support (Anthropic, Google, etc.)
- Usage analytics and historical tracking
- Budget limits and alerts
- Cost comparison tools
- Model recommendations
- Server-side model management

## Deployment Considerations

### Rollout Strategy

1. Deploy constants file first (no breaking changes)
2. Deploy UI changes (backward compatible - defaults to existing behavior)
3. Monitor for localStorage errors in production
4. Gradually enable cost display if desired

### Monitoring

- Track localStorage errors (if any) via existing error handling
- Monitor API request patterns to see model usage distribution
- No new monitoring infrastructure required

### Documentation Updates

- Update README with model selection feature
- Document available models and pricing
- Add note about localStorage usage for preferences
- Update AI planner user guide

### Rollback Plan

If issues arise:
1. Revert to hardcoded 'gpt-4o-mini'
2. Hide model picker UI
3. Keep constants file (no harm)
4. localStorage data remains but is ignored
