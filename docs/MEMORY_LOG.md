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

- [MRTMLY-001: Time Utilities Consolidation](/docs/logged_memories/MRTMLY-001-time-utilities-consolidation.md) #refactoring #utilities #time #circular-reference
- [MRTMLY-002: SplashScreen Test Failures Debugging Session](/docs/logged_memories/MRTMLY-002-splash-screen-test-debugging.md) #debugging #tests #splash-screen #css-modules
- [MRTMLY-003: Splash Screen Implementation](/docs/logged_memories/MRTMLY-003-splash-screen-implementation.md) #feature #splash-screen #accessibility #performance
- [MRTMLY-004: Missing globals.css File Build Error](/docs/logged_memories/MRTMLY-004-missing-globals-css-build-error.md) #debugging #build #css #deployment
- [MRTMLY-005: Build Failure Due to Unused Import](/docs/logged_memories/MRTMLY-005-build-failure-unused-import.md) #debugging #build-failure #linting #time-utils
- [MRTMLY-006: Linting Error in timeUtils.ts Debugging Session](/docs/logged_memories/MRTMLY-006-linting-error-fix.md) #debugging #linting #tests #timeUtils
- [MRTMLY-007: timeUtils.ts Linting Error Debugging Session](/docs/logged_memories/MRTMLY-007-timeutils-linting-error-fix.md) #debugging #linting #tests #time-utils
- [MRTMLY-008: Timer Display Consistency Test Suite Implementation](/docs/logged_memories/MRTMLY-008-timer-display-consistency-tests.md) #testing #timer #consistency #long-running-sessions #regression-testing
- [MRTMLY-009: Time Setup Input Formats Test Suite Implementation](/docs/logged_memories/MRTMLY-009-time-setup-input-formats-tests.md) #testing #time-setup #input-formats #edge-cases #regression-testing
- [MRTMLY-010: Fixing Routing Structure Tests](/docs/logged_memories/MRTMLY-010-fixing-routing-tests.md) #debugging #tests #routing #nextjs
- [MRTMLY-011: Border Radius Refinement](/docs/logged_memories/MRTMLY-011-border-radius-refinement.md) #css #design-system #tokens #refinement #ui
- [MRTMLY-012: Shadow Token System](/docs/logged_memories/MRTMLY-012-shadow-token-system.md) #css #design-system #tokens #shadows #ui
- [MRTMLY-013: Icon Alignment Fixes](/docs/logged_memories/MRTMLY-013-icon-alignment-fixes.md) #css #ui #icons #alignment #design-system
- [MRTMLY-014: Completed Tag Alignment Fix](/docs/logged_memories/MRTMLY-014-completed-tag-alignment-fix.md) #css #ui #alignment #design-system
- [MRTMLY-015: Consistent Ui Controls Sizing](/docs/logged_memories/MRTMLY-015-consistent-ui-controls-sizing.md) #css #ui #standardization #controls #design-system
- [MRTMLY-016: Check Icon Alignment Fix](/docs/logged_memories/MRTMLY-016-check-icon-alignment-fix.md) #css #ui #alignment #icons
- [MRTMLY-017: Component Sizing Documentation](/docs/logged_memories/MRTMLY-017-component-sizing-documentation.md) #documentation #design-system #components #sizing #ui
- [MRTMLY-018: Progress Bar Mobile Layout Enhancement](/docs/logged_memories/MRTMLY-018-progress-bar-mobile-layout.md) #mobile #layout #progress-bar #optimization #responsive-design
- [MRTMLY-019: Vercel Deployment Verification Requirements](/docs/logged_memories/MRTMLY-019-vercel-deployment-verification.md) #deployment #vercel #type-checking #quality-assurance
- [MRTMLY-020: Summary Component Test Suite Refactor](/docs/logged_memories/MRTMLY-020-summary-test-refactor.md) #testing #refactoring #edge-cases #performance
- [MRTMLY-021: Summary Component Status Message Bug Fix](/docs/logged_memories/MRTMLY-021-summary-status-message-fix.md) #bugfix #testing #ui #state-management
- [MRTMLY-022: Layout Test HTML Rendering Fix](/docs/logged_memories/MRTMLY-022-layout-test-html-rendering-fix.md) #debugging #tests #next-js #layout #typescript
- [MRTMLY-023: Production Console Log Removal](/docs/logged_memories/MRTMLY-023-production-console-logs-removal.md) #debugging #production #optimization #logging
- [MRTMLY-024: Service Worker Update Error Debugging Session](/docs/logged_memories/MRTMLY-024-service-worker-update-error.md) #debugging #service-worker #error-handling
- [MRTMLY-025: Service Worker Update Retry Implementation](/docs/logged_memories/MRTMLY-025-service-worker-retry-mechanism.md) #service-worker #retry-mechanism #error-handling #reliability
- [MRTMLY-026: Service Worker Network-Aware Retry Enhancement](/docs/logged_memories/MRTMLY-026-service-worker-network-aware-retry.md) #service-worker #retry-mechanism #offline #network-awareness
- [MRTMLY-027: Service Worker Network-Aware Retry Test Failures](/docs/logged_memories/MRTMLY-027-service-worker-retry-test-failures.md) #debugging #service-worker #testing #event-listeners
- [MRTMLY-028: Service Worker Test Mocking Problems](/docs/logged_memories/MRTMLY-028-service-worker-test-mocking.md) #debugging #testing #service-worker #jest-mocks
- [MRTMLY-029: Service Worker Registration Test Failures](/docs/logged_memories/MRTMLY-029-service-worker-registration-test-failures.md) #debugging #tests #service-worker #jest-mocks
- [MRTMLY-030: Service Worker ESLint Errors Blocking Build](/docs/logged_memories/MRTMLY-030-service-worker-eslint-errors.md) #debugging #eslint #build #serviceworker
- [MRTMLY-031: Test-Friendly Reset Functionality with Custom Dialog](/docs/logged_memories/MRTMLY-031-test-friendly-reset-functionality.md) #testing #dialog #reset #refactoring
- [MRTMLY-032: Service Worker Test Build Error Fix](/docs/logged_memories/MRTMLY-032-service-worker-test-build-error.md) #debugging #tests #typescript #linting
- [MRTMLY-033: Header Component Mobile Layout Enhancement](/docs/logged_memories/MRTMLY-033-header-mobile-layout.md) #mobile #layout #header #accessibility #testing
- [MRTMLY-034: Offline Indicator Layout and Test Optimization](/docs/logged_memories/MRTMLY-034-offline-indicator-layout.md) #layout #testing #accessibility #mobile
- [MRTMLY-035: Deployment Build Failing Due to CommonJS Require](/docs/logged_memories/MRTMLY-035-deployment-build-commonjs-require.md) #deployment #testing #eslint #typescript
- [MRTMLY-036: Service Worker CSS Caching Strategy Update](/docs/logged_memories/MRTMLY-036-service-worker-css-caching.md) #service-worker #caching #development-experience #CSS
- [MRTMLY-037: Service Worker Development Caching Strategy Enhancement](/docs/logged_memories/MRTMLY-037-service-worker-dev-caching.md) #service-worker #caching #development-experience #javascript #json
- [MRTMLY-038: Timeline Break Visualization Fix](/docs/logged_memories/MRTMLY-038-timeline-break-visualization.md) #timeline #visualization #breaks #real-time-updates
- [MRTMLY-039: Timeline Component Memory Leak](/docs/logged_memories/MRTMLY-039-timeline-memory-leak.md) #debugging #memory-leak #jest #timeline #testing
- [MRTMLY-040: Timeline Component Test Suite Memory Leak and Failures](/docs/logged_memories/MRTMLY-040-timeline-test-suite-memory-leak.md) #debugging #tests #timeline #memory-leak #jest
- [MRTMLY-041: Contrast Ratio and Theme Testing Improvements](/docs/logged_memories/MRTMLY-041-contrast-ratio-theme-testing.md) #accessibility #testing #dark-mode #contrast
- [MRTMLY-042: Timeline Calculation Test Update for Break Visualization](/docs/logged_memories/MRTMLY-042-timeline-calculation-test.md) #testing #timeline #breaks #interactions
- [MRTMLY-043: Pre-deployment Verification for Dark Mode and Contrast Updates](/docs/logged_memories/MRTMLY-043-dark-mode-predeployment.md) #deployment #verification #testing #accessibility
- [MRTMLY-044: Summary Activity Order Fix](/docs/logged_memories/MRTMLY-044-summary-activity-order.md) #bug-fix #summary #chronological-order #testing
- [MRTMLY-045: Timeline Component Countdown Timer Fix](/docs/logged_memories/MRTMLY-045-timeline-countdown-timer.md) #debugging #timer #useEffect #cleanup
- [MRTMLY-046: Service Worker Update Notification Test Fixes](/docs/logged_memories/MRTMLY-046-service-worker-update-notification.md) #debugging #testing #service-worker #cypress
- [MRTMLY-047: Progress Element Repositioning for Mobile Optimization](/docs/logged_memories/MRTMLY-047-progress-element-repositioning.md) #mobile #layout #progress-bar #optimization
- [MRTMLY-048: Service Worker Registration Test Console Error Fix](/docs/logged_memories/MRTMLY-048-service-worker-registration-test.md) #debugging #tests #service-worker #test-mocking
- [MRTMLY-049: Progress Bar Conditional Visibility Fix](/docs/logged_memories/MRTMLY-049-progress-bar-visibility.md) #debugging #tests #progress-bar #conditional-rendering
- [MRTMLY-050: Summary Component Theme Color Updates](/docs/logged_memories/MRTMLY-050-summary-theme-colors.md) #bug-fix #theme #dark-mode #summary #testing
- [MRTMLY-051: Timeline Component Theme Color Update Bug](/docs/logged_memories/MRTMLY-051-timeline-theme-colors.md) #bug-fix #theme #dark-mode #timeline #regression
- [MRTMLY-052: Service Worker Utils TypeScript Linting Fix](/docs/logged_memories/MRTMLY-052-service-worker-typescript-linting.md) #typescript #linting #service-worker #testing #type-safety
- [MRTMLY-053: Time Utils TypeScript Linting Fix](/docs/logged_memories/MRTMLY-053-time-utils-typescript-linting.md) #typescript #linting #testing #time-utils #type-safety
- [MRTMLY-054: Progress Bar Theme Compatibility Testing](/docs/logged_memories/MRTMLY-054-progress-bar-theme-testing.md) #testing #theme #accessibility #progress-bar
- [MRTMLY-055: Test Suite Expansion Planning Based on Known Bugs](/docs/logged_memories/MRTMLY-055-test-suite-expansion-planning.md) #testing #planning #bugs #test-coverage #regression-testing
- [MRTMLY-056: Idle Time Calculation Test Suite Implementation](/docs/logged_memories/MRTMLY-056-idle-time-calculation-testing.md) #testing #idle-time #breaks #edge-cases #time-accounting
- [MRTMLY-057: Break Visualization Test Suite Expansion](/docs/logged_memories/MRTMLY-057-break-visualization-testing.md) #testing #breaks #timeline #real-time #edge-cases
- [MRTMLY-058: Activity Order in Summary Tests Implementation](/docs/logged_memories/MRTMLY-058-activity-order-summary-tests.md) #testing #summary #activity-order #chronological-order
- [MRTMLY-059: Activity Order in Summary Test Expansion](/docs/logged_memories/MRTMLY-059-activity-order-test-expansion.md) #testing #summary #activity-order #chronological-order
- [MRTMLY-060: Unused Variable in Summary Component](/docs/logged_memories/MRTMLY-060-unused-variable-summary-component.md) #linting #deployment #summary #compilation-error
- [MRTMLY-061: Next.js Routing Conflict Causing 404 Error](/docs/logged_memories/MRTMLY-061-nextjs-routing-conflict-404-error.md) #debugging #routing #next-js #deployment
- [MRTMLY-062: Path Import Resolution](/docs/logged_memories/MRTMLY-062-path-import-resolution.md) #debugging #import-paths #app-router #build-error
- [MRTMLY-063: Metadata Export Fix](/docs/logged_memories/MRTMLY-063-metadata-export-fix.md) #debugging #next-js #app-router #metadata #deployment
- [MRTMLY-064: Next.js Missing Build Manifest File Error](/docs/logged_memories/MRTMLY-064-nextjs-build-manifest-missing-error.md) #debugging #next-js #deployment #build-error
- [MRTMLY-065: Next.js Routing Hybrid Structure Fix](/docs/logged_memories/MRTMLY-065-nextjs-routing-hybrid-structure-fix.md) #debugging #routing #next-js #hybrid-routing #app-router #pages-router
- [MRTMLY-066: Next.js Routing Redirection Fix](/docs/logged_memories/MRTMLY-066-nextjs-routing-redirection-fix.md) #debugging #routing #next-js #redirection #app-router #pages-router
- [MRTMLY-067: Service Worker Registration Error After Routing Fix](/docs/logged_memories/MRTMLY-067-service-worker-registration-error.md) #debugging #service-worker #routing #next-js #error-handling
- [MRTMLY-068: Offline Functionality Broken After Routing Fix](/docs/logged_memories/MRTMLY-068-offline-functionality-broken.md) #debugging #service-worker #offline #caching #pwa
- [MRTMLY-069: Persistent Service Worker Update Error After Fix](/docs/logged_memories/MRTMLY-069-persistent-service-worker-update-error.md) #debugging #service-worker #error-handling #offline #pwa
- [MRTMLY-070: Next.js Configuration Errors and Browser Storage Issues](/docs/logged_memories/MRTMLY-070-nextjs-config-and-storage-issues.md) #debugging #next-js #configuration #service-worker #browser-storage
- [MRTMLY-071: Persistent Offline Functionality and Next.js Configuration Issues](/docs/logged_memories/MRTMLY-071-offline-cache-and-config-errors.md) #debugging #service-worker #offline #caching #next-js #configuration
- [MRTMLY-072: Persistent Offline Functionality Issues Despite Increased Caching](/docs/logged_memories/MRTMLY-072-persistent-offline-functionality-issues.md) #debugging #service-worker #offline #caching #pwa #next-js
- [MRTMLY-073: Next.js 404 Error Due to Duplicate App Directories](/docs/logged_memories/MRTMLY-073-app-directory-routing-conflict-404.md) #debugging #next-js #routing #404-error
- [MRTMLY-074: Import Alias Resolution Error in Next.js](/docs/logged_memories/MRTMLY-074-import-alias-resolution-error.md) #debugging #next-js #imports #module-resolution #typescript
- [MRTMLY-075: Next.js 15 Metadata Configuration Warnings](/docs/logged_memories/MRTMLY-075-metadata-viewport-configuration.md) #next-js #metadata #viewport #configuration #warnings
- [MRTMLY-076: Viewport Type Definition Error in Build](/docs/logged_memories/MRTMLY-076-viewport-type-definition-fix.md) #debugging #next-js #typescript #type-error #viewport-configuration #build-error
- [MRTMLY-077: Service Worker Update Error](/docs/logged_memories/MRTMLY-077-service-worker-update-error.md) #debugging #service-worker #error #update-failure #offline-functionality
- [MRTMLY-078: Turbopack and Webpack Configuration Mismatch](/docs/logged_memories/MRTMLY-078-turbopack-webpack-configuration-mismatch.md) #debugging #next-js #bundler #turbopack #webpack #deprecation
- [MRTMLY-079: Splash Screen Theme Compatibility and Reduced Display Time](/docs/logged_memories/MRTMLY-079-splash-screen-theme-timing.md) #enhancement #ui #theming #performance #tests
- [MRTMLY-080: Service Worker TypeScript Error in Build](/docs/logged_memories/MRTMLY-080-service-worker-typescript-error.md) #debugging #typescript #type-error #service-worker #build-failure #deployment
- [MRTMLY-081: Service Worker Update Error Test TypeScript Errors](/docs/logged_memories/MRTMLY-081-service-worker-test-typescript-errors.md) #debugging #typescript #type-error #service-worker #test-failures #jest
- [MRTMLY-082: Service Worker Test ESLint Build Error](/docs/logged_memories/MRTMLY-082-service-worker-eslint-build-error.md) #debugging #eslint #build-error #service-worker #tests #deployment #typescript
- [MRTMLY-083: Disable Mobile Zoom Pan](/docs/logged_memories/MRTMLY-083-disable-mobile-zoom-pan.md) #mobile #viewport #accessibility #ux
- [MRTMLY-084: Duplicate Activity Addition Error](/docs/logged_memories/MRTMLY-084-duplicate-activity-add-error.md) #debugging #activities #state-machine #error-handling
- [MRTMLY-085: Layout Testing Hydration Error Fix](/docs/logged_memories/MRTMLY-085-layout-testing-hydration-error-fix.md) #testing #layout #hydration-error #next-js #jest
- [MRTMLY-086: Routing Conflict Between App Router and Pages Router](/docs/logged_memories/MRTMLY-086-routing-conflict-between-app-and-pages-router.md) #debugging #routing #next-js #deployment #vercel #testing
- [MRTMLY-087: Splash Screen Stuck in Hybrid Routing Setup](/docs/logged_memories/MRTMLY-087-splash-screen-stuck-hybrid-routing-fix.md) #debugging #splash-screen #hybrid-routing #next-js #loading-state
- [MRTMLY-088: CSS Spacing Scale Simplification Implementation](/docs/logged_memories/MRTMLY-088-css-spacing-scale-simplification.md) #css #refactoring #spacing-system #variables
- [MRTMLY-089: CSS Spacing Scale Implementation Adjustments](/docs/logged_memories/MRTMLY-089-css-spacing-implementation-adjustments.md) #css #refactoring #spacing-system #variables #visual-design
- [MRTMLY-090: Mobile Padding Optimization](/docs/logged_memories/MRTMLY-090-mobile-padding-optimization.md) #css #mobile #responsive-design #spacing-system #optimization
- [MRTMLY-091: Additional Mobile Spacing Optimizations](/docs/logged_memories/MRTMLY-091-additional-mobile-spacing-optimizations.md) #css #mobile #responsive-design #spacing-system #optimization
- [MRTMLY-092: Replacing Remaining Hardcoded Spacing Values](/docs/logged_memories/MRTMLY-092-hardcoded-spacing-values-replacement.md) #css #spacing-system #variables #consistency #refactoring
- [MRTMLY-093: Time Utilities Documentation and Maintenance Guidelines](/docs/logged_memories/MRTMLY-093-time-utilities-documentation.md) #documentation #utilities #time-utils #testing #best-practices
- [MRTMLY-094: Time Utils Test Import Error Fix](/docs/logged_memories/MRTMLY-094-timeutils-import-error-fix.md) #debugging #linting #typescript #time-utils #tests

## May 2025

- [MRTMLY-093: Time Utilities Documentation and Maintenance Guidelines](/docs/logged_memories/MRTMLY-093-time-utilities-documentation.md) - 2025-05-10 #documentation #utilities #time-utils #testing #best-practices
- [MRTMLY-094: Time Utils Test Import Error Fix](/docs/logged_memories/MRTMLY-094-timeutils-import-error-fix.md) - 2025-05-15 #debugging #linting #typescript #time-utils #tests

## April 2025

- [MRTMLY-052: Service Worker Utils TypeScript Linting Fix](/docs/logged_memories/MRTMLY-052-service-worker-typescript-linting.md) - 2025-04-02 #typescript #linting #service-worker #testing #type-safety
- [MRTMLY-053: Time Utils TypeScript Linting Fix](/docs/logged_memories/MRTMLY-053-time-utils-typescript-linting.md) - 2025-04-02 #typescript #linting #testing #time-utils #type-safety
- [MRTMLY-054: Progress Bar Theme Compatibility Testing](/docs/logged_memories/MRTMLY-054-progress-bar-theme-testing.md) - 2025-04-02 #testing #theme #accessibility #progress-bar
- [MRTMLY-055: Test Suite Expansion Planning Based on Known Bugs](/docs/logged_memories/MRTMLY-055-test-suite-expansion-planning.md) - 2025-04-02 #testing #planning #bugs #test-coverage #regression-testing
- [MRTMLY-056: Idle Time Calculation Test Suite Implementation](/docs/logged_memories/MRTMLY-056-idle-time-calculation-testing.md) - 2025-04-03 #testing #idle-time #breaks #edge-cases #time-accounting
- [MRTMLY-057: Break Visualization Test Suite Expansion](/docs/logged_memories/MRTMLY-057-break-visualization-testing.md) - 2025-04-03 #testing #breaks #timeline #real-time #edge-cases
- [MRTMLY-058: Activity Order in Summary Tests Implementation](/docs/logged_memories/MRTMLY-058-activity-order-summary-tests.md) - 2025-04-05 #testing #summary #activity-order #chronological-order
- [MRTMLY-059: Activity Order in Summary Test Expansion](/docs/logged_memories/MRTMLY-059-activity-order-test-expansion.md) - 2025-04-05 #testing #summary #activity-order #chronological-order
- [MRTMLY-060: Unused Variable in Summary Component](/docs/logged_memories/MRTMLY-060-unused-variable-summary-component.md) - 2025-04-05 #linting #deployment #summary #compilation-error
- [MRTMLY-061: Next.js Routing Conflict Causing 404 Error](/docs/logged_memories/MRTMLY-061-nextjs-routing-conflict-404-error.md) - 2025-04-07 #debugging #routing #next-js #deployment
- [MRTMLY-062: Path Import Resolution](/docs/logged_memories/MRTMLY-062-path-import-resolution.md) - 2025-04-08 #debugging #import-paths #app-router #build-error
- [MRTMLY-063: Metadata Export Fix](/docs/logged_memories/MRTMLY-063-metadata-export-fix.md) - 2025-04-08 #debugging #next-js #app-router #metadata #deployment
- [MRTMLY-064: Next.js Missing Build Manifest File Error](/docs/logged_memories/MRTMLY-064-nextjs-build-manifest-missing-error.md) - 2025-04-08 #debugging #next-js #deployment #build-error
- [MRTMLY-065: Next.js Routing Hybrid Structure Fix](/docs/logged_memories/MRTMLY-065-nextjs-routing-hybrid-structure-fix.md) - 2025-04-08 #debugging #routing #next-js #hybrid-routing #app-router #pages-router
- [MRTMLY-066: Next.js Routing Redirection Fix](/docs/logged_memories/MRTMLY-066-nextjs-routing-redirection-fix.md) - 2025-04-08 #debugging #routing #next-js #redirection #app-router #pages-router
- [MRTMLY-067: Service Worker Registration Error After Routing Fix](/docs/logged_memories/MRTMLY-067-service-worker-registration-error.md) - 2025-04-08 #debugging #service-worker #routing #next-js #error-handling
- [MRTMLY-068: Offline Functionality Broken After Routing Fix](/docs/logged_memories/MRTMLY-068-offline-functionality-broken.md) - 2025-04-08 #debugging #service-worker #offline #caching #pwa
- [MRTMLY-069: Persistent Service Worker Update Error After Fix](/docs/logged_memories/MRTMLY-069-persistent-service-worker-update-error.md) - 2025-04-08 #debugging #service-worker #error-handling #offline #pwa
- [MRTMLY-070: Next.js Configuration Errors and Browser Storage Issues](/docs/logged_memories/MRTMLY-070-nextjs-config-and-storage-issues.md) - 2025-04-08 #debugging #next-js #configuration #service-worker #browser-storage
- [MRTMLY-071: Persistent Offline Functionality and Next.js Configuration Issues](/docs/logged_memories/MRTMLY-071-offline-cache-and-config-errors.md) - 2025-04-08 #debugging #service-worker #offline #caching #next-js #configuration
- [MRTMLY-072: Persistent Offline Functionality Issues Despite Increased Caching](/docs/logged_memories/MRTMLY-072-persistent-offline-functionality-issues.md) - 2025-04-08 #debugging #service-worker #offline #caching #pwa #next-js
- [MRTMLY-073: Next.js 404 Error Due to Duplicate App Directories](/docs/logged_memories/MRTMLY-073-app-directory-routing-conflict-404.md) - 2025-04-08 #debugging #next-js #routing #404-error
- [MRTMLY-074: Import Alias Resolution Error in Next.js](/docs/logged_memories/MRTMLY-074-import-alias-resolution-error.md) - 2025-04-08 #debugging #next-js #imports #module-resolution #typescript
- [MRTMLY-075: Next.js 15 Metadata Configuration Warnings](/docs/logged_memories/MRTMLY-075-metadata-viewport-configuration.md) - 2025-04-08 #next-js #metadata #viewport #configuration #warnings
- [MRTMLY-076: Viewport Type Definition Error in Build](/docs/logged_memories/MRTMLY-076-viewport-type-definition-fix.md) - 2025-04-08 #debugging #next-js #typescript #type-error #viewport-configuration #build-error
- [MRTMLY-077: Service Worker Update Error](/docs/logged_memories/MRTMLY-077-service-worker-update-error.md) - 2025-04-08 #debugging #service-worker #error #update-failure #offline-functionality
- [MRTMLY-078: Turbopack and Webpack Configuration Mismatch](/docs/logged_memories/MRTMLY-078-turbopack-webpack-configuration-mismatch.md) - 2025-04-09 #debugging #next-js #bundler #turbopack #webpack #deprecation
- [MRTMLY-079: Splash Screen Theme Compatibility and Reduced Display Time](/docs/logged_memories/MRTMLY-079-splash-screen-theme-timing.md) - 2025-04-09 #enhancement #ui #theming #performance #tests
- [MRTMLY-080: Service Worker TypeScript Error in Build](/docs/logged_memories/MRTMLY-080-service-worker-typescript-error.md) - 2025-04-09 #debugging #typescript #type-error #service-worker #build-failure #deployment
- [MRTMLY-081: Service Worker Update Error Test TypeScript Errors](/docs/logged_memories/MRTMLY-081-service-worker-test-typescript-errors.md) - 2025-04-09 #debugging #typescript #type-error #service-worker #test-failures #jest
- [MRTMLY-082: Service Worker Test ESLint Build Error](/docs/logged_memories/MRTMLY-082-service-worker-eslint-build-error.md) - 2025-04-09 #debugging #eslint #build-error #service-worker #tests #deployment #typescript
- [MRTMLY-083: Disable Mobile Zoom Pan](/docs/logged_memories/MRTMLY-083-disable-mobile-zoom-pan.md) - 2025-04-10 #mobile #viewport #accessibility #ux
- [MRTMLY-084: Duplicate Activity Addition Error](/docs/logged_memories/MRTMLY-084-duplicate-activity-add-error.md) - 2025-04-10 #debugging #activities #state-machine #error-handling
- [MRTMLY-085: Layout Testing Hydration Error Fix](/docs/logged_memories/MRTMLY-085-layout-testing-hydration-error-fix.md) - 2025-04-10 #testing #layout #hydration-error #next-js #jest
- [MRTMLY-086: Routing Conflict Between App Router and Pages Router](/docs/logged_memories/MRTMLY-086-routing-conflict-between-app-and-pages-router.md) - 2025-04-10 #debugging #routing #next-js #deployment #vercel #testing
- [MRTMLY-087: Splash Screen Stuck in Hybrid Routing Setup](/docs/logged_memories/MRTMLY-087-splash-screen-stuck-hybrid-routing-fix.md) - 2025-04-12 #debugging #splash-screen #hybrid-routing #next-js #loading-state
- [MRTMLY-088: CSS Spacing Scale Simplification Implementation](/docs/logged_memories/MRTMLY-088-css-spacing-scale-simplification.md) - 2025-04-13 #css #refactoring #spacing-system #variables
- [MRTMLY-089: CSS Spacing Scale Implementation Adjustments](/docs/logged_memories/MRTMLY-089-css-spacing-implementation-adjustments.md) - 2025-04-14 #css #refactoring #spacing-system #variables #visual-design
- [MRTMLY-090: Mobile Padding Optimization](/docs/logged_memories/MRTMLY-090-mobile-padding-optimization.md) - 2025-04-14 #css #mobile #responsive-design #spacing-system #optimization
- [MRTMLY-091: Additional Mobile Spacing Optimizations](/docs/logged_memories/MRTMLY-091-additional-mobile-spacing-optimizations.md) - 2025-04-14 #css #mobile #responsive-design #spacing-system #optimization
- [MRTMLY-092: Replacing Remaining Hardcoded Spacing Values](/docs/logged_memories/MRTMLY-092-hardcoded-spacing-values-replacement.md) - 2025-04-14 #css #spacing-system #variables #consistency #refactoring

## March 2025

- [MRTMLY-031: Test-Friendly Reset Functionality with Custom Dialog](/docs/logged_memories/MRTMLY-031-test-friendly-reset-functionality.md) - 2025-03-01 #testing #dialog #reset #refactoring
- [MRTMLY-032: Service Worker Test Build Error Fix](/docs/logged_memories/MRTMLY-032-service-worker-test-build-error.md) - 2025-03-01 #debugging #tests #typescript #linting
- [MRTMLY-033: Header Component Mobile Layout Enhancement](/docs/logged_memories/MRTMLY-033-header-mobile-layout.md) - 2025-03-01 #mobile #layout #header #accessibility #testing
- [MRTMLY-034: Offline Indicator Layout and Test Optimization](/docs/logged_memories/MRTMLY-034-offline-indicator-layout.md) - 2025-03-01 #layout #testing #accessibility #mobile
- [MRTMLY-035: Deployment Build Failing Due to CommonJS Require](/docs/logged_memories/MRTMLY-035-deployment-build-commonjs-require.md) - 2025-03-01 #deployment #testing #eslint #typescript
- [MRTMLY-036: Service Worker CSS Caching Strategy Update](/docs/logged_memories/MRTMLY-036-service-worker-css-caching.md) - 2025-03-02 #service-worker #caching #development-experience #CSS
- [MRTMLY-037: Service Worker Development Caching Strategy Enhancement](/docs/logged_memories/MRTMLY-037-service-worker-dev-caching.md) - 2025-03-02 #service-worker #caching #development-experience #javascript #json
- [MRTMLY-038: Timeline Break Visualization Fix](/docs/logged_memories/MRTMLY-038-timeline-break-visualization.md) - 2025-03-02 #timeline #visualization #breaks #real-time-updates
- [MRTMLY-039: Timeline Component Memory Leak](/docs/logged_memories/MRTMLY-039-timeline-memory-leak.md) - 2025-03-03 #debugging #memory-leak #jest #timeline #testing
- [MRTMLY-040: Timeline Component Test Suite Memory Leak and Failures](/docs/logged_memories/MRTMLY-040-timeline-test-suite-memory-leak.md) - 2025-03-03 #debugging #tests #timeline #memory-leak #jest
- [MRTMLY-041: Contrast Ratio and Theme Testing Improvements](/docs/logged_memories/MRTMLY-041-contrast-ratio-theme-testing.md) - 2025-03-04 #accessibility #testing #dark-mode #contrast
- [MRTMLY-042: Timeline Calculation Test Update for Break Visualization](/docs/logged_memories/MRTMLY-042-timeline-calculation-test.md) - 2025-03-10 #testing #timeline #breaks #interactions
- [MRTMLY-043: Pre-deployment Verification for Dark Mode and Contrast Updates](/docs/logged_memories/MRTMLY-043-dark-mode-predeployment.md) - 2025-03-10 #deployment #verification #testing #accessibility
- [MRTMLY-044: Summary Activity Order Fix](/docs/logged_memories/MRTMLY-044-summary-activity-order.md) - 2025-03-15 #bug-fix #summary #chronological-order #testing
- [MRTMLY-045: Timeline Component Countdown Timer Fix](/docs/logged_memories/MRTMLY-045-timeline-countdown-timer.md) - 2025-03-15 #debugging #timer #useEffect #cleanup
- [MRTMLY-046: Service Worker Update Notification Test Fixes](/docs/logged_memories/MRTMLY-046-service-worker-update-notification.md) - 2025-03-20 #debugging #testing #service-worker #cypress
- [MRTMLY-047: Progress Element Repositioning for Mobile Optimization](/docs/logged_memories/MRTMLY-047-progress-element-repositioning.md) - 2025-03-21 #mobile #layout #progress-bar #optimization
- [MRTMLY-048: Service Worker Registration Test Console Error Fix](/docs/logged_memories/MRTMLY-048-service-worker-registration-test.md) - 2025-03-25 #debugging #tests #service-worker #test-mocking
- [MRTMLY-049: Progress Bar Conditional Visibility Fix](/docs/logged_memories/MRTMLY-049-progress-bar-visibility.md) - 2025-03-27 #debugging #tests #progress-bar #conditional-rendering
- [MRTMLY-050: Summary Component Theme Color Updates](/docs/logged_memories/MRTMLY-050-summary-theme-colors.md) - 2025-03-28 #bug-fix #theme #dark-mode #summary #testing
- [MRTMLY-051: Timeline Component Theme Color Update Bug](/docs/logged_memories/MRTMLY-051-timeline-theme-colors.md) - 2025-03-31 #bug-fix #theme #dark-mode #timeline #regression

## December 2024

- [MRTMLY-029: Service Worker Registration Test Failures](/docs/logged_memories/MRTMLY-029-service-worker-registration-test-failures.md) - 2024-12-05 #debugging #tests #service-worker #jest-mocks
- [MRTMLY-030: Service Worker ESLint Errors Blocking Build](/docs/logged_memories/MRTMLY-030-service-worker-eslint-errors.md) - 2024-12-10 #debugging #eslint #build #serviceworker

## November 2024

- [MRTMLY-024: Service Worker Update Error Debugging Session](/docs/logged_memories/MRTMLY-024-service-worker-update-error.md) - 2024-11-05 #debugging #service-worker #error-handling
- [MRTMLY-025: Service Worker Update Retry Implementation](/docs/logged_memories/MRTMLY-025-service-worker-retry-mechanism.md) - 2024-11-12 #service-worker #retry-mechanism #error-handling #reliability
- [MRTMLY-026: Service Worker Network-Aware Retry Enhancement](/docs/logged_memories/MRTMLY-026-service-worker-network-aware-retry.md) - 2024-11-20 #service-worker #retry-mechanism #offline #network-awareness
- [MRTMLY-027: Service Worker Network-Aware Retry Test Failures](/docs/logged_memories/MRTMLY-027-service-worker-retry-test-failures.md) - 2024-11-25 #debugging #service-worker #testing #event-listeners
- [MRTMLY-028: Service Worker Test Mocking Problems](/docs/logged_memories/MRTMLY-028-service-worker-test-mocking.md) - 2024-11-30 #debugging #testing #service-worker #jest-mocks

## July 2024

- [MRTMLY-022: Layout Test HTML Rendering Fix](/docs/logged_memories/MRTMLY-022-layout-test-html-rendering-fix.md) - 2024-07-01 #debugging #tests #next-js #layout #typescript
- [MRTMLY-023: Production Console Log Removal](/docs/logged_memories/MRTMLY-023-production-console-logs-removal.md) - 2024-07-15 #debugging #production #optimization #logging

## February 2024

- [MRTMLY-019: Vercel Deployment Verification Requirements](/docs/logged_memories/MRTMLY-019-vercel-deployment-verification.md) - 2024-02-05 #deployment #vercel #type-checking #quality-assurance
- [MRTMLY-020: Summary Component Test Suite Refactor](/docs/logged_memories/MRTMLY-020-summary-test-refactor.md) - 2024-02-10 #testing #refactoring #edge-cases #performance
- [MRTMLY-021: Summary Component Status Message Bug Fix](/docs/logged_memories/MRTMLY-021-summary-status-message-fix.md) - 2024-02-20 #bugfix #testing #ui #state-management

## January 2024

- [MRTMLY-018: Progress Bar Mobile Layout Enhancement](/docs/logged_memories/MRTMLY-018-progress-bar-mobile-layout.md) - 2024-01-15 #mobile #layout #progress-bar #optimization #responsive-design

## December 2023

- [MRTMLY-010: Fixing Routing Structure Tests](/docs/logged_memories/MRTMLY-010-fixing-routing-tests.md) - 2023-12-11 #debugging #tests #routing #nextjs
- [MRTMLY-011: Border Radius Refinement](/docs/logged_memories/MRTMLY-011-border-radius-refinement.md) - 2023-12-15 #css #design-system #tokens #refinement #ui
- [MRTMLY-012: Shadow Token System](/docs/logged_memories/MRTMLY-012-shadow-token-system.md) - 2023-12-16 #css #design-system #tokens #shadows #ui
- [MRTMLY-013: Icon Alignment Fixes](/docs/logged_memories/MRTMLY-013-icon-alignment-fixes.md) - 2023-12-17 #css #ui #icons #alignment #design-system
- [MRTMLY-014: Completed Tag Alignment Fix](/docs/logged_memories/MRTMLY-014-completed-tag-alignment-fix.md) - 2023-12-17 #css #ui #alignment #design-system
- [MRTMLY-015: Consistent Ui Controls Sizing](/docs/logged_memories/MRTMLY-015-consistent-ui-controls-sizing.md) - 2023-12-18 #css #ui #standardization #controls #design-system
- [MRTMLY-016: Check Icon Alignment Fix](/docs/logged_memories/MRTMLY-016-check-icon-alignment-fix.md) - 2023-12-18 #css #ui #alignment #icons
- [MRTMLY-017: Component Sizing Documentation](/docs/logged_memories/MRTMLY-017-component-sizing-documentation.md) - 2023-12-18 #documentation #design-system #components #sizing #ui

## November 2023

- [MRTMLY-006: Linting Error in timeUtils.ts Debugging Session](/docs/logged_memories/MRTMLY-006-linting-error-fix.md) - 2023-11-01 #debugging #linting #tests #timeUtils
- [MRTMLY-007: timeUtils.ts Linting Error Debugging Session](/docs/logged_memories/MRTMLY-007-timeutils-linting-error-fix.md) - 2023-11-01 #debugging #linting #tests #time-utils
- [MRTMLY-008: Timer Display Consistency Test Suite Implementation](/docs/logged_memories/MRTMLY-008-timer-display-consistency-tests.md) - 2023-11-15 #testing #timer #consistency #long-running-sessions #regression-testing
- [MRTMLY-009: Time Setup Input Formats Test Suite Implementation](/docs/logged_memories/MRTMLY-009-time-setup-input-formats-tests.md) - 2023-11-16 #testing #time-setup #input-formats #edge-cases #regression-testing

## October 2023

- [MRTMLY-005: Build Failure Due to Unused Import](/docs/logged_memories/MRTMLY-005-build-failure-unused-import.md) - 2023-10-31 #debugging #build-failure #linting #time-utils

## September 2023

- [MRTMLY-002: SplashScreen Test Failures Debugging Session](/docs/logged_memories/MRTMLY-002-splash-screen-test-debugging.md) - 2023-09-15 #debugging #tests #splash-screen #css-modules
- [MRTMLY-003: Splash Screen Implementation](/docs/logged_memories/MRTMLY-003-splash-screen-implementation.md) - 2023-09-15 #feature #splash-screen #accessibility #performance
- [MRTMLY-004: Missing globals.css File Build Error](/docs/logged_memories/MRTMLY-004-missing-globals-css-build-error.md) - 2023-09-15 #debugging #build #css #deployment

## July 2023

- [MRTMLY-001: Time Utilities Consolidation](/docs/logged_memories/MRTMLY-001-time-utilities-consolidation.md) - 2023-07-01 #refactoring #utilities #time #circular-reference

