# Mr. Timely Monorepo

A monorepo for Mr. Timely activity tracking application with web (Next.js) and mobile (React Native/Expo) apps sharing common business logic.

## Structure

```
mr-timely-monorepo/
├── apps/
│   ├── web/              # Next.js 15 web application (root directory)
│   └── mobile/           # React Native Expo mobile app
├── packages/
│   ├── types/            # Shared TypeScript types and interfaces
│   └── shared/           # Shared business logic (state machine, calculations)
├── package.json          # Workspace configuration
└── README.monorepo.md    # This file
```

## Technology Stack

### Web App (Next.js)
- Next.js 15
- React 19
- Bootstrap 5
- TypeScript
- Jest & Cypress for testing

### Mobile App (React Native)
- React Native 0.74.5
- Expo SDK 51
- Expo Router
- TypeScript

### Shared Packages
- **@mr-timely/types**: Common TypeScript interfaces
  - Activity types and state definitions
  - Timeline entry interfaces
  - Color set types
  
- **@mr-timely/shared**: Business logic
  - Activity state machine (PENDING → RUNNING → COMPLETED/REMOVED)
  - Timeline calculations
  - Duration formatting utilities

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install all dependencies (web, mobile, and packages)
npm install
```

This will install dependencies for all workspace packages.

### Development

#### Run Web App
```bash
npm run web
# or
npm run dev
```

#### Run Mobile App
```bash
npm run mobile
# or
cd apps/mobile && npm start
```

#### Build Mobile App
```bash
npm run build:mobile
```

## Workspace Commands

### Testing
```bash
# Run web app tests
npm test

# Run with watch mode
npm run test:watch

# Run Cypress tests
npm run cypress
```

### Type Checking
```bash
# Check all packages and apps
npm run type-check

# Check individual package
cd packages/types && npm run type-check
cd packages/shared && npm run type-check
```

### Linting
```bash
npm run lint
```

### Building
```bash
# Build web app
npm run build

# Build mobile app
cd apps/mobile && npx eas build
```

## Shared Code Architecture

### Activity State Machine
The core business logic is implemented in `@mr-timely/shared/activityStateMachine`:

```typescript
import { ActivityStateMachine } from '@mr-timely/shared';

const machine = new ActivityStateMachine();
machine.addActivity('activity-1');
machine.startActivity('activity-1');
machine.completeActivity('activity-1');
```

Valid state transitions:
- PENDING → RUNNING → COMPLETED
- PENDING → RUNNING → REMOVED
- PENDING → REMOVED

### Type Definitions
Shared types from `@mr-timely/types`:

```typescript
import type { Activity, ActivityState, ColorSet } from '@mr-timely/types';
```

### Timeline Calculations
Utility functions from `@mr-timely/shared`:

```typescript
import { calculateProgress, formatDuration, formatTime } from '@mr-timely/shared';

const progress = calculateProgress(startTime, duration, currentTime);
const formatted = formatDuration(milliseconds); // "2h 30m"
```

## Code Reuse Benefits

### Estimated Code Reuse: 40%
- State machine logic: 100% shared
- Type definitions: 100% shared
- Timeline calculations: 100% shared
- Business logic utilities: 80% shared
- UI components: 0% shared (platform-specific)

### Consistency
- Both apps use the same state machine, ensuring consistent behavior
- Type safety across platforms
- Single source of truth for business rules

## Adding New Shared Code

### 1. Add to types package
```bash
cd packages/types/src
# Create new .ts file with interfaces
```

### 2. Add to shared package
```bash
cd packages/shared/src
# Create new .ts file with logic
# Import from @mr-timely/types as needed
```

### 3. Export from index
```typescript
// packages/shared/src/index.ts
export * from './newModule';
```

### 4. Use in apps
```typescript
// In web or mobile app
import { NewType } from '@mr-timely/types';
import { newFunction } from '@mr-timely/shared';
```

## Package Development Workflow

1. Make changes to packages/types or packages/shared
2. Run type-check: `npm run type-check`
3. Test in web app: `npm run dev`
4. Test in mobile app: `cd apps/mobile && npm start`

## Troubleshooting

### Module resolution issues
If you see "Can't import @mr-timely/*":
1. Check tsconfig.json paths configuration
2. Run `npm install` in root directory
3. Restart your development server

### Metro bundler errors (mobile)
```bash
cd apps/mobile
npx react-native start --reset-cache
```

### Type errors
```bash
# Clean build artifacts
rm -rf node_modules package-lock.json
npm install
```

## CI/CD

Both apps can be built and deployed independently:
- Web app: Vercel/Netlify (Next.js)
- Mobile app: EAS Build & Submit (Expo)

Shared packages are automatically included during build.

## Future Enhancements

- [ ] Add Jest tests for shared packages
- [ ] Set up shared component library (react-native-web)
- [ ] Add shared validation schemas (Zod)
- [ ] Implement shared API client
- [ ] Add end-to-end type safety with tRPC

## License

Private - Not for distribution

## Team

Built with AI assistance (GitHub Copilot + MCP servers)
