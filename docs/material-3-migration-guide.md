# Material 3 Migration Guide

This guide provides detailed instructions for migrating from Bootstrap to Material 3 design system components.

## Overview

The migration from Bootstrap to Material 3 involves updating:
- Component APIs and props
- Color system (Bootstrap utilities → Material 3 semantic colors)
- Spacing system (Bootstrap spacing → Material 3 spacing scale)
- Typography (Bootstrap text classes → Material 3 typography scale)
- Layout system (Bootstrap grid → Material 3 responsive grid)

## Migration Strategy

### Phase 1: Preparation
1. Audit existing Bootstrap component usage
2. Create component mapping table
3. Set up Material 3 design system
4. Establish testing strategy

### Phase 2: Component Migration
1. Start with leaf components (buttons, inputs)
2. Move to composite components (cards, forms)
3. Update layout components last
4. Test each component migration

### Phase 3: Cleanup
1. Remove Bootstrap dependencies
2. Clean up unused CSS classes
3. Update documentation
4. Performance optimization

## Component Mappings

### Button Migration

#### Bootstrap → Material 3

| Bootstrap | Material 3 | Notes |
|-----------|------------|-------|
| `variant="primary"` | `variant="filled"` | Highest emphasis |
| `variant="secondary"` | `variant="filledTonal"` | Medium-high emphasis |
| `variant="outline-primary"` | `variant="outlined"` | Medium emphasis |
| `variant="link"` | `variant="text"` | Low emphasis |
| `size="sm"` | `size="small"` | Small size |
| `size="lg"` | `size="large"` | Large size |

#### Migration Examples

```tsx
// Before (Bootstrap)
import { Button } from 'react-bootstrap';

<Button variant="primary" size="lg" disabled>
  Save Changes
</Button>

<Button variant="outline-secondary">
  Cancel
</Button>

<Button variant="link" size="sm">
  Learn More
</Button>

// After (Material 3)
import { Material3Button } from '@/design-system/components/Button';

<Material3Button variant="filled" size="large" disabled>
  Save Changes
</Material3Button>

<Material3Button variant="outlined">
  Cancel
</Material3Button>

<Material3Button variant="text" size="small">
  Learn More
</Material3Button>
```

### Card Migration

#### Bootstrap → Material 3

| Bootstrap Component | Material 3 Component | Notes |
|-------------------|----------------------|-------|
| `Card` | `Material3Card` | Container component |
| `Card.Header` | `Material3Card.Header` | Header section |
| `Card.Body` | `Material3Card.Content` | Main content area |
| `Card.Footer` | `Material3Card.Actions` | Action buttons |
| `Card.Img` | `Material3Card.Media` | Media content |

#### Migration Examples

```tsx
// Before (Bootstrap)
import { Card, Button } from 'react-bootstrap';

<Card>
  <Card.Img variant="top" src="image.jpg" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>Card content goes here</Card.Text>
    <Button variant="primary">Action</Button>
  </Card.Body>
</Card>

// After (Material 3)
import { Material3Card } from '@/design-system/components/Card';
import { Material3Button } from '@/design-system/components/Button';
import { Typography } from '@/design-system/components/Typography';

<Material3Card variant="elevated">
  <Material3Card.Media 
    image="image.jpg"
    alt="Card image"
    height={200}
  />
  <Material3Card.Header>
    <Typography variant="titleLarge">Card Title</Typography>
  </Material3Card.Header>
  <Material3Card.Content>
    <Typography variant="bodyMedium">Card content goes here</Typography>
  </Material3Card.Content>
  <Material3Card.Actions>
    <Material3Button variant="filled">Action</Material3Button>
  </Material3Card.Actions>
</Material3Card>
```

### Form Migration

#### Bootstrap → Material 3

| Bootstrap Component | Material 3 Component | Notes |
|-------------------|----------------------|-------|
| `Form.Control` | `Material3TextField` | Text inputs |
| `Form.Label` | Built into TextField | Integrated label |
| `Form.Text` | `helperText` prop | Helper text |
| `Form.Check` | `Material3Checkbox` | Checkbox inputs |
| `Form.Select` | `Material3Select` | Dropdown selections |

#### Migration Examples

```tsx
// Before (Bootstrap)
import { Form, Button } from 'react-bootstrap';

<Form>
  <Form.Group className="mb-3">
    <Form.Label>Email address</Form.Label>
    <Form.Control 
      type="email" 
      placeholder="Enter email"
      isInvalid={!!emailError}
    />
    <Form.Control.Feedback type="invalid">
      {emailError}
    </Form.Control.Feedback>
    <Form.Text className="text-muted">
      We'll never share your email.
    </Form.Text>
  </Form.Group>
  
  <Form.Group className="mb-3">
    <Form.Check 
      type="checkbox"
      label="Remember me"
    />
  </Form.Group>
  
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>

// After (Material 3)
import { Material3TextField } from '@/design-system/components/TextField';
import { Material3Checkbox } from '@/design-system/components/Checkbox';
import { Material3Button } from '@/design-system/components/Button';
import { Grid } from '@/design-system/components/Layout';

<form>
  <Grid container spacing="md" direction="column">
    <Grid item>
      <Material3TextField
        label="Email address"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={setEmail}
        error={emailError}
        helperText={emailError || "We'll never share your email"}
        required
      />
    </Grid>
    
    <Grid item>
      <Material3Checkbox
        label="Remember me"
        checked={rememberMe}
        onChange={setRememberMe}
      />
    </Grid>
    
    <Grid item>
      <Material3Button variant="filled" type="submit">
        Submit
      </Material3Button>
    </Grid>
  </Grid>
</form>
```

### Navigation Migration

#### Bootstrap → Material 3

| Bootstrap Component | Material 3 Component | Notes |
|-------------------|----------------------|-------|
| `Navbar` | `NavigationRail` (desktop) | Vertical navigation |
| `Nav` | `BottomNavigation` (mobile) | Horizontal tabs |
| `Nav.Link` | `NavigationRail.Item` | Navigation items |

#### Migration Examples

```tsx
// Before (Bootstrap)
import { Navbar, Nav } from 'react-bootstrap';

<Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">Brand</Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse>
    <Nav className="me-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#activities">Activities</Nav.Link>
      <Nav.Link href="#settings">Settings</Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>

// After (Material 3)
import { NavigationRail, BottomNavigation } from '@/design-system/components/Navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

function Navigation() {
  const isMobile = useMediaQuery('(max-width: 839px)');
  
  const navigationItems = [
    { icon: <HomeIcon />, label: 'Home', path: '/home' },
    { icon: <ActivityIcon />, label: 'Activities', path: '/activities' },
    { icon: <SettingsIcon />, label: 'Settings', path: '/settings' }
  ];
  
  if (isMobile) {
    return (
      <BottomNavigation>
        {navigationItems.map(item => (
          <BottomNavigation.Tab
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </BottomNavigation>
    );
  }
  
  return (
    <NavigationRail>
      {navigationItems.map(item => (
        <NavigationRail.Item
          key={item.path}
          icon={item.icon}
          label={item.label}
          active={currentPath === item.path}
          onClick={() => navigate(item.path)}
        />
      ))}
    </NavigationRail>
  );
}
```

## Color System Migration

### Bootstrap Utilities → Material 3 Semantic Colors

#### Color Mapping

| Bootstrap Class | Material 3 Token | Usage |
|----------------|------------------|-------|
| `.text-primary` | `--m3-color-primary` | Primary text |
| `.text-secondary` | `--m3-color-secondary` | Secondary text |
| `.text-success` | `--m3-color-primary` | Success states |
| `.text-danger` | `--m3-color-error` | Error states |
| `.text-warning` | `--m3-color-warning` | Warning states |
| `.text-info` | `--m3-color-info` | Info states |
| `.text-muted` | `--m3-color-on-surface-variant` | Muted text |
| `.bg-primary` | `--m3-color-primary-container` | Primary backgrounds |
| `.bg-light` | `--m3-color-surface` | Light backgrounds |
| `.bg-dark` | `--m3-color-surface` (dark theme) | Dark backgrounds |

#### Migration Examples

```css
/* Before (Bootstrap) */
.custom-component {
  color: var(--bs-primary);
  background-color: var(--bs-light);
  border-color: var(--bs-secondary);
}

.text-primary { color: var(--bs-primary); }
.bg-success { background-color: var(--bs-success); }

/* After (Material 3) */
.custom-component {
  color: var(--m3-color-primary);
  background-color: var(--m3-color-surface);
  border-color: var(--m3-color-outline);
}

.text-primary { color: var(--m3-color-primary); }
.bg-success { background-color: var(--m3-color-primary-container); }
```

## Spacing System Migration

### Bootstrap Spacing → Material 3 Spacing Scale

#### Spacing Mapping

| Bootstrap Class | Material 3 Equivalent | Value |
|----------------|----------------------|-------|
| `.m-1`, `.p-1` | `var(--m3-spacing-xs)` | 4px |
| `.m-2`, `.p-2` | `var(--m3-spacing-sm)` | 8px |
| `.m-3`, `.p-3` | `var(--m3-spacing-md)` | 16px |
| `.m-4`, `.p-4` | `var(--m3-spacing-lg)` | 24px |
| `.m-5`, `.p-5` | `var(--m3-spacing-xl)` | 32px |

#### Utility Classes

Create Material 3 spacing utilities:

```css
/* Material 3 spacing utilities */
.p-xs { padding: var(--m3-spacing-xs); }
.p-sm { padding: var(--m3-spacing-sm); }
.p-md { padding: var(--m3-spacing-md); }
.p-lg { padding: var(--m3-spacing-lg); }
.p-xl { padding: var(--m3-spacing-xl); }

.m-xs { margin: var(--m3-spacing-xs); }
.m-sm { margin: var(--m3-spacing-sm); }
.m-md { margin: var(--m3-spacing-md); }
.m-lg { margin: var(--m3-spacing-lg); }
.m-xl { margin: var(--m3-spacing-xl); }

/* Directional spacing */
.pt-md { padding-top: var(--m3-spacing-md); }
.pb-lg { padding-bottom: var(--m3-spacing-lg); }
.ml-sm { margin-left: var(--m3-spacing-sm); }
.mr-md { margin-right: var(--m3-spacing-md); }
```

#### Migration Examples

```tsx
// Before (Bootstrap)
<div className="p-3 mb-4">
  <div className="mt-2 mx-3">Content</div>
</div>

// After (Material 3)
<div className="p-md mb-lg">
  <div className="mt-sm mx-md">Content</div>
</div>

// Or using styled-components
const Container = styled.div`
  padding: var(--m3-spacing-md);
  margin-bottom: var(--m3-spacing-lg);
`;

const Content = styled.div`
  margin-top: var(--m3-spacing-sm);
  margin-left: var(--m3-spacing-md);
  margin-right: var(--m3-spacing-md);
`;
```

## Typography Migration

### Bootstrap Text Classes → Material 3 Typography Scale

#### Typography Mapping

| Bootstrap Class | Material 3 Variant | Usage |
|----------------|-------------------|-------|
| `.display-1` | `displayLarge` | Largest display text |
| `.display-4` | `displayMedium` | Medium display text |
| `.h1` | `headlineLarge` | Large headings |
| `.h2` | `headlineMedium` | Medium headings |
| `.h3` | `headlineSmall` | Small headings |
| `.h4` | `titleLarge` | Large titles |
| `.h5` | `titleMedium` | Medium titles |
| `.h6` | `titleSmall` | Small titles |
| (default) | `bodyLarge` | Large body text |
| `.small` | `bodyMedium` | Medium body text |
| `.text-sm` | `bodySmall` | Small body text |

#### Migration Examples

```tsx
// Before (Bootstrap)
<h1 className="display-4">Page Title</h1>
<h2 className="h3">Section Title</h2>
<p className="lead">Important paragraph</p>
<p>Regular paragraph text</p>
<small className="text-muted">Caption text</small>

// After (Material 3)
import { Typography } from '@/design-system/components/Typography';

<Typography variant="displayMedium" component="h1">
  Page Title
</Typography>
<Typography variant="headlineSmall" component="h2">
  Section Title
</Typography>
<Typography variant="bodyLarge">
  Important paragraph
</Typography>
<Typography variant="bodyMedium">
  Regular paragraph text
</Typography>
<Typography variant="bodySmall" color="secondary">
  Caption text
</Typography>
```

## Layout System Migration

### Bootstrap Grid → Material 3 Grid

#### Grid System Comparison

| Bootstrap | Material 3 | Notes |
|-----------|------------|-------|
| `.container` | `<Container>` | Page container |
| `.container-fluid` | `<Container maxWidth={false}>` | Full width |
| `.row` | `<Grid container>` | Grid container |
| `.col-*` | `<Grid item xs={*}>` | Grid items |
| `.col-sm-*` | `<Grid item sm={*}>` | Responsive columns |

#### Migration Examples

```tsx
// Before (Bootstrap)
import { Container, Row, Col } from 'react-bootstrap';

<Container>
  <Row>
    <Col xs={12} md={8}>
      <h1>Main Content</h1>
    </Col>
    <Col xs={12} md={4}>
      <h2>Sidebar</h2>
    </Col>
  </Row>
  <Row>
    <Col sm={6} md={4}>Card 1</Col>
    <Col sm={6} md={4}>Card 2</Col>
    <Col sm={12} md={4}>Card 3</Col>
  </Row>
</Container>

// After (Material 3)
import { Container, Grid } from '@/design-system/components/Layout';
import { Typography } from '@/design-system/components/Typography';

<Container maxWidth="lg">
  <Grid container spacing="lg">
    <Grid item xs={12} md={8}>
      <Typography variant="displayMedium" component="h1">
        Main Content
      </Typography>
    </Grid>
    <Grid item xs={12} md={4}>
      <Typography variant="headlineMedium" component="h2">
        Sidebar
      </Typography>
    </Grid>
  </Grid>
  <Grid container spacing="md">
    <Grid item xs={12} sm={6} md={4}>Card 1</Grid>
    <Grid item xs={12} sm={6} md={4}>Card 2</Grid>
    <Grid item xs={12} md={4}>Card 3</Grid>
  </Grid>
</Container>
```

## Theme Migration

### Bootstrap Theming → Material 3 Theme System

#### Theme Structure Migration

```tsx
// Before (Bootstrap SCSS variables)
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;
$font-family-base: 'Segoe UI', system-ui;
$font-size-base: 1rem;
$border-radius: 0.375rem;

// After (Material 3 theme)
const theme = {
  colors: {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    // ... other semantic colors
  },
  typography: {
    bodyLarge: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0.5px',
    },
    // ... other typography scales
  },
  shape: {
    cornerMedium: '12px',
    cornerLarge: '16px',
    // ... other corner radii
  }
};
```

## Breaking Changes

### Component API Changes

1. **Button**
   - `variant="primary"` → `variant="filled"`
   - `size="sm"` → `size="small"`
   - Removed `outline` variants (use `variant="outlined"`)

2. **Card**
   - `Card.Body` → `Material3Card.Content`
   - `Card.Footer` → `Material3Card.Actions`
   - Added semantic variants (`elevated`, `filled`, `outlined`)

3. **Form Controls**
   - Combined label, input, and helper text into single component
   - New validation prop structure
   - Built-in accessibility features

4. **Grid System**
   - New responsive prop names (`xs`, `sm`, `md`, `lg`, `xl`)
   - Different spacing system (design tokens vs. classes)
   - CSS Grid instead of Flexbox

### CSS Class Changes

Many Bootstrap utility classes need updating:

```css
/* Bootstrap classes to remove */
.btn-primary
.card-body
.form-control
.text-primary
.bg-light
.p-3, .mb-4

/* Replace with Material 3 equivalents */
.material3-button--filled
.material3-card__content
.material3-textfield
.text-primary (using CSS custom properties)
.bg-surface (using CSS custom properties)
.p-md, .mb-lg
```

## Testing Strategy

### Component Testing

Test each migrated component:

```tsx
// Example test for migrated button
import { render, screen, fireEvent } from '@testing-library/react';
import { Material3Button } from '@/design-system/components/Button';

describe('Material3Button Migration', () => {
  test('renders filled button correctly', () => {
    render(
      <Material3Button variant="filled">
        Save Changes
      </Material3Button>
    );
    
    const button = screen.getByRole('button', { name: 'Save Changes' });
    expect(button).toHaveClass('material3-button--filled');
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Material3Button variant="filled" onClick={handleClick}>
        Click me
      </Material3Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('applies accessibility attributes', () => {
    render(
      <Material3Button variant="icon" icon="save" aria-label="Save document">
        <SaveIcon />
      </Material3Button>
    );
    
    const button = screen.getByRole('button', { name: 'Save document' });
    expect(button).toBeInTheDocument();
  });
});
```

### Visual Regression Testing

Set up visual tests to catch unintended changes:

```tsx
// Example Storybook story for visual testing
export default {
  title: 'Migration/Button',
  component: Material3Button,
};

export const MigrationComparison = () => (
  <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
    <div>
      <h3>Before (Bootstrap)</h3>
      {/* Bootstrap button for comparison */}
    </div>
    <div>
      <h3>After (Material 3)</h3>
      <Material3Button variant="filled">Save Changes</Material3Button>
      <Material3Button variant="outlined">Cancel</Material3Button>
      <Material3Button variant="text">Learn More</Material3Button>
    </div>
  </div>
);
```

### Accessibility Testing

Ensure migrated components maintain accessibility:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('migrated form has no accessibility violations', async () => {
  const { container } = render(
    <form>
      <Material3TextField label="Email" type="email" required />
      <Material3Button variant="filled" type="submit">
        Submit
      </Material3Button>
    </form>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Performance Considerations

### Bundle Size Optimization

1. **Tree Shaking**: Import only needed components
2. **Code Splitting**: Load components on demand
3. **CSS Optimization**: Remove unused Bootstrap styles

```tsx
// Good: Tree-shakable imports
import { Material3Button } from '@/design-system/components/Button';
import { Typography } from '@/design-system/components/Typography';

// Bad: Large bundle imports
import * as MaterialComponents from '@/design-system/components';
```

### Runtime Performance

1. **CSS Custom Properties**: Faster theme switching
2. **CSS Grid**: Better layout performance
3. **Reduced DOM Complexity**: Simplified component structure

## Migration Checklist

### Pre-Migration
- [ ] Audit existing Bootstrap component usage
- [ ] Set up Material 3 design system
- [ ] Create component inventory
- [ ] Plan migration order
- [ ] Set up testing strategy

### Component Migration
- [ ] Migrate buttons and basic inputs
- [ ] Migrate form components
- [ ] Migrate card and layout components
- [ ] Migrate navigation components
- [ ] Update page layouts

### Style Migration
- [ ] Replace color utilities with semantic tokens
- [ ] Update spacing classes
- [ ] Migrate typography classes
- [ ] Update custom component styles

### Testing & Validation
- [ ] Run accessibility audits
- [ ] Perform visual regression testing
- [ ] Test responsive behavior
- [ ] Validate keyboard navigation
- [ ] Check screen reader compatibility

### Cleanup
- [ ] Remove Bootstrap dependencies
- [ ] Clean up unused CSS
- [ ] Update documentation
- [ ] Optimize bundle size
- [ ] Performance audit

### Post-Migration
- [ ] Monitor error rates
- [ ] Gather user feedback
- [ ] Update style guide
- [ ] Train team on new components

---

*Last updated: August 30, 2025*