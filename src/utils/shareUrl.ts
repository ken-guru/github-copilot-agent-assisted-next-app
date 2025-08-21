/**
 * Utilities for working with share URLs and IDs.
 */

/**
 * Extract the share id from a share URL's last path segment.
 * Accepts absolute URLs, relative paths, and bare ids.
 */
export function extractShareIdFromUrl(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') return null;
    // If it already looks like a bare id (no slashes or query/hash), return as-is
    if (!url.includes('/') && !url.includes('?') && !url.includes('#')) {
      return url.trim() || null;
    }

    // Use URL parsing when possible; fallback to simple split for relative paths
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const u = new URL(url, base);
    const pathname = u.pathname || '';
    const segments = pathname.split('/').filter(Boolean);
    const id = segments.length ? segments[segments.length - 1] : '';
    return id && id.length > 0 ? id : null;
  } catch {
    try {
      const normalized = url.trim();
      const withoutHash = normalized.split('#')[0] || '';
      const withoutQuery = withoutHash.split('?')[0] || '';
      const parts = withoutQuery.split('/').filter(Boolean);
      const id = parts.length ? parts[parts.length - 1] : '';
      return id && id.length > 0 ? id : null;
    } catch {
      return null;
    }
  }
}
