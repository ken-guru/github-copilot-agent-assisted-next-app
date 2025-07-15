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

# Activity CRUD with Supabase Integration

## Context
The application currently uses hardcoded activities (Homework, Reading, Play Time, Chores) defined in the ActivityManager component. This change will:
- Replace the static activity list with a dynamic database-driven system using Supabase PostgreSQL
- Add a separate administration interface at `/activities` for managing activities
- Integrate navigation to access the management interface
- Allow users to select from existing activities or create new ones on-the-fly during timer sessions
- Maintain backward compatibility with existing state management and user flows

**Components Affected:**
- `ActivityManager.tsx` - Remove hardcoded activities, fetch from database
- `LayoutClient.tsx` - Add navigation component
- Entire activity state management system
- Application routing structure

**Current Behavior:**
- Activities are hardcoded in ActivityManager component initialization
- No way to customize or persist activity definitions
- Limited to four predefined activities

**User Needs:**
- Ability to customize activities for different contexts (work, personal, educational)
- Persistent activity definitions across sessions
- Easy management of activity libraries
- Flexibility to add activities during timer sessions

## Requirements

### 1. Supabase Integration Setup
   - **Implementation Details:**
     - Install `@supabase/supabase-js` package
     - Create Supabase client configuration in `src/utils/supabase/client.ts`
     - Set up environment variables in `.env.example` (for structure) and Vercel dashboard (for actual values)
     - Configure TypeScript types for database schema
     - Create `.env.example` with placeholder values for documentation
   - **Technical Considerations:**
     - Use singleton pattern for client initialization
     - Implement proper error handling for connection issues
     - Support for server-side and client-side operations
     - **Security**: Never commit real environment variables to source control
     - **Vercel**: Set environment variables in Vercel dashboard for all environments
   - **Testing Requirements:**
     - Mock Supabase client for testing
     - Integration tests for database operations
     - Test environment variable setup in Vercel Preview deployments

### 2. Database Schema Design
   - **Implementation Details:**
     ```sql
     CREATE TABLE activities (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       name TEXT NOT NULL,
       description TEXT,
       color_index INTEGER NOT NULL DEFAULT 0,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       is_active BOOLEAN DEFAULT true
     );
     ```
   - **Technical Considerations:**
     - **Simple & Focused**: Single table that acts as activity template library
     - **No Authentication**: Starts as public activities (can add user_id later)
     - **Color Index System**: Maintains compatibility with existing theme system
     - **Soft Deletion**: `is_active` flag prevents data loss while hiding activities
     - **Session State Separate**: Activity status (pending/running/completed) remains in memory via ActivityStateMachine
     - **Extensible Design**: Easy to add user authentication and advanced features later
   - **Testing Requirements:**
     - Schema validation tests
     - Constraint testing
     - Data migration tests
     - Backward compatibility with existing color system

### 3. Row Level Security (RLS) Configuration
   - **Implementation Details:**
     - Enable RLS on activities table for security best practices
     - Create restrictive public read/write policy for initial implementation (no authentication)
     - Plan for future user-specific policies when authentication is added
     - Document all security policies and their purpose
     ```sql
     ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
     
     -- Initial public policy with explicit permissions (can be refined later)
     CREATE POLICY "Public activities read" ON activities
       FOR SELECT TO anon, authenticated
       USING (is_active = true);
       
     CREATE POLICY "Public activities write" ON activities
       FOR INSERT TO anon, authenticated
       WITH CHECK (true);
       
     CREATE POLICY "Public activities update" ON activities
       FOR UPDATE TO anon, authenticated
       USING (true)
       WITH CHECK (true);
       
     CREATE POLICY "Public activities delete" ON activities
       FOR DELETE TO anon, authenticated
       USING (true);
     ```
   - **Technical Considerations:**
     - Start with restrictive access, expand as needed
     - Prepare foundation for future user authentication
     - **Security**: Explicitly define what operations are allowed for which users
     - **Audit**: Log policy changes and review regularly
   - **Testing Requirements:**
     - Security policy tests for all CRUD operations
     - Access control validation with different user roles
     - Future migration path testing for user-specific policies

### 4. Activity Service Layer
   - **Implementation Details:**
     - Create `src/services/activity-service.ts`
     - Implement CRUD operations: create, read, update, delete
     - Add input validation and sanitization for all operations
     - Implement proper error handling with user-friendly messages
     - Add logging for all external API interactions
     - Implement caching strategy for performance
   - **Technical Considerations:**
     - **Security**: Validate and sanitize all inputs before sending to Supabase
     - **Error Handling**: Never expose sensitive information in error messages
     - **Type Safety**: Use generated types from Supabase schema
     - **Performance**: Implement optimistic updates for better UX
     - **Monitoring**: Log all database operations for debugging and security audit
   - **Testing Requirements:**
     - Unit tests for all CRUD operations with various input scenarios
     - Security tests for input validation and sanitization
     - Error scenario testing (network failures, invalid data, etc.)
     - Performance testing for caching effectiveness

### 5. Navigation System
   - **Implementation Details:**
     - Create `src/components/Navigation.tsx` component
     - Add to `LayoutClient` component
     - Implement responsive navigation (mobile-friendly)
     - Style with Bootstrap classes to match existing theme
   - **Technical Considerations:**
     - Maintain theme compatibility (light/dark modes)
     - Accessible navigation patterns
     - Mobile-first responsive design
   - **Testing Requirements:**
     - Navigation component tests
     - Theme compatibility tests
     - Accessibility tests

### 6. Activity Management Interface
   - **Implementation Details:**
     - Create `src/app/activities/page.tsx`
     - Create `src/components/ActivityCrud.tsx`
     - Create `src/components/ActivityForm.tsx` for add/edit operations
     - Create `src/components/ActivityList.tsx` for listing with actions
     - Implement confirmation dialogs for destructive actions
   - **Technical Considerations:**
     - Real-time updates without page refresh
     - Form validation and error handling
     - Loading states for async operations
     - Consistent styling with existing components
   - **Testing Requirements:**
     - Component interaction tests
     - Form validation tests
     - CRUD operation tests
     - Error handling tests

### 7. ActivityManager Integration
   - **Implementation Details:**
     - Replace hardcoded activities with database fetch
     - Implement `useActivities` hook for data management
     - Add "Add New Activity" option to activity selection
     - Handle loading and error states
     - Maintain existing state management patterns
   - **Technical Considerations:**
     - Seamless integration with existing ActivityStateMachine
     - Backward compatibility with existing hooks
     - Graceful degradation when database unavailable
   - **Testing Requirements:**
     - Update existing ActivityManager tests
     - Integration tests with database
     - State management compatibility tests

### 8. Data Migration & Seeding
   - **Implementation Details:**
     - Create seed script to populate default activities (Homework, Reading, Play Time, Chores)
     - Maintain color index compatibility with existing theme system
     - Provide simple migration for any future schema changes
     ```sql
     -- Seed default activities
     INSERT INTO activities (name, color_index, description) VALUES
       ('Homework', 0, 'Academic work and study time'),
       ('Reading', 1, 'Reading books, articles, or educational materials'),
       ('Play Time', 2, 'Recreation and leisure activities'),
       ('Chores', 3, 'Household tasks and responsibilities');
     ```
   - **Technical Considerations:**
     - Idempotent migration scripts that can run multiple times safely
     - Preserve existing color index to theme mapping
     - Simple rollback strategies
     - Environment-specific seeding
   - **Testing Requirements:**
     - Migration script tests
     - Seed data validation tests
     - Color index compatibility tests

## Technical Guidelines

### Vercel Deployment Considerations
- **Environment Variables**: Store Supabase keys in Vercel dashboard, never in source control. Use `.env.example` for structure only
- **Serverless Functions**: Next.js API routes run as stateless serverless functions - avoid long-running operations
- **Database Connections**: Use Supabase client only; never connect directly to PostgreSQL from Vercel functions
- **Static vs Dynamic Rendering**: Use SSG for static pages, SSR/client-side fetching for dynamic activity data
- **Rate Limits**: Be mindful of both Vercel execution limits and Supabase API rate limits
- **Preview Deployments**: Test Supabase integration in Vercel Preview Deployments before production
- **Monitoring**: Use Vercel's logging for API routes and add error reporting for Supabase operations

### Security Precautions for External Communication
- **Key Management**: Only use Supabase anon key in client-side code. Never expose service role keys
- **Row Level Security**: Always enable RLS on all tables. Create restrictive policies even for public access
- **Input Validation**: Sanitize and validate all user inputs before sending to Supabase
- **Error Handling**: Gracefully handle Supabase errors without leaking sensitive information
- **Network Security**: All Supabase communication uses HTTPS by default
- **Data Minimization**: Only request and store necessary data fields
- **Audit Trail**: Log all external API interactions for debugging and security monitoring
- **Future Authentication**: Design RLS policies to easily transition to user-specific access

### Framework Considerations
- **Next.js App Router**: Use server components where appropriate for initial data loading
- **TypeScript**: Generate types from Supabase schema for full type safety
- **React Patterns**: Maintain existing hook patterns and component structure
- **State Management**: Integrate with existing ActivityStateMachine and hooks
- **Simplified Architecture**: Database serves as activity template library, session state remains in memory

### Performance Requirements
- **Database Queries**: Simple queries on single table with proper indexing
- **Caching**: Implement client-side caching for activity list (infrequently changes)
- **Loading States**: Provide immediate feedback for all async operations
- **Pagination**: Not needed initially (expect small number of activities)

### Accessibility Requirements
- **Navigation**: ARIA labels and keyboard navigation support
- **Forms**: Proper labeling and validation feedback
- **Actions**: Confirmation dialogs with clear context
- **Screen Readers**: Semantic HTML and ARIA attributes

### Theme Compatibility Requirements
- **Bootstrap Integration**: Use existing Bootstrap classes and custom properties
- **Dark/Light Mode**: Ensure all new components support theme switching
- **Color System**: Maintain existing color index system for activity theming
- **Responsive Design**: Mobile-first approach consistent with existing components

### Testing Approach
- **Unit Tests**: Jest for individual functions and components
- **Integration Tests**: React Testing Library for component interactions
- **E2E Tests**: Cypress for complete user flows
- **Database Tests**: Supabase local testing environment

## Expected Outcome

### User Perspective
- **Activity Management**: Users can create, edit, and delete custom activities from a dedicated interface
- **Flexible Selection**: During timer sessions, users can select from existing activities or create new ones
- **Persistent Data**: Activity definitions persist across sessions and devices
- **Intuitive Navigation**: Clear navigation between timer interface and management interface
- **Responsive Experience**: All functionality works seamlessly on mobile and desktop

### Technical Perspective
- **Clean Architecture**: Simple database layer serving as activity template library
- **Type Safety**: Full TypeScript coverage with generated database types
- **Performance**: Fast loading with simple queries and appropriate caching
- **Maintainability**: Clear separation between persistent templates and session state
- **Testability**: Comprehensive test coverage for all new functionality
- **Future-Ready**: Foundation for user authentication and advanced features

### Testing Criteria
- **Functional Tests**: All CRUD operations work correctly
- **Integration Tests**: Seamless integration with existing timer functionality
- **Error Handling**: Graceful handling of network issues and edge cases
- **Performance Tests**: Acceptable loading times and response times
- **Accessibility Tests**: Full keyboard navigation and screen reader support

## Validation Criteria
- [ ] Supabase client configured and tested
- [ ] Environment variables properly set in Vercel dashboard (not source control)
- [ ] Database schema created with proper RLS policies
- [ ] Security policies tested for all CRUD operations
- [ ] Activity service layer implemented with input validation and error handling
- [ ] All external API interactions properly logged
- [ ] Navigation component added to layout
- [ ] Activity management interface (/activities) fully functional
- [ ] ActivityManager updated to use database activities
- [ ] Data migration and seeding scripts created
- [ ] All existing tests updated and passing
- [ ] New functionality thoroughly tested including security scenarios
- [ ] Vercel Preview deployment tested with Supabase integration
- [ ] Theme compatibility verified across all new components
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility standards met
- [ ] Performance benchmarks satisfied
- [ ] Documentation updated (component docs, README, Vercel setup)
- [ ] Memory Log entries created for implementation process
- [ ] Code quality checks passed (lint, type-check, build)
- [ ] Security audit completed for external communication

## Implementation Phases

### Phase 1: Foundation (Database & Services)
- [ ] Install and configure Supabase client
- [ ] Create simplified database schema with RLS policies
- [ ] Implement activity service layer for CRUD operations
- [ ] Create data migration and seeding scripts

### Phase 2: Navigation & Routes
- [ ] Add navigation component to layout
- [ ] Create /activities route structure
- [ ] Update layout integration with responsive navigation

### Phase 3: Management Interface
- [ ] Build ActivityCrud page with Bootstrap styling
- [ ] Implement ActivityForm for create/edit operations
- [ ] Create ActivityList component with edit/delete actions
- [ ] Add confirmation dialogs and comprehensive error handling

### Phase 4: Integration & Testing
- [ ] Update ActivityManager to fetch from database instead of hardcoded list
- [ ] Maintain compatibility with existing ActivityStateMachine
- [ ] Add "Create New Activity" option to activity selection flow
- [ ] Comprehensive testing and bug fixes
- [ ] Documentation updates and cleanup

## Future Evolution Path

While starting simple, the schema can evolve to support advanced features:

### Phase 2: User Authentication (Future)
```sql
ALTER TABLE activities ADD COLUMN user_id UUID REFERENCES auth.users(id);
-- Update RLS policies for user-specific access
```

### Phase 3: Activity Sets/Routines (Future)
```sql
CREATE TABLE activity_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  planned_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activity_set_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id),
  activity_set_id UUID REFERENCES activity_sets(id),
  order_index INTEGER
);
```

### Phase 4: Session Persistence (Future)
- Add session tracking tables if users request this feature
- Implement persistent timer sessions across browser sessions

---

*This change represents a significant architectural enhancement that will greatly improve the application's flexibility and user experience while maintaining the existing user flow and design patterns.*