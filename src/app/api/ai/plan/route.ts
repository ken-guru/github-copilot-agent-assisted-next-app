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
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const userPrompt = ((): string => {
    if (typeof body === 'object' && body && 'prompt' in (body as Record<string, unknown>)) {
      const v = (body as Record<string, unknown>).prompt;
      return typeof v === 'string' ? v.trim() : '';
    }
    return '';
  })();
  if (!userPrompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const enableMock = process.env.AI_ENABLE_MOCK === 'true';
  // If API key missing, allow mock mode in dev
  if (!process.env.OPENAI_API_KEY) {
    if (enableMock) {
      const plan = generateMockPlan(userPrompt);
      return NextResponse.json(plan);
    }
    return NextResponse.json({ error: 'AI planning not configured on server' }, { status: 501 });
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
    return NextResponse.json(plan);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'AI planning failed';
    // If quota/429 or mock enabled, return mock plan
    if (enableMock || /(?:429|insufficient_quota)/i.test(message)) {
      const plan = generateMockPlan(userPrompt);
      return NextResponse.json(plan);
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
