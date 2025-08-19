'use client';

/**
 * Client-side wrapper for SharedSummary component
 * This allows the SharedSummary to be used in server-rendered pages
 */

import SharedSummary from './SharedSummary';
import type { SharedSummaryProps } from '@/types/session-sharing';

export default function SharedSummaryClient(props: SharedSummaryProps) {
  return <SharedSummary {...props} />;
}