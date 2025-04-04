# Spacing System Documentation

## Overview
This document outlines the spacing system used throughout the application. We use a simplified 5-point spacing scale that provides consistency and flexibility across all components.

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

## Usage Guidelines

### Basic Implementation
Use CSS variables in your component CSS modules:

```css
.container {
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
  gap: var(--space-sm);
}
```

### Semantic Spacing
Where possible, use semantic spacing variables that are built on the spacing scale:

```css
.card {
  padding: var(--padding-container);  /* Maps to var(--space-md) */
  gap: var(--gap-standard);           /* Maps to var(--space-sm) */
}
```

### Responsive Considerations
The spacing system works across all screen sizes, but consider using smaller spacing values on mobile devices for certain UI elements:

```css
.component {
  padding: var(--space-sm);
}

@media (min-width: 768px) {
  .component {
    padding: var(--space-md);
  }
}
```

## Benefits of the Simplified Scale
- **Consistency**: Fewer options lead to more consistent usage across the application
- **Simplicity**: Easier to remember and apply the correct spacing values
- **Maintainability**: Simpler system is easier to update and extend
- **Performance**: Reduced CSS variable footprint

## Best Practices
1. Always use spacing variables instead of hardcoded values
2. Maintain visual hierarchy with appropriate spacing choices
3. Use the smallest number of different spacing values within a component
4. Consider component relationships when choosing spacing values
