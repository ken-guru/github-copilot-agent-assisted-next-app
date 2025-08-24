# Planned Changes

This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation following the template in `docs/templates/PLANNED_CHANGES_TEMPLATE.md`.

Once implemented, move the change to `IMPLEMENTED_CHANGES.md` with a timestamp.

## Issue #308: Activity CRUD Empty State Toolbar (IMPLEMENTED ✅)

### Context
- Users couldn't access Import JSON and Reset actions when the activities list was empty.
- Request: Keep the "Your Activities" card visible in empty state and surface Import/Reset there; hide Export when no activities exist.

### Implementation Summary
- Always render `ActivityList` from `ActivityCrud` regardless of list length.
- In `ActivityList` empty state:
   - Keep header with "Add Activity" button.
   - Show empty-state guidance in `Card.Body`.
   - Render `Card.Footer` with Import and Reset buttons when handlers are provided.
   - Do not render Export button when `activities.length === 0`.
- Tests updated to validate visibility of Import/Reset in empty state and absence of Export.

### Status
- Implemented on branch `fix-308-activitycrud-empty-state`.
- PR opened: #317.

## UI Inconsistencies Fixes (Issues #261, #265)

### Context
- **Issues**: GitHub issues #261 and #265 report UI inconsistencies across components
- **Components Affected**: Timeline, ActivityCrud (export modal), ActivityForm, TimeSetup
- **Current Behavior**: Various inconsistencies in card headers, button placement, and form structure
- **User Needs**: Consistent UI patterns across the application

### Requirements

#### Issue #261: Compact Activity Form (ALREADY IMPLEMENTED ✅)
- Form already uses Bootstrap InputGroup for single-line layout
- No changes needed

#### Issue #265: UI Inconsistencies (4 Sub-issues)

1. **Timeline Card Header Consistency**
   - Remove unnecessary Row/Col nesting in Card.Header
   - Match pattern used by Summary and ActivityManager components
   - Use direct content with `d-flex justify-content-between align-items-center`

2. **Export Modal Button Placement**
   - Move download button from Modal.Body to Modal.Footer
   - Follow standard modal pattern with action buttons in footer

3. **Activity Form Duplicate Submit Buttons**
   - Remove "Add Activity" button from ActivityForm component
   - Keep only "Save" button in modal footer
   - Form should submit via modal footer button, not internal button

4. **Setup Card Structure**
   - Move submit button from Card.Body to Card.Footer
   - Fix margin inconsistency for deadline input to match duration fields

### Technical Guidelines
- Maintain Bootstrap component structure and classes
- Preserve existing accessibility features and ARIA attributes
- Ensure responsive design is maintained
- Update tests to reflect structural changes
- Follow established component patterns from other parts of the app

### Expected Outcome
- Consistent card header structure across all components
- Proper modal action button placement
- Single submit button in activity forms
- Proper card footer usage for primary actions
- Consistent spacing and margins in form inputs

### Validation Criteria
- [ ] Timeline header matches Summary/ActivityManager pattern
- [ ] Export modal download button in footer not body
- [ ] Activity form has single submit button approach
- [ ] Setup card has submit button in footer
- [ ] All tests pass after changes
- [ ] Visual consistency verified across components
- [ ] Accessibility maintained (screen reader, keyboard nav)
- [ ] Responsive behavior preserved

## Issue #344: Persistent Timer State Across Application (COMPLETE ✅)

### Context
- **GitHub Issue**: #344 - Allow activities to keep running when navigated to other parts of the application
- **Branch**: `feature-344-persistent-timer-drawer`
- **Current Behavior**: Timer state is local to ActivityManager; navigating away loses timer context
- **User Needs**: 
  - Persistent timer state across navigation
  - Minimized progress indicator when not on timer page
  - Easy navigation back to active timer
  - Visual indication of running activity and progress
  - Prevention of accidental navigation away from active timer

### Requirements

#### Phase 1: Cleanup and Preparation
- **Remove Existing Activity Restore Feature**:
  - Remove `restoreActivity` method from `ActivityStateMachine`
  - Remove `onActivityRestore` callback from `ActivityManager` 
  - Remove activity restore UI components and tests
  - Clean up restore-related code in `useActivitiesTracking` hook

#### Phase 2: Global Timer Context Implementation
- **Create GlobalTimerContext**:
  ```typescript
  interface GlobalTimerState {
    sessionId: string | null;
    isTimerRunning: boolean;
    sessionStartTime: Date | null;
    totalDuration: number;
    currentActivity: Activity | null;
    currentActivityStartTime: Date | null;
    completedActivities: Activity[];
    currentBreakStartTime: Date | null;
    drawerExpanded: boolean;
    currentPage: 'timer' | 'summary' | 'other';
  }
  ```
- **Persistent Storage**: Save timer state to localStorage for browser refresh recovery
- **Provider Integration**: Wrap application at layout level for global access

#### Phase 3: Timer Drawer Component
- **TimerDrawer Component**:
  - Fixed position at bottom of screen using Bootstrap `position-fixed bottom-0`
  - Collapsed state: Progress bar + "+1 min" button (when on timer page)
  - Expanded state: Current activity card + progress bar + "+1 min" button (when on other pages)
  - Hidden state: Not visible when no timer running or on summary page
- **RunningActivityCard Component**:
  - Read-only activity display with color, name, and elapsed time
  - Clickable to navigate back to timer page
  - Bootstrap card styling consistent with existing components

#### Phase 4: Navigation Integration
- **Smart Timer Navigation**:
  - When timer running: Timer nav link goes to active session
  - When no timer: Timer nav link goes to new timer setup
  - Update navigation components to check global timer state
- **Page State Tracking**: 
  - Update global context when route changes
  - Control drawer expand/collapse based on current page

#### Phase 5: Navigation Prevention
- **Beforeunload Guard**:
  - Attach `beforeunload` event listener when timer is running
  - Show browser confirmation dialog for external navigation
  - Use Next.js router events for internal navigation warnings
- **Custom Navigation Modal**:
  - Custom confirmation dialog for internal navigation attempts
  - Option to continue to destination or stay on current page

#### Phase 6: ActivityManager Integration
- **State Migration**:
  - Replace local timer state with global timer context
  - Update ActivityManager to consume global state instead of managing locally
  - Maintain existing UI and behavior but with global state backing
  - Unified current activity derivation and corrected overtime math using effective total duration
  - Added optional accessor `useOptionalGlobalTimer` to support mixed provider contexts and tests
  - Centralized progress computation: ActivityManager now uses shared `computeProgress` utility when context is present, with prop-based fallback for backward compatibility
- **Progress Bar Integration**:
  - Implemented minimal progress bar inside `TimerDrawer` for persistent, cross-page visibility (ARIA-compliant)
  - Kept ActivityManager progress section on timer page for detailed view

#### Phase 7: Layout and Styling
- **Bottom Padding Management**:
  - Add dynamic bottom padding to main content when drawer is visible
  - Implemented via body-level padding in `LayoutClient` to avoid DOM order changes (fixes layout tests)
  - Future: Consider CSS custom properties for responsive fine-tuning
- **Bootstrap Integration**:
  - Use Bootstrap collapse animations for drawer expand/collapse
  - Implement consistent Bootstrap theming (light/dark mode support)
  - Follow Bootstrap spacing and component patterns

### Technical Guidelines
- **State Management**: Use React Context + useReducer for complex timer state
- **Persistence**: localStorage for timer state with JSON serialization
- **Performance**: Optimize re-renders with useMemo and useCallback
- **Accessibility**: Proper ARIA labels and keyboard navigation for drawer
- **Responsive Design**: Mobile-first approach with Bootstrap responsive utilities
- **Testing**: Comprehensive Jest tests for state management and integration

### Implementation Phases

#### Progress Update — 2025-08-22

- Branch: `feature-344-persistent-timer-drawer` | Draft PR: #348 (green: tests, lint, type-check, build)
- Completed Phases:
  - Phase 1: Removed legacy restore logic and related UI/tests; cleaned types and imports
  - Phase 2: Added `GlobalTimerContext` with reducer + `localStorage` persistence; exposed `useGlobalTimer`; wrapped app provider; tests passing
  - Phase 3: Implemented persistent `TimerDrawer` with collapsed/expanded states; integrated into `LayoutClient`; added collapsed “+1 min” quick action specifically when on the timer page; tests added/updated
  - Phase 4: Implemented `useNavigationGuard` (browser `beforeunload`) when a session runs; integrated at layout top-level; tests passing
  - Phase 5: Implemented `usePageStateSync` to map route → `currentPage` and manage drawer behavior; added internal navigation confirmation modal in `Navigation` with timer-aware labeling; tests updated; full suite PASS
- Phase 6 (in progress):
  - ActivityManager migrated to optionally consume `GlobalTimerContext` with prop precedence; unified selection toggling and corrected overtime calculations; added integration tests; suite PASS
  - Centralized progress computation using `computeProgress`; ActivityManager defers to context when available
  - Implemented minimal progress bar in `TimerDrawer` for persistent visibility; ActivityManager retains detailed progress on timer page

- Phase 7 (initial polish):
  - Implemented dynamic bottom padding at `document.body` level in `LayoutClient` when session is active, preventing content overlap with the fixed `TimerDrawer` while preserving DOM order; tests updated and PASS
  - Added drawer height CSS custom property `--timer-drawer-height` via `ResizeObserver` to enable responsive padding fine-tuning; guarded for jsdom in tests
  - Restored stable `TimerDrawer` JSX after a broken intermediate patch; tests, lint, type-check, and production build all PASS

Challenges/Findings
- Next.js `next/navigation` hooks: avoid `jest.spyOn` on `usePathname` (read-only); use module-level mocks to prevent “Cannot redefine property: usePathname”
- Layout-level hooks (guard + page sync) required test isolation by mocking these hooks in layout tests to avoid provider dependencies
- ESLint `@typescript-eslint/no-require-imports` flagged legacy require-style mocks; resolved via typed `jest.mocked` imports
- Deterministic tests: explicitly set `currentPage` to `'timer'` within harness to assert collapsed quick action visibility
- Drawer behavior clarified: hidden on summary or when no session; collapsed quick action shown only on the timer page to reduce layout shift

Pending (remaining items)
- None. All acceptance criteria for Issue #344 have been met. Minor enhancements (animation polish) will be tracked separately.

Next Actions
1) Optional follow-up: Add additional Bootstrap collapse animation polish for drawer expand/collapse
2) Optional follow-up: Introduce further CSS variables to fine-tune responsive bottom padding

#### Phase 1: Cleanup (1-2 days)
- [x] Remove `restoreActivity` functionality from state machine
- [x] Remove activity restore UI and callbacks
- [x] Update tests to remove restore-related test cases
- [x] Clean up unused imports and interfaces

#### Phase 2: Global Context (2-3 days)
- [x] Create `GlobalTimerContext` and provider
- [x] Implement timer state persistence with localStorage
- [x] Add timer state management actions and reducers
- [x] Create custom hooks for timer state access

#### Phase 3: Timer Drawer UI (2-3 days)
- [x] Build `TimerDrawer` component with collapsed/expanded states
- [x] Create `RunningActivityCard` component
- [x] Implement Bootstrap-based responsive design
- [x] Add expand/collapse animations

#### Phase 4: Navigation Integration (1-2 days)
- [x] Update navigation components for timer-aware routing (timer-aware label + confirm modal)
- [x] Implement page state tracking
- [x] Add smart timer navigation logic

#### Phase 5: Navigation Guards (1-2 days)
- [x] Implement `beforeunload` event handling
- [x] Create custom navigation confirmation modal for internal navigation during active sessions
- [x] Integrate with Next.js App Router `useRouter` in `Navigation` to intercept link clicks and confirm

#### Phase 6: State Migration (2-3 days)
- [x] Refactor ActivityManager to optionally use global timer state with prop precedence
- [x] Implement persistent progress indicator in `TimerDrawer`; keep ActivityManager page display
- [x] Ensure backward compatibility of existing functionality (tests added)

#### Phase 7: Layout & Polish (1-2 days)
- [x] Implement bottom padding management at body level to avoid overlap with fixed drawer
- [x] Introduce CSS custom property for drawer height to support responsive padding (`--timer-drawer-height`)
 - [x] Add proper Bootstrap theming support (light/dark progressbar variables)
 - [x] Optimize animations and transitions (CSS grid-based collapse with reduced-motion guard)
 - [x] Final accessibility and responsive testing (toggle has dynamic aria-label + aria-controls; region labeled)

### Validation Criteria
- [x] Timer state persists across all navigation scenarios
 - [x] Drawer shows correctly in collapsed/expanded states
- [x] "+1 min" button works from drawer in all states
- [x] Navigation prevention works for both internal and external navigation
- [x] Timer navigation intelligently routes to active session or new timer
 - [x] All existing timer functionality preserved
 - [x] Mobile responsive design works properly
 - [x] Accessibility requirements met (WCAG AA)
- [x] Performance impact is minimal (no unnecessary re-renders)
- [x] Browser refresh preserves timer state appropriately
- [x] All tests pass including new integration tests

### Live Smoke Validation Results — 2025-08-24
- Verified end-to-end flow on running dev server (Network URL):
  - Set duration on home page starts global session; drawer appears immediately (collapsed on timer page)
  - "+1 min" updates progress from both collapsed quick action and expanded drawer across pages
  - Navigation to `/activities` triggers internal confirm modal; choosing "Leave" persists the drawer and global state
  - Drawer expand/collapse works with correct ARIA: `aria-expanded` toggles, region labeled, and control mapping via `aria-controls`
  - Drawer persists across routes and back to home; global Reset hides the drawer and returns to timer setup state
  - CSS var `--timer-drawer-height` is applied on `document.body` via ResizeObserver (intended); computed style on `documentElement` remains empty by design

All quality gates (tests, lint, type-check, build) green.

### Expected Outcome
- **User Experience**: Seamless timer experience across the entire application
- **Technical Quality**: Clean, maintainable global state architecture
- **Performance**: Minimal impact on app performance with smart state management
- **Accessibility**: Fully accessible drawer and navigation prevention features
- **Testing**: Comprehensive test coverage for complex state interactions

### Draft PR Strategy
- Create draft PR immediately after Phase 1 completion
- Update PR description with progress after each phase
- Request reviews at key architectural milestones (after Phases 2, 4, and 6)
- Keep PR updated with implementation progress and any architectural decisions

## Follow-up: Persistent Timer Drawer — Post-Launch Fixes (PLANNED)

### Context
- After completing Issue #344, several UX and behavior gaps were identified during real-world usage and additional validation. These items refine navigation behavior, live progress updates, session restoration UX, and eliminate duplicate UI elements.

### Requirements (Mapped to Feedback Items)
1) Suppress internal navigation warnings
   - Users should not see a warning when moving between pages within the app. The confirmation should only appear when leaving the site (close tab/window, external link, hard reload).

2) Live progress updates in drawer
   - The drawer progress bar must update continuously while a session runs, without requiring user interaction.

3) Unify “+1 min” behavior
   - The “+1 min” action in the drawer must be identical to the ActivityManager card header action (single source of truth).

4) Expanded view shows current state
   - Expanding the drawer reveals either the currently running activity or the active break when between activities (with correct time and color context).

5) Seamless restore UX on reload/return
   - When the page is reloaded or the user returns from outside the app while a session is ongoing, render directly into the running state (no setup flash) and show a toast “Session restored.”
   - This toast must not show for in-app navigations (back/forward that never left the origin).

6) Progress resumes after restore
   - After restoring a running session, the drawer progress continues updating immediately, without needing a user gesture.

7) Single progress bar source
   - The drawer’s progress bar replaces the top-of-card progress in ActivityManager to avoid duplication.

### Technical Guidelines and Approach
- Navigation guard refinement
  - Update `useNavigationGuard` to distinguish internal vs external navigations.
  - Internal: never prompt; External: prompt only on `beforeunload`/external anchors.
  - Consider using Next.js router events only for analytics, not blocking; keep the guard at window level for external cases.

- Live progress clock centralization
  - Centralize ticking in `GlobalTimerContext` using a stable timer (prefer `requestAnimationFrame` with visibility fallback to `setInterval(1000)` when hidden).
  - Expose a derived selector/hook (e.g., `useGlobalTimerProgress()`) that yields elapsed/remaining/progress and re-renders subscribers without interaction.

- Unify “+1 min” handler
  - Implement single reducer action `ADD_ONE_MINUTE` with shared logic (already present) and ensure both ActivityManager and TimerDrawer call the same context dispatcher.
  - Remove any component-local add-minute logic or drift.

- Expanded content data model
  - Source “current state” from context: if `currentActivity` present -> show RunningActivityCard; else if `currentBreakStartTime` present -> show Break card with elapsed; else show compact state.

- Restore-first render and toast signaling
  - Use context lazy-initializer from `localStorage` to set the initial state before first render; avoid setup flash in the home screen.
  - Track cross-origin/page-leave in `sessionStorage` (e.g., `timer:lastLeftOriginAt`) and compare on load; only show the “Session restored” toast when the previous navigation left the app.
  - Guard SSR/CSR differences: no SSR reliance on storage; lazy initializer runs on client during provider mount prior to first paint when possible.

- Post-restore ticking
  - Ensure the ticking effect depends on `isTimerRunning || currentBreakStartTime` and starts immediately on mount if a session is active.
  - Avoid focus/interaction dependencies; use passive effects and visibility handlers.

- Remove duplicate progress UI
  - Hide/remove the ProgressBar section from ActivityManager when the global drawer is rendered; rely solely on the drawer’s progress visualization.

### Phased Plan
Phase A: Navigation Guard Refinement (Item 1)
- Adjust `useNavigationGuard` to only warn on leave-the-origin events.
- Add tests verifying no prompts on internal route changes, prompt on `beforeunload`.

Phase B: Centralized Live Progress (Items 2, 6)
- Add ticking loop to `GlobalTimerContext` with visibility-aware update cadence.
- Expose computed progress via a dedicated hook used by TimerDrawer.
- Tests: verify progress updates over time and after restore without interaction.

Phase C: Unify Add-Minute (Item 3)
- Refactor to a single `addOneMinute` context action; update ActivityManager/TimerDrawer to use it.
- Tests: both buttons increment identically and affect session state consistently.

Phase D: Expanded Content — Activity/Break (Item 4)
- Enhance TimerDrawer expanded view to render RunningActivityCard or Break card based on context.
- Tests: assert correct rendering and timers for both states.

Phase E: Restore UX and Toast (Item 5)
- Implement lazy initialization from storage to avoid setup flash.
- Add session restored toast only for true app-return scenarios (using `sessionStorage` signal).
- Tests: reload/return shows running state immediately; toast appears appropriately; in-app nav shows no toast.

Phase F: Remove Duplicate Progress (Item 7)
- Remove/disable ActivityManager top-of-card progress when drawer is present.
- Tests: ensure only one progress bar is visible and accessible.

### Validation Criteria
- [ ] A: Internal navigation never triggers confirm; external leave still prompts
- [ ] B: Drawer progress updates live without interaction; after restore, ticking resumes immediately
- [ ] C: “+1 min” in drawer and ActivityManager share identical behavior (single dispatcher)
- [ ] D: Expanded drawer shows current activity or active break accurately with timing
- [ ] E: On reload/return from outside the app, no setup flash; toast “Session restored” appears; in-app nav shows no toast
- [ ] F: Only one progress bar displayed (drawer replaces ActivityManager’s top progress)
- [ ] All tests updated and passing; lint/type-check/build remain green
- [ ] Accessibility preserved (roles/labels/aria-expanded); responsive behavior maintained

### Branch and PR Strategy
- Do NOT create a new branch or PR for these fixes.
- Continue work on the existing branch `feature-344-persistent-timer-drawer` and update the existing PR #348.
- Land phases incrementally with tests; keep CI green at each step; update the PR description/checklist per phase.

## New: Shareable Session Summary (Design Document Added)

### Context
- Feature to allow users to generate shareable, read-only URLs for completed session summaries backed by Vercel Blob storage. Full design, requirements, and implementation plan added to `docs/session-sharing-design.md`.

### Next Steps (Planned)
1. Implement data models and validation schemas (Zod)
2. Create API routes for share creation and retrieval
3. Build UI components: `ShareSessionControls`, `SharedSummary`, and `/shared/[uuid]` route
4. Add activity duplication workflow and session linking
5. Add tests (unit, integration, e2e) and security middleware

See `docs/session-sharing-design.md` for full details and staged implementation plan.

#### Progress Update — 2025-08-23

- Phase 7 (polish continued):
  - Added `RunningActivityCard` and integrated into `TimerDrawer` expanded view
  - Implemented CSS-based collapse/expand animation with reduced-motion guard
  - Repaired hook-order regression in `TimerDrawer`; added `ResizeObserver` test guard
  - Replaced `useRouter` usage in `RunningActivityCard` with Next.js `Link` navigation to satisfy lint and maintain test stability; tests PASS
  - Theming polish: Added `--timer-progress-bg` and `--timer-progress-fg` CSS variables with light/dark overrides; applied to `.timer-drawer .progress` and `.progress-bar` for contrast
  - Accessibility polish: Drawer container labeled as `role="region"`; toggle button uses dynamic `aria-label` (Expand/Collapse), `aria-expanded`, and `aria-controls` pointing to the collapsible content `id`

Phase 7 Status: Completed
- Theming and accessibility validated across light/dark modes and focus order; ARIA attributes and region labeling verified; animations honor reduced-motion.
