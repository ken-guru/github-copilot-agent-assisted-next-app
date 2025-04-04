# ErrorBoundary Component

## Overview

The ErrorBoundary component provides a mechanism for catching and handling JavaScript errors that occur within its child component tree. It prevents errors in one part of the UI from breaking the entire application, allowing for graceful degradation and helpful error messages. This component is essential for application stability and user experience during unexpected errors.

## Features

- **Error Catching**: Captures JavaScript errors in component rendering and lifecycle methods
- **Fallback UI**: Displays a user-friendly fallback interface when errors occur
- **Error Reporting**: Supports error logging and reporting to monitoring services
- **Recovery Options**: Provides ways for users to recover from errors
- **Component Isolation**: Prevents error propagation to other parts of the application
- **Development Feedback**: Enhanced error information in development mode
- **Production Stability**: Simplified, user-friendly messages in production
- **Reset Capability**: Allows resetting the error state to retry rendering

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Child components to be rendered and protected |
| `fallback` | `ReactNode \| ((error: Error, reset: () => void) => ReactNode)` | No | - | Custom fallback UI or render function |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | No | - | Callback for error reporting |
| `resetKeys` | `any[]` | No | `[]` | Dependencies that trigger automatic reset when changed |

## Types

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: any[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

## State Management

The ErrorBoundary is implemented as a class component to leverage React's error boundary lifecycle methods:

```typescript
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report the error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  // Additional lifecycle methods for handling resetKeys and reset functionality
  // ...
}
```

Key state management aspects include:

1. **Error state tracking**: Monitors whether an error has occurred
2. **Error information**: Stores the actual error object for display and reporting
3. **Reset mechanism**: Provides a method to clear the error state and retry rendering

## Error Recovery Process

The ErrorBoundary implements a multi-faceted recovery system:

1. **Manual reset**: Exposes a reset method that clears the error state
   ```typescript
   reset = () => {
     this.setState({
       hasError: false,
       error: null
     });
   };
   ```

2. **Automatic reset**: Resets when specified dependencies change
   ```typescript
   componentDidUpdate(prevProps: ErrorBoundaryProps) {
     if (this.state.hasError) {
       // Check if any resetKeys have changed
       const resetKeysChanged = this.props.resetKeys?.some(
         (key, i) => key !== prevProps.resetKeys?.[i]
       );
       
       if (resetKeysChanged) {
         this.reset();
       }
     }
   }
   ```

3. **Recovery UI**: Provides UI controls for users to trigger reset manually

## Fallback UI System

The ErrorBoundary offers flexible fallback UI options:

1. **Default fallback**: Simple error message with reset button
   ```tsx
   const DefaultFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
     <div className={styles.errorContainer}>
       <h2>Something went wrong</h2>
       <p className={styles.errorMessage}>
         {process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while rendering this component.'}
       </p>
       <button onClick={reset} className={styles.resetButton}>
         Try Again
       </button>
     </div>
   );
   ```

2. **Custom component**: Use any React component as fallback
   ```tsx
   <ErrorBoundary fallback={<CustomErrorComponent />}>
     {/* Protected components */}
   </ErrorBoundary>
   ```

3. **Render function**: Dynamic fallback based on error details
   ```tsx
   <ErrorBoundary
     fallback={(error, reset) => (
       <div>
         <p>Error type: {error.name}</p>
         <button onClick={reset}>Reset</button>
       </div>
     )}
   >
     {/* Protected components */}
   </ErrorBoundary>
   ```

## Theme Compatibility

The ErrorBoundary adapts to the application theme:

- **Theme-aware styling**: Uses CSS variables for consistent theming
- **Contrast maintenance**: Ensures error messages are readable in all themes
- **Visual consistency**: Error UI matches the overall application design
- **Focus indicators**: Themed focus states for interactive elements
- **Icon theming**: Error icons adapt to current theme

## Mobile Responsiveness

The component is designed to be fully responsive:

- **Flexible layout**: Adapts to any screen size
- **Touch-friendly controls**: Reset buttons sized appropriately for touch
- **Appropriate spacing**: Comfortable spacing on small screens
- **Text wrapping**: Error messages wrap appropriately on narrow displays
- **Responsive typography**: Font sizes adjust based on viewport width

## Accessibility

- **Semantic structure**: Uses appropriate heading levels and landmarks
- **Focus management**: Shifts focus to the error message when an error occurs
- **ARIA attributes**: Uses appropriate ARIA roles and attributes
- **Keyboard navigation**: Full keyboard support for error recovery actions
- **High contrast**: Maintains readability in high-contrast modes
- **Screen reader announcements**: Announces errors to screen readers

## Example Usage

### Basic Usage

```tsx
import ErrorBoundary from '../components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

```tsx
<ErrorBoundary
  fallback={
    <div className="custom-error">
      <h3>Oops! Something went wrong</h3>
      <p>Please try refreshing the page</p>
    </div>
  }
>
  <ComplexComponent />
</ErrorBoundary>
```

### With Error Reporting

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Caught error:', error, errorInfo);
    logErrorToService(error, errorInfo);
  }}
>
  <UserDashboard />
</ErrorBoundary>
```

### With Reset Keys

```tsx
function FeatureWithRetry({ userId }) {
  const [retryCount, setRetryCount] = useState(0);
  
  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };
  
  return (
    <ErrorBoundary resetKeys={[userId, retryCount]}>
      <UserProfile userId={userId} />
      <button onClick={handleRetry}>Refresh Data</button>
    </ErrorBoundary>
  );
}
```

## Nesting and Composition

The ErrorBoundary component supports flexible composition patterns:

1. **Global error handling**: Wrap the entire application for last-resort catching
   ```tsx
   <ErrorBoundary>
     <App />
   </ErrorBoundary>
   ```

2. **Feature-level isolation**: Protect specific features independently
   ```tsx
   <div className="app">
     <Header />
     <ErrorBoundary>
       <MainContent />
     </ErrorBoundary>
     <Footer />
   </div>
   ```

3. **Nested boundaries**: Use multiple boundaries for granular error handling
   ```tsx
   <ErrorBoundary fallback={<AppError />}>
     <Layout>
       <Sidebar />
       <ErrorBoundary fallback={<ContentError />}>
         <MainContent />
       </ErrorBoundary>
     </Layout>
   </ErrorBoundary>
   ```

## Known Limitations

1. **Async errors**: Doesn't catch errors in event handlers or async operations
2. **Server-side rendering**: Doesn't catch errors during server-side rendering
3. **Cross-boundary errors**: Doesn't catch errors thrown in other error boundaries
4. **React updates**: May need maintenance as React error boundary API evolves
5. **Framework integration**: Requires additional configuration with frameworks like Next.js

## Test Coverage

The ErrorBoundary component has thorough test coverage:

- **ErrorBoundary.test.tsx**: Core functionality tests
- **ErrorBoundary.rendering.test.tsx**: Tests for different rendering scenarios
- **ErrorBoundary.reset.test.tsx**: Tests for reset functionality

Key tested scenarios include:
- Error capturing and state updates
- Various fallback rendering options
- Manual reset functionality
- Reset via dependency changes
- Error reporting callback invocation
- Successful recovery after errors

## Related Components and Utilities

- **ErrorPage**: Full-page error display for critical errors
- **ErrorLogger**: Service for logging and reporting errors
- **useErrorHandler**: Hook for handling errors in function components
- **withErrorBoundary**: HOC for adding error boundary to class components

## Implementation Details

The ErrorBoundary leverages React's error boundary lifecycle methods:

1. **Static error handling**:
   ```typescript
   static getDerivedStateFromError(error: Error) {
     return { hasError: true, error };
   }
   ```

2. **Error reporting**:
   ```typescript
   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
     if (this.props.onError) {
       this.props.onError(error, errorInfo);
     }
     
     // Optional: log to monitoring service
     if (process.env.NODE_ENV === 'production') {
       console.error('ErrorBoundary caught an error', error, errorInfo);
       // logErrorToService(error, errorInfo);
     }
   }
   ```

3. **Render logic**:
   ```typescript
   render() {
     if (this.state.hasError) {
       if (typeof this.props.fallback === 'function') {
         return this.props.fallback(this.state.error!, this.reset);
       }
       
       if (this.props.fallback) {
         return this.props.fallback;
       }
       
       return <DefaultFallback error={this.state.error!} reset={this.reset} />;
     }
     
     return this.props.children;
   }
   ```

## Change History

- **2025-03-15**: Added automatic reset via resetKeys
- **2025-03-01**: Enhanced error reporting capabilities
- **2025-02-15**: Improved accessibility of error messages
- **2025-02-01**: Added theme compatibility
- **2025-01-15**: Enhanced development mode error details
- **2025-01-01**: Initial implementation with basic error boundary functionality
