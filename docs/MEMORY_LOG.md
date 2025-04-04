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
- [MRTMLY-001: Progress Bar Mobile Layout Enhancement](./logged_memories/MRTMLY-001-progress-bar-mobile-layout.md) #mobile #layout #progress-bar #optimization #responsive-design
- [MRTMLY-002: Vercel Deployment Verification Requirements](./logged_memories/MRTMLY-002-vercel-deployment-verification.md) #deployment #vercel #type-checking #quality-assurance
- [MRTMLY-003: Summary Component Test Suite Refactor](./logged_memories/MRTMLY-003-summary-test-refactor.md) #testing #refactoring #edge-cases #performance
- [MRTMLY-004: Summary Component Status Message Bug Fix](./logged_memories/MRTMLY-004-summary-status-message-fix.md) #bugfix #testing #ui #state-management
- [MRTMLY-005: Service Worker Update Error Debugging Session](./logged_memories/MRTMLY-005-service-worker-update-error.md) #debugging #service-worker #error-handling
- [MRTMLY-006: Service Worker Update Retry Implementation](./logged_memories/MRTMLY-006-service-worker-retry-mechanism.md) #service-worker #retry-mechanism #error-handling #reliability
- [MRTMLY-007: Service Worker Network-Aware Retry Enhancement](./logged_memories/MRTMLY-007-service-worker-network-aware-retry.md) #service-worker #retry-mechanism #offline #network-awareness
- [MRTMLY-008: Service Worker Network-Aware Retry Test Failures](./logged_memories/MRTMLY-008-service-worker-retry-test-failures.md) #debugging #service-worker #testing #event-listeners
- [MRTMLY-009: Service Worker Test Mocking Problems](./logged_memories/MRTMLY-009-service-worker-test-mocking.md) #debugging #testing #service-worker #jest-mocks
- [MRTMLY-010: Service Worker Registration Test Failures](./logged_memories/MRTMLY-010-service-worker-registration-test-failures.md) #debugging #tests #service-worker #jest-mocks
- [MRTMLY-011: Service Worker ESLint Errors Blocking Build](./logged_memories/MRTMLY-011-service-worker-eslint-errors.md) #debugging #eslint #build #serviceworker
- [MRTMLY-012: Test-Friendly Reset Functionality with Custom Dialog](./logged_memories/MRTMLY-012-test-friendly-reset-functionality.md) #testing #dialog #reset #refactoring
- [MRTMLY-013: Service Worker Test Build Error Fix](./logged_memories/MRTMLY-013-service-worker-test-build-error.md) #debugging #tests #typescript #linting
- [MRTMLY-014: Header Component Mobile Layout Enhancement](./logged_memories/MRTMLY-014-header-mobile-layout.md) #mobile #layout #header #accessibility #testing
- [MRTMLY-015: Offline Indicator Layout and Test Optimization](./logged_memories/MRTMLY-015-offline-indicator-layout.md) #layout #testing #accessibility #mobile
- [MRTMLY-016: Deployment Build Failing Due to CommonJS Require](./logged_memories/MRTMLY-016-deployment-build-commonjs-require.md) #deployment #testing #eslint #typescript
- [MRTMLY-017: Service Worker CSS Caching Strategy Update](./logged_memories/MRTMLY-017-service-worker-css-caching.md) #service-worker #caching #development-experience #CSS
- [MRTMLY-018: Service Worker Development Caching Strategy Enhancement](./logged_memories/MRTMLY-018-service-worker-dev-caching.md) #service-worker #caching #development-experience #javascript #json
- [MRTMLY-019: Timeline Break Visualization Fix](./logged_memories/MRTMLY-019-timeline-break-visualization.md) #timeline #visualization #breaks #real-time-updates
- [MRTMLY-020: Timeline Component Memory Leak](./logged_memories/MRTMLY-020-timeline-memory-leak.md) #debugging #memory-leak #jest #timeline #testing
- [MRTMLY-021: Timeline Component Test Suite Memory Leak and Failures](./logged_memories/MRTMLY-021-timeline-test-suite-memory-leak.md) #debugging #tests #timeline #memory-leak #jest
- [MRTMLY-022: Contrast Ratio and Theme Testing Improvements](./logged_memories/MRTMLY-022-contrast-ratio-theme-testing.md) #accessibility #testing #dark-mode #contrast
- [MRTMLY-023: Timeline Calculation Test Update for Break Visualization](./logged_memories/MRTMLY-023-timeline-calculation-test.md) #testing #timeline #breaks #interactions
- [MRTMLY-024: Pre-deployment Verification for Dark Mode and Contrast Updates](./logged_memories/MRTMLY-024-dark-mode-predeployment.md) #deployment #verification #testing #accessibility
- [MRTMLY-025: Summary Activity Order Fix](./logged_memories/MRTMLY-025-summary-activity-order.md) #bug-fix #summary #chronological-order #testing
- [MRTMLY-026: Timeline Component Countdown Timer Fix](./logged_memories/MRTMLY-026-timeline-countdown-timer.md) #debugging #timer #useEffect #cleanup
- [MRTMLY-027: Service Worker Update Notification Test Fixes](./logged_memories/MRTMLY-027-service-worker-update-notification.md) #debugging #testing #service-worker #cypress
- [MRTMLY-028: Progress Element Repositioning for Mobile Optimization](./logged_memories/MRTMLY-028-progress-element-repositioning.md) #mobile #layout #progress-bar #optimization
- [MRTMLY-029: Service Worker Registration Test Console Error Fix](./logged_memories/MRTMLY-029-service-worker-registration-test.md) #debugging #tests #service-worker #test-mocking
- [MRTMLY-030: Progress Bar Conditional Visibility Fix](./logged_memories/MRTMLY-030-progress-bar-visibility.md) #debugging #tests #progress-bar #conditional-rendering
- [MRTMLY-031: Summary Component Theme Color Updates](./logged_memories/MRTMLY-031-summary-theme-colors.md) #bug-fix #theme #dark-mode #summary #testing
- [MRTMLY-032: Timeline Component Theme Color Update Bug](./logged_memories/MRTMLY-032-timeline-theme-colors.md) #bug-fix #theme #dark-mode #timeline #regression
- [MRTMLY-033: Service Worker Utils TypeScript Linting Fix](./logged_memories/MRTMLY-033-service-worker-typescript-linting.md) #typescript #linting #service-worker #testing #type-safety
- [MRTMLY-034: Time Utils TypeScript Linting Fix](./logged_memories/MRTMLY-034-time-utils-typescript-linting.md) #typescript #linting #testing #time-utils #type-safety
- [MRTMLY-035: Progress Bar Testing Failures After CSS Updates](./logged_memories/MRTMLY-035-progress-bar-testing-failures.md) #debugging #testing #css #progress-bar
- [MRTMLY-036: Progress Bar Theme Compatibility Testing](./logged_memories/MRTMLY-036-progress-bar-theme-testing.md) #testing #theme #accessibility #progress-bar
- [MRTMLY-037: Test Suite Expansion Planning Based on Known Bugs](./logged_memories/MRTMLY-037-test-suite-expansion-planning.md) #testing #planning #bugs #test-coverage #regression-testing
- [MRTMLY-038: Time Utilities Consolidation](./logged_memories/MRTMLY-038-time-utilities-consolidation.md) #refactoring #utilities #time #circular-reference
- [MRTMLY-039: Idle Time Calculation Test Suite Implementation](./logged_memories/MRTMLY-039-idle-time-calculation-testing.md)
- [MRTMLY-040: Break Visualization Test Suite Expansion](./logged_memories/MRTMLY-040-break-visualization-testing.md)
- [MRTMLY-041: Activity Order in Summary Tests Implementation](./logged_memories/MRTMLY-041-activity-order-summary-tests.md) #testing #summary #activity-order #chronological-order
- [MRTMLY-042: Time Utilities Documentation and Maintenance Guidelines](./logged_memories/MRTMLY-042-time-utilities-documentation.md) #documentation #utilities #time-utils #testing #best-practices
- [MRTMLY-043: Linting Error Fix in timeUtils.ts](./logged_memories/MRTMLY-043-timeutils-linting-error-fix.md) #debugging #linting #tests #time-utils
- [MRTMLY-044: Build Failure Due to Unused Import](./logged_memories/MRTMLY-044-build-failure-unused-import.md) #debugging #build #imports #linting #typescript
- [MRTMLY-045: Time Utils Test Import Error Fix](./logged_memories/MRTMLY-045-timeutils-import-error-fix.md) #debugging #linting #typescript #time-utils #tests
- [MRTMLY-046: Activity Order in Summary Test Expansion](./logged_memories/MRTMLY-046-activity-order-test-expansion.md) #testing #summary #activity-order #chronological-order #duplicate
- [MRTMLY-047: Unused Variable in Summary Component](./logged_memories/MRTMLY-047-unused-variable-summary-component.md)
- [MRTMLY-048: Timer Display Consistency Test Suite Implementation](./logged_memories/MRTMLY-048-timer-display-consistency-tests.md) #testing #timer #consistency #long-running-sessions #regression-testing
- [MRTMLY-049: Time Setup Input Formats Test Suite Implementation](./logged_memories/MRTMLY-049-time-setup-input-formats-tests.md)
- [MRTMLY-050: CSS Spacing Scale Simplification Implementation](./logged_memories/MRTMLY-050-css-spacing-scale-simplification.md) #css #refactoring #spacing-system #variables
- [MRTMLY-051: CSS Spacing Scale Implementation Adjustments](./logged_memories/MRTMLY-051-css-spacing-implementation-adjustments.md) #css #refactoring #spacing-system #variables #visual-design
- [MRTMLY-052: Mobile Padding Optimization](./logged_memories/MRTMLY-052-mobile-padding-optimization.md) #css #mobile #responsive-design #spacing-system #optimization
- [MRTMLY-053: Additional Mobile Spacing Optimizations](./logged_memories/MRTMLY-053-additional-mobile-spacing-optimizations.md) #css #mobile #responsive-design #spacing-system #optimization
- [MRTMLY-054: Hardcoded Spacing Values Replacement](./logged_memories/MRTMLY-054-hardcoded-spacing-values-replacement.md) #css #spacing-system #variables #consistency #refactoring

## December 2023

- [MRTMLY-012: Border Radius Token Implementation](/docs/logged_memories/MRTMLY-012-border-radius-implementation.md) - Implementation of the border radius token system across CSS files #css #design-system #tokens #refactoring
- [MRTMLY-013: Border Radius System Refinement](/docs/logged_memories/MRTMLY-013-border-radius-refinement.md) - Refined border radius usage guidelines for consistent application based on element nesting #css #design-system #tokens #refinement #ui
- [MRTMLY-014: Shadow Token System Implementation](/docs/logged_memories/MRTMLY-014-shadow-token-system.md) - Created and implemented a comprehensive shadow token system with usage guidelines #css #design-system #tokens #shadows #ui
- [MRTMLY-015: Icon Alignment and Tag Border Radius Fixes](/docs/logged_memories/MRTMLY-015-icon-alignment-fixes.md) - Fixed misaligned icons and updated completed tag to follow squircle aesthetic #css #ui #icons #alignment #design-system
- [MRTMLY-016: Completed Tag Horizontal Alignment Fix](/docs/logged_memories/MRTMLY-016-completed-tag-alignment-fix.md) - Fixed horizontal spacing between icon and text in completed tag #css #ui #alignment #design-system