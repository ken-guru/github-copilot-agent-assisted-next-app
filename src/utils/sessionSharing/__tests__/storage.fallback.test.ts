import { saveSession } from '../storage';
import { StoredSession } from '../../../types/sessionSharing';

// Minimal stored session sample (includes required fields for types)
const sample: StoredSession = {
  sessionData: {
    plannedTime: 0,
    timeSpent: 0,
    overtime: 0,
    idleTime: 0,
    activities: [],
    skippedActivities: [],
    timelineEntries: [],
    completedAt: new Date().toISOString(),
    sessionType: 'completed',
  },
  metadata: {
    id: 'test-id',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    version: 'test',
  },
};

describe('saveSession blob flows', () => {
  const originalFetch = global.fetch;
  const originalBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const originalBlobBase = process.env.BLOB_BASE_URL;

  afterEach(() => {
    // restore global fetch
    (globalThis as unknown as { fetch?: typeof fetch }).fetch = originalFetch;
    jest.resetAllMocks();
  process.env.BLOB_READ_WRITE_TOKEN = originalBlobToken;
  process.env.BLOB_BASE_URL = originalBlobBase;
  });

  it('succeeds when direct PUT returns ok', async () => {
  // Ensure envs are present; force network path with option
  process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
  process.env.BLOB_BASE_URL = 'https://api.vercel.com/v1/blob';

  const mockPut = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
  (globalThis as unknown as { fetch?: typeof fetch }).fetch = mockPut;

  const res = await saveSession('direct-put-id', sample as StoredSession, { forceNetwork: true });
    expect(res.storage).toBe('blob');
    expect(mockPut).toHaveBeenCalledTimes(1);
    // ensure first call was a PUT
    const firstCall = mockPut.mock.calls[0];
    expect(firstCall[1].method).toBe('PUT');
  });

  it('falls back to create-upload when PUT returns 404 and upload succeeds', async () => {
  // Ensure envs set so saveSession performs network flow; force via option
  process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
  process.env.BLOB_BASE_URL = 'https://api.vercel.com/v1/blob';

  // First call: PUT -> 404
    // Second call: POST -> returns { uploadURL }
    // Third call: PUT -> 200
    const put404 = { ok: false, status: 404, text: async () => 'Blob not found' };
    const postCreate = { ok: true, status: 201, json: async () => ({ uploadURL: 'https://upload.example.com/upload-id' }) };
    const uploadPut = { ok: true, status: 200, text: async () => '' };

    const mockFetch = jest.fn()
      .mockResolvedValueOnce(put404)
      .mockResolvedValueOnce(postCreate)
      .mockResolvedValueOnce(uploadPut);

    (globalThis as unknown as { fetch?: typeof fetch }).fetch = mockFetch;

  const res = await saveSession('fallback-id', sample as StoredSession, { forceNetwork: true });
    expect(res.storage).toBe('blob');
    expect(res.url).toBe('https://upload.example.com/upload-id');
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // ensure sequence: PUT -> POST -> PUT
    expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
    expect(mockFetch.mock.calls[1][1].method).toBe('POST');
    expect(mockFetch.mock.calls[2][1].method).toBe('PUT');
  });

  it('handles create response that returns only an id and then PUT succeeds', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
    process.env.BLOB_BASE_URL = 'https://api.vercel.com/v1/blob';

    const put404 = { ok: false, status: 404, text: async () => 'Blob not found' };
    const postCreate = { ok: true, status: 201, json: async () => ({ id: 'created-123' }) };
    const uploadPut = { ok: true, status: 200, text: async () => '' };

    const mockFetch = jest.fn()
      .mockResolvedValueOnce(put404)
      .mockResolvedValueOnce(postCreate)
      .mockResolvedValueOnce(uploadPut);

    (globalThis as unknown as { fetch?: typeof fetch }).fetch = mockFetch;

    const res = await saveSession('created-id', sample as StoredSession, { forceNetwork: true });
    expect(res.storage).toBe('blob');
    // URL should point to the base/id constructed from create response
    expect(res.url).toBe('https://api.vercel.com/v1/blob/created-123');
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
    expect(mockFetch.mock.calls[1][1].method).toBe('POST');
    expect(mockFetch.mock.calls[2][1].method).toBe('PUT');
  });
});
