"use client";

import React, { useEffect, useMemo, useState } from 'react';
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
import Material3Card from '@/design-system/components/Card';
import Material3Button from '@/design-system/components/Button';
import Material3Modal from '@/design-system/components/Modal';

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
    <Material3Card data-testid="summary" className="h-full">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-outline-variant">
        <div className="flex justify-between items-center">
          <h5 className="mb-0 text-lg font-medium" role="heading" aria-level={2}>Summary</h5>
          <div className="flex gap-2 items-center">
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Summarizing…
                  </>
                ) : 'AI Summary'}
              </Material3Button>
            )}
            {onReset && (
              <Material3Button 
                variant="outlined"
                color="error"
                size="small" 
                onClick={onReset}
                className="flex items-center"
                title="Reset to default activities"
              >
                <i className="bi bi-arrow-clockwise mr-2"></i>
                Reset
              </Material3Button>
            )}
            <Material3Button
              variant="outlined"
              size="small"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                setShareTriggerElement(e.currentTarget as HTMLElement);
                setShowShareModal(true);
              }}
              className="flex items-center"
              title="Share session"
              data-testid="open-share-modal-summary"
            >
              <i className="bi bi-share mr-2" />
              Share
            </Material3Button>
          </div>
        </div>
      </div>
      
      <div className="p-6" data-testid="summary-body">
        {status && (
          <div 
            className={`p-4 rounded-lg mb-6 ${
              status.className.includes('statusMessageEarly') 
                ? 'bg-success-container text-on-success-container'
                : status.className.includes('statusMessageLate')
                ? 'bg-error-container text-on-error-container'
                : 'bg-primary-container text-on-primary-container'
            }`}
            data-testid="summary-status"
          >
            {status.message}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-testid="stats-grid">
          <Material3Card className="text-center" data-testid="stat-card-planned">
            <div className="p-4 text-center">
              <div className="text-sm text-on-surface-variant mb-2" data-testid="stat-label-planned">Planned Time</div>
              <div className="text-2xl font-bold" data-testid="stat-value-planned">{formatDuration(totalDuration)}</div>
            </div>
          </Material3Card>
          
          <Material3Card className="text-center" data-testid="stat-card-spent">
            <div className="p-4 text-center">
              <div className="text-sm text-on-surface-variant mb-2" data-testid="stat-label-spent">Spent Time</div>
              <div className="text-2xl font-bold" data-testid="stat-value-spent">{formatDuration(elapsedTime)}</div>
            </div>
          </Material3Card>
          
          <Material3Card className="text-center" data-testid="stat-card-idle">
            <div className="p-4 text-center">
              <div className="text-sm text-on-surface-variant mb-2" data-testid="stat-label-idle">Idle Time</div>
              <div className="text-2xl font-bold" data-testid="stat-value-idle">{formatDuration(stats.idleTime)}</div>
            </div>
          </Material3Card>
          
          <Material3Card className="text-center" data-testid="stat-card-overtime">
            <div className="p-4 text-center">
              <div className="text-sm text-on-surface-variant mb-2" data-testid="stat-label-overtime">Overtime</div>
              <div className="text-2xl font-bold" data-testid="stat-value-overtime">{formatDuration(overtime)}</div>
            </div>
          </Material3Card>
        </div>

        {activityTimes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4" data-testid="activity-list-heading">
              Time Spent per Activity
            </h3>
            <div className="space-y-2" data-testid="activity-list">
              {activityTimes.map((activity) => {
                const themeColors = activity.colors ? 
                  getThemeAppropriateColor(activity.colors) || activity.colors : 
                  undefined;
                
                return (
                  <div 
                    key={activity.id}
                    className="flex justify-between items-center p-3 border border-outline-variant rounded-lg"
                    data-testid={`activity-summary-item-${activity.id}`}
                    style={themeColors ? {
                      backgroundColor: (themeColors as ColorSet).background,
                      borderColor: (themeColors as ColorSet).border
                    } : undefined}
                  >
                    <span 
                      className="font-medium"
                      data-testid={`activity-name-${activity.id}`}
                      style={themeColors ? { color: (themeColors as ColorSet).text } : undefined}
                    >
                      {activity.name}
                    </span>
                    <div className="bg-primary text-on-primary px-3 py-1 rounded-full text-sm font-medium">
                      {formatDuration(activity.duration)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {aiSummary && (
          <div className="mt-6" data-testid="ai-summary">
            <h3 className="text-base font-medium mb-2">AI Summary</h3>
            <div className="bg-primary-container text-on-primary-container p-4 rounded-lg">
              {aiSummary}
            </div>
          </div>
        )}

        {skippedActivities.length > 0 && (
          <div className="mt-6" data-testid="skipped-activities">
            <h3 className="text-base font-medium mb-2">Skipped activities ({skippedActivities.length})</h3>
            <div className="space-y-2">
              {skippedActivities.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 border border-outline-variant rounded-lg">
                  <span className="text-on-surface-variant" data-testid={`skipped-activity-name-${item.id}`}>{item.name}</span>
                  <div className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-sm border">
                    Skipped
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share confirmation modal */}
      <Material3Modal
        open={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setTimeout(() => {
            if (shareTriggerElement) shareTriggerElement.focus();
          }, 0);
        }}
        title="Share session"
      >
        <div className="space-y-4">
          <p>Share a read-only copy of the current session. This will create a public URL that anyone can open.</p>
          <p className="text-on-surface-variant text-sm">The shared session will contain summary and timeline data only.</p>
          
          {!showShareControls && !online && (
            <div
              className="bg-error-container text-on-error-container p-3 rounded-lg"
              role="alert"
              data-testid="share-offline-warning"
            >
              Sharing requires a network connection — you are currently offline.
            </div>
          )}
          
          {shareLoading && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Creating share...
            </div>
          )}
          
          {showShareControls && shareUrl && (
            <div className="mt-3">
              <ShareControls shareUrl={shareUrl} showOpen={true} showReplace={false} />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          {!showShareControls && (
            <>
              <Material3Button
                variant="outlined"
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
        </div>
      </Material3Modal>
    </Material3Card>
  );
}