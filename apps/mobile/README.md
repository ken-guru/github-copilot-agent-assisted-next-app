# Mr. Timely - React Native Mobile App

React Native mobile app for Mr. Timely activity tracking, built with Expo.

## Tech Stack
- React Native 0.74.5
- Expo SDK 51
- Expo Router for navigation
- TypeScript
- Shared business logic from @mr-timely/shared

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS only) or Android Emulator

### Installation
```bash
# From monorepo root
npm install

# Or from mobile app directory
cd apps/mobile
npm install
```

### Development
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Project Structure
```
apps/mobile/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx    # Tab layout
│       ├── index.tsx      # Timer screen
│       └── activities.tsx # Activities screen
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Theme)
│   ├── hooks/             # Custom hooks
│   └── theme/             # Theme configuration
├── app.json               # Expo configuration
├── index.js               # Entry point
└── package.json
```

## Features
- ✅ Tab navigation with Timer and Activities screens
- ✅ Theme system (Light/Dark/System)
- ✅ Shared business logic from monorepo packages
- ✅ TypeScript support
- 🚧 Activity management (in progress)
- 🚧 Timer functionality (in progress)
- 🚧 Push notifications (planned)
- 🚧 Haptic feedback (planned)

## Shared Packages
The mobile app uses shared packages from the monorepo:
- `@mr-timely/types` - TypeScript interfaces and types
- `@mr-timely/shared` - Business logic (state machine, calculations)

## Building for Production

### Configure EAS
```bash
npx eas build:configure
```

### Build
```bash
# iOS
npx eas build --platform ios

# Android
npx eas build --platform android
```

### Submit to Stores
```bash
# iOS App Store
npx eas submit --platform ios

# Google Play Store
npx eas submit --platform android
```

## Type Checking
```bash
npm run type-check
```
