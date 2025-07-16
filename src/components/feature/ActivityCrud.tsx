import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';
import { DEFAULT_ACTIVITIES, Activity } from '../../types/activity';

const ActivityCrud: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [showForm, setShowFormRaw] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingActivity(null);
    setFormError(null);
    setShowFormRaw(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormError(null);
    setShowFormRaw(true);
  };

  const handleDelete = (activity: Activity) => {
    setActivityToDelete(activity);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (activityToDelete) {
      setActivities(activities.filter(a => a.id !== activityToDelete.id));
      setShowConfirm(false);
      setActivityToDelete(null);
    }
  };

  const handleFormSubmit = (activity: Activity | null) => {
    if (!activity || !activity.name || !activity.name.trim()) {
      setFormError('Name is required');
      setShowFormRaw(true);
      return;
    }
    setFormError(null);
    if (editingActivity) {
      setActivities(activities.map(a => (a.id === activity.id ? activity : a)));
    } else {
      setActivities([...activities, activity]);
    }
    setShowFormRaw(false);
    setEditingActivity(null);
  };

  const handleExport = () => {
  const data = JSON.stringify(activities, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  setExportUrl(URL.createObjectURL(blob));
  setShowExport(true);
  };

  const handleImport = () => {
    setShowImport(true);
  };

  return (
    <div>
      <h2>Activities</h2>
      <Button variant="primary" onClick={handleAdd}>Add Activity</Button>
      <Button variant="secondary" onClick={handleExport}>Export</Button>
      <Button variant="secondary" onClick={handleImport}>Import</Button>
      <ActivityList activities={activities} onEdit={handleEdit} onDelete={handleDelete} />
  <Modal key={formError || 'no-error'} show={showForm} onHide={() => { setShowFormRaw(false); setFormError(null); }} aria-labelledby="activity-form-modal" centered>
        {/* Add key to force re-render on error change */}
        <Modal.Header closeButton>
          <Modal.Title id="activity-form-modal">{editingActivity ? 'Edit Activity' : 'Add Activity'}</Modal.Title>
        </Modal.Header>
  <Modal.Body>
          <ActivityForm
            key={formError || 'no-error'}
            activity={editingActivity}
            onSubmit={handleFormSubmit}
            error={formError}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowFormRaw(false); setFormError(null); }}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} aria-labelledby="confirm-delete-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="confirm-delete-modal">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this activity?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showExport} onHide={() => setShowExport(false)} aria-labelledby="export-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="export-modal">Export Activities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You can export your activities as a JSON file below.</p>
          {exportUrl && (
            <a href={exportUrl} download="activities.json" className="btn btn-success">Download JSON</a>
          )}
        </Modal.Body>
      </Modal>
      {/* Import modal would go here */}
    </div>
  );
};

export default ActivityCrud;
