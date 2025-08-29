import React from 'react';
import ActivityCrud from '@/components/feature/ActivityCrud';

/**
 * Activities management page - provides full CRUD interface for managing custom activities
 * Integrates with localStorage for persistent activity management
 * Updated to use Material 3 spacing and layout
 */
const ActivitiesPage: React.FC = () => (
  <main className="max-w-6xl mx-auto p-6">
    <ActivityCrud />
  </main>
);

export default ActivitiesPage;
