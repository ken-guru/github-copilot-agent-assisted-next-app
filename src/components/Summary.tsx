"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Alert, Row, Col, ListGroup, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import { TimelineEntry } from '@/types';
import { isDarkMode, ColorSet, internalActivityColors } from '../utils/colors';
import { getActivities } from '@/utils/activity-storage';
import { useToast } from '@/contexts/ToastContext';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { useOpenAIClient } from '@/utils/ai/byokClient';
import type { ChatCompletion } from '@/types/ai';
import ShareControls from './ShareControls';
import { fetchWithVercelBypass } from '@/utils/fetchWithVercelBypass';
import { mapTimelineEntriesForShare } from '@/utils/sharing';
import useNetworkStatus from '@/hooks/useNetworkStatus';

interface SummaryProps {
  entries?: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
  isTimeUp?: boolean; // Add this prop to handle time-up state
  onReset?: () => void; // Add reset callback prop
  skippedActivityIds?: string[]; // Activities skipped/hidden during session
}

export default function Summary({ 
  entries = [], 
  totalDuration, 
  elapsedTime, 
  timerActive = false,
  allActivitiesCompleted = false,
  isTimeUp = false, // Add this prop to handle time-up state
  onReset, // Add reset callback prop
  skippedActivityIds = []
}: SummaryProps) {
  const { addToast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareControls, setShowShareControls] = useState(false);
  // Ref to return focus to the trigger after modal closes
  const [shareTriggerElement, setShareTriggerElement] = useState<HTMLElement | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const { apiKey } = useApiKey();
  const { callOpenAI } = useOpenAIClient();
  const { online } = useNetworkStatus();
  // Auto mode: BYOK if available, else server mock route
  // Add state to track current theme mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );

  // Extracted handler for creating a share to keep JSX minimal and readable
  const handleCreateShare = async () => {
    try {
      // Guard against offline attempts — provide clear user feedback
      if (!online) {
        addToast({ message: 'Cannot create share: no network connection. Please reconnect and try again.', variant: 'warning' });
        return;
      }
      setShareLoading(true);

      // Build payload matching SessionSummaryDataSchema
  const allStoredActivities = getActivities();
  const colorById = new Map(allStoredActivities.map((a) => [a.id, a.colorIndex]));
  const descriptionById = new Map(allStoredActivities.map((a) => [a.id, a.description]));
      const activitiesForShare = activityTimes.map(a => {
        const idx = typeof colorById.get(a.id) === 'number' ? (colorById.get(a.id) as number) : undefined;
        const set = (typeof idx === 'number' && idx >= 0 && idx < internalActivityColors.length)
          ? internalActivityColors[idx]
          : undefined;
        return {
          id: a.id,
          name: a.name,
          // Include description when available for richer context in shared JSON
          ...(descriptionById.get(a.id) ? { description: descriptionById.get(a.id) } : {}),
          duration: a.duration,
          // Do not emit colorIndex in new payloads for privacy and to avoid internal coupling
          colors: set ? { light: set.light, dark: set.dark } : undefined,
        };
      });

      const skippedForShare = skippedActivities.map(s => ({ id: s.id, name: s.name }));

  // Map timeline entries into the share payload shape with safe guards
  const timelineEntriesForShare = mapTimelineEntriesForShare(entries || []);

      // Determine completedAt from timeline entries when available — prefer latest endTime, then startTime, else now
      const completedAtIso = (() => {
        try {
          if (entries && entries.length > 0) {
            // Find the maximum timestamp among endTime (prefer) or startTime
            let maxTs: number | null = null;
            for (const e of entries) {
              if (typeof e.endTime === 'number') {
                maxTs = Math.max(maxTs ?? 0, e.endTime);
              } else if (typeof e.startTime === 'number') {
                maxTs = Math.max(maxTs ?? 0, e.startTime);
              }
            }
            if (maxTs && maxTs > 0) return new Date(maxTs).toISOString();
          }
        } catch {
          // ignore and fallthrough to now
        }
        return new Date().toISOString();
      })();

      // Determine sessionType: prefer explicit flags, fall back to 'completed'
      const sessionTypeValue = allActivitiesCompleted ? 'completed' : (isTimeUp ? 'timeUp' : 'completed');

      const payload = {
        sessionData: {
          plannedTime: totalDuration,
          timeSpent: elapsedTime,
          overtime,
          idleTime: stats.idleTime,

          activities: activitiesForShare,
          skippedActivities: skippedForShare,
          timelineEntries: timelineEntriesForShare,

          completedAt: completedAtIso,
          sessionType: sessionTypeValue,
        },
        metadata: {
          title: 'Shared session',
          createdBy: 'app'
        }
      };

      const res = await fetchWithVercelBypass('/api/sessions/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(`Share failed: ${res.status} - ${JSON.stringify(data)}`);
      }
      const json = await res.json();
      const apiUrl: string | undefined = json?.shareUrl;
      if (apiUrl) {
        setShareUrl(apiUrl);
      } else {
        const id = json?.metadata?.id || json?.id || json?.shareId;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(id && origin ? `${origin}/shared/${id}` : null);
      }
      setShowShareControls(true);
      // When share controls appear, focus the first control (copy button) if available
      requestAnimationFrame(() => {
        const el = document.querySelector('[aria-label="Copy share link"]') as HTMLElement | null;
        if (el && typeof el.focus === 'function' && !el.hasAttribute('disabled') && el.offsetParent !== null) el.focus();
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create share.';
      addToast({ message, variant: 'error' });
      setShowShareModal(false);
    } finally {
      setShareLoading(false);
    }
  };

  // Function to get the theme-appropriate color for an activity
  const getThemeAppropriateColor = (colors: TimelineEntry['colors']) => {
    if (!colors) return undefined;

    // If we already have theme-specific colors, use those directly
    if ('light' in colors && 'dark' in colors) {
      return currentTheme === 'dark' ? colors.dark : colors.light;
    }
    
    // Otherwise, extract hue from current color and find closest theme-aware color
    // Type assertion needed for TypeScript since we've confirmed it's a ColorSet
    const colorSet = colors as ColorSet;
    const hue = extractHueFromHsl(colorSet.background);
    
    // Find the closest matching color set in internalActivityColors
    const closestColorSet = findClosestColorSet(hue, colorSet);
    
    // Return the appropriate theme version with null checks
    if (!closestColorSet) {
      return {
        background: 'var(--background-muted)',
        text: 'var(--foreground)',
        border: 'var(--border-color)'
      };
    }
    
    return currentTheme === 'dark' 
      ? closestColorSet.dark 
      : closestColorSet.light;
  };

  // Helper to extract hue from HSL color
  const extractHueFromHsl = (hslColor: string | undefined): number => {
    if (!hslColor) return 0;
    
    try {
      const hueMatch = hslColor.match(/hsl\(\s*(\d+)/);
      if (hueMatch && hueMatch[1]) {
        return parseInt(hueMatch[1], 10);
      }
      return 0;
    } catch {
      // Fallback for non-HSL colors or parsing errors
      return 0;
    }
  };

  // Find the closest color set by hue
  const findClosestColorSet = (hue: number, originalColors: ColorSet) => {
    // If we can't determine hue from the color, use a fallback
    if (hue === 0 && !originalColors.background.includes('hsl(0')) {
      // Default to blue if we can't determine the hue
      return internalActivityColors[1]; // Blue color set
    }

    // Find the closest matching hue in our color sets
    let closestMatch = internalActivityColors[0];
    let smallestDiff = 360;

    internalActivityColors.forEach(colorSet => {
      const lightColorHue = extractHueFromHsl(colorSet.light.background);
      const hueDiff = Math.abs(lightColorHue - hue);
      
      // Handle hue circle wraparound (e.g., 350 is closer to 10 than 300)
      const wrappedHueDiff = Math.min(hueDiff, 360 - hueDiff);
      
      if (wrappedHueDiff < smallestDiff) {
        smallestDiff = wrappedHueDiff;
        closestMatch = colorSet;
      }
    });

    return closestMatch;
  };

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

  const getStatusMessage = () => {
    // First check if time is up, this should take precedence
    if (isTimeUp) {
      return {
        message: "Time's up! Review your completed activities below.",
        className: 'statusMessageLate'
      };
    }

    if (timerActive) {
      const remainingTime = totalDuration - elapsedTime;
      if (remainingTime < 0) {
        return {
          message: "You've gone over the allocated time!",
          className: 'statusMessageLate'
        };
      } else if (remainingTime === 0) {
        return {
          message: "Time's up!",
          className: 'statusMessageLate'
        };
      } else {
        return {
          message: "You're doing great, keep going!",
          className: 'statusMessageEarly'
        };
      }
    } else if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      
      if (timeDiff > 0) {
        const laterBy = formatDuration(timeDiff);
        return {
          message: `You took ${laterBy} more than planned`,
          className: 'statusMessageLate'
        };
      } else {
        const earlierBy = formatDuration(Math.abs(timeDiff));
        return {
          message: `Amazing! You finished ${earlierBy} earlier than planned!`,
          className: 'statusMessageEarly'
        };
      }
    }
    return null;
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

  const calculateActivityStats = () => {
    if (!entries || entries.length === 0) {
      return {
        idleTime: 0,
        activeTime: 0
      };
    }
    
    const stats = {
      idleTime: 0,
      activeTime: 0
    };
    
    let lastEndTime: number | null = null;
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      // Skip if entry is undefined
      if (!entry) continue;
      
      const endTime = entry.endTime ?? Date.now();
      
      // Calculate break time between activities
      if (lastEndTime && entry.startTime > lastEndTime) {
        stats.idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
      }
      
      // Calculate activity duration
      const duration = Math.round((endTime - entry.startTime) / 1000);
      
      if (entry.activityId) {
        stats.activeTime += duration;
      } else {
        stats.idleTime += duration;
      }
      
      lastEndTime = endTime;
    }
    
    return stats;
  };

  const calculateOvertime = () => {
    if (!entries || entries.length === 0) return 0;
    
    // Get the timestamp of the first activity start
    const firstStart = entries[0]?.startTime;
    if (!firstStart) return 0;
    
    // Calculate total time from first activity to last completion or now
    const lastEntry = entries[entries.length - 1];
    const lastEnd = lastEntry?.endTime ?? Date.now();
    const totalTimeUsed = Math.round((lastEnd - firstStart) / 1000);
    
    // Calculate overtime as any time spent beyond the planned duration
    const overtime = Math.max(0, totalTimeUsed - totalDuration);
    return overtime;
  };

  const calculateActivityTimes = () => {
    if (!entries || entries.length === 0) return [];
    
    const activityTimes: { id: string; name: string; duration: number; colors?: TimelineEntry['colors'] }[] = [];
    const activityMap = new Map<string, { duration: number; name: string; colors?: TimelineEntry['colors'] }>();
    const seenActivityIds = new Set<string>(); // Track order of first appearance
    
    // Sort entries by startTime to ensure chronological order
    const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
    
    // First pass: Calculate total durations
    for (const entry of sortedEntries) {
      if (entry.activityId && entry.activityName) {
        const endTime = entry.endTime ?? Date.now();
        const duration = Math.round((endTime - entry.startTime) / 1000);
        
        if (activityMap.has(entry.activityId)) {
          const existing = activityMap.get(entry.activityId)!;
          existing.duration += duration;
        } else {
          activityMap.set(entry.activityId, {
            duration,
            name: entry.activityName,
            colors: entry.colors
          });
        }
        
        // Track first appearance of each activity
        if (!seenActivityIds.has(entry.activityId)) {
          seenActivityIds.add(entry.activityId);
          activityTimes.push({ 
            id: entry.activityId, 
            ...activityMap.get(entry.activityId)! 
          });
        }
      }
    }
    
    // Update durations in activityTimes with final values
    return activityTimes.map(activity => ({
      ...activity,
      duration: activityMap.get(activity.id)!.duration
    }));
  };

  // Helper function to convert CSS module classes to Bootstrap Alert variants
  const getBootstrapVariant = (className: string): 'success' | 'warning' | 'info' => {
    if (className.includes('statusMessageEarly')) return 'success';
    if (className.includes('statusMessageLate')) return 'warning';
    return 'info';
  };

  const status = getStatusMessage();
  const stats = calculateActivityStats();

  // Stable content-based key for skippedActivityIds to avoid identity-only recalculations
  const skippedKey = useMemo(() => (skippedActivityIds ? skippedActivityIds.join('|') : ''), [skippedActivityIds]);

  // Build skipped activities list with names from storage (must not be conditional)
  // Use a content-based dependency to avoid recalculations on array reference changes
  const skippedActivities = useMemo<{ id: string; name: string }[]>(() => {
    if (!skippedKey) return [];
    const namesById = new Map<string, string>();
    try {
      const all = getActivities();
      for (const a of all) namesById.set(a.id, a.name);
    } catch {
      // ignore storage errors; fall back to id as name
    }
    const ids = skippedKey.split('|').filter(Boolean);
    return ids.map(id => ({ id, name: namesById.get(id) || id }));
  }, [skippedKey]);

  // Precompute values used in memoized payload to keep hook order consistent
  const overtime = calculateOvertime();
  const activityTimes = calculateActivityTimes();

  // Use centralized sharing util for consistent mapping (call directly where needed)

  // Build a stable payload for AI summary generation
  const summaryPayload = useMemo(() => ({
    plannedTime: totalDuration,
    timeSpent: elapsedTime,
    overtime,
    idle: stats.idleTime,
    perActivity: activityTimes.map(a => ({ id: a.id, name: a.name, duration: a.duration })),
    skippedIds: skippedActivities.map(s => s.id)
  }), [totalDuration, elapsedTime, overtime, stats.idleTime, activityTimes, skippedActivities]);

  // Early return modified to handle isTimeUp case
  if ((!allActivitiesCompleted && !isTimeUp) || !stats) {
    return null;
  }

  // Extracted helper to generate summary using either BYOK or server mock
  const generateAISummary = async () => {
    if (apiKey) {
      const messages = [
        { role: 'system', content: 'You summarize time tracking sessions for users.' },
        { role: 'user', content: `Create a brief friendly summary. JSON only: {"summary": string}. Data: ${JSON.stringify(summaryPayload)}` }
      ];
      const data = await callOpenAI('/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: 'json_object' }
      }) as Partial<ChatCompletion>;
      const firstChoice = (Array.isArray(data.choices) && data.choices.length > 0) ? data.choices[0] : undefined;
      const content = firstChoice?.message?.content ? String(firstChoice.message.content) : '';
      const parsed = JSON.parse(content) as { summary?: unknown };
      return (typeof parsed.summary === 'string' ? parsed.summary : '');
    }
    const res = await fetch('/api/ai/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summaryPayload)
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as unknown;
      const message = (typeof data === 'object' && data && 'error' in data && typeof (data as { error?: unknown }).error === 'string')
        ? (data as { error: string }).error
        : 'Failed to get AI summary';
      throw new Error(message);
    }
    const data = (await res.json()) as unknown;
    if (typeof data === 'object' && data && 'summary' in (data as Record<string, unknown>)) {
      const v = (data as Record<string, unknown>).summary;
      return typeof v === 'string' ? v : '';
    }
    return '';
  };

  return (
    <Card data-testid="summary" className="summary-card h-100">
      <Card.Header className="card-header-consistent">
        <h5 className="mb-0" role="heading" aria-level={2}>Summary</h5>
        <div className="d-flex gap-2 align-items-center">
  {apiKey && (!aiSummary) && (
          <Button
            variant="outline-primary"
            size="sm"
            disabled={aiLoading}
            onClick={async () => {
              try {
                setAiLoading(true);
    const summary = await generateAISummary();
    setAiSummary(summary);
              } catch (e: unknown) {
                const message = e instanceof Error ? e.message : 'AI summary failed';
                addToast({ message, variant: 'error' });
              } finally {
                setAiLoading(false);
              }
            }}
            title="Generate AI summary"
          >
            {aiLoading ? (<><Spinner size="sm" className="me-2" animation="border" />Summarizing…</>) : 'AI Summary'}
          </Button>
  )}
  {/* Auto BYOK mode indicated by presence of apiKey; no manual switch */}
        {onReset && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={onReset}
            className="d-flex align-items-center"
            title="Reset to default activities"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reset
          </Button>
        )}
        {/* Share action available in summary view */}
        <Button
          variant="outline-success"
          size="sm"
          onClick={(e) => {
            // capture trigger element so we can return focus after modal closes
            setShareTriggerElement(e.currentTarget as HTMLElement);
            setShowShareModal(true);
          }}
          className="d-flex align-items-center"
          title="Share session"
          data-testid="open-share-modal-summary"
        >
          <i className="bi bi-share me-2" />
          Share
        </Button>
        </div>
      </Card.Header>
      
      <Card.Body data-testid="summary-body">
        {status && (
          <Alert variant={getBootstrapVariant(status.className)} className="mb-3" data-testid="summary-status">
            {status.message}
          </Alert>
        )}

        <Row className="stats-grid g-3 mb-4" data-testid="stats-grid">
          <Col xs={6} md={3} data-testid="stat-card-planned">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-planned">Planned Time</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-planned">{formatDuration(totalDuration)}</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3} data-testid="stat-card-spent">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-spent">Spent Time</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-spent">{formatDuration(elapsedTime)}</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3} data-testid="stat-card-idle">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-idle">Idle Time</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-idle">{formatDuration(stats.idleTime)}</div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3} data-testid="stat-card-overtime">
            <Card className="text-center h-100">
              <Card.Body className="text-center">
                <div className="card-title small text-muted" data-testid="stat-label-overtime">Overtime</div>
                <div className="card-text fs-4 fw-bold" data-testid="stat-value-overtime">{formatDuration(overtime)}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {activityTimes.length > 0 && (
          <div className="mt-4">
            <h3 className="h5 mb-3" data-testid="activity-list-heading">
              Time Spent per Activity
            </h3>
            <ListGroup className="list-group-flush" data-testid="activity-list">
              {activityTimes.map((activity) => {
                // Get theme-appropriate colors
                const themeColors = activity.colors ? 
                  getThemeAppropriateColor(activity.colors) || activity.colors : 
                  undefined;
                
                return (
                  <ListGroup.Item 
                    key={activity.id}
                    className="activity-item d-flex justify-content-between align-items-center"
                    data-testid={`activity-summary-item-${activity.id}`}
                    style={themeColors ? {
                      backgroundColor: (themeColors as ColorSet).background,
                      borderColor: (themeColors as ColorSet).border
                    } : undefined}
                  >
                    <span 
                      className="activity-name"
                      data-testid={`activity-name-${activity.id}`}
                      style={themeColors ? { color: (themeColors as ColorSet).text } : undefined}
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

        {aiSummary && (
          <div className="mt-4" data-testid="ai-summary">
            <h3 className="h6 mb-2">AI Summary</h3>
            <Alert variant="info">{aiSummary}</Alert>
          </div>
        )}

        {skippedActivities.length > 0 && (
          <div className="mt-4" data-testid="skipped-activities">
            <h3 className="h6 mb-2">Skipped activities ({skippedActivities.length})</h3>
            <ListGroup className="list-group-flush">
              {skippedActivities.map(item => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <span className="text-body-secondary" data-testid={`skipped-activity-name-${item.id}`}>{item.name}</span>
                  <Badge bg="light" text="secondary" className="border fw-normal">Skipped</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>

      {/* Share confirmation modal */}
        <Modal
          show={showShareModal}
          onHide={() => {
            setShowShareModal(false);
            // Return focus to the trigger element for keyboard users
            setTimeout(() => {
              if (shareTriggerElement) shareTriggerElement.focus();
            }, 0);
          }}
          aria-labelledby="share-modal-title"
          aria-describedby="share-modal-desc"
        >
        <Modal.Header closeButton>
          <Modal.Title id="share-modal-title">Share session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p id="share-modal-desc">Share a read-only copy of the current session. This will create a public URL that anyone can open.</p>
          <p className="text-muted small">The shared session will contain summary and timeline data only.</p>
          {shareLoading && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" /> Creating share...
            </div>
          )}
          {showShareControls && shareUrl && (
            <div className="mt-3">
              <ShareControls shareUrl={shareUrl} showOpen={true} showReplace={false} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
              {!showShareControls && (
            <>
              <Button
                variant="secondary"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </Button>
                  <div className="d-flex flex-column align-items-end">
                    {!online && (
                      <div className="text-muted small mb-2" data-testid="share-offline-warning">Sharing requires a network connection — you are currently offline.</div>
                    )}
                    <Button
                      variant="success"
                      onClick={handleCreateShare}
                      disabled={!online}
                    >
                      Create share
                    </Button>
                  </div>
            </>
          )}
          {showShareControls && (
            <Button
              variant="primary"
              onClick={() => setShowShareModal(false)}
              aria-label="Close share dialog"
            >
              Done
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Card>
  );
}