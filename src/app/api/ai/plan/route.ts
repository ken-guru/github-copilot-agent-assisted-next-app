import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureAuthenticated } from '@/utils/auth/server';
import { requestPlanFromOpenAI } from '@/utils/ai/openai';
import { generateMockPlan } from '@/utils/ai/mock';
import { extractPlanFromText, validateAIActivities } from '@/utils/ai/parse';

export async function POST(req: Request) {
  // Build a minimal request-like for cookie access using next/headers
  const cookieStore = await cookies();
  const auth = ensureAuthenticated({ cookies: { get: (name: string) => cookieStore.get(name) } });
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status, headers: { 'X-AI-Mode': 'disabled' } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
  return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: { 'X-AI-Mode': 'disabled' } });
  }

  const userPrompt = ((): string => {
    if (typeof body === 'object' && body && 'prompt' in (body as Record<string, unknown>)) {
      const v = (body as Record<string, unknown>).prompt;
      return typeof v === 'string' ? v.trim() : '';
    }
    return '';
  })();
  if (!userPrompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400, headers: { 'X-AI-Mode': 'disabled' } });
  }

  const enableMock = process.env.AI_ENABLE_MOCK === 'true';
  const fallbackOn429 = process.env.AI_FALLBACK_ON_429 !== 'false';
  // If API key missing, allow mock mode in dev
  if (!process.env.OPENAI_API_KEY) {
    if (enableMock) {
      const plan = generateMockPlan(userPrompt);
      return NextResponse.json(plan, { headers: { 'X-AI-Mode': 'mock' } });
    }
    return NextResponse.json({ error: 'AI planning not configured on server' }, { status: 501, headers: { 'X-AI-Mode': 'disabled' } });
  }

  const systemPrompt = [
    'You are an assistant that plans time-bounded activity sessions for a timer app.',
    'Return JSON with the schema: { "activities": [{ "title": string, "description": string, "duration": number(mins) }] }.',
    'Activities array size must be between 1 and 20. Default duration is 1 when not specified.',
    'Only output strict JSON without markdown fences.'
  ].join(' ');

  try {
    const content = await requestPlanFromOpenAI(systemPrompt, userPrompt);
    const plan = extractPlanFromText(content);
    validateAIActivities(plan.activities);
    return NextResponse.json(plan, { headers: { 'X-AI-Mode': 'live' } });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'AI planning failed';
    // Server-side debug to help diagnose why mock may be returned
    console.warn('[AI Plan] OpenAI error:', message);
    // If quota/429 or mock enabled, return mock plan
  const is429 = /(?:429|insufficient_quota)/i.test(message);
  if (enableMock || (fallbackOn429 && is429)) {
      const plan = generateMockPlan(userPrompt);
      return NextResponse.json(plan, { headers: { 'X-AI-Mode': 'mock' } });
    }
  const status = /\b(\d{3})\b/.test(message) ? Number((message.match(/\b(\d{3})\b/) || [])[0]) : (is429 ? 429 : 502);
  return NextResponse.json({ error: message }, { status, headers: { 'X-AI-Mode': 'error' } });
  }
}
