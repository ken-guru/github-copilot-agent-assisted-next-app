"use client";

import React from 'react';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';

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
      addResponsiveToast({ message: `Unable to copy to clipboard. Please copy manually: ${shareUrl}`, variant: 'warning', autoDismiss: true });
    }
  };

  const downloadJson = async () => {
    try {
      // Derive id from shareUrl (last path segment)
      if (!shareUrl) {
        addResponsiveToast({ message: 'No share URL available', variant: 'warning', autoDismiss: true });
        return;
      }
      const parts = shareUrl.split('/').filter(Boolean);
      const id = parts[parts.length - 1];
      if (!id) {
        addResponsiveToast({ message: 'Invalid share URL', variant: 'warning', autoDismiss: true });
        return;
      }
      const res = await fetch(`/api/sessions/${encodeURIComponent(String(id))}`);
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

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" className="btn btn-outline-primary" onClick={copy}>
        Copy share link
      </button>
      <button type="button" className="btn btn-outline-secondary" onClick={downloadJson}>
        Download JSON
      </button>
      <a className="btn btn-outline-secondary" href={shareUrl} target="_blank" rel="noopener noreferrer">
        Open in new tab
      </a>
    </div>
  );
}
