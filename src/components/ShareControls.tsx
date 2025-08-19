"use client";

import React from 'react';

interface Props {
  shareUrl: string;
}

export default function ShareControls({ shareUrl }: Props) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // small feedback via alert for now (non-blocking)
      // In future replace with toasts
      alert('Share URL copied to clipboard');
    } catch {
      // fallback: alert user to copy manually
      alert('Unable to copy to clipboard. Please copy manually: ' + shareUrl);
    }
  };

  const downloadJson = async () => {
    try {
      // Derive id from shareUrl (last path segment)
      if (!shareUrl) {
        alert('No share URL available');
        return;
      }
      const parts = shareUrl.split('/').filter(Boolean);
      const id = parts[parts.length - 1];
      if (!id) {
        alert('Invalid share URL');
        return;
      }
      const res = await fetch(`/api/sessions/${encodeURIComponent(String(id))}`);
      if (!res.ok) {
        const msg = `Unable to fetch shared session: ${res.status}`;
        alert(msg);
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
  } catch {
      // Provide a simple fallback
      alert('Failed to download JSON. Please open the share link and save manually.');
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
