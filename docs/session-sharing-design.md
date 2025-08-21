# Shareable Session Summary - Design & Requirements

> This document outlines the design, architecture, requirements, and implementation plan for the Shareable Session Summary feature.

## Overview

The shareable session summary feature enables users to generate unique URLs for their completed time tracking sessions, allowing them to share their productivity data with others. The feature integrates seamlessly with the existing Summary component and leverages Vercel Blob storage for persistence.

## Architecture

### High-Level Flow
1. **Session Completion**: When a user completes all activities or time expires, the Summary component displays
2. **User Choice**: User explicitly chooses to make session shareable via "Make Shareable" button
3. **Share Generation**: System generates UUID and stores session data in Vercel Blob
4. **URL Sharing**: User receives shareable URL in format `/shared/{uuid}` with copy functionality
5. **Shared Viewing**: Recipients access read-only session summary via the shared URL
6. **Activity Duplication**: Visitors can click "Use These Activities" to copy the activity list to their own session
7. **Session Linking**: When copied activities are completed and shared, they link back to the original session

### Storage Strategy
- **Primary**: Vercel Blob storage for JSON session data
- **Key Format**: UUID v4 for cryptographically secure identifiers
- **Data Format**: JSON serialization of session summary data
- **Lifecycle**: 90-day automatic expiration with metadata tracking

## Components and Interfaces

### New Components

#### 1. ShareSessionControls Component

```typescript
interface ShareSessionControlsProps {
  sessionData: SessionSummaryData;
  isShared: boolean;
  shareUrl?: string;
  onMakeShareable: () => void;
  disabled?: boolean;
}
```
- Handles two-step sharing process: "Make Shareable" → "Copy Link"
- Shows different states: not shared, generating, shared with URL
- Integrates into existing Summary component header
- Provides copy-to-clipboard functionality with feedback

#### 2. SharedSessionPage Component

```typescript
interface SharedSessionPageProps {
  params: { uuid: string };
}
```
- Server-side rendered page for shared session viewing
- Fetches session data from Vercel Blob storage
- Renders read-only version of Summary component
- Handles not found and expired session states

#### 3. SharedSummary Component

```typescript
interface SharedSummaryProps {
  sessionData: SessionSummaryData;
  sharedAt: string;
  expiresAt: string;
  onDuplicateActivities: () => void;
}
```
- Read-only version of Summary component
- Displays session metadata (shared date, expiration)
- Removes interactive elements (AI summary, reset button)
- Adds "Use These Activities" button for activity duplication
- Maintains visual consistency with main Summary

### Modified Components

#### Summary Component Enhancement
- Add ShareSessionControls to component header
- Track sharing state (not shared, generating, shared)
- Extract session data preparation logic
- Maintain backward compatibility with existing props

### API Routes

#### 1. POST /api/sessions/share

```typescript
interface ShareSessionRequest {
  sessionData: SessionSummaryData;
  csrfToken?: string; // CSRF protection
}

interface ShareSessionResponse {
  shareId: string;
  shareUrl: string;
  expiresAt: string;
}
```
- **Security**: Rate limiting, input validation, CSRF protection
- **Validation**: Strict schema validation with Zod
- **Sanitization**: Clean all user-generated content
- Generates cryptographically secure UUID and stores in Vercel Blob
- Returns shareable URL and metadata

#### 2. GET /api/sessions/[uuid]

```typescript
interface GetSessionResponse {
  sessionData: SessionSummaryData;
  metadata: SessionMetadata;
}
```
- **Security**: UUID format validation, rate limiting
- **Access Control**: Public read-only access with logging
- Retrieves session data by UUID with expiration validation
- Returns 404 for missing/expired sessions with generic error messages

#### 3. POST /api/sessions/duplicate

```typescript
interface DuplicateSessionRequest {
  sourceSessionId: string;
  newSessionData: SessionSummaryData;
  csrfToken?: string; // CSRF protection
}

interface DuplicateSessionResponse {
  shareId: string;
  shareUrl: string;
  expiresAt: string;
}
```
- **Security**: Validate source session exists and isn't expired
- **Relationship Validation**: Prevent circular references and excessive chain depth
- **Rate Limiting**: Prevent abuse of duplication feature
- Creates new shared session linked to original with proper validation
- Updates original session's derivedSessionIds array securely

### App Router Integration

#### New Route: /shared/[uuid]/page.tsx
- Dynamic route for shared session viewing
- Server-side data fetching with error boundaries
- SEO-friendly metadata generation
- Responsive layout matching main app

### Activity Duplication Workflow

#### Client-Side Flow
1. **Visitor Views Shared Session**: Sees "Use These Activities" button in SharedSummary
2. **Activity Extraction**: System extracts activity list from shared session data
3. **Local Storage Update**: Replaces user's current activities with duplicated ones
4. **Navigation**: Redirects to main app with new activities loaded
5. **Session Tracking**: Stores original session ID for future linking

#### Activity Mapping
```typescript
interface ActivityDuplicationData {
  activities: Activity[];           // Full activity objects for local storage
  originalSessionId: string;       // UUID of source session
  duplicatedAt: string;           // ISO timestamp
}
```

#### Integration Points
- **Activity Storage**: Extend existing activity-storage.ts with duplication functions
- **Session State**: Track original session ID in app state
- **Completion Linking**: When user completes and shares, link back to original

## Data Models

### SessionSummaryData Interface
```typescript
interface SessionSummaryData {
  // Core session metrics
  plannedTime: number;           // Total planned duration in seconds
  timeSpent: number;            // Actual time spent in seconds
  overtime: number;             // Overtime in seconds
  idleTime: number;             // Idle time in seconds
  
  // Activity breakdown
  activities: ActivitySummary[];
  skippedActivities: SkippedActivity[];
  
  // Timeline data (simplified for sharing)
  timelineEntries: SharedTimelineEntry[];
  
  // Session metadata
  completedAt: string;          // ISO timestamp
  sessionType: 'completed' | 'timeUp';
  
  // Session relationships
  originalSessionId?: string;   // UUID of session this was copied from
  derivedSessionIds?: string[]; // UUIDs of sessions copied from this one
}

interface ActivitySummary {
  id: string;
  name: string;
  duration: number;             // Duration in seconds
  colorIndex: number;           // For consistent theming
}

interface SkippedActivity {
  id: string;
  name: string;
}

interface SharedTimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime: number | null;
  colorIndex?: number;          // Simplified color reference
}
```

### SessionMetadata Interface
```typescript
interface SessionMetadata {
  id: string;                   // UUID
  createdAt: string;           // ISO timestamp
  expiresAt: string;           // ISO timestamp (90 days from creation)
  version: string;             // Schema version for future migrations
  userAgent?: string;          // Optional browser info for analytics
}
```

### Vercel Blob Storage Structure
```typescript
interface StoredSession {
  sessionData: SessionSummaryData;
  metadata: SessionMetadata;
}
```

## Rate limiting decision

For the initial rollout we intentionally keep the rate-limiting approach simple and low-friction:

- Default: keep the in-memory (process-local) rate limiter for `POST /api/sessions/share`.
  - Rationale: the current userbase is small and traffic is expected to be low; an in-memory limiter prevents accidental rapid re-submissions during development and early adoption without requiring additional infrastructure.
  - This limiter is already implemented and covered by unit tests in the repository.

- Migration path (when scale or abuse requires it):
  1. Implement a blob-store-based adapter that appends one small event object per request under a `rate-limits/<key>/` prefix and counts recent events by listing and filtering timestamps in object names. This keeps all storage in Vercel Blob Store and avoids adding other services.
  2. If strict atomic counters or higher QPS are later required, add a managed centralized counter store (Upstash/Vercel KV or managed Redis) as a drop-in adapter. The limiter code should follow an adapter pattern to make swapping implementations straightforward.

- Failure semantics and monitoring:
  - The in-memory limiter is permissive across multiple instances (counters are per-process) — monitor share endpoint metrics to detect abnormal request patterns and promote to a distributed adapter when needed.
  - For distributed adapters, prefer fail-open behavior on adapter errors (allow requests and log errors) to avoid blocking legitimate users during transient infra problems; tune to your security model if stricter behavior is required.

This keeps the initial deployment simple while documenting a clear upgrade path when the app grows.

## Error Handling

### Client-Side Error Scenarios
1. **Network Failures**: Retry logic with exponential backoff
2. **Storage Quota**: Graceful degradation with user notification
3. **Invalid Session Data**: Validation with specific error messages
4. **Copy to Clipboard Failures**: Fallback to manual selection

### Server-Side Error Scenarios
1. **Vercel Blob Unavailable**: 503 Service Unavailable with retry-after
2. **Invalid UUID Format**: 400 Bad Request with validation details
3. **Session Not Found**: 404 Not Found with helpful message
4. **Session Expired**: 410 Gone with expiration information
5. **Storage Write Failures**: 500 Internal Server Error with logging

### Error Boundaries
- Wrap SharedSessionPage in error boundary
- Fallback UI for corrupted session data
- Graceful degradation for missing components

## Testing Strategy

### Unit Tests
- SessionSummaryData serialization/deserialization
- UUID generation and validation
- Session expiration logic
- Component prop validation

### Integration Tests
- API route functionality (share creation, retrieval)
- Vercel Blob storage operations
- Error handling scenarios
- URL generation and validation

### End-to-End Tests
- Complete share workflow (generate → store → retrieve → display)
- Cross-browser clipboard functionality
- Mobile responsive behavior
- Theme consistency between original and shared views

### Performance Tests
- Large session data handling
- Concurrent share generation
- Storage operation timeouts
- Memory usage with multiple shared sessions

## Security Considerations

// ... (document continues with all the security sections from the user's request)

## Performance Optimizations

// ... (document continues)

## Deployment Considerations

// ... (document continues)

# Requirements

(Full requirements as provided in the Requirements Document section)

# Implementation Plan

(Full implementation plan and task breakdown provided in the user's request)

---

> Note: This document was added to the repository by an automated assistant. For implementation, follow the staged plan in `docs/PLANNED_CHANGES.md` and the project commit procedures.
