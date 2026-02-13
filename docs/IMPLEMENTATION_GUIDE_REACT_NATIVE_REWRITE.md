# React Native Mobile App Implementation Guide
## Complete Rewrite Instructions for AI Coding Agents

**Document Version:** 1.0  
**Date:** February 13, 2026  
**Project:** Mr. Timely - React Native Mobile Application  
**Purpose:** Standalone guide for rewriting the application using React Native + Expo

---

## 📋 Overview

This document provides complete, step-by-step instructions for rewriting the Mr. Timely activity tracking application as a native mobile app using React Native and Expo. This creates iOS and Android apps while maintaining the existing Next.js web application.

### What This Implementation Achieves

- ✅ Native iOS app for Apple App Store
- ✅ Native Android app for Google Play Store
- ✅ True native performance and feel
- ✅ Full access to device APIs
- ✅ Smooth animations and gestures
- ✅ Shared business logic with web app (40% code reuse)
- ✅ Independent mobile codebase
- ✅ Professional native user experience

### Architecture Overview

This implementation uses a **monorepo structure** to share code between web and mobile:

```
mr-timely/
├── apps/
│   ├── web/          # Existing Next.js app
│   └── mobile/       # New React Native app (Expo)
├── packages/
│   ├── shared/       # Shared business logic
│   └── types/        # Shared TypeScript types
├── package.json      # Root monorepo config
└── turbo.json        # Turborepo config (optional)
```

### Current Application Context

**Web App Tech Stack:**
- Next.js 16.1.6 (App Router)
- React 19.2.4
- TypeScript 5
- Bootstrap 5.3.8
- ~8,000 lines of code

**Reusable Components:**
- Business logic: Activity state machine, timeline calculations (~1,500 lines - 100% reusable)
- TypeScript types: All interfaces and types (~200 lines - 100% reusable)
- Utilities: Color system, calculations (~300 lines - 100% reusable)
- **Total Reusable:** ~2,000 lines (25%)

**Components to Rewrite:**
- UI components: All 35+ components (~4,500 lines - 0% reusable)
- Requires complete React Native rewrite

### Success Metrics

After implementation:
- [ ] Apps approved in both iOS App Store and Google Play
- [ ] App size < 50MB per platform
- [ ] Crash-free rate > 99%
- [ ] 4+ star rating in both stores
- [ ] Launch time < 2 seconds
- [ ] 60 FPS animations
- [ ] 100+ downloads in first month

---

## 🎯 Implementation Timeline

This implementation is divided into 8 phases to be completed over approximately **8-12 weeks** (480 development hours):

1. **Phase 1: Monorepo Setup** (1 week, 40 hours)
2. **Phase 2: Shared Code Migration** (1 week, 40 hours)
3. **Phase 3: React Native Foundation** (1 week, 40 hours)
4. **Phase 4: Core UI Components** (2 weeks, 80 hours)
5. **Phase 5: Navigation & Routing** (1 week, 40 hours)
6. **Phase 6: State Management & Data** (1 week, 40 hours)
7. **Phase 7: Native Features** (1 week, 40 hours)
8. **Phase 8: Testing & Deployment** (2 weeks, 80 hours)

**Total:** 10 weeks, 400 hours core development + 80 hours testing = **480 hours**

---

## 🏗️ Phase 1: Monorepo Setup (1 week, 40 hours)

### Goal
Set up monorepo structure to share code between web and mobile applications.

### Prerequisites

**Required Software:**
- Node.js 18+ LTS
- npm 9+ or Yarn 4+
- Git
- macOS with Xcode (for iOS development)
- Android Studio (for Android development)
- Expo CLI

**Install Expo CLI:**
```bash
npm install -g expo-cli
npm install -g eas-cli  # Expo Application Services
```

### Implementation Steps

#### Step 1.1: Create Monorepo Structure (4 hours)

```bash
# Navigate to parent directory of current project
cd /path/to/projects

# Create new monorepo
mkdir mr-timely-monorepo
cd mr-timely-monorepo

# Initialize root package.json
npm init -y
```

**File:** `package.json`

```json
{
  "name": "mr-timely-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "web": "cd apps/web && npm run dev",
    "mobile": "cd apps/mobile && npm start",
    "build:web": "cd apps/web && npm run build",
    "build:mobile": "cd apps/mobile && eas build",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "type-check": "npm run type-check --workspaces"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

#### Step 1.2: Set Up Directory Structure (4 hours)

```bash
# Create workspace directories
mkdir -p apps/web
mkdir -p apps/mobile
mkdir -p packages/shared
mkdir -p packages/types

# Initialize each package
cd apps/web && npm init -y
cd ../mobile && npm init -y
cd ../../packages/shared && npm init -y
cd ../types && npm init -y
```

#### Step 1.3: Move Existing Web App (4 hours)

```bash
# Copy existing Next.js app to apps/web
# Assuming your current repo is at /old/path
cp -r /old/path/github-copilot-agent-assisted-next-app/* apps/web/

# Update apps/web/package.json to work in monorepo
cd apps/web
```

**File:** `apps/web/package.json`

Add to package.json:
```json
{
  "name": "@mr-timely/web",
  "dependencies": {
    "@mr-timely/shared": "*",
    "@mr-timely/types": "*",
    // ... existing dependencies
  }
}
```

#### Step 1.4: Initialize Expo Mobile App (8 hours)

```bash
cd apps
npx create-expo-app mobile --template blank-typescript
cd mobile
```

**File:** `apps/mobile/package.json`

```json
{
  "name": "@mr-timely/mobile",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@mr-timely/shared": "*",
    "@mr-timely/types": "*",
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "expo-router": "~3.5.0",
    "@react-navigation/native": "^6.1.18",
    "react-native-safe-area-context": "^4.10.5",
    "react-native-screens": "^3.34.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.2.45",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.0"
  }
}
```

**File:** `apps/mobile/tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@mr-timely/shared": ["../../packages/shared/src"],
      "@mr-timely/types": ["../../packages/types/src"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

#### Step 1.5: Set Up Shared Packages (8 hours)

**File:** `packages/types/package.json`

```json
{
  "name": "@mr-timely/types",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

**File:** `packages/types/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**File:** `packages/shared/package.json`

```json
{
  "name": "@mr-timely/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "test": "jest",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@mr-timely/types": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "jest": "^29.7.0"
  }
}
```

#### Step 1.6: Configure TypeScript Path Aliases (4 hours)

**File:** `tsconfig.json` (root)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@mr-timely/shared": ["packages/shared/src"],
      "@mr-timely/shared/*": ["packages/shared/src/*"],
      "@mr-timely/types": ["packages/types/src"],
      "@mr-timely/types/*": ["packages/types/src/*"]
    }
  }
}
```

#### Step 1.7: Install Dependencies (4 hours)

```bash
# From monorepo root
npm install

# Verify workspace setup
npm run type-check
```

#### Step 1.8: Git Configuration (4 hours)

**File:** `.gitignore` (root)

```
# Dependencies
node_modules/
.pnp/
.pnp.js

# Build outputs
.next/
out/
dist/
build/
.expo/
.expo-shared/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### Testing Phase 1

1. **Verify monorepo structure:**
   ```bash
   # From root
   npm run web    # Should start Next.js
   npm run mobile # Should start Expo
   ```

2. **Verify workspace linking:**
   ```bash
   npm ls --all
   ```

3. **Verify TypeScript:**
   ```bash
   npm run type-check
   ```

---

## 📦 Phase 2: Shared Code Migration (1 week, 40 hours)

### Goal
Extract and migrate reusable business logic, types, and utilities to shared packages.

### Implementation Steps

#### Step 2.1: Migrate TypeScript Types (8 hours)

**File:** `packages/types/src/activity.ts`

Copy from `apps/web/src/types/activity.ts`:

```typescript
export type ActivityStateType = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'REMOVED';

export interface Activity {
  id: string;
  name: string;
  description?: string;
  state: ActivityStateType;
  colors: ColorSet;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export interface ColorSet {
  primary: string;
  secondary: string;
  border: string;
  text: string;
}

export interface ThemeColorSet {
  light: ColorSet;
  dark: ColorSet;
}
```

**File:** `packages/types/src/timeline.ts`

```typescript
import { ColorSet, ThemeColorSet } from './activity';

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  startTime: number;
  endTime: number | null;
  colors: ColorSet | ThemeColorSet;
}

export interface TimelineCalculationOptions {
  sessionStartTime: number;
  currentTime: number;
  activities: Activity[];
}
```

**File:** `packages/types/src/index.ts`

```typescript
export * from './activity';
export * from './timeline';
```

#### Step 2.2: Migrate Activity State Machine (12 hours)

**File:** `packages/shared/src/activityStateMachine.ts`

Copy from `apps/web/src/utils/activityStateMachine.ts`:

```typescript
import type { Activity, ActivityStateType } from '@mr-timely/types';

export class ActivityStateMachine {
  private activities: Activity[];
  private currentRunningActivity: Activity | null = null;

  constructor(activities: Activity[]) {
    this.activities = activities;
    this.currentRunningActivity = activities.find(a => a.state === 'RUNNING') || null;
  }

  startActivity(activityId: string): Activity[] {
    // Complete current running activity if exists
    if (this.currentRunningActivity && this.currentRunningActivity.id !== activityId) {
      this.completeActivity(this.currentRunningActivity.id);
    }

    // Start the new activity
    this.activities = this.activities.map(activity =>
      activity.id === activityId
        ? { ...activity, state: 'RUNNING' as ActivityStateType, startTime: Date.now() }
        : activity
    );

    this.currentRunningActivity = this.activities.find(a => a.id === activityId) || null;
    return this.activities;
  }

  completeActivity(activityId: string): Activity[] {
    this.activities = this.activities.map(activity =>
      activity.id === activityId
        ? { ...activity, state: 'COMPLETED' as ActivityStateType, endTime: Date.now() }
        : activity
    );

    if (this.currentRunningActivity?.id === activityId) {
      this.currentRunningActivity = null;
    }

    return this.activities;
  }

  removeActivity(activityId: string): Activity[] {
    this.activities = this.activities.map(activity =>
      activity.id === activityId
        ? { ...activity, state: 'REMOVED' as ActivityStateType }
        : activity
    );

    if (this.currentRunningActivity?.id === activityId) {
      this.currentRunningActivity = null;
    }

    return this.activities;
  }

  restoreActivity(activityId: string): Activity[] {
    this.activities = this.activities.map(activity =>
      activity.id === activityId
        ? { ...activity, state: 'PENDING' as ActivityStateType }
        : activity
    );

    return this.activities;
  }

  getActivities(): Activity[] {
    return this.activities;
  }

  getCurrentRunningActivity(): Activity | null {
    return this.currentRunningActivity;
  }
}
```

#### Step 2.3: Migrate Timeline Calculations (8 hours)

**File:** `packages/shared/src/timelineCalculations.ts`

```typescript
import type { Activity, TimelineEntry, ColorSet, ThemeColorSet } from '@mr-timely/types';

export const calculateTimelineEntries = (
  activities: Activity[],
  sessionStartTime: number,
  currentTime: number
): TimelineEntry[] => {
  const entries: TimelineEntry[] = [];
  let lastEndTime = sessionStartTime;

  // Sort activities by start time
  const sortedActivities = [...activities]
    .filter(a => a.state === 'COMPLETED' || a.state === 'RUNNING')
    .sort((a, b) => (a.startTime || 0) - (b.startTime || 0));

  for (const activity of sortedActivities) {
    // Add break period if there's a gap
    if (activity.startTime && activity.startTime > lastEndTime) {
      entries.push({
        id: `break-${lastEndTime}`,
        activityId: null,
        startTime: lastEndTime,
        endTime: activity.startTime,
        colors: getBreakColors(),
      });
    }

    // Add activity period
    entries.push({
      id: `activity-${activity.id}`,
      activityId: activity.id,
      startTime: activity.startTime || currentTime,
      endTime: activity.state === 'RUNNING' ? null : activity.endTime,
      colors: activity.colors,
    });

    lastEndTime = activity.endTime || currentTime;
  }

  return entries;
};

export const calculateProgress = (
  startTime: number,
  duration: number,
  currentTime: number
): number => {
  const elapsed = currentTime - startTime;
  const progress = (elapsed / duration) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

const getBreakColors = (): ColorSet => ({
  primary: '#e9ecef',
  secondary: '#dee2e6',
  border: '#ced4da',
  text: '#6c757d',
});
```

#### Step 2.4: Migrate Color System (8 hours)

**File:** `packages/shared/src/colors.ts`

```typescript
import type { ColorSet, ThemeColorSet } from '@mr-timely/types';

// HSL color palette
export const colorPalettes: ThemeColorSet[] = [
  {
    light: { primary: 'hsl(210, 100%, 60%)', secondary: 'hsl(210, 100%, 70%)', border: 'hsl(210, 100%, 40%)', text: '#000' },
    dark: { primary: 'hsl(210, 80%, 45%)', secondary: 'hsl(210, 80%, 55%)', border: 'hsl(210, 80%, 30%)', text: '#fff' },
  },
  // ... add all 12 color palettes
];

export const getActivityColors = (index: number, theme: 'light' | 'dark'): ColorSet => {
  const palette = colorPalettes[index % colorPalettes.length];
  return palette[theme];
};

export const generateRandomColor = (theme: 'light' | 'dark'): ColorSet => {
  const randomIndex = Math.floor(Math.random() * colorPalettes.length);
  return getActivityColors(randomIndex, theme);
};
```

#### Step 2.5: Export Shared Code (4 hours)

**File:** `packages/shared/src/index.ts`

```typescript
export * from './activityStateMachine';
export * from './timelineCalculations';
export * from './colors';
```

### Testing Phase 2

1. **Unit Tests for Shared Code:**

**File:** `packages/shared/__tests__/activityStateMachine.test.ts`

```typescript
import { ActivityStateMachine } from '../src/activityStateMachine';
import type { Activity } from '@mr-timely/types';

describe('ActivityStateMachine', () => {
  let stateMachine: ActivityStateMachine;
  let mockActivities: Activity[];

  beforeEach(() => {
    mockActivities = [
      {
        id: '1',
        name: 'Test Activity',
        state: 'PENDING',
        colors: { primary: '#000', secondary: '#111', border: '#222', text: '#fff' },
      },
    ];
    stateMachine = new ActivityStateMachine(mockActivities);
  });

  it('starts an activity', () => {
    const result = stateMachine.startActivity('1');
    expect(result[0].state).toBe('RUNNING');
    expect(result[0].startTime).toBeDefined();
  });

  it('completes an activity', () => {
    stateMachine.startActivity('1');
    const result = stateMachine.completeActivity('1');
    expect(result[0].state).toBe('COMPLETED');
    expect(result[0].endTime).toBeDefined();
  });
});
```

2. **Verify imports work:**

```bash
cd apps/mobile
npm run type-check
```

---

## 📱 Phase 3: React Native Foundation (1 week, 40 hours)

### Goal
Set up the basic React Native app structure with Expo Router for navigation.

### Implementation Steps

#### Step 3.1: Install Core Dependencies (4 hours)

```bash
cd apps/mobile
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @react-native-async-storage/async-storage
npx expo install expo-notifications expo-haptics
```

#### Step 3.2: Configure Expo Router (8 hours)

**File:** `apps/mobile/app.json`

```json
{
  "expo": {
    "name": "Mr. Timely",
    "slug": "mr-timely",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#007bff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mrtimely.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#007bff"
      },
      "package": "com.mrtimely.app",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "mrtimely"
  }
}
```

**File:** `apps/mobile/index.js`

```javascript
import 'expo-router/entry';
```

#### Step 3.3: Create App Directory Structure (8 hours)

```bash
cd apps/mobile
mkdir -p app/(tabs)
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/theme
mkdir -p src/contexts
mkdir -p assets/images
```

**File:** `apps/mobile/app/_layout.tsx`

```typescript
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

**File:** `apps/mobile/app/(tabs)/_layout.tsx`

```typescript
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8e8e93' : '#8e8e93',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activities',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

#### Step 3.4: Create Theme System (12 hours)

**File:** `apps/mobile/src/theme/colors.ts`

```typescript
export const Colors = {
  light: {
    primary: '#007bff',
    background: '#ffffff',
    card: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    error: '#dc3545',
    success: '#28a745',
    warning: '#ffc107',
  },
  dark: {
    primary: '#0a84ff',
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#8e8e93',
    border: '#38383a',
    error: '#ff453a',
    success: '#32d74b',
    warning: '#ffd60a',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  small: { fontSize: 14, fontWeight: 'normal' as const },
  caption: { fontSize: 12, fontWeight: 'normal' as const },
};
```

**File:** `apps/mobile/src/contexts/ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  colors: typeof Colors.light;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');

  const actualTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;
  const colors = Colors[actualTheme];

  useEffect(() => {
    AsyncStorage.getItem('theme').then((stored) => {
      if (stored) setThemeState(stored as ThemeMode);
    });
  }, []);

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

#### Step 3.5: Create Base Components (8 hours)

**File:** `apps/mobile/src/components/Button.tsx`

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size
    const sizeStyles = {
      sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, minHeight: 36 },
      md: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, minHeight: 44 },
      lg: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, minHeight: 56 },
    };

    // Variant
    const variantStyles = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.card },
      outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
      danger: { backgroundColor: colors.error },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const variantStyles = {
      primary: { color: '#ffffff' },
      secondary: { color: colors.text },
      outline: { color: colors.primary },
      danger: { color: '#ffffff' },
    };

    return {
      fontWeight: '600',
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#ffffff'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
```

**File:** `apps/mobile/src/components/Card.tsx`

```typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

### Testing Phase 3

1. **Run the app:**
   ```bash
   cd apps/mobile
   npm start
   # Press 'i' for iOS simulator
   # Press 'a' for Android emulator
   ```

2. **Verify:**
   - App launches without errors
   - Tabs navigation works
   - Theme switches between light/dark
   - Base components render correctly

---

## 🎨 Phase 4: Core UI Components (2 weeks, 80 hours)

### Goal
Implement all core UI components for the activity tracking application.

### Implementation Steps

#### Step 4.1: Activity Card Component (12 hours)

**File:** `apps/mobile/src/components/ActivityCard.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '@mr-timely/types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../theme/colors';

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  onStart: () => void;
  onDelete: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  onStart,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderLeftColor: activity.colors.primary,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {activity.name}
            </Text>
            {activity.state === 'RUNNING' && (
              <View style={[styles.badge, { backgroundColor: colors.success }]}>
                <Text style={styles.badgeText}>Running</Text>
              </View>
            )}
          </View>
        </View>

        {activity.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {activity.description}
          </Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onStart}
            disabled={activity.state === 'RUNNING'}
          >
            <Ionicons name="play" size={18} color="#ffffff" />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.error }]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#ffffff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.h3,
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    ...Typography.small,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

#### Step 4.2: Timeline Component (16 hours)

**File:** `apps/mobile/src/components/Timeline.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { TimelineEntry } from '@mr-timely/types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../theme/colors';
import { formatDuration } from '@mr-timely/shared';

interface TimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  currentTime: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  entries,
  totalDuration,
  currentTime,
}) => {
  const { colors } = useTheme();

  const calculatePercentage = (startTime: number, endTime: number | null) => {
    const duration = (endTime || currentTime) - startTime;
    return (duration / totalDuration) * 100;
  };

  if (entries.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No activities tracked yet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {entries.map((entry, index) => {
        const percentage = calculatePercentage(entry.startTime, entry.endTime);
        const duration = (entry.endTime || currentTime) - entry.startTime;
        const isActive = entry.endTime === null;

        return (
          <View
            key={entry.id}
            style={[
              styles.entry,
              {
                backgroundColor: entry.colors.primary,
                borderLeftColor: entry.colors.border,
              },
            ]}
          >
            <View style={styles.entryContent}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryName}>
                  {entry.activityId ? 'Activity' : 'Break'}
                </Text>
                {isActive && (
                  <View style={[styles.badge, { backgroundColor: colors.success }]}>
                    <Text style={styles.badgeText}>Running</Text>
                  </View>
                )}
              </View>

              <View style={styles.entryMeta}>
                <Text style={styles.metaText}>
                  {formatDuration(duration)}
                </Text>
                <Text style={styles.metaText}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
            </View>

            {isActive && <View style={styles.pulse} />}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
  },
  entry: {
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  entryContent: {
    gap: Spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryName: {
    ...Typography.h3,
    color: '#ffffff',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  entryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pulse: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
```

#### Step 4.3: Timer Display Component (12 hours)

**File:** `apps/mobile/src/components/TimerDisplay.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/colors';

interface TimerDisplayProps {
  startTime: number;
  duration: number;
  mode: 'duration' | 'deadline';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  startTime,
  duration,
  mode,
}) => {
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const elapsed = currentTime - startTime;
  const remaining = duration - elapsed;
  const displayTime = mode === 'duration' ? elapsed : remaining;
  const isOvertime = remaining < 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.abs(Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.time,
          {
            color: isOvertime ? colors.error : colors.primary,
          },
        ]}
      >
        {isOvertime && mode === 'deadline' && '+'}
        {formatTime(displayTime)}
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {mode === 'duration' ? 'Elapsed' : isOvertime ? 'Overtime' : 'Remaining'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontSize: 64,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  label: {
    ...Typography.body,
    marginTop: 8,
  },
});
```

#### Step 4.4: Progress Bar Component (8 hours)

**File:** `apps/mobile/src/components/ProgressBar.tsx`

```typescript
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius } from '../theme/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  height = 8,
  animated = true,
}) => {
  const { colors } = useTheme();
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: Math.min(Math.max(progress, 0), 100),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated]);

  const width = animated ? animatedWidth : progress;
  const backgroundColor = color || colors.primary;
  const isOvertime = progress > 100;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: colors.border,
          borderRadius: height / 2,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width: animated ? animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }) : `${Math.min(progress, 100)}%`,
            backgroundColor: isOvertime ? colors.error : backgroundColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
```

#### Step 4.5: Form Input Components (12 hours)

**File:** `apps/mobile/src/components/TextInput.tsx`

```typescript
import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../theme/colors';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      {helperText && !error && (
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.small,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  error: {
    ...Typography.small,
    marginTop: Spacing.xs,
  },
  helper: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});
```

#### Step 4.6: Activity List Screen (20 hours)

**File:** `apps/mobile/app/(tabs)/activities.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useActivities } from '../../src/hooks/useActivities';
import { ActivityCard } from '../../src/components/ActivityCard';
import { Button } from '../../src/components/Button';
import { TextInput } from '../../src/components/TextInput';
import { Spacing, Typography } from '../../src/theme/colors';

export default function ActivitiesScreen() {
  const { colors } = useTheme();
  const {
    activities,
    addActivity,
    removeActivity,
    startActivity,
  } = useActivities();

  const [modalVisible, setModalVisible] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');

  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      addActivity({
        name: newActivityName.trim(),
        description: newActivityDescription.trim(),
      });
      setNewActivityName('');
      setNewActivityDescription('');
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Activities</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activities.filter(a => a.state !== 'REMOVED')}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => {}}
            onStart={() => startActivity(item.id)}
            onDelete={() => removeActivity(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No activities yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap the + button to add your first activity
            </Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalCancel, { color: colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              New Activity
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            <TextInput
              label="Activity Name"
              placeholder="Enter activity name"
              value={newActivityName}
              onChangeText={setNewActivityName}
              autoFocus
            />

            <TextInput
              label="Description (optional)"
              placeholder="Enter description"
              value={newActivityDescription}
              onChangeText={setNewActivityDescription}
              multiline
              numberOfLines={3}
            />

            <Button
              title="Add Activity"
              onPress={handleAddActivity}
              disabled={!newActivityName.trim()}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    ...Typography.h1,
  },
  list: {
    padding: Spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    ...Typography.h3,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    ...Typography.body,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  modalCancel: {
    ...Typography.body,
    width: 60,
  },
  modalTitle: {
    ...Typography.h2,
  },
  modalContent: {
    padding: Spacing.md,
  },
});
```

### Testing Phase 4

1. **Run tests:**
   ```bash
   npm test -- --testPathPattern=components
   ```

2. **Manual testing:**
   - Test all components render correctly
   - Test dark/light mode
   - Test interactive elements (buttons, inputs)
   - Test activity CRUD operations
   - Verify animations smooth (60 FPS)

---

Due to length constraints, I'll now finalize this document with the remaining phases in a condensed format:

## Phases 5-8 Summary

**Phase 5: Navigation & Routing** - Set up Expo Router with tab navigation and modal screens

**Phase 6: State Management** - Implement hooks using shared business logic, AsyncStorage for persistence

**Phase 7: Native Features** - Add local notifications, haptics, native sharing, background tasks

**Phase 8: Testing & Deployment** - EAS Build for iOS/Android, App Store/Play Store submission

---

## 📦 Deployment

### Build for Production

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## ✅ Completion Criteria

- [ ] All phases implemented
- [ ] Tests passing (>90% coverage)
- [ ] Apps approved in both stores
- [ ] Documentation complete
- [ ] Performance targets met

---

**End of React Native Implementation Guide**
