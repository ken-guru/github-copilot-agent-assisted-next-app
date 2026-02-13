import React from 'react';
import ActivityCrud from '@/components/feature/ActivityCrud';

/**
 * Activities management page - provides full CRUD interface for managing custom activities
 * Integrates with localStorage for persistent activity management
 */
const ActivitiesPage: React.FC = () => (
  <main className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ height: '100%' }}>
    <div className="d-flex flex-column flex-grow-1 overflow-y-auto p-3 p-md-4">
      <ActivityCrud />
    </div>
  </main>
);

export default ActivitiesPage;
