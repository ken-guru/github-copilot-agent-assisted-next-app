# Design Token Documentation

## Overview
This document outlines the design token system used throughout the application, including spacing, border radius, shadow, and component sizing values. We use simplified scales that provide consistency and flexibility across all components.

## Spacing Scale
Our application uses a simplified spacing scale with 5 key sizes:

| Variable Name | Value | Pixel Equivalent | Usage |
|---------------|-------|------------------|-------|
| `--space-xs` | 0.25rem | 4px | Minimal spacing, icons, tight UI elements |
| `--space-sm` | 0.5rem | 8px | Default small spacing, compact components |
| `--space-md` | 1rem | 16px | Standard spacing, component padding |
| `--space-lg` | 1.5rem | 24px | Large spacing, separation between sections |
| `--space-xl` | 2rem | 32px | Extra large spacing, major layout divisions |

## Migration from Previous Scale
This system replaces our previous more complex scale (2xs to 3xl). Below is the mapping from old to new variables:

| Old Variable | New Variable | Old Value | New Value |
|--------------|--------------|-----------|-----------|
| `--space-2xs` | `--space-xs` | 0.25rem | 0.25rem |
| `--space-xs` | `--space-sm` | 0.5rem | 0.5rem |
| `--space-sm` | `--space-sm` | 0.75rem | 0.5rem |
| `--space-md` | `--space-md` | 1rem | 1rem |
| `--space-lg` | `--space-lg` | 1.5rem | 1.5rem |
| `--space-xl` | `--space-xl` | 2rem | 2rem |
| `--space-2xl` | `--space-xl` | 2.5rem | 2rem |
| `--space-3xl` | `--space-xl` | 3rem | 2rem |

## Border Radius Scale

Our application uses a consistent border radius scale with 7 options:

| Variable Name | Value | Pixel Equivalent | Usage |
|---------------|-------|------------------|-------|
| `--radius-none` | 0 | 0px | No border radius, sharp corners |
| `--radius-xs` | 0.125rem | 2px | Subtle rounding, tooltips, small elements |
| `--radius-sm` | 0.25rem | 4px | Slight rounding, form inputs, small buttons |
| `--radius-md` | 0.375rem | 6px | Moderate rounding, standard buttons |
| `--radius-lg` | 0.5rem | 8px | Noticeable rounding, cards, panels |
| `--radius-xl` | 0.75rem | 12px | Prominent rounding, featured elements |
| `--radius-full` | 9999px | - | Complete rounding for pills, circles, avatars |

### Semantic Border Radius Variables

For improved maintainability, we also provide semantic border radius variables:

| Semantic Variable | Maps To | Usage |
|-------------------|---------|-------|
| `--radius-button` | `--radius-md` | Default button components |
| `--radius-card` | `--radius-lg` | Cards and major container elements |
| `--radius-input` | `--radius-sm` | Form input fields |
| `--radius-badge` | `--radius-full` | Pills, tags, and badges |
| `--radius-tooltip` | `--radius-xs` | Tooltips and popovers |
| `--radius-panel` | `--radius-lg` | Panels, modals, and dialogs |

## Border Radius Usage Guidelines

### Element Nesting Rules

To maintain a consistent "squircle aesthetic" across the application, follow these rules for border radius based on element nesting:

1. **Container/Parent Elements** (Cards, Panels, Major Sections):
   - Use `--radius-lg` (0.5rem/8px) for top-level containers
   - Example: Cards, panels, major content areas

2. **Interactive Elements** (Buttons, Inputs):
   - Use `--radius-md` (0.375rem/6px) for standard interactive elements
   - Example: Buttons, form controls, interactive cards

3. **Child Elements** (Within containers):
   - Use a border radius one step smaller than their parent
   - Example: A button within a card would use `--radius-sm` if the card uses `--radius-md`

4. **Small UI Elements** (Tags, Badges, Indicators):
   - Use `--radius-sm` (0.25rem/4px) or `--radius-xs` (0.125rem/2px) based on size
   - For pill-shaped items only, use `--radius-full` 

5. **Nested Interactive Elements** (Buttons in form groups, etc.):
   - Adjacent elements should use consistent radius values
   - For grouped elements, consider using smaller radius values where they connect

### Visual Hierarchy

The border radius scale helps establish visual hierarchy:
- Larger, more important elements (cards, modals) use larger radius values
- Supporting elements use smaller, but proportional radius values
- Maintain the "squircle aesthetic" by avoiding extremes (fully squared or fully rounded)
- Exception: Pill-shaped elements (tags, badges) intentionally use full rounding

### Responsive Considerations

- On smaller screens, consider reducing border radius by one step
- Elements that take up more screen proportion on mobile may look better with slightly reduced radius

## Shadow Scale

Our application uses a consistent shadow scale with 6 options:

| Variable Name | Value | Usage |
|---------------|-------|-------|
| `--shadow-none` | none | No shadow, flat appearance |
| `--shadow-xs` | 0 1px 2px hsla(..., 0.07) | Subtle shadow, minimal elevation |
| `--shadow-sm` | 0 1px 3px hsla(..., 0.12) | Light shadow, slight elevation |
| `--shadow-md` | 0 4px 6px hsla(..., 0.1) | Medium shadow, moderate elevation |
| `--shadow-lg` | 0 10px 15px hsla(..., 0.1) | Pronounced shadow, significant elevation |
| `--shadow-xl` | 0 20px 25px hsla(..., 0.15) | Deep shadow, maximum elevation |

### Semantic Shadow Variables

For improved maintainability, we also provide semantic shadow variables:

| Semantic Variable | Maps To | Usage |
|-------------------|---------|-------|
| `--shadow-card` | `--shadow-sm` | Default for cards and containers |
| `--shadow-card-hover` | `--shadow-md` | Hover state for interactive cards |
| `--shadow-dropdown` | `--shadow-md` | For dropdown menus and popovers |
| `--shadow-modal` | `--shadow-lg` | For modal dialogs and overlays |
| `--shadow-header` | `--shadow-sm` | For page headers and navigation |
| `--shadow-button` | `--shadow-xs` | Optional subtle shadow for buttons |
| `--shadow-focus` | Special value | Focus state for interactive elements |

## Shadow Usage Guidelines

### Element Nesting and Elevation Rules

To maintain a consistent shadow hierarchy across the application, follow these rules:

1. **Top-Level Containers** (Main sections, cards):
   - Use `--shadow-card` (maps to `--shadow-sm`) for standard elevation
   - Ensures subtle depth without overwhelming the UI

2. **Floating Elements** (Dropdowns, popovers):
   - Use `--shadow-dropdown` (maps to `--shadow-md`) 
   - Creates clear separation from underlying content

3. **Modal Dialogs** (Full-screen overlays):
   - Use `--shadow-modal` (maps to `--shadow-lg`)
   - Provides significant elevation above all other content

4. **Interactive Elements**:
   - Normal state: Usually no shadow (`--shadow-none`) or very subtle (`--shadow-xs`)
   - Hover state: Can increase shadow by one level (e.g., from `--shadow-sm` to `--shadow-md`)
   - Focus state: Use `--shadow-focus` with accent color

5. **Nested Elements** (Cards within cards, etc.):
   - Child elements should either use no shadow or a shadow one level lower than parent
   - Avoid multiple layers of strong shadows that compete visually

### Visual Hierarchy

The shadow scale helps establish visual hierarchy:
- Higher shadow values indicate higher elevation in the interface
- Modals and dialogs use the strongest shadows
- Page-level containers use moderate shadows
- Inline elements typically use minimal or no shadows

### Responsive Considerations

- On mobile devices, consider using reduced shadow intensities
- Shadows can be more subtle in dark mode to prevent eye strain
- Ensure shadow direction is consistent (typically top-light source)

## Component Sizing Scale

Our application uses a standardized sizing system for UI controls and icons:

### Control Heights

Consistent heights for interactive elements ensure visual harmony across the interface:

| Variable Name | Value | Usage |
|---------------|-------|-------|
| `--control-height-sm` | 24px | Small, compact controls with minimal visual weight |
| `--control-height-md` | 28px | Standard controls, buttons, tags, inputs |
| `--control-height-lg` | 36px | Large, prominent controls, primary actions |

### Icon Sizes

Coordinated icon sizes that pair well with control heights:

| Variable Name | Value | Usage |
|---------------|-------|-------|
| `--icon-size-sm` | 14px | Small icons, secondary indicators, compact UIs |
| `--icon-size-md` | 16px | Standard icons for buttons and interactive elements |
| `--icon-size-lg` | 20px | Large icons for emphasis and improved visibility |

## Component Sizing Usage Guidelines

### Control and Icon Pairing

For visual harmony, follow these guidelines when pairing controls with icons:

1. **Small Controls** (`--control-height-sm: 24px`):
   - Use with `--icon-size-sm` (14px)
   - Best for dense UIs, secondary actions
   - Examples: Small tags, secondary buttons, compact indicators

2. **Standard Controls** (`--control-height-md: 28px`):
   - Use with `--icon-size-md` (16px)
   - Our default size for most interactive elements
   - Examples: Standard buttons, input fields, tags, badges

3. **Large Controls** (`--control-height-lg: 36px`):
   - Use with `--icon-size-lg` (20px) 
   - Use for primary actions and improved touch targets
   - Examples: Primary buttons, prominent interactive elements

### Implementation Examples

```css
/* Standard button with icon */
.button {
  height: var(--control-height-md);
  padding: 0 var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.button svg {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
}

/* Tag with icon */
.tag {
  height: var(--control-height-md);
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-sm);
  gap: var(--space-xs);
}

.tag svg {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
}
```

### Responsive Considerations

- On mobile devices, consider using larger control heights for better touch targets
- Maintain consistent sizing ratios between related elements
- Always use the sizing variables rather than hardcoded values

## Usage Guidelines

### Basic Implementation
Use CSS variables in your component CSS modules:

```css
.button {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-button);
  margin-bottom: var(--space-md);
}

.card {
  padding: var(--padding-medium);
  border-radius: var(--radius-card);
  gap: var(--gap-medium);
}
```

### Semantic Variables
Where possible, use semantic variables that are built on the base scales:

```css
.input {
  padding: var(--padding-small);
  border-radius: var(--radius-input);
}

.badge {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-badge);
}
```

### Responsive Considerations
Consider using different spacing values on different screen sizes:

```css
.component {
  padding: var(--space-sm);
  border-radius: var(--radius-md);
}

@media (min-width: 768px) {
  .component {
    padding: var(--space-md);
    border-radius: var(--radius-lg);
  }
}
```

## Benefits of the Design Token System
- **Consistency**: Few options lead to more consistent usage across the application
- **Simplicity**: Easier to remember and apply the correct values
- **Maintainability**: Simple system is easier to update and extend
- **Performance**: Reduced CSS variable footprint
- **Theme Support**: All tokens work in both light and dark modes

## Best Practices
1. Always use design token variables instead of hardcoded values
2. Use semantic variables when available for better code readability
3. Maintain consistent visual hierarchy with appropriate token choices
4. Consider component relationships when choosing values
5. Use the smallest number of different values within a component
