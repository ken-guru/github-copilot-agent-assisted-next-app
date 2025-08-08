// src/app/archive/page.tsx
// Archive page: lists all previous activity summaries from Firebase Realtime Database

'use client';
import React, { useEffect, useState } from 'react';
import { getFirebaseDatabase } from '@/utils/firebase';
import { ref, onValue, DataSnapshot } from 'firebase/database';
import { Spinner } from 'react-bootstrap';

interface Summary {
  id: string;
  [key: string]: unknown;
}

export default function ArchivePage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDatabase();
    const summariesRef = ref(db, 'summaries');
    const unsubscribe = onValue(summariesRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      // Debug log: print raw data from Firebase
      // eslint-disable-next-line no-console
      console.log('[ArchivePage] Firebase /summaries raw data:', data);
      if (data) {
        // Flatten all summaries under all userIds
        const allSummaries: Summary[] = [];
        Object.entries(data).forEach(([userId, userSummaries]) => {
          if (userSummaries && typeof userSummaries === 'object') {
            Object.entries(userSummaries as Record<string, unknown>).forEach(([summaryId, summary]) => {
              allSummaries.push({ id: `${userId}/${summaryId}`, ...(summary as Record<string, unknown>) });
            });
          }
        });
        setSummaries(allSummaries);
      } else {
        setSummaries([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Activity Summaries Archive</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : summaries.length === 0 ? (
        <div className="alert alert-info">No summaries found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => (
                <tr key={summary.id}>
                  <td>{summary.id}</td>
                  <td>
                    <pre style={{ margin: 0, fontSize: '0.9em' }}>
                      {JSON.stringify(summary, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
