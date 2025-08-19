export function generateShareId(): string {
  // crypto.randomUUID is available in Node 18+ and modern browsers
  const maybeCrypto = (globalThis as unknown) as {
    crypto?: { randomUUID?: () => string };
  };
  if (maybeCrypto.crypto && typeof maybeCrypto.crypto.randomUUID === 'function') {
    return maybeCrypto.crypto.randomUUID();
  }
  // Fallback: simple UUID v4 generator (not cryptographically secure)
  // Prefer to use crypto.randomUUID in production (Vercel Node 18+ supports it)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
