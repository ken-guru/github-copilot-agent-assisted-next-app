# Planned Changes

This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation following the template in `docs/templates/PLANNED_CHANGES_TEMPLATE.md`.

Once implemented, move the change to `IMPLEMENTED_CHANGES.md` with a timestamp.

## Bootstrap Alignment and Component Improvements

### 1. Convert TimeSetup Component to Bootstrap Forms
**Priority**: High
**Effort**: Medium
**Type**: Bootstrap Alignment

**Current State**: 
The `TimeSetup` component uses custom CSS modules and HTML inputs that don't align with Bootstrap design patterns.

**Target State**:
- Replace custom CSS with Bootstrap Form components
- Use Bootstrap Button Groups for mode selection
- Implement Bootstrap input validation styling
- Add Bootstrap Icons for better visual hierarchy

**Implementation Steps**:
1. Replace custom `.modeSelector` with Bootstrap `ButtonGroup`
2. Convert time inputs to Bootstrap `Form.Control` with proper validation
3. Apply Bootstrap button styling to submit button
4. Add Bootstrap form validation feedback
5. Remove `TimeSetup.module.css` dependency
6. Add proper Bootstrap spacing utilities

**Dependencies**: None
**Files to Modify**:
- `src/components/feature/TimeSetup.tsx`
- `src/components/feature/TimeSetup.module.css` (remove)

---

### 2. Replace Custom Progress Bar with Bootstrap Progress
**Priority**: High
**Effort**: Medium
**Type**: Bootstrap Alignment

**Current State**: 
Custom progress bar with CSS modules that doesn't leverage Bootstrap's native progress bar animations and styling.

**Target State**:
- Use Bootstrap `ProgressBar` component with built-in animations
- Leverage Bootstrap's `progress-bar-animated` and `progress-bar-striped` classes
- Maintain color progression logic within Bootstrap's framework
- Add smooth transitions with Bootstrap's animation system

**Implementation Steps**:
1. Replace custom progress bar with Bootstrap `ProgressBar` component
2. Implement color progression using Bootstrap's contextual classes
3. Add Bootstrap animation classes for visual appeal
4. Use Bootstrap's responsive utilities for mobile adaptation
5. Remove `ProgressBar.module.css` dependency
6. Integrate with Bootstrap's accessibility features

**Dependencies**: Bootstrap React components
**Files to Modify**:
- `src/components/feature/ProgressBar.tsx`
- `src/components/feature/ProgressBar.module.css` (remove)

---

### 3. Implement Bootstrap Collapse for Timeline
**Priority**: Medium
**Effort**: Medium
**Type**: Bootstrap Alignment

**Current State**: 
Timeline entries use custom CSS for expanding/collapsing content.

**Target State**:
- Use Bootstrap Collapse component for smooth accordion-like behavior
- Add Bootstrap fade transitions for entry additions
- Implement Bootstrap's `collapse` and `show` classes
- Use Bootstrap's accessibility features for screen readers

**Implementation Steps**:
1. Wrap timeline entries in Bootstrap Collapse components
2. Add Bootstrap accordion behavior for entry details
3. Implement fade-in animations for new entries
4. Use Bootstrap icons for expand/collapse indicators
5. Add proper ARIA attributes via Bootstrap components

**Dependencies**: Bootstrap JavaScript components
**Files to Modify**:
- `src/components/feature/Timeline.tsx`
- `src/components/feature/Timeline.module.css`

---

### 4. Enhance Navigation with Bootstrap Navbar Utilities
**Priority**: Medium
**Effort**: Low
**Type**: Bootstrap Alignment

**Current State**: 
Navigation component partially uses Bootstrap but could leverage more utilities.

**Target State**:
- Use Bootstrap Navbar collapse for better mobile experience
- Implement Bootstrap's navbar brand utilities
- Add Bootstrap offcanvas for mobile navigation
- Use Bootstrap's navbar positioning utilities

**Implementation Steps**:
1. Add Bootstrap navbar collapse for mobile
2. Implement Bootstrap offcanvas for slide-out navigation
3. Use Bootstrap spacing utilities consistently
4. Add Bootstrap navbar toggler for mobile
5. Implement proper Bootstrap navbar responsive behavior

**Dependencies**: Bootstrap JavaScript components
**Files to Modify**:
- `src/components/Navigation.tsx`

---

### 5. Consolidate Duplicate ThemeToggle Components
**Priority**: High
**Effort**: Low
**Type**: Component Abstraction

**Current State**: 
Two separate ThemeToggle components exist:
- `src/components/ThemeToggle.tsx` (Bootstrap-based)
- `src/components/ui/ThemeToggle.tsx` (CSS modules-based)

**Target State**:
- Single, consolidated ThemeToggle component using Bootstrap
- Consistent styling and behavior across the app
- Unified props interface for different use cases

**Implementation Steps**:
1. Choose the Bootstrap-based version as the primary component
2. Migrate any unique features from the CSS modules version
3. Update all imports to use the single component
4. Remove duplicate component and CSS module file
5. Update tests to reference single component

**Dependencies**: None
**Files to Modify**:
- Remove: `src/components/ui/ThemeToggle.tsx`
- Remove: `src/components/ui/ThemeToggle.module.css`
- Update imports throughout codebase

---

### 6. Consolidate Duplicate ActivityForm Components
**Priority**: High
**Effort**: Medium
**Type**: Component Abstraction

**Current State**: 
Two ActivityForm components with different features:
- `src/components/ActivityForm.tsx` (simpler version)
- `src/components/feature/ActivityForm.tsx` (full-featured version)

**Target State**:
- Single ActivityForm component with configurable complexity
- Unified props interface supporting both simple and complex modes
- Consistent validation and styling

**Implementation Steps**:
1. Merge functionality into the full-featured version
2. Add `isSimplified` prop to control complexity
3. Update all imports to use single component
4. Remove duplicate component
5. Update tests for merged component
6. Ensure backward compatibility for existing usage

**Dependencies**: None
**Files to Modify**:
- Enhance: `src/components/feature/ActivityForm.tsx`
- Remove: `src/components/ActivityForm.tsx`
- Update imports throughout codebase

---

### 7. Add Bootstrap Animations Throughout App
**Priority**: Medium
**Effort**: Medium
**Type**: Animation Enhancement

**Current State**: 
Limited animations, mostly CSS-based transitions.

**Target State**:
- Smooth Bootstrap fade transitions for component state changes
- Bootstrap collapse animations for expandable content
- Progress bar animations using Bootstrap's built-in classes
- Toast animations using Bootstrap's fade system
- Modal animations with Bootstrap's fade classes

**Implementation Steps**:
1. Add Bootstrap fade classes to modal components
2. Implement collapse animations for timeline entries
3. Use Bootstrap's progress-bar-animated for active timers
4. Add fade transitions to toast notifications
5. Implement smooth scroll behavior with Bootstrap utilities
6. Add loading placeholders with Bootstrap's placeholder animations

**Animation Targets**:
- **Modals**: Add `fade` class for smooth show/hide
- **Alerts/Toasts**: Use `alert-dismissible fade show` pattern
- **Progress Bars**: Add `progress-bar-striped progress-bar-animated`
- **Collapse Elements**: Use Bootstrap collapse transitions
- **Loading States**: Implement `placeholder-glow` and `placeholder-wave`

**Dependencies**: Bootstrap CSS and JavaScript
**Files to Modify**:
- `src/components/ConfirmationDialog.tsx`
- `src/components/ui/ToastContainer.tsx`
- `src/components/feature/ProgressBar.tsx`
- `src/components/feature/Timeline.tsx`

---

### 8. Implement Bootstrap Utility Classes Consistently
**Priority**: Low
**Effort**: Low
**Type**: Code Consistency

**Current State**: 
Mix of custom CSS and Bootstrap utilities.

**Target State**:
- Consistent use of Bootstrap spacing utilities (`m-*`, `p-*`)
- Bootstrap flexbox utilities instead of custom CSS
- Bootstrap responsive utilities for mobile adaptation
- Bootstrap text utilities for typography

**Implementation Steps**:
1. Audit all components for custom CSS that can be replaced
2. Replace custom margin/padding with Bootstrap utilities
3. Convert custom flexbox CSS to Bootstrap flex utilities
4. Use Bootstrap responsive utilities for breakpoint-specific styling
5. Apply Bootstrap text utilities for consistent typography

**Dependencies**: None
**Files to Modify**:
- All component files with custom CSS
- Remove unnecessary CSS module files

---

### 9. Add Bootstrap Tooltips for Enhanced UX
**Priority**: Low
**Effort**: Low
**Type**: UX Enhancement

**Current State**: 
Basic title attributes for accessibility.

**Target State**:
- Bootstrap Tooltip components for interactive help
- Contextual tooltips for button states
- Activity color indicators with tooltip explanations
- Timer controls with helpful tooltips

**Implementation Steps**:
1. Add Bootstrap Tooltip components to key interactive elements
2. Implement tooltips for activity color meanings
3. Add contextual help for timer controls
4. Use tooltips for status indicators
5. Ensure tooltips respect reduced motion preferences

**Dependencies**: Bootstrap JavaScript components
**Files to Modify**:
- `src/components/ActivityButton.tsx`
- `src/components/feature/TimeSetup.tsx`
- `src/components/ThemeToggle.tsx`

---

### 10. Implement Bootstrap Responsive Breakpoint Strategy
**Priority**: Medium
**Effort**: Medium
**Type**: Responsive Design

**Current State**: 
Custom media queries and responsive behavior.

**Target State**:
- Consistent use of Bootstrap's responsive breakpoints
- Bootstrap grid system for layout components
- Responsive utilities for component behavior
- Mobile-first approach aligned with Bootstrap

**Implementation Steps**:
1. Replace custom media queries with Bootstrap breakpoint utilities
2. Implement Bootstrap grid system for layout components
3. Use Bootstrap's responsive display utilities
4. Add responsive text and spacing utilities
5. Ensure components work well across all Bootstrap breakpoints

**Bootstrap Breakpoints to Target**:
- `xs`: < 576px (mobile)
- `sm`: ≥ 576px (mobile landscape)
- `md`: ≥ 768px (tablet)
- `lg`: ≥ 992px (desktop)
- `xl`: ≥ 1200px (large desktop)

**Dependencies**: Bootstrap CSS
**Files to Modify**:
- All components with responsive behavior
- Layout components in particular

---

## Implementation Priority Order

1. **High Priority - Bootstrap Alignment**:
   - Consolidate duplicate ThemeToggle components
   - Consolidate duplicate ActivityForm components  
   - Convert TimeSetup to Bootstrap Forms
   - Replace Progress Bar with Bootstrap component

2. **Medium Priority - UX Enhancements**:
   - Add Bootstrap animations throughout app
   - Implement Bootstrap Collapse for Timeline
   - Implement responsive breakpoint strategy
   - Enhance Navigation with Bootstrap utilities

3. **Low Priority - Polish**:
   - Implement Bootstrap utility classes consistently
   - Add Bootstrap Tooltips for enhanced UX

## Success Metrics

- **Code Consistency**: 90% of custom CSS replaced with Bootstrap utilities
- **Component Reuse**: Zero duplicate components
- **Animation Quality**: Smooth transitions on all state changes
- **Responsive Design**: Consistent behavior across all Bootstrap breakpoints
- **Accessibility**: All animations respect `prefers-reduced-motion`
- **Performance**: Reduced CSS bundle size through Bootstrap consolidation
