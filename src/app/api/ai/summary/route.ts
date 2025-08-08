import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureAuthenticated } from '@/utils/auth/server';
import { requestSummaryFromOpenAI } from '@/utils/ai/openai';

export async function POST(req: Request) {
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

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'AI summary not configured on server' }, { status: 501 });
  }

  const systemPrompt = [
    'You generate a short, upbeat summary for a finished session.',
    'Input is a JSON object with metrics: plannedTime, timeSpent, overtime, idle, perActivity, skippedIds.',
    'Return a concise, friendly paragraph (plain text).'
  ].join(' ');

  try {
    const text = await requestSummaryFromOpenAI(systemPrompt, body);
    return NextResponse.json({ summary: text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'AI summary failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
