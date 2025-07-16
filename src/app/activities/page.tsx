import React from 'react';
import ActivityCrud from '@/components/feature/ActivityCrud';

/**
 * Activities management page - provides full CRUD interface for managing custom activities
 * Integrates with localStorage for persistent activity management
 */
const ActivitiesPage: React.FC = () => (
  <main className="container py-4">
    <ActivityCrud />
  </main>
);

export default ActivitiesPage;
