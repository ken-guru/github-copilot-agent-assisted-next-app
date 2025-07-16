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
  // Import modal state
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

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

  // Enhanced confirmation dialog: static backdrop, focus management
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

  // Export modal: error handling for empty/malformed data
  const handleExport = () => {
    if (!activities || activities.length === 0) {
      setExportUrl(null);
      setShowExport(true);
      return;
    }
    try {
      const data = JSON.stringify(activities, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      setExportUrl(URL.createObjectURL(blob));
      setShowExport(true);
    } catch (err) {
      setExportUrl(null);
      setShowExport(true);
    }
  };

  // Import modal logic
  const handleImport = () => {
    setShowImport(true);
    setImportError(null);
    setImportFile(null);
    setImportSuccess(false);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    const file = e.target.files?.[0] || null;
    setImportFile(file);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      setImportError('No file selected');
      return;
    }
    try {
      const text = await importFile.text();
      const imported = JSON.parse(text);
      if (!Array.isArray(imported) || !imported.every(a => a.id && a.name)) {
        setImportError('Invalid file format');
        return;
      }
      // Confirm overwrite if activities exist
      if (activities.length > 0) {
        setShowImportConfirm(true);
      } else {
        setActivities(imported);
        setShowImport(false);
        setImportSuccess(true);
      }
    } catch (err) {
      setImportError('Failed to parse file');
    }
  };

  const confirmImportOverwrite = () => {
    if (importFile) {
      importFile.text().then(text => {
        try {
          const imported = JSON.parse(text);
          setActivities(imported);
          setShowImportConfirm(false);
          setShowImport(false);
          setImportSuccess(true);
        } catch {
          setImportError('Failed to parse file');
          setShowImportConfirm(false);
        }
      });
    }
  };

  return (
    <div>
      <h2>Activities</h2>
      <Button variant="primary" onClick={handleAdd}>Add Activity</Button>
      <Button variant="secondary" onClick={handleExport}>Export</Button>
      <Button variant="secondary" onClick={handleImport}>Import</Button>
      <ActivityList activities={activities} onEdit={handleEdit} onDelete={handleDelete} />
      {/* Activity Form Modal */}
      <Modal key={formError || 'no-error'} show={showForm} onHide={() => { setShowFormRaw(false); setFormError(null); }} aria-labelledby="activity-form-modal" centered backdrop="static">
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
      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} aria-labelledby="confirm-delete-modal" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="confirm-delete-modal">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this activity?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" autoFocus onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      {/* Export Modal */}
        <Modal show={showExport} onHide={() => setShowExport(false)} aria-labelledby="export-modal" aria-describedby="export-modal-desc" centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title id="export-modal">Export Activities</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="export-modal-desc">
              <p>Export your activities as a JSON file. This file can be imported later for backup or transfer.</p>
            </div>
            {exportUrl ? (
              <a href={exportUrl} download="activities.json" className="btn btn-success" aria-label="Download activities as JSON">Download JSON</a>
            ) : (
              <div className="text-danger" role="alert">No activities to export or export failed.</div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExport(false)} autoFocus>Close</Button>
          </Modal.Footer>
        </Modal>
      {/* Import Modal */}
        <Modal show={showImport} onHide={() => setShowImport(false)} aria-labelledby="import-modal" aria-describedby="import-modal-desc" centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title id="import-modal">Import Activities</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="import-modal-desc">
              <p>Select a JSON file to import activities. Only valid activity files will be accepted. Importing may overwrite your current activities.</p>
            </div>
            <input type="file" accept="application/json" onChange={handleImportFileChange} aria-label="Import JSON File" />
            {importError && <div className="text-danger mt-2" role="alert">{importError}</div>}
            {importSuccess && <div className="text-success mt-2" role="status">Import successful!</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowImport(false)} autoFocus>Cancel</Button>
            <Button variant="primary" onClick={handleImportSubmit}>Import</Button>
          </Modal.Footer>
        </Modal>
      {/* Import Overwrite Confirmation Modal */}
      <Modal show={showImportConfirm} onHide={() => setShowImportConfirm(false)} aria-labelledby="confirm-import-overwrite-modal" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="confirm-import-overwrite-modal">Overwrite Existing Activities?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Importing will overwrite your current activities. Continue?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" autoFocus onClick={() => setShowImportConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmImportOverwrite}>Overwrite</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActivityCrud;
