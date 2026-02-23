# Admin Authentication & Analytics Plan

> Comprehensive plan for adding admin authentication, session search, and anonymized analytics to the activity tracking application.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Current State Analysis](#2-current-state-analysis)
- [3. Vercel Platform Evaluation](#3-vercel-platform-evaluation)
- [4. Recommended Approach](#4-recommended-approach)
- [5. Authentication Methods](#5-authentication-methods)
- [6. Architecture Design](#6-architecture-design)
- [7. Security Architecture](#7-security-architecture)
- [8. Data Storage Strategy](#8-data-storage-strategy)
- [9. Admin Features](#9-admin-features)
- [10. Implementation Plan](#10-implementation-plan)
- [11. Alternative Approaches](#11-alternative-approaches)
- [12. Environment Variables](#12-environment-variables)
- [13. Risk Assessment](#13-risk-assessment)
- [14. References](#14-references)

---

## 1. Executive Summary

This document outlines a comprehensive plan for adding admin-only authentication to the application, enabling a signed-in admin user to search across saved/shared sessions and view anonymized analytics and usage data.

### Goals

1. **Admin authentication** supporting magic links, passkeys, and username/password with 2FA
2. **Session search** across all shared sessions stored in Vercel Blob
3. **Anonymized analytics dashboard** with simple usage graphs
4. **Security-first approach** maintaining the app's existing security posture
5. **Admin independence** from the Vercel deployment/maintenance user account

### Recommended Solution

**Auth.js v5** (formerly NextAuth.js) with the **Data Access Layer (DAL) pattern**, using **Vercel Postgres** for admin accounts/sessions and the existing **Vercel Blob** for session data. This approach:

- Leverages Vercel's infrastructure without depending on Vercel's deployment protection
- Keeps the admin user completely independent from the Vercel platform user
- Supports all three requested authentication methods
- Follows current Next.js security best practices (post-CVE-2025-29927)

---

## 2. Current State Analysis

### What We Have

| Aspect | Current State |
|--------|--------------|
| **Authentication** | None — no user accounts, login, or sessions |
| **Data Storage** | Client-side localStorage + Vercel Blob (sharing only) |
| **Middleware** | No `middleware.ts` exists |
| **API Routes** | Session sharing (`/api/sessions/`), AI features (`/api/ai/`), PWA manifest |
| **Security** | Strict CSP headers, rate limiting, Zod validation, BYOK API keys |
| **Vercel Services** | Vercel Blob (session sharing), Vercel Analytics, Vercel Speed Insights |
| **State Management** | React Context (Theme, Toast, ApiKey, Loading) + Custom Hooks |
| **Framework** | Next.js 16.1.6, React 19, TypeScript 5, Bootstrap 5 |

### Key Security Strengths to Preserve

- **Content Security Policy (CSP)**: Comprehensive CSP in `next.config.js` restricting scripts, connections, and frames
- **No credential persistence**: BYOK API keys stored only in memory (React state)
- **Rate limiting**: Per-origin rate limiter on session sharing endpoint
- **Input validation**: Zod schemas throughout the codebase
- **No sensitive data exposure**: `.gitignore` excludes all `.env*` files

### Architectural Considerations

- The app is primarily **client-side** with minimal server-side logic
- No database exists — adding one is required for authentication
- The existing **Context pattern** (ThemeContext, ApiKeyContext) provides a clean pattern for an AuthContext
- The existing **session sharing** infrastructure (Vercel Blob) can be leveraged for session search

---

## 3. Vercel Platform Evaluation

### Vercel Deployment Protection (Referenced Documentation)

The [Vercel Authentication documentation](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication) describes **deployment-level protection**, which is fundamentally different from application-level authentication:

| Feature | Vercel Deployment Protection | App-Level Authentication (What We Need) |
|---------|------------------------------|----------------------------------------|
| **Purpose** | Protect deployment URLs from public access | Manage user access within the app |
| **Where it acts** | At the Vercel CDN layer, before app code runs | Inside the application logic |
| **Who manages** | Vercel Dashboard settings | Application code and configuration |
| **User identity** | Vercel team members only | Custom admin users (independent of Vercel) |
| **Auth methods** | Vercel account SSO only | Magic links, passkeys, credentials + 2FA |
| **Session control** | Vercel-managed | Application-managed |

**Conclusion**: Vercel Deployment Protection is **not suitable** for this use case because:

1. It requires users to have Vercel accounts (violates the independence requirement)
2. It protects the entire deployment, not specific routes
3. It doesn't support magic links, passkeys, or custom 2FA
4. It doesn't provide session management for admin features

### Vercel Services We Can Leverage

While Vercel's deployment protection doesn't fit, several Vercel services are ideal for our auth infrastructure:

| Service | Use Case | Status |
|---------|----------|--------|
| **Vercel Postgres** | Admin accounts, sessions, 2FA secrets, audit logs | **New** — needs to be added |
| **Vercel Blob** | Already used for session sharing — can be queried for admin search | **Existing** |
| **Vercel KV (Redis)** | Rate limiting for auth endpoints, short-lived tokens | **Optional** — enhances existing in-memory rate limiter |
| **Vercel Analytics** | Already integrated — can complement custom analytics | **Existing** |
| **Vercel Edge Functions** | Middleware for route protection (with DAL pattern as primary) | **New** — via `middleware.ts` |

---

## 4. Recommended Approach

### Primary: Auth.js v5 with Data Access Layer Pattern

**Auth.js** (the evolution of NextAuth.js) is the recommended authentication library because:

1. **Official Vercel recommendation**: Vercel's own admin dashboard templates use Auth.js
2. **Next.js App Router native**: Built for the App Router pattern we already use
3. **Multi-provider support**: Supports all three requested auth methods
4. **Active maintenance**: Regularly updated for Next.js compatibility
5. **Minimal footprint**: Adds few dependencies, aligning with the app's lean stack
6. **Database adapters**: Direct support for Vercel Postgres via `@auth/pg-adapter`

### Why Data Access Layer (DAL) Pattern Over Middleware-Only

> **Critical Security Consideration**: CVE-2025-29927 demonstrated that Next.js middleware can be bypassed. While Next.js 16.1.6 (our version) is patched, the security community now recommends **defense in depth**: use middleware for UX convenience (redirects) but enforce all authorization checks at the data access layer.

```
┌─────────────────────────────────────────────────────────┐
│                    Request Flow                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Client Request                                          │
│       │                                                  │
│       ▼                                                  │
│  ┌─────────────┐   Convenience only: redirect            │
│  │ Middleware   │   unauthenticated users to /auth/login  │
│  │ (Edge)      │   Do NOT rely on this for security       │
│  └──────┬──────┘                                         │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐   Server Component or API Route         │
│  │ Route       │   Renders page or handles request        │
│  │ Handler     │                                         │
│  └──────┬──────┘                                         │
│         │                                                │
│         ▼                                                │
│  ┌─────────────────────────────────┐                     │
│  │ Data Access Layer (DAL)         │  ◄── PRIMARY        │
│  │                                 │      SECURITY       │
│  │  • Validate session             │      ENFORCEMENT    │
│  │  • Check admin role             │                     │
│  │  • Return data or throw 403     │                     │
│  └──────┬──────────────────────────┘                     │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                         │
│  │ Database    │   Vercel Postgres / Vercel Blob          │
│  └─────────────┘                                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Admin Independence from Vercel User

The admin authentication system is **completely independent** from the Vercel platform:

- Admin accounts are stored in **Vercel Postgres** (a database service), not in Vercel's user/team system
- Admin credentials (passwords, 2FA secrets, passkey registrations) are managed by the application
- An admin email allowlist in environment variables controls who can sign in
- The Vercel deployment user manages infrastructure; the admin user manages app data
- No Vercel account is needed to be an admin user

---

## 5. Authentication Methods

### 5.1 Magic Links (Email Provider)

**How it works**: Admin enters their email → receives a one-time login link → clicks link to authenticate.

```
Admin enters email ──► Server validates email is in allowlist
                       ──► Generates token, stores in DB
                       ──► Sends email via configured provider
                       ──► Admin clicks link
                       ──► Server validates token
                       ──► Creates session
```

**Requirements**:
- Email service provider (recommended: **Resend** — free tier supports 100 emails/day, Vercel integration available)
- Vercel Postgres for verification tokens
- Admin email allowlist in environment variables

**Security considerations**:
- Tokens are single-use and time-limited (10 minutes recommended)
- Tokens are hashed before storage (Auth.js default behavior)
- Failed attempts are rate-limited
- Only emails in the allowlist can trigger token generation

### 5.2 Passkeys / WebAuthn

**How it works**: Admin registers a passkey (biometric, hardware key, or platform authenticator) → uses it for subsequent logins.

```
Registration:
Admin signs in (magic link) ──► Navigates to security settings
                              ──► Registers passkey
                              ──► Public key stored in DB
                              ──► Private key stays on device

Login:
Admin initiates passkey login ──► Browser prompts for authentication
                               ──► Device verifies (biometric/PIN)
                               ──► Signed challenge sent to server
                               ──► Server verifies signature
                               ──► Session created
```

**Requirements**:
- Auth.js v5 with `experimental.enableWebAuthn: true`
- `@simplewebauthn/server` and `@simplewebauthn/browser` packages
- `Authenticator` table in Vercel Postgres
- HTTPS (provided by Vercel in production)

**Security considerations**:
- Phishing-resistant — passkeys are bound to the origin
- Private keys never leave the device
- Requires initial registration via another method (magic link)
- Browser support: Chrome 108+, Safari 16+, Firefox 119+, iOS 16+, Android 9+

### 5.3 Username/Password with 2FA Enforcement

**How it works**: Admin signs in with email/password → must complete 2FA (TOTP) before session is created.

```
Login:
Admin enters email + password ──► Server validates credentials
                               ──► Checks if 2FA is enabled
                               ──► If 2FA: prompts for TOTP code
                               ──► Validates TOTP code
                               ──► Creates session

2FA Setup:
Admin signs in ──► Navigates to security settings
               ──► Generates TOTP secret
               ──► Scans QR code with authenticator app
               ──► Enters verification code to confirm
               ──► 2FA secret stored (encrypted) in DB
               ──► Backup codes generated and shown once
```

**Requirements**:
- Auth.js v5 Credentials provider
- Password hashing library (`bcrypt` or `argon2`)
- TOTP library (`otpauth` or `@simplewebauthn/server`)
- QR code generation (`qrcode` package)
- Encrypted 2FA secret storage in Vercel Postgres

**Security considerations**:
- Passwords hashed with bcrypt (cost factor 12+) or Argon2id
- 2FA secrets encrypted at rest using `ADMIN_ENCRYPTION_KEY` env var
- Backup recovery codes hashed individually
- Account lockout after 5 failed attempts (configurable)
- 2FA is mandatory for password-based login — cannot be skipped

---

## 6. Architecture Design

### New File Structure

```
src/
├── auth.ts                          # Auth.js configuration (exported auth(), signIn, signOut)
├── auth.config.ts                   # Auth.js provider & adapter config (edge-compatible)
├── middleware.ts                     # Route protection (convenience redirects only)
│
├── lib/
│   └── dal/                         # Data Access Layer
│       ├── admin.ts                 # Admin user queries with auth enforcement
│       ├── sessions.ts              # Session search queries with auth enforcement
│       └── analytics.ts             # Analytics queries with auth enforcement
│
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts         # Auth.js API handler (GET + POST)
│   │
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx             # Custom login page (magic link + passkey + password)
│   │   ├── verify/
│   │   │   └── page.tsx             # Email verification / 2FA prompt page
│   │   └── error/
│   │       └── page.tsx             # Auth error page
│   │
│   └── admin/
│       ├── layout.tsx               # Admin layout with auth check (server component)
│       ├── page.tsx                 # Admin dashboard
│       ├── sessions/
│       │   └── page.tsx             # Session search & listing
│       └── analytics/
│           └── page.tsx             # Usage analytics & graphs
│
├── components/
│   └── admin/
│       ├── SessionSearchForm.tsx    # Search form for shared sessions
│       ├── SessionList.tsx          # Paginated session results
│       ├── AnalyticsCharts.tsx      # Simple usage graphs (Bootstrap + CSS)
│       ├── AdminNav.tsx             # Admin navigation sidebar/header
│       └── AuthMethodSelector.tsx   # Login method selection UI
│
├── contexts/
│   └── AuthContext.tsx              # Client-side auth state (wraps SessionProvider)
│
└── types/
    └── admin.ts                     # Admin-specific TypeScript types
```

### Auth.js Configuration

```typescript
// src/auth.config.ts — Edge-compatible config (no Node.js APIs)
import type { NextAuthConfig } from "next-auth"
import Email from "next-auth/providers/email"
import Credentials from "next-auth/providers/credentials"
import Passkey from "next-auth/providers/passkey"

export default {
  providers: [
    Email({
      // Configured via environment variables
    }),
    Credentials({
      // Custom password + 2FA validation
    }),
    Passkey,
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 60,     // 30 minutes — short session for admin security
    updateAge: 5 * 60,   // Refresh session every 5 minutes
  },
  callbacks: {
    authorized({ auth, request }) {
      // Convenience redirect only — NOT primary security
      const isAdmin = request.nextUrl.pathname.startsWith("/admin")
      if (isAdmin && !auth?.user) return false
      return true
    },
    async signIn({ user }) {
      // Enforce admin email allowlist
      const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || []
      return allowedEmails.includes(user.email || "")
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
} satisfies NextAuthConfig
```

### Data Access Layer Example

```typescript
// src/lib/dal/sessions.ts
import { auth } from "@/auth"
import { redirect } from "next/navigation"

// Every DAL function validates the session before accessing data
export async function getSharedSessions(query?: string, page = 1, limit = 20) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Only after authentication passes do we query data
  // ... fetch from Vercel Blob storage with search/filter
}

export async function getSessionById(id: string) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Validate UUID format
  // Fetch from Vercel Blob
  // Return anonymized data
}
```

### Middleware (Convenience Only)

```typescript
// src/middleware.ts
import { auth } from "@/auth"

export default auth((req) => {
  // This is a CONVENIENCE redirect only
  // Primary security is enforced at the DAL level
  // Even if middleware is bypassed, data access is still protected
})

export const config = {
  // Only match admin routes — don't interfere with public app
  matcher: ["/admin/:path*"],
}
```

---

## 7. Security Architecture

### Defense in Depth Layers

```
Layer 1: Network (Vercel Edge)
  ├── Rate limiting on auth endpoints
  ├── HTTPS enforcement (Vercel default)
  └── CSP headers (existing, enhanced)

Layer 2: Middleware (Convenience)
  ├── Redirect unauthenticated users to login
  └── NOT relied upon for security (CVE-2025-29927 lesson)

Layer 3: Data Access Layer (Primary Security)
  ├── Session validation on every data access
  ├── Admin role verification
  └── Input validation with Zod

Layer 4: Database (Vercel Postgres)
  ├── Password hashing (bcrypt/argon2)
  ├── Encrypted 2FA secrets
  ├── Hashed verification tokens
  └── Session data with TTL

Layer 5: Application (Existing)
  ├── CSP preventing XSS/injection
  ├── Zod schema validation
  └── No sensitive data in client state
```

### CSP Updates Required

The existing CSP in `next.config.js` will need minor additions:

```javascript
// Additions to connect-src for auth-related domains
"connect-src 'self' https://api.openai.com ... "
// Add: email service domain if using client-side email verification
// Add: WebAuthn-related origins (none needed — WebAuthn uses same origin)

// Additions to form-action for auth forms
"form-action 'self'"
// Already correct — auth forms POST to same origin
```

### Session Security

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Session strategy** | Database | More secure than JWT; allows server-side revocation |
| **Session max age** | 30 minutes | Short sessions for admin security |
| **Session update age** | 5 minutes | Regular refresh to detect revoked sessions |
| **Cookie settings** | `httpOnly`, `secure`, `sameSite: lax` | Prevent XSS cookie theft, CSRF protection |
| **Session storage** | Vercel Postgres | Server-side; not accessible from client JS |

### Rate Limiting for Auth

The existing in-memory rate limiter pattern from session sharing can be extended for auth endpoints:

| Endpoint | Limit | Window | Action on exceed |
|----------|-------|--------|-----------------|
| `POST /api/auth/signin/email` | 5 requests | 15 minutes | 429 + exponential backoff |
| `POST /api/auth/signin/credentials` | 5 requests | 15 minutes | 429 + account lockout after 5 failures |
| `POST /api/auth/callback/*` | 10 requests | 1 minute | 429 |
| `POST /api/auth/webauthn/*` | 10 requests | 5 minutes | 429 |

For distributed rate limiting (when scale requires it), migrate to **Vercel KV** using the same adapter pattern documented in the session sharing design.

### Audit Logging

All admin actions should be logged for security monitoring:

```typescript
interface AuditLogEntry {
  id: string
  timestamp: string       // ISO 8601
  action: string          // 'login', 'logout', 'session_search', 'analytics_view'
  adminEmail: string      // Which admin performed the action
  ipAddress: string       // Request IP (hashed for privacy)
  userAgent: string       // Browser/device info (anonymized)
  details?: string        // Additional context (search query, etc.)
  success: boolean        // Whether the action succeeded
}
```

Stored in Vercel Postgres with a 90-day retention period.

---

## 8. Data Storage Strategy

### New: Vercel Postgres

**Purpose**: Admin accounts, sessions, 2FA secrets, authenticators (passkeys), audit logs

**Schema**:

```sql
-- Users table (admin accounts only)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  password_hash VARCHAR(255),         -- NULL for magic-link-only users
  totp_secret_encrypted VARCHAR(512), -- Encrypted TOTP secret
  totp_enabled BOOLEAN DEFAULT FALSE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (Auth.js managed)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Verification tokens (magic links)
CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE (identifier, token)
);

-- Authenticators (passkeys/WebAuthn)
CREATE TABLE authenticators (
  id VARCHAR(255) PRIMARY KEY,
  credential_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_account_id VARCHAR(255) NOT NULL,
  credential_public_key TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  credential_device_type VARCHAR(32),
  credential_backed_up BOOLEAN DEFAULT FALSE,
  transports VARCHAR(255)
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action VARCHAR(50) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  details TEXT,
  success BOOLEAN NOT NULL DEFAULT TRUE
);

-- Analytics aggregates (anonymized, pre-computed)
CREATE TABLE analytics_daily (
  date DATE NOT NULL,
  total_sessions_shared INTEGER DEFAULT 0,
  total_sessions_viewed INTEGER DEFAULT 0,
  unique_visitors_approx INTEGER DEFAULT 0,
  avg_session_duration_seconds NUMERIC(10, 2),
  top_activity_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (date)
);
```

### Existing: Vercel Blob (Enhanced)

The existing Vercel Blob storage for shared sessions will be **queried** by the admin for session search. No schema changes to shared sessions are needed, but the admin DAL will need to:

1. **List all blobs** in the session prefix
2. **Search by metadata** (date range, number of activities, etc.)
3. **Paginate results** efficiently
4. **Return anonymized data** (no user agents, IP addresses, or personal data)

### Data Isolation

```
┌───────────────────────────────────────────────────┐
│                 Vercel Postgres                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Admin accounts, sessions, authenticators,    │   │
│  │ verification tokens, audit logs, analytics   │   │
│  └─────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                  Vercel Blob                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ Shared session data (existing)               │   │
│  │ Read by admin search — no writes from admin   │   │
│  └─────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│              Client localStorage                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ User activities, preferences (existing)      │   │
│  │ Completely separate from admin data           │   │
│  └─────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┘
```

---

## 9. Admin Features

### 9.1 Session Search

**Purpose**: Allow admin to search and browse all shared sessions.

**Features**:
- Full-text search across session activity names
- Filter by date range, number of activities, session duration
- Sort by creation date, duration, activity count
- Paginated results (20 per page)
- View individual session details (read-only, anonymized)
- Export search results as CSV

**Data shown** (all anonymized):
- Session creation date
- Number of activities and their names
- Total planned time vs actual time
- Session type (completed / time-up)
- Timeline overview
- Share link status (active / expired)

**Data NOT shown** (privacy):
- No user agent or device info
- No IP addresses
- No user identifiers
- No geographic data

### 9.2 Analytics Dashboard

**Purpose**: Simple, anonymized usage statistics and trends.

**Metrics**:

| Metric | Description | Source |
|--------|-------------|--------|
| **Sessions shared per day/week/month** | Count of new shared sessions | Vercel Blob metadata |
| **Session views per day** | How often shared sessions are accessed | API route logging → Postgres |
| **Average session duration** | Mean of planned/actual duration across sessions | Vercel Blob session data |
| **Most common activities** | Frequency of activity names (anonymized) | Vercel Blob session data |
| **Activity completion rate** | Completed vs skipped activities | Vercel Blob session data |
| **Unique visitors (approximate)** | Estimated via hashed IP counting | Request logs (privacy-safe) |

**Visualization**:
- Simple line charts for time-series data (sessions per day/week)
- Bar charts for activity frequency
- Summary cards for key metrics
- Built with **Bootstrap 5 + CSS** (no additional charting libraries to keep the bundle lean)
- OR use a lightweight library like **Chart.js** if more complex visualizations are needed

**Data aggregation**:
- Analytics are pre-computed daily via a cron job (Vercel Cron Functions)
- Raw data is never stored — only aggregates
- Historical data kept for 90 days (matching session expiry)

### 9.3 Admin Dashboard

**Purpose**: Central hub for admin features.

**Layout**:
- Bootstrap 5 responsive layout
- Admin navigation (sidebar on desktop, top on mobile)
- Role indicator and logout button
- Quick stats summary cards
- Recent activity feed

---

## 10. Implementation Plan

### Phase 1: Foundation (Estimated: 2-3 days)

**Goal**: Core authentication infrastructure with magic link support.

1. **Add Vercel Postgres** to the Vercel project
   - Enable Vercel Postgres in the project dashboard
   - Run database schema migrations
   - Configure environment variables

2. **Install dependencies**
   ```bash
   npm install next-auth@beta @auth/pg-adapter @vercel/postgres
   npm install --save-dev @types/bcrypt
   ```

3. **Configure Auth.js**
   - Create `src/auth.config.ts` (edge-compatible config)
   - Create `src/auth.ts` (full config with adapter)
   - Create `src/app/api/auth/[...nextauth]/route.ts`
   - Set up Email provider (magic links)

4. **Create middleware**
   - Create `src/middleware.ts` (convenience redirects only)
   - Configure matcher for `/admin/*` routes

5. **Create Data Access Layer**
   - Create `src/lib/dal/admin.ts` with session-validated queries
   - Implement `assertAdmin()` helper

6. **Create auth UI pages**
   - Login page (`/auth/login`) using Bootstrap components
   - Verification page (`/auth/verify`)
   - Error page (`/auth/error`)

7. **Create admin layout**
   - Admin layout with server-side auth check
   - Basic admin dashboard page

8. **Update CSP headers** in `next.config.js` as needed

9. **Update layout.tsx** to include AuthContext/SessionProvider

**Tests**:
- DAL auth enforcement tests
- Auth callback allowlist tests
- Login page component tests

### Phase 2: Enhanced Auth Methods (Estimated: 2-3 days)

**Goal**: Add passkey and password + 2FA support.

1. **Add passkey/WebAuthn support**
   ```bash
   npm install @simplewebauthn/server @simplewebauthn/browser
   ```
   - Enable `experimental.enableWebAuthn` in Auth.js config
   - Add Authenticator table migration
   - Create passkey registration UI in admin settings
   - Add passkey login option to login page

2. **Add credentials + 2FA support**
   ```bash
   npm install bcrypt otpauth qrcode
   npm install --save-dev @types/qrcode
   ```
   - Implement Credentials provider with password validation
   - Add TOTP verification flow
   - Create 2FA setup page in admin settings
   - Generate and display backup codes
   - Enforce 2FA for all password-based logins

3. **Add account lockout**
   - Track failed attempts in database
   - Lock accounts after 5 failures
   - Auto-unlock after 30 minutes

**Tests**:
- Password hashing and verification tests
- TOTP generation and validation tests
- Account lockout logic tests
- Passkey registration/verification flow tests

### Phase 3: Session Search (Estimated: 2-3 days)

**Goal**: Admin can search and browse shared sessions.

1. **Implement session listing DAL**
   - Query Vercel Blob for all shared sessions
   - Implement search by activity name
   - Add date range filtering
   - Add pagination support

2. **Create session search UI**
   - Search form with Bootstrap components
   - Results list with pagination
   - Session detail view (read-only)
   - Export to CSV functionality

3. **Optimize search performance**
   - Consider blob metadata indexing
   - Implement server-side search caching (Vercel KV optional)

**Tests**:
- Session search DAL tests (with mocked Blob storage)
- Search form component tests
- Pagination logic tests

### Phase 4: Analytics Dashboard (Estimated: 2-3 days)

**Goal**: Anonymized usage statistics with simple visualizations.

1. **Set up analytics data collection**
   - Add request counting to session view API route
   - Create daily aggregation Vercel Cron Function
   - Store aggregated analytics in Vercel Postgres

2. **Create analytics DAL**
   - Time-series queries for sessions per day/week/month
   - Activity frequency analysis
   - Duration statistics

3. **Build analytics UI**
   - Summary metric cards
   - Time-series line chart (sessions over time)
   - Activity frequency bar chart
   - Date range selector

4. **Add audit logging**
   - Log admin sign-in/sign-out
   - Log session searches
   - Log analytics views

**Tests**:
- Analytics aggregation logic tests
- Chart component tests
- Audit logging tests

### Phase 5: Hardening & Polish (Estimated: 1-2 days)

**Goal**: Security review, testing, and documentation.

1. **Security audit**
   - Review all DAL functions for auth enforcement
   - Verify rate limiting on all auth endpoints
   - Test CSP headers with auth flows
   - Verify no sensitive data in client state or logs
   - Run CodeQL security scan

2. **Integration testing**
   - Full auth flow Cypress tests
   - Session search E2E tests
   - Analytics display tests

3. **Documentation**
   - Update README with admin features
   - Create admin setup guide
   - Document environment variables
   - Update PLANNED_CHANGES.md → IMPLEMENTED_CHANGES.md

4. **Performance verification**
   - Verify auth doesn't impact public app load time
   - Check database query performance
   - Ensure no new CSP violations

---

## 11. Alternative Approaches

If Auth.js v5 proves unsuitable (compatibility issues, missing features), here are ranked alternatives:

### Alternative A: Clerk

**Pros**:
- Fully managed authentication service
- Built-in passkey, magic link, and 2FA support out of the box
- Pre-built UI components (customizable)
- Excellent Next.js App Router support
- Handles user management, session management, and security
- Free tier available (10,000 monthly active users)

**Cons**:
- Third-party dependency (data hosted externally)
- Monthly cost beyond free tier
- Less control over auth flow customization
- Adds external service dependency

**When to choose**: If Auth.js setup becomes too complex or if rapid implementation is prioritized.

### Alternative B: Auth0

**Pros**:
- Enterprise-grade authentication
- Comprehensive compliance certifications
- Advanced features: anomaly detection, breached password detection
- Good Next.js support

**Cons**:
- More complex setup than Auth.js or Clerk
- External dependency
- Free tier limited to 7,500 active users
- Heavier SDK

**When to choose**: If enterprise compliance requirements emerge.

### Alternative C: Supabase Auth

**Pros**:
- Open-source, self-hostable
- Comes with PostgreSQL database
- Built-in Row Level Security (RLS)
- Magic links and OAuth built-in

**Cons**:
- Would replace Vercel Postgres with Supabase database
- Less native Vercel integration
- WebAuthn/passkey support still maturing

**When to choose**: If migrating to a full Supabase stack is desired.

### Alternative D: Custom Implementation (Not Recommended)

Building auth from scratch with `jose` (JWT library) and custom session management. **Not recommended** due to the high risk of security vulnerabilities in custom auth implementations.

---

## 12. Environment Variables

### New Variables Required

```env
# ─── Auth.js Core ───
AUTH_SECRET=                         # Generated with `npx auth secret` — signs tokens/cookies
AUTH_URL=https://yourdomain.com      # Production URL

# ─── Admin Access Control ───
ADMIN_EMAILS=admin@example.com       # Comma-separated list of allowed admin emails

# ─── Email Provider (Resend recommended) ───
AUTH_RESEND_KEY=                      # Resend API key for magic link emails
EMAIL_FROM=noreply@yourdomain.com    # Sender email address

# ─── Vercel Postgres ───
POSTGRES_URL=                        # Auto-provided by Vercel when Postgres is linked
POSTGRES_PRISMA_URL=                 # Auto-provided (pooled connection)
POSTGRES_URL_NON_POOLING=            # Auto-provided (direct connection for migrations)

# ─── 2FA Encryption ───
ADMIN_ENCRYPTION_KEY=                # AES-256 key for encrypting TOTP secrets at rest

# ─── Optional: Vercel KV (for distributed rate limiting) ───
KV_URL=                              # Auto-provided when KV is linked
KV_REST_API_URL=                     # Auto-provided
KV_REST_API_TOKEN=                   # Auto-provided
KV_REST_API_READ_ONLY_TOKEN=         # Auto-provided
```

### Existing Variables (Unchanged)

```env
# These remain unchanged
BLOB_READ_WRITE_TOKEN=               # Vercel Blob (session sharing)
BLOB_BASE_URL=                       # Vercel Blob base URL
AI_ENABLE_MOCK=                      # AI mock mode
NEXT_PUBLIC_VERCEL_BYPASS_TOKEN=     # Deployment protection bypass
```

---

## 13. Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Auth.js v5 breaking changes (still beta) | Medium | High | Pin exact version; test thoroughly before upgrades |
| WebAuthn browser compatibility gaps | Low | Medium | Passkeys are optional; magic links as fallback |
| Vercel Postgres cold starts | Low | Low | Sessions are cached in cookies; DB hit only on validation |
| Email deliverability issues | Medium | Medium | Use established provider (Resend); add SPF/DKIM records |
| CVE in auth dependencies | Medium | High | Regular dependency updates; CodeQL scanning; npm audit |

### Security Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Session hijacking | Low | High | HttpOnly + Secure cookies; short session TTL; DB sessions |
| Brute force on login | Medium | Medium | Rate limiting; account lockout; 2FA enforcement |
| Middleware bypass (CVE-2025-29927 variant) | Low | Critical | DAL pattern as primary enforcement; Next.js 16 is patched |
| TOTP secret compromise | Low | High | AES-256 encryption at rest; limited admin count |
| Email interception (magic links) | Low | Medium | Token TTL of 10 minutes; single-use; hashed in DB |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Admin locked out | Medium | Medium | Backup codes; manual DB reset procedure documented |
| Vercel Postgres downtime | Low | Medium | Auth cookies still valid during short outages |
| Email provider outage | Low | Medium | Multiple auth methods available as fallback |

---

## 14. References

### Vercel Documentation
- [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection) — Platform-level protection (distinct from app auth)
- [Vercel Authentication Methods](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication) — Vercel account-based access control
- [Application Authentication on Vercel](https://vercel.com/kb/guide/application-authentication-on-vercel) — Vercel's guide to app-level auth
- [Vercel Admin Dashboard Template](https://vercel.com/templates/next.js/admin-dashboard) — Reference implementation using Auth.js + Postgres

### Auth.js / NextAuth.js
- [Auth.js Documentation](https://authjs.dev/) — Official Auth.js v5 docs
- [Auth.js Passkey Provider](https://authjs.dev/getting-started/providers/passkey) — WebAuthn/passkey setup guide
- [Auth.js PostgreSQL Adapter](https://authjs.dev/getting-started/adapters/pg) — Database adapter docs
- [Auth.js App Router Patterns](https://github.com/vercel-labs/app-router-auth) — Reference patterns from Vercel Labs

### Security References
- [CVE-2025-29927: Next.js Middleware Bypass](https://securitylabs.datadoghq.com/articles/nextjs-middleware-auth-bypass/) — Why DAL pattern is essential
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) — Official Next.js auth best practices
- [Next.js Authentication Best Practices (2025)](https://www.franciscomoretti.com/blog/modern-nextjs-authentication-best-practices) — Community best practices
- [Complete Auth Guide for Next.js App Router](https://clerk.com/articles/complete-authentication-guide-for-nextjs-app-router) — Comprehensive overview

### WebAuthn / Passkeys
- [Passkeys, WebAuthn, and Next.js: A Practical Guide](https://rebeccamdeprey.com/blog/passkeys-webauthn-nextjs-practical-guide)
- [Google Passkeys Documentation](https://web.dev/passkeys/)
- [How to Implement Passkeys in Next.js](https://clerk.com/blog/how-do-i-implement-passkeys-in-nextjs)

### Authentication Solutions Comparison
- [Top Authentication Solutions for Next.js (2026)](https://workos.com/blog/top-authentication-solutions-nextjs-2026)
- [Building Authentication in Next.js App Router Guide](https://workos.com/blog/nextjs-app-router-authentication-guide-2026)

---

## Validation Criteria

- [ ] Auth.js v5 configured with Email, Credentials, and Passkey providers
- [ ] Data Access Layer enforces authentication on all admin data queries
- [ ] Admin email allowlist prevents unauthorized sign-in
- [ ] Middleware provides convenience redirects but is not sole security layer
- [ ] Vercel Postgres schema created with all required tables
- [ ] Magic link login flow works end-to-end
- [ ] Passkey registration and login flow works
- [ ] Password + 2FA login flow works with mandatory 2FA
- [ ] Session search returns anonymized results from Vercel Blob
- [ ] Analytics dashboard shows usage metrics and graphs
- [ ] Rate limiting protects all auth endpoints
- [ ] Audit logging tracks all admin actions
- [ ] CSP headers updated and verified
- [ ] Existing app functionality unaffected
- [ ] All tests passing (Jest unit + Cypress E2E)
- [ ] TypeScript type-check passes
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] CodeQL security scan clean
- [ ] Documentation complete

---

> **Note**: This document serves as the comprehensive plan for adding admin authentication. Implementation should follow the phased approach in Section 10, with each phase being a separate PR for easier review. Move to `IMPLEMENTED_CHANGES.md` upon completion.
