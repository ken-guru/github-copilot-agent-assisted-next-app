/**
 * @jest-environment jsdom
 */
import { fetchWithVercelBypass } from '../fetchWithVercelBypass';

describe('fetchWithVercelBypass', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Simulate client environment
    const g = globalThis as unknown as {
      fetch?: jest.Mock;
      window?: { location: { href: string } };
      document?: object;
    };
    g.fetch = jest.fn();
    g.window = { location: { href: 'https://example.com/page' } };
    g.document = {};
  });

  afterEach(() => {
    const g = globalThis as unknown as {
      fetch?: unknown;
      window?: unknown;
      document?: unknown;
    };
    g.fetch = originalFetch as unknown as jest.Mock;
    delete g.window;
    delete g.document;
    jest.restoreAllMocks();
  });

  const makeRes = (options: { status: number; body?: string; headers?: Record<string, string> }) => {
    const body = options.body ?? '';
    return {
      status: options.status,
      ok: options.status >= 200 && options.status < 300,
      headers: options.headers || {},
      text: async () => body,
      clone: function () { return makeRes(options); },
    } as unknown as Response;
  };

  it('returns first successful response without bypass', async () => {
    const okRes = makeRes({ status: 200, body: JSON.stringify({ ok: true }) });
    (global.fetch as jest.Mock).mockResolvedValueOnce(okRes);

    const res = await fetchWithVercelBypass('/api/test');
    expect(res).toBe(okRes);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries once after 401 using bypass endpoint when token is provided', async () => {
    // First response: 401
  const res401 = makeRes({ status: 401, body: 'Unauthorized' });
    // Second response: success
  const res200 = makeRes({ status: 200, body: '{}' });

    // fetch call order:
    // 1) original request -> 401
    // 2) bypass endpoint call -> 200 (we can just return 200 empty)
    // 3) retried original request -> 200
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(res401)
  .mockResolvedValueOnce(makeRes({ status: 200, body: '' }))
      .mockResolvedValueOnce(res200);

  const prev = process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;
  process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN = 'test-token';

    const res = await fetchWithVercelBypass('/api/test');
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect((global.fetch as jest.Mock).mock.calls[1][0]).toMatch('/api/vercel-bypass');
  process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN = prev;
  });

  it('does not retry if no token is available', async () => {
  const res401 = makeRes({ status: 401, body: 'Unauthorized' });
    (global.fetch as jest.Mock).mockResolvedValueOnce(res401);

  delete process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;

    const res = await fetchWithVercelBypass('/api/test');
    expect(res.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries when HTML looks like Vercel auth page', async () => {
  const html = '<title>Authentication Required</title> ... x-vercel-protection-bypass=...';
  const resHtml = makeRes({ status: 200, body: html, headers: { 'content-type': 'text/html' } });
  const res200 = makeRes({ status: 200, body: '{}' });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(resHtml)
  .mockResolvedValueOnce(makeRes({ status: 200, body: '' }))
      .mockResolvedValueOnce(res200);

  const prev = process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;
  process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN = 'test-token';

    const res = await fetchWithVercelBypass('/api/test');
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN = prev;
  });
});
