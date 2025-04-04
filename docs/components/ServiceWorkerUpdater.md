# ServiceWorkerUpdater Component

## Overview

The ServiceWorkerUpdater component manages the service worker lifecycle and provides user notifications about application updates. It enables offline functionality, handles the update detection process, and offers a consistent user interface for prompting users to refresh the application when updates are available. This component is critical for ensuring users have access to the latest application version while maintaining offline capabilities.

## Features

- **Update Detection**: Automatically detects when a new version of the application is available
- **Update Notification**: Displays a non-intrusive notification when updates are available
- **Refresh Management**: Provides a user interface for triggering application refresh
- **Offline Status Indication**: Shows when the application is operating in offline mode
- **Service Worker Registration**: Handles service worker registration and lifecycle events
- **Theme Compatibility**: Adapts notification styling to match the current theme
- **Caching Strategy Management**: Configures and manages caching strategies for offline support
- **Background Operation**: Works silently in the background until updates are detected

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `registerPath` | `string` | No | `'/service-worker.js'` | Path to the service worker script |
| `scope` | `string` | No | `'/'` | Scope of the service worker |
| `onUpdate` | `(registration: ServiceWorkerRegistration) => void` | No | - | Callback function called when an update is available |
| `onSuccess` | `(registration: ServiceWorkerRegistration) => void` | No | - | Callback function called when registration succeeds |
| `onOffline` | `() => void` | No | - | Callback function called when offline mode is detected |
| `showUpdateNotification` | `boolean` | No | `true` | Whether to show the update notification UI |

## Types

```typescript
interface ServiceWorkerUpdaterProps {
  registerPath?: string;
  scope?: string;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  showUpdateNotification?: boolean;
}

interface UpdateNotificationProps {
  onRefresh: () => void;
  onDismiss?: () => void;
}
```

## State Management

The ServiceWorkerUpdater component manages several pieces of state:

1. **Update availability**: Tracks whether a new version is available
   ```typescript
   const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
   ```

2. **Service worker registration**: Stores the service worker registration instance
   ```typescript
   const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
   ```

3. **Network status**: Monitors online/offline status
   ```typescript
   const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
   ```

4. **Update notification visibility**: Controls whether the update notification is shown
   ```typescript
   const [showNotification, setShowNotification] = useState<boolean>(false);
   ```

The component uses several key effects:

1. **Service worker registration**: Handles registering the service worker on component mount
   ```typescript
   useEffect(() => {
     if ('serviceWorker' in navigator) {
       registerServiceWorker();
     }
   }, []);
   ```

2. **Network status monitoring**: Listens for online/offline events
   ```typescript
   useEffect(() => {
     const handleOnline = () => setIsOffline(false);
     const handleOffline = () => {
       setIsOffline(true);
       if (onOffline) onOffline();
     };
     
     window.addEventListener('online', handleOnline);
     window.addEventListener('offline', handleOffline);
     
     return () => {
       window.removeEventListener('online', handleOnline);
       window.removeEventListener('offline', handleOffline);
     };
   }, [onOffline]);
   ```

3. **Update check scheduling**: Periodically checks for service worker updates
   ```typescript
   useEffect(() => {
     if (!swRegistration) return;
     
     const checkInterval = setInterval(() => {
       swRegistration.update().catch(console.error);
     }, 60 * 60 * 1000); // Check every hour
     
     return () => clearInterval(checkInterval);
   }, [swRegistration]);
   ```

## Service Worker Lifecycle Management

The ServiceWorkerUpdater manages the complete service worker lifecycle:

1. **Registration**: Initial registration of the service worker
2. **Installation**: Monitoring the installation process
3. **Activation**: Handling the activation of new service worker versions
4. **Update Detection**: Checking for and detecting available updates
5. **Update Notification**: Notifying users about available updates
6. **Update Application**: Triggering application refresh to apply updates

The component implements specific handlers for various service worker events:

```typescript
// Installation and waiting state detection
navigator.serviceWorker.register(registerPath, { scope }).then(registration => {
  setSwRegistration(registration);
  
  // Detect if a service worker update is waiting
  if (registration.waiting) {
    setUpdateAvailable(true);
    if (onUpdate) onUpdate(registration);
  }
  
  // Listen for new service workers that enter the waiting state
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
          if (onUpdate) onUpdate(registration);
        }
      });
    }
  });
  
  if (onSuccess) onSuccess(registration);
});
```

## Theme Compatibility

The ServiceWorkerUpdater adapts to the application theme:

- **Notification styling**: The update notification uses theme variables for colors and styling
- **Icon theming**: Icons for update and offline status adapt to the current theme
- **Dark mode support**: All UI elements properly support dark mode
- **CSS variables**: Uses CSS variables for consistent theming
- **Contrast ratios**: Maintains proper contrast in both light and dark themes

## Mobile Responsiveness

The component is designed to be fully responsive:

- **Mobile-first design**: Notification UI is optimized for mobile screens first
- **Touch targets**: All interactive elements have adequate size for touch interaction
- **Responsive positioning**: Update notification adapts position based on viewport size
- **Space efficiency**: Minimizes UI footprint on small screens
- **Different device handling**: Adapts to various mobile browser behaviors regarding service workers

## Accessibility

- **ARIA attributes**: Uses appropriate ARIA roles and attributes
- **Focus management**: Ensures proper focus handling for notification interactions
- **Keyboard navigation**: Full keyboard support for update notification
- **Screen reader support**: Provides appropriate text alternatives and announcements
- **Reduced motion**: Respects user preference for reduced motion
- **Visible focus indicators**: Clear focus styles for interactive elements

## Example Usage

### Basic Usage

```tsx
import ServiceWorkerUpdater from '../components/ServiceWorkerUpdater';

function App() {
  return (
    <div className="app">
      <ServiceWorkerUpdater />
      {/* Rest of the application */}
    </div>
  );
}
```

### With Custom Handlers

```tsx
<ServiceWorkerUpdater
  registerPath="/custom-service-worker.js"
  scope="/app/"
  onUpdate={(registration) => {
    console.log('Update available:', registration);
    // Custom update handling logic
  }}
  onSuccess={(registration) => {
    console.log('Service worker registered successfully:', registration);
    // Custom success handling logic
  }}
  onOffline={() => {
    console.log('Application is offline');
    // Custom offline handling logic
  }}
/>
```

### Without Update Notification UI

```tsx
<ServiceWorkerUpdater
  showUpdateNotification={false}
  onUpdate={(registration) => {
    // Implement custom UI for update notification
    showCustomUpdateUI();
  }}
/>
```

## Update Notification UI

The ServiceWorkerUpdater includes a built-in notification component that:

1. **Appears non-intrusively**: Slides in from the bottom of the screen
2. **Provides clear messaging**: Informs the user about the available update
3. **Offers action buttons**: Refresh now or dismiss the notification
4. **Handles user interaction**: Processes refresh and dismiss actions
5. **Uses appropriate styling**: Adapts to the application theme

```tsx
const UpdateNotification = ({ onRefresh, onDismiss }: UpdateNotificationProps) => (
  <div className={styles.updateNotification}>
    <span className={styles.updateMessage}>
      <Icon name="refresh" /> New version available
    </span>
    <div className={styles.updateActions}>
      <button 
        className={styles.refreshButton} 
        onClick={onRefresh}
        aria-label="Refresh to update"
      >
        Refresh
      </button>
      {onDismiss && (
        <button 
          className={styles.dismissButton} 
          onClick={onDismiss}
          aria-label="Dismiss update notification"
        >
          Later
        </button>
      )}
    </div>
  </div>
);
```

## Known Limitations

1. **Browser support**: Service worker functionality depends on browser support
2. **HTTPS requirement**: Service workers only work on HTTPS or localhost
3. **Update timing**: Users may continue using an outdated version until they refresh
4. **Multiple tabs**: Update handling across multiple tabs may be inconsistent
5. **Cross-origin limitations**: Service worker scope is limited by same-origin policy
6. **Cache size limits**: Browser storage quotas may limit offline capabilities
7. **Immediate update limitations**: Cannot force immediate updates without user interaction

## Test Coverage

The ServiceWorkerUpdater has specialized test coverage:

- **ServiceWorkerUpdater.test.tsx**: Basic rendering and prop validation tests
- **ServiceWorkerUpdater.mock.test.tsx**: Tests with mocked service worker API
- **ServiceWorkerUpdater.integration.test.tsx**: Integration tests with real service worker behavior

Key tested scenarios include:
- Service worker registration
- Update detection
- Notification display
- Refresh action
- Offline status detection
- Error handling

## Related Components and Utilities

- **OfflineIndicator**: Often used alongside ServiceWorkerUpdater to show offline status
- **sw-register.js**: Service worker registration script
- **service-worker.js**: Main service worker implementation
- **cacheStrategies.js**: Utility for implementing different caching strategies

## Implementation Details

The ServiceWorkerUpdater implements several key algorithms:

1. **Service worker registration**:
   ```typescript
   const registerServiceWorker = async () => {
     try {
       const registration = await navigator.serviceWorker.register(
         registerPath, 
         { scope }
       );
       // Registration successful
       setSwRegistration(registration);
       setupUpdateDetection(registration);
       if (onSuccess) onSuccess(registration);
     } catch (error) {
       console.error('Service worker registration failed:', error);
     }
   };
   ```

2. **Update application function**:
   ```typescript
   const refreshApplication = () => {
     if (swRegistration && swRegistration.waiting) {
       // Send message to waiting service worker to skip waiting
       swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
     }
     
     // Reload the page to activate the new service worker
     window.location.reload();
   };
   ```

3. **Offline detection and handling**:
   ```typescript
   useEffect(() => {
     const handleNetworkChange = () => {
       const isCurrentlyOffline = !navigator.onLine;
       setIsOffline(isCurrentlyOffline);
       if (isCurrentlyOffline && onOffline) onOffline();
     };
     
     window.addEventListener('online', handleNetworkChange);
     window.addEventListener('offline', handleNetworkChange);
     
     return () => {
       window.removeEventListener('online', handleNetworkChange);
       window.removeEventListener('offline', handleNetworkChange);
     };
   }, [onOffline]);
   ```

## Change History

- **2025-04-01**: Enhanced network status detection
- **2025-03-15**: Improved update notification UI and accessibility
- **2025-02-20**: Added periodic update checks
- **2025-02-01**: Implemented custom event handling for service worker lifecycle
- **2025-01-15**: Enhanced caching strategy configuration
- **2025-01-01**: Initial implementation with basic service worker registration
