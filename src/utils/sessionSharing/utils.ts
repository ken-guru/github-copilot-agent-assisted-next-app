interface GlobalCryptoLike {
  crypto?: { randomUUID?: () => string };
}

export function generateShareId(): string {
  // Prefer native crypto.randomUUID when available (Node 18+ / modern browsers)
  // Use a narrow interface to avoid `any` and satisfy eslint rules.
  const g = globalThis as unknown as GlobalCryptoLike;
  if (typeof g.crypto?.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  // Fallback: Use crypto.getRandomValues if available (cryptographically secure)
  const anyGlobal = globalThis as unknown as { crypto?: { getRandomValues?: (arr: Uint8Array) => Uint8Array } };
  if (typeof anyGlobal.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    anyGlobal.crypto.getRandomValues(bytes);
  // Set version and variant bits for RFC4122 v4
  const b6 = bytes[6];
  const b8 = bytes[8];
  // Guard for unexpected undefined (shouldn't happen with fixed length)
  const v6 = typeof b6 === 'number' ? b6 : 0;
  const v8 = typeof b8 === 'number' ? b8 : 0;
  bytes[6] = (v6 & 0x0f) | 0x40; // version 4
  bytes[8] = (v8 & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return (
      hex.slice(0, 8) + '-' +
      hex.slice(8, 12) + '-' +
      hex.slice(12, 16) + '-' +
      hex.slice(16, 20) + '-' +
      hex.slice(20, 32)
    );
  }

  // If no secure RNG is available, only allow an insecure fallback in non-production (development/test).
  if (process.env.NODE_ENV !== 'production') {
    // Fallback: simple UUID v4 generator (not cryptographically secure)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // In production environments without secure RNG, fail fast to avoid weak IDs
  throw new Error('No secure random UUID generator available in this environment.');
}

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
