export interface AIActivity {
  title: string;
  description: string;
  duration: number; // minutes
}

export interface AIActivityPlan {
  activities: AIActivity[];
}

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
