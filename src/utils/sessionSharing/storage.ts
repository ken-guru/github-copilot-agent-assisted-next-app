import fs from 'fs';
import path from 'path';
import { StoredSession } from '../../types/sessionSharing';

const LOCAL_STORE_DIR = path.join(process.cwd(), '.vercel_blob_store');

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_STORE_DIR)) {
    fs.mkdirSync(LOCAL_STORE_DIR, { recursive: true });
  }
}

export async function saveSessionToLocal(id: string, data: StoredSession) {
  ensureLocalDir();
  const filePath = path.join(LOCAL_STORE_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return { id, url: `file://${filePath}` };
}

export async function getSessionFromLocal(id: string): Promise<StoredSession | null> {
  const filePath = path.join(LOCAL_STORE_DIR, `${id}.json`);
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
    const fetchFn = (globalThis as any).fetch;
    if (typeof fetchFn !== 'function') {
      throw new Error('fetch is not available in this runtime');
    }
    const res = await fetchFn(url, {
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
    return { id, url };
  }
  return saveSessionToLocal(id, data);
}

export async function getSession(id: string): Promise<StoredSession | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const base = process.env.BLOB_BASE_URL;
  if (token && base) {
    const url = `${base.replace(/\/$/, '')}/${id}`;
    const fetchFn = (globalThis as any).fetch;
    if (typeof fetchFn !== 'function') {
      throw new Error('fetch is not available in this runtime');
    }
    const res = await fetchFn(url, {
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
    return json as StoredSession;
  }
  return getSessionFromLocal(id);
}
