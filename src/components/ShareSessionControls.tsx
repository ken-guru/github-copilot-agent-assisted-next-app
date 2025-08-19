/**
 * ShareSessionControls component for generating and sharing session summaries
 * @see .kiro/specs/shareable-session-summary/design.md
 * @see .kiro/specs/shareable-session-summary/requirements.md
 */

import React, { useState, useCallback } from 'react';
import { Button, Spinner, Alert, InputGroup, Form, Modal } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import type { 
  ShareSessionControlsProps, 
  ShareSessionResponse,
  SessionSharingError 
} from '@/types/session-sharing';

/**
 * ShareSessionControls component
 * 
 * Provides a two-state UI for session sharing:
 * 1. "Make Shareable" button - generates shareable URL
 * 2. "Copy Link" interface - displays and allows copying the URL
 */
export default function ShareSessionControls({
  sessionData,
  isShared,
  shareUrl,
  onMakeShareable,
  disabled = false,
}: ShareSessionControlsProps) {
  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * Handle making session shareable with privacy confirmation
   */
  const handleMakeShareable = useCallback(async () => {
    if (disabled || isGenerating) return;

    // Show privacy modal first
    setShowPrivacyModal(true);
  }, [disabled, isGenerating]);

  /**
   * Confirm and proceed with share generation
   */
  const confirmShare = useCallback(async () => {
    setShowPrivacyModal(false);
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/sessions/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionData,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create shareable link';
        
        try {
          const errorData = await response.json() as SessionSharingError;
          errorMessage = errorData.message || errorMessage;
          
          // Handle specific error cases
          if (errorData.code === 'RATE_LIMIT_EXCEEDED') {
            errorMessage = 'Too many share requests. Please try again later.';
          } else if (errorData.code === 'STORAGE_QUOTA_EXCEEDED') {
            errorMessage = 'Daily sharing limit reached. Please try again tomorrow.';
          } else if (errorData.code === 'DUPLICATE_SESSION') {
            errorMessage = 'This session was recently shared. Please wait before sharing again.';
          }
        } catch {
          // Use default error message if JSON parsing fails
        }

        throw new Error(errorMessage);
      }

      await response.json() as ShareSessionResponse;
      
      // Call parent callback to update state
      onMakeShareable();
      
      addToast({
        message: 'Shareable link created successfully!',
        variant: 'success',
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create shareable link';
      setError(errorMessage);
      
      addToast({
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [sessionData, onMakeShareable, addToast]);

  /**
   * Copy share URL to clipboard with fallback
   */
  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Copy command failed');
        }
      }
      
      setCopySuccess(true);
      addToast({
        message: 'Link copied to clipboard!',
        variant: 'success',
      });
      
      // Reset copy success indicator after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
      
    } catch {
      addToast({
        message: 'Failed to copy link. Please select and copy manually.',
        variant: 'warning',
      });
    }
  }, [shareUrl, addToast]);

  /**
   * Select all text in the URL input for manual copying
   */
  const handleSelectAll = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  }, []);

  // Render "Make Shareable" state
  if (!isShared) {
    return (
      <>
        <Button
          variant="outline-primary"
          size="sm"
          disabled={disabled || isGenerating}
          onClick={handleMakeShareable}
          className="d-flex align-items-center"
          title="Create a shareable link for this session summary"
        >
          {isGenerating ? (
            <>
              <Spinner size="sm" className="me-2" animation="border" />
              Generating...
            </>
          ) : (
            <>
              <i className="bi bi-share me-2"></i>
              Make Shareable
            </>
          )}
        </Button>

        {error && (
          <Alert variant="danger" className="mt-2 mb-0" dismissible onClose={() => setError(null)}>
            <small>{error}</small>
          </Alert>
        )}

        {/* Privacy Confirmation Modal */}
        <Modal show={showPrivacyModal} onHide={() => setShowPrivacyModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Share Session Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info" className="mb-3">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Privacy Notice</strong>
            </Alert>
            <p>
              Creating a shareable link will:
            </p>
            <ul className="mb-3">
              <li>Generate a unique URL that anyone with the link can access</li>
              <li>Store your session data (activities, times, timeline) on our servers</li>
              <li>Make the data publicly viewable (but not discoverable without the link)</li>
              <li>Automatically expire the link after 90 days</li>
            </ul>
            <p className="mb-0">
              <strong>Important:</strong> Only share the link with people you trust. 
              Anyone with the URL can view your session data.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPrivacyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmShare} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Spinner size="sm" className="me-2" animation="border" />
                  Creating...
                </>
              ) : (
                'Create Shareable Link'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  // Render "Copy Link" state
  return (
    <div className="share-controls">
      <div className="d-flex align-items-center gap-2 mb-2">
        <i className="bi bi-check-circle-fill text-success"></i>
        <small className="text-success fw-medium">Shareable link created</small>
      </div>
      
      <InputGroup size="sm">
        <Form.Control
          type="text"
          value={shareUrl || ''}
          readOnly
          onFocus={handleSelectAll}
          className="font-monospace"
          style={{ fontSize: '0.8rem' }}
          title="Click to select all, then copy"
        />
        <Button
          variant={copySuccess ? 'success' : 'outline-secondary'}
          onClick={handleCopyLink}
          disabled={!shareUrl}
          title="Copy link to clipboard"
        >
          {copySuccess ? (
            <>
              <i className="bi bi-check2"></i>
              <span className="d-none d-sm-inline ms-1">Copied</span>
            </>
          ) : (
            <>
              <i className="bi bi-clipboard"></i>
              <span className="d-none d-sm-inline ms-1">Copy</span>
            </>
          )}
        </Button>
      </InputGroup>
      
      <div className="mt-2">
        <small className="text-muted">
          <i className="bi bi-clock me-1"></i>
          Link expires in 90 days
        </small>
      </div>
    </div>
  );
}