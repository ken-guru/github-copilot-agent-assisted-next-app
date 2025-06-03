# MRTMLY-203: Project Scope Correction - Widget Removal

**Date:** 2025-06-03  
**Tags:** #cleanup #project-scope #documentation #architecture  
**Status:** Resolved

## Initial State
During the React+Vite rewrite process, incorrect components (Calculator and WeatherWidget) were added to the project that don't belong to the original **Activity Timer and Tracker** application. These components were:

- `src/components/widgets/Calculator.tsx` - Fully implemented calculator component
- `src/__tests__/Calculator.test.tsx` - Comprehensive test suite (15+ tests)
- References in `docs/PLANNED_CHANGES.md` to weather widgets, task managers, and calculators

The planning documentation had been modified to include dashboard-style widgets that aren't part of the core activity tracking functionality.

## Problem Analysis
**Root Cause**: Misalignment between project planning and actual application scope
- Original app is specifically an **Activity Timer and Tracker**
- Not a general dashboard with various utility widgets
- Core features are:
  - Activity management (creation, tracking, completion)
  - Time management (duration setting, deadlines)
  - Progress visualization (ProgressBar, Timeline)
  - Theme system (light/dark/system modes)

**Impact**: 
- Wasted development effort on irrelevant components
- Incorrect documentation misleading future development
- Test suite pollution with non-applicable tests

## Resolution Process

### 1. Component Removal
```bash
# Removed widget components and tests
rm -rf /Users/ken/Workspace/.../src/components/widgets
rm /Users/ken/Workspace/.../src/__tests__/Calculator.test.tsx
```

### 2. Planning Document Correction
Updated `docs/PLANNED_CHANGES.md`:
- **Removed**: Calculator, WeatherWidget, TaskManager references
- **Added**: Correct activity management components:
  - ActivityForm, ActivityManager, Timeline
  - ProgressBar, Summary, TimeSetup
  - Theme system integration
- **Corrected**: File structure to reflect actual application architecture
- **Updated**: Phase planning to match real requirements

### 3. Verification
- Ran test suite: **166/167 tests passing** (1 pre-existing Modal focus trap issue)
- Confirmed no Calculator-related tests remain
- Verified core functionality intact

## Final State
- **Clean codebase**: Only components relevant to activity tracking
- **Accurate documentation**: PLANNED_CHANGES.md reflects actual requirements
- **Proper project scope**: Focus on Activity Timer and Tracker functionality
- **Core components intact**: All base UI components (Button, Input, Card, etc.) working

## Lessons Learned

### Project Scope Management
1. **Always reference original application** before adding new features
2. **Verify component relevance** to core functionality
3. **Maintain clear project identity** (Activity Timer vs. General Dashboard)

### Documentation Accuracy
1. **Keep planning documents aligned** with actual requirements
2. **Regular scope verification** prevents feature creep
3. **Reference original implementation** for feature validation

### Development Workflow
1. **Question unexpected features** during implementation
2. **Validate against original requirements** before major additions
3. **Clean up immediately** when scope misalignment is identified

## Next Steps
1. **Continue with Phase 2**: Implement actual activity management components
2. **Focus on core features**: ActivityForm, ActivityManager, Timeline components
3. **Reference original Next.js app** for accurate feature requirements
4. **Maintain scope discipline** throughout remaining development phases

## Related Issues
- Modal focus trap test failure (pre-existing, unrelated to cleanup)
- Need to implement actual activity management components next

## Tags for Future Reference
- #scope-correction: For similar project scope misalignments
- #cleanup: For removing incorrect implementations
- #planning-accuracy: For keeping documentation aligned with requirements
- #widget-removal: For removing non-essential components
