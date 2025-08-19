import { z } from 'zod';

export const ActivitySummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  duration: z.number().int().nonnegative(),
  colorIndex: z.number().int().nonnegative(),
});

export const SkippedActivitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
});

export const SharedTimelineEntrySchema = z.object({
  id: z.string().min(1),
  activityId: z.string().nullable(),
  activityName: z.string().nullable(),
  startTime: z.number().int().nonnegative(),
  endTime: z.number().int().nullable(),
  colorIndex: z.number().int().optional(),
});

export const SessionTypeSchema = z.union([z.literal('completed'), z.literal('timeUp')]);

export const SessionSummaryDataSchema = z.object({
  plannedTime: z.number().int().nonnegative(),
  timeSpent: z.number().int().nonnegative(),
  overtime: z.number().int().nonnegative(),
  idleTime: z.number().int().nonnegative(),

  activities: z.array(ActivitySummarySchema),
  skippedActivities: z.array(SkippedActivitySchema),
  timelineEntries: z.array(SharedTimelineEntrySchema),

  completedAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: 'completedAt must be a valid ISO timestamp',
  }),
  sessionType: SessionTypeSchema,

  originalSessionId: z.string().uuid().optional(),
  derivedSessionIds: z.array(z.string().uuid()).optional(),
});

export const SessionMetadataSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
  expiresAt: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
  version: z.string().min(1),
  userAgent: z.string().optional(),
});

export const StoredSessionSchema = z.object({
  sessionData: SessionSummaryDataSchema,
  metadata: SessionMetadataSchema,
});

export type SessionSummaryData = z.infer<typeof SessionSummaryDataSchema>;
export type StoredSession = z.infer<typeof StoredSessionSchema>;

export function validateSessionSummaryData(data: unknown) {
  return SessionSummaryDataSchema.parse(data);
}

export function validateStoredSession(data: unknown) {
  return StoredSessionSchema.parse(data);
}
