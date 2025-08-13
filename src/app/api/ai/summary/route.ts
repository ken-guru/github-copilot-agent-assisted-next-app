import { NextResponse } from 'next/server';
// Server no longer calls OpenAI directly; BYOK happens client-side
import { generateMockSummary } from '@/utils/ai/mock';

export async function POST(req: Request) {

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: { 'X-AI-Mode': 'disabled' } });
  }

  const enableMock = process.env.AI_ENABLE_MOCK === 'true';
  if (enableMock) {
    return NextResponse.json({ summary: generateMockSummary(body) }, { headers: { 'X-AI-Mode': 'mock' } });
  }
  return NextResponse.json({ error: 'AI summary not available on server (use BYOK client mode)' }, { status: 501, headers: { 'X-AI-Mode': 'disabled' } });
}
