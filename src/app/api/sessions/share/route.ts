import { NextResponse } from 'next/server';
import { validateSessionSummaryData, validateStoredSession } from '../../../../utils/sessionSharing/schema';
import { generateShareId } from '../../../../utils/sessionSharing/utils';
import { saveSession, SaveResult } from '../../../../utils/sessionSharing/storage';
import { checkAndIncrementKey } from '../../../../utils/sessionSharing/rateLimiter';

export async function POST(req: Request) {
  try {
    // Additional context logs for debugging create/upload flow
  const headerOrigin = req.headers.get('origin') ?? '';
  const headerReferer = req.headers.get('referer') ?? '';
  if (process.env.NODE_ENV !== 'production') {
    console.log('session-share: creating share id', { idPreview: 'xxxx-xxxx', origin: headerOrigin || undefined, referer: headerReferer || undefined, url: req.url });
  }
  // Origin validation: allow same-host requests (works for preview and production),
    // avoid coupling to NEXT_PUBLIC_BASE_URL which may differ on preview.
    // If an Origin/Referer is present and does not match this deployment's origin, reject.
    try {
      const reqUrl = new URL(req.url);
      const serverOrigin = `${reqUrl.protocol}//${reqUrl.host}`;
  const headerBase = headerOrigin || headerReferer;
      if (headerBase && !headerBase.startsWith(serverOrigin)) {
        console.warn('session-share: origin mismatch', { serverOrigin, headerBase });
        return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
      }
    } catch (e) {
      // If URL parsing fails for any reason, continue without blocking
      console.warn('session-share: origin validation skipped due to URL parse error', e);
    }

  // Rate limit per-origin host (fall back to 'global' if absent)
  let rateKey = 'global';
  try {
    const keyBase = headerOrigin || headerReferer || '';
    if (keyBase) {
      const u = new URL(keyBase);
      rateKey = u.host || keyBase;
    }
  } catch {
    rateKey = headerOrigin || headerReferer || 'global';
  }
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
    };

    const stored = { sessionData, metadata };
    // validate stored session (ensures metadata and sessionData shapes)
    validateStoredSession(stored);

  // Define a light result type
  type PutResult = { id?: string; url?: string };
  let saved: SaveResult;
  try {
  if (process.env.NODE_ENV !== 'production') console.log('session-share: attempting to save session to blob/local storage', { id });
    const isTest = process.env.NODE_ENV === 'test';
    const disableExternal = (process.env.DISABLE_BLOB_NETWORK === '1' || process.env.DISABLE_BLOB_NETWORK === 'true')
      || (process.env.CI === 'true' && process.env.NODE_ENV !== 'production');

    if (isTest || disableExternal) {
      // Use local-only path during tests or when external calls are disabled
      saved = await saveSession(id, stored, { forceLocal: true });
    } else {
      try {
        // Enforce SDK path in non-test environments with public access.
        // Deterministic name and overwrite to avoid collisions during retries.
        const { put: putBlob } = await import('@vercel/blob');
        let bodyString = '';
        try {
          bodyString = JSON.stringify(stored);
        } catch {
          return NextResponse.json({ error: 'Failed to serialize session' }, { status: 400 });
        }
        const result: PutResult = await putBlob(`${id}.json`, bodyString, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
        });
        saved = {
          id: result.id ?? id,
          url: result.url ?? (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${id}` : ''),
          storage: 'blob',
        };
        if (process.env.NODE_ENV !== 'production') console.log('session-share: putBlob result', { id: saved.id, url: saved.url });
      } catch (sdkErr) {
        // Avoid REST fallback in preview/prod since REST path has shown 404s. Surface the error clearly.
        if (process.env.NODE_ENV !== 'production') {
          console.error('session-share: putBlob failed (SDK path). Aborting without REST fallback.', String(sdkErr));
        }
        throw sdkErr;
      }
    }
  // Log the storage and a safe preview of the saved URL for diagnostics (do not print tokens)
  if (process.env.NODE_ENV !== 'production') console.log('session-share: saveSession result', { id, storage: saved.storage, urlPreview: String(saved?.url ?? '') });
  } catch (saveErr) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('session-share: saveSession failed', { id, err: String(saveErr) });
    }
    throw saveErr;
  }

  // Build the share URL. Prefer NEXT_PUBLIC_BASE_URL (set in production) but fall back to request origin
    const requestOrigin = req.headers.get('origin') ?? req.headers.get('referer') ?? '';
    // Prefer configured base URL; otherwise use this deployment's origin derived from req.url; fallback to requestOrigin
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    if (!baseUrl) {
      try {
        const reqUrl = new URL(req.url);
        baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;
      } catch {
        baseUrl = requestOrigin ?? '';
      }
    }
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
