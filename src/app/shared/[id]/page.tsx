import React from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '../../../utils/sessionSharing/storage';
import Summary from '@/components/feature/Summary';
import Timeline from '@/components/feature/Timeline';
import type { StoredSession } from '@/types/sessionSharing';
import ShareControls from '@/components/ShareControls';
import { Card, Col, Row } from 'react-bootstrap';

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
    // Prefer colors from stored data (theme-aware or resolved) for fidelity
    colors: (e as { colors?: unknown }).colors as
      | { background: string; text: string; border: string }
      | { light: { background: string; text: string; border: string }; dark: { background: string; text: string; border: string } }
      | undefined,
  }));

  const totalDuration = data.sessionData.plannedTime ?? 0;
  const elapsedTime = data.sessionData.timeSpent ?? 0;
  const isTimeUp = data.sessionData.sessionType === 'timeUp';
  const allActivitiesCompleted = data.sessionData.sessionType === 'completed';

  return (
    <div style={{ padding: 20 }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 className="h3 mb-0">Shared Session</h1>
          <small className="text-muted">Created: {data.metadata.createdAt}</small>
        </div>
        <div className="ms-auto">
          {/* Build shareUrl from NEXT_PUBLIC_BASE_URL if present so copy/open works in different environments */}
          <ShareControls
            shareUrl={
              (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}` : '') +
              `/shared/${data.metadata.id}`
            }
          />
        </div>
      </div>

      <Row className="mt-3 g-3">
        <Col xs={12} lg={6}>
          <section>
            <Summary
              entries={entries}
              totalDuration={totalDuration}
              elapsedTime={elapsedTime}
              timerActive={false}
              allActivitiesCompleted={allActivitiesCompleted}
              isTimeUp={isTimeUp}
            />
          </section>
        </Col>
        <Col xs={12} lg={6} className="d-none d-lg-block">
          <section>
            <Card className="h-100">
              <Card.Header className="card-header-consistent">
                <h5 className="mb-0">Timeline</h5>
              </Card.Header>
              <Card.Body>
                <Timeline 
                  entries={entries} 
                  totalDuration={totalDuration} 
                  elapsedTime={elapsedTime} 
                  isTimeUp={isTimeUp}
                  hideHeader
                />
              </Card.Body>
            </Card>
          </section>
        </Col>
      </Row>
    </div>
  );
}
