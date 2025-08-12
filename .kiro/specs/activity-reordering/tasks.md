# Implementation Plan

- [x] 1. Create activity order utility functions
  - Implement core order management utilities in `src/utils/activity-order.ts`
  - Create functions for getting, setting, and manipulating activity order in localStorage
  - Add validation and error handling for corrupted order data
  - Write comprehensive unit tests for all order utility functions
  - _Requirements: 1.3, 3.1, 3.2, 3.4_

- [x] 2. Extend activity storage with order integration
  - Modify `src/utils/activity-storage.ts` to include order-aware functions
  - Add `getActivitiesInOrder()` function that returns activities sorted by custom order
  - Add `reorderActivities()` function to persist new order arrangements
  - Ensure order synchronization when activities are added, deleted, or restored
  - Write unit tests for order integration with existing storage functions
  - _Requirements: 1.3, 3.1, 3.2, 3.4, 3.5_

- [x] 3. Create drag-and-drop state management hook
  - Implement `src/hooks/useDragAndDrop.ts` for drag-and-drop state management
  - Handle drag start, drag over, drag end, and drop events
  - Implement reordering logic that updates both local state and persistent storage
  - Add visual feedback state management for drag operations
  - Write unit tests for drag-and-drop state transitions and reordering logic
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. Create keyboard reordering accessibility hook
  - Implement `src/hooks/useKeyboardReordering.ts` for keyboard-based reordering
  - Add keyboard event handlers for up/down arrow keys with modifier keys (Ctrl+Up/Down or Alt+Up/Down)
  - Implement focus management and position announcements for screen readers
  - Add ARIA live region support for accessibility feedback
  - Write unit tests for keyboard navigation and accessibility features
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Add drag handles and visual feedback to ActivityButton component
  - Modify `src/components/ActivityButton.tsx` to include drag handles (grip icon)
  - Add drag event handlers (onDragStart, onDragOver, onDragEnd, onDrop) and visual states
  - Implement proper ARIA attributes for drag-and-drop accessibility (draggable, aria-grabbed)
  - Add CSS classes for drag feedback (.dragging, .drag-over) and hover states
  - Write component tests for drag handle interactions and visual states
  - _Requirements: 1.1, 1.2, 4.1, 4.3_

- [ ] 6. Integrate reordering functionality into ActivityManager
  - Modify `src/components/ActivityManager.tsx` to use `getActivitiesInOrder()` instead of `getActivities()`
  - Integrate useDragAndDrop and useKeyboardReordering hooks
  - Add reordering event handlers and pass activity IDs to drag-and-drop hook
  - Ensure ActivityManager re-renders when order changes
  - Write integration tests for ActivityManager with reordering enabled
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.3_

- [ ] 7. Update Summary component to respect custom activity order
  - Modify `src/components/Summary.tsx` to sort activities using `sortActivitiesByOrder()` utility
  - Update `calculateActivityTimes()` to preserve custom order when building activity time list
  - Ensure completed activities maintain their relative custom order in the summary display
  - Ensure skipped activities maintain their relative custom order within the skipped group
  - Write tests for summary order consistency with various activity completion scenarios
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Update Timeline component for visual order consistency
  - Modify `src/components/Timeline.tsx` to consider custom activity order for visual consistency
  - Ensure timeline entries maintain chronological order for time calculations (no changes to time logic)
  - Add visual indicators or sorting hints that respect custom order where appropriate
  - Maintain existing timeline functionality while improving visual consistency with other views
  - Write tests for timeline visual consistency with custom activity order
  - _Requirements: 2.2, 2.4_

- [ ] 9. Add mobile touch support for drag-and-drop
  - Extend useDragAndDrop hook to handle touch events (touchstart, touchmove, touchend)
  - Implement long-press detection (500ms) for touch drag initiation to avoid conflicts with scrolling
  - Add touch-specific visual feedback and drop zone indicators for mobile devices
  - Handle touch gesture cancellation and edge cases (scroll interference, multi-touch)
  - Write tests for mobile touch interactions and gesture handling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Add comprehensive error handling and edge cases
  - Review and enhance error handling in activity-order.ts for localStorage quota exceeded scenarios
  - Add validation for corrupted order data with automatic cleanup (already partially implemented)
  - Handle edge cases like missing activities in order array (already implemented via cleanupActivityOrder)
  - Add graceful degradation when drag-and-drop is not supported (feature detection)
  - Write additional tests for error scenarios and recovery mechanisms
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ] 11. Create end-to-end tests for complete reordering workflows
  - Write Cypress tests for drag-and-drop reordering scenarios in `cypress/e2e/activity-reordering.cy.ts`
  - Test order persistence across page reloads and browser sessions
  - Test cross-view consistency (Activities → Timer → Summary views maintain same order)
  - Test accessibility features with keyboard navigation (Tab, Ctrl+Up/Down)
  - Test mobile touch interactions on various screen sizes (if mobile touch is implemented)
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 4.2, 6.1, 6.2_

- [ ] 12. Add performance optimizations and final polish
  - Review debounced order persistence implementation in useDragAndDrop (already implemented)
  - Add memoization for sorted activity arrays in ActivityManager to prevent unnecessary re-renders
  - Optimize drag feedback rendering for smooth interactions (CSS transitions, transform instead of layout changes)
  - Add loading states and transition animations for better user experience
  - Write performance tests for large activity lists (20+ activities) and rapid reordering
  - _Requirements: 1.2, 1.4, 1.5, 6.5_