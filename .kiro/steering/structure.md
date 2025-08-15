# Project Structure

## Root Directory Organization

```
├── .kiro/steering/          # AI assistant steering rules
├── src/                     # Main application source code
├── public/                  # Static assets and service worker files
├── docs/                    # Comprehensive project documentation
├── scripts/                 # Build and maintenance scripts
├── cypress/                 # End-to-end test specifications
├── config/                  # Application configuration files
└── styles/                  # Global CSS styles
```

## Source Code Structure (`src/`)

### Core Application (`src/app/`)
- **Next.js App Router**: File-based routing system
- **layout.tsx**: Root layout with theme initialization and PWA setup
- **page.tsx**: Main application entry point with state management
- **globals.css**: App-specific styles using theme variables
- **_components/**: App-specific components (if any)

### Reusable Components (`src/components/`)
- **UI Components**: ActivityButton, ActivityForm, Timeline, ProgressBar
- **Layout Components**: Navigation, OfflineIndicator, ThemeToggle
- **Feature Components**: ActivityManager, Summary, TimeSetup
- **Utility Components**: ConfirmationDialog, UpdateNotification
- **Test Co-location**: `__tests__/` directories alongside components

### Custom Hooks (`src/hooks/`)
- **State Management**: useActivityState, useTimerState, useTimelineEntries
- **UI Hooks**: useThemeReactive, useTimeDisplay, useResponsiveToast
- **System Hooks**: useOnlineStatus, useServiceWorker
- **Test Co-location**: `__tests__/` directories alongside hooks

### Utilities (`src/utils/`)
- **Activity Management**: activity-storage.ts, activityUtils.ts, activityStateMachine.ts
- **Time Utilities**: time.ts, timeUtils.ts, timelineCalculations.ts
- **Service Worker**: serviceWorkerRegistration.ts, serviceWorkerUpdates.ts
- **UI Utilities**: colors.ts, colorNames.ts, eventListenerUtils.ts
- **Test Co-location**: `__tests__/` directories alongside utilities

### Type Definitions (`src/types/`)
- **Core Types**: activity.ts, toast.ts, service-worker.d.ts
- **Test Augmentations**: jest-augmentations.d.ts, jest.d.ts
- **External Types**: uuid.d.ts

### Application Context (`src/contexts/`)
- **Theme Management**: ThemeContext.tsx
- **Loading States**: LoadingContext.tsx
- **Notifications**: ToastContext.tsx
- **Test Co-location**: `__tests__/` directories alongside contexts

## Public Assets (`public/`)

### Service Worker Files
- **service-worker.js**: Main service worker with caching strategies
- **sw-*.js**: Modular service worker components (core, lifecycle, fetch handlers)
- **caching-strategies.js**: Cache strategy implementations

### PWA Assets
- **manifest.json**: Web app manifest for PWA installation
- **icons/**: App icons in various sizes (SVG format)
- **favicon.svg**: Site favicon

## Documentation (`docs/`)

### Core Documentation
- **README.md**: Component documentation index
- **PLANNED_CHANGES.md**: Upcoming feature specifications
- **IMPLEMENTED_CHANGES.md**: Completed change log
- **MEMORY_LOG.md**: AI debugging history and solutions

### Component Documentation (`docs/components/`)
- Individual component documentation following standardized template
- Usage examples, props interfaces, testing strategies

### Development Guides (`docs/dev-guides/`)
- **TIME_UTILITIES_GUIDE.md**: Time utility usage patterns
- **memory-log-workflow.md**: AI debugging workflow
- **test-pyramid-architecture.md**: Testing strategy documentation

### Workflow Documentation (`docs/workflows/`)
- **github-issue-resolution.md**: Systematic issue resolution process
- **testing-procedures.md**: Jest vs Cypress decision matrix
- **code-quality-checklist.md**: Pre-deployment verification

### Memory Logs (`docs/logged_memories/`)
- **MRTMLY-XXX-*.md**: Structured debugging session records
- Searchable knowledge base for recurring issues
- AI-assisted problem resolution history

## Configuration Files

### Build Configuration
- **next.config.js**: Next.js configuration with security headers
- **tsconfig.json**: TypeScript configuration (extends tsconfig.base.json)
- **jest.config.js**: Jest testing configuration with module mapping

### Code Quality
- **eslint.config.mjs**: ESLint configuration for Next.js and TypeScript
- **.prettierrc.json**: Code formatting rules
- **husky.config.js**: Git hooks configuration

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (e.g., `ActivityManager.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useActivityState.ts`)
- **Utilities**: camelCase (e.g., `timeUtils.ts`)
- **Types**: camelCase (e.g., `activity.ts`)
- **CSS Modules**: Component name + `.module.css`

### Import Aliases
- **`@/`**: Maps to `src/` directory
- **Relative imports**: Used for same-directory files
- **Absolute imports**: Used for cross-directory dependencies

## Test Organization

### Test Pyramid Architecture
- **Jest Tests**: Fast unit/integration tests (~135+ tests, ~15 seconds)
- **Cypress Tests**: Focused E2E workflows (~16 tests, ~60 seconds)
- **Co-located Tests**: `__tests__/` directories alongside source code

### Test File Naming
- **Jest**: `*.test.ts`, `*.test.tsx`
- **Cypress**: `*.cy.ts` in `cypress/e2e/`
- **Test Utilities**: Shared in `src/utils/testUtils/`