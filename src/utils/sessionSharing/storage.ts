import fs from 'fs';
import path from 'path';
import os from 'os';
import { StoredSession } from '../../types/sessionSharing';

/**
 * Determine an effective local store directory for development and fallback
 * runtimes where Vercel Blob is not configured. Priority:
 * 1. `process.env.BLOB_LOCAL_DIR` (explicit override)
 * 2. `process.cwd()/.vercel_blob_store` (project-local)
 * 3. OS tempdir (fallback)
 */
function getEffectiveLocalDir() {
  const env = process.env.BLOB_LOCAL_DIR;
  if (env && typeof env === 'string' && env.trim() !== '') {
    return path.resolve(env);
  }

  // Prefer project-local directory when writable
  const projectDir = path.join(process.cwd(), '.vercel_blob_store');
  try {
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    // If we were able to create or it already exists, return it
    return projectDir;
  } catch {
    // Fall through to tmpdir fallback
    // Note: Some serverless or locked-down runtimes disallow writing to cwd
  }

  const tmpDir = path.join(os.tmpdir(), '.vercel_blob_store');
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return tmpDir;
  } catch {
    // Last resort: return tmpDir path even if creation failed; callers will receive runtime errors
    return tmpDir;
  }
}

function getLocalFilePath(id: string) {
  const dir = getEffectiveLocalDir();
  return path.join(dir, `${id}.json`);
}

export type SaveResult = { id: string; url: string; storage: 'local' | 'blob' };

export async function saveSessionToLocal(id: string, data: StoredSession): Promise<SaveResult> {
  const filePath = getLocalFilePath(id);
  // Write asynchronously to avoid blocking the event loop; callers may await.
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return { id, url: `file://${filePath}`, storage: 'local' };
}

export async function getSessionFromLocal(id: string): Promise<StoredSession | null> {
  const filePath = getLocalFilePath(id);
  try {
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    // Basic shape check before casting
    if (parsed && typeof parsed === 'object' && 'sessionData' in parsed && 'metadata' in parsed) {
      return parsed as StoredSession;
    }
    return null;
  } catch {
    // File doesn't exist or couldn't be read
    return null;
  }
}

export async function saveSession(
  id: string,
  data: StoredSession,
  options?: { forceNetwork?: boolean },
): Promise<SaveResult> {
  const isTest = process.env.NODE_ENV === 'test';
  const isDev = process.env.NODE_ENV === 'development';

  // In test runs, ALWAYS use local storage to avoid network communication with Vercel Blob.
  // Tests can opt into the network path by passing { forceNetwork: true }.
  if (isTest && !options?.forceNetwork) return saveSessionToLocal(id, data);

  // Prefer dev-specific env vars when running in development
  const token = isDev && process.env.BLOB_READ_WRITE_TOKEN_DEV ? process.env.BLOB_READ_WRITE_TOKEN_DEV : process.env.BLOB_READ_WRITE_TOKEN;
  const baseRaw = isDev && process.env.BLOB_BASE_URL_DEV ? process.env.BLOB_BASE_URL_DEV : process.env.BLOB_BASE_URL;

  // Non-secret diagnostic logs to help debug preview/runtime issues. Avoid printing tokens.
  if (process.env.NODE_ENV !== 'production') {
    console.log('saveSession: start', {
      id,
      env: process.env.NODE_ENV,
      isTest,
      isDev,
      hasToken: !!token,
      hasBase: !!baseRaw,
      forceNetwork: !!options?.forceNetwork,
    });
  }

  // Require blob config in non-test environments
  if (!token || !baseRaw) {
    throw new Error('Vercel Blob not configured. Set BLOB_READ_WRITE_TOKEN and BLOB_BASE_URL');
  }

  // Normalize the base URL: accept either 'https://api.vercel.com' or 'https://api.vercel.com/v1/blob' forms
  let base = baseRaw.trim();
  // Remove trailing slash
  base = base.replace(/\/$/, '');
  // If the base looks like the API root, append the blob prefix
  if (/^https?:\/\/[^/]+$/.test(base)) {
    // e.g. https://api.vercel.com -> https://api.vercel.com/v1/blob
    base = `${base}/v1/blob`;
  }

  const url = `${base}/${encodeURIComponent(id)}`;

  const maybeFetch: unknown = (globalThis as unknown as { fetch?: unknown }).fetch;
  if (typeof maybeFetch !== 'function') {
    throw new Error('fetch is not available in this runtime');
  }

  // Avoid logging secrets; only log in non-production and without token
  const safeLogUrl = () => (process.env.NODE_ENV === 'production' ? '<redacted>' : url);

  try {
    if (process.env.NODE_ENV !== 'production') console.log('saveSession: attempting initial PUT', { url: safeLogUrl(), id });
    const res = await (maybeFetch as typeof fetch)(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => 'unable to read response body');
  if (process.env.NODE_ENV !== 'production') console.log('saveSession: PUT response', { status: res.status, ok: res.ok, bodyHint: String(text).slice(0, 200) });

      // If the blob API responds with 404 it's common that a create-upload flow is required.
      if (res.status === 404) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('saveSession PUT returned 404, attempting create-upload fallback', safeLogUrl());
          console.log('saveSession: create-upload POST to base', base);
        }

        // Try create-upload flow: POST to base to request an upload URL, then PUT to that URL.
        try {
          const createRes = await (maybeFetch as typeof fetch)(base, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // Provide minimal metadata the API might expect. Keep fields generic.
              filename: `${id}.json`,
              contentType: 'application/json',
              size: Buffer.byteLength(JSON.stringify(data), 'utf-8'),
            }),
          });

          // Safely attempt to read both JSON and raw text from the response so we can
          // include helpful diagnostic hints in preview logs when the remote service
          // returns unexpected shapes. Some test mocks implement only `json()` or
          // only `text()`, so attempt both in a defensive order (json preferred).
          let createJson: unknown = undefined;
          let createText = '';
          try {
            const maybeClone = typeof (createRes as Response).clone === 'function' ? (createRes as Response).clone() : createRes;
            const respForJson = maybeClone as unknown as { json?: () => Promise<unknown> };
            if (typeof respForJson.json === 'function') {
              createJson = await respForJson.json().catch(() => undefined);
            }
          } catch {
            createJson = undefined;
          }
          try {
            const maybeClone = typeof (createRes as Response).clone === 'function' ? (createRes as Response).clone() : createRes;
            const respForText = maybeClone as unknown as { text?: () => Promise<string> };
            if (typeof respForText.text === 'function') {
              createText = await respForText.text().catch(() => '');
            }
          } catch {
            createText = '';
          }

          // If we couldn't read text but did parse JSON, create a text preview from it
          if (!createText && createJson) {
            try {
              createText = JSON.stringify(createJson);
            } catch {
              createText = '';
            }
          }

          if (process.env.NODE_ENV !== 'production') {
            // Collect a safe subset of headers for debugging (avoid exposing auth headers)
            const safeHeaders: Record<string, string | null> = {};
            // Common header keys we'd like to inspect (avoid exposing sensitive ones)
            const keys = ['location', 'content-type', 'content-length'];
            for (const k of keys) {
              try {
                const headersObj = (createRes as Response).headers as Headers | undefined;
                const v = headersObj && typeof headersObj.get === 'function' ? headersObj.get(k) : null;
                if (v != null && !k.toLowerCase().includes('authorization') && !k.toLowerCase().includes('token')) {
                  safeHeaders[k] = v;
                }
              } catch {
                // ignore per-header errors
              }
            }
            console.log('saveSession: create response', { status: createRes.status, headers: safeHeaders, body: createJson ?? '<non-json or empty>', textPreview: String(createText).slice(0, 1000) });
          }

          // The create response may provide a direct upload URL under several common keys,
          // or might only return an `id` which we can PUT to at `${base}/{id}`.
          let uploadUrl: string | undefined;
          let createdId: string | undefined;

          if (createJson && typeof createJson === 'object') {
            const cj = createJson as Record<string, unknown>;
            // Common direct upload URL keys
            uploadUrl = (cj.uploadURL as string | undefined) ?? (cj.upload_url as string | undefined) ?? (cj.url as string | undefined);

            // Nested variations (some APIs return { data: { uploadURL } } or { result: { upload_url } })
            if (!uploadUrl) {
              const maybeData = cj.data as Record<string, unknown> | undefined;
              const maybeResult = cj.result as Record<string, unknown> | undefined;
              uploadUrl = maybeData?.uploadURL as string | undefined ?? maybeData?.upload_url as string | undefined ?? maybeResult?.uploadURL as string | undefined ?? maybeResult?.upload_url as string | undefined;
            }

            // Some APIs return only an id (or name) for the created blob; try to use it.
            if (!uploadUrl) {
              const idCandidate = (cj.id as string | undefined) ?? (cj.name as string | undefined);
              if (typeof idCandidate === 'string' && idCandidate.trim() !== '') createdId = idCandidate;
            }
          }

          // If create didn't return JSON fields, some implementations provide a Location header or similar.
          if (!uploadUrl && !createdId) {
            const location = createRes.headers?.get?.('location') ?? createRes.headers?.get?.('Location');
            if (location && typeof location === 'string' && location.trim() !== '') {
              uploadUrl = location;
              if (process.env.NODE_ENV !== 'production') console.log('saveSession: create returned Location header, using as upload URL', uploadUrl.startsWith(base) ? '<internal>' : uploadUrl);
            }
          }

          // If we only got an id, attempt PUT to `${base}/{id}` which should succeed after creation.
          if (!uploadUrl && createdId) {
            uploadUrl = `${base.replace(/\/$/, '')}/${encodeURIComponent(createdId)}`;
            if (process.env.NODE_ENV !== 'production') console.log('saveSession: create returned id, attempting PUT to', uploadUrl);
          }

          // Some APIs respond with 2xx but no body; try PUT to the requested id as a last resort.
          if (!uploadUrl && !createdId && createRes.status >= 200 && createRes.status < 300) {
            const fallbackUrl = `${base.replace(/\/$/, '')}/${encodeURIComponent(id)}`;
            if (process.env.NODE_ENV !== 'production') console.log('saveSession: create returned empty body; attempting PUT to created id fallback', fallbackUrl);
            const fallbackRes = await (maybeFetch as typeof fetch)(fallbackUrl, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            if (fallbackRes.ok) {
              if (process.env.NODE_ENV !== 'production') console.log('saveSession: stored to blob via fallback PUT', fallbackUrl);
              return { id, url: fallbackUrl, storage: 'blob' };
            }
            if (process.env.NODE_ENV !== 'production') {
              const fbText = await fallbackRes.text().catch(() => '');
              console.warn('saveSession: fallback PUT failed', { status: fallbackRes.status, bodyHint: String(fbText).slice(0, 200) });
            }
          }

          if (uploadUrl && typeof uploadUrl === 'string') {
            if (process.env.NODE_ENV !== 'production') console.log('saveSession: attempting upload PUT', { uploadUrl: uploadUrl.startsWith(base) ? '<internal>' : '<presigned>' });
            const uploadRes = await (maybeFetch as typeof fetch)(uploadUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                // Some upload URLs are presigned and must not include auth; others may accept token
                ...(uploadUrl.startsWith(base) ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(data),
            });

            if (!uploadRes.ok) {
              const text2 = await uploadRes.text().catch(() => 'unable to read upload response');
              const message = `Vercel Blob upload failed: ${uploadRes.status} ${text2}`;
              if (process.env.NODE_ENV !== 'production') console.error('saveSession upload', { message, uploadUrl: uploadUrl.startsWith(base) ? '<internal>' : uploadUrl });
              throw new Error(message);
            }

            if (process.env.NODE_ENV !== 'production') console.log('saveSession: stored to blob via upload URL', uploadUrl.startsWith(base) ? '<internal>' : uploadUrl);
            return { id: createdId ?? id, url: uploadUrl, storage: 'blob' };
          }

          // If create returned no upload URL or id, include its body and safe headers in
          // the hint to help debugging. We avoid printing authorization tokens here.
          const safeCreateBody = (() => {
            try {
              return createJson ?? (createText ? createText.slice(0, 1000) : '<empty>');
            } catch {
              return '<unserializable create body>';
            }
          })();
          const hint = `create-upload did not return an upload URL or id (${typeof safeCreateBody === 'string' ? safeCreateBody : JSON.stringify(safeCreateBody)})`;
          const message = `Vercel Blob write failed: ${res.status} ${text} — ${hint}`;
          if (process.env.NODE_ENV !== 'production') console.error('saveSession PUT', safeLogUrl(), message);
          throw new Error(message);
        } catch (createErr) {
          if (process.env.NODE_ENV !== 'production') console.error('saveSession: create-upload fallback failed', String(createErr));
          throw createErr;
        }
      }

      const message = `Vercel Blob write failed: ${res.status} ${text}`;
      if (process.env.NODE_ENV !== 'production') {
        console.error('saveSession PUT', safeLogUrl(), message);
      }
      throw new Error(message);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('saveSession: stored to blob at', safeLogUrl());
    }

    return { id, url, storage: 'blob' };
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('saveSession: unexpected error while saving to blob', { url: safeLogUrl(), error: String(err) });
    }
    throw err;
  }
}

export async function getSession(
  id: string,
  opts?: { forceNetwork?: boolean }
): Promise<StoredSession | null> {
  const isTest = process.env.NODE_ENV === 'test';
  const isDev = process.env.NODE_ENV === 'development';

  // In test runs, ALWAYS use local storage to avoid network communication with Vercel Blob
  // unless explicitly forced for targeted network-path tests.
  if (isTest && !opts?.forceNetwork) return getSessionFromLocal(id);

  // Prefer SDK read in non-test environments to avoid REST endpoint/version mismatches
  // and leverage the public URL (we write with access: 'public'). This path does not
  // require BLOB_BASE_URL and is more robust in preview/prod.
  if (!isTest) {
    try {
  const blobMod = (await import('@vercel/blob')) as unknown as {
        head?: (name: string, opts?: unknown) => Promise<{ url?: string } | unknown>;
        list?: (opts?: { prefix?: string; limit?: number; cursor?: string }) => Promise<{ blobs?: Array<{ pathname?: string; url?: string }> }>;
      };
      const nameCandidates = [`${id}.json`, `${id}`];
  const sdkToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN_DEV || undefined;
      for (const name of nameCandidates) {
        try {
          let url: string | undefined;
          if (typeof blobMod.head === 'function') {
            // head() throws on not found; returns { url, ... } when it exists
    const info = await blobMod.head(name as string, sdkToken ? { token: sdkToken } : undefined);
            url = (info as { url?: string } | undefined)?.url;
          }
          // Fallback to list() to discover public URL when head() is unavailable
          if (!url && typeof blobMod.list === 'function') {
            const listed = await blobMod.list({ prefix: name });
            const match = (listed?.blobs ?? []).find(b => b.pathname === name || (b.pathname ?? '').endsWith(name));
            url = match?.url;
          }
          if (!url) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('getSession: SDK head returned no url for', name);
            }
            continue;
          }
          const res = await fetch(url, { method: 'GET' });
          if (!res.ok) {
            if (process.env.NODE_ENV !== 'production') {
              const txt = await res.text().catch(() => '');
              console.warn('getSession: public URL fetch not ok', { name, status: res.status, hint: String(txt).slice(0, 200) });
            }
            continue;
          }
          const json = await res.json().catch(() => null as unknown);
          if (json && typeof json === 'object' && 'sessionData' in json && 'metadata' in json) {
            if (process.env.NODE_ENV !== 'production') {
              console.log('getSession: loaded via SDK/public URL', { name });
            }
            return json as StoredSession;
          }
          if (process.env.NODE_ENV !== 'production') {
            console.warn('getSession: invalid JSON shape from public URL', { name });
          }
        } catch (sdkErr) {
          // On 404 or other errors, try next candidate
          if (process.env.NODE_ENV !== 'production') {
            console.warn('getSession: SDK head failed for candidate', { name, err: String(sdkErr) });
          }
          continue;
        }
      }
      // If SDK path didn't resolve anything, fall through to REST fallback below
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('getSession: failed to use @vercel/blob SDK, falling back to REST', String(e));
      }
    }
  }

  // Prefer dev-specific env vars when running in development
  const token = isDev && process.env.BLOB_READ_WRITE_TOKEN_DEV ? process.env.BLOB_READ_WRITE_TOKEN_DEV : process.env.BLOB_READ_WRITE_TOKEN;
  const base = isDev && process.env.BLOB_BASE_URL_DEV ? process.env.BLOB_BASE_URL_DEV : process.env.BLOB_BASE_URL;

  if (!token || !base) {
    throw new Error('Vercel Blob not configured. Set BLOB_READ_WRITE_TOKEN and BLOB_BASE_URL');
  }
  // Normalize base for GET as well
  let effectiveBase = base.replace(/\/$/, '');
  if (/^https?:\/\/[^/]+$/.test(effectiveBase)) {
    effectiveBase = `${effectiveBase}/v1/blob`;
  }

  const maybeFetch: unknown = (globalThis as unknown as { fetch?: unknown }).fetch;
  if (typeof maybeFetch !== 'function') {
    throw new Error('fetch is not available in this runtime');
  }

  // Note: We intentionally avoid SDK listing here to keep dependencies light and tests simple.
  // We rely on REST with Authorization and try both naming variants below.

  // Try common name variants in order: `${id}.json` (SDK put) then `${id}` (legacy REST)
  const candidates = [
    `${effectiveBase}/${encodeURIComponent(id)}.json`,
    `${effectiveBase}/${encodeURIComponent(id)}`,
  ];

  let lastError: Error | null = null;
  for (const url of candidates) {
    try {
      const res = await (maybeFetch as typeof fetch)(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        // Try next candidate
        if (process.env.NODE_ENV !== 'production') {
          console.warn('getSession: candidate not found', url);
        }
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => 'unable to read response body');
        const message = `Vercel Blob read failed: ${res.status} ${text}`;
        if (process.env.NODE_ENV !== 'production') {
          console.error('getSession GET', (String(process.env.NODE_ENV) === 'production' ? '<redacted>' : url), message);
        }
        lastError = new Error(message);
        continue;
      }

      const json = await res.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('getSession: loaded from blob', url);
      }
      // Basic shape validation
      if (json && typeof json === 'object' && 'sessionData' in json && 'metadata' in json) {
        return json as StoredSession;
      }
      // If shape invalid, try next candidate
      if (process.env.NODE_ENV !== 'production') {
        console.warn('getSession: invalid shape from blob', url);
      }
    } catch (err) {
      lastError = err as Error;
      if (process.env.NODE_ENV !== 'production') {
        console.error('getSession: error while fetching candidate', url, String(err));
      }
    }
  }

  if (lastError) {
    // If all candidates failed with non-404 errors, surface the last one for diagnostics
    // Otherwise, return null for genuine not-found
    // We can't know definitively if 404 vs other without tracking, but we set lastError only
    // on non-OK responses and exceptions; candidates that 404 simply continue without setting error.
    // So if lastError is set and no candidate succeeded, throw it; else return null.
    // However, above we also set lastError on non-OK responses; that's desired.
    throw lastError;
  }
  return null;
}
