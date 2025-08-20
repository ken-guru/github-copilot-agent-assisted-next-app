/*
  fetchWithVercelBypass
  - Client-safe helper that retries once with Vercel Deployment Protection bypass.
  - If the first request returns 401 or the HTML auth page, we attempt to set the
    bypass cookie using the token from env (exposed as NEXT_PUBLIC_VERCEL_BYPASS_TOKEN)
    and then retry the original request.
  - In local dev/tests, it behaves like a normal fetch.
*/

export interface FetchWithBypassOptions extends RequestInit {
  // If provided, overrides the env token for this call
  vercelBypassToken?: string;
  // When true, skip using bypass even if token exists
  skipBypass?: boolean;
}

function looksLikeVercelAuthHtml(text: string): boolean {
  // Heuristic based on the page title and script note present in the provided HTML
  return text.includes('<title>Authentication Required</title>') && text.includes('x-vercel-protection-bypass');
}

// Type guard for Headers instance
function isHeadersInstance(obj: unknown): obj is Headers {
  return typeof obj === 'object' && obj !== null && typeof (obj as Headers).get === 'function';
}

// Type guard for plain object map
function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function getContentType(headers: Headers | Record<string, unknown> | undefined): string {
  if (!headers) return '';
  try {
    if (isHeadersInstance(headers)) {
      const v = headers.get('content-type');
      return typeof v === 'string' ? v : '';
    }
  } catch {
    // ignore and fall through
  }
  try {
  if (isPlainObject(headers)) {
      const keys = Object.keys(headers);
      const ctKey = keys.find((k) => k.toLowerCase() === 'content-type');
      if (!ctKey) return '';
      const rawVal = headers[ctKey];
      if (typeof rawVal === 'string') return rawVal;
      if (Array.isArray(rawVal)) {
        const firstStr = rawVal.find((v) => typeof v === 'string');
        if (typeof firstStr === 'string') return firstStr;
      }
      if (rawVal != null && (typeof rawVal === 'number' || typeof rawVal === 'boolean')) {
        return String(rawVal);
      }
    }
  } catch {
    // ignore
  }
  return '';
}

export async function fetchWithVercelBypass(input: RequestInfo | URL, init?: FetchWithBypassOptions): Promise<Response> {
  // First attempt
  const res1 = await fetch(input, init);
  // Only attempt bypass on the client and when token is available
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  // IMPORTANT: Avoid optional chaining on process.env so Next can inline during build
  const token = init?.vercelBypassToken || (process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN as string | undefined);

  // Detect if a 200 HTML auth page was returned (preview protection renders HTML with 200)
  let isAuthHtml200 = false;
  if (res1.ok && isBrowser && !init?.skipBypass && token) {
    try {
      const ct = getContentType((res1 as Response).headers as unknown as Headers | Record<string, unknown>);
      if (ct && ct.toLowerCase().includes('text/html')) {
        const cloned = res1.clone();
        const text = await cloned.text();
        isAuthHtml200 = looksLikeVercelAuthHtml(text);
      }
    } catch {
      // ignore heuristics failures
    }
  }
  if (res1.ok && !isAuthHtml200) return res1;

  if (!isBrowser) return res1;
  if (init?.skipBypass) return res1;
  if (!token) return res1;

  // Consider retry if 401 or HTML indicates auth page
  let shouldRetry = res1.status === 401 || isAuthHtml200;
  if (!shouldRetry) {
    try {
      const cloned = res1.clone();
      const text = await cloned.text();
      shouldRetry = looksLikeVercelAuthHtml(text);
    } catch {
      // ignore
    }
  }
  if (!shouldRetry) return res1;

  try {
    // Build current origin and path for setting cookie via GET redirect
    const href = typeof input === 'string' ? input : input instanceof URL ? input.href : '';
    const target = href && href.startsWith('http') ? new URL(href) : new URL(window.location.href);

    // Hit the same-origin bypass endpoint that sets the cookie via redirect
    // The endpoint will redirect to the provided next URL while setting the bypass cookie
    const nextUrl = encodeURIComponent(target.pathname + target.search);
    const bypassUrl = `/api/vercel-bypass?next=${nextUrl}&token=${encodeURIComponent(token)}`;
    await fetch(bypassUrl, { method: 'GET', credentials: 'include' });
  } catch {
    // ignore bypass failure and fall through to retry
  }

  // Retry once after attempting to set the cookie
  return fetch(input, { ...init, credentials: init?.credentials || 'include' });
}

export default fetchWithVercelBypass;
