import { NextRequest } from 'next/server';

export function ensureAuthenticated(req: NextRequest | { cookies: { get: (name: string) => { value?: string } | undefined } }): { ok: true } | { ok: false; status: number; message: string } {
  const authCookie = req.cookies?.get('ai_auth');
  if (!authCookie || authCookie.value !== '1') {
    return { ok: false, status: 401, message: 'Authentication required for AI features' };
  }
  return { ok: true };
}
