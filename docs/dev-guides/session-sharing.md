# Session Sharing Developer Guide

This guide documents the architecture, data model, storage flow, privacy rules, API surface, and testing strategy for the Session Sharing feature.

## Overview

Session Sharing lets users generate a public link to a read‑only snapshot of their session. The shared page is theme-aware and includes activity descriptions and colors. Links are deterministic and safe to re-share.

Core goals:
- Robust in preview and production
- Privacy-preserving logs and payloads
- Deterministic public naming with safe overwrite
- Offline-friendly tests (no external network)

## Data Model and Schema

Location:
- `src/utils/sessionSharing/schema.ts` (Zod schemas)
- `src/types/sessionSharing.ts` (TypeScript types)

Key points:
- Activities include `name`, `color` (exported value), and optional `description`
- `colorIndex` is removed (not serialized)
- Metadata is anonymized (e.g., no `userAgent`); timestamps are included for human-readable header

Backward compatibility: legacy fields are tolerated by the schema where feasible.

## Storage and Persistence

Primary utilities:
- `src/utils/sessionSharing/storage.ts` – save/get logic with SDK-first strategy and fallbacks
- `src/utils/sessionSharing/utils.ts` – UUID helpers (RFC4122 v4)
- `src/utils/fetchWithVercelBypass.ts` – preview protection bypass

Write flow:
1. SDK-like deterministic naming: `put(`${id}.json`, { access: 'public', addRandomSuffix: false, allowOverwrite: true })`
2. Fallbacks for REST flows:
   - Try direct PUT to `${base}/${id}` or `${base}/${id}.json`
   - If 404, use create-upload and PUT to returned `uploadURL`

Read flow:
1. Try `head(name, { token })` if available (preview protection)
2. Try list discovery; then REST GET `${id}.json` → `${id}`

Deterministic naming guarantees stable URLs and safe overwrites.

## Preview Bypass and Security

Preview protection may restrict reads. We provide a bypass route and helper:
- API route: `/api/vercel-bypass` (internal)
- Helper: `fetchWithVercelBypass` ensures we do not leak tokens via query strings

Security and privacy safeguards:
- Never log secrets (tokens are redacted; logs use safe preview strings)
- Anonymized payloads (no `userAgent` or PII)
- Per-origin host rate limiting on share creation
- SSR-safe origin handling (prefer server-provided `shareUrl`, fall back to `window.origin` guarded)

## API Endpoints

- `POST /api/sessions/share`
  - Request: JSON payload from Summary/ActivityManager
  - Response: `{ shareId: string, shareUrl: string }`
  - Validates schema, persists snapshot (SDK/local), applies rate limiting and origin validation

- `GET /api/sessions/[id]`
  - Returns the stored JSON snapshot for the given id

Shared page route:
- `app/shared/[id]` – theme-aware page that normalizes colors and renders the shared session

## UI Components and Flow

- `Summary`/`ActivityManager`
  - Build payload, call `POST /api/sessions/share`
  - Prefer `shareUrl` from API; SSR-safe fallback to `window.origin`

- `ShareControls`
  - Copy/Open/Download/Replace actions with absolute URLs
  - A11y: container is a labeled region; toasts use `role="status"`, `aria-live="polite"`, `aria-atomic="true"`

## Theme and Color Normalization

The shared page maps stored colors to the current theme palette. If an exact token match isn’t found, it uses a hue‑nearest fallback so items remain legible and on-brand in light/dark mode.

## Testing Strategy

Use Jest for unit/integration; avoid live network calls:
- Storage tests mock network and ensure SDK-first + fallbacks
- API route tests verify rate limiting, origin validation, and serialization safety
- fetchBypass tests confirm content-type detection and token handling
- Replace/import tests verify `description` preservation
- Theme tests verify color normalization on the shared page

Guidelines:
- Do not hit Vercel endpoints in tests
- Prefer local stores and explicit mocks
- Keep logs sanitized in tests (no tokens)

## Developer Checklist

- [ ] Payload includes `description` and exported `color`
- [ ] No `colorIndex` in saved JSON
- [ ] Absolute `shareUrl` used; SSR-safe fallback only when needed
- [ ] No tokens in logs, no tokens in URLs
- [ ] All Jest tests pass offline
- [ ] Type-check, lint, and build succeed
