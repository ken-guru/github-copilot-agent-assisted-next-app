"use client";

import React from 'react';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { fetchWithVercelBypass } from '@/utils/fetchWithVercelBypass';
import { saveActivities } from '@/utils/activity-storage';
import { importActivities } from '@/utils/activity-import-export';
import type { PartialActivityImport } from '@/utils/activity-import-export';
import { extractShareIdFromUrl } from '@/utils/shareUrl';

interface Props {
  shareUrl: string;
}

export default function ShareControls({ shareUrl }: Props) {
  const { addResponsiveToast } = useResponsiveToast();


  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      addResponsiveToast({ message: 'Share URL copied to clipboard', variant: 'success', autoDismiss: true });
    } catch {
      addResponsiveToast({ message: 'Unable to copy to clipboard. Please copy the link manually.', variant: 'warning', autoDismiss: true });
    }
  };

  const downloadJson = async () => {
    try {
  // Derive id from shareUrl (last path segment)
  if (!shareUrl) {
        addResponsiveToast({ message: 'No share URL available', variant: 'warning', autoDismiss: true });
        return;
      }
  const id = extractShareIdFromUrl(shareUrl);
  if (!id) {
        addResponsiveToast({ message: 'Invalid share URL', variant: 'warning', autoDismiss: true });
        return;
      }
  const res = await fetchWithVercelBypass(`/api/sessions/${encodeURIComponent(String(id))}`);
      if (!res.ok) {
        const msg = `Unable to fetch shared session: ${res.status}`;
        addResponsiveToast({ message: msg, variant: 'error', autoDismiss: true });
        return;
      }
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shared-session-${id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      addResponsiveToast({ message: 'Download started', variant: 'success', autoDismiss: true });
    } catch {
      addResponsiveToast({ message: 'Failed to download JSON. Please open the share link and save manually.', variant: 'error', autoDismiss: true });
    }
  };

  const replaceMyActivities = async () => {
    try {
      if (!shareUrl) {
        addResponsiveToast({ message: 'No share URL available', variant: 'warning', autoDismiss: true });
        return;
      }

  // Confirm destructive action
  const confirmed = typeof window !== 'undefined' && typeof window.confirm === 'function'
        ? window.confirm('This will replace your current activities with the shared set. Continue?')
        : true;
      if (!confirmed) return;

  const id = extractShareIdFromUrl(shareUrl);
  if (!id) {
        addResponsiveToast({ message: 'Invalid share URL', variant: 'warning', autoDismiss: true });
        return;
      }

      const res = await fetchWithVercelBypass(`/api/sessions/${encodeURIComponent(String(id))}`);
      if (!res.ok) {
        const msg = `Unable to fetch shared session: ${res.status}`;
        addResponsiveToast({ message: msg, variant: 'error', autoDismiss: true });
        return;
      }
      const json = await res.json();
      // Expect StoredSession shape: { sessionData: { activities, skippedActivities } }
      const sessionData = json?.sessionData as unknown;
      if (!sessionData || typeof sessionData !== 'object') {
        addResponsiveToast({ message: 'Shared data is not in expected format', variant: 'error', autoDismiss: true });
        return;
      }

      const activities = (sessionData as { activities?: Array<{ id?: string; name?: string; colorIndex?: number }> }).activities || [];
      const skipped = (sessionData as { skippedActivities?: Array<{ id?: string; name?: string }> }).skippedActivities || [];

      // Build import list from union of activities and skippedActivities, deduped by case-insensitive name
      const byName = new Map<string, PartialActivityImport>();
      for (const a of activities) {
        if (!a || typeof a !== 'object' || !a.name) continue;
        const key = a.name.trim().toLowerCase();
        byName.set(key, { id: a.id, name: a.name, colorIndex: typeof a.colorIndex === 'number' ? a.colorIndex : undefined });
      }
      for (const s of skipped) {
        if (!s || typeof s !== 'object' || !s.name) continue;
        const key = s.name.trim().toLowerCase();
        if (!byName.has(key)) {
          byName.set(key, { id: s.id, name: s.name });
        }
      }
      const importList = Array.from(byName.values());

      const imported = importActivities(importList, { existingActivities: [], colorStartIndex: 0 });
      saveActivities(imported);
      addResponsiveToast({ message: `Replaced activities (${imported.length}) from shared set`, variant: 'success', autoDismiss: true });
  } catch {
      addResponsiveToast({ message: 'Failed to replace activities from shared data', variant: 'error', autoDismiss: true });
    }
  };

  return (
    <div
      style={{ display: 'flex', gap: 8, alignItems: 'center' }}
      role="group"
      aria-label="Share controls"
    >
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={copy}
        aria-label="Copy share link to clipboard"
      >
        Copy share link
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={downloadJson}
        aria-label="Download shared session as JSON"
      >
        Download JSON
      </button>
      <button
        type="button"
        className="btn btn-warning"
        onClick={replaceMyActivities}
        aria-label="Replace my activities with this shared set"
        title="Replace my activities with this shared set"
      >
        Replace my activities
      </button>
      <a
        className="btn btn-outline-secondary"
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open shared session in a new tab"
      >
        Open in new tab
      </a>
    </div>
  );
}
