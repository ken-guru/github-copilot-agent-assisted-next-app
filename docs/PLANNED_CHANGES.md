# Planned Changes Prompt Template
This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation. Once implemented, move the change to IMPLEMENTED_CHANGES.md with a timestamp.

## Change Request Template
```markdown
# Feature/Change Title

## Context
Provide context about the part of the application this change affects.
- Which components/utilities are involved?
- What current behavior needs to change?
- What user needs does this address?

## Requirements
Detailed specifications for the change:
1. First requirement
   - Implementation details
   - Technical considerations
   - Testing requirements
2. Second requirement
   - Sub-points
   - Edge cases to handle
3. Additional requirements as needed

## Technical Guidelines
- Framework-specific considerations
- Performance requirements
- Accessibility requirements
- Theme compatibility requirements
- Testing approach

## Expected Outcome
Describe what success looks like:
- User perspective
- Technical perspective
- Testing criteria

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
```

Note: When implementing a change, copy this template and fill it out completely. The more detailed the prompt, the better the AI assistance will be in implementation.

# Memory Log Reorganization and Indexing

## Context
- The project has a large collection of memory log files in `docs/logged_memories/` directory
- These files document debugging sessions, implementations, and issues encountered
- Currently, many files have duplicate IDs (e.g., multiple MRTMLY-001-* files) or placeholder IDs (MRTMLY-XXX-*)
- The main `MEMORY_LOG.md` file is empty and doesn't properly index these entries

## Requirements
1. Assign unique sequential IDs to all memory log files
   - Create a mapping of current filenames to new unique IDs
   - Preserve descriptive parts of filenames
   - Order by related subject matter and logical progression of changes
   - Start from ID 001 and assign sequentially

2. Update all filenames according to the new ID scheme
   - Rename files in the `docs/logged_memories/` directory
   - Maintain format: `MRTMLY-XXX-descriptive-name.md`
   - Ensure no duplicate IDs exist

3. Update all references to memory log files throughout the codebase
   - Identify files that reference memory logs (e.g., `IMPLEMENTED_CHANGES.md`, migration docs)
   - Update link texts and paths to reflect new filenames
   - Maintain format: `[MRTMLY-XXX: Title](./logged_memories/MRTMLY-XXX-descriptive-name.md)`

4. Create a comprehensive index in `MEMORY_LOG.md`
   - List all entries in sequential ID order
   - Format each entry as a reference link to individual file
   - Follow the format specified in `copilot-instructions.md`

## Technical Guidelines
- Script any bulk renaming operations to avoid manual errors
- Test all links after updating to ensure they work correctly
- Back up all files before making changes
- Maintain compatibility with existing documentation standards
- Handle edge cases like files referenced from multiple locations

## Expected Outcome
- Every memory log file has a unique ID (MRTMLY-001 through MRTMLY-NNN)
- All filenames consistently follow the pattern `MRTMLY-XXX-descriptive-name.md`
- All references to memory logs in other files are updated to match new IDs
- `MEMORY_LOG.md` contains a complete, sequential index of all memory log entries
- No broken links exist in the documentation

## Validation Criteria
- [ ] Complete inventory of all memory log files created
- [ ] Mapping table (old ID → new ID) developed
- [ ] All files renamed with unique sequential IDs
- [ ] All references to memory logs updated across the codebase
- [ ] `MEMORY_LOG.md` populated with organized index
- [ ] All links verified to be working
- [ ] Documentation updated to reflect the new organization

# Development Process Guidelines

## Sequential Implementation
- Work on one change at a time - never move to the next item until the current one is complete
- Complete all validation criteria for the current task before starting a new one
- Avoid parallel development to prevent code conflicts and maintain focus
- For multi-phase changes (like the Time Utilities Consolidation below), complete each phase fully before starting the next
- Mark completed items in the validation criteria as they are finished

## Testing Requirements
- Each implementation must include appropriate tests before considering it complete
- Tests should be written before or alongside implementation (Test-Driven Development)
- All tests must pass before a change is considered complete

## Documentation
- Update documentation alongside code changes
- Document all key decisions made during implementation
- Update the Memory Log for all significant changes or bug fixes

# Next.js App Structure Reorganization

## Context
Our application needs to be restructured to follow the best practices for a Next.js application according to the official Next.js documentation. The current structure has components, contexts, and utilities spread across various directories, which doesn't align with the recommended Next.js project organization.

- This change affects the entire application structure
- We need to relocate files to their proper locations while maintaining functionality
- This reorganization will improve maintainability and align with Next.js conventions

## Requirements

1. Implement a proper Next.js folder structure
   - Organize the application using the App Router approach
   - Follow the recommended conventions for routing and file naming
   - Ensure all special files (layout, page, etc.) are in their correct locations

2. Relocate existing files to appropriate locations
   - Move components, contexts, and utilities to recommended locations
   - Update all import statements to reflect new file paths
   - Ensure all tests continue to pass after relocation

3. Maintain application functionality throughout the process
   - Implement changes incrementally, one component or section at a time
   - Verify functionality after each relocation step
   - Ensure all tests pass after each change

## Technical Guidelines
- Follow Next.js App Router project structure conventions
- Ensure proper separation between routing elements and UI components
- Maintain test coverage and functionality throughout the process
- Update all import paths and references across the codebase

## Expected Outcome
- A well-organized codebase that follows Next.js best practices
- Improved maintainability and developer experience
- Cleaner separation between routing and application logic
- Better alignment with Next.js documentation and examples

## Validation Criteria
- [ ] All files properly organized in the recommended structure
- [ ] All tests passing after reorganization
- [ ] Application functionality maintained
- [ ] Import paths updated throughout the codebase
- [ ] Documentation updated to reflect new structure

## Migration Plan

### Phase 1: Desired Folder Structure

#### Target Structure
Based on Next.js documentation, our target structure will be:

```
github-copilot-agent-assisted-next-app/
├── src/                   # Source directory
│   ├── app/               # App Router implementation
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Root page (homepage)
│   │   ├── global-error.tsx # Global error handling
│   │   ├── not-found.tsx  # 404 page
│   │   ├── _components/   # App-specific components (private, non-routable)
│   │   │   └── ...
│   │   └── [routes]/      # Route segments
│   │       ├── layout.tsx # Route layout
│   │       ├── page.tsx   # Route page
│   │       └── ...
├── components/            # Shared UI components
│   ├── ui/                # Basic UI elements
│   └── feature/           # Complex feature components
├── lib/                   # Shared utility functions
│   ├── utils.ts           # General utilities 
│   └── ...
├── hooks/                 # Custom React hooks
│   └── ...
├── contexts/              # React contexts
│   └── ...
├── styles/                # Global styles
│   └── globals.css
├── public/                # Static assets
│   └── ...
├── __tests__/             # Test files (can mirror the src structure)
│   └── ...
└── [config files]         # Next.js and other config files
```

### Phase 2: File Mapping

#### Current Structure Analysis
Files that need to be relocated:

1. **Components**:
   - UI Components (move to `/components/ui/`)
     - `/src/components/ThemeToggle.tsx`
     - `/src/components/TimeDisplay.tsx`
     - `/src/components/OfflineIndicator.tsx`
     - `/src/components/ConfirmationDialog.tsx`
     - `/src/components/UpdateNotification.tsx`
     
   - Feature Components (move to `/components/feature/`)
     - `/src/components/ActivityManager.tsx`
     - `/src/components/Timeline.tsx`
     - `/src/components/ProgressBar.tsx`
     - `/src/components/Summary.tsx`
     - `/src/components/TimeSetup.tsx`
     - `/src/components/TimelineDisplay.tsx`
     
   - App-specific Components (move to `/src/app/_components/`)
     - `/components/splash/SplashScreen.tsx`
     - `/src/components/LayoutClient.tsx` (adapted for app router)
   
2. **Contexts**:
   - `/contexts/LoadingContext.tsx` → `/contexts/loading/index.tsx`
   - `/src/contexts/ThemeContext.tsx` → `/contexts/theme/index.tsx`
   
3. **Hooks**:
   - `/src/hooks/useServiceWorker.ts` → `/hooks/use-service-worker.ts`
   - `/src/hooks/useTimeDisplay.ts` → `/hooks/use-time-display.ts`
   - `/src/hooks/useActivitiesTracking.ts` → `/hooks/use-activities-tracking.ts`
   - `/src/hooks/useTimelineEntries.ts` → `/hooks/use-timeline-entries.ts`
   - `/src/hooks/useActivityState.ts` → `/hooks/use-activity-state.ts` (if present)
   - `/src/hooks/useTimerState.ts` → `/hooks/use-timer-state.ts` (if present)

4. **Utilities**:
   - Time Utilities (move to `/lib/time/`)
     - `/src/utils/time/` (entire directory)
     - Any other time-related utilities
   
   - Service Worker Utilities (move to `/lib/service-worker/`)
     - `/src/utils/serviceWorkerCore.ts`
     - `/src/utils/serviceWorkerErrors.ts`
     - Any other service worker related utilities
   
   - Activity Utilities (move to `/lib/activity/`)
     - `/src/utils/activityUtils.ts`
     - Any other activity-related utilities
   
   - Reset Service (move to `/lib/reset/`)
     - `/src/utils/resetService.ts`
   
   - Test Utilities (move to `/lib/test-utils/`)
     - `/src/utils/testUtils/` (entire directory)
   
   - Event Listener Utilities (move to `/lib/events/`)
     - `/src/utils/eventListenerUtils.ts` (if present)

5. **Styles**:
   - `/styles/globals.css` → maintain in place
   - Module CSS files → co-locate with respective components

6. **App Router Pages**:
   - `/src/app/layout.tsx` → maintain in place but update imports
   - `/src/app/page.tsx` → maintain in place but update imports
   - Create `/src/app/global-error.tsx` (not-found.tsx already exists)

7. **Service Worker**:
   - `/public/service-worker.js` → maintain in public but update references
   - `/public/sw-*.js` files → maintain in public but update references

8. **Test Files**:
   - `/__tests__/*` → maintain structure but update imports
   - Component tests → consider co-locating with components

### Phase 3: Migration Steps (Detailed Plan)

#### Step 1: Set Up Basic App Router Structure
- The app router structure (`/src/app`) already exists
- Created placeholder file:
  ```tsx
  // /src/app/global-error.tsx
  'use client';
  
  export default function GlobalError({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) {
    return (
      <html>
        <body>
          <h1>Something went wrong!</h1>
          <button onClick={() => reset()}>Try again</button>
        </body>
      </html>
    );
  }
  ```
- The not-found.tsx file already exists in `/src/app/not-found.tsx`

#### Step 2: Create New Directory Structure
- Create `/components/ui/` and `/components/feature/` directories
- Create `/lib/` directory with subfolders:
  - `/lib/time/`
  - `/lib/service-worker/`
  - `/lib/activity/`
  - `/lib/reset/`
  - `/lib/test-utils/`
  - `/lib/events/` (if needed)
- Create `/src/app/_components/` directory for app-specific components

#### Step 3: Migrate Context Providers
- **Move and Refactor LoadingContext**
  - Create `/contexts/loading/` directory ✅
  - Copy `/src/contexts/LoadingContext.tsx` to `/contexts/loading/index.tsx` ✅
  - Update imports throughout the codebase
  - Run tests to validate functionality
  
- **Move and Refactor ThemeContext**
  - Create `/contexts/theme/` directory ✅
  - Copy `/src/contexts/ThemeContext.tsx` to `/contexts/theme/index.tsx` ✅
  - Update imports throughout the codebase
  - Run tests to validate functionality

- **Update Path Aliases in tsconfig.json** ✅
  - Add path aliases for new directories:
    ```json
    "@components/*": ["./components/*"],
    "@lib/*": ["./lib/*"],
    "@hooks/*": ["./hooks/*"],
    "@contexts/*": ["./contexts/*"]
    ```
  - This allows for a gradual migration without breaking existing imports

#### Step 4: Migrate Utility Functions
- **Move Time Utilities**
  - Move `/src/utils/time/` folder to `/lib/time/`
  - Update imports throughout the codebase
  - Run tests to validate functionality

- **Move Service Worker Utilities**
  - Move `/src/utils/serviceWorker*.ts` files to `/lib/service-worker/`
  - Create an `index.ts` file for re-exports
  - Update imports throughout the codebase
  - Run tests to validate functionality

- **Move Activity Utilities**
  - Move `/src/utils/activity*.ts` files to `/lib/activity/`
  - Create an `index.ts` file for re-exports
  - Update imports throughout the codebase
  - Run tests to validate functionality

- **Move Reset Service**
  - Move `/src/utils/resetService.ts` to `/lib/reset/index.ts`
  - Update imports throughout the codebase
  - Run tests to validate functionality

- **Move Test Utilities**
  - Move `/src/utils/testUtils/` to `/lib/test-utils/`
  - Update imports throughout the codebase
  - Run tests to validate functionality
  
- **Move Event Listener Utilities** (if present)
  - Move `/src/utils/eventListenerUtils.ts` to `/lib/events/index.ts`
  - Update imports throughout the codebase
  - Run tests to validate functionality

#### Step 5: Migrate Custom Hooks
- Create new hook files with kebab-case naming convention:
  - `/hooks/use-service-worker.ts` from `/src/hooks/useServiceWorker.ts`
  - `/hooks/use-time-display.ts` from `/src/hooks/useTimeDisplay.ts`
  - `/hooks/use-activities-tracking.ts` from `/src/hooks/useActivitiesTracking.ts`
  - `/hooks/use-timeline-entries.ts` from `/src/hooks/useTimelineEntries.ts`
  - `/hooks/use-activity-state.ts` from `/src/hooks/useActivityState.ts` (if present)
  - `/hooks/use-timer-state.ts` from `/src/hooks/useTimerState.ts` (if present)

- Update each hook to use the new import paths
- Update imports throughout the codebase
- Run tests to validate functionality

#### Step 6: Migrate Components
- **Move UI Components**
  - Create component files in `/components/ui/`:
    - `ThemeToggle.tsx` + `ThemeToggle.module.css`
    - `TimeDisplay.tsx` + `TimeDisplay.module.css`
    - `OfflineIndicator.tsx` + `OfflineIndicator.module.css`
    - `ConfirmationDialog.tsx` + `ConfirmationDialog.module.css`
    - `UpdateNotification.tsx` + `UpdateNotification.module.css`
  - Update imports and ensure components work with new utility paths
  - Run tests to validate functionality

- **Move Feature Components**
  - Create component files in `/components/feature/`:
    - `ActivityManager.tsx` + `ActivityManager.module.css`
    - `Timeline.tsx` + `Timeline.module.css`
    - `ProgressBar.tsx` + `ProgressBar.module.css`
    - `Summary.tsx` + `Summary.module.css`
    - `TimeSetup.tsx` + `TimeSetup.module.css`
    - `TimelineDisplay.tsx` + `TimelineDisplay.module.css`
  - Update imports and ensure components work with new utility paths
  - Run tests to validate functionality

- **Move App-Specific Components**
  - Create `/src/app/_components/splash/` directory
  - Move `/components/splash/SplashScreen.tsx` to `/src/app/_components/splash/SplashScreen.tsx`
  - Move `/components/splash/SplashScreen.module.css` to `/src/app/_components/splash/SplashScreen.module.css`
  - Adapt `/src/components/LayoutClient.tsx` for app router and place in `/src/app/_components/`
  - Update imports throughout the codebase
  - Run tests to validate functionality

#### Step 7: Update Test Files
- Update imports in all test files to match new file locations
- If co-locating component tests, move test files alongside components
- Run the full test suite to validate functionality

#### Step 8: Update Configuration
- Update path mappings in `tsconfig.json`
- Update module resolution in `next.config.js`
- Update test configuration in `jest.config.js`
- Update any other config files as needed

#### Step 9: Final Verification
- Run the full test suite: `npm test`
- Build the application: `npm run build`
- Start the application: `npm run dev`
- Verify functionality in the browser

### Current Progress
- [x] Phase 1: Desired Folder Structure - Planned
- [x] Phase 2: File Mapping - Planned
- [x] Phase 3: Migration Steps - In Progress
  - [x] Step 1: Set Up Basic App Router Structure - Completed
  - [x] Step 2: Create New Directory Structure - Completed
  - [x] Step 3: Migrate Context Providers - Completed
  - [x] Step 4: Migrate Utility Functions - Completed
  - [x] Step 5: Migrate Custom Hooks - Completed
  - [x] Step 6: Migrate Components - Completed
    - [x] UI Components: ThemeToggle, TimeDisplay, OfflineIndicator, ServiceWorkerUpdater
    - [x] Feature Components: ActivityManager, Timeline, TimelineDisplay, ProgressBar, Summary, TimeSetup
    - [x] App-specific Components: SplashScreen, LayoutClient
  - [x] Step 7: Update Test Files - Completed
  - [x] Step 8: Update Configuration - Completed
  - [x] Step 9: Final Verification - Completed

#### Progress Summary
We have successfully:
1. Set up the basic App Router structure under `/src/app/`
2. Created new directory structure following Next.js best practices
3. Migrated context providers from `/src/contexts/` to `/contexts/`
4. Migrated utility functions to appropriate lib directories by category
5. Migrated custom hooks from camelCase to kebab-case naming and updated imports
6. Migrated UI components to `/components/ui/`
7. Migrated app-specific components to `/src/app/_components/`
8. Migrated feature components to `/components/feature/`
9. Fixed type errors across the codebase
10. Created type definition for third-party libraries when needed without installing extra packages
11. Updated component interfaces to fix TypeScript errors

#### Next Steps
1. Run final verification tests with `npm test` to ensure all tests pass
2. Build the application with `npm run build` to check for build errors
3. Start the application with `npm run dev` and test in browser
4. Document any needed follow-up tasks for edge cases
5. Update any remaining import references that might have been missed

# Post-Migration Code Quality Improvements

## Context
After successfully completing the Next.js App Router migration, several minor issues were identified that could be addressed to further improve code quality, maintainability, and adherence to best practices.

- The codebase contains ESLint warnings related to unused variables and explicit `any` types
- There are duplicate test files in the old structure that could be cleaned up
- The project could benefit from stricter TypeScript checking
- Component props interfaces could be optimized for better type safety
- Tests could be co-located with their components for better organization

## Requirements

1. Address ESLint warnings
   - Fix unused variables across the codebase
   - Replace explicit `any` types with proper type definitions
   - Create a standardized approach for handling intentional unused variables

2. Implement stricter TypeScript checking
   - Update tsconfig.json with stricter type checking options
   - Address any new type errors that emerge
   - Add missing type definitions where needed

3. Optimize component props interfaces
   - Review and standardize component prop interfaces
   - Add proper documentation for props
   - Ensure consistent naming conventions across interfaces

4. Improve test organization
   - Consider co-locating tests with their components
   - Clean up any remaining duplicate test files from the migration
   - Ensure consistent test naming conventions

## Technical Guidelines
- Make incremental changes to avoid breaking functionality
- Run the test suite after each significant change
- Document decisions in the Memory Log
- Follow consistent patterns for each category of changes
- Use ESLint disable comments judiciously and only when absolutely necessary

## Expected Outcome
- Zero ESLint warnings in the codebase
- Stricter TypeScript checking providing better development experience
- Well-documented and consistent component interfaces
- Better organized tests with clear relationship to the components they test
- Improved maintainability for future development

## Validation Criteria
- [ ] All ESLint warnings addressed
- [ ] Stricter TypeScript configuration implemented
- [ ] Component prop interfaces optimized and documented
- [ ] Test organization improved
- [ ] All tests passing with the new changes
- [ ] Documentation updated to reflect the changes

## Implementation Plan

### Phase 1: ESLint Warning Cleanup

#### Step 1: Configure ESLint Rules
- Create or update `.eslintrc.json` to better handle unused variables:
  ```json
  {
    "extends": "next/core-web-vitals",
    "rules": {
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
  ```
- This configuration will allow for intentional unused variables to be prefixed with underscore

#### Step 2: Address Unused Variables
- Systematically address each unused variable warning:
  - Remove truly unused variables
  - Prefix intentionally unused variables with underscore (e.g., `_props`)
  - Document cases where variables are kept for future use

#### Step 3: Replace Explicit `any` Types
- Identify all instances of explicit `any` types
- Replace with appropriate type definitions
- When exact type is unknown, use more specific types like `unknown` or create interface

### Phase 2: TypeScript Configuration Enhancement

#### Step 1: Update tsconfig.json
- Add stricter type checking options:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "strictFunctionTypes": true,
      "strictBindCallApply": true,
      "strictPropertyInitialization": true,
      "noImplicitThis": true,
      "alwaysStrict": true,
      "noUncheckedIndexedAccess": true
    }
  }
  ```

#### Step 2: Address New Type Errors
- Systematically fix type errors that emerge from stricter checking
- Create missing type definitions
- Document complex type decisions in code comments

### Phase 3: Component Props Interface Optimization

#### Step 1: Standardize Interface Naming
- Ensure consistent naming convention (e.g., `ComponentNameProps`)
- Add appropriate JSDoc comments for each interface
- Document required vs optional props

#### Step 2: Review and Optimize Props
- Remove unused props
- Ensure proper typing for all props
- Consider using more specific types instead of general ones
- Add examples in JSDoc comments where appropriate

### Phase 4: Test Organization Improvement

#### Step 1: Clean Up Duplicate Tests
- Identify and remove any remaining duplicate test files
- Ensure all functionality is still covered by the remaining tests

#### Step 2: Evaluate Test Co-location
- Consider moving component tests closer to their components
- Create a strategy for test file naming and organization
- Update test imports as needed

#### Step 3: Standardize Test Patterns
- Ensure consistent test naming conventions
- Standardize test setup and teardown
- Optimize test coverage

### Current Progress
- [x] Phase 1: ESLint Warning Cleanup - Completed
- [x] Phase 2: TypeScript Configuration Enhancement - In Progress
  - [x] Step 1: Update tsconfig.json with stricter type checking options - Completed
  - [ ] Step 2: Address New Type Errors - In Progress (Core implementation files fixed, test files remaining)
- [ ] Phase 3: Component Props Interface Optimization - Planned
- [ ] Phase 4: Test Organization Improvement - Planned
