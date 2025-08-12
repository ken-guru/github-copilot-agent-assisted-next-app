# Technology Stack

## Core Framework & Runtime

- **Next.js 15.4.5**: React framework with App Router (default)
- **React 19.1.1**: UI library with React DOM
- **TypeScript 5**: Strict mode enabled with comprehensive type checking
- **Node.js**: Latest LTS required

## UI & Styling

- **Bootstrap 5.3.7**: CSS framework for responsive design
- **React Bootstrap 2.10.10**: React components for Bootstrap
- **Bootstrap Icons 1.13.1**: Icon library
- **CSS Variables**: HSL-based theme system for Light/Dark modes
- **CSS Modules**: Component-scoped styling

## Testing Framework

- **Jest 30.0.5**: Unit and integration testing
- **React Testing Library 16.3.0**: Component testing utilities
- **Cypress 14.5.4**: End-to-end testing
- **@testing-library/jest-dom**: Custom Jest matchers

## Development Tools

- **ESLint 9**: Code linting with Next.js and TypeScript configs
- **TypeScript Compiler**: Strict type checking
- **Husky**: Git hooks (configured)

## PWA & Service Worker

- **Custom Service Worker**: Offline caching and update notifications
- **Web App Manifest**: PWA configuration
- **Cache Strategies**: Network-first with fallback patterns

## Common Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build with service worker versioning
npm start            # Start production server
```

### Testing
```bash
npm test             # Run Jest tests (~15 seconds, 135+ tests)
npm run test:watch   # Jest in watch mode
npm run cypress      # Open Cypress Test Runner (~60 seconds, 16 tests)
npm run cypress:run  # Run Cypress headless
```

### Code Quality
```bash
npm run lint         # ESLint checking
npm run type-check   # TypeScript compilation check (both main and test configs)
```

### Build Tools
```bash
npm run clean-build       # Clean build artifacts
npm run clean-build:full  # Full clean including node_modules
npm run update-sw-version # Update service worker version
```

## Build Configuration

- **Webpack Aliases**: `@/*` maps to `src/*`
- **Module Resolution**: Node.js style with path aliases
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- **Service Worker Headers**: Proper caching and security policies
- **PWA Manifest**: Cached with revalidation strategy

## TypeScript Configuration

- **Strict Mode**: All strict flags enabled
- **Target**: ES2015 with DOM libraries
- **Module System**: ESNext with Node resolution
- **Path Mapping**: `@/*` for src directory imports
- **Separate Configs**: Main app and test files have separate tsconfig files