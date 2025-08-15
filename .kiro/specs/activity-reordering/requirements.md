# Requirements Document

## Introduction

This feature adds drag-and-drop reordering functionality to activities in Mr. Timely, allowing users to customize the order of their activities in both the activities management view and the timer view. The new order will persist across page loads and browser sessions, providing a consistent user experience.

## Requirements

### Requirement 1

**User Story:** As a user managing multiple activities, I want to reorder my activities by dragging and dropping them, so that I can organize them according to my priorities or workflow preferences.

#### Acceptance Criteria

1. WHEN I am in the activities view THEN I SHALL be able to drag any activity to a new position in the list
2. WHEN I drag an activity to a new position THEN the system SHALL update the visual order immediately
3. WHEN I drop an activity in a new position THEN the system SHALL save the new order to local storage
4. WHEN I have activities in different states (PENDING, RUNNING, COMPLETED) THEN I SHALL be able to reorder activities within and across state groups
5. IF an activity is currently running THEN the system SHALL still allow it to be reordered without affecting its timer state

### Requirement 2

**User Story:** As a user working through my activities in the timer view, I want the activities to appear in my custom order, so that I can follow my preferred workflow sequence.

#### Acceptance Criteria

1. WHEN I am in the timer view THEN activities SHALL be displayed in the same order I set in the activities view
2. WHEN I reorder activities in the activities view THEN the timer view SHALL reflect the new order immediately
3. WHEN I navigate between activities and timer views THEN the activity order SHALL remain consistent
4. WHEN the timeline visualization is displayed THEN it SHALL respect the custom activity order

### Requirement 3

**User Story:** As a user who closes and reopens the application, I want my activity order to be preserved, so that I don't have to reorganize my activities every time I use the app.

#### Acceptance Criteria

1. WHEN I reorder activities and refresh the page THEN the system SHALL maintain the custom order
2. WHEN I close the browser and reopen the application THEN the system SHALL restore the previously saved activity order
3. WHEN I add a new activity THEN the system SHALL place it at the end of the list by default
4. WHEN I delete an activity THEN the system SHALL maintain the relative order of remaining activities
5. IF no custom order has been set THEN the system SHALL use the default creation order

### Requirement 4

**User Story:** As a user with accessibility needs, I want to reorder activities using keyboard navigation, so that I can organize my activities without relying on mouse interactions.

#### Acceptance Criteria

1. WHEN I focus on an activity THEN I SHALL be able to use keyboard shortcuts to move it up or down
2. WHEN I use keyboard reordering THEN the system SHALL provide audio or visual feedback about the new position
3. WHEN I use screen readers THEN the system SHALL announce position changes clearly
4. WHEN I tab through activities THEN the focus order SHALL match the visual order
5. WHEN I skip activities during execution THEN the system SHALL preserve the original custom order for summary display

### Requirement 5

**User Story:** As a user reviewing my completed session in the summary view, I want to see my activities organized according to my custom order, so that I can understand my workflow and review my progress in a logical sequence.

#### Acceptance Criteria

1. WHEN I reach the summary view THEN completed activities SHALL be displayed in the same relative order I set originally
2. WHEN some activities are skipped and others completed THEN the system SHALL maintain the relative order within each group (completed and skipped)
3. WHEN I have both completed and skipped activities THEN the system SHALL preserve the original ordering relationships between activities in their respective lists
4. WHEN I view the summary timeline THEN it SHALL reflect the custom activity order for both completed and skipped activities
5. WHEN activities are distributed between completed and skipped lists THEN each list SHALL internally maintain the relative order from the original custom sequence

### Requirement 6

**User Story:** As a user on a mobile device, I want to reorder activities using touch gestures, so that I can organize my activities on smaller screens effectively.

#### Acceptance Criteria

1. WHEN I long-press on an activity on a touch device THEN the system SHALL enter drag mode
2. WHEN I drag an activity on a touch screen THEN the system SHALL provide visual feedback during the drag operation
3. WHEN I release an activity during touch drag THEN the system SHALL drop it in the nearest valid position
4. WHEN I accidentally start a drag gesture THEN I SHALL be able to cancel it by dragging outside the valid drop area
5. WHEN activities are being reordered on mobile THEN the interface SHALL remain responsive and not interfere with scrolling