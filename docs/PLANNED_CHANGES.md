# Planned Changes Prompt Template
This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation. Once implemented, move the change to IMPLEMENTED_CHANGES.md with a timestamp.

## Change Request Template
```markdown
# Feature/Change Title

## Context
Provide context about the part of the application this change affects.
- Which components/utilities are involved?
- What current behavior needs to change?
- What user needs does this address?

## Requirements
Detailed specifications for the change:
1. First requirement
   - Implementation details
   - Technical considerations
   - Testing requirements
2. Second requirement
   - Sub-points
   - Edge cases to handle
3. Additional requirements as needed

## Technical Guidelines
- Framework-specific considerations
- Performance requirements
- Accessibility requirements
- Theme compatibility requirements
- Testing approach

## Expected Outcome
Describe what success looks like:
- User perspective
- Technical perspective
- Testing criteria

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
```

Note: When implementing a change, copy this template and fill it out completely. The more detailed the prompt, the better the AI assistance will be in implementation.

# Repositioning Progress Element to Top of Application
## Context
Currently, the mobile layout positions the Progress element at the very bottom of the screen using a fixed position, which creates usability issues with toast notifications. Instead of just creating space for toast messages below the Progress element, we've decided to move the Progress element to the top of the application, between the header and main content.

**Key components involved**:
- ProgressBar component (src/components/ProgressBar.tsx)
- Mobile-specific CSS in page.module.css
- Page structure in page.tsx
- UpdateNotification component (potential style conflicts)

## Issue Analysis
1. The Progress element is currently attached to the bottom of the mobile viewport using fixed positioning:
   ```css
   .progressContainer {
     position: fixed;
     bottom: 0;
     left: 0;
     right: 0;
     z-index: 100;
     /* ... */
   }
   ```
2. This positioning creates conflicts with toast messages that typically appear at the bottom of the viewport.
3. A better approach is to integrate the Progress element into the natural flow of the page, positioning it between the header and main content.

## Implementation Plan
### 1. Reposition Progress Element in DOM Structure
- **Move Element in DOM Hierarchy**: Reposition the Progress element to appear after the header and OfflineIndicator, but before the main content.
  - Update the DOM order in page.tsx
  - Ensure the element appears in a logical reading order

### 2. Update CSS Styling
- **Remove Fixed Positioning**: Convert the Progress element from fixed positioning to normal flow.
  - Remove position: fixed from progressContainer
  - Add appropriate margins for visual separation
  - Maintain consistent styling across viewport sizes

### 3. Layout Adjustments
- **Adjust Main Content Spacing**: Update spacing for main content to accommodate the new Progress element position.
  - Remove extra padding-bottom from container
  - Ensure proper visual hierarchy with spacing between elements

### 4. Responsive Considerations
- **Maintain Responsive Design**: Ensure the repositioned element works well across all device sizes.
  - Update media queries for mobile and landscape orientations
  - Test with different viewport dimensions

### 5. Toast Notification Compatibility
- **Restore Standard Toast Positioning**: Allow toast notifications to use their standard bottom positioning.
  - Update any toast-specific CSS if needed
  - Ensure consistent z-index hierarchy

### 6. Theme Compatibility
- **Maintain Existing Theme Support**: Ensure all changes maintain compatibility with existing light/dark themes.
  - Use CSS variables for colors and spacing
  - Test in both theme modes

### 7. Testing Strategy
1. Unit Tests:
   - Verify correct DOM positioning of Progress element
   - Test responsive behavior across viewports
2. Integration Tests:
   - Ensure no layout issues when switching between application states
   - Verify toast notifications appear correctly
3. Visual Tests:
   - Validate appearance in different viewport sizes and orientations
   - Test with both light and dark themes

## Technical Implementation Details
### DOM Structure Update
```jsx
{/* In page.tsx */}
<div className={styles.wrapper}>
  <header className={styles.header}>
    {/* Header content */}
  </header>
  <OfflineIndicator />
  {/* Progress bar positioned between header and main content */}
  <div className={styles.progressContainer}>
    <ProgressBar 
      entries={processedEntries}
      totalDuration={totalDuration}
      elapsedTime={elapsedTime}
      timerActive={timerActive}
    />
  </div>
  {/* Main content (setup/activity/completed grids) */}
</div>
```

### CSS Modifications
```css
/* Update to progressContainer in page.module.css */
.progressContainer {
  margin: 0 1rem 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--background-alt, white);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
  z-index: 10; /* Ensure it's above content but below header */
}

/* Media query updates for mobile */
@media (max-width: 768px) {
  .progressContainer {
    margin: 0.5rem;
    padding: 0.5rem;
  }
  
  /* Remove extra padding since progress bar is no longer at bottom */
  .container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

## Benefits
1. **User Experience**:
   - Progress bar is more visible in the natural reading flow
   - Toast messages can use standard positioning without conflicts
   - Layout flows more naturally without fixed elements interrupting content
2. **Developer Experience**:
   - Simpler CSS structure without fixed positioning complexities
   - Better alignment with standard web patterns for progress indicators
   - Easier implementation of future notifications

## Validation Criteria
- [ ] Progress bar visible and functional in new position between header and main content
- [ ] Toast messages appear correctly without positioning conflicts
- [ ] No layout shifts when switching between application states
- [ ] Theme compatibility verified in light and dark modes
- [ ] Mobile testing completed across different device sizes
- [ ] All existing tests updated and passing
- [ ] Documentation updated to reflect layout changes
