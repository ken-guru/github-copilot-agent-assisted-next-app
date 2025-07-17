"use client";

import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';
import { Activity } from '../../types/activity';
import { getActivities, saveActivities, addActivity as persistActivity, updateActivity as persistUpdateActivity, deleteActivity as persistDeleteActivity, resetActivitiesToDefault } from '../../utils/activity-storage';

const ActivityCrud: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowFormRaw] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Import modal state
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // Create ref for ActivityForm to trigger submit from modal footer
  const activityFormRef = React.useRef<{ submitForm: () => void }>(null);

  // Load activities from localStorage on mount
  useEffect(() => {
    const loadedActivities = getActivities().filter(a => a.isActive);
    setActivities(loadedActivities);
  }, []);

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
      // Use soft delete via localStorage utility
      persistDeleteActivity(activityToDelete.id);
      // Update local state to reflect the change
      const updatedActivities = getActivities().filter(a => a.isActive);
      setActivities(updatedActivities);
      setShowConfirm(false);
      setActivityToDelete(null);
      // Show success message
      setSuccessMessage(`Activity "${activityToDelete.name}" deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Handle keyboard navigation for confirmation dialog
  const handleConfirmKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmDelete();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowConfirm(false);
    }
  };

  // Handle keyboard navigation for form modal
  const handleFormModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      activityFormRef.current?.submitForm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowFormRaw(false);
      setFormError(null);
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
      // Update existing activity in localStorage
      persistUpdateActivity(activity);
      // Refresh from localStorage to get current state
      const updatedActivities = getActivities().filter(a => a.isActive);
      setActivities(updatedActivities);
      setSuccessMessage(`Activity "${activity.name}" updated successfully`);
    } else {
      // Add new activity to localStorage
      const newActivity = {
        ...activity,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        createdAt: new Date().toISOString(),
        isActive: true
      };
      persistActivity(newActivity);
      // Refresh from localStorage to get current state
      const updatedActivities = getActivities().filter(a => a.isActive);
      setActivities(updatedActivities);
      setSuccessMessage(`Activity "${activity.name}" created successfully`);
    }
    setShowFormRaw(false);
    setEditingActivity(null);
    // Auto-hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
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
        // Save imported activities to localStorage
        saveActivities(imported);
        // Refresh from localStorage
        const updatedActivities = getActivities().filter(a => a.isActive);
        setActivities(updatedActivities);
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
          // Save imported activities to localStorage (overwrites existing)
          saveActivities(imported);
          // Refresh from localStorage
          const updatedActivities = getActivities().filter(a => a.isActive);
          setActivities(updatedActivities);
          setShowImportConfirm(false);
          setShowImport(false);
          setImportSuccess(true);
          setSuccessMessage(`Successfully imported ${imported.length} activities`);
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch {
          setImportError('Failed to parse file');
          setShowImportConfirm(false);
        }
      });
    }
  };

  const handleResetToDefault = () => {
    resetActivitiesToDefault();
    // Refresh from localStorage
    const updatedActivities = getActivities().filter(a => a.isActive);
    setActivities(updatedActivities);
    setSuccessMessage('Activities reset to default configuration');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="container-fluid py-4">
      {/* Success Message */}
      {successMessage && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close"
                onClick={() => setSuccessMessage(null)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Activities List Section */}
      <div className="row">
        <div className="col-12">
          {activities.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-tasks fa-3x text-muted"></i>
              </div>
              <h4 className="text-muted">No activities yet</h4>
              <p className="text-muted">Get started by creating your first activity</p>
              <Button variant="primary" onClick={handleAdd} className="d-flex align-items-center mx-auto">
                <i className="fas fa-plus me-2"></i>
                Create First Activity
              </Button>
            </div>
          ) : (
            <ActivityList 
              activities={activities} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onAdd={handleAdd}
              onImport={handleImport}
              onExport={handleExport}
              onReset={handleResetToDefault}
            />
          )}
        </div>
      </div>

      {/* Remove old Import/Export Actions section */}

      {/* Activity Form Modal */}
      <Modal 
        key={formError || 'no-error'} 
        show={showForm} 
        onHide={() => { setShowFormRaw(false); setFormError(null); }} 
        aria-labelledby="activity-form-modal" 
        centered 
        backdrop="static"
        onKeyDown={handleFormModalKeyDown}
      >
        <Modal.Header closeButton>
          <Modal.Title id="activity-form-modal">{editingActivity ? 'Edit Activity' : 'Add Activity'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityForm
            ref={activityFormRef}
            key={formError || 'no-error'}
            activity={editingActivity}
            onSubmit={handleFormSubmit}
            error={formError}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowFormRaw(false); setFormError(null); }} className="d-flex align-items-center">
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => activityFormRef.current?.submitForm()} 
            className="d-flex align-items-center"
          >
            <i className="fas fa-save me-2"></i>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showConfirm} 
        onHide={() => setShowConfirm(false)} 
        aria-labelledby="confirm-delete-modal" 
        centered 
        backdrop="static"
        onKeyDown={handleConfirmKeyDown}
      >
        <Modal.Header closeButton>
          <Modal.Title id="confirm-delete-modal">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the activity <strong>&ldquo;{activityToDelete?.name}&rdquo;</strong>?</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} className="d-flex align-items-center">
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} autoFocus className="d-flex align-items-center">
            <i className="fas fa-trash me-2"></i>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Export Modal */}
      <Modal show={showExport} onHide={() => setShowExport(false)} aria-labelledby="export-modal" aria-describedby="export-modal-desc" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="export-modal">
            <i className="fas fa-download me-2"></i>
            Export Activities
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="export-modal-desc" className="mb-3">
            <p className="mb-2">Export your activities as a JSON file for backup or transfer to another device.</p>
            {activities.length > 0 && (
              <p className="text-muted small mb-0">
                <i className="fas fa-info-circle me-1"></i>
                Exporting {activities.length} activity{activities.length !== 1 ? 'ies' : ''}
              </p>
            )}
          </div>
          {exportUrl ? (
            <div className="d-grid">
              <a 
                href={exportUrl} 
                download="activities.json" 
                className="btn btn-success d-flex align-items-center justify-content-center"
                aria-label="Download activities as JSON"
              >
                <i className="fas fa-file-download me-2"></i>
                Download activities.json
              </a>
            </div>
          ) : (
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              No activities to export. Create some activities first.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExport(false)} autoFocus className="d-flex align-items-center">
            <i className="fas fa-times me-2"></i>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Import Modal */}
      <Modal show={showImport} onHide={() => setShowImport(false)} aria-labelledby="import-modal" aria-describedby="import-modal-desc" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="import-modal">
            <i className="fas fa-upload me-2"></i>
            Import Activities
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="import-modal-desc" className="mb-3">
            <p className="mb-2">Select a JSON file to import activities from a previous export.</p>
            <div className="alert alert-info d-flex align-items-start" role="note">
              <i className="fas fa-info-circle me-2 mt-1"></i>
              <div>
                <strong>Important:</strong> Importing will replace all your current activities. 
                Make sure to export your current activities first if you want to keep them.
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-bold">Select JSON file:</label>
            <input 
              type="file" 
              className="form-control"
              accept="application/json,.json" 
              onChange={handleImportFileChange} 
              aria-label="Import JSON File"
            />
          </div>

          {importError && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {importError}
            </div>
          )}
          
          {importSuccess && (
            <div className="alert alert-success d-flex align-items-center" role="status">
              <i className="fas fa-check-circle me-2"></i>
              Import successful!
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImport(false)} className="d-flex align-items-center">
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImportSubmit} disabled={!importFile} className="d-flex align-items-center">
            <i className="fas fa-upload me-2"></i>
            Import Activities
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Import Overwrite Confirmation Modal */}
      <Modal 
        show={showImportConfirm} 
        onHide={() => setShowImportConfirm(false)} 
        aria-labelledby="confirm-import-overwrite-modal" 
        centered 
        backdrop="static"
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            confirmImportOverwrite();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="confirm-import-overwrite-modal">
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            Replace All Activities?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning d-flex align-items-start" role="alert">
            <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
            <div>
              <strong>This will replace all your current activities.</strong>
              <br />
              This action cannot be undone. Make sure you have exported your current activities if you want to keep them.
            </div>
          </div>
          <p className="mb-0">Do you want to continue with the import?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportConfirm(false)} className="d-flex align-items-center">
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmImportOverwrite} autoFocus className="d-flex align-items-center">
            <i className="fas fa-upload me-2"></i>
            Replace Activities
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActivityCrud;
