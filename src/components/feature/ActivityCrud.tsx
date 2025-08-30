"use client";

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';
import { Activity } from '../../types/activity';
import { getActivities, saveActivities, addActivity as persistActivity, updateActivity as persistUpdateActivity, deleteActivity as persistDeleteActivity, resetActivitiesToDefault } from '../../utils/activity-storage';
import { exportActivities, importActivities } from '../../utils/activity-import-export';
import { extractActivitiesFromImport } from '@/utils/import-utils';
import { useToast } from '@/contexts/ToastContext';

const ActivityCrud: React.FC = () => {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowFormRaw] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Import modal state
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  // Store processed activities for preview before overwrite
  const [processedImportPreview, setProcessedImportPreview] = useState<Activity[] | null>(null);

  // Create ref for ActivityForm to trigger submit from modal footer
  const activityFormRef = React.useRef<{ submitForm: () => void }>(null);

  // Helper to safely revoke object URLs
  const safeRevokeUrl = (url: string | null | undefined) => {
    if (!url) return;
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore revoke errors (e.g., double revoke)
    }
  };

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
      addToast({
        message: `Activity "${activityToDelete.name}" deleted successfully`,
        variant: 'success'
      });
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

  // Trigger download programmatically (for keyboard navigation)
  const triggerDownload = () => {
    if (exportUrl) {
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = 'activities.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  // Revoke object URL after a tick to ensure Safari completes download
  const urlToRevoke = exportUrl;
  setTimeout(() => safeRevokeUrl(urlToRevoke), 0);
      setExportUrl(null);
      setShowExport(false);
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
      addToast({
        message: `Activity "${activity.name}" updated successfully`,
        variant: 'success'
      });
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
      addToast({
        message: `Activity "${activity.name}" created successfully`,
        variant: 'success'
      });
    }
    setShowFormRaw(false);
    setEditingActivity(null);
    // Toast handles timing automatically
  };

  // Export modal: error handling for empty/malformed data
  const handleExport = () => {
    if (!activities || activities.length === 0) {
      setExportUrl(null);
      setShowExport(true);
      return;
    }
    try {
      // Use the new export utility that excludes isActive field by default
      const exportData = exportActivities(activities);
      const data = JSON.stringify(exportData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      setExportUrl(URL.createObjectURL(blob));
      setShowExport(true);
    } catch {
      setExportUrl(null);
      setShowExport(true);
    }
  };

  // Ensure we clean up any generated object URL when the modal is closed
  const handleCloseExport = () => {
  safeRevokeUrl(exportUrl);
    setExportUrl(null);
    setShowExport(false);
  };

  // Revoke any previously created object URL when it changes/unmounts to avoid leaks
  useEffect(() => {
    return () => {
      safeRevokeUrl(exportUrl);
    };
  }, [exportUrl]);

  // Import modal logic
  const handleImport = () => {
    setShowImport(true);
    setImportFile(null);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImportFile(file);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      addToast({
        message: 'No file selected',
        variant: 'error'
      });
      return;
    }
    try {
  const text = await importFile.text();
  const imported = JSON.parse(text);

  // Centralized extraction of activities from supported import shapes
  const importArray = extractActivitiesFromImport(imported);

      // Use the import utility to process and validate individual activity objects
      const processedActivities = importActivities(importArray, {
        existingActivities: activities,
        colorStartIndex: 0
      });

      // Store processed activities for preview in confirmation modal
      setProcessedImportPreview(processedActivities);

      // Confirm overwrite if activities exist
      if (activities.length > 0) {
        setShowImportConfirm(true);
      } else {
        // Save imported activities to localStorage
        saveActivities(processedActivities);
        // Refresh from localStorage
        const updatedActivities = getActivities().filter(a => a.isActive);
        setActivities(updatedActivities);
        setShowImport(false);
        addToast({
          message: `Successfully imported ${processedActivities.length} activities`,
          variant: 'success'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
      addToast({
        message: errorMessage,
        variant: 'error'
      });
    }
  };

  const confirmImportOverwrite = () => {
    // Use the processed preview if available; otherwise fall back to re-parsing
    const finalizeImport = (processedActivities: Activity[]) => {
      // Save imported activities to localStorage (overwrites existing)
      saveActivities(processedActivities);
      // Refresh from localStorage
      const updatedActivities = getActivities().filter(a => a.isActive);
      setActivities(updatedActivities);
      setShowImportConfirm(false);
      setShowImport(false);
      setProcessedImportPreview(null);
      addToast({
        message: `Successfully imported ${processedActivities.length} activities`,
        variant: 'success'
      });
    };

    if (processedImportPreview && Array.isArray(processedImportPreview)) {
      try {
        finalizeImport(processedImportPreview);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to import activities';
        addToast({ message: errorMessage, variant: 'error' });
      }
      return;
    }

  // Fallback: try to re-parse the file and process
    if (importFile) {
      importFile.text().then(text => {
        try {
      const imported = JSON.parse(text);
      const importArray = extractActivitiesFromImport(imported);

          const processedActivities = importActivities(importArray, {
            existingActivities: activities,
            colorStartIndex: 0
          });

          finalizeImport(processedActivities);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
          addToast({ message: errorMessage, variant: 'error' });
          setShowImportConfirm(false);
        }
      });
    }
  };

  const handleResetToDefault = () => {
    setShowResetConfirm(true);
  };

  const confirmResetToDefault = () => {
    resetActivitiesToDefault();
    // Refresh from localStorage
    const updatedActivities = getActivities().filter(a => a.isActive);
    setActivities(updatedActivities);
    setShowResetConfirm(false);
    addToast({
      message: 'Activities reset to default configuration',
      variant: 'success'
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Activities List Section */}
      <div className="row">
        <div className="col-12">
          <ActivityList
            activities={activities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onImport={handleImport}
            onExport={handleExport}
            onReset={handleResetToDefault}
          />
        </div>
      </div>

      {/* Activity Form Modal */}
      <Modal
        key={formError || 'no-error'}
        show={showForm}
        onHide={() => { setShowFormRaw(false); setFormError(null); }}
        aria-labelledby="activity-form-modal"
        centered
        backdrop="static"
        onKeyDown={handleFormModalKeyDown}
        animation={true}
        className="fade"
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
            existingActivities={activities}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowFormRaw(false); setFormError(null); }} className="d-flex align-items-center">
            <i className="bi bi-x me-2"></i>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => activityFormRef.current?.submitForm()}
            className="d-flex align-items-center"
          >
            <i className="bi bi-floppy me-2"></i>
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
            <i className="bi bi-x me-2"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} autoFocus className="d-flex align-items-center">
            <i className="bi bi-trash me-2"></i>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Export Modal */}
      <Modal 
        show={showExport} 
        onHide={handleCloseExport} 
        aria-labelledby="export-modal" 
        aria-describedby="export-modal-desc" 
        centered 
        backdrop="static"
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && exportUrl) {
            e.preventDefault();
            triggerDownload();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCloseExport();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="export-modal">
            <i className="bi bi-download me-2"></i>
            Export Activities
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="export-modal-desc" className="mb-3">
            <p className="mb-2">Export your activities as a JSON file for backup or transfer to another device.</p>
            {activities.length > 0 && (
              <p className="text-muted small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                Exporting {activities.length} activity{activities.length !== 1 ? 'ies' : ''}
              </p>
            )}
          </div>
          {!exportUrl && activities.length === 0 && (
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              No activities to export. Create some activities first.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseExport} 
            className="d-flex align-items-center"
            // Close is primary only when there is nothing to download
            autoFocus={!exportUrl}
          >
            <i className="bi bi-x me-2"></i>
            Close
          </Button>
          {exportUrl ? (
            <a
              href={exportUrl}
              download="activities.json"
              className="btn btn-success d-flex align-items-center justify-content-center"
              aria-label="Download activities as JSON"
              // When download is available, make it the primary action
              autoFocus
            >
              <i className="bi bi-download me-2"></i>
              Download activities.json
            </a>
          ) : null}
        </Modal.Footer>
      </Modal>
      {/* Import Modal */}
      <Modal show={showImport} onHide={() => setShowImport(false)} aria-labelledby="import-modal" aria-describedby="import-modal-desc" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="import-modal">
            <i className="bi bi-upload me-2"></i>
            Import Activities
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="import-modal-desc" className="mb-3">
            <p className="mb-2">Select a JSON file to import activities from a previous export.</p>
            <div className="alert alert-info d-flex align-items-start" role="note">
              <i className="bi bi-info-circle me-2 mt-1"></i>
              <div>
                <strong>Important:</strong> Importing will replace all your current activities.
                Make sure to export your current activities first if you want to keep them.
              </div>
            </div>
          </div>

          <div className="mb-3">
            <Form.Label className="fw-bold">Select JSON file:</Form.Label>
            <Form.Control
              type="file"
              accept="application/json,.json"
              onChange={handleImportFileChange}
              aria-label="Import JSON File"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImport(false)} className="d-flex align-items-center">
            <i className="bi bi-x me-2"></i>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImportSubmit} disabled={!importFile} className="d-flex align-items-center">
            <i className="bi bi-upload me-2"></i>
            Import Activities
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Import Overwrite Confirmation Modal */}
      <Modal
        show={showImportConfirm}
        onHide={() => { setShowImportConfirm(false); setProcessedImportPreview(null); }}
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
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Replace All Activities?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning d-flex align-items-start" role="alert">
            <i className="bi bi-exclamation-triangle me-2 mt-1"></i>
            <div>
              <strong>This will replace all your current activities.</strong>
              <br />
              This action cannot be undone. Make sure you have exported your current activities if you want to keep them.
            </div>
          </div>
          <p className="mb-2">Do you want to continue with the import?</p>
          {processedImportPreview && processedImportPreview.length > 0 && (
            <div className="mt-3">
              <h6>Preview of imported activities</h6>
              <ul className="list-group">
                {processedImportPreview.map(p => (
                  <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{p.name}</strong>
                      {p.description && <div className="small text-muted">{p.description}</div>}
                    </div>
                    <span className="badge bg-secondary rounded-pill">#{p.colorIndex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowImportConfirm(false); setProcessedImportPreview(null); }} className="d-flex align-items-center">
            <i className="bi bi-x me-2"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmImportOverwrite} autoFocus className="d-flex align-items-center">
            <i className="bi bi-upload me-2"></i>
            Replace Activities
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Reset Activities Confirmation Modal */}
      <Modal
        show={showResetConfirm}
        onHide={() => setShowResetConfirm(false)}
        aria-labelledby="confirm-reset-activities-modal"
        centered
        backdrop="static"
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            confirmResetToDefault();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowResetConfirm(false);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="confirm-reset-activities-modal">
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Reset All Activities?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning d-flex align-items-start" role="alert">
            <i className="bi bi-exclamation-triangle me-2 mt-1"></i>
            <div>
              <strong>This will delete all your current activities and replace them with the default set.</strong>
              <br />
              This action cannot be undone. Any custom activities you&apos;ve created will be permanently lost.
            </div>
          </div>
          <p className="mb-2">The default activities are:</p>
          <ul className="mb-3">
            <li>Homework</li>
            <li>Reading</li>
            <li>Play Time</li>
            <li>Chores</li>
          </ul>
          <p className="mb-0">Do you want to continue with the reset?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetConfirm(false)} className="d-flex align-items-center">
            <i className="bi bi-x me-2"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmResetToDefault} autoFocus className="d-flex align-items-center">
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reset Activities
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActivityCrud;
