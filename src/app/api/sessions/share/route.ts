import { NextResponse } from 'next/server';
import { validateSessionSummaryData, validateStoredSession } from '../../../../utils/sessionSharing/schema';
import { generateShareId } from '../../../../utils/sessionSharing/utils';
import { saveSession } from '../../../../utils/sessionSharing/storage';
import { checkAndIncrementKey } from '../../../../utils/sessionSharing/rateLimiter';

export async function POST(req: Request) {
  try {
  // Helpful debugging log: do not print token values, only presence
  console.log('session-share: BLOB_BASE_URL set?', !!process.env.BLOB_BASE_URL, 'BLOB_READ_WRITE_TOKEN set?', !!process.env.BLOB_READ_WRITE_TOKEN);
    // Additional context logs for debugging create/upload flow
    console.log('session-share: creating share id', { idPreview: 'xxxx-xxxx', origin: req.headers.get('origin') ?? undefined });
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

  // Define a light put signature to avoid depending on SDK types at build time
  type PutFn = (name: string, body: BodyInit, opts?: Record<string, unknown>) => Promise<{ id?: string; url?: string }>;
  let putBlob: PutFn | null = null;
  let saved;
  try {
    console.log('session-share: attempting to save session to blob/local storage', { id });
    // Attempt to dynamically import the SDK at runtime (avoids build-time type/import issues)
    try {
      // dynamic import is allowed in ESM and won't trigger the no-require rule
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = await import('@vercel/blob');
      if (mod && typeof mod.put === 'function') putBlob = mod.put as PutFn;
    } catch (e) {
      // SDK not available — we'll fall back to REST saveSession below
      putBlob = null;
    }

    const isTest = process.env.NODE_ENV === 'test';
    if (isTest || !putBlob) {
      // Use existing REST/local logic for tests or when SDK isn't present
      saved = await saveSession(id, stored);
    } else {
      try {
        const result = await putBlob(`${id}.json`, JSON.stringify(stored), { access: 'private' });
        saved = { id: result.id ?? id, url: result.url ?? (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${id}` : ''), storage: 'blob' };
        if (process.env.NODE_ENV !== 'production') console.log('session-share: putBlob result', { id: saved.id, url: saved.url });
      } catch (sdkErr) {
        if (process.env.NODE_ENV !== 'production') console.error('session-share: putBlob failed, falling back to REST saveSession', String(sdkErr));
        saved = await saveSession(id, stored);
      }
    }
    console.log('session-share: saveSession result', { id, storage: saved.storage });
  } catch (saveErr) {
    console.error('session-share: saveSession failed', { id, err: String(saveErr) });
    throw saveErr;
  }

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
