import { NextResponse } from 'next/server';
import { validateSessionSummaryData, validateStoredSession } from '../../../../utils/sessionSharing/schema';
import { generateShareId } from '../../../../utils/sessionSharing/utils';
import { saveSession } from '../../../../utils/sessionSharing/storage';
import { checkAndIncrementKey } from '../../../../utils/sessionSharing/rateLimiter';

export async function POST(req: Request) {
  try {
  // Helpful debugging log: do not print token values, only presence
  console.log('session-share: BLOB_BASE_URL set?', !!process.env.BLOB_BASE_URL, 'BLOB_READ_WRITE_TOKEN set?', !!process.env.BLOB_READ_WRITE_TOKEN);
    // Basic Origin/Referer check to reduce CSRF surface for public endpoint.
    const origin = req.headers.get('origin') ?? req.headers.get('referer') ?? '';
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    if (base && origin && !origin.startsWith(base)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
    }

    // Rate limit per-origin (fall back to 'global' if absent)
    const rateKey = origin || 'global';
    const rate = checkAndIncrementKey(rateKey);
    if (!rate.ok) {
      return NextResponse.json({ error: 'Too many requests', retryAfterMs: rate.retryAfterMs }, { status: 429 });
    }

    const body = await req.json();
    const sessionData = validateSessionSummaryData(body.sessionData ?? body);

    const id = generateShareId();
    const now = new Date();
    const metadata = {
      id,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1',
      userAgent: req.headers.get('user-agent') ?? undefined,
    };

    const stored = { sessionData, metadata };
    // validate stored session (ensures metadata and sessionData shapes)
    validateStoredSession(stored);

  const saved = await saveSession(id, stored);

  // Build the share URL. Prefer NEXT_PUBLIC_BASE_URL (set in production) but fall back to request origin
  const requestOrigin = req.headers.get('origin') ?? req.headers.get('referer') ?? '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? requestOrigin ?? '';
  const shareUrl = `${baseUrl.replace(/\/$/, '')}/shared/${id}`;

    return NextResponse.json(
      { shareId: id, shareUrl, expiresAt: metadata.expiresAt, storage: saved.storage },
      { status: 201 },
    );
  } catch (err) {
    const e = err as { name?: string; errors?: unknown; message?: string } | undefined;
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid session data', details: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: e?.message ?? String(err) }, { status: 500 });
  }
}
