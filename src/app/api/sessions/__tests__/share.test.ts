import { promises as fs } from 'fs';
import path from 'path';

// Mock next/server's NextResponse so importing the route handler doesn't pull in
// server-only globals (Request/Headers) during module initialization in Jest.
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ status: init?.status ?? 200, json: async () => body }),
  },
}));

describe('POST /api/sessions/share', () => {
  it('creates a share and returns URL', async () => {
    const body = {
      plannedTime: 3600,
      timeSpent: 3550,
      overtime: 0,
      idleTime: 50,
      activities: [{ id: 'a1', name: 'Task 1', duration: 1800, colorIndex: 1 }],
      skippedActivities: [],
      timelineEntries: [],
      completedAt: new Date().toISOString(),
      sessionType: 'completed',
    };

    // Dynamically import the route after mocking to avoid importing next/server at top-level
    const { POST } = await import('../../../api/sessions/share/route');

    // Minimal Request-like object that the handler expects
    const req = {
      json: async () => body,
      headers: { get: (_: string) => undefined },
    } as unknown as Request;

    // call handler
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.shareId).toBeDefined();
    expect(json.shareUrl).toBeDefined();

    // ensure local file written
    const filePath = path.join(process.cwd(), '.vercel_blob_store', `${json.shareId}.json`);
    const exists = await fs.stat(filePath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
