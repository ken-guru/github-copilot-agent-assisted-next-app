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

## Issue #344: Persistent Timer State Across Application (IN PROGRESS 🚧)

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

Challenges/Findings
- Next.js `next/navigation` hooks: avoid `jest.spyOn` on `usePathname` (read-only); use module-level mocks to prevent “Cannot redefine property: usePathname”
- Layout-level hooks (guard + page sync) required test isolation by mocking these hooks in layout tests to avoid provider dependencies
- ESLint `@typescript-eslint/no-require-imports` flagged legacy require-style mocks; resolved via typed `jest.mocked` imports
- Deterministic tests: explicitly set `currentPage` to `'timer'` within harness to assert collapsed quick action visibility
- Drawer behavior clarified: hidden on summary or when no session; collapsed quick action shown only on the timer page to reduce layout shift

Pending (remaining items)
- Phase 7: Bootstrap collapse animations for drawer and theming polish

Next Actions
1) Optional: Add Bootstrap collapse animations for drawer expand/collapse and finalize theming polish
2) Optional: Introduce CSS variables to fine-tune responsive bottom padding

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
- [ ] Create `RunningActivityCard` component
- [x] Implement Bootstrap-based responsive design
- [ ] Add expand/collapse animations

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
- [ ] Add proper Bootstrap theming support
- [ ] Optimize animations and transitions
- [ ] Final accessibility and responsive testing

### Validation Criteria
- [ ] Timer state persists across all navigation scenarios
- [ ] Drawer shows correctly in collapsed/expanded states
- [ ] "+1 min" button works from drawer in all states
- [x] Navigation prevention works for both internal and external navigation
- [x] Timer navigation intelligently routes to active session or new timer
- [ ] All existing timer functionality preserved
- [ ] Mobile responsive design works properly
- [ ] Accessibility requirements met (WCAG AA)
- [ ] Performance impact is minimal (no unnecessary re-renders)
- [ ] Browser refresh preserves timer state appropriately
- [ ] All tests pass including new integration tests

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
