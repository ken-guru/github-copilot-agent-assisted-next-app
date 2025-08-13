import type { AIActivity, AIActivityPlan } from '@/types/ai';
import { MAX_AI_ACTIVITIES } from '@/types/ai';

// Dev-only logging helpers to keep logs consistent and silent in production
const devDebug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') console.debug(...args);
};
const devError = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') console.error(...args);
};

/**
 * Safely parses a string that should contain JSON, with multiple fallbacks:
 * - Direct JSON.parse
 * - Fenced code blocks (```json ... ``` or ``` ... ```)
 * - Substring between first '{' and last '}'
 * Throws a descriptive error when parsing fails.
 */
export function safeJsonParse<T = unknown>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (e1) {
    // Try to extract JSON from fenced code blocks first: ```json ... ``` or ``` ... ```
    try {
      const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fenceMatch && fenceMatch[1]) {
        return JSON.parse(fenceMatch[1]) as T;
      }
    } catch (e2) {
      devDebug('safeJsonParse fenced block parse failed:', e2);
    }
    // Fallback: grab substring between first '{' and last '}'
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = text.slice(firstBrace, lastBrace + 1);
        return JSON.parse(candidate) as T;
      }
    } catch (e3) {
      devDebug('safeJsonParse substring parse failed:', e3);
    }
    devError('safeJsonParse initial error:', e1);
    const msg = e1 instanceof Error ? e1.message : String(e1);
    throw new Error('Unable to parse JSON: ' + msg);
  }
}

/**
 * Extracts and normalizes an AI planning response into an AIActivityPlan.
 * Ensures activities are capped to MAX_AI_ACTIVITIES and each activity has
 * a title, description, and a duration >= 1 (seconds or minutes per caller's convention).
 */
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
  const pickTitle = (x: Loose): string => {
    const t = typeof x?.title === 'string' ? x.title : (typeof x?.name === 'string' ? x.name : 'Untitled');
    const cleaned = String(t).trim();
    return cleaned || 'Untitled';
  };
  const normalizeDuration = (val: unknown): number => {
    if (typeof val === 'number' && Number.isFinite(val)) {
      return Math.max(1, Math.floor(val));
    }
    if (typeof val === 'string') {
      const n = Number(val);
      if (Number.isFinite(n)) return Math.max(1, Math.floor(n));
    }
    return 1;
  };
  const normalized: AIActivity[] = activitiesRaw.map((a: unknown) => {
    const x = a as Loose;
    const title = pickTitle(x);
    const description = typeof x?.description === 'string' ? x.description : '';
    const dur = normalizeDuration(x?.duration);
    return { title, description, duration: dur };
  }).slice(0, MAX_AI_ACTIVITIES);
  if (normalized.length === 0) throw new Error('No activities provided by AI');
  return { activities: normalized };
}

/**
 * Validates a list of AI activities for basic shape and bounds.
 * Throws if activities are empty, exceed MAX_AI_ACTIVITIES, or have invalid fields.
 */
export function validateAIActivities(activities: AIActivity[]): void {
  if (!Array.isArray(activities) || activities.length === 0 || activities.length > MAX_AI_ACTIVITIES) {
    throw new Error('Activities must contain 1-20 items');
  }
  for (const a of activities) {
    if (!a.title || typeof a.title !== 'string') throw new Error('Invalid activity title');
    if (typeof a.description !== 'string') throw new Error('Invalid activity description');
    if (!Number.isFinite(a.duration) || a.duration < 1) throw new Error('Invalid activity duration');
  }
}
