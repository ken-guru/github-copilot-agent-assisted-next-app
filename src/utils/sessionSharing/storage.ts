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
  // Write synchronously to avoid lifecycle complexities in serverless handlers/tests
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return { id, url: `file://${filePath}`, storage: 'local' };
}

export async function getSessionFromLocal(id: string): Promise<StoredSession | null> {
  const filePath = getLocalFilePath(id);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as StoredSession;
}

export async function saveSession(id: string, data: StoredSession): Promise<SaveResult> {
  const isTest = process.env.NODE_ENV === 'test';
  const isDev = process.env.NODE_ENV === 'development';

  // In test runs, ALWAYS use local storage to avoid network communication with Vercel Blob.
  if (isTest) return saveSessionToLocal(id, data);

  // Prefer dev-specific env vars when running in development
  const token = isDev && process.env.BLOB_READ_WRITE_TOKEN_DEV ? process.env.BLOB_READ_WRITE_TOKEN_DEV : process.env.BLOB_READ_WRITE_TOKEN;
  const base = isDev && process.env.BLOB_BASE_URL_DEV ? process.env.BLOB_BASE_URL_DEV : process.env.BLOB_BASE_URL;

  // Require blob config in non-test environments
  if (!token || !base) {
    throw new Error('Vercel Blob not configured. Set BLOB_READ_WRITE_TOKEN and BLOB_BASE_URL');
  }

  // Write to Vercel Blob: PUT {base}/{id} and surface any failures
  const url = `${base.replace(/\/$/, '')}/${id}`;
  const maybeFetch: unknown = (globalThis as unknown as { fetch?: unknown }).fetch;
  if (typeof maybeFetch !== 'function') {
    throw new Error('fetch is not available in this runtime');
  }

  const res = await (maybeFetch as typeof fetch)(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vercel Blob write failed: ${res.status} ${text}`);
  }

  console.log('saveSession: stored to blob at', url.replace(/:\/\/.*@/, ''));
  return { id, url, storage: 'blob' };
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

  const url = `${base.replace(/\/$/, '')}/${id}`;
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
    const text = await res.text();
    throw new Error(`Vercel Blob read failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  console.log('getSession: loaded from blob', url);
  return json as StoredSession;
}
