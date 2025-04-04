# Design Token Documentation

## Overview
This document outlines the design token system used throughout the application, including spacing and border radius values. We use simplified scales that provide consistency and flexibility across all components.

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
