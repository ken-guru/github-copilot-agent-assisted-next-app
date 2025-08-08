export interface AIActivity {
  title: string;
  description: string;
  duration: number; // minutes
}

export interface AIActivityPlan {
  activities: AIActivity[];
}
