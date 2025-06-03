# Planned Changes

## Next.js Project Structure Reorganization

### Context
The current project structure doesn't follow Next.js 13+ App Router best practices. We have duplicate code directories in both the root and `src/` folder, which creates confusion and maintenance issues. The project currently has:

- Duplicate components in `/components` and `/src/components`  
- Duplicate hooks in `/hooks` and `/src/hooks`
- Duplicate contexts in `/contexts` and `/src/contexts`
- Some utilities and libraries outside the `src` folder
- Inconsistent import path usage across the codebase

This restructuring will follow Next.js official recommendations to use the `src` folder to separate application code from project configuration files, consolidating all application code under `src/` while keeping only configuration files at the root level.

### Requirements

#### Phase 1: Analysis and Preparation
1. **Audit current file duplication and differences**
   - Compare files between top-level and `src/` directories
   - Identify which version of each file is the canonical/most up-to-date
   - Document any differences that need to be reconciled
   - Map all import dependencies to understand impact

2. **Create file movement plan**
   - Determine which files to keep from duplicated sets
   - Plan the consolidation of all application code under `src/`
   - Design new directory structure following Next.js best practices

#### Phase 2: Directory Structure Reorganization
1. **Consolidate application code under `src/`**
   - Move all application files to appropriate locations within `src/`
   - Remove duplicate directories from root level
   - Ensure all files follow the new structure:
     ```
     src/
     ├── app/                 # Next.js App Router files
     ├── components/          # All React components (consolidated)
     ├── hooks/              # All custom hooks (consolidated)  
     ├── contexts/           # All React contexts (consolidated)
     ├── lib/                # Library code and utilities
     ├── types/              # TypeScript type definitions
     ├── utils/              # Utility functions
     └── styles/             # Component-specific styles
     ```

2. **Keep only configuration at root level**
   - Maintain config files: `next.config.js`, `package.json`, `tsconfig.json`, etc.
   - Keep `public/` for static assets
   - Keep `docs/` for documentation
   - Move any remaining application code to appropriate `src/` subdirectories

#### Phase 3: Import Path Updates
1. **Update TypeScript path aliases**
   - Modify `tsconfig.json` to reflect new structure
   - Ensure all path aliases point to `src/` subdirectories
   - Remove aliases pointing to root-level directories

2. **Update all import statements**
   - Update relative imports that break due to file moves
   - Update absolute imports using path aliases
   - Ensure consistency in import style across codebase

#### Phase 4: Test and Build Configuration Updates
1. **Update test configurations**
   - Modify Jest configuration for new file locations
   - Update test file imports and paths
   - Update Cypress configuration if needed

2. **Update build and development configurations**
   - Verify Next.js configuration works with new structure
   - Update any scripts that reference specific file paths
   - Update ESLint configuration for new structure

### Technical Guidelines

#### File Consolidation Strategy
- **Components**: Use files from `src/components` as canonical, compare with `/components` for any missing features
- **Hooks**: Use files from `src/hooks` as canonical, verify naming consistency (useXXX vs use-xxx)
- **Contexts**: Use files from `src/contexts` as canonical
- **Libraries**: Move all from `/lib` to `src/lib`
- **Types**: Keep in `src/types`
- **Utils**: Move any root-level utils to `src/utils`

#### Import Path Strategy
- Use path aliases consistently: `@/` for src root, `@/components/*`, etc.
- Prefer absolute imports over relative imports for better maintainability
- Remove any imports pointing to duplicate locations

#### Testing Strategy
- Run full test suite after each phase to catch breaking changes
- Update test imports as files are moved
- Verify all path aliases work in test environment

### Expected Outcome

#### User Perspective
- No visible changes to application functionality
- All features continue to work exactly as before
- No performance impact or behavioral changes

#### Technical Perspective
- Clean, consistent project structure following Next.js best practices
- Single source of truth for all application files
- Improved developer experience with logical file organization
- Easier maintenance and onboarding for new developers
- Consistent import patterns throughout codebase

#### Code Quality
- Elimination of duplicate files and code
- Consistent naming conventions
- Clear separation between application code and configuration
- Improved IDE navigation and IntelliSense

### Validation Criteria
- [ ] All duplicate directories removed from root level
- [ ] All application code consolidated under `src/`
- [ ] All imports updated and working correctly
- [ ] TypeScript compilation successful with no errors
- [ ] All tests passing after import updates
- [ ] ESLint checks passing
- [ ] Next.js development and build processes working
- [ ] No functionality regressions
- [ ] All path aliases working correctly
- [ ] Documentation updated to reflect new structure

## Detailed Implementation Plan

### Current Project State Analysis

Based on analysis of the current project structure, the following duplications and inconsistencies exist:

#### Components Duplication
**Root-level `/components/`:**
- `/components/feature/` contains: ActivityForm, ActivityManager, ProgressBar, Summary, TimeSetup, Timeline, TimelineDisplay
- `/components/splash/` and `/components/ui/` subdirectories

**`/src/components/`:**
- Direct placement: ActivityButton, ActivityForm, ActivityManager, ConfirmationDialog, LayoutClient, OfflineIndicator, ProgressBar, ServiceWorkerUpdater, Summary, ThemeToggle, TimeDisplay, TimeSetup, Timeline, TimelineDisplay, UpdateNotification
- `/src/components/splash/` subdirectory
- Test files in `/src/components/__tests__/`

#### Hooks Duplication
**Root-level `/hooks/`:**
- Kebab-case naming: `use-activities-tracking.ts`, `use-activity-state.ts`, `use-online-status.ts`, `use-service-worker.ts`, `use-time-display.ts`, `use-timeline-entries.ts`, `use-timer-state.ts`

**`/src/hooks/`:**
- CamelCase naming: `useActivitiesTracking.ts`, `useActivityState.ts`, `useOnlineStatus.ts`, `useServiceWorker.ts`, `useTimeDisplay.ts`, `useTimelineEntries.ts`, `useTimerState.ts`
- Test files in `/src/hooks/__tests__/`

#### Contexts Duplication  
**Root-level `/contexts/`:**
- `LoadingContext.tsx`
- Subdirectories: `/contexts/loading/`, `/contexts/theme/`

**`/src/contexts/`:**
- `LoadingContext.tsx`

#### Other Directories to Consolidate
- `/lib/` → move to `/src/lib/`
- `/styles/` → move to `/src/styles/` (app-specific styles)
- `/types/` → move to `/src/types/`

#### Current Path Alias Configuration Issues
The `tsconfig.json` currently has conflicting path aliases:
```jsonc
"@/*": ["./src/*"],
"@components/*": ["./components/*"],  // Points to root, should point to src
"@lib/*": ["./lib/*"],               // Points to root, should point to src  
"@hooks/*": ["./hooks/*"],           // Points to root, should point to src
"@contexts/*": ["./contexts/*"]      // Points to root, should point to src
```

### Step-by-Step Implementation Plan

#### Step 1: Pre-Migration Backup and Analysis (15 minutes)
1. **Create backup branch**
   ```bash
   git checkout -b restructure-app-backup
   git push origin restructure-app-backup
   git checkout -b feature/nextjs-structure-reorganization
   ```

2. **Audit file differences**
   - Compare component files between `/components/feature/` and `/src/components/`
   - Compare hook files between `/hooks/` and `/src/hooks/`
   - Compare context files between `/contexts/` and `/src/contexts/`
   - Document any unique functionality that must be preserved

3. **Map import dependencies**
   - Search for all imports using old path aliases (`@components/*`, `@lib/*`, etc.)
   - Identify files importing from root-level directories
   - Create comprehensive list of files that need import updates

#### Step 2: Components Consolidation (30 minutes)
1. **Analyze component differences**
   - Compare `/components/feature/ActivityForm.tsx` with `/src/components/ActivityForm.tsx`
   - Compare other duplicate components to identify canonical versions
   - `/src/components/` appears to be more comprehensive and up-to-date

2. **Consolidate components**
   - Keep all files from `/src/components/` as they appear more complete
   - Review `/components/` for any unique features not in `/src/components/`
   - Move any unique components from `/components/` to `/src/components/`
   - Organize components into logical subdirectories:
     ```
     src/components/
     ├── feature/           # Feature-specific components
     ├── ui/               # Reusable UI components  
     ├── splash/           # Splash screen components
     └── layout/           # Layout-related components
     ```

3. **Remove root-level components directory**
   ```bash
   rm -rf /components
   ```

#### Step 3: Hooks Consolidation (20 minutes)
1. **Standardize hook naming**
   - `/src/hooks/` uses correct camelCase naming (useActivityState.ts)
   - `/hooks/` uses incorrect kebab-case naming (use-activity-state.ts)
   - Keep `/src/hooks/` versions as canonical

2. **Verify hook functionality**
   - Compare hook implementations to ensure no functionality is lost
   - `/src/hooks/` appears to be the actively maintained versions

3. **Remove root-level hooks directory**
   ```bash
   rm -rf /hooks
   ```

#### Step 4: Contexts Consolidation (15 minutes)
1. **Consolidate context files**
   - Compare `/contexts/LoadingContext.tsx` with `/src/contexts/LoadingContext.tsx`
   - Move any additional contexts from `/contexts/loading/` and `/contexts/theme/` to `/src/contexts/`
   - Organize contexts logically under `/src/contexts/`

2. **Remove root-level contexts directory**
   ```bash
   rm -rf /contexts
   ```

#### Step 5: Move Remaining Directories (15 minutes)
1. **Move library code**
   ```bash
   mv /lib /src/lib
   ```

2. **Move types**
   ```bash
   mv /types /src/types
   ```

3. **Handle styles directory**
   - Keep root-level `/styles/globals.css` for global styles (Next.js convention)
   - Move component-specific styles to `/src/styles/` if any exist
   - Update import paths in layout files

#### Step 6: Update TypeScript Configuration (10 minutes)
1. **Update `tsconfig.json` path aliases**
   ```jsonc
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"],
         "@/components/*": ["./src/components/*"],
         "@/lib/*": ["./src/lib/*"],
         "@/hooks/*": ["./src/hooks/*"],
         "@/contexts/*": ["./src/contexts/*"],
         "@/types/*": ["./src/types/*"],
         "@/utils/*": ["./src/utils/*"]
       }
     }
   }
   ```

2. **Remove old path aliases**
   - Remove `@components/*`, `@lib/*`, `@hooks/*`, `@contexts/*` that point to root

#### Step 7: Update Import Statements (45 minutes)
1. **Update imports to use @/ prefix consistently**
   - Search and replace `@components/` → `@/components/`
   - Search and replace `@lib/` → `@/lib/`
   - Search and replace `@hooks/` → `@/hooks/`
   - Search and replace `@contexts/` → `@/contexts/`

2. **Update relative imports that break due to file moves**
   - Search for relative imports that span the src boundary
   - Convert to absolute imports using @/ aliases where appropriate

3. **Update import paths in key files**
   - Update imports in `/src/app/layout.tsx`
   - Update imports in `/src/app/page.tsx`
   - Update imports in all component files
   - Update imports in all test files

#### Step 8: Update Configuration Files (20 minutes)
1. **Update Jest configuration (`jest.config.js`)**
   - Update module name mappings to reflect new paths
   - Ensure test file patterns match new structure
   ```javascript
   moduleNameMapper: {
     '^@/(.*)$': '<rootDir>/src/$1',
     '^@/components/(.*)$': '<rootDir>/src/components/$1',
     '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
     // ... other mappings
   }
   ```

2. **Update ESLint configuration**
   - Update any path-specific rules
   - Ensure import resolver works with new structure

3. **Update any package.json scripts**
   - Check for scripts that reference specific file paths
   - Update paths to use new structure

#### Step 9: Testing and Validation (30 minutes)
1. **TypeScript compilation check**
   ```bash
   npm run type-check
   npx tsc --noEmit
   ```

2. **Run test suite**
   ```bash
   npm test
   ```

3. **Test development server**
   ```bash
   npm run dev
   ```

4. **Test production build**
   ```bash
   npm run build
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

6. **Manual functionality verification**
   - Load application in browser
   - Test all major features to ensure nothing is broken
   - Verify all components render correctly
   - Test navigation and interactions

#### Step 10: Documentation and Cleanup (15 minutes)
1. **Update README.md**
   - Update any references to old directory structure
   - Ensure development setup instructions are current

2. **Create memory log entry**
   - Document the changes made
   - Note any issues encountered and resolved
   - Include lessons learned for future reference

3. **Final verification**
   - Ensure no duplicate directories remain at root level
   - Verify all imports are working
   - Confirm application functionality is unchanged

### Post-Implementation Validation

#### Automated Checks
- [ ] TypeScript compilation succeeds with zero errors
- [ ] All tests pass (unit, integration, e2e)
- [ ] ESLint checks pass with no errors
- [ ] Next.js development server starts successfully
- [ ] Production build completes successfully
- [ ] No console errors in browser developer tools

#### Manual Checks  
- [ ] Application loads correctly in browser
- [ ] All page routes work as expected
- [ ] Component functionality unchanged
- [ ] Theme switching works correctly
- [ ] Progressive Web App features work
- [ ] Service worker functionality intact
- [ ] Offline capabilities work as before

#### Code Quality Checks
- [ ] No more duplicate directories at root level
- [ ] All imports use consistent @/ path aliases
- [ ] Project structure follows Next.js best practices
- [ ] IDE IntelliSense works correctly with new paths
- [ ] Hot module replacement works during development

### Risk Mitigation Strategies

#### Before Starting
- Create backup branch for quick rollback
- Document current working state
- Ensure clean git working tree

#### During Implementation  
- Test after each major step
- Use TypeScript compiler to catch import errors early
- Keep incremental commits for easy rollback

#### If Issues Arise
- **Build failures**: Check TypeScript path mappings first
- **Import errors**: Verify file moved to expected location
- **Test failures**: Update test imports and Jest configuration
- **Runtime errors**: Check for missing files or wrong imports

#### Emergency Rollback Plan
```bash
git reset --hard HEAD~X  # Where X is number of commits to rollback
# Or
git checkout restructure-app-backup
git branch -D feature/nextjs-structure-reorganization
```

### Timeline Estimate
- **Total estimated time**: 3-4 hours
- **Step 1 (Backup/Analysis)**: 15 minutes
- **Step 2 (Components)**: 30 minutes  
- **Step 3 (Hooks)**: 20 minutes
- **Step 4 (Contexts)**: 15 minutes
- **Step 5 (Other directories)**: 15 minutes
- **Step 6 (TypeScript config)**: 10 minutes
- **Step 7 (Import updates)**: 45 minutes
- **Step 8 (Config files)**: 20 minutes
- **Step 9 (Testing)**: 30 minutes
- **Step 10 (Documentation)**: 15 minutes

This plan prioritizes safety and verification at each step to ensure no functionality is lost during the restructuring process.
