import { getSession } from '../../sessionSharing/storage';

const realEnv = process.env as NodeJS.ProcessEnv;
const realFetch: typeof fetch | undefined = global.fetch as unknown as typeof fetch | undefined;

function makeStored(id: string) {
  return {
    sessionData: {
      plannedTime: 60,
      timeSpent: 10,
      overtime: 0,
      idleTime: 0,
      activities: [],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: new Date().toISOString(),
      sessionType: 'completed',
    },
    metadata: {
      id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      version: '1',
    },
  };
}

describe('getSession (network variants)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...realEnv };
    process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
    process.env.BLOB_BASE_URL = 'https://api.vercel.com/v1/blob';
    // NODE_ENV is 'test' by default in Jest; we pass { forceNetwork: true } to bypass local path
  });

  afterEach(() => {
    process.env = realEnv;
  (global as unknown as { fetch?: typeof fetch }).fetch = realFetch;
  });

  it('tries id.json first then id - returns from .json when available', async () => {
    const id = 'aaaa1111-2222-4333-8444-aaaaaaaaaaaa';
    const base = (process.env.BLOB_BASE_URL as string).replace(/\/$/, '');
    const urlJson = `${base}/${encodeURIComponent(id)}.json`;
    const urlPlain = `${base}/${encodeURIComponent(id)}`;

    const json = makeStored(id);

    const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
      const makeRes = (status: number, body: unknown) => ({
        ok: status >= 200 && status < 300,
        status,
        headers: new Map<string, string>(),
        json: async () => body,
        text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
      });
      if (String(url) === urlJson) {
        return makeRes(200, json);
      }
      if (String(url) === urlPlain) {
        return makeRes(404, 'not found');
      }
      return makeRes(500, 'unexpected url');
    });
  (global as unknown as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;

    const res = await getSession(id, { forceNetwork: true });
    expect(res).toBeTruthy();
    expect(res?.metadata.id).toBe(id);
    expect(fetchMock).toHaveBeenCalledWith(urlJson, expect.any(Object));
  });

  it('falls back to id when id.json is 404', async () => {
    const id = 'bbbb1111-2222-4333-8444-bbbbbbbbbbbb';
    const base = (process.env.BLOB_BASE_URL as string).replace(/\/$/, '');
    const urlJson = `${base}/${encodeURIComponent(id)}.json`;
    const urlPlain = `${base}/${encodeURIComponent(id)}`;
    const json = makeStored(id);

    const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
      const makeRes = (status: number, body: unknown) => ({
        ok: status >= 200 && status < 300,
        status,
        headers: new Map<string, string>(),
        json: async () => body,
        text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
      });
      if (String(url) === urlJson) {
        return makeRes(404, 'not found');
      }
      if (String(url) === urlPlain) {
        return makeRes(200, json);
      }
      return makeRes(500, 'unexpected url');
    });
  (global as unknown as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;

    const res = await getSession(id, { forceNetwork: true });
    expect(res).toBeTruthy();
    expect(res?.metadata.id).toBe(id);
    expect(fetchMock).toHaveBeenCalledWith(urlJson, expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith(urlPlain, expect.any(Object));
  });

  it('returns null when both id.json and id return 404', async () => {
    const id = 'cccc1111-2222-4333-8444-cccccccccccc';
    const base = (process.env.BLOB_BASE_URL as string).replace(/\/$/, '');
    const urlJson = `${base}/${encodeURIComponent(id)}.json`;
    const urlPlain = `${base}/${encodeURIComponent(id)}`;

    const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
      const makeRes = (status: number, body: unknown) => ({
        ok: status >= 200 && status < 300,
        status,
        headers: new Map<string, string>(),
        json: async () => body,
        text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
      });
      if (String(url) === urlJson || String(url) === urlPlain) {
        return makeRes(404, 'not found');
      }
      return makeRes(500, 'unexpected url');
    });
  (global as unknown as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;

    const res = await getSession(id, { forceNetwork: true });
    expect(res).toBeNull();
  });

  it('throws when non-404 error occurs for all candidates', async () => {
    const id = 'dddd1111-2222-4333-8444-dddddddddddd';
    const base = (process.env.BLOB_BASE_URL as string).replace(/\/$/, '');
    const urlJson = `${base}/${encodeURIComponent(id)}.json`;
    const urlPlain = `${base}/${encodeURIComponent(id)}`;

    const fetchMock = jest.fn(async (url: RequestInfo | URL) => {
      const makeRes = (status: number, body: unknown) => ({
        ok: status >= 200 && status < 300,
        status,
        headers: new Map<string, string>(),
        json: async () => body,
        text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
      });
      if (String(url) === urlJson || String(url) === urlPlain) {
        return makeRes(500, 'server error');
      }
      return makeRes(500, 'unexpected url');
    });
  (global as unknown as { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;

    await expect(getSession(id, { forceNetwork: true })).rejects.toThrow(/Vercel Blob read failed: 500/);
  });
});
