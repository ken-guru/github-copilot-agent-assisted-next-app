# Planned Changes

This document contains specifications for upcoming changes to the application. Each change should be documented using the template format to ensure AI-assisted implementation is effective.

## Using the Template

When planning a new feature or change:

1. **Use the Template**: Copy the structure from [PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md)
2. **Fill Out Completely**: The more detailed the specification, the better the AI assistance
3. **Include All Sections**: Context, Requirements, Technical Guidelines, Expected Outcome, and Validation Criteria
4. **Move When Complete**: After implementation, move the completed change to [IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md) with timestamp

## Template Reference

See [docs/templates/PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md) for the complete template structure.

---

## Current Planned Changes

# Activity Customization with Local Storage

## Context
The application currently uses hardcoded activities (Homework, Reading, Play Time, Chores) defined in the ActivityManager component. This change will:
- Replace the static activity list with a customizable system using browser localStorage
- Add a simple management interface at `/activities` for managing custom activities
- Allow users to select from existing activities or create new ones on-the-fly during timer sessions
- Maintain backward compatibility with existing state management and user flows
- Provide instant loading and offline functionality with zero external dependencies

**Components Affected:**
- `ActivityManager.tsx` - Load activities from localStorage with fallback to defaults
- `LayoutClient.tsx` - Add navigation component
- Activity state management system (minimal changes)
- Application routing structure (new /activities route)

**Current Behavior:**
- Activities are hardcoded in ActivityManager component initialization
- No way to customize or persist activity definitions
- Limited to four predefined activities
- No persistence of user preferences

**User Needs:**
- Ability to customize activities for different contexts (work, personal, educational)
- Persistent activity definitions across browser sessions
- Easy management of personal activity library
- Flexibility to add activities during timer sessions
- Fast, reliable access without network dependencies

## Requirements

### 1. Local Storage Integration
   - **Implementation Details:**
     - Create `src/utils/activity-storage.ts` for localStorage operations
     - Implement functions: `getActivities()`, `saveActivities()`, `addActivity()`, `updateActivity()`, `deleteActivity()`
     - Use JSON serialization with proper error handling
     - Implement storage key versioning for future migrations
     - Fallback to default activities if localStorage is empty or corrupted
   - **Technical Considerations:**
     - Handle localStorage quota exceeded errors gracefully
     - Validate data structure on load to prevent corruption issues
     - Support for localStorage being disabled (private browsing)
     - Atomic operations to prevent partial updates
     - **Browser Compatibility**: Works in all modern browsers
   - **Testing Requirements:**
     - Unit tests for all storage operations
     - Error handling tests (quota exceeded, disabled localStorage)
     - Data validation and corruption recovery tests
     - Cross-session persistence tests

### 2. Activity Data Structure
   - **Implementation Details:**
     ```typescript
     interface Activity {
       id: string; // UUID for unique identification
       name: string;
       description?: string;
       colorIndex: number; // Maintains compatibility with existing theme system
       createdAt: string; // ISO timestamp
       isActive: boolean; // Soft deletion support
     }
     ```
   - **Technical Considerations:**
     - **Simple & Focused**: Single interface that acts as activity template
     - **Color Index System**: Maintains compatibility with existing theme system
     - **Soft Deletion**: `isActive` flag prevents data loss while hiding activities
     - **Session State Separate**: Activity status (pending/running/completed) remains in memory via ActivityStateMachine
     - **Extensible Design**: Easy to add fields later without breaking existing data
     - **UUID Generation**: Use crypto.randomUUID() or fallback for older browsers
   - **Testing Requirements:**
     - Interface validation tests
     - Data migration tests for future schema changes
     - Backward compatibility with existing color system
     - UUID generation and uniqueness tests

### 3. Activity Service Layer
   - **Implementation Details:**
     - Create `src/services/activity-service.ts`
     - Implement CRUD operations using localStorage
     - Add input validation and sanitization for all operations
     - Implement proper error handling with user-friendly messages
     - Add optimistic updates for better UX
     - Cache activities in memory for performance
   - **Technical Considerations:**
     - **Input Validation**: Validate all inputs before storing
     - **Error Handling**: Provide clear error messages for storage issues
     - **Type Safety**: Full TypeScript coverage with strict typing
     - **Performance**: In-memory caching with localStorage sync
     - **Consistency**: Ensure state consistency between cache and storage
   - **Testing Requirements:**
     - Unit tests for all CRUD operations with various input scenarios
     - Input validation and sanitization tests
     - Error scenario testing (storage failures, invalid data, etc.)
     - Performance testing for caching effectiveness
     - State consistency tests

### 4. Navigation System
   - **Implementation Details:**
     - Create `src/components/Navigation.tsx` component
     - Add to `LayoutClient` component
     - Implement responsive navigation (mobile-friendly)
     - Style with Bootstrap classes to match existing theme
     - Simple navigation items: "Timer" and "Activities"
   - **Technical Considerations:**
     - Maintain theme compatibility (light/dark modes)
     - Accessible navigation patterns
     - Mobile-first responsive design
     - Minimal UI that doesn't interfere with timer focus
   - **Testing Requirements:**
     - Navigation component tests
     - Theme compatibility tests
     - Accessibility tests
     - Mobile responsiveness tests

### 5. Activity Management Interface
   - **Implementation Details:**
     - Create `src/app/activities/page.tsx`
     - Create `src/components/ActivityCrud.tsx`
     - Create `src/components/ActivityForm.tsx` for add/edit operations
     - Create `src/components/ActivityList.tsx` for listing with actions
     - Implement confirmation dialogs for destructive actions
     - Add import/export functionality for backup
   - **Technical Considerations:**
     - Real-time updates without page refresh
     - Form validation and error handling
     - Loading states for operations
     - Consistent styling with existing components
     - Drag-and-drop reordering support
   - **Testing Requirements:**
     - Component interaction tests
     - Form validation tests
     - CRUD operation tests
     - Error handling tests
     - Import/export functionality tests

### 6. ActivityManager Integration
   - **Implementation Details:**
     - Replace hardcoded activities with localStorage fetch
     - Implement `useActivities` hook for data management
     - Add "Add New Activity" option to activity selection
     - Handle loading and error states gracefully
     - Maintain existing state management patterns
     - Preserve activity selection behavior
   - **Technical Considerations:**
     - Seamless integration with existing ActivityStateMachine
     - Backward compatibility with existing hooks
     - Graceful degradation when localStorage unavailable
     - Maintain performance of activity selection
   - **Testing Requirements:**
     - Update existing ActivityManager tests
     - Integration tests with localStorage
     - State management compatibility tests
     - Error handling and fallback tests

### 7. Data Migration & Default Activities
   - **Implementation Details:**
     - Provide default activities on first run (Homework, Reading, Play Time, Chores)
     - Maintain color index compatibility with existing theme system
     - Simple migration for future localStorage schema changes
     - Export/import functionality for manual backups
     ```typescript
     const DEFAULT_ACTIVITIES: Activity[] = [
       { id: '1', name: 'Homework', colorIndex: 0, description: 'Academic work and study time', createdAt: new Date().toISOString(), isActive: true },
       { id: '2', name: 'Reading', colorIndex: 1, description: 'Reading books, articles, or educational materials', createdAt: new Date().toISOString(), isActive: true },
       { id: '3', name: 'Play Time', colorIndex: 2, description: 'Recreation and leisure activities', createdAt: new Date().toISOString(), isActive: true },
       { id: '4', name: 'Chores', colorIndex: 3, description: 'Household tasks and responsibilities', createdAt: new Date().toISOString(), isActive: true }
     ];
     ```
   - **Technical Considerations:**
     - Preserve existing color index to theme mapping
     - Version localStorage schema for future changes
     - Provide data recovery options
     - Handle edge cases (corrupted data, partial loads)
   - **Testing Requirements:**
     - Default activity initialization tests
     - Color index compatibility tests
     - Data recovery and migration tests
     - Export/import functionality tests

## Technical Guidelines

### Browser Compatibility and Performance
- **LocalStorage Support**: Target all modern browsers (IE 11+, all current browsers)
- **Storage Limits**: Handle 5-10MB localStorage limit gracefully with error messaging
- **Performance**: In-memory caching for frequently accessed data, sync to localStorage on changes
- **Offline First**: Works completely offline with no network dependencies
- **Fast Loading**: Instant activity loading from localStorage, no API delays
- **Error Recovery**: Graceful handling of storage quota exceeded, disabled localStorage scenarios

### Data Management and Storage
- **Storage Strategy**: Use localStorage with JSON serialization for activity data
- **Backup/Restore**: Export/import functionality for manual data backup
- **Data Validation**: Validate all data on load to prevent corruption issues
- **Schema Versioning**: Version localStorage data for future migration support
- **Conflict Resolution**: Last-write-wins for simplicity (single browser/user model)

### Security and Privacy
- **Local Data**: All data stays in user's browser, no external storage or transmission
- **Input Validation**: Sanitize and validate all user inputs before storing
- **XSS Prevention**: Proper escaping of user-generated content in UI
- **No Network Security**: No external API calls means no network security concerns
- **Privacy**: Zero data collection, completely local operation

### Framework Considerations
- **Next.js App Router**: Use client components for localStorage interaction
- **TypeScript**: Full type safety with strict typing for all storage operations
- **React Patterns**: Maintain existing hook patterns and component structure
- **State Management**: Integrate with existing ActivityStateMachine and hooks
- **Simplified Architecture**: localStorage serves as activity template library, session state remains in memory

### Performance Requirements
- **Instant Loading**: No network delays, immediate activity availability
- **Memory Efficiency**: Cache active activities in memory, lazy load inactive ones
- **Storage Efficiency**: JSON compression for large activity sets if needed
- **UI Responsiveness**: Optimistic updates for immediate user feedback
- **Minimal Bundle Size**: No external dependencies for basic functionality

### Accessibility Requirements
- **Navigation**: ARIA labels and keyboard navigation support
- **Forms**: Proper labeling and validation feedback
- **Actions**: Confirmation dialogs with clear context
- **Screen Readers**: Semantic HTML and ARIA attributes
- **Error Messages**: Clear, accessible error communication

### Theme Compatibility Requirements
- **Bootstrap Integration**: Use existing Bootstrap classes and custom properties
- **Dark/Light Mode**: Ensure all new components support theme switching
- **Color System**: Maintain existing color index system for activity theming
- **Responsive Design**: Mobile-first approach consistent with existing components

### Testing Approach
- **Unit Tests**: Jest for individual functions and components
- **Integration Tests**: React Testing Library for component interactions
- **E2E Tests**: Cypress for complete user flows including localStorage persistence
- **Storage Tests**: Specific tests for localStorage operations, quota handling, and data recovery

## Expected Outcome

### User Perspective
- **Activity Customization**: Users can create, edit, and delete custom activities from a dedicated interface
- **Instant Access**: Activities load immediately with no network delays or loading states
- **Flexible Selection**: During timer sessions, users can select from existing activities or create new ones
- **Persistent Data**: Activity definitions persist across browser sessions on the same device
- **Intuitive Navigation**: Clear navigation between timer interface and management interface
- **Responsive Experience**: All functionality works seamlessly on mobile and desktop
- **Offline Reliability**: Complete functionality even without internet connection
- **Data Control**: Users own their data locally, with easy export/import for backup

### Technical Perspective
- **Simple Architecture**: LocalStorage serves as activity template library with zero external dependencies
- **Type Safety**: Full TypeScript coverage with strict typing for storage operations
- **Performance**: Instant loading with no network latency or API calls
- **Maintainability**: Clear separation between persistent templates and session state
- **Testability**: Comprehensive test coverage for all functionality including storage edge cases
- **Future-Ready**: Foundation that can evolve to cloud sync if users demand it, but works perfectly standalone
- **Zero Infrastructure**: No external services, databases, or environment variables to manage

### Testing Criteria
- **Functional Tests**: All CRUD operations work correctly with localStorage
- **Integration Tests**: Seamless integration with existing timer functionality
- **Error Handling**: Graceful handling of storage quota exceeded, disabled localStorage, and data corruption
- **Performance Tests**: Instant loading times and responsive UI
- **Accessibility Tests**: Full keyboard navigation and screen reader support
- **Cross-Session Tests**: Data persists correctly across browser sessions

## Validation Criteria
- [ ] LocalStorage utility functions implemented and tested
- [ ] Activity data structure defined with TypeScript interfaces
- [ ] Activity service layer implemented with input validation and error handling
- [ ] Storage quota and disabled localStorage scenarios handled gracefully
- [ ] Navigation component added to layout
- [ ] Activity management interface (/activities) fully functional
- [ ] ActivityManager updated to use localStorage activities
- [ ] Default activity initialization implemented
- [ ] Export/import functionality for data backup
- [ ] All existing tests updated and passing
- [ ] New functionality thoroughly tested including storage edge cases
- [ ] Data corruption recovery mechanisms tested
- [ ] Theme compatibility verified across all new components
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility standards met
- [ ] Performance benchmarks satisfied (instant loading)
- [ ] Documentation updated (component docs, README)
- [ ] Memory Log entries created for implementation process
- [ ] Code quality checks passed (lint, type-check, build)
- [ ] Cross-session persistence verified

## Implementation Phases

### Phase 1: Foundation (Storage & Service Layer)
- [x] Create localStorage utility functions in `src/utils/activity-storage.ts` (complete)
- [x] Define Activity interface and types (complete)
- [x] Implement activity service layer with full CRUD operations (complete)
- [x] Create comprehensive error handling for storage scenarios (complete)
- [x] Add unit tests for all storage operations (complete)

### Phase 2: Navigation & Routes
- [x] Add navigation component to layout (complete)
- [x] Create /activities route structure (complete)
- [x] Update layout integration with responsive navigation (complete)
- [x] Test navigation functionality across devices (complete)

### Phase 3: Management Interface
- [ ] Build ActivityCrud page with Bootstrap styling
- [ ] Implement ActivityForm for create/edit operations
- [ ] Create ActivityList component with edit/delete actions
- [ ] Add confirmation dialogs and comprehensive error handling
- [ ] Implement export/import functionality

### Phase 4: Integration & Testing
- [ ] Update ActivityManager to use localStorage instead of hardcoded list
- [ ] Maintain compatibility with existing ActivityStateMachine
- [ ] Add "Create New Activity" option to activity selection flow
- [ ] Comprehensive testing including edge cases and error scenarios
- [ ] Documentation updates and cleanup

## Future Evolution Path

The localStorage approach provides a solid foundation that can evolve based on user needs:

### Phase 2: Enhanced Local Features (Future)
- **Activity Templates**: Predefined activity sets for different contexts (work, study, personal)
- **Activity Scheduling**: Time-based activity suggestions
- **Usage Analytics**: Local statistics about activity usage patterns
- **Improved Export/Import**: Support for different file formats, partial imports

### Phase 3: Optional Cloud Sync (Future, if users request it)
```typescript
// Only if localStorage proves insufficient
interface SyncCapableActivity extends Activity {
  lastModified: string;
  syncStatus: 'local' | 'synced' | 'conflict';
}
```
- Add cloud sync as an optional enhancement
- Maintain localStorage as the primary storage
- Implement conflict resolution for multi-device scenarios
- User authentication only if cloud sync is needed

### Phase 4: Advanced Features (Future)
- **Activity Sharing**: Share activity sets with other users
- **Team Activities**: Collaborative activity management
- **Integration APIs**: Connect with external productivity tools

### Migration Strategy
The localStorage foundation makes future enhancements easy:
- **No Breaking Changes**: LocalStorage data can be migrated to any future system
- **Progressive Enhancement**: Add features incrementally without changing core functionality  
- **User Choice**: Users can choose which features to enable
- **Backwards Compatibility**: Always maintain localStorage as a fallback option

---

*This change represents a focused enhancement that provides immediate user value while maintaining simplicity and reliability. The localStorage approach gives users full control over their data with zero infrastructure complexity.*