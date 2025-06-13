# CSS and HTML Structure Removal Experiment

## Experiment Objective
Remove all CSS styling and non-functional HTML structure from the entire application to create a completely unstyled, minimally-structured version that retains only core functionality.

## Hypothesis
By stripping away all visual styling and structural HTML elements, we can:
- Identify the true functional core of each component
- Understand which HTML elements are actually necessary for functionality
- Create a baseline for rebuilding with intentional design choices
- Analyze component complexity when reduced to pure function

## Safety Measures
- Working on separate experimental branch
- Git commit after each component modification
- Two-stage process per component for granular control
- **Note: Ignoring TDD approach for this experiment**

## Phase 1: Analysis and Mapping

### CSS Files Inventory
- [ ] **Identify all CSS files**
  - Global CSS files (`globals.css`, etc.)
  - Component-specific CSS modules
  - Styled-components files
  - Any utility/framework CSS
- [ ] **Document CSS import patterns**
  - Imports in `_app.tsx`
  - Component-level imports
  - Dynamic imports

### Component Inventory
- [ ] **Map all React components**
  - Page components (`pages/` directory)
  - Layout components
  - UI/Feature components
  - Utility components
- [ ] **Identify component hierarchy**
  - Leaf components (no child components)
  - Parent/container components
  - Layout wrapper components

## Phase 2: Global CSS Removal

- [ ] **Remove global CSS files**
  - Delete all `.css` files
  - Delete styled-components global styles
- [ ] **Remove CSS imports**
  - Clean imports from `_app.tsx`
  - Clean imports from layout files
- [ ] **Commit: "Remove all global CSS files"**

## Phase 3: Component Processing (Two-Stage Per Component)

### Processing Order (Leaf to Root)
1. **Utility/Leaf Components**
   - [ ] Buttons, inputs, text elements
   - [ ] Icons, images
   - [ ] Simple display components

2. **Feature Components**
   - [ ] Forms
   - [ ] Lists/tables
   - [ ] Navigation elements
   - [ ] Content displays

3. **Layout Components**
   - [ ] Headers, footers
   - [ ] Sidebars, containers
   - [ ] Page layouts

4. **Page Components**
   - [ ] Individual pages
   - [ ] Route components

### Two-Stage Process Template
For each component:

**Stage 1: CSS Removal**
- [ ] Remove all `className` attributes
- [ ] Remove `style` props
- [ ] Remove styled-component usage
- [ ] Remove CSS module imports
- [ ] **Commit: "Remove CSS from [ComponentName]"**

**Stage 2: HTML Structure Stripping**
- [ ] Remove wrapper `<div>` elements
- [ ] Remove `<section>`, `<article>` containers
- [ ] Remove purely structural elements
- [ ] Keep only functional HTML elements:
  - Form elements (`<form>`, `<input>`, `<button>`)
  - Semantic content (`<h1>-<h6>`, `<p>`, `<a>`)
  - Interactive elements
  - Essential accessibility elements
- [ ] **Commit: "Strip HTML structure from [ComponentName]"**

## Phase 4: Final Cleanup

- [ ] **Remove unused dependencies**
  - CSS-related packages
  - Styling libraries
  - Unused imports
- [ ] **Verify functionality**
  - Test core features still work
  - Ensure no broken functionality
- [ ] **Final commit: "Complete CSS and structure removal experiment"**

## Success Criteria

### Functional Requirements
- [ ] All interactive features continue to work
- [ ] Form submissions still function
- [ ] Navigation remains operational
- [ ] Data display is intact (though unstyled)

### Structural Requirements
- [ ] Zero CSS files remain in project
- [ ] No styling-related code in components
- [ ] Minimal HTML structure (only functional elements)
- [ ] Clean git history with granular commits

### Documentation Requirements
- [ ] Document findings about essential vs. non-essential elements
- [ ] Note any functionality that broke during stripping
- [ ] Record insights about component complexity
- [ ] Update memory log with experiment results

## Expected Outcome

**User Perspective:**
- Completely unstyled, basic HTML appearance
- All functionality preserved but visually primitive
- Faster load times due to no CSS processing

**Technical Perspective:**
- Minimal component code focused purely on logic
- Clear separation of concerns between function and presentation
- Baseline for intentional design reconstruction
- Understanding of true component dependencies

**Development Insights:**
- Which HTML elements are truly necessary
- How much code is purely presentational
- Component complexity when reduced to core function
- Opportunities for simpler component structures

## Rollback Plan
- Return to main branch: `git checkout main`
- Experiment preserved in feature branch for future reference
- No impact on main application development

## Next Steps After Experiment
- Analyze findings and document insights
- Consider rebuilding styling with minimal, intentional approach
- Apply learnings to component architecture improvements
- Use as reference for future component design decisions
