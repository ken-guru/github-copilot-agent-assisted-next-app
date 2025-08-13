export interface AIActivity {
  title: string;
  description: string;
  duration: number; // minutes
}

export interface AIActivityPlan {
  activities: AIActivity[];
}

// Shared limits/constants
export const MAX_AI_ACTIVITIES = 20 as const;

// Shared minimal chat completion types for BYOK client parsing
export interface ChatMessage {
  content?: string;
}

export interface ChatChoice {
  message?: ChatMessage;
}

export interface ChatCompletion {
  choices?: ChatChoice[];
}
