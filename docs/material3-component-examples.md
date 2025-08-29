# Material 3 Component Usage Examples

## Overview

This document provides comprehensive usage examples for all Material 3 Expressive components implemented in the Mr. Timely application. Each example includes multiple states, variants, and real-world usage scenarios.

## Button Components

### Material3Button

The primary button component with multiple variants and states.

#### Basic Usage

```tsx
import { Material3Button } from '../components/ui/Material3Button';

// Filled button (primary action)
<Material3Button variant="filled" size="medium">
  Start Timer
</Material3Button>

// Outlined button (secondary action)
<Material3Button variant="outlined" size="medium">
  Edit Activity
</Material3Button>

// Text button (tertiary action)
<Material3Button variant="text" size="small">
  Cancel
</Material3Button>
```

#### All Variants and Sizes

```tsx
const ButtonShowcase = () => (
  <div className="button-showcase">
    {/* Filled Buttons */}
    <div className="button-group">
      <h3>Filled Buttons</h3>
      <Material3Button variant="filled" size="small">Small</Material3Button>
      <Material3Button variant="filled" size="medium">Medium</Material3Button>
      <Material3Button variant="filled" size="large">Large</Material3Button>
    </div>

    {/* Outlined Buttons */}
    <div className="button-group">
      <h3>Outlined Buttons</h3>
      <Material3Button variant="outlined" size="small">Small</Material3Button>
      <Material3Button variant="outlined" size="medium">Medium</Material3Button>
      <Material3Button variant="outlined" size="large">Large</Material3Button>
    </div>

    {/* Text Buttons */}
    <div className="button-group">
      <h3>Text Buttons</h3>
      <Material3Button variant="text" size="small">Small</Material3Button>
      <Material3Button variant="text" size="medium">Medium</Material3Button>
      <Material3Button variant="text" size="large">Large</Material3Button>
    </div>
  </div>
);
```

#### Button States

```tsx
const ButtonStates = () => (
  <div className="button-states">
    {/* Default State */}
    <Material3Button variant="filled">Default</Material3Button>

    {/* Disabled State */}
    <Material3Button variant="filled" disabled>Disabled</Material3Button>

    {/* Loading State */}
    <Material3Button variant="filled" loading>Loading...</Material3Button>

    {/* With Icon */}
    <Material3Button variant="filled" startIcon={<PlayIcon />}>
      Start Timer
    </Material3Button>

    {/* Icon Only */}
    <Material3Button variant="filled" iconOnly aria-label="Play">
      <PlayIcon />
    </Material3Button>
  </div>
);
```

#### Interactive Examples

```tsx
const InteractiveButtonExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleAsyncAction = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCount(prev => prev + 1);
    setIsLoading(false);
  };

  return (
    <div className="interactive-example">
      <Material3Button
        variant="filled"
        onClick={handleAsyncAction}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : `Click me (${count})`}
      </Material3Button>
    </div>
  );
};
```

### Material3AnimatedButton

Enhanced button with built-in animations and micro-interactions.

```tsx
import { Material3AnimatedButton } from '../components/ui/Material3AnimatedButton';

// Button with ripple effect
<Material3AnimatedButton
  variant="filled"
  rippleEffect={true}
  hoverScale={1.02}
  pressScale={0.98}
>
  Animated Button
</Material3AnimatedButton>

// Button with custom animation
<Material3AnimatedButton
  variant="outlined"
  customAnimation="pulse"
  animationDuration={300}
>
  Pulse Animation
</Material3AnimatedButton>
```

## Text Field Components

### Material3TextField

Primary text input component with floating labels and validation.

#### Basic Usage

```tsx
import { Material3TextField } from '../components/ui/Material3TextField';

// Outlined text field (default)
<Material3TextField
  label="Activity Name"
  placeholder="Enter activity name"
  required
/>

// Filled text field
<Material3TextField
  variant="filled"
  label="Duration (minutes)"
  type="number"
  min={1}
  max={120}
/>
```

#### All Variants and States

```tsx
const TextFieldShowcase = () => {
  const [values, setValues] = useState({
    outlined: '',
    filled: '',
    error: 'invalid-email',
    disabled: 'Disabled value',
    multiline: 'This is a\nmultiline text field\nwith multiple lines',
  });

  const [errors, setErrors] = useState({
    error: 'Please enter a valid email address',
  });

  return (
    <div className="textfield-showcase">
      {/* Outlined Variant */}
      <Material3TextField
        variant="outlined"
        label="Outlined Field"
        value={values.outlined}
        onChange={(e) => setValues(prev => ({ ...prev, outlined: e.target.value }))}
        helperText="This is helper text"
      />

      {/* Filled Variant */}
      <Material3TextField
        variant="filled"
        label="Filled Field"
        value={values.filled}
        onChange={(e) => setValues(prev => ({ ...prev, filled: e.target.value }))}
      />

      {/* Error State */}
      <Material3TextField
        variant="outlined"
        label="Email"
        type="email"
        value={values.error}
        onChange={(e) => setValues(prev => ({ ...prev, error: e.target.value }))}
        error={!!errors.error}
        helperText={errors.error}
      />

      {/* Disabled State */}
      <Material3TextField
        variant="outlined"
        label="Disabled Field"
        value={values.disabled}
        disabled
      />

      {/* Multiline */}
      <Material3TextField
        variant="outlined"
        label="Description"
        multiline
        rows={4}
        value={values.multiline}
        onChange={(e) => setValues(prev => ({ ...prev, multiline: e.target.value }))}
      />

      {/* With Start Icon */}
      <Material3TextField
        variant="outlined"
        label="Search"
        startIcon={<SearchIcon />}
        placeholder="Search activities..."
      />

      {/* With End Icon */}
      <Material3TextField
        variant="outlined"
        label="Password"
        type="password"
        endIcon={<VisibilityIcon />}
      />
    </div>
  );
};
```

#### Form Integration

```tsx
const ActivityForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Activity name is required';
    }
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Submit form
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <Material3TextField
        variant="outlined"
        label="Activity Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={!!errors.name}
        helperText={errors.name}
        required
      />

      <Material3TextField
        variant="outlined"
        label="Duration (minutes)"
        type="number"
        value={formData.duration}
        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
        error={!!errors.duration}
        helperText={errors.duration}
        min={1}
        max={120}
        required
      />

      <Material3TextField
        variant="filled"
        label="Description"
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Optional description..."
      />

      <div className="form-actions">
        <Material3Button type="submit" variant="filled">
          Create Activity
        </Material3Button>
        <Material3Button type="button" variant="text">
          Cancel
        </Material3Button>
      </div>
    </form>
  );
};
```

## Card Components

### Material3Card

Elevated container component with multiple variants.

#### Basic Usage

```tsx
import { Material3Card } from '../components/ui/Material3Card';

// Elevated card (default)
<Material3Card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</Material3Card>

// Filled card
<Material3Card variant="filled">
  <h3>Filled Card</h3>
  <p>This card has a filled background.</p>
</Material3Card>

// Outlined card
<Material3Card variant="outlined">
  <h3>Outlined Card</h3>
  <p>This card has an outlined border.</p>
</Material3Card>
```

#### Card with Actions

```tsx
const ActionCard = () => (
  <Material3Card className="action-card">
    <div className="card-content">
      <h3>Focus Session</h3>
      <p>25-minute deep work session</p>
      <div className="card-metadata">
        <span className="duration">25 min</span>
        <span className="priority high">High Priority</span>
      </div>
    </div>
    <div className="card-actions">
      <Material3Button variant="text" size="small">
        Edit
      </Material3Button>
      <Material3Button variant="filled" size="small">
        Start
      </Material3Button>
    </div>
  </Material3Card>
);
```

#### Interactive Card States

```tsx
const InteractiveCard = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Material3Card
      variant="elevated"
      className={`interactive-card ${isSelected ? 'selected' : ''}`}
      onClick={() => setIsSelected(!isSelected)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div className="card-header">
        <h4>Selectable Card</h4>
        {isSelected && <CheckIcon className="selected-icon" />}
      </div>
      <p>Click to select this card</p>
    </Material3Card>
  );
};
```

### Material3StatsCard

Specialized card for displaying statistics and metrics.

```tsx
import { Material3StatsCard } from '../components/ui/Material3StatsCard';

const StatsExample = () => (
  <div className="stats-grid">
    <Material3StatsCard
      title="Total Time"
      value="2h 45m"
      change="+15%"
      changeType="positive"
      icon={<TimeIcon />}
    />

    <Material3StatsCard
      title="Activities Completed"
      value="12"
      change="-2"
      changeType="negative"
      icon={<CheckIcon />}
    />

    <Material3StatsCard
      title="Focus Score"
      value="87%"
      change="+5%"
      changeType="positive"
      icon={<TrendingUpIcon />}
      showProgress={true}
      progressValue={87}
    />
  </div>
);
```

## Container Components

### Material3Container

Flexible container component with responsive behavior.

```tsx
import { Material3Container } from '../components/ui/Material3Container';

// Basic container
<Material3Container>
  <h2>Container Content</h2>
  <p>This content is wrapped in a Material 3 container.</p>
</Material3Container>

// Container with specific width
<Material3Container maxWidth="md">
  <h2>Medium Width Container</h2>
  <p>This container has a maximum width constraint.</p>
</Material3Container>

// Elevated container
<Material3Container elevation="level2" padding="large">
  <h2>Elevated Container</h2>
  <p>This container has elevation and large padding.</p>
</Material3Container>
```

## Navigation Components

### Navigation

Main navigation component with pill-shaped indicators.

```tsx
import { Navigation } from '../components/Navigation';

const NavigationExample = () => {
  const [activeItem, setActiveItem] = useState('/timer');

  const navigationItems = [
    { label: 'Timer', href: '/timer', icon: <TimerIcon /> },
    { label: 'Activities', href: '/activities', icon: <ListIcon /> },
    { label: 'Summary', href: '/summary', icon: <BarChartIcon /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <Navigation
      items={navigationItems}
      activeItem={activeItem}
      onItemClick={setActiveItem}
      variant="horizontal" // or "vertical"
    />
  );
};
```

## Activity Components

### ActivityManagerMaterial3

Comprehensive activity management interface.

```tsx
import { ActivityManagerMaterial3 } from '../components/ActivityManagerMaterial3';

const ActivityManagerExample = () => {
  const [activities, setActivities] = useState([
    {
      id: '1',
      name: 'Deep Work Session',
      duration: 25,
      completed: false,
      priority: 'high',
      color: '#6750A4',
    },
    {
      id: '2',
      name: 'Email Review',
      duration: 15,
      completed: true,
      priority: 'medium',
      color: '#625B71',
    },
  ]);

  const handleActivityAdd = (activity) => {
    setActivities(prev => [...prev, { ...activity, id: Date.now().toString() }]);
  };

  const handleActivityUpdate = (id, updates) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  };

  const handleActivityDelete = (id) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  return (
    <ActivityManagerMaterial3
      activities={activities}
      onActivityAdd={handleActivityAdd}
      onActivityUpdate={handleActivityUpdate}
      onActivityDelete={handleActivityDelete}
      showAddButton={true}
      allowReordering={true}
    />
  );
};
```

### ActivityButtonMaterial3

Individual activity card component.

```tsx
import { ActivityButtonMaterial3 } from '../components/ActivityButtonMaterial3';

const ActivityButtonExample = () => {
  const [activity, setActivity] = useState({
    id: '1',
    name: 'Focus Session',
    duration: 25,
    completed: false,
    isActive: false,
    priority: 'high',
    color: '#6750A4',
  });

  return (
    <div className="activity-examples">
      {/* Default State */}
      <ActivityButtonMaterial3
        activity={activity}
        onStart={() => setActivity(prev => ({ ...prev, isActive: true }))}
        onStop={() => setActivity(prev => ({ ...prev, isActive: false }))}
        onComplete={() => setActivity(prev => ({ ...prev, completed: true }))}
        onEdit={() => console.log('Edit activity')}
        onDelete={() => console.log('Delete activity')}
      />

      {/* Active State */}
      <ActivityButtonMaterial3
        activity={{ ...activity, isActive: true }}
        onStop={() => console.log('Stop activity')}
      />

      {/* Completed State */}
      <ActivityButtonMaterial3
        activity={{ ...activity, completed: true }}
        onRestart={() => console.log('Restart activity')}
      />
    </div>
  );
};
```

## Form Components

### TimeSetupMaterial3

Time setup component with floating labels and segmented controls.

```tsx
import { TimeSetupMaterial3 } from '../components/TimeSetupMaterial3';

const TimeSetupExample = () => {
  const [timeConfig, setTimeConfig] = useState({
    mode: 'duration', // 'duration' or 'deadline'
    duration: 25,
    deadline: null,
    breakDuration: 5,
  });

  const handleTimeSetup = (config) => {
    setTimeConfig(config);
    console.log('Time setup:', config);
  };

  return (
    <TimeSetupMaterial3
      initialConfig={timeConfig}
      onTimeSetup={handleTimeSetup}
      showBreakSettings={true}
      allowCustomDurations={true}
      presetDurations={[15, 25, 45, 60]}
    />
  );
};
```

### ActivityFormMaterial3

Comprehensive form for creating and editing activities.

```tsx
import { ActivityFormMaterial3 } from '../components/ActivityFormMaterial3';

const ActivityFormExample = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const handleSave = (activityData) => {
    if (isEditing) {
      console.log('Update activity:', activityData);
    } else {
      console.log('Create activity:', activityData);
    }
    setIsEditing(false);
    setEditingActivity(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingActivity(null);
  };

  return (
    <div className="activity-form-example">
      <Material3Button
        variant="filled"
        onClick={() => setIsEditing(true)}
      >
        Add New Activity
      </Material3Button>

      {isEditing && (
        <ActivityFormMaterial3
          activity={editingActivity}
          onSave={handleSave}
          onCancel={handleCancel}
          showAdvancedOptions={true}
        />
      )}
    </div>
  );
};
```

## Summary Components

### SummaryMaterial3

Expressive summary dashboard with data visualization.

```tsx
import { SummaryMaterial3 } from '../components/SummaryMaterial3';

const SummaryExample = () => {
  const summaryData = {
    totalTime: 165, // minutes
    completedActivities: 8,
    focusScore: 87,
    productivity: 'high',
    activities: [
      {
        name: 'Deep Work',
        duration: 50,
        completed: true,
        efficiency: 95,
      },
      {
        name: 'Email Review',
        duration: 25,
        completed: true,
        efficiency: 78,
      },
      {
        name: 'Planning',
        duration: 30,
        completed: false,
        efficiency: 0,
      },
    ],
    timeDistribution: {
      focused: 120,
      breaks: 25,
      interruptions: 20,
    },
  };

  return (
    <SummaryMaterial3
      data={summaryData}
      showDetailedBreakdown={true}
      showProductivityTrends={true}
      showRecommendations={true}
      onExport={() => console.log('Export summary')}
      onShare={() => console.log('Share summary')}
    />
  );
};
```

## Mobile-Optimized Components

### Material3MobileButton

Touch-optimized button for mobile devices.

```tsx
import { Material3MobileButton } from '../components/ui/Material3MobileButton';

const MobileButtonExample = () => (
  <div className="mobile-button-examples">
    {/* Large touch target */}
    <Material3MobileButton
      variant="filled"
      size="large"
      fullWidth
    >
      Start Focus Session
    </Material3MobileButton>

    {/* Button with haptic feedback */}
    <Material3MobileButton
      variant="outlined"
      hapticFeedback={true}
      rippleEffect={true}
    >
      Quick Action
    </Material3MobileButton>

    {/* Floating action button */}
    <Material3MobileButton
      variant="fab"
      position="bottom-right"
      aria-label="Add new activity"
    >
      <AddIcon />
    </Material3MobileButton>
  </div>
);
```

### Material3MobileTextField

Mobile-optimized text input with enhanced touch experience.

```tsx
import { Material3MobileTextField } from '../components/ui/Material3MobileTextField';

const MobileTextFieldExample = () => (
  <div className="mobile-textfield-examples">
    {/* Numeric input with mobile keyboard */}
    <Material3MobileTextField
      label="Duration (minutes)"
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
    />

    {/* Text input with suggestions */}
    <Material3MobileTextField
      label="Activity Name"
      autoComplete="off"
      suggestions={['Deep Work', 'Email Review', 'Planning']}
    />

    {/* Large touch target for mobile */}
    <Material3MobileTextField
      label="Notes"
      multiline
      rows={4}
      touchOptimized={true}
    />
  </div>
);
```

## Animation Components

### Material3AnimatedTextField

Text field with enhanced animations and micro-interactions.

```tsx
import { Material3AnimatedTextField } from '../components/ui/Material3AnimatedTextField';

const AnimatedTextFieldExample = () => (
  <div className="animated-textfield-examples">
    {/* Smooth label animation */}
    <Material3AnimatedTextField
      label="Activity Name"
      animationType="smooth"
      focusAnimation="scale"
    />

    {/* Bouncy animation */}
    <Material3AnimatedTextField
      label="Duration"
      animationType="bouncy"
      validationAnimation="shake"
    />

    {/* Custom animation timing */}
    <Material3AnimatedTextField
      label="Description"
      animationDuration={400}
      animationEasing="emphasized"
    />
  </div>
);
```

### Material3PageTransition

Page transition component with shared element animations.

```tsx
import { Material3PageTransition } from '../components/ui/Material3PageTransition';

const PageTransitionExample = () => {
  const [currentPage, setCurrentPage] = useState('timer');

  return (
    <Material3PageTransition
      currentPage={currentPage}
      transitionType="slide"
      direction="horizontal"
      duration={300}
    >
      {currentPage === 'timer' && <TimerPage />}
      {currentPage === 'activities' && <ActivitiesPage />}
      {currentPage === 'summary' && <SummaryPage />}
    </Material3PageTransition>
  );
};
```

## Usage Best Practices

### Component Composition

```tsx
// Good: Compose components for complex interfaces
const ActivityDashboard = () => (
  <Material3Container maxWidth="lg">
    <div className="dashboard-header">
      <h1 className="md-typescale-headline-large">Activity Dashboard</h1>
      <Material3Button variant="filled" startIcon={<AddIcon />}>
        New Activity
      </Material3Button>
    </div>
    
    <div className="dashboard-content">
      <Material3Card variant="elevated">
        <TimeSetupMaterial3 onTimeSetup={handleTimeSetup} />
      </Material3Card>
      
      <ActivityManagerMaterial3
        activities={activities}
        onActivityAdd={handleActivityAdd}
      />
    </div>
  </Material3Container>
);
```

### State Management

```tsx
// Good: Use proper state management for complex components
const useActivityManager = () => {
  const [activities, setActivities] = useState([]);
  const [activeActivity, setActiveActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addActivity = useCallback((activity) => {
    setActivities(prev => [...prev, { ...activity, id: generateId() }]);
  }, []);

  const updateActivity = useCallback((id, updates) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  }, []);

  return {
    activities,
    activeActivity,
    isLoading,
    addActivity,
    updateActivity,
  };
};
```

### Accessibility Integration

```tsx
// Good: Include accessibility features in component usage
const AccessibleActivityButton = ({ activity, onStart }) => (
  <Material3Button
    variant="filled"
    onClick={onStart}
    aria-label={`Start ${activity.name} for ${activity.duration} minutes`}
    aria-describedby={`activity-${activity.id}-description`}
  >
    Start {activity.name}
    <span 
      id={`activity-${activity.id}-description`}
      className="sr-only"
    >
      Duration: {activity.duration} minutes, Priority: {activity.priority}
    </span>
  </Material3Button>
);
```

This comprehensive examples document provides real-world usage patterns for all Material 3 components, demonstrating proper implementation, state management, and accessibility considerations.