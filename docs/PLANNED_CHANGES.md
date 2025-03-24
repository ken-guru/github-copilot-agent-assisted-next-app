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

# Ensure Application Functionality Without Network Connectivity

## Context
- **Components Involved**: The entire application, requiring modifications to Next.js configuration, new hooks for offline state, and service worker implementation
- **Current Behavior**: Application currently functions without explicit network requirements but lacks offline-specific features like caching, offline detection, and PWA installation
- **User Needs**: Users need uninterrupted access to the application functionality even when network connectivity is lost or unstable

## Requirements

1. Service Worker and PWA Configuration
   - Implement a service worker to cache application assets and resources
   - Create a web manifest file for PWA installation
   - Configure Next.js for PWA support
   - Set up appropriate caching strategies for application assets

2. Offline State Detection and Management
   - Create a hook to detect and track online/offline status
   - Implement UI indicators for offline status
   - Handle transitions between online and offline states gracefully

3. Local Data Persistence
   - Ensure all application data is stored in local storage or IndexedDB
   - Implement graceful fallbacks for storage failures
   - Verify application state persistence across page reloads

4. Offline User Experience
   - Add appropriate messaging for users when offline
   - Ensure all critical functionality works without network access
   - Provide installation instructions for PWA functionality

## Technical Guidelines
- Follow test-first development approach by writing tests before implementation
- Use Next.js PWA plugin or implement custom service worker solution
- Ensure compatibility with different browsers' offline capabilities
- Implement proper error handling for offline scenarios
- Keep the bundle size minimal to facilitate offline caching

## Expected Outcome

### User Perspective
- Users can continue using the application without interruption when offline
- Application provides clear indication of offline status
- Users can install the application as a PWA to their device
- All core functionality remains available even when network connection is lost

### Technical Perspective
- Service worker properly caches and serves application assets
- Application detects and responds to connectivity changes
- Data persistence mechanisms work reliably regardless of network state
- No console errors related to network requests when offline

### Testing Criteria
- Verify application loads and functions when network is disabled
- Confirm offline status is correctly detected and displayed
- Test that PWA installation works correctly
- Ensure data entered while offline persists when connection is restored

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated

# Update Progress Element Visual Representation

## Context
- **Components Involved**: ProgressBar component (src/components/ProgressBar.tsx, src/components/ProgressBar.module.css)
- **Current Behavior**: Current implementation uses staggered progress bars where each activity has its own separate bar segment with activity-specific colors.
- **User Needs**: A more focused and less visually complex progress indicator that clearly communicates time usage to the user.

## Requirements

1. Single Progress Indicator
   - Replace multi-segment progress bar with a single, unified progress bar
   - Progress should only reflect the proportion of provided duration that has been spent
   - Remove activity-specific segments, labels, and colors

2. Dynamic Color Glowing Implementation
   - Add color-coded glow effect to the progress bar based on time spent:
     - < 50% of duration: Green glow
     - 50%-75% of duration: Yellow glow
     - 75%-100% of duration: Orange glow
     - 100%: Red pulsing effect
   - Time spent exceeding provided duration should maintain the red pulsing effect
   - Progress bar size should not grow beyond 100% even if time exceeds allocated duration

3. Visual Refinements
   - Maintain clean, modern aesthetic consistent with the rest of the application
   - Ensure high contrast between progress bar and background
   - Make visual state changes smooth with appropriate transitions

## Technical Guidelines
- Use CSS variables for colors to ensure theme compatibility
- Implement animations using CSS keyframes for better performance
- Ensure accessibility by adding appropriate ARIA attributes for screen readers
- Avoid layout shifts when transitioning between color states
- Maintain backward compatibility with components that consume the ProgressBar

## Expected Outcome

### User Perspective
- Users can quickly understand how much of their allocated time has been used
- The color-coding provides an intuitive visual cue about time management
- Progress indicator feels cohesive and integrated with the rest of the UI

### Technical Perspective
- Simplified component with fewer conditional rendering branches
- Better performance due to fewer DOM elements and simpler state management
- Consistent behavior across different screen sizes and themes

### Testing Criteria
- Verify progress bar correctly reflects elapsed time
- Confirm color transitions occur at the specified thresholds
- Test that the progress bar caps at 100% when time exceeds duration
- Ensure animations work across supported browsers

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
