# Requirements Document

## Introduction

This feature adds a simple model selection dropdown to the AI Session Planner page, allowing users to choose between 3-5 OpenAI models. The implementation uses static configuration (no API calls), displays pricing information inline, and optionally shows actual cost after each request. This is a 3-4 hour implementation that maintains the application's existing security architecture.

## Glossary

- **AI Model**: A specific version of OpenAI's language model (e.g., GPT-4o Mini, GPT-4o, GPT-4 Turbo)
- **BYOK**: Bring Your Own Key - the security pattern where users provide their own API keys
- **Token**: The unit of text processing used by AI models for billing purposes
- **Model Picker**: A Bootstrap Form.Select dropdown that allows users to select from available AI models
- **Static Configuration**: Model information hardcoded in a constants file, not fetched from APIs

## Requirements

### Requirement 1

**User Story:** As a user with an OpenAI API key, I want to select which AI model to use for session planning, so that I can balance cost and quality based on my needs.

#### Acceptance Criteria

1. WHEN a user views the AI planner page THEN the system SHALL display a Bootstrap Form.Select dropdown with 3-5 OpenAI models
2. WHEN a user selects a model from the dropdown THEN the system SHALL save the selection to localStorage
3. WHEN a user generates an AI plan THEN the system SHALL use the selected model instead of the hardcoded 'gpt-4o-mini'
4. WHEN a user returns to the AI planner page THEN the system SHALL load and display the previously selected model
5. THE system SHALL default to 'gpt-4o-mini' WHEN no model has been previously selected or localStorage is unavailable

### Requirement 2

**User Story:** As a cost-conscious user, I want to see pricing information for each model in the dropdown, so that I can make informed decisions about which model to use.

#### Acceptance Criteria

1. WHEN a user views the model dropdown options THEN each option SHALL display the model name and input cost per 1,000 tokens
2. WHEN a user views the model dropdown options THEN each option SHALL display a brief description (e.g., "Fast and affordable")
3. WHEN a model is selected THEN the system SHALL display the context window size below the dropdown
4. THE system SHALL format pricing as "$0.00015 per 1K tokens" or similar clear format
5. THE model information SHALL be sourced from a static constants file (src/constants/openai-models.ts)

### Requirement 3 (Optional Enhancement)

**User Story:** As a user, I want to see the actual cost of my AI requests after they complete, so that I can understand my spending.

#### Acceptance Criteria

1. WHEN an AI planning request completes successfully THEN the system SHALL extract token usage from the OpenAI response.usage field
2. WHEN token usage data is available THEN the system SHALL calculate cost using: (prompt_tokens × input_price + completion_tokens × output_price) / 1000
3. WHEN cost is calculated THEN the system SHALL display it in an info toast notification (e.g., "Request cost: $0.0023")
4. WHEN the OpenAI response does not include usage data THEN the system SHALL skip cost display without errors
5. THE cost display SHALL format amounts with 4 decimal places (e.g., "$0.0023")

### Requirement 4

**User Story:** As a developer, I want model configuration centralized in a constants file, so that pricing updates and new models can be added easily.

#### Acceptance Criteria

1. THE system SHALL create a new file at src/constants/openai-models.ts
2. THE constants file SHALL export a TypeScript interface ModelInfo with fields: id, name, costPer1kTokens (input/output), contextWindow, description
3. THE constants file SHALL export an array AVAILABLE_MODELS containing 3-5 OpenAI models (gpt-4o-mini, gpt-4o, gpt-4-turbo minimum)
4. THE model configuration SHALL use current OpenAI pricing as of implementation date
5. WHEN new models are added THEN developers SHALL only need to update the AVAILABLE_MODELS array
