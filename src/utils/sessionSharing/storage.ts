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

      // If the blob API responds with 404 it's common that a create-upload flow is required.
      if (res.status === 404) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('saveSession PUT returned 404, attempting create-upload fallback', safeLogUrl());
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

          const createJson: unknown = await createRes.json().catch(() => ({}));

          // The create response may provide a direct upload URL under several common keys.
          let uploadUrl: string | undefined;
          if (createJson && typeof createJson === 'object') {
            const cj = createJson as Record<string, unknown>;
            const candidate = cj.uploadURL ?? cj.upload_url ?? cj.url;
            if (typeof candidate === 'string') uploadUrl = candidate;
          }

          if (uploadUrl && typeof uploadUrl === 'string') {
            const uploadRes = await (maybeFetch as typeof fetch)(uploadUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (!uploadRes.ok) {
              const text2 = await uploadRes.text().catch(() => 'unable to read upload response');
              const message = `Vercel Blob upload failed: ${uploadRes.status} ${text2}`;
              if (process.env.NODE_ENV !== 'production') console.error('saveSession upload', message);
              throw new Error(message);
            }

            if (process.env.NODE_ENV !== 'production') console.log('saveSession: stored to blob via upload URL', uploadUrl);
            return { id, url: uploadUrl, storage: 'blob' };
          }

          // If create returned no upload URL, include its body in the hint to help debugging.
          const hint = `create-upload did not return an upload URL (${JSON.stringify(createJson)})`;
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

export async function getSession(id: string): Promise<StoredSession | null> {
  const isTest = process.env.NODE_ENV === 'test';
  const isDev = process.env.NODE_ENV === 'development';

  // In test runs, ALWAYS use local storage to avoid network communication with Vercel Blob.
  if (isTest) return getSessionFromLocal(id);

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

  const url = `${effectiveBase}/${encodeURIComponent(id)}`;
  const maybeFetch: unknown = (globalThis as unknown as { fetch?: unknown }).fetch;
  if (typeof maybeFetch !== 'function') {
    throw new Error('fetch is not available in this runtime');
  }

  const res = await (maybeFetch as typeof fetch)(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

    if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => 'unable to read response body');
    const message = `Vercel Blob read failed: ${res.status} ${text}`;
    if (process.env.NODE_ENV !== 'production') {
      console.error('getSession GET', (String(process.env.NODE_ENV) === 'production' ? '<redacted>' : url), message);
    }
    throw new Error(message);
  }

  const json = await res.json();
  if (process.env.NODE_ENV !== 'production') {
    console.log('getSession: loaded from blob', url);
  }
  // Basic shape validation
  if (json && typeof json === 'object' && 'sessionData' in json && 'metadata' in json) {
    return json as StoredSession;
  }
  return null;
}
