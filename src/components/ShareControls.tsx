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

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" className="btn btn-outline-primary" onClick={copy}>
        Copy share link
      </button>
      <a className="btn btn-outline-secondary" href={shareUrl} target="_blank" rel="noopener noreferrer">
        Open in new tab
      </a>
    </div>
  );
}
