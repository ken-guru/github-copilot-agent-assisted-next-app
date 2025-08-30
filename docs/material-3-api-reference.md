# Material 3 Component API Reference

This document provides detailed API references for all Material 3 components in the design system.

## Table of Contents

1. [Button](#button)
2. [Card](#card)
3. [TextField](#textfield)
4. [Typography](#typography)
5. [Navigation](#navigation)
6. [Layout](#layout)
7. [Surface](#surface)
8. [Animation](#animation)

## Button

### Material3Button

The Material3Button component provides five variants following Material Design 3 guidelines.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'filledTonal' \| 'outlined' \| 'text' \| 'icon'` | `'filled'` | Button visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `fullWidth` | `boolean` | `false` | Whether button takes full width |
| `icon` | `string \| ReactNode` | - | Icon to display (for icon buttons) |
| `startIcon` | `ReactNode` | - | Icon before text |
| `endIcon` | `ReactNode` | - | Icon after text |
| `loading` | `boolean` | `false` | Whether button shows loading state |
| `loadingText` | `string` | - | Text to show when loading |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Button content |

#### Examples

```tsx
import { Material3Button } from '@/design-system/components/Button';
import { SaveIcon, LoadingIcon } from '@/design-system/icons';

// Basic filled button
<Material3Button variant="filled" onClick={handleSave}>
  Save Changes
</Material3Button>

// Button with icon
<Material3Button 
  variant="filledTonal" 
  startIcon={<SaveIcon />}
  onClick={handleSave}
>
  Save Draft
</Material3Button>

// Loading button
<Material3Button 
  variant="filled"
  loading={isLoading}
  loadingText="Saving..."
  disabled={isLoading}
  onClick={handleSave}
>
  Save Changes
</Material3Button>

// Icon button
<Material3Button 
  variant="icon"
  icon={<SaveIcon />}
  aria-label="Save document"
  onClick={handleSave}
/>

// Full width button
<Material3Button 
  variant="filled"
  fullWidth
  size="large"
  onClick={handleSubmit}
>
  Continue
</Material3Button>
```

#### Accessibility

- Automatically includes proper ARIA attributes
- Supports keyboard navigation (Enter/Space)
- Shows focus indicators meeting WCAG contrast requirements
- Loading state announces to screen readers
- Icon buttons require `aria-label` prop

#### Styling

The button component uses CSS custom properties for theming:

```css
.material3-button {
  /* Color tokens */
  --button-color: var(--m3-color-primary);
  --button-on-color: var(--m3-color-on-primary);
  
  /* Shape tokens */
  --button-shape: var(--m3-shape-corner-full);
  
  /* Spacing tokens */
  --button-padding-horizontal: var(--m3-spacing-lg);
  --button-padding-vertical: var(--m3-spacing-sm);
}
```

## Card

### Material3Card

A versatile container component that groups related content and actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'elevated' \| 'filled' \| 'outlined'` | `'elevated'` | Card visual style |
| `interactive` | `boolean` | `false` | Whether card is clickable |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler for interactive cards |
| `disabled` | `boolean` | `false` | Whether card is disabled |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Card content |

#### Subcomponents

##### Material3Card.Header

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatar` | `ReactNode` | - | Avatar or icon |
| `title` | `ReactNode` | - | Primary title |
| `subtitle` | `ReactNode` | - | Secondary subtitle |
| `action` | `ReactNode` | - | Action button or menu |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Custom header content |

##### Material3Card.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Card body content |

##### Material3Card.Actions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignment` | `'start' \| 'end' \| 'between'` | `'end'` | Action button alignment |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Action buttons |

##### Material3Card.Media

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | - | Image URL |
| `alt` | `string` | - | Image alt text |
| `height` | `number \| string` | `200` | Media height |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Custom media content |

#### Examples

```tsx
import { Material3Card } from '@/design-system/components/Card';
import { Material3Button } from '@/design-system/components/Button';
import { Typography } from '@/design-system/components/Typography';
import { MoreVertIcon, FavoriteIcon } from '@/design-system/icons';

// Basic card
<Material3Card variant="elevated">
  <Material3Card.Header>
    <Typography variant="titleLarge">Card Title</Typography>
  </Material3Card.Header>
  <Material3Card.Content>
    <Typography variant="bodyMedium">
      Card content goes here with some descriptive text.
    </Typography>
  </Material3Card.Content>
  <Material3Card.Actions>
    <Material3Button variant="text">Action 1</Material3Button>
    <Material3Button variant="text">Action 2</Material3Button>
  </Material3Card.Actions>
</Material3Card>

// Card with media
<Material3Card variant="outlined">
  <Material3Card.Media 
    image="/path/to/image.jpg"
    alt="Description of image"
    height={240}
  />
  <Material3Card.Header
    title="Activity Name"
    subtitle="5 minutes ago"
    action={<Material3Button variant="icon" icon={<MoreVertIcon />} />}
  />
  <Material3Card.Content>
    <Typography variant="bodyMedium">
      Activity description and details.
    </Typography>
  </Material3Card.Content>
</Material3Card>

// Interactive card
<Material3Card 
  variant="filled"
  interactive
  onClick={handleCardClick}
  aria-label="Open activity details"
>
  <Material3Card.Content>
    <Typography variant="titleMedium">Morning Routine</Typography>
    <Typography variant="bodySmall" color="secondary">
      25 minutes remaining
    </Typography>
  </Material3Card.Content>
</Material3Card>
```

#### Accessibility

- Interactive cards are keyboard accessible
- Proper ARIA labels for screen readers
- Focus indicators for keyboard navigation
- Semantic HTML structure

## TextField

### Material3TextField

A Material 3 text input component with built-in validation and accessibility features.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined'` | `'outlined'` | Visual style |
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value |
| `defaultValue` | `string` | - | Default input value |
| `onChange` | `(value: string, event: ChangeEvent) => void` | - | Change handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus handler |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | Input type |
| `multiline` | `boolean` | `false` | Whether input is multiline |
| `rows` | `number` | `3` | Number of rows (multiline only) |
| `maxRows` | `number` | - | Maximum rows (multiline only) |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `readOnly` | `boolean` | `false` | Whether input is read-only |
| `required` | `boolean` | `false` | Whether input is required |
| `error` | `string \| boolean` | `false` | Error state or message |
| `helperText` | `string` | - | Helper text below input |
| `startAdornment` | `ReactNode` | - | Content before input |
| `endAdornment` | `ReactNode` | - | Content after input |
| `autoComplete` | `string` | - | Autocomplete attribute |
| `autoFocus` | `boolean` | `false` | Whether to auto-focus |
| `maxLength` | `number` | - | Maximum character length |
| `className` | `string` | - | Additional CSS classes |

#### Examples

```tsx
import { Material3TextField } from '@/design-system/components/TextField';
import { SearchIcon, VisibilityIcon, VisibilityOffIcon } from '@/design-system/icons';

// Basic text field
<Material3TextField
  label="Email address"
  type="email"
  value={email}
  onChange={(value) => setEmail(value)}
  placeholder="Enter your email"
  autoComplete="email"
  required
/>

// Password field with toggle
function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Material3TextField
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={setPassword}
      endAdornment={
        <Material3Button
          variant="icon"
          icon={showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        />
      }
      required
    />
  );
}

// Search field
<Material3TextField
  label="Search activities"
  value={searchQuery}
  onChange={setSearchQuery}
  startAdornment={<SearchIcon />}
  placeholder="Type to search..."
/>

// Multiline text field
<Material3TextField
  label="Description"
  multiline
  rows={4}
  maxRows={8}
  value={description}
  onChange={setDescription}
  helperText="Describe your activity in detail"
  maxLength={500}
/>

// Error state
<Material3TextField
  label="Username"
  value={username}
  onChange={setUsername}
  error={usernameError}
  helperText={usernameError || "Choose a unique username"}
  required
/>
```

#### Validation

The TextField component includes built-in validation:

```tsx
import { useForm } from '@/hooks/useForm';

function ContactForm() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', message: '' },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Invalid email';
      if (!values.message) errors.message = 'Message is required';
      return errors;
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Material3TextField
        label="Email"
        type="email"
        value={values.email}
        onChange={(value) => handleChange('email', value)}
        error={errors.email}
        required
      />
      <Material3TextField
        label="Message"
        multiline
        rows={4}
        value={values.message}
        onChange={(value) => handleChange('message', value)}
        error={errors.message}
        required
      />
    </form>
  );
}
```

## Typography

### Typography

The Typography component provides semantic text styling following Material 3 guidelines.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | TypographyVariant | `'bodyMedium'` | Typography style variant |
| `component` | `string \| ComponentType` | - | HTML element or React component |
| `color` | `'primary' \| 'secondary' \| 'disabled' \| string` | - | Text color |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | - | Text alignment |
| `gutterBottom` | `boolean` | `false` | Whether to add bottom margin |
| `noWrap` | `boolean` | `false` | Whether to prevent text wrapping |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Text content |

#### Typography Variants

```tsx
type TypographyVariant = 
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';
```

#### Examples

```tsx
import { Typography } from '@/design-system/components/Typography';

// Page heading
<Typography variant="displayLarge" component="h1" gutterBottom>
  Welcome to Mr. Timely
</Typography>

// Section title
<Typography variant="headlineMedium" component="h2" gutterBottom>
  Your Activities
</Typography>

// Card title
<Typography variant="titleLarge" component="h3">
  Morning Routine
</Typography>

// Body text
<Typography variant="bodyLarge">
  Start your day with a structured morning routine to boost productivity.
</Typography>

// Caption text
<Typography variant="bodySmall" color="secondary">
  Last updated 5 minutes ago
</Typography>

// Label text
<Typography variant="labelMedium" component="label" htmlFor="email-input">
  Email Address
</Typography>

// Centered text
<Typography variant="bodyMedium" align="center" gutterBottom>
  No activities found. Create your first activity to get started.
</Typography>

// Truncated text
<Typography variant="bodyMedium" noWrap>
  This is a very long text that will be truncated with ellipsis
</Typography>
```

#### Responsive Typography

Typography automatically scales on different screen sizes:

```tsx
// Responsive display text
<Typography 
  variant="displayLarge"
  sx={{
    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
  }}
>
  Responsive Heading
</Typography>
```

## Navigation

### NavigationRail

Vertical navigation component for desktop and tablet layouts.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Navigation items |
| `className` | `string` | - | Additional CSS classes |

#### NavigationRail.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | - | Item icon |
| `label` | `string` | - | Item label |
| `active` | `boolean` | `false` | Whether item is active |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |
| `href` | `string` | - | Link URL (for navigation) |
| `badge` | `number \| string` | - | Badge content |
| `className` | `string` | - | Additional CSS classes |

#### Examples

```tsx
import { NavigationRail } from '@/design-system/components/Navigation';
import { HomeIcon, SettingsIcon, ActivityIcon } from '@/design-system/icons';

<NavigationRail>
  <NavigationRail.Item
    icon={<HomeIcon />}
    label="Home"
    active={currentPage === 'home'}
    onClick={() => navigate('/home')}
  />
  <NavigationRail.Item
    icon={<ActivityIcon />}
    label="Activities"
    active={currentPage === 'activities'}
    onClick={() => navigate('/activities')}
    badge={3}
  />
  <NavigationRail.Item
    icon={<SettingsIcon />}
    label="Settings"
    active={currentPage === 'settings'}
    onClick={() => navigate('/settings')}
  />
</NavigationRail>
```

### BottomNavigation

Horizontal navigation component for mobile layouts.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Navigation tabs |
| `className` | `string` | - | Additional CSS classes |

#### BottomNavigation.Tab Props

Similar to NavigationRail.Item but optimized for horizontal layout.

#### Examples

```tsx
import { BottomNavigation } from '@/design-system/components/Navigation';

<BottomNavigation>
  <BottomNavigation.Tab
    icon={<HomeIcon />}
    label="Home"
    active={currentTab === 'home'}
    onClick={() => setCurrentTab('home')}
  />
  <BottomNavigation.Tab
    icon={<FavoriteIcon />}
    label="Favorites"
    active={currentTab === 'favorites'}
    onClick={() => setCurrentTab('favorites')}
    badge={2}
  />
  <BottomNavigation.Tab
    icon={<ProfileIcon />}
    label="Profile"
    active={currentTab === 'profile'}
    onClick={() => setCurrentTab('profile')}
  />
</BottomNavigation>
```

## Layout

### Grid

Responsive grid system using CSS Grid.

#### Grid Container Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | `boolean` | `false` | Whether this is a grid container |
| `spacing` | SpacingValue | `0` | Spacing between grid items |
| `direction` | `'row' \| 'column'` | `'row'` | Grid flow direction |
| `wrap` | `boolean` | `true` | Whether items can wrap |
| `alignItems` | AlignItems | - | Cross-axis alignment |
| `justifyContent` | JustifyContent | - | Main-axis alignment |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Grid items |

#### Grid Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `boolean` | `false` | Whether this is a grid item |
| `xs` | GridSize | - | Columns on extra small screens |
| `sm` | GridSize | - | Columns on small screens |
| `md` | GridSize | - | Columns on medium screens |
| `lg` | GridSize | - | Columns on large screens |
| `xl` | GridSize | - | Columns on extra large screens |
| `offset` | GridSize | - | Column offset |
| `order` | `number` | - | Visual order |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Item content |

#### Examples

```tsx
import { Grid } from '@/design-system/components/Layout';

// Basic grid
<Grid container spacing="md">
  <Grid item xs={12} sm={6} md={4}>
    <Material3Card>Card 1</Material3Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Material3Card>Card 2</Material3Card>
  </Grid>
  <Grid item xs={12} sm={12} md={4}>
    <Material3Card>Card 3</Material3Card>
  </Grid>
</Grid>

// Responsive dashboard layout
<Grid container spacing="lg">
  <Grid item xs={12} lg={8}>
    <Material3Card>Main content</Material3Card>
  </Grid>
  <Grid item xs={12} lg={4}>
    <Grid container spacing="md" direction="column">
      <Grid item>
        <Material3Card>Sidebar item 1</Material3Card>
      </Grid>
      <Grid item>
        <Material3Card>Sidebar item 2</Material3Card>
      </Grid>
    </Grid>
  </Grid>
</Grid>
```

### Container

Page container with consistent max-width and padding.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | `'lg'` | Maximum container width |
| `disableGutters` | `boolean` | `false` | Whether to disable side padding |
| `fixed` | `boolean` | `false` | Whether to use fixed width instead of fluid |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Container content |

#### Examples

```tsx
import { Container } from '@/design-system/components/Layout';

// Page container
<Container maxWidth="lg">
  <Typography variant="displayLarge">Page Title</Typography>
  <Typography variant="bodyLarge">Page content...</Typography>
</Container>

// Full width container
<Container maxWidth={false} disableGutters>
  <img src="/hero-image.jpg" alt="Hero" style={{ width: '100%' }} />
</Container>

// Narrow container
<Container maxWidth="sm">
  <Material3Card>
    <Material3Card.Content>
      <Typography variant="titleLarge">Sign In</Typography>
      {/* Form content */}
    </Material3Card.Content>
  </Material3Card>
</Container>
```

## Surface

### ElevatedSurface

A surface component that applies Material 3 elevation levels.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `0 \| 1 \| 2 \| 3 \| 4 \| 5` | `1` | Elevation level |
| `component` | `string \| ComponentType` | `'div'` | HTML element or React component |
| `color` | `'surface' \| 'surfaceVariant' \| 'primary' \| 'secondary'` | `'surface'` | Surface color |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Surface content |

#### Examples

```tsx
import { ElevatedSurface } from '@/design-system/components/Surface';

// Different elevation levels
<ElevatedSurface level={0}>
  <Typography>Level 0 - No elevation</Typography>
</ElevatedSurface>

<ElevatedSurface level={2}>
  <Typography>Level 2 - Medium elevation</Typography>
</ElevatedSurface>

<ElevatedSurface level={5}>
  <Typography>Level 5 - High elevation</Typography>
</ElevatedSurface>

// Colored surface
<ElevatedSurface level={1} color="surfaceVariant">
  <Typography>Surface with variant color</Typography>
</ElevatedSurface>
```

## Animation

### Animation Components

Components for common Material 3 animations.

#### FadeIn

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `300` | Animation duration in ms |
| `delay` | `number` | `0` | Animation delay in ms |
| `easing` | `string` | `'ease-out'` | CSS easing function |
| `children` | `ReactNode` | - | Content to animate |

#### SlideIn

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Slide direction |
| `distance` | `number` | `24` | Slide distance in px |
| `duration` | `number` | `400` | Animation duration in ms |
| `delay` | `number` | `0` | Animation delay in ms |
| `children` | `ReactNode` | - | Content to animate |

#### ScaleIn

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `scale` | `number` | `0.8` | Initial scale value |
| `duration` | `number` | `300` | Animation duration in ms |
| `delay` | `number` | `0` | Animation delay in ms |
| `children` | `ReactNode` | - | Content to animate |

#### Examples

```tsx
import { FadeIn, SlideIn, ScaleIn } from '@/design-system/animation';

// Fade in animation
<FadeIn duration={300} delay={100}>
  <Material3Card>Content that fades in</Material3Card>
</FadeIn>

// Slide in animation
<SlideIn direction="up" duration={400}>
  <Material3Button>Button that slides up</Material3Button>
</SlideIn>

// Scale in animation
<ScaleIn scale={0.9} duration={300}>
  <Material3Card>Card that scales in</Material3Card>
</ScaleIn>

// Staggered animations
{items.map((item, index) => (
  <FadeIn key={item.id} delay={index * 100}>
    <Material3Card>{item.content}</Material3Card>
  </FadeIn>
))}
```

---

*Last updated: August 30, 2025*