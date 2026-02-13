# React Native Rewrite - Implementation Guide
**AI Coding Agent Instructions | Version 1.1 | Target: <30,000 chars**

## Overview
Rewrite Mr. Timely as native iOS/Android apps using React Native + Expo in monorepo. **Timeline:** 10-12 weeks (480h) | **Cost:** $67K

**Architecture:** Monorepo with shared business logic (40% code reuse)
```
mr-timely-monorepo/
├── apps/
│   ├── web/          # Existing Next.js
│   └── mobile/       # New Expo app
├── packages/
│   ├── shared/       # State machine, calculations
│   └── types/        # TypeScript interfaces
```

## Phase 1: Monorepo Setup (1 week, 40h)

### 1.1 Create Structure
```bash
mkdir mr-timely-monorepo && cd mr-timely-monorepo
npm init -y
mkdir -p apps/{web,mobile} packages/{shared,types}
```

**Root package.json:**
```json
{
  "name": "mr-timely-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "web": "cd apps/web && npm run dev",
    "mobile": "cd apps/mobile && npm start",
    "build:mobile": "cd apps/mobile && eas build"
  }
}
```

### 1.2 Move Web App
```bash
cp -r /old/path/github-copilot-agent-assisted-next-app/* apps/web/
```

**Update apps/web/package.json:**
```json
{
  "name": "@mr-timely/web",
  "dependencies": {
    "@mr-timely/shared": "*",
    "@mr-timely/types": "*"
  }
}
```

### 1.3 Initialize Mobile App
```bash
cd apps && npx create-expo-app mobile --template blank-typescript
```

**apps/mobile/package.json:**
```json
{
  "name": "@mr-timely/mobile",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "@mr-timely/shared": "*",
    "@mr-timely/types": "*",
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "expo-status-bar": "~1.12.1",
    "@react-navigation/native": "^6.1.18",
    "react-native-safe-area-context": "^4.10.5"
  }
}
```

### 1.4 Configure TypeScript
**Root tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@mr-timely/shared": ["packages/shared/src"],
      "@mr-timely/types": ["packages/types/src"]
    }
  }
}
```

**apps/mobile/tsconfig.json:**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@mr-timely/shared": ["../../packages/shared/src"],
      "@mr-timely/types": ["../../packages/types/src"]
    }
  }
}
```

### 1.5 Install & Verify
```bash
npm install
npm run type-check
```

## Phase 2: Shared Code Migration (1 week, 40h)

### 2.1 Migrate Types
**packages/types/src/activity.ts:**
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
}

export interface ColorSet {
  primary: string;
  secondary: string;
  border: string;
  text: string;
}
```

**packages/types/src/index.ts:**
```typescript
export * from './activity';
```

### 2.2 Migrate State Machine
**packages/shared/src/activityStateMachine.ts:**
```typescript
import type { Activity, ActivityStateType } from '@mr-timely/types';

export class ActivityStateMachine {
  private activities: Activity[];
  private currentRunningActivity: Activity | null = null;

  constructor(activities: Activity[]) {
    this.activities = activities;
    this.currentRunningActivity = activities.find(a => a.state === 'RUNNING') || null;
  }

  startActivity(id: string): Activity[] {
    if (this.currentRunningActivity && this.currentRunningActivity.id !== id) {
      this.completeActivity(this.currentRunningActivity.id);
    }
    this.activities = this.activities.map(a =>
      a.id === id ? { ...a, state: 'RUNNING' as ActivityStateType, startTime: Date.now() } : a
    );
    this.currentRunningActivity = this.activities.find(a => a.id === id) || null;
    return this.activities;
  }

  completeActivity(id: string): Activity[] {
    this.activities = this.activities.map(a =>
      a.id === id ? { ...a, state: 'COMPLETED' as ActivityStateType, endTime: Date.now() } : a
    );
    if (this.currentRunningActivity?.id === id) this.currentRunningActivity = null;
    return this.activities;
  }

  removeActivity(id: string): Activity[] {
    this.activities = this.activities.map(a =>
      a.id === id ? { ...a, state: 'REMOVED' as ActivityStateType } : a
    );
    return this.activities;
  }

  getActivities(): Activity[] { return this.activities; }
}
```

### 2.3 Migrate Calculations
**packages/shared/src/timelineCalculations.ts:**
```typescript
export const calculateProgress = (startTime: number, duration: number, currentTime: number): number => {
  const elapsed = currentTime - startTime;
  return Math.min(Math.max((elapsed / duration) * 100, 0), 100);
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : minutes > 0 ? `${minutes}m` : `${seconds}s`;
};
```

**packages/shared/src/index.ts:**
```typescript
export * from './activityStateMachine';
export * from './timelineCalculations';
```

## Phase 3: React Native Foundation (1 week, 40h)

### 3.1 Install Core Dependencies
```bash
cd apps/mobile
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install @react-native-async-storage/async-storage
npx expo install expo-notifications expo-haptics
```

### 3.2 Configure Expo
**apps/mobile/app.json:**
```json
{
  "expo": {
    "name": "Mr. Timely",
    "slug": "mr-timely",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png", "backgroundColor": "#007bff" },
    "ios": { "bundleIdentifier": "com.mrtimely.app" },
    "android": { "package": "com.mrtimely.app" },
    "plugins": ["expo-router"],
    "scheme": "mrtimely"
  }
}
```

**apps/mobile/index.js:**
```javascript
import 'expo-router/entry';
```

### 3.3 Create App Structure
```bash
mkdir -p app/(tabs) src/{components,hooks,utils,theme,contexts}
```

**apps/mobile/app/_layout.tsx:**
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
        <Stack><Stack.Screen name="(tabs)" options={{ headerShown: false }} /></Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

**apps/mobile/app/(tabs)/_layout.tsx:**
```typescript
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#007bff',
      tabBarStyle: { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff' }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Timer', 
        tabBarIcon: ({ color, size }) => <Ionicons name="timer-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="activities" options={{ title: 'Activities',
        tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
```

### 3.4 Theme System
**apps/mobile/src/theme/colors.ts:**
```typescript
export const Colors = {
  light: { primary: '#007bff', background: '#ffffff', card: '#f8f9fa', text: '#212529', border: '#dee2e6' },
  dark: { primary: '#0a84ff', background: '#000000', card: '#1c1c1e', text: '#ffffff', border: '#38383a' },
};
export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const BorderRadius = { sm: 4, md: 8, lg: 12 };
```

**apps/mobile/src/contexts/ThemeContext.tsx:**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

type ThemeMode = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{ theme: ThemeMode; colors: typeof Colors.light; setTheme: (t: ThemeMode) => void }>(null!);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const actualTheme = theme === 'system' ? (systemScheme || 'light') : theme;
  const colors = Colors[actualTheme];

  useEffect(() => {
    AsyncStorage.getItem('theme').then(t => t && setThemeState(t as ThemeMode));
  }, []);

  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    await AsyncStorage.setItem('theme', t);
  };

  return <ThemeContext.Provider value={{ theme, colors, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
```

## Phase 4: Core UI Components (2 weeks, 80h)

### 4.1 Button Component
**apps/mobile/src/components/Button.tsx:**
```typescript
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading, disabled, style }) => {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.primary : '#dc3545';
  
  return (
    <TouchableOpacity
      style={[{ backgroundColor: bg, padding: Spacing.md, borderRadius: BorderRadius.md, 
                alignItems: 'center', minHeight: 44, opacity: disabled ? 0.5 : 1 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{title}</Text>}
    </TouchableOpacity>
  );
};
```

### 4.2 ActivityCard Component
**apps/mobile/src/components/ActivityCard.tsx:**
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '@mr-timely/types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

export const ActivityCard: React.FC<{ activity: Activity; onStart: () => void; onDelete: () => void }> = 
  ({ activity, onStart, onDelete }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: activity.colors.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{activity.name}</Text>
        {activity.state === 'RUNNING' && <View style={styles.badge}><Text style={styles.badgeText}>Running</Text></View>}
      </View>
      {activity.description && <Text style={[styles.desc, { color: colors.text }]}>{activity.description}</Text>}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={onStart}>
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#dc3545' }]} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.md, borderLeftWidth: 4, padding: Spacing.md, marginBottom: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  title: { fontSize: 18, fontWeight: '600', flex: 1 },
  badge: { backgroundColor: '#28a745', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  desc: { fontSize: 14, marginBottom: Spacing.md },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
         padding: Spacing.sm, borderRadius: 4, gap: 4 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
```

### 4.3 TextInput Component
**apps/mobile/src/components/TextInput.tsx:**
```typescript
import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

export const TextInput: React.FC<TextInputProps & { label?: string; error?: string }> = 
  ({ label, error, style, ...props }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <RNTextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, 
                                borderColor: error ? '#dc3545' : colors.border }, style]}
        placeholderTextColor={colors.border}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { fontSize: 14, fontWeight: '600', marginBottom: Spacing.xs },
  input: { fontSize: 16, borderWidth: 1, borderRadius: BorderRadius.md, 
           padding: Spacing.md, minHeight: 48 },
  error: { color: '#dc3545', fontSize: 13, marginTop: Spacing.xs },
});
```

### 4.4 Activities Screen
**apps/mobile/app/(tabs)/activities.tsx:**
```typescript
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useActivities } from '../../src/hooks/useActivities';
import { ActivityCard } from '../../src/components/ActivityCard';
import { Button } from '../../src/components/Button';
import { TextInput } from '../../src/components/TextInput';

export default function ActivitiesScreen() {
  const { colors } = useTheme();
  const { activities, addActivity, removeActivity, startActivity } = useActivities();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      addActivity({ name: name.trim(), description: desc.trim() });
      setName(''); setDesc(''); setModalVisible(false);
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
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <ActivityCard activity={item} onStart={() => startActivity(item.id)} onDelete={() => removeActivity(item.id)} />
        )}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.primary }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Activity</Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={{ padding: 16 }}>
            <TextInput label="Name" placeholder="Activity name" value={name} onChangeText={setName} />
            <TextInput label="Description" placeholder="Optional" value={desc} onChangeText={setDesc} multiline />
            <Button title="Add Activity" onPress={handleAdd} disabled={!name.trim()} />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 32, fontWeight: 'bold' },
  list: { padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
});
```

## Phase 5-8 Summary

**Phase 5: Navigation** - Expo Router with tabs, stack navigation, deep linking

**Phase 6: State Management** - Create hooks using shared logic:
```typescript
// src/hooks/useActivities.ts
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityStateMachine } from '@mr-timely/shared';

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const machine = new ActivityStateMachine(activities);
  
  const startActivity = (id: string) => setActivities(machine.startActivity(id));
  // Load from AsyncStorage, save on changes
  
  return { activities, startActivity, addActivity, removeActivity };
};
```

**Phase 7: Native Features** - Add notifications, haptics, sharing:
```typescript
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

await Notifications.scheduleNotificationAsync({
  content: { title: 'Timer Complete!' },
  trigger: { seconds: duration }
});

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

**Phase 8: Testing & Deployment**
```bash
# Configure EAS
eas build:configure

# Build
eas build --platform ios
eas build --platform android

# Submit
eas submit --platform ios
eas submit --platform android
```

## Testing
```bash
npm test  # Jest tests for shared packages
npm run type-check
```

**Manual:**
- Test on iOS simulator: `npm run ios`
- Test on Android emulator: `npm run android`
- Verify shared logic works
- Test navigation
- Test AsyncStorage persistence

## Success Criteria
- [ ] Monorepo structure working
- [ ] Shared code migrated (state machine, types)
- [ ] All components implemented
- [ ] Navigation functional
- [ ] Apps build successfully
- [ ] Approved in both stores

## Troubleshooting

**"Can't import shared package":** Check tsconfig paths, run `npm install` in root

**Metro bundler errors:** Clear cache: `npx react-native start --reset-cache`

**Build fails:** Clear node_modules: `rm -rf node_modules && npm install`

---
**End of React Native Guide** | Implementation time: 480 hours | 40% code reuse from web
