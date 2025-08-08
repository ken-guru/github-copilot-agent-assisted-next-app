import type { AIActivity, AIActivityPlan } from '@/types/ai';

export function safeJsonParse<T = unknown>(text: string): T {
  try {
  return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from fenced code blocks first: ```json ... ``` or ``` ... ```
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch && fenceMatch[1]) {
  return JSON.parse(fenceMatch[1]) as T;
    }
    // Fallback: grab substring between first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.slice(firstBrace, lastBrace + 1);
      return JSON.parse(candidate) as T;
    }
    throw new Error('Unable to parse JSON');
  }
}

export function extractPlanFromText(text: string): AIActivityPlan {
  const obj = typeof text === 'string' ? safeJsonParse<unknown>(text) : (text as unknown);
  const activitiesRaw = ((): unknown[] => {
    if (typeof obj === 'object' && obj && 'activities' in (obj as Record<string, unknown>)) {
      const v = (obj as Record<string, unknown>).activities;
      return Array.isArray(v) ? (v as unknown[]) : [];
    }
    return [];
  })();
  type Loose = { title?: unknown; name?: unknown; description?: unknown; duration?: unknown };
  const normalized: AIActivity[] = activitiesRaw.map((a: unknown) => {
    const x = a as Loose;
    const title = typeof x?.title === 'string' ? x.title : (typeof x?.name === 'string' ? x.name : 'Untitled');
    const description = typeof x?.description === 'string' ? x.description : '';
    const dur = typeof x?.duration === 'number' && Number.isFinite(x.duration) ? Math.max(1, Math.floor(x.duration)) : 1;
    return { title: String(title).trim() || 'Untitled', description, duration: dur };
  }).slice(0, 20);
  if (normalized.length === 0) throw new Error('No activities provided by AI');
  return { activities: normalized };
}

export function validateAIActivities(activities: AIActivity[]): void {
  if (!Array.isArray(activities) || activities.length === 0 || activities.length > 20) {
    throw new Error('Activities must contain 1-20 items');
  }
  for (const a of activities) {
    if (!a.title || typeof a.title !== 'string') throw new Error('Invalid activity title');
    if (typeof a.description !== 'string') throw new Error('Invalid activity description');
    if (!Number.isFinite(a.duration) || a.duration < 1) throw new Error('Invalid activity duration');
  }
}
