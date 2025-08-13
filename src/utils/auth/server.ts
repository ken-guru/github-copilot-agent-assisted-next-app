import { NextRequest } from 'next/server';

/**
 * SECURITY NOTE: This is a placeholder authentication function.
 * In production, this should be replaced with proper OAuth, JWT validation,
 * or other secure authentication mechanisms.
 * 
 * Current implementation allows all requests - DO NOT USE IN PRODUCTION.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ensureAuthenticated(_req: NextRequest | { cookies: { get: (name: string) => { value?: string } | undefined } }): { ok: true } | { ok: false; status: number; message: string } {
  // TEMPORARY: Allow all requests since the cookie-based auth is insecure
  // TODO: Implement proper authentication before production deployment
  return { ok: true };
}
