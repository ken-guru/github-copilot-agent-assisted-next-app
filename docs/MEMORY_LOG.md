# Memory Log

## Purpose
This document tracks solutions attempted by AI for application issues. It prevents repetitive solution attempts by maintaining a history of approaches that have been tried.

## How to Use
1. Before attempting to solve an issue, check this log for similar problems
2. If a similar issue exists, review previous approaches before trying new solutions
3. If no similar issue exists, create a new entry using the template below
4. Add details of each solution attempt to the appropriate issue entry

## Entry Format
Each issue receives a unique ID (format: MRTMLY-XXX) and includes attempted approaches, outcomes, and relevant tags.

## Memory Template
```
### Issue: MRTMLY-XXX: [Brief Description]
- **Date:** YYYY-MM-DD
- **Attempted Approaches:**
  1. [Description of first approach]
  2. [Description of second approach]
- **Outcome:** [Final result]
- **Tags:** [Relevant keywords]
```

## Issue Log

### Issue: MRTMLY-001: Progress Bar Mobile Layout Enhancement
- **Date:** 2024-01-27
- **Tags:** #mobile #layout #progress-bar #optimization #responsive-design

#### Initial State
- Progress bar time markers positioned below the bar in mobile view
- Layout not optimized for mobile viewport
- Progress bar component had same behavior across all viewports

#### Implementation Process
1. Mobile-First Approach
   - Added mobile viewport detection with `window.matchMedia`
   - Implemented conditional rendering based on viewport size
   - Created mobile-specific CSS classes and styling

2. Time Markers Positioning
   - Moved time markers above progress bar in mobile view
   - Used flexbox order property for layout control
   - Maintained existing desktop layout

#### Resolution
- Successfully implemented mobile-optimized layout
- All tests passing (163/163)
- Maintained accessibility and theme compatibility
- No regressions in desktop view

#### Lessons Learned
- Using CSS order property provides clean DOM structure while allowing visual reordering
- Window.matchMedia with useEffect provides reliable viewport detection
- Test mocking for matchMedia is essential for reliable tests
- Mobile-specific styles should be clearly separated for maintainability

### Issue: MRTMLY-002: Vercel Deployment Verification Requirements
- **Date:** 2024-01-30
- **Tags:** #deployment #vercel #type-checking #quality-assurance
#### Initial State
- Need to ensure all code changes are Vercel-deployment ready
- Multiple verification steps required before considering work complete
#### Implementation Process
1. Required Verification Steps
   - Type checking with `npm run type-check` and `tsc`
   - Linting with `npm run lint`
   - All tests must pass
2. Implementation Guidelines
   - These checks must be run before considering any feature complete
   - All type errors must be resolved
   - All lint warnings must be addressed
   - No deployment-blocking issues should remain
#### Resolution
- Established clear verification process for all changes
- Added to standard workflow requirements
#### Lessons Learned
- Early verification prevents deployment issues
- Type checking catches potential runtime errors before deployment
- Linting ensures code quality and consistency
- Multiple verification steps provide better reliability