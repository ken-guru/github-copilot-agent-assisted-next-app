"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { fetchWithVercelBypass } from '@/utils/fetchWithVercelBypass';
import { saveActivities } from '@/utils/activity-storage';
import { importActivities } from '@/utils/activity-import-export';
import type { PartialActivityImport } from '@/utils/activity-import-export';
import { extractShareIdFromUrl } from '@/utils/shareUrl';
import ConfirmationDialog, { ConfirmationDialogRef } from '@/components/ConfirmationDialog';

interface Props {
  shareUrl: string;
  // When true, render an "Open" button that opens the share URL in a new window/tab.
  showOpen?: boolean;
  // When false, hide the Replace button (useful inside the post-session share dialog).
  showReplace?: boolean;
}

export default function ShareControls({ shareUrl, showOpen = false, showReplace = true }: Props) {
  const { addResponsiveToast } = useResponsiveToast();
  const router = useRouter();
  const confirmRef = useRef<ConfirmationDialogRef>(null);
  const [isReplacing, setIsReplacing] = useState(false);

  // Network status hook - place with other hooks at top of component for clarity
  const { online } = useNetworkStatus();

  const copy = async () => {
    try {
      const urlToCopy = (() => {
        try {
          // If shareUrl is absolute, use it; otherwise prefix with current origin
          const u = new URL(shareUrl, typeof window !== 'undefined' ? window.location.origin : undefined);
          return u.toString();
        } catch {
          return shareUrl; // fallback
        }
      })();
      await navigator.clipboard.writeText(urlToCopy);
      addResponsiveToast({ message: 'Share URL copied to clipboard', variant: 'success', autoDismiss: true });
    } catch {
      addResponsiveToast({ message: 'Unable to copy to clipboard. Please copy the link manually.', variant: 'warning', autoDismiss: true });
    }
  };

  const downloadJson = async () => {
    if (!online) {
      addResponsiveToast({ message: 'You are currently offline — downloading shared sessions requires a network connection.', variant: 'warning', autoDismiss: true });
      return;
    }
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

  const doReplace = async () => {
    if (!online) {
      addResponsiveToast({ message: 'You are currently offline — replacing activities requires a network connection.', variant: 'warning', autoDismiss: true });
      return;
    }
    try {
      if (!shareUrl) {
        addResponsiveToast({ message: 'No share URL available', variant: 'warning', autoDismiss: true });
        return;
      }
      setIsReplacing(true);

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

  const activities = (sessionData as { activities?: Array<{ id?: string; name?: string; description?: string | null; colorIndex?: number }> }).activities || [];
      const skipped = (sessionData as { skippedActivities?: Array<{ id?: string; name?: string }> }).skippedActivities || [];

      // Build import list from union of activities and skippedActivities, deduped by case-insensitive name
      const byName = new Map<string, PartialActivityImport>();
      for (const a of activities) {
        if (!a || typeof a !== 'object' || !a.name) continue;
        const key = a.name.trim().toLowerCase();
        byName.set(key, { id: a.id, name: a.name, description: a.description ?? undefined, colorIndex: typeof a.colorIndex === 'number' ? a.colorIndex : undefined });
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
      // Redirect to root after replacing to align UX expectations
      router.push('/');
    } catch {
      addResponsiveToast({ message: 'Failed to replace activities from shared data', variant: 'error', autoDismiss: true });
    } finally {
      setIsReplacing(false);
    }
  };

  const replaceMyActivities = () => {
    confirmRef.current?.showDialog();
  };


  return (
    <div
      className="d-flex gap-2 align-items-center"
      role="group"
      aria-label="Share controls"
    >
      <Button
        type="button"
        variant="outline-primary"
        className="d-flex align-items-center"
        onClick={copy}
        aria-label="Copy share link"
      >
        <i className="bi bi-clipboard me-2" aria-hidden="true"></i>
        Copy link
      </Button>
      <Button
        type="button"
        variant="outline-secondary"
        className="d-flex align-items-center"
        onClick={downloadJson}
        disabled={!online}
        aria-label="Download JSON"
      >
        <i className="bi bi-download me-2" aria-hidden="true"></i>
        Download JSON
      </Button>
      {showOpen && (
        <Button
          type="button"
          variant="outline-success"
          className="d-flex align-items-center"
          onClick={() => {
            try {
              if (!shareUrl) return;
              const absolute = (() => {
                try {
                  return new URL(shareUrl, typeof window !== 'undefined' ? window.location.origin : undefined).toString();
                } catch {
                  return shareUrl;
                }
              })();
                if (!online) {
                  addResponsiveToast({ message: 'You are currently offline — opening a shared session requires a network connection.', variant: 'warning', autoDismiss: true });
                  return;
                }
                window.open(absolute, '_blank', 'noopener,noreferrer');
            } catch {
              addResponsiveToast({ message: 'Unable to open link', variant: 'warning', autoDismiss: true });
            }
          }}
          aria-label="Open shared session in new window"
          title="Open in new window"
        >
          <i className="bi bi-box-arrow-up-right me-2" aria-hidden="true"></i>
          Open
        </Button>
      )}
      {showReplace && (
        <Button
          type="button"
          variant="outline-warning"
          className="d-flex align-items-center"
          onClick={replaceMyActivities}
          disabled={isReplacing || !online}
          aria-label="Replace my activities"
          title="Replace my activities with this shared set"
        >
          <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
          {isReplacing ? 'Replacing…' : 'Replace activities'}
        </Button>
      )}
      <ConfirmationDialog
        ref={confirmRef}
        message="This will replace your current activities with the shared set. Continue?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={doReplace}
        onCancel={() => { /* no-op */ }}
      />
    </div>
  );
}
