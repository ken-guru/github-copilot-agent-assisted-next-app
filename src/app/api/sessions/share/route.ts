import { NextResponse } from 'next/server';
import { validateSessionSummaryData, validateStoredSession } from '../../../../utils/sessionSharing/schema';
import { generateShareId } from '../../../../utils/sessionSharing/utils';
import { saveSession } from '../../../../utils/sessionSharing/storage';
import type { StoredSession } from '../../../../types/sessionSharing';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionData = validateSessionSummaryData(body.sessionData ?? body);

    const id = generateShareId();
    const now = new Date();
    const metadata: StoredSession['metadata'] = {
      id,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1',
      userAgent: req.headers.get('user-agent') ?? undefined,
    } as StoredSession['metadata'];

    const stored: StoredSession = { sessionData, metadata } as StoredSession;
    // validate stored session (ensures metadata shape)
    validateStoredSession(stored);

    await saveSession(id, stored);

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/shared/${id}`;

    return NextResponse.json({ shareId: id, shareUrl, expiresAt: metadata.expiresAt }, { status: 201 });
  } catch (err) {
    const e = err as { name?: string; errors?: unknown; message?: string } | undefined;
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid session data', details: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: e?.message ?? String(err) }, { status: 500 });
  }
}
