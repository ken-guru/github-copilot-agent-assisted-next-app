# Memory Log

This document tracks solutions and approaches we've tried for various issues in the application, helping us avoid repeating unsuccessful attempts.

## How to Use
1. Before attempting to solve an issue, check this log for similar problems
2. If a similar issue exists, review previous approaches before trying new solutions
3. If no similar issue exists, create a new entry using the template below
4. Add details of each solution attempt to the appropriate issue entry

## Entry Format
Each issue receives a unique ID (format: MRTMLY-XXX) and includes attempted approaches, outcomes, and relevant tags.

## Memory Template
```markdown
### Issue: MRTMLY-XXX: [Brief Description]
**Date:** YYYY-MM-DD
**Tags:** #tag1 #tag2 #tag3
**Status:** [In Progress|Resolved]

#### Initial State
- Description of the initial problem
- Current behaviors or symptoms
- Relevant context

#### Debug Process
1. First investigation step
   - What was examined
   - What was found
   - Next steps determined

2. Solution attempts
   - What was tried
   - Outcome
   - Why it did/didn't work

#### Resolution (if reached)
- Final solution implemented
- Why it worked
- Tests affected

#### Lessons Learned
- Key insights gained
- Patterns identified
- Future considerations
```

## Memory Index

- [MRTMLY-001: Progress Bar Mobile Layout Enhancement](/docs/logged_memories/MRTMLY-001-progress-bar-mobile-layout.md) #mobile #layout #progress-bar #optimization #responsive-design
- [MRTMLY-002: Vercel Deployment Verification Requirements](/docs/logged_memories/MRTMLY-002-vercel-deployment-verification.md) #deployment #vercel #type-checking #quality-assurance
- [MRTMLY-003: Summary Component Test Suite Refactor](/docs/logged_memories/MRTMLY-003-summary-test-refactor.md) #testing #refactoring #edge-cases #performance
- [MRTMLY-004: Summary Component Status Message Bug Fix](/docs/logged_memories/MRTMLY-004-summary-status-message-fix.md) #bugfix #testing #ui #state-management
- [MRTMLY-005: Service Worker Update Error Debugging Session](/docs/logged_memories/MRTMLY-005-service-worker-update-error.md) #debugging #service-worker #error-handling
- [MRTMLY-006: Service Worker Update Retry Implementation](/docs/logged_memories/MRTMLY-006-service-worker-retry-mechanism.md) #service-worker #retry-mechanism #error-handling #reliability
- [MRTMLY-007: Service Worker Network-Aware Retry Enhancement](/docs/logged_memories/MRTMLY-007-service-worker-network-aware-retry.md) #service-worker #retry-mechanism #offline #network-awareness
- [MRTMLY-008: Service Worker Network-Aware Retry Test Failures](/docs/logged_memories/MRTMLY-008-service-worker-retry-test-failures.md) #debugging #service-worker #testing #event-listeners
- [MRTMLY-009: Service Worker Test Mocking Problems](/docs/logged_memories/MRTMLY-009-service-worker-test-mocking.md) #debugging #testing #service-worker #jest-mocks
- [MRTMLY-010: Service Worker Registration Test Failures](/docs/logged_memories/MRTMLY-010-service-worker-registration-test-failures.md) #debugging #tests #service-worker #jest-mocks
- [MRTMLY-011: Service Worker ESLint Errors Blocking Build](/docs/logged_memories/MRTMLY-011-service-worker-eslint-errors.md) #debugging #eslint #build #serviceworker
- [MRTMLY-012: Test-Friendly Reset Functionality with Custom Dialog](/docs/logged_memories/MRTMLY-012-test-friendly-reset-functionality.md) #testing #dialog #reset #refactoring
- [MRTMLY-013: Service Worker Test Build Error Fix](/docs/logged_memories/MRTMLY-013-service-worker-test-build-error.md) #debugging #tests #typescript #linting
- [MRTMLY-014: Header Component Mobile Layout Enhancement](/docs/logged_memories/MRTMLY-014-header-mobile-layout.md) #mobile #layout #header #accessibility #testing
- [MRTMLY-015: Offline Indicator Layout and Test Optimization](/docs/logged_memories/MRTMLY-015-offline-indicator-layout.md) #layout #testing #accessibility #mobile
- [MRTMLY-016: Deployment Build Failing Due to CommonJS Require](/docs/logged_memories/MRTMLY-016-deployment-build-commonjs-require.md) #deployment #testing #eslint #typescript
- [MRTMLY-017: Service Worker CSS Caching Strategy Update](/docs/logged_memories/MRTMLY-017-service-worker-css-caching.md) #service-worker #caching #development-experience #CSS
- [MRTMLY-018: Service Worker Development Caching Strategy Enhancement](/docs/logged_memories/MRTMLY-018-service-worker-dev-caching.md) #service-worker #caching #development-experience #javascript #json
- [MRTMLY-019: Timeline Break Visualization Fix](/docs/logged_memories/MRTMLY-019-timeline-break-visualization.md) #timeline #visualization #breaks #real-time-updates
- [MRTMLY-020: Timeline Component Memory Leak](/docs/logged_memories/MRTMLY-020-timeline-memory-leak.md) #debugging #memory-leak #jest #timeline #testing
- [MRTMLY-021: Timeline Component Test Suite Memory Leak and Failures](/docs/logged_memories/MRTMLY-021-timeline-test-suite-memory-leak.md) #debugging #tests #timeline #memory-leak #jest
- [MRTMLY-022: Contrast Ratio and Theme Testing Improvements](/docs/logged_memories/MRTMLY-022-contrast-ratio-theme-testing.md) #accessibility #testing #dark-mode #contrast
- [MRTMLY-023: Timeline Calculation Test Update for Break Visualization](/docs/logged_memories/MRTMLY-023-timeline-calculation-test.md) #testing #timeline #breaks #interactions
- [MRTMLY-024: Pre-deployment Verification for Dark Mode and Contrast Updates](/docs/logged_memories/MRTMLY-024-dark-mode-predeployment.md) #deployment #verification #testing #accessibility
- [MRTMLY-025: Summary Activity Order Fix](/docs/logged_memories/MRTMLY-025-summary-activity-order.md) #bug-fix #summary #chronological-order #testing
- [MRTMLY-026: Timeline Component Countdown Timer Fix](/docs/logged_memories/MRTMLY-026-timeline-countdown-timer.md) #debugging #timer #useEffect #cleanup
- [MRTMLY-027: Service Worker Update Notification Test Fixes](/docs/logged_memories/MRTMLY-027-service-worker-update-notification.md) #debugging #testing #service-worker #cypress
- [MRTMLY-028: Progress Element Repositioning for Mobile Optimization](/docs/logged_memories/MRTMLY-028-progress-element-repositioning.md) #mobile #layout #progress-bar #optimization
- [MRTMLY-029: Service Worker Registration Test Console Error Fix](/docs/logged_memories/MRTMLY-029-service-worker-registration-test.md) #debugging #tests #service-worker #test-mocking
- [MRTMLY-030: Progress Bar Conditional Visibility Fix](/docs/logged_memories/MRTMLY-030-progress-bar-visibility.md) #debugging #tests #progress-bar #conditional-rendering
- [MRTMLY-031: Summary Component Theme Color Updates](/docs/logged_memories/MRTMLY-031-summary-theme-colors.md) #bug-fix #theme #dark-mode #summary #testing
- [MRTMLY-032: Timeline Component Theme Color Update Bug](/docs/logged_memories/MRTMLY-032-timeline-theme-colors.md) #bug-fix #theme #dark-mode #timeline #regression
- [MRTMLY-033: Service Worker Utils TypeScript Linting Fix](/docs/logged_memories/MRTMLY-033-service-worker-typescript-linting.md) #typescript #linting #service-worker #testing #type-safety
- [MRTMLY-034: Time Utils TypeScript Linting Fix](/docs/logged_memories/MRTMLY-034-time-utils-typescript-linting.md) #typescript #linting #testing #time-utils #type-safety
- [MRTMLY-035: Progress Bar Testing Failures After CSS Updates](/docs/logged_memories/MRTMLY-035-progress-bar-testing-failures.md) #debugging #testing #css #progress-bar
- [MRTMLY-036: Progress Bar Theme Compatibility Testing](/docs/logged_memories/MRTMLY-036-progress-bar-theme-testing.md) #testing #theme #accessibility #progress-bar
- [MRTMLY-037: Test Suite Expansion Planning Based on Known Bugs](/docs/logged_memories/MRTMLY-037-test-suite-expansion-planning.md) #testing #planning #bugs #test-coverage #regression-testing
- [MRTMLY-038: Time Utilities Consolidation](/docs/logged_memories/MRTMLY-038-time-utilities-consolidation.md) #refactoring #utilities #time #circular-reference
- [MRTMLY-039: Idle Time Calculation Test Suite Implementation](/docs/logged_memories/MRTMLY-039-idle-time-calculation-testing.md)
- [MRTMLY-040: Break Visualization Test Suite Expansion](/docs/logged_memories/MRTMLY-040-break-visualization-testing.md)
- [MRTMLY-041: Activity Order in Summary Tests Implementation](/docs/logged_memories/MRTMLY-041-activity-order-summary-tests.md) #testing #summary #activity-order #chronological-order
- [MRTMLY-042: Time Utilities Documentation and Maintenance Guidelines](/docs/logged_memories/MRTMLY-042-time-utilities-documentation.md) #documentation #utilities #time-utils #testing #best-practices
- [MRTMLY-043: Linting Error Fix in timeUtils.ts](/docs/logged_memories/MRTMLY-043-timeutils-linting-error-fix.md) #debugging #linting #tests #time-utils
- [MRTMLY-044: Build Failure Due to Unused Import](/docs/logged_memories/MRTMLY-044-build-failure-unused-import.md) #debugging #build #imports #linting #typescript
- [MRTMLY-045: Time Utils Test Import Error Fix](/docs/logged_memories/MRTMLY-045-timeutils-import-error-fix.md) #debugging #linting #typescript #time-utils #tests
- [MRTMLY-046: Activity Order in Summary Test Expansion](/docs/logged_memories/MRTMLY-046-activity-order-test-expansion.md) #testing #summary #activity-order #chronological-order #duplicate
- [Splash Screen Test Debugging](/docs/logged_memories/MRTMLY-001-splash-screen-test-debugging.md) - Fixed failing tests for the new splash screen component
- [Splash Screen Implementation](/docs/logged_memories/MRTMLY-002-splash-screen-implementation.md) - Completed implementation of application splash screen with loading state management
- [Missing globals.css Build Error](/docs/logged_memories/MRTMLY-003-missing-globals-css-build-error.md) - Fixed build error caused by missing global CSS file
- [MRTMLY-012: Border Radius Token Implementation](/docs/logged_memories/MRTMLY-012-border-radius-implementation.md) - Implementation of the border radius token system across CSS files #css #design-system #tokens #refactoring
- [MRTMLY-013: Border Radius System Refinement](/docs/logged_memories/MRTMLY-013-border-radius-refinement.md) - Refined border radius usage guidelines for consistent application based on element nesting #css #design-system #tokens #refinement #ui
- [MRTMLY-014: Shadow Token System Implementation](/docs/logged_memories/MRTMLY-014-shadow-token-system.md) - Created and implemented a comprehensive shadow token system with usage guidelines #css #design-system #tokens #shadows #ui
- [MRTMLY-015: Icon Alignment and Tag Border Radius Fixes](/docs/logged_memories/MRTMLY-015-icon-alignment-fixes.md) - Fixed misaligned icons and updated completed tag to follow squircle aesthetic #css #ui #icons #alignment #design-system
- [MRTMLY-016: Completed Tag Horizontal Alignment Fix](/docs/logged_memories/MRTMLY-016-completed-tag-alignment-fix.md) - Fixed horizontal spacing between icon and text in completed tag #css #ui #alignment #design-system
- [MRTMLY-017: Consistent UI Controls Sizing](/docs/logged_memories/MRTMLY-017-consistent-ui-controls-sizing.md) - Standardized sizes across buttons and tags for visual consistency #css #ui #standardization #controls #design-system
- [MRTMLY-018: Check Icon Horizontal Alignment Fix](/docs/logged_memories/MRTMLY-018-check-icon-alignment-fix.md) - Fixed horizontal alignment of check icon in completed tags #css #ui #alignment #icons
- [MRTMLY-019: Component Sizing Documentation](/docs/logged_memories/MRTMLY-019-component-sizing-documentation.md) - Added comprehensive documentation for component sizing variables #documentation #design-system #components #sizing #ui
- [MRTMLY-057: Fixing Routing Structure Tests](/docs/logged_memories/MRTMLY-057-fixing-routing-tests.md) - Resolved issues with routing integration tests and updated tests to handle hybrid routing approach
- [MRTMLY-008: Path Import Resolution for App Router](/docs/logged_memories/MRTMLY-008-path-import-resolution.md) - Fixed import path issues in App Router component to resolve build errors
- [MRTMLY-009: Metadata Export Fix](/docs/logged_memories/MRTMLY-009-metadata-export-fix.md) - Resolved the metadata export error by separating client and server component concerns
- [MRTMLY-024: Disabling Zoom and Pan on Mobile Devices](/docs/logged_memories/MRTMLY-024-disable-mobile-zoom-pan.md) #mobile #viewport #accessibility #ux
- [MRTMLY-054: Duplicate Activity Addition Error](/docs/logged_memories/MRTMLY-054-duplicate-activity-add-error.md) - Fixed console errors when adding activities with existing IDs by implementing graceful duplicate handling
- [MRTMLY-054: Hardcoded Spacing Values Replacement](/docs/logged_memories/MRTMLY-054-hardcoded-spacing-values-replacement.md) #css #spacing-system #variables #consistency #refactoring
- [MRTMLY-065: Next.js Routing Conflict Causing 404 Error](/docs/logged_memories/MRTMLY-065-nextjs-routing-conflict-404-error.md) #routing #next-js #debugging #deployment
- [MRTMLY-066: Next.js Routing Redirection Fix](/docs/logged_memories/MRTMLY-066-nextjs-routing-redirection-fix.md) #debugging #routing #next-js #redirection #app-router #pages-router
- [MRTMLY-067: Service Worker Registration Error After Routing Fix](/docs/logged_memories/MRTMLY-067-service-worker-registration-error.md) #debugging #service-worker #routing #next-js #error-handling
- [MRTMLY-068: Offline Functionality Broken After Routing Fix](/docs/logged_memories/MRTMLY-068-offline-functionality-broken.md) #debugging #service-worker #offline #caching #pwa
- [MRTMLY-069: Persistent Service Worker Update Error After Fix](/docs/logged_memories/MRTMLY-069-persistent-service-worker-update-error.md) #debugging #service-worker #error-handling #offline #pwa
- [MRTMLY-070: Next.js Configuration Errors and Browser Storage Issues](/docs/logged_memories/MRTMLY-070-nextjs-config-and-storage-issues.md) #debugging #next-js #configuration #service-worker #browser-storage
- [MRTMLY-071: Persistent Offline Functionality and Next.js Configuration Issues](/docs/logged_memories/MRTMLY-071-offline-cache-and-config-errors.md) #debugging #service-worker #offline #caching #next-js #configuration
- [MRTMLY-072: Persistent Offline Functionality Issues Despite Increased Caching](/docs/logged_memories/MRTMLY-072-persistent-offline-functionality-issues.md) #debugging #service-worker #offline #caching #pwa #next-js
- [MRTMLY-078: CSS Changes Not Reflected in Browser Despite Fast Refresh](/docs/logged_memories/MRTMLY-078-css-refresh-not-working.md) #debugging #service-worker #css #caching #development-experience
- [MRTMLY-079: Service Worker Syntax Test Failing Due to Environment Issues](/docs/logged_memories/MRTMLY-079-service-worker-syntax-test-environment.md) #debugging #service-worker #testing #environment
- [MRTMLY-080: Jest Setup Conflicts with Service Worker Test Environment](/docs/logged_memories/MRTMLY-080-jest-setup-isolation-for-service-worker-tests.md) #debugging #service-worker #testing #jest-config #test-isolation
- [MRTMLY-081: Service Worker Tests Need Special Handling in CI Workflow](/docs/logged_memories/MRTMLY-081-ci-workflow-for-service-worker-tests.md) #ci #testing #service-worker #workflow #deployment
- [MRTMLY-082: Theme Hydration Mismatch in Next.js App](/docs/logged_memories/MRTMLY-082-theme-hydration-mismatch.md) #bug-fix #theme #hydration #ssr #nextjs
- [MRTMLY-083: Resolved HTML Class Hydration Mismatch](/docs/logged_memories/MRTMLY-083-resolved-hydration-mismatch-html-class.md) #bug-fix #hydration #nextjs #theme #ssr