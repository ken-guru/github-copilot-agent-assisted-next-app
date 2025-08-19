import React from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '../../../../utils/sessionSharing/storage';

type Props = { params: { id: string } };

export default async function SharedPage({ params }: Props) {
  const id = params.id;
  const stored = await getSession(id);
  if (!stored) return notFound();

  return (
    <div style={{ padding: 20 }}>
      <h1>Shared Session</h1>
      <p>Created: {stored.metadata.createdAt}</p>
+      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(stored.sessionData, null, 2)}</pre>
    </div>
  );
}
