# MRTMLY-005: Fixing Metadata Export in Next.js App Router

**Date:** 2025-04-08
**Tags:** #debugging #next-js #app-router #metadata #deployment
**Status:** Resolved

## Initial State

The Next.js application was encountering a build error when attempting to deploy to Vercel:

```
Error:   [31mx[0m You are attempting to export "metadata" from a component marked with "use client", which is disallowed. Either remove the export, or the "use client" directive.
```

The error occurred because the layout.tsx file was marked with 'use client' but also tried to export metadata, which Next.js doesn't allow.

## Debug Process

1. First investigation step
   - Examined the layout.tsx file and found both 'use client' directive and metadata export
   - Found that metadata was being imported from a separate metadata.ts file
   - Identified the conflict between client component markers and metadata exports

2. Solution attempts
   - Researched Next.js best practices for metadata in App Router
   - Determined that server components should handle metadata exports
   - Decided to separate client-side functionality into a dedicated client component

3. Implementation
   - Created a new LayoutClient component for client-side functionality
   - Moved all interactive features (service worker registration, update notifications) to client component
   - Removed 'use client' directive from layout.tsx
   - Defined metadata directly in layout.tsx as a server component
   - Removed redundant metadata.ts file

## Resolution

Fixed the metadata export issue by following Next.js recommended patterns:

1. Root layout as a server component:
   ```tsx
   // No 'use client' directive at the top
   import { Metadata } from "next";
   
   export const metadata: Metadata = {
     title: 'Mr. Timely',
     description: 'Track your time and activities with Mr. Timely',
     // other metadata
   };
   
   export default function RootLayout({ children }) {
     // ...
   }
   ```

2. Client functionality in a dedicated component:
   ```tsx
   'use client';
   
   export function LayoutClient({ children }) {
     // Client-side functionality here
     // Service worker registration, state management, etc.
   }
   ```

The build now completes successfully with no metadata export errors.

## Lessons Learned

1. In Next.js App Router, metadata can only be exported from server components
2. When a component needs both client-side interactivity and metadata export, separate the concerns into dedicated components
3. Client components (marked with 'use client') should focus on interactive features (state, effects, event handlers)
4. Server components should handle metadata, static rendering, and initial data fetching
5. This pattern of separating client and server components improves performance by reducing client-side JavaScript