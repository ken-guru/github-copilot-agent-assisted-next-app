# Implementation Plan

- [x] 1. Create activity order utility functions
  - Implement core order management utilities in `src/utils/activity-order.ts`
  - Create functions for getting, setting, and manipulating activity order in localStorage
  - Add validation and error handling for corrupted order data
  - Write comprehensive unit tests for all order utility functions
  - _Requirements: 1.3, 3.1, 3.2, 3.4_

- [ ] 2. Extend activity storage with order integration
  - Modify `src/utils/activity-storage.ts` to include order-aware functions
  - Add `getActivitiesInOrder()` function that returns activities sorted by custom order
  - Add `reorderActivities()` function to persist new order arrangements
  - Ensure order synchronization when activities are added, deleted, or restored
  - Write unit tests for order integration with existing storage functions
  - _Requirements: 1.3, 3.1, 3.2, 3.4, 3.5_

- [ ] 3. Create drag-and-drop state management hook
  - Implement `src/hooks/useDragAndDrop.ts` for drag-and-drop state management
  - Handle drag start, drag over, drag end, and drop events
  - Implement reordering logic that updates both local state and persistent storage
  - Add visual feedback state management for drag operations
  - Write unit tests for drag-and-drop state transitions and reordering logic
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Create keyboard reordering accessibility hook
  - Implement `src/hooks/useKeyboardReordering.ts` for keyboard-based reordering
  - Add keyboard event handlers for up/down arrow keys with modifier keys
  - Implement focus management and position announcements for screen readers
  - Add ARIA live region support for accessibility feedback
  - Write unit tests for keyboard navigation and accessibility features
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Add drag handles and visual feedback to ActivityButton component
  - Modify `src/components/ActivityButton.tsx` to include drag handles
  - Add drag event handlers and visual states (dragging, drag-over)
  - Implement proper ARIA attributes for drag-and-drop accessibility
  - Add CSS classes for drag feedback and hover states
  - Write component tests for drag handle interactions and visual states
  - _Requirements: 1.1, 1.2, 4.1, 4.3_

- [ ] 6. Integrate reordering functionality into ActivityManager
  - Modify `src/components/ActivityManager.tsx` to use order-aware activity loading
  - Integrate drag-and-drop and keyboard reordering hooks
  - Add reordering event handlers and state management
  - Ensure new activities are added to the end of the custom order
  - Write integration tests for ActivityManager with reordering enabled
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.3_

- [ ] 7. Update Summary component to respect custom activity order
  - Modify `src/components/Summary.tsx` to use order-aware activity sorting
  - Ensure completed activities maintain their relative custom order
  - Ensure skipped activities maintain their relative custom order within the skipped group
  - Preserve original ordering relationships when activities are distributed between completed and skipped lists
  - Write tests for summary order consistency with various activity completion scenarios
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Update Timeline component for visual order consistency
  - Modify `src/components/Timeline.tsx` to respect custom activity order in visual representation
  - Ensure timeline entries maintain chronological order for time calculations
  - Add display order consideration for visual consistency with other views
  - Maintain existing timeline functionality while respecting custom order
  - Write tests for timeline visual consistency with custom activity order
  - _Requirements: 2.2, 2.4_

- [ ] 9. Add mobile touch support for drag-and-drop
  - Extend drag-and-drop hook to handle touch events (touchstart, touchmove, touchend)
  - Implement long-press detection for touch drag initiation
  - Add touch-specific visual feedback and drop zone indicators
  - Handle touch gesture cancellation and edge cases
  - Write tests for mobile touch interactions and gesture handling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Add comprehensive error handling and edge cases
  - Implement error handling for localStorage quota exceeded scenarios
  - Add validation for corrupted order data with automatic cleanup
  - Handle edge cases like missing activities in order array
  - Add graceful degradation when drag-and-drop is not supported
  - Write tests for error scenarios and recovery mechanisms
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ] 11. Create end-to-end tests for complete reordering workflows
  - Write Cypress tests for drag-and-drop reordering scenarios
  - Test order persistence across page reloads and browser sessions
  - Test cross-view consistency (Activities → Timer → Summary)
  - Test accessibility features with keyboard navigation
  - Test mobile touch interactions on various screen sizes
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 4.2, 6.1, 6.2_

- [ ] 12. Add performance optimizations and final polish
  - Implement debounced order persistence to reduce localStorage writes
  - Add memoization for sorted activity arrays to prevent unnecessary re-renders
  - Optimize drag feedback rendering for smooth interactions
  - Add loading states and transition animations for better user experience
  - Write performance tests for large activity lists and rapid reordering
  - _Requirements: 1.2, 1.4, 1.5, 6.5_