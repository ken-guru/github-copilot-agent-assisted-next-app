## Session Sharing

This document explains how to use Session Sharing (for users) and how it works under the hood (for developers).

### User Guide

Share a read‑only snapshot of your session:

1. In Summary, click `Share` to create a link.
2. Use `Copy Link` to share, `Open` to preview, or `Download JSON` for a file copy.
3. Use `Replace` to import a shared session back into your app (descriptions and colors are preserved).

Privacy and content:
- Included: activities (name, color, optional description), session timings, anonymized metadata.
- Excluded: PII (e.g., user agent), internal indices (e.g., `colorIndex`).

Theme-aware shared page:
- Visiting `/shared/[id]` normalizes colors to your current theme; if no exact palette match is found, it uses a hue‑nearest fallback.

Tips:
- Links are deterministic and safe to re-share.
- If a preview briefly 404s, retry after a moment.
### Environment Variables

- `BLOB_READ_WRITE_TOKEN` (required in production/preview) — the Vercel Blob read/write token used by the server to PUT/GET blobs.
- `BLOB_BASE_URL` (required in production/preview) — base URL for the Vercel Blob REST API. Example: `https://api.vercel.com/v1/blob` or `https://api.vercel.com` (the server normalizes both forms).
- `BLOB_READ_WRITE_TOKEN_DEV` and `BLOB_BASE_URL_DEV` — optional overrides used during local development when `NODE_ENV=development`.
- `BLOB_LOCAL_DIR` — optional path for storing local blob JSON files when using local fallback.
- `NEXT_PUBLIC_BASE_URL` — used to construct share URLs in the UI if the app runs behind a different origin.

### Local development and tests

- Local development can use `BLOB_READ_WRITE_TOKEN` and `BLOB_BASE_URL` (or `_DEV` variants) to exercise the real Vercel Blob flow.
- Tests (Jest) are forced to use a local filesystem fallback to guarantee tests do not call remote services. The code path uses a `.vercel_blob_store` folder in the project root or OS tempdir. This ensures deterministic tests and CI-safe runs.

### How sharing works (high level)

1. The client builds a sanitized `SessionSummaryData` payload and POSTs to `/api/sessions/share`.
2. The server validates the payload with Zod and then attempts to store the session either in the configured Vercel Blob endpoint (if env vars present) or fall back to writing a local JSON file.
3. When stored in blob storage, the server returns a share id; the UI builds a share URL (`/shared/<id>`) that anyone can open.

### Playwright guidance

- The project includes Playwright/Playwright-style UI automation to exercise the share flow using the real UI. If the automated browser cannot use the real blob service (for CI constraints), the tests fall back to a local POST or use the local store. Ensure that CI environment variables do not point to the real blob service unless you want end-to-end verification.

### Troubleshooting 404 on Vercel preview

If you see a runtime error like `Vercel Blob write failed: 404 Blob not found` in preview logs, try the following checklist in order:

1. Inspect logs (sanitized) to see the exact PUT URL the server constructed. The storage layer normalizes `BLOB_BASE_URL` by removing trailing slashes and appending `/v1/blob` when only an API root is given.
2. Confirm that `BLOB_BASE_URL` environment variable on Vercel matches the expected Vercel Blob endpoint. Use `https://api.vercel.com/v1/blob` as the canonical value.
3. Verify that the `BLOB_READ_WRITE_TOKEN` deployed in Vercel has correct write permissions and is not scoped to a different project or region.
4. Some blob APIs require a two-step flow: create an upload (server → API) which returns an upload URL, then PUT the payload to that URL. If the remote responds with a 404 indicating the requested blob ID doesn't exist, implement the create-upload → PUT sequence following Vercel's blob docs.
5. If the error message includes an unauthorized (401/403) response, treat this as token/scope/permission issue rather than a path mismatch.

### Developer notes

- The server intentionally avoids logging secrets; logs are sanitized in production.
- Tests and development use local fallback when `NODE_ENV==='test'` or when env vars are missing.

### Next steps when debugging remotely

1. Push branch and trigger preview deployment. The server will log a sanitized PUT target and the response status/body when not in production.
2. Share the sanitized logs if further assistance is needed; include the normalized PUT `url` and the response `status` and `body` so we can decide whether to (a) correct URL formation, (b) implement create-upload flow, or (c) fix token/permission issues.

### Links

- Session Sharing developer guide: ./dev-guides/session-sharing.md

- Vercel Blob docs: https://vercel.com/docs/vercel-blob
