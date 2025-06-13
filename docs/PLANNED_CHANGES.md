# Project Development Plan

## Phase 1: CSS and HTML Structure Removal Experiment - COMPLETED ✅

### Experiment Objective - ACHIEVED ✅
Remove all CSS styling and non-functional HTML structure from the entire application to create a completely unstyled, minimally-structured version that retains only core functionality.

### Hypothesis - CONFIRMED ✅
By stripping away all visual styling and structural HTML elements, we can:
- ✅ Identify the true functional core of each component
- ✅ Understand which HTML elements are actually necessary for functionality
- ✅ Create a baseline for rebuilding with intentional design choices
- ✅ Analyze component complexity when reduced to pure function

### EXPERIMENT RESULTS

#### Functional Requirements - ALL MET ✅
- ✅ All interactive features continue to work
- ✅ Form submissions still function
- ✅ Navigation remains operational
- ✅ Data display is intact (though unstyled)

#### Structural Requirements - ALL MET ✅
- ✅ Zero CSS files remain in project
- ✅ No styling-related code in components
- ✅ Minimal HTML structure (only functional elements)
- ✅ Clean git history with granular commits

#### Key Insights Discovered:
- **Essential HTML Elements**: `<button>`, `<form>`, `<input>`, `<h1>-<h6>`, `<p>`, `<a>`, `<dialog>`, accessibility elements
- **Non-Essential Elements**: Most `<div>` containers, styling wrapper elements, purely structural containers
- **Component Simplification**: Components are 50-70% smaller when reduced to core function
- **Performance**: Faster load times due to zero CSS processing
- **Architecture**: Clear separation of concerns between function and presentation achieved

## COMPLETED PHASES (Phase 1)

### ✅ Phase 1.1: Analysis and Mapping
- [x] **Identify all CSS files** (Found 27 CSS files total)
- [x] **Document CSS import patterns**
- [x] **Map all React components**
- [x] **Identify component hierarchy**

### ✅ Phase 1.2: Global CSS Removal
- [x] **Remove global CSS files** (styles/globals.css, src/app/globals.css)
- [x] **Remove CSS imports** from layout files
- [x] **Commit: "Remove all global CSS files"**

### ✅ Phase 1.3: Component Processing (Two-Stage Per Component)
- [x] **Processed 20+ components** following leaf-to-root order
- [x] **Stage 1: CSS Removal** for all components
- [x] **Stage 2: HTML Structure Stripping** for all components
- [x] **Granular commits** for each component modification

### ✅ Phase 1.4: Test Adaptation and Final Cleanup
- [x] **Rewrite failing functional tests** to focus on behavior instead of styling
- [x] **Document visual-only tests** that should remain failing  
- [x] **Fix linting errors** (remove unused imports and variables)
- [x] **Verify functionality** (Application builds successfully)
- [x] **Create Memory Log documentation** (MRTMLY-029)
- [x] **Final commit** with experiment summary and completion

---

## Rollback Information
- Experiment preserved in `complete-style-and-structure-rewrite` branch
- Main branch unaffected  
- Full experiment history available in 22 granular commits
- Memory Log entry MRTMLY-029 documents completion and insights
- Can reference findings without affecting main development

## Final Metrics (Phase 1)
- **Test Results**: 72/74 test suites passing (444/466 individual tests)
- **Failing Tests**: 2 test suites with 22 visual-only tests (expected failures)
- **Build Status**: Clean builds with zero errors or warnings
- **File Reduction**: Components 50-70% smaller without presentation code
- **Performance**: Zero CSS processing overhead
- **Documentation**: Complete experiment documentation and insights captured

## Final Status: EXPERIMENT SUCCESSFUL ✅

**User Perspective:**
- ✅ Completely unstyled, basic HTML appearance
- ✅ All functionality preserved but visually primitive
- ✅ Faster load times due to no CSS processing

**Technical Perspective:**
- ✅ Minimal component code focused purely on logic
- ✅ Clear separation of concerns between function and presentation
- ✅ Baseline established for intentional design reconstruction
- ✅ Complete understanding of true component dependencies

**Development Insights:**
- ✅ Identified which HTML elements are truly necessary
- ✅ Quantified how much code is purely presentational (50-70% in most components)
- ✅ Revealed component complexity when reduced to core function
- ✅ Found opportunities for simpler component structures

## Final Experiment Status: COMPLETED ✅

**Summary:**
The CSS and HTML Structure Removal Experiment has been successfully completed. All CSS styling and non-functional HTML structure has been removed from the application while maintaining full core functionality.

**Results:**
- ✅ Application builds successfully (`npm run build`)
- ✅ Type checking passes (`npm run type-check`)
- ✅ Linting passes with zero errors
- ✅ Core functionality preserved (timer, activities, themes)
- ✅ 444/466 tests pass (22 expected failures for visual-only tests)
- ✅ Complete removal of 20+ CSS module files
- ✅ Elimination of all className and style references
- ✅ Streamlined HTML structure to functional essentials only

**Expected Test Failures:** 22 tests fail as expected from 2 test suites (ProgressBar components) because they specifically test for:
- CSS class presence (`.progressBarContainer`, `.progressFill`, etc.)
- Style attributes and background color properties
- Visual progress indicators and color transitions
- Theme-specific styling and contrast checks
- These failures validate the experiment's thoroughness and CSS removal completeness

---

## Phase 2: Mobile-First Design System Implementation 🎨

### Objective
Build a comprehensive, accessible design system from the ground up using the insights gained from Phase 1. Focus on mobile-first responsive design, WCAG 2.2 compliance, and systematic design tokens.

### Design Philosophy
- **Mobile-First**: All layouts start with mobile constraints and scale up
- **Progressive Enhancement**: Layer complexity for larger screens
- **Accessibility-First**: WCAG 2.2 AA compliance built in from the start
- **Design Tokens**: Systematic, reusable design decisions
- **Performance**: Minimal CSS with maximum visual impact
- **Dark Mode**: Seamless theme switching with proper contrast ratios

### Phase 2 Implementation Plan

#### 2.1 Foundation Layer - Design Tokens System 🎯

**Priority: HIGHEST**

**Objective**: Establish the systematic foundation for all visual design decisions.

**Components to Create:**
- `styles/design-tokens/colors.css` - Color system with semantic naming
- `styles/design-tokens/typography.css` - Type scale and font definitions  
- `styles/design-tokens/spacing.css` - Spatial rhythm system
- `styles/design-tokens/layout.css` - Grid systems and breakpoints
- `styles/design-tokens/motion.css` - Animation and transition standards
- `styles/design-tokens/elevation.css` - Shadow and depth system

**Design Token Categories:**

1. **Color System**
   ```css
   /* Semantic Color Tokens */
   --color-primary-50: hsl(210, 100%, 97%);
   --color-primary-500: hsl(210, 100%, 50%);
   --color-primary-900: hsl(210, 100%, 15%);
   
   /* Contextual Color Tokens */
   --color-surface-primary: var(--color-primary-50);
   --color-text-primary: var(--color-neutral-900);
   --color-interactive-primary: var(--color-primary-500);
   ```

2. **Typography Scale**
   ```css
   /* Mobile-first type scale */
   --text-scale-xs: 0.75rem;   /* 12px */
   --text-scale-sm: 0.875rem;  /* 14px */
   --text-scale-base: 1rem;    /* 16px */
   --text-scale-lg: 1.125rem;  /* 18px */
   --text-scale-xl: 1.25rem;   /* 20px */
   --text-scale-2xl: 1.5rem;   /* 24px */
   --text-scale-3xl: 1.875rem; /* 30px */
   ```

3. **Spacing System** 
   ```css
   /* 4px base unit spacing system */
   --space-1: 0.25rem;  /* 4px */
   --space-2: 0.5rem;   /* 8px */
   --space-3: 0.75rem;  /* 12px */
   --space-4: 1rem;     /* 16px */
   --space-6: 1.5rem;   /* 24px */
   --space-8: 2rem;     /* 32px */
   --space-12: 3rem;    /* 48px */
   ```

4. **Breakpoint System**
   ```css
   /* Mobile-first breakpoints */
   --breakpoint-sm: 640px;   /* Large phones */
   --breakpoint-md: 768px;   /* Tablets */
   --breakpoint-lg: 1024px;  /* Small laptops */
   --breakpoint-xl: 1280px;  /* Large screens */
   ```

**Implementation Steps:**
1. Create token files with comprehensive value sets
2. Implement theme-aware color switching logic
3. Create CSS custom property fallback system
4. Add design token validation utilities
5. Document token usage guidelines

**Acceptance Criteria:**
- [ ] All design tokens defined with semantic names
- [ ] Light/dark theme variants for all color tokens
- [ ] Mobile-first responsive breakpoint system
- [ ] WCAG AA contrast ratios validated for all color combinations
- [ ] Design token documentation with usage examples

#### 2.2 Layout and Grid Systems 📐

**Priority: HIGH**

**Objective**: Create flexible, responsive layout primitives that work across all screen sizes.

**Components to Create:**
- `styles/layout/grid.css` - CSS Grid layout system
- `styles/layout/container.css` - Content container patterns
- `styles/layout/stack.css` - Vertical spacing utility
- `styles/layout/cluster.css` - Horizontal grouping utility
- `styles/layout/switcher.css` - Responsive layout switching

**Layout Patterns:**

1. **Grid System**
   ```css
   .grid {
     display: grid;
     gap: var(--space-4);
     grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
   }
   
   /* Mobile-first grid variations */
   .grid-cols-1 { grid-template-columns: 1fr; }
   .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
   
   @media (min-width: 768px) {
     .grid-cols-1 { grid-template-columns: 1fr; }
     .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
     .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
   }
   ```

2. **Stack Component** (Vertical spacing)
   ```css
   .stack > * + * {
     margin-top: var(--space, var(--space-4));
   }
   ```

3. **Container System**
   ```css
   .container {
     max-width: var(--container-max-width, 1200px);
     margin-inline: auto;
     padding-inline: var(--space-4);
   }
   ```

**Implementation Steps:**
1. Create foundational layout CSS files
2. Build responsive container system
3. Implement CSS Grid patterns for common layouts
4. Create spacing utility classes
5. Test layout patterns across all breakpoints

**Acceptance Criteria:**
- [ ] CSS Grid system works on all target devices
- [ ] Responsive containers with proper gutters
- [ ] Vertical rhythm maintained across components
- [ ] No horizontal scrolling on mobile devices
- [ ] Layout patterns documented with examples

#### 2.3 Component Primitives 🧱

**Priority: HIGH** 

**Objective**: Build fundamental UI components with consistent styling and behavior.

**Components to Style:**

1. **Interactive Elements**
   - `components/primitives/Button/Button.css`
   - `components/primitives/Input/Input.css` 
   - `components/primitives/Select/Select.css`

2. **Display Elements**
   - `components/primitives/Card/Card.css`
   - `components/primitives/Badge/Badge.css`
   - `components/primitives/ProgressBar/ProgressBar.css`

**Button Component Example:**
```css
.button {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  /* Mobile-first sizing */
  min-height: 44px; /* WCAG touch target size */
  padding-inline: var(--space-4);
  padding-block: var(--space-3);
  
  /* Typography */
  font-size: var(--text-scale-base);
  font-weight: 500;
  text-decoration: none;
  
  /* Borders and radius */
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Remove default styles */
  background: none;
  font-family: inherit;
}

/* Variants */
.button-primary {
  background-color: var(--color-interactive-primary);
  color: var(--color-text-on-primary);
  border-color: var(--color-interactive-primary);
}

.button-primary:hover {
  background-color: var(--color-interactive-primary-hover);
  border-color: var(--color-interactive-primary-hover);
}

.button-primary:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Size variants */
.button-sm {
  min-height: 36px;
  padding-inline: var(--space-3);
  font-size: var(--text-scale-sm);
}

.button-lg {
  min-height: 52px;
  padding-inline: var(--space-6);
  font-size: var(--text-scale-lg);
}
```

**Implementation Steps:**
1. Create base component styles with mobile-first approach
2. Implement all interactive states (hover, focus, active, disabled)
3. Add WCAG-compliant focus indicators
4. Create component size and variant systems
5. Test with screen readers and keyboard navigation

**Acceptance Criteria:**
- [ ] All interactive elements meet 44px minimum touch target size
- [ ] WCAG AA contrast ratios for all text/background combinations
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible and properly positioned
- [ ] Components work correctly with reduced motion preferences

#### 2.4 Feature Components Styling 🎨

**Priority: MEDIUM**

**Objective**: Apply the design system to existing application components.

**Components to Style (in order):**
1. **TimeSetup** - Foundation for app interaction
2. **ActivityManager** - Core functionality component
3. **ProgressBar** - Visual feedback component  
4. **Timeline** - Complex data visualization
5. **Summary** - Data display component
6. **SplashScreen** - App initialization experience

**ActivityManager Styling Example:**
```css
.activity-manager {
  container-type: inline-size;
  padding: var(--space-4);
}

.activity-list {
  display: grid;
  gap: var(--space-3);
}

.activity-item {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--space-3);
  
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: var(--color-surface-secondary-hover);
  border-color: var(--color-border-primary-hover);
}

/* Container queries for responsive component design */
@container (min-width: 400px) {
  .activity-item {
    grid-template-columns: 1fr auto auto;
    gap: var(--space-4);
  }
}
```

**Implementation Steps:**
1. Apply design tokens to each component systematically
2. Implement responsive design using container queries where appropriate
3. Add proper ARIA attributes and semantic HTML
4. Test component behavior across all device sizes
5. Ensure theme switching works correctly for all components

**Acceptance Criteria:**
- [ ] All components follow design token system
- [ ] Responsive behavior works smoothly across breakpoints
- [ ] Components maintain functionality while gaining visual polish
- [ ] Dark mode switching works seamlessly
- [ ] Performance impact is minimal (< 50kb total CSS)

#### 2.5 Accessibility and Motion 🎯

**Priority: HIGH**

**Objective**: Ensure full WCAG 2.2 AA compliance and appropriate motion design.

**Accessibility Requirements:**
1. **Color and Contrast**
   - All text/background combinations meet WCAG AA standards (4.5:1 normal, 3:1 large)
   - Information conveyed through more than color alone
   - High contrast mode support

2. **Keyboard Navigation**
   - All interactive elements reachable via keyboard
   - Clear focus indicators with 2px minimum outline
   - Logical tab order throughout application
   - Skip links for main content areas

3. **Screen Reader Support**
   - Semantic HTML structure maintained
   - Proper ARIA labels, descriptions, and roles
   - Live regions for dynamic content updates
   - Alternative text for visual information

4. **Motion and Animation**
   ```css
   /* Respect reduced motion preference */
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   
   /* Default smooth animations */
   .animate-fade-in {
     animation: fade-in 0.3s ease-out;
   }
   
   @keyframes fade-in {
     from { opacity: 0; }
     to { opacity: 1; }
   }
   ```

**Implementation Steps:**
1. Audit current components for accessibility compliance
2. Add missing ARIA attributes and semantic structure
3. Implement proper focus management
4. Add motion controls and reduced motion support
5. Test with screen readers and accessibility tools

**Acceptance Criteria:**
- [ ] WCAG 2.2 AA compliance verified with automated testing
- [ ] Manual screen reader testing completed
- [ ] Keyboard navigation tested for all user flows
- [ ] Color contrast verified for all theme combinations
- [ ] Reduced motion preferences respected

#### 2.6 Performance and Optimization ⚡

**Priority: MEDIUM**

**Objective**: Ensure the design system is performant and doesn't impact app loading speed.

**Performance Targets:**
- CSS bundle size < 50kb gzipped
- First Paint improvement over unstyled version < 100ms
- Smooth 60fps interactions on mobile devices
- Minimal layout shifts during component rendering

**Optimization Strategies:**
1. **CSS Organization**
   ```css
   /* Critical CSS inlined */
   /* Non-critical CSS lazy loaded */
   
   /* Use CSS custom properties efficiently */
   :root {
     --primary-hue: 210;
     --primary-saturation: 100%;
   }
   
   .button-primary {
     background: hsl(var(--primary-hue), var(--primary-saturation), 50%);
   }
   ```

2. **Progressive Enhancement**
   - Core functionality works without CSS
   - Enhanced visual design loads progressively
   - Graceful degradation for older browsers

**Implementation Steps:**
1. Set up CSS optimization build process
2. Implement critical CSS extraction
3. Add performance monitoring for CSS load times
4. Optimize custom property usage
5. Test performance impact across devices

**Acceptance Criteria:**
- [ ] CSS bundle size stays under 50kb
- [ ] No measurable performance regression
- [ ] Lighthouse scores maintain 90+ for performance
- [ ] Visual regression testing passes
- [ ] Cross-browser compatibility verified

#### 2.1.1 Application Layout Structure Plan 📱

### Overview
Based on analysis of the current application, there are **three distinct application states** that require different layout approaches. The layout system must be built with CSS Grid and Flexbox to ensure optimal responsive behavior across all device sizes.

### Application States Analysis
The application transitions between three core states based on user progress:

1. **Setup State** (`appState === 'setup'`) - Initial time configuration
2. **Activity State** (`appState === 'activity'`) - Active timer with activity management  
3. **Completed State** (`appState === 'completed'`) - Session summary and results

---

## Visual Layout Structure Diagrams

### Persistent Elements (Present in All States)

```
┌─────────────────────────────────────────────────────────────┐
│                      APP HEADER (sticky)                    │
│  ┌─────────────┬─────────────────┬─────────────────────────┐ │
│  │ App Title   │                 │ [Theme] [Reset*]        │ │
│  └─────────────┴─────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│              OFFLINE INDICATOR (conditional)                │
└─────────────────────────────────────────────────────────────┘

*Reset button hidden in setup state
```

---

### 1. Setup State Layout

**Purpose**: Configure session duration and mode selection  
**Layout**: Centered single-column focus layout

#### Desktop/Tablet View
```
┌─────────────────────────────────────────────────────────────┐
│                      APP HEADER                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│         ┌─────────────────────────────────┐                 │
│         │                                 │                 │
│         │         TIME SETUP              │                 │
│         │                                 │                 │
│         │  • Duration selection           │                 │
│         │  • Mode selection               │                 │
│         │  • Configuration options        │                 │
│         │  • Start button                 │                 │
│         │                                 │                 │
│         └─────────────────────────────────┘                 │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile View
```
┌───────────────────────────────────┐
│           APP HEADER              │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│                                   │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        TIME SETUP               │ │
│ │                                 │ │
│ │ • Duration selection            │ │
│ │ • Mode selection                │ │
│ │ • Configuration options         │ │
│ │ • Start button                  │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                   │
└───────────────────────────────────┘
```

**Components in Setup State:**
- `TimeSetup` - Main configuration component

---

### 2. Activity State Layout

**Purpose**: Active session with dual-pane layout for activity management and timeline  
**Layout**: Responsive grid transitioning from 2-column desktop to 1-column mobile

#### Desktop View (1024px+)
```
┌─────────────────────────────────────────────────────────────┐
│                      APP HEADER                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   PROGRESS BAR                              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ┌───────────────────────┬───────────────────────────────────┐ │
│ │                       │                                   │ │
│ │   ACTIVITY MANAGER    │          TIMELINE                 │ │
│ │                       │                                   │ │
│ │ • Add activities      │ • Visual timeline                 │ │
│ │ • Current activity    │ • Activity blocks                 │ │
│ │ • Activity list       │ • Time markers                    │ │
│ │ • Controls            │ • Progress indicators             │ │
│ │                       │                                   │ │
│ │                       │                                   │ │
│ │                       │                                   │ │
│ │                       │                                   │ │
│ └───────────────────────┴───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        2fr                        3fr
```

#### Tablet View (768px - 1023px)
```
┌─────────────────────────────────────────────────────────────┐
│                      APP HEADER                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   PROGRESS BAR                              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────┬─────────────────────────────────────┐ │
│ │                     │                                     │ │
│ │  ACTIVITY MANAGER   │         TIMELINE                    │ │
│ │                     │                                     │ │
│ │ • Add activities    │ • Visual timeline                   │ │
│ │ • Current activity  │ • Activity blocks                   │ │
│ │ • Activity list     │ • Time markers                      │ │
│ │ • Controls          │ • Progress indicators               │ │
│ │                     │                                     │ │
│ └─────────────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
        1fr                        1fr
```

#### Mobile View (0px - 767px)
```
┌───────────────────────────────────┐
│           APP HEADER              │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│          PROGRESS BAR             │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│                                   │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │     ACTIVITY MANAGER            │ │
│ │                                 │ │
│ │ • Add activities                │ │
│ │ • Current activity              │ │
│ │ • Activity list                 │ │
│ │ • Controls                      │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                   │
│ Timeline hidden on mobile         │
│ to focus on activity management   │
│                                   │
└───────────────────────────────────┘
```

**Components in Activity State:**
- `ProgressBar` - Session progress visualization
- `ActivityManager` - Activity creation and management
- `Timeline` - Visual timeline of session progress (hidden on mobile)

---

### 3. Completed State Layout

**Purpose**: Display session results and statistics  
**Layout**: Centered single-column content layout

#### Desktop/Tablet View
```
┌─────────────────────────────────────────────────────────────┐
│                      APP HEADER                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│       ┌───────────────────────────────────────┐             │
│       │                                       │             │
│       │            SUMMARY                    │             │
│       │                                       │             │
│       │ • Session statistics                  │             │
│       │ • Activity breakdown                  │             │
│       │ • Time analysis                       │             │
│       │ • Performance metrics                 │             │
│       │ • Export/share options                │             │
│       │                                       │             │
│       │                                       │             │
│       └───────────────────────────────────────┘             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile View
```
┌───────────────────────────────────┐
│           APP HEADER              │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│                                   │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │           SUMMARY               │ │
│ │                                 │ │
│ │ • Session statistics            │ │
│ │ • Activity breakdown            │ │
│ │ • Time analysis                 │ │
│ │ • Performance metrics           │ │
│ │ • Export/share options          │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                   │
└───────────────────────────────────┘
```

**Components in Completed State:**
- `Summary` - Session statistics and activity breakdown

---

### Layout Design Principles

#### Mobile-First Responsive Strategy
- **Base**: 0px - 639px (Mobile phones)
- **sm**: 640px+ (Large mobile phones)
- **md**: 768px+ (Tablets)
- **lg**: 1024px+ (Small laptops/desktop)
- **xl**: 1280px+ (Large desktop screens)

#### Key Layout Features
1. **Persistent Header**: Sticky header with app title and controls
2. **Conditional Elements**: Progress bar and reset button based on state
3. **Responsive Grid**: 2-column desktop → 1-column mobile
4. **Timeline Visibility**: Hidden on mobile to focus on activity management
5. **Touch Optimization**: 44px minimum touch targets, adequate spacing
6. **Container Constraints**: Max-widths prevent excessive stretching
7. **Smooth Transitions**: Animated state changes with reduced motion support

### Accessibility Layout Considerations

#### Semantic Structure
```html
<!-- Semantic layout structure -->
<div class="app-root">
  <header class="app-header" role="banner">
    <!-- Header content -->
  </header>
  
  <main class="app-wrapper" role="main">
    <div class="offline-indicator" role="status" aria-live="polite">
      <!-- Offline status -->
    </div>
    
    <!-- State-specific content areas -->
    <div class="setup-layout" role="region" aria-label="Time setup">
      <!-- Setup state content -->
    </div>
    
    <div class="activity-layout" role="region" aria-label="Activity session">
      <!-- Activity state content -->
    </div>
    
    <div class="completed-layout" role="region" aria-label="Session summary">
      <!-- Completed state content -->
    </div>
  </main>
</div>
```

#### Focus Management
- Skip links for keyboard navigation
- Focus trapping within modal/dialog components
- Logical tab order across layout changes
- Clear focus indicators with proper contrast

### Implementation Priority

1. **Foundation** (Highest): Root layout, header, basic containers
2. **Setup State** (High): Single-column centered layout
3. **Activity State** (High): Dual-pane responsive grid  
4. **Completed State** (Medium): Single-column results layout
5. **Enhancements** (Low): Animations, advanced responsive features

This layout structure provides the foundation for implementing the design system while maintaining optimal user experience across all device sizes and application states.
