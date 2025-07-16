/**
 * Activity interface for customizable activity management
 * @see docs/components/activity-storage.md
 */
export interface Activity {
  id: string; // UUID for unique identification
  name: string;
  description?: string;
  colorIndex: number; // Maintains compatibility with existing theme system
  createdAt: string; // ISO timestamp
  isActive: boolean; // Soft deletion support
}

/**
 * Default activities for first run and fallback
 */
export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: '1',
    name: 'Homework',
    colorIndex: 0,
    description: 'Academic work and study time',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Reading',
    colorIndex: 1,
    description: 'Reading books, articles, or educational materials',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '3',
    name: 'Play Time',
    colorIndex: 2,
    description: 'Recreation and leisure activities',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '4',
    name: 'Chores',
    colorIndex: 3,
    description: 'Household tasks and responsibilities',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];
