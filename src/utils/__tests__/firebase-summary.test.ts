// Top-level mocks for Firebase modules
jest.mock('../firebase', () => ({
  getFirebaseDatabase: jest.fn(() => ({})),
}));
jest.mock('firebase/database', () => ({
  ref: jest.fn(() => ({})),
  push: jest.fn(async () => {}),
}));

import { writeActivitySummary, ActivitySummary } from '../firebase-summary';
import { Activity } from '../../types/activity';

describe('writeActivitySummary', () => {
  it('should write a summary to Firebase (mocked)', async () => {
    const summary: ActivitySummary = {
      userId: 'test-user',
      timestamp: new Date().toISOString(),
      activities: [
        { id: '1', name: 'Test', colorIndex: 0, createdAt: new Date().toISOString(), isActive: true },
      ] as Activity[],
      totalDuration: 3600,
      elapsedTime: 3700,
      overtime: 100,
    };

    await expect(writeActivitySummary(summary)).resolves.toBeUndefined();
  });
});
