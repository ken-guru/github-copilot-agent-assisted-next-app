"use client";
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import type { SessionSummaryData } from '../types/sessionSharing';

type Props = { sessionData: SessionSummaryData };

export default function ShareSessionControls({ sessionData }: Props) {
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createShare() {
    setSharing(true);
    setError(null);
    setShareUrl(null);
    try {
      const res = await fetch('/api/sessions/share', { method: 'POST', body: JSON.stringify(sessionData), headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed to create share');
      setShareUrl(json.shareUrl ?? `/shared/${json.shareId}`);
    } catch (err: unknown) {
      setError((err as Error).message ?? String(err));
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="share-controls">
      {shareUrl ? (
        <div>
          <label>Share URL</label>
          <div><a href={shareUrl}>{shareUrl}</a></div>
        </div>
      ) : (
        <Button variant="primary" onClick={createShare} disabled={sharing} data-testid="create-share">
          {sharing ? 'Sharing...' : 'Create Share'}
        </Button>
      )}
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
}
