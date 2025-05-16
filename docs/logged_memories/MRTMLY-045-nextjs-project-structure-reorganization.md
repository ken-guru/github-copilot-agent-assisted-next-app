# Next.js Project Structure Reorganization

## Initial State
The project had a non-standard organization that didn't follow Next.js best practices:
- Components were scattered across various directories
- Contexts and utilities were not properly organized
- The app router structure needed improvement
- Import paths were inconsistent

## Implementation

### Phase 1: Setting Up Directory Structure
I created the directory structure according to Next.js best practices:
- `/src/app/` - App router pages and layouts
- `/src/app/_components/` - App-specific components
- `/components/ui/` - Shared UI components
- `/components/feature/` - Complex feature components
- `/lib/` - Utility functions organized by category
- `/contexts/` - React contexts with index.ts files
- `/hooks/` - Custom React hooks with kebab-case naming

### Phase 2: Migrating Files
I migrated each type of file to its appropriate location:

1. Context providers:
   - Moved `/src/contexts/LoadingContext.tsx` to `/contexts/loading/index.tsx`
   - Moved `/src/contexts/ThemeContext.tsx` to `/contexts/theme/index.tsx`

2. Utility functions:
   - Moved time utilities to `/lib/time/`
   - Moved service worker utilities to `/lib/service-worker/`
   - Moved activity utilities to `/lib/activity/`
   - Moved reset service to `/lib/reset/`
   - Moved event listener utilities to `/lib/events/`

3. Custom hooks:
   - Moved and renamed with kebab-case (e.g., `useServiceWorker.ts` → `use-service-worker.ts`)
   - Updated imports to reference the new locations

4. UI components:
   - Moved ThemeToggle, TimeDisplay, OfflineIndicator, and ServiceWorkerUpdater to `/components/ui/`
   - Created CSS modules alongside the components

5. App-specific components:
   - Moved SplashScreen to `/src/app/_components/splash/`
   - Moved LayoutClient to `/src/app/_components/`

### Phase 3: Configuration Updates
Updated path aliases in tsconfig.json and jest.config.js to support the new structure:
```json
// In tsconfig.json:
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./components/*"],
  "@lib/*": ["./lib/*"],
  "@hooks/*": ["./hooks/*"],
  "@contexts/*": ["./contexts/*"]
}
```

## Resolution
Successfully migrated a significant portion of the codebase to follow Next.js best practices. All moved components and utilities maintain their original functionality but are now organized in a more standard and maintainable way.

## Lessons Learned
1. When reorganizing a project, it's best to move files incrementally and test after each major change
2. Path aliases in tsconfig.json are crucial for making imports cleaner and more maintainable
3. Keeping test files in sync with implementation files is important for maintaining test coverage
4. Following framework conventions improves code maintainability and makes onboarding easier for new developers
