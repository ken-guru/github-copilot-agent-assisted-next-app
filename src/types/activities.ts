export type ActivityStatusType = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'REMOVED';

export interface ActivityState {
  id: string;
  state: ActivityStatusType;
  startedAt: number | null;
  completedAt: number | null;
  removedAt: number | null;
}