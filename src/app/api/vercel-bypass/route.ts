import { NextResponse } from 'next/server';

// This route helps set Vercel protection bypass cookie in the browser by redirecting
// to the provided `next` path with the `x-vercel-set-bypass-cookie` and
// `x-vercel-protection-bypass` params.
//
// NOTE: You must define the bypass token in your environment for preview deployments.
// For client-side use, expose it with NEXT_PUBLIC_VERCEL_BYPASS_TOKEN.

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const next = url.searchParams.get('next') || '/';
    const token = url.searchParams.get('token') || process.env.VERCEL_PROTECTION_BYPASS || '';

    if (!token) {
      return NextResponse.json({ error: 'Bypass token not configured' }, { status: 501 });
    }

    const location = `${next}${next.includes('?') ? '&' : '?'}x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${encodeURIComponent(token)}`;
    return NextResponse.redirect(location);
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
