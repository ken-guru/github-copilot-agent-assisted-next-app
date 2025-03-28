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

# Mobile Layout Optimization for Toast Message Display

## Context
Currently, the mobile layout positions the Progress element at the very bottom of the screen using a fixed position, which leaves no space for displaying toast notifications. This creates a usability issue as toast messages have nowhere to appear without overlapping with existing UI elements.

**Key components involved**:
- ProgressBar component (src/components/ProgressBar.tsx)
- Mobile-specific CSS in page.module.css
- UpdateNotification component (potential style conflicts)

## Issue Analysis
1. The Progress element is attached to the bottom of the mobile viewport using fixed positioning:
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

2. This positioning leaves no dedicated space for toast messages, which typically appear at the bottom or top of the viewport.

3. Any content shift caused by moving the Progress element might affect the overall layout experience.

## Implementation Plan

### 1. Modify Progress Element Positioning
- **Create Space by Moving Upward**: Adjust the position of the Progress element to be positioned higher in the mobile layout.
  - Modify the fixed position to include a gap at the bottom for toast messages
  - Add bottom margin/padding to ensure consistent space

### 2. Define Toast Message Area
- **Create Reserved Space**: Define a dedicated area below the Progress element for toast messages.
  - Add CSS variables for toast message area height
  - Ensure toast area has proper z-index for visibility

### 3. Layout Adjustments
- **Fix Content Overlap Issues**: Adjust any content that might overlap with the new positioning.
  - Update padding-bottom on main content container to account for raised Progress element
  - Ensure spacing between content and Progress element remains visually balanced

### 4. Responsive Considerations
- **Handle Various Device Sizes**: Implement responsive adjustments for different mobile viewports.
  - Test with different device sizes
  - Ensure proper handling of notch/bezel areas on modern phones
  - Consider landscape mode handling

### 5. Theme Compatibility
- **Maintain Existing Theme Support**: Ensure all changes maintain compatibility with existing light/dark themes.
  - Use CSS variables for colors and spacing
  - Test in both theme modes

### 6. Testing Strategy
1. Unit Tests:
   - Update ProgressBar.test.tsx to verify correct rendering with new spacing
   - Test different screen dimensions

2. Integration Tests:
   - Verify no layout shifts when timer activates
   - Ensure content is not obscured

3. Visual Tests:
   - Test with mocked toast messages to verify proper spacing
   - Validate in different browser sizes and device orientations

## Technical Implementation Details

### CSS Modifications
```css
/* Update to progressContainer in page.module.css */
.progressContainer {
  position: fixed;
  bottom: var(--toast-area-height, 3rem); /* Adjust from bottom: 0 */
  left: 0;
  right: 0;
  z-index: 100;
  /* ... existing styles ... */
}

/* Add space for toast messages */
:root {
  --toast-area-height: 3rem; /* Default space for toast messages */
}

/* Update container padding to account for both progress bar and toast area */
.container {
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--progress-bar-height, 2.5rem) + var(--toast-area-height, 3rem));
}
```

### Component Updates
1. **ProgressBar Component**: No functionality changes needed, only position changes via CSS
2. **Page Layout**: Ensure main content respects the new spacing to prevent content being hidden

## Benefits

1. **User Experience**:
   - Toast messages will have dedicated space for visibility
   - No component overlap when notifications appear
   - Consistent layout without sudden shifts

2. **Developer Experience**:
   - Well-defined toast area makes it easier to implement future notifications
   - Clear separation of concerns between progress and notification areas
   - Consistent pattern for adding future system messages

## Validation Criteria
- [ ] Progress bar visible and functional in correct position
- [ ] Space available for toast messages below progress bar
- [ ] No layout shifts when switching between application states
- [ ] Theme compatibility verified in light and dark modes
- [ ] Mobile testing completed across different device sizes
- [ ] All existing tests updated and passing
- [ ] Documentation updated to reflect layout changes
