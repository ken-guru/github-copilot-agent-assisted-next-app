import React, { useState, useEffect } from 'react';
import { Card, Alert, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';
import { isDarkMode, internalActivityColors } from '../utils/colors';
import { useToast } from '@/contexts/ToastContext';
import { handleActivityDuplication } from '@/utils/session-sharing/duplication';
import type { SharedSummaryProps } from '@/types/session-sharing';

export default function SharedSummary({ 
  sessionData,
  sharedAt,
  expiresAt,
  onDuplicateActivities
}: SharedSummaryProps) {
  const { addToast } = useToast();
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  // Add state to track current theme mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );

  // Effect to listen for theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to handle theme changes
    const handleThemeChange = () => {
      setCurrentTheme(isDarkMode() ? 'dark' : 'light');
    };

    // Initial check
    handleThemeChange();

    // Set up MutationObserver to watch for class changes on document.documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          mutation.attributeName === 'class'
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);

    // Clean up
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colorIndex: number) => {
    // Ensure colorIndex is within bounds
    const safeColorIndex = Math.max(0, Math.min(colorIndex, internalActivityColors.length - 1));
    const colorSet = internalActivityColors[safeColorIndex];
    
    if (!colorSet) {
      return {
        background: 'var(--background-muted)',
        text: 'var(--foreground)',
        border: 'var(--border-color)'
      };
    }
    
    return currentTheme === 'dark' ? colorSet.dark : colorSet.light;
  };

  const formatDuration = (seconds: number): string => {
    // Round to nearest whole second
    seconds = Math.round(seconds);
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getStatusMessage = () => {
    if (sessionData.sessionType === 'timeUp') {
      return {
        message: "Time was up when this session was completed.",
        className: 'statusMessageLate'
      };
    }

    const timeDiff = sessionData.timeSpent - sessionData.plannedTime;
    
    if (timeDiff > 0) {
      const laterBy = formatDuration(timeDiff);
      return {
        message: `This session took ${laterBy} more than planned`,
        className: 'statusMessageLate'
      };
    } else {
      const earlierBy = formatDuration(Math.abs(timeDiff));
      return {
        message: `This session finished ${earlierBy} earlier than planned!`,
        className: 'statusMessageEarly'
      };
    }
  };

  // Helper function to convert CSS module classes to Bootstrap Alert variants
  const getBootstrapVariant = (className: string): 'success' | 'warning' | 'info' => {
    if (className.includes('statusMessageEarly')) return 'success';
    if (className.includes('statusMessageLate')) return 'warning';
    return 'info';
  };

  // Handle activity duplication
  const handleDuplicateActivities = async () => {
    if (isDuplicating) return;

    setIsDuplicating(true);

    // Extract session ID from current URL
    const sessionId = window.location.pathname.split('/').pop();
    if (!sessionId) {
      addToast({
        message: 'Unable to determine session ID',
        variant: 'error',
      });
      setIsDuplicating(false);
      return;
    }

    await handleActivityDuplication(
      sessionId,
      () => {
        // Success callback
        onDuplicateActivities();
        addToast({
          message: `Successfully copied ${sessionData.activities.length} activities to your session!`,
          variant: 'success',
        });
      },
      (error) => {
        // Error callback
        addToast({
          message: error.message,
          variant: 'error',
        });
        setIsDuplicating(false);
      }
    );
  };

  const status = getStatusMessage();

  return (
    <Card data-testid="shared-summary" className="summary-card h-100">
      <Card.Header className="card-header-consistent">
        <h5 className="mb-0" role="heading" aria-level={2}>Shared Session Summary</h5>
        <div className="d-flex gap-2 align-items-center">
          <Button
            variant="primary"
            size="sm"
            disabled={isDuplicating}
            onClick={handleDuplicateActivities}
            className="d-flex align-items-center"
            title="Copy these activities to your session"
            data-testid="duplicate-activities-button"
          >
            <i className="bi bi-copy me-2"></i>
            {isDuplicating ? 'Copying...' : 'Use These Activities'}
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body data-testid="shared-summary-body">
        {/* Session metadata */}
        <Alert variant="info" className="mb-3" data-testid="session-metadata">
          <div className="d-flex flex-column gap-1">
            <div>
              <strong>Shared:</strong> {formatDate(sharedAt)}
            </div>
            <div>
              <strong>Expires:</strong> {formatDate(expiresAt)}
            </div>
            <div>
              <strong>Completed:</strong> {formatDate(sessionData.completedAt)}
            </div>
          </div>
        </Alert>

        {status && (
          <Alert variant={getBootstrapVariant(status.className)} className="mb-3" data-testid="session-status">
            {status.message}
          </Alert>
        )}

        <Row className="stats-grid g-3 mb-4" data-testid="stats-grid">
          <Col xs={6} md={3} data-testid="stat-card-planned">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-planned">Planned Time</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-planned">{formatDuration(sessionData.plannedTime)}</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3} data-testid="stat-card-spent">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-spent">Spent Time</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-spent">{formatDuration(sessionData.timeSpent)}</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3} data-testid="stat-card-idle">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-idle">Idle Time</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-idle">{formatDuration(sessionData.idleTime)}</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3} data-testid="stat-card-overtime">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-overtime">Overtime</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-overtime">{formatDuration(sessionData.overtime)}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {sessionData.activities.length > 0 && (
          <div className="mt-4">
            <h3 className="h5 mb-3" data-testid="activity-list-heading">
              Time Spent per Activity
            </h3>
            <ListGroup className="list-group-flush" data-testid="activity-list">
              {sessionData.activities.map((activity) => {
                // Get theme-appropriate colors
                const themeColors = getThemeAppropriateColor(activity.colorIndex);
                
                return (
                  <ListGroup.Item 
                    key={activity.id}
                    className="activity-item d-flex justify-content-between align-items-center"
                    data-testid={`activity-summary-item-${activity.id}`}
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border
                    }}
                  >
                    <span 
                      className="activity-name"
                      data-testid={`activity-name-${activity.id}`}
                      style={{ color: themeColors.text }}
                    >
                      {activity.name}
                    </span>
                    <Badge bg="primary" className="activity-time ms-auto text-bg-primary shadow-none">
                      {formatDuration(activity.duration)}
                    </Badge>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        )}

        {sessionData.skippedActivities.length > 0 && (
          <div className="mt-4" data-testid="skipped-activities">
            <h3 className="h6 mb-2">Skipped activities ({sessionData.skippedActivities.length})</h3>
            <ListGroup className="list-group-flush">
              {sessionData.skippedActivities.map(item => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <span className="text-body-secondary" data-testid={`skipped-activity-name-${item.id}`}>{item.name}</span>
                  <Badge bg="light" text="secondary" className="border fw-normal">Skipped</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* Additional info about sharing */}
        <div className="mt-4" data-testid="sharing-info">
          <Alert variant="light" className="border">
            <div className="d-flex align-items-start">
              <i className="bi bi-info-circle me-2 mt-1"></i>
              <div>
                <strong>About this shared session:</strong>
                <p className="mb-0 mt-1">
                  This is a read-only view of a completed time tracking session. 
                  You can copy the activities to your own session using the &ldquo;Use These Activities&rdquo; button above.
                </p>
              </div>
            </div>
          </Alert>
        </div>
      </Card.Body>
    </Card>
  );
}