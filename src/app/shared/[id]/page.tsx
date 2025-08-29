import React from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '../../../utils/sessionSharing/storage';
import Summary from '@/components/Summary';
import Timeline from '@/components/Timeline';
import type { StoredSession } from '@/types/sessionSharing';
import ShareControls from '@/components/ShareControls';
import { internalActivityColors } from '@/utils/colors';

// In Next.js 15, dynamic route params are async; await them before use
type Props = { params: Promise<{ id: string }> };

export default async function SharedPage({ params }: Props) {
  const { id } = await params;
  const stored = await getSession(id);
  if (!stored) return notFound();

  const dataCandidate = stored as unknown;
  if (!dataCandidate || typeof dataCandidate !== 'object' || !('sessionData' in dataCandidate) || !('metadata' in dataCandidate)) {
    // Unexpected shape — treat as not found
    return notFound();
  }

  const data = dataCandidate as StoredSession;

  // Helper: best-effort normalization of entry colors into theme-aware variants
  type ColorSet = { background: string; text: string; border: string };
  type ThemeAware = { light: ColorSet; dark: ColorSet };
  const isThemeAware = (c: unknown): c is ThemeAware =>
    !!c && typeof c === 'object' && 'light' in (c as Record<string, unknown>) && 'dark' in (c as Record<string, unknown>);
  const isDirectSet = (c: unknown): c is ColorSet =>
    !!c && typeof c === 'object' && 'background' in (c as Record<string, unknown>) && 'text' in (c as Record<string, unknown>) && 'border' in (c as Record<string, unknown>);

  const trim = (s: string) => s.trim();
  const extractHue = (color: string): number | undefined => {
    try {
      const m = color.match(/hsl\((\d+)/i);
      if (m && m[1]) return Number(m[1]);
    } catch {
      // ignore
    }
    return undefined;
  };
  const normalizeColors = (c: unknown): ThemeAware | undefined => {
    if (!c) return undefined;
    if (isThemeAware(c)) return c;
    if (isDirectSet(c)) {
      const bg = trim(c.background);
      const br = trim(c.border);
      const tx = trim(c.text);

      // 1) Try exact match against internal palette
      for (const set of internalActivityColors) {
        if (
          bg === trim(set.light.background) ||
          bg === trim(set.dark.background) ||
          br === trim(set.light.border) ||
          br === trim(set.dark.border) ||
          tx === trim(set.light.text) ||
          tx === trim(set.dark.text)
        ) {
          return { light: set.light, dark: set.dark };
        }
      }

      // 2) Fall back to hue-based nearest match using background hue
      const hue = extractHue(bg);
      if (typeof hue === 'number') {
        let bestIdx = 0;
        let bestDelta = Number.POSITIVE_INFINITY;
        internalActivityColors.forEach((set, idx) => {
          const h = extractHue(set.light.background) ?? 0;
          // circular hue distance (0-360)
          const delta = Math.min(Math.abs(h - hue), 360 - Math.abs(h - hue));
          if (delta < bestDelta) {
            bestDelta = delta;
            bestIdx = idx;
          }
        });
        const matched = internalActivityColors[bestIdx];
        if (matched) return { light: matched.light, dark: matched.dark };
      }

      // 3) As a last resort, approximate: reuse given direct set for both themes
      return { light: { ...c }, dark: { ...c } };
    }
    return undefined;
  };

  // Map stored.sessionData to Timeline entries expected by components
  const entries = (data.sessionData.timelineEntries || []).map((e) => {
    const incoming = (e as { colors?: unknown }).colors;
    const colors = normalizeColors(incoming);
    return {
      id: e.id,
      activityId: e.activityId ?? null,
      activityName: e.activityName ?? null,
      startTime: e.startTime,
      endTime: e.endTime ?? null,
      colors,
    };
  });

  const totalDuration = data.sessionData.plannedTime ?? 0;
  const elapsedTime = data.sessionData.timeSpent ?? 0;
  const isTimeUp = data.sessionData.sessionType === 'timeUp';
  const allActivitiesCompleted = data.sessionData.sessionType === 'completed';

  return (
    <div
      className="flex flex-col overflow-x-hidden"
      style={{ height: 'calc(100vh - var(--navbar-height))' }}
    >
      <div className="flex justify-between items-center flex-wrap gap-4 py-6 px-6">
        <div>
          <h1 className="text-xl font-medium mb-0">Shared Session</h1>
          <small className="text-on-surface-variant">
            Created: {new Date(data.metadata.createdAt).toLocaleString(undefined, {
              year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
            })}
          </small>
        </div>
        <div className="ml-auto">
          {/* Build shareUrl from NEXT_PUBLIC_BASE_URL if present so copy/open works in different environments */}
          <ShareControls
            shareUrl={
              (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}` : '') +
              `/shared/${data.metadata.id}`
            }
          />
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6 px-6 pb-6 items-stretch overflow-hidden">
        <div className="flex flex-col w-full lg:w-1/2 h-full overflow-hidden">
          {/* Reuse canonical Summary card directly (no extra nesting) */}
          <Summary
            entries={entries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            timerActive={false}
            allActivitiesCompleted={allActivitiesCompleted}
            isTimeUp={isTimeUp}
          />
        </div>
        <div className="hidden lg:flex flex-col w-full lg:w-1/2 h-full overflow-hidden">
          <Timeline
            entries={entries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            allActivitiesCompleted={allActivitiesCompleted}
            timerActive={false}
            showCounter={false}
          />
        </div>
      </div>
    </div>
  );
}
