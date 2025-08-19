import path from 'path';
import { promises as fs } from 'fs';

// Mock next/server NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({ status: init?.status ?? 200, json: async () => body }),
  },
}));

describe('GET /api/sessions/[id]', () => {
  it('returns 400 for invalid id', async () => {
    const { GET } = await import('../route');
    const res = await GET({} as Request, { params: { id: '00000000-0000-0000-0000-000000000000' } });
    expect(res.status).toBe(400);
  });

  it('returns stored session for valid id', async () => {
    // Create a local stored file using the same local store directory
    const storeDir = path.join(process.cwd(), '.vercel_blob_store');
    await fs.mkdir(storeDir, { recursive: true });
    const id = '11111111-1111-4111-8111-111111111111';
    const filePath = path.join(storeDir, `${id}.json`);
    const stored = {
      sessionData: { plannedTime: 60, timeSpent: 60, overtime: 0, idleTime: 0, activities: [], skippedActivities: [], timelineEntries: [], completedAt: new Date().toISOString(), sessionType: 'completed' },
      metadata: { id, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), version: '1' }
    };
    await fs.writeFile(filePath, JSON.stringify(stored, null, 2), 'utf-8');

  const { GET } = await import('../route');
    const res = await GET({} as Request, { params: { id } });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.sessionData).toBeDefined();
  });

  it('returns 410 for expired session', async () => {
    const storeDir = path.join(process.cwd(), '.vercel_blob_store');
    await fs.mkdir(storeDir, { recursive: true });
    const id = '22222222-2222-4222-8222-222222222222';
    const filePath = path.join(storeDir, `${id}.json`);
    const stored = {
      sessionData: { plannedTime: 60, timeSpent: 60, overtime: 0, idleTime: 0, activities: [], skippedActivities: [], timelineEntries: [], completedAt: new Date().toISOString(), sessionType: 'completed' },
      metadata: { id, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), version: '1' }
    };
    await fs.writeFile(filePath, JSON.stringify(stored, null, 2), 'utf-8');

  const { GET } = await import('../route');
    const res = await GET({} as Request, { params: { id } });
    expect(res.status).toBe(410);
  });
});
