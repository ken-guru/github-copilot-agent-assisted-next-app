import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureAuthenticated } from '@/utils/auth/server';
import { requestSummaryFromOpenAI } from '@/utils/ai/openai';
import { generateMockSummary } from '@/utils/ai/mock';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const auth = ensureAuthenticated({ cookies: { get: (name: string) => cookieStore.get(name) } });
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status, headers: { 'X-AI-Mode': 'disabled' } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const enableMock = process.env.AI_ENABLE_MOCK === 'true';
  const fallbackOn429 = process.env.AI_FALLBACK_ON_429 !== 'false';
  if (!process.env.OPENAI_API_KEY) {
    if (enableMock) {
      return NextResponse.json({ summary: generateMockSummary(body) }, { headers: { 'X-AI-Mode': 'mock' } });
    }
    return NextResponse.json({ error: 'AI summary not configured on server' }, { status: 501, headers: { 'X-AI-Mode': 'disabled' } });
  }

  const systemPrompt = [
    'You generate a short, upbeat summary for a finished session.',
    'Input is a JSON object with metrics: plannedTime, timeSpent, overtime, idle, perActivity, skippedIds.',
    'Return a concise, friendly paragraph (plain text).'
  ].join(' ');

  try {
    const text = await requestSummaryFromOpenAI(systemPrompt, body);
    return NextResponse.json({ summary: text }, { headers: { 'X-AI-Mode': 'live' } });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'AI summary failed';
    console.warn('[AI Summary] OpenAI error:', message);
    const is429 = /(?:429|insufficient_quota)/i.test(message);
    if (enableMock || (fallbackOn429 && is429)) {
      return NextResponse.json({ summary: generateMockSummary(body) }, { headers: { 'X-AI-Mode': 'mock' } });
    }
    const status = /\b(\d{3})\b/.test(message) ? Number((message.match(/\b(\d{3})\b/) || [])[0]) : (is429 ? 429 : 502);
    return NextResponse.json({ error: message }, { status, headers: { 'X-AI-Mode': 'error' } });
  }
}
