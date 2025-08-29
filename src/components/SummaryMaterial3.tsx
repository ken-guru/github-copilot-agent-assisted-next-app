"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
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
import { Material3Button } from './ui/Material3Button';
import styles from './SummaryMaterial3.module.css';

interface SummaryProps {
  entries?: TimelineEntry[];
  totalDuration: number;
  elapsedTime: number;
  timerActive?: boolean;
  allActivitiesCompleted?: boolean;
  isTimeUp?: boolean;
  onReset?: () => void;
  skippedActivityIds?: string[];
}

export default function SummaryMaterial3({ 
  entries = [], 
  totalDuration, 
  elapsedTime, 
  timerActive = false,
  allActivitiesCompleted = false,
  isTimeUp = false,
  onReset,
  skippedActivityIds = []
}: SummaryProps) {
  const { addToast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareControls, setShowShareControls] = useState(false);
  const [shareTriggerElement, setShareTriggerElement] = useState<HTMLElement | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const { apiKey } = useApiKey();
  const { callOpenAI } = useOpenAIClient();
  const { online } = useNetworkStatus();
  
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
  );

  // Theme change effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleThemeChange = () => {
      setCurrentTheme(isDarkMode() ? 'dark' : 'light');
    };

    handleThemeChange();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const getThemeAppropriateColor = (colors: TimelineEntry['colors']) => {
    if (!colors) return undefined;

    if ('light' in colors && 'dark' in colors) {
      return currentTheme === 'dark' ? colors.dark : colors.light;
    }
    
    const colorSet = colors as ColorSet;
    const hue = extractHueFromHsl(colorSet.background);
    const closestColorSet = findClosestColorSet(hue, colorSet);
    
    if (!closestColorSet) {
      return {
        background: 'var(--md-sys-color-surface-container)',
        text: 'var(--md-sys-color-on-surface)',
        border: 'var(--md-sys-color-outline-variant)'
      };
    }
    
    return currentTheme === 'dark' ? closestColorSet.dark : closestColorSet.light;
  };

  const extractHueFromHsl = (hslColor: string | undefined): number => {
    if (!hslColor) return 0;
    
    try {
      const hueMatch = hslColor.match(/hsl\(\s*(\d+)/);
      if (hueMatch && hueMatch[1]) {
        return parseInt(hueMatch[1], 10);
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const findClosestColorSet = (hue: number, originalColors: ColorSet) => {
    if (hue === 0 && !originalColors.background.includes('hsl(0')) {
      return internalActivityColors[1];
    }

    let closestMatch = internalActivityColors[0];
    let smallestDiff = 360;

    internalActivityColors.forEach(colorSet => {
      const lightColorHue = extractHueFromHsl(colorSet.light.background);
      const hueDiff = Math.abs(lightColorHue - hue);
      const wrappedHueDiff = Math.min(hueDiff, 360 - hueDiff);
      
      if (wrappedHueDiff < smallestDiff) {
        smallestDiff = wrappedHueDiff;
        closestMatch = colorSet;
      }
    });

    return closestMatch;
  };

  const getStatusMessage = () => {
    if (isTimeUp) {
      return {
        message: "Time's up! Review your completed activities below.",
        variant: 'warning' as const
      };
    }

    if (timerActive) {
      const remainingTime = totalDuration - elapsedTime;
      if (remainingTime < 0) {
        return {
          message: "You've gone over the allocated time!",
          variant: 'warning' as const
        };
      } else if (remainingTime === 0) {
        return {
          message: "Time's up!",
          variant: 'warning' as const
        };
      } else {
        return {
          message: "You're doing great, keep going!",
          variant: 'success' as const
        };
      }
    } else if (allActivitiesCompleted) {
      const timeDiff = elapsedTime - totalDuration;
      
      if (timeDiff > 0) {
        const laterBy = formatDuration(timeDiff);
        return {
          message: `You took ${laterBy} more than planned`,
          variant: 'warning' as const
        };
      } else {
        const earlierBy = formatDuration(Math.abs(timeDiff));
        return {
          message: `Amazing! You finished ${earlierBy} earlier than planned!`,
          variant: 'success' as const
        };
      }
    }
    return null;
  };

  const formatDuration = (seconds: number): string => {
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
      return { idleTime: 0, activeTime: 0 };
    }
    
    const stats = { idleTime: 0, activeTime: 0 };
    let lastEndTime: number | null = null;
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry) continue;
      
      const endTime = entry.endTime ?? Date.now();
      
      if (lastEndTime && entry.startTime > lastEndTime) {
        stats.idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
      }
      
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
    
    const firstStart = entries[0]?.startTime;
    if (!firstStart) return 0;
    
    const lastEntry = entries[entries.length - 1];
    const lastEnd = lastEntry?.endTime ?? Date.now();
    const totalTimeUsed = Math.round((lastEnd - firstStart) / 1000);
    
    const overtime = Math.max(0, totalTimeUsed - totalDuration);
    return overtime;
  };

  const calculateActivityTimes = () => {
    if (!entries || entries.length === 0) return [];
    
    const activityTimes: { id: string; name: string; duration: number; colors?: TimelineEntry['colors'] }[] = [];
    const activityMap = new Map<string, { duration: number; name: string; colors?: TimelineEntry['colors'] }>();
    const seenActivityIds = new Set<string>();
    
    const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
    
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
        
        if (!seenActivityIds.has(entry.activityId)) {
          seenActivityIds.add(entry.activityId);
          activityTimes.push({ 
            id: entry.activityId, 
            ...activityMap.get(entry.activityId)! 
          });
        }
      }
    }
    
    return activityTimes.map(activity => ({
      ...activity,
      duration: activityMap.get(activity.id)!.duration
    }));
  };

  const stats = calculateActivityStats();
  const overtime = calculateOvertime();
  const activityTimes = calculateActivityTimes();
  const status = getStatusMessage();

  // Skipped activities calculation
  const skippedKey = useMemo(() => (skippedActivityIds ? skippedActivityIds.join('|') : ''), [skippedActivityIds]);
  
  const skippedActivities = useMemo<{ id: string; name: string }[]>(() => {
    if (!skippedKey) return [];
    const namesById = new Map<string, string>();
    try {
      const all = getActivities();
      for (const a of all) namesById.set(a.id, a.name);
    } catch {
      // ignore storage errors
    }
    const ids = skippedKey.split('|').filter(Boolean);
    return ids.map(id => ({ id, name: namesById.get(id) || id }));
  }, [skippedKey]);

  const summaryPayload = useMemo(() => ({
    plannedTime: totalDuration,
    timeSpent: elapsedTime,
    overtime,
    idle: stats.idleTime,
    perActivity: activityTimes.map(a => ({ id: a.id, name: a.name, duration: a.duration })),
    skippedIds: skippedActivities.map(s => s.id)
  }), [totalDuration, elapsedTime, overtime, stats.idleTime, activityTimes, skippedActivities]);

  // Early return for incomplete sessions
  if ((!allActivitiesCompleted && !isTimeUp) || !stats) {
    return null;
  }

  const handleCreateShare = async () => {
    try {
      if (!online) {
        addToast({ message: 'Cannot create share: no network connection. Please reconnect and try again.', variant: 'warning' });
        return;
      }
      setShareLoading(true);

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
          ...(descriptionById.get(a.id) ? { description: descriptionById.get(a.id) } : {}),
          duration: a.duration,
          colors: set ? { light: set.light, dark: set.dark } : undefined,
        };
      });

      const skippedForShare = skippedActivities.map(s => ({ id: s.id, name: s.name }));
      const timelineEntriesForShare = mapTimelineEntriesForShare(entries || []);

      const completedAtIso = (() => {
        try {
          if (entries && entries.length > 0) {
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
    <div className={styles.summaryContainer} data-testid="summary">
      <div className={styles.summaryHeader}>
        <h2 className={styles.summaryTitle} role="heading" aria-level={2}>
          Summary
        </h2>
        <div className={styles.headerActions}>
          {apiKey && (!aiSummary) && (
            <Material3Button
              variant="outlined"
              size="small"
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
              {aiLoading ? (
                <>
                  <Spinner size="sm" className="me-2" animation="border" />
                  Summarizing…
                </>
              ) : (
                'AI Summary'
              )}
            </Material3Button>
          )}
          {onReset && (
            <Material3Button
              variant="outlined"
              size="small"
              onClick={onReset}
              title="Reset to default activities"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset
            </Material3Button>
          )}
          <Material3Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              setShareTriggerElement(e.currentTarget as HTMLElement);
              setShowShareModal(true);
            }}
            title="Share session"
            data-testid="open-share-modal-summary"
          >
            <i className="bi bi-share me-2" />
            Share
          </Material3Button>
        </div>
      </div>
      
      <div className={styles.summaryBody} data-testid="summary-body">
        {status && (
          <div 
            className={`${styles.statusAlert} ${styles[status.variant]}`}
            data-testid="summary-status"
            role="alert"
          >
            {status.message}
          </div>
        )}

        <div className={styles.statsGrid} data-testid="stats-grid">
          <div className={styles.statCard} data-testid="stat-card-planned">
            <div className={styles.statLabel} data-testid="stat-label-planned">
              Planned Time
            </div>
            <div className={styles.statValue} data-testid="stat-value-planned">
              {formatDuration(totalDuration)}
            </div>
          </div>
          
          <div className={styles.statCard} data-testid="stat-card-spent">
            <div className={styles.statLabel} data-testid="stat-label-spent">
              Spent Time
            </div>
            <div className={styles.statValue} data-testid="stat-value-spent">
              {formatDuration(elapsedTime)}
            </div>
          </div>
          
          <div className={styles.statCard} data-testid="stat-card-idle">
            <div className={styles.statLabel} data-testid="stat-label-idle">
              Idle Time
            </div>
            <div className={styles.statValue} data-testid="stat-value-idle">
              {formatDuration(stats.idleTime)}
            </div>
          </div>
          
          <div className={styles.statCard} data-testid="stat-card-overtime">
            <div className={styles.statLabel} data-testid="stat-label-overtime">
              Overtime
            </div>
            <div className={styles.statValue} data-testid="stat-value-overtime">
              {formatDuration(overtime)}
            </div>
          </div>
        </div>

        {activityTimes.length > 0 && (
          <div className="mt-4">
            <h3 className={styles.sectionTitle} data-testid="activity-list-heading">
              Time Spent per Activity
            </h3>
            <div className={styles.activityList} data-testid="activity-list">
              {activityTimes.map((activity) => {
                const themeColors = activity.colors ? 
                  getThemeAppropriateColor(activity.colors) || activity.colors : 
                  undefined;
                
                return (
                  <div 
                    key={activity.id}
                    className={styles.activityItem}
                    data-testid={`activity-summary-item-${activity.id}`}
                    style={themeColors ? {
                      backgroundColor: (themeColors as ColorSet).background,
                      borderColor: (themeColors as ColorSet).border
                    } : undefined}
                  >
                    <span 
                      className={styles.activityName}
                      data-testid={`activity-name-${activity.id}`}
                      style={themeColors ? { color: (themeColors as ColorSet).text } : undefined}
                    >
                      {activity.name}
                    </span>
                    <span className={styles.activityTime}>
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {aiSummary && (
          <div className={styles.aiSummarySection} data-testid="ai-summary">
            <h3 className={styles.aiSummaryTitle}>AI Summary</h3>
            <div className={styles.aiSummaryContent}>{aiSummary}</div>
          </div>
        )}

        {skippedActivities.length > 0 && (
          <div className={styles.skippedSection} data-testid="skipped-activities">
            <h3 className={styles.sectionTitle}>
              Skipped activities ({skippedActivities.length})
            </h3>
            <div className={styles.skippedList}>
              {skippedActivities.map(item => (
                <div key={item.id} className={styles.skippedItem}>
                  <span 
                    className={styles.skippedName} 
                    data-testid={`skipped-activity-name-${item.id}`}
                  >
                    {item.name}
                  </span>
                  <span className={styles.skippedBadge}>Skipped</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share confirmation modal */}
      <Modal
        show={showShareModal}
        onHide={() => {
          setShowShareModal(false);
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
          {!showShareControls && !online && (
            <div 
              className={`${styles.statusAlert} ${styles.warning}`}
              role="alert"
              data-testid="share-offline-warning"
            >
              Sharing requires a network connection — you are currently offline.
            </div>
          )}
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
              <Material3Button
                variant="text"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </Material3Button>
              <Material3Button
                variant="filled"
                onClick={handleCreateShare}
                disabled={!online}
                title={!online ? 'You are offline. Reconnect to create a share.' : 'Create share'}
              >
                Create share
              </Material3Button>
            </>
          )}
          {showShareControls && (
            <Material3Button
              variant="filled"
              onClick={() => setShowShareModal(false)}
              aria-label="Close share dialog"
            >
              Done
            </Material3Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}