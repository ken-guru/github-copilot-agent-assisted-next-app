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

export async function saveSessionToLocal(id: string, data: StoredSession) {
  const filePath = getLocalFilePath(id);
  // Write synchronously to avoid lifecycle complexities in serverless handlers/tests
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return { id, url: `file://${filePath}` };
}

export async function getSessionFromLocal(id: string): Promise<StoredSession | null> {
  const filePath = getLocalFilePath(id);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as StoredSession;
}

export async function saveSession(id: string, data: StoredSession) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const base = process.env.BLOB_BASE_URL;
  if (token && base) {
    // Write to Vercel Blob: PUT {base}/{id}
    const url = `${base.replace(/\/$/, '')}/${id}`;
    const maybeFetch: unknown = (globalThis as unknown as { fetch?: unknown }).fetch;
    if (typeof maybeFetch !== 'function') {
      throw new Error('fetch is not available in this runtime');
    }
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
        const text = await res.text();
        // Treat as fallback to local store rather than hard failure so preview deployments
        // without blob write permissions still work (local store is ephemeral but useful for preview).
        console.warn(`Vercel Blob write failed: ${res.status} ${text}; falling back to local store.`);
        return saveSessionToLocal(id, data);
      }
      console.log('saveSession: stored to blob at', url.replace(/:\/\/.*@/, ''));
      return { id, url };
    } catch (err) {
      // Network/fetch/runtime error: fallback to local store
      console.warn('saveSession: blob write failed, falling back to local store.', (err as Error).message);
      return saveSessionToLocal(id, data);
    }
  }
  return saveSessionToLocal(id, data);
}

export async function getSession(id: string): Promise<StoredSession | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const base = process.env.BLOB_BASE_URL;
  if (token && base) {
    const url = `${base.replace(/\/$/, '')}/${id}`;
    const maybeFetch: unknown = (globalThis as unknown as { fetch?: unknown }).fetch;
    if (typeof maybeFetch !== 'function') {
      throw new Error('fetch is not available in this runtime');
    }
    try {
      const res = await (maybeFetch as typeof fetch)(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        const text = await res.text();
        console.warn(`Vercel Blob read failed: ${res.status} ${text}; falling back to local store.`);
        return getSessionFromLocal(id);
      }
      const json = await res.json();
      console.log('getSession: loaded from blob', url);
      return json as StoredSession;
    } catch (err) {
      console.warn('getSession: blob read failed, falling back to local store.', (err as Error).message);
      return getSessionFromLocal(id);
    }
  }
  return getSessionFromLocal(id);
}
