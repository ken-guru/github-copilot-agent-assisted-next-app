import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureAuthenticated } from '@/utils/auth/server';
// Server no longer calls OpenAI directly; BYOK happens client-side
import { generateMockPlan } from '@/utils/ai/mock';
// import { extractPlanFromText, validateAIActivities } from '@/utils/ai/parse';

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
  // Server path only supports mock; live calls must use client BYOK
  if (enableMock) {
    const plan = generateMockPlan(userPrompt);
    return NextResponse.json(plan, { headers: { 'X-AI-Mode': 'mock' } });
  }
  return NextResponse.json({ error: 'AI planning not available on server (use BYOK client mode)' }, { status: 501, headers: { 'X-AI-Mode': 'disabled' } });

  // Kept for potential future server implementation

  // Unreachable due to early return above; kept for future expansion
}
