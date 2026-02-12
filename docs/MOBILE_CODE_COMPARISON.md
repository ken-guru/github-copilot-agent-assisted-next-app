# Mobile Framework Code Comparison
## Side-by-Side Examples for Mr. Timely

This document shows how the same functionality would be implemented in each mobile framework option, helping you understand the differences in development approach.

---

## 1. Component: Activity Card

### Current Web Implementation (Bootstrap + Next.js)

```typescript
// src/components/ActivityCard.tsx
import { Card, Button, Badge } from 'react-bootstrap';

interface ActivityCardProps {
  activity: Activity;
  onStart: () => void;
  onRemove: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onStart,
  onRemove
}) => {
  return (
    <Card className="mb-3" style={{ borderLeft: `4px solid ${activity.color}` }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title>{activity.name}</Card.Title>
          <Badge bg={activity.state === 'RUNNING' ? 'success' : 'secondary'}>
            {activity.state}
          </Badge>
        </div>
        <Card.Text>{activity.description}</Card.Text>
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={onStart}
            disabled={activity.state === 'RUNNING'}
          >
            Start
          </Button>
          <Button variant="danger" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
```

**Lines of code:** ~35  
**Dependencies:** react-bootstrap, Bootstrap CSS  
**Browser compatibility:** All modern browsers

---

### Capacitor Version (Same code!)

```typescript
// src/components/ActivityCard.tsx
// ✅ EXACT SAME CODE AS WEB VERSION
// No changes needed for Capacitor!

import { Card, Button, Badge } from 'react-bootstrap';

interface ActivityCardProps {
  activity: Activity;
  onStart: () => void;
  onRemove: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onStart,
  onRemove
}) => {
  return (
    <Card className="mb-3" style={{ borderLeft: `4px solid ${activity.color}` }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title>{activity.name}</Card.Title>
          <Badge bg={activity.state === 'RUNNING' ? 'success' : 'secondary'}>
            {activity.state}
          </Badge>
        </div>
        <Card.Text>{activity.description}</Card.Text>
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={onStart}
            disabled={activity.state === 'RUNNING'}
          >
            Start
          </Button>
          <Button variant="danger" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
```

**Lines of code:** ~35 (identical)  
**Changes needed:** 0  
**Reusability:** 100%

---

### React Native Version (Complete rewrite)

```typescript
// apps/mobile/src/components/ActivityCard.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ActivityCardProps {
  activity: Activity;
  onStart: () => void;
  onRemove: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onStart,
  onRemove
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: activity.color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{activity.name}</Text>
        <View style={[
          styles.badge, 
          activity.state === 'RUNNING' ? styles.badgeSuccess : styles.badgeSecondary
        ]}>
          <Text style={styles.badgeText}>{activity.state}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{activity.description}</Text>
      
      <View style={styles.buttonRow}>
        <Pressable 
          style={[styles.button, styles.buttonPrimary]}
          onPress={onStart}
          disabled={activity.state === 'RUNNING'}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.buttonDanger]}
          onPress={onRemove}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeSuccess: {
    backgroundColor: '#28a745',
  },
  badgeSecondary: {
    backgroundColor: '#6c757d',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Lines of code:** ~100 (3x more)  
**Changes needed:** Complete rewrite  
**Reusability:** 0% (UI), business logic can be shared

---

## 2. Storage: Saving Activities

### Current Web Implementation

```typescript
// src/utils/activity-storage.ts
export const saveActivities = (activities: Activity[]) => {
  try {
    localStorage.setItem('activities_v1', JSON.stringify(activities));
    return true;
  } catch (error) {
    console.error('Failed to save activities:', error);
    return false;
  }
};

export const loadActivities = (): Activity[] => {
  try {
    const data = localStorage.getItem('activities_v1');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load activities:', error);
    return [];
  }
};
```

**API:** localStorage (Web Storage API)  
**Sync:** Synchronous  
**Capacity:** ~5-10MB

---

### Capacitor Version (Minor changes)

```typescript
// src/utils/activity-storage.ts
import { Storage } from '@capacitor/storage';

export const saveActivities = async (activities: Activity[]) => {
  try {
    await Storage.set({
      key: 'activities_v1',
      value: JSON.stringify(activities),
    });
    return true;
  } catch (error) {
    console.error('Failed to save activities:', error);
    return false;
  }
};

export const loadActivities = async (): Promise<Activity[]> => {
  try {
    const { value } = await Storage.get({ key: 'activities_v1' });
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Failed to load activities:', error);
    return [];
  }
};
```

**Changes:**
- ✅ Add `async/await` (localStorage → Capacitor Storage)
- ✅ Import Capacitor Storage plugin
- ✅ Update function signatures to return Promises

**Lines changed:** ~6 lines  
**Reusability:** 90% (same logic, different API)

---

### React Native Version (Different API)

```typescript
// apps/mobile/src/utils/activity-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveActivities = async (activities: Activity[]) => {
  try {
    await AsyncStorage.setItem('activities_v1', JSON.stringify(activities));
    return true;
  } catch (error) {
    console.error('Failed to save activities:', error);
    return false;
  }
};

export const loadActivities = async (): Promise<Activity[]> => {
  try {
    const data = await AsyncStorage.getItem('activities_v1');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load activities:', error);
    return [];
  }
};
```

**Changes:**
- ✅ Replace with AsyncStorage
- ✅ Same async/await pattern
- ✅ Nearly identical API

**Lines changed:** ~4 lines (import change)  
**Reusability:** 95% (same logic, different import)

---

## 3. Notifications: Timer Complete Alert

### Current Web Implementation

```typescript
// src/utils/notifications.ts
export const showTimerCompleteNotification = (activityName: string) => {
  // Web Notifications API
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Timer Complete!', {
      body: `${activityName} is finished.`,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showTimerCompleteNotification(activityName);
      }
    });
  }
};
```

**API:** Web Notifications API  
**Limitations:** Requires tab to be open (in most browsers)

---

### Capacitor Version (Native notifications)

```typescript
// src/utils/notifications.ts
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const showTimerCompleteNotification = async (activityName: string) => {
  // Check if running on native platform
  if (Capacitor.isNativePlatform()) {
    // Request permissions
    const permission = await LocalNotifications.requestPermissions();
    
    if (permission.display === 'granted') {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Timer Complete!',
            body: `${activityName} is finished.`,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 100) }, // Immediate
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: { activityName },
          }
        ]
      });
    }
  } else {
    // Fallback to web notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: `${activityName} is finished.`,
        icon: '/icons/icon-192.png',
      });
    }
  }
};
```

**Changes:**
- ✅ Add native notification support
- ✅ Keep web fallback
- ✅ Request permissions properly
- ✅ Works even when app is backgrounded

**Lines changed:** ~15 lines  
**Reusability:** 70% (added native support, kept web fallback)

---

### React Native Version (Native only)

```typescript
// apps/mobile/src/utils/notifications.ts
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const showTimerCompleteNotification = async (activityName: string) => {
  // Request permissions
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status === 'granted') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Timer Complete!',
        body: `${activityName} is finished.`,
        data: { activityName },
        sound: 'default',
      },
      trigger: null, // Immediate
    });
  }
};
```

**Changes:**
- ❌ No web fallback (mobile-only)
- ✅ Expo notifications API
- ✅ Cleaner, mobile-first approach

**Reusability:** 40% (different API, same concept)

---

## 4. Theme Management

### Current Web Implementation

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) setThemeState(stored);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Storage:** localStorage  
**Application:** CSS variables + data-theme attribute

---

### Capacitor Version (Minor changes)

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '@capacitor/storage';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    // Load theme from storage
    Storage.get({ key: 'theme' }).then(({ value }) => {
      if (value) setThemeState(value as Theme);
    });
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await Storage.set({ key: 'theme', value: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update native status bar (if on mobile)
    if (Capacitor.isNativePlatform()) {
      const isDark = newTheme === 'dark' || 
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Changes:**
- ✅ Async storage API
- ✅ Added native status bar integration
- ✅ Same logic, enhanced for mobile

**Lines changed:** ~10 lines  
**Reusability:** 85%

---

### React Native Version (Different approach)

```typescript
// apps/mobile/src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, StatusBar } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext<{
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  actualTheme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const systemColorScheme = useColorScheme();
  
  const actualTheme = theme === 'system' 
    ? (systemColorScheme || 'light')
    : theme;

  useEffect(() => {
    AsyncStorage.getItem('theme').then(stored => {
      if (stored) setThemeState(stored as Theme);
    });
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      <StatusBar barStyle={actualTheme === 'dark' ? 'light-content' : 'dark-content'} />
      {children}
    </ThemeContext.Provider>
  );
};
```

**Changes:**
- ❌ No CSS/DOM manipulation (React Native doesn't use CSS)
- ✅ Uses React Native's useColorScheme
- ✅ StatusBar component instead of StatusBar plugin
- ✅ Returns actualTheme for component styling

**Reusability:** 60% (same concept, different implementation)

---

## 5. Business Logic: Activity State Machine

### All Platforms (Identical!)

```typescript
// Web: src/utils/activityStateMachine.ts
// Capacitor: src/utils/activityStateMachine.ts (SAME FILE)
// React Native: packages/shared-logic/src/activityStateMachine.ts (SAME FILE)

export type ActivityStateType = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'REMOVED';

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
        ? { ...activity, state: 'RUNNING' as ActivityStateType }
        : activity
    );

    this.currentRunningActivity = this.activities.find(a => a.id === activityId) || null;
    return this.activities;
  }

  completeActivity(activityId: string): Activity[] {
    this.activities = this.activities.map(activity =>
      activity.id === activityId
        ? { ...activity, state: 'COMPLETED' as ActivityStateType }
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

**Reusability:** 100% ✅  
**Changes needed:** 0  
**This is the beauty of proper architecture!**

---

## 6. Timeline Calculations

### All Platforms (Identical!)

```typescript
// Web: src/utils/timelineCalculations.ts
// Capacitor: src/utils/timelineCalculations.ts (SAME FILE)
// React Native: packages/shared-logic/src/timelineCalculations.ts (SAME FILE)

export interface TimelineEntry {
  id: string;
  activityId: string | null;
  startTime: number;
  endTime: number | null;
  colors: ColorSet;
}

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
```

**Reusability:** 100% ✅  
**Changes needed:** 0  
**Pure functions work everywhere!**

---

## Summary: Code Reusability by Component

| Component | Web (Lines) | Capacitor Changes | React Native (Lines) | Reusability |
|-----------|------------|-------------------|---------------------|-------------|
| **ActivityCard** | 35 | 0 lines | 100 lines | 100% (Capacitor), 0% (RN) |
| **Storage** | 20 | 6 lines | 20 lines | 90% (Capacitor), 95% (RN) |
| **Notifications** | 15 | 15 lines | 20 lines | 70% (Capacitor), 40% (RN) |
| **Theme Context** | 30 | 10 lines | 35 lines | 85% (Capacitor), 60% (RN) |
| **State Machine** | 80 | 0 lines | 80 lines | 100% (both) |
| **Timeline Calc** | 50 | 0 lines | 50 lines | 100% (both) |
| **Total** | 230 | 31 lines (13%) | 305 lines (133%) | **87% (Capacitor)**, **66% (RN)** |

---

## Key Takeaways

### Capacitor Advantages
- ✅ **87% code reuse** - Most changes are small API adaptations
- ✅ **Same component structure** - UI components don't change
- ✅ **Gradual enhancement** - Add native features incrementally
- ✅ **Single codebase** - Web and mobile in same repository

### React Native Considerations
- ⚠️ **66% code reuse** - Business logic is shared, UI is rewritten
- ⚠️ **Complete UI rewrite** - All components need React Native versions
- ⚠️ **Different styling** - StyleSheet instead of CSS
- ⚠️ **Separate codebase** - Typically needs monorepo setup

### Pure Business Logic Wins
- ✅ **100% reusable** - State machine, calculations, utilities
- ✅ **TypeScript types** - Shared across all platforms
- ✅ **Testing** - Same tests work everywhere
- ✅ **Bug fixes** - Fix once, applies to all platforms

---

## Conclusion

For **Mr. Timely**, the code comparison clearly shows:

1. **Capacitor** requires minimal changes (~13% of codebase)
2. **React Native** requires substantial UI rewrite (~133% more code)
3. **Business logic** is 100% reusable in both approaches
4. **Capacitor** maintains web development velocity
5. **React Native** offers better native experience but at higher cost

**Recommendation:** Start with Capacitor to validate mobile demand, then evaluate React Native if performance becomes critical.
