import { NextResponse } from 'next/server';
import { getSession } from '../../../../utils/sessionSharing/storage';
import { isValidUUID } from '../../../../utils/sessionSharing/utils';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || !isValidUUID(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const stored = await getSession(id);
    if (!stored) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const now = new Date();
    if (stored.metadata?.expiresAt && new Date(stored.metadata.expiresAt) < now) {
      return NextResponse.json({ error: 'Expired' }, { status: 410 });
    }

    return NextResponse.json(stored, { status: 200 });
  } catch (err) {
    const e = err as { message?: string } | undefined;
    return NextResponse.json({ error: e?.message ?? String(err) }, { status: 500 });
  }
}
