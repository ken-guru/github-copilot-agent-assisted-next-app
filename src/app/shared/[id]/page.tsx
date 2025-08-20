import React from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '../../../utils/sessionSharing/storage';
import Summary from '@/components/feature/Summary';
import Timeline from '@/components/feature/Timeline';
import type { StoredSession } from '@/types/sessionSharing';
import ShareControls from '@/components/ShareControls';

type Props = { params: { id: string } };

export default async function SharedPage({ params }: Props) {
  const id = params.id;
  const stored = await getSession(id);
  if (!stored) return notFound();

  const dataCandidate = stored as unknown;
  if (!dataCandidate || typeof dataCandidate !== 'object' || !('sessionData' in dataCandidate) || !('metadata' in dataCandidate)) {
    // Unexpected shape — treat as not found
    return notFound();
  }

  const data = dataCandidate as StoredSession;

  // Map stored.sessionData to Timeline entries expected by components
  const entries = (data.sessionData.timelineEntries || []).map((e) => ({
    id: e.id,
    activityId: e.activityId ?? null,
    activityName: e.activityName ?? null,
    startTime: e.startTime,
    endTime: e.endTime ?? null,
  }));

  const totalDuration = data.sessionData.plannedTime ?? 0;
  const elapsedTime = data.sessionData.timeSpent ?? 0;
  const isTimeUp = data.sessionData.sessionType === 'timeUp';
  const allActivitiesCompleted = data.sessionData.sessionType === 'completed';

  return (
    <div style={{ padding: 20 }}>
      <h1>Shared Session</h1>
      <p>Created: {data.metadata.createdAt}</p>

      <div style={{ marginTop: 8 }}>
        {/* Build shareUrl from NEXT_PUBLIC_BASE_URL if present so copy/open works in different environments */}
        <ShareControls
          shareUrl={
            (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}` : '') +
            `/shared/${data.metadata.id}`
          }
        />
      </div>

      <section style={{ marginTop: 16 }}>
        <Summary
          entries={entries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          timerActive={false}
          allActivitiesCompleted={allActivitiesCompleted}
          isTimeUp={isTimeUp}
        />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Timeline</h2>
        <Timeline entries={entries} totalDuration={totalDuration} elapsedTime={elapsedTime} isTimeUp={isTimeUp} />
      </section>
    </div>
  );
}
