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

---

# Complete Application Rewrite: React + Vite + Tailwind CSS

## Context
**Complete ground-up rewrite** of the existing Next.js application using React with Vite and Tailwind CSS. This is NOT a migration or port - it's a **complete recreation** of functionality using the current application only as a reference for:
- What features to implement
- How features should behave from a user perspective
- Visual design and layout patterns
- Component functionality and interactions

**Key Principle**: Write everything from scratch - components, tests, styling, utilities, and configuration. Use modern best practices and patterns throughout.

**Current Application Reference Points**:
- Custom theme system with light/dark/system mode switching
- Activity management components: ActivityForm, ActivityManager, Timeline
- Progress tracking: ProgressBar, Summary components
- Time management: TimeSetup, Timer functionality
- Visual feedback and responsive design
- TypeScript implementation with comprehensive test coverage

## Requirements

### 1. Project Foundation (Complete Greenfield Setup)
   - Create brand new Vite + React + TypeScript project
   - Design optimal file structure for React/Vite ecosystem
   - Configure Tailwind CSS with custom design system from scratch
   - Set up Vitest as test runner with React Testing Library
   - Configure modern ESLint/Prettier setup for React 18
   - Implement path aliases and development tooling
   - Create package.json with curated, minimal dependencies

### 2. Design System Creation
   - **Analyze current visual design** for color schemes, typography, spacing
   - **Create Tailwind theme configuration** defining:
     - Custom color palette for light/dark themes
     - Typography scale and font selections
     - Spacing and sizing systems
     - Component-specific design tokens
     - Animation and transition patterns
   - **Design utility classes** for common patterns
   - **Implement CSS custom properties** for dynamic theming

### 3. Component Architecture Design
   - **Study current component behavior** without looking at implementation
   - **Design modern React component architecture**:
     - Functional components with hooks exclusively
     - Custom hooks for shared logic
     - Compound component patterns where appropriate
     - Proper TypeScript interfaces and props
   - **Create component hierarchy**:
     - Atomic components (buttons, inputs, cards)
     - Molecular components (forms, widgets)
     - Organism components (dashboard, complex layouts)
   - **Implement accessibility-first design**

### 4. Test-First Development Strategy
   - **Write comprehensive test suites** for each component before implementation
   - **Define component behavior through tests**:
     - User interaction patterns
     - State management expectations
     - Props and rendering behavior
     - Error handling and edge cases
     - Responsive behavior testing
   - **Use tests as component specifications**
   - **Implement components to satisfy test requirements**

### 5. Feature Implementation (Ground-Up Rewrite)

   #### Phase 1: Foundation Components
   - **Theme System**: Complete rewrite of theme switching logic
     - Context-based theme management
     - localStorage persistence
     - Tailwind dark mode integration
     - Theme toggle component
   - **Base UI Components**: Button, Input, Card, Modal, etc.
   - **Layout System**: Grid, Container, Responsive utilities
   - **Error Handling**: ErrorBoundary, error states

   #### Phase 2: Activity Management Components  
   - **ActivityForm**: Component for creating/editing activities
     - Form validation and state management
     - Duration and deadline input handling
     - Activity type selection
     - Form submission and error handling
   - **ActivityManager**: Main activity control component
     - Activity lifecycle state management (PENDING → RUNNING → COMPLETED)
     - Real-time activity monitoring
     - Activity status controls (start, pause, complete)
   - **Timeline Components**: Activity timeline visualization
     - TimelineDisplay for showing activity history
     - Timeline component for structured timeline data
     - Real-time updates and visual feedback

   #### Phase 3: Progress and Visualization Components
   - **ProgressBar**: Visual progress tracking
     - Real-time progress calculation
     - Visual progress indicators
     - Color-coded progress states
     - Animation and smooth transitions
   - **Summary Component**: Activity summary and statistics
     - Activity completion summaries
     - Time tracking analytics
     - Visual data presentation
   - **TimeSetup Component**: Time configuration interface
     - Duration setting interface
     - Deadline management
     - Time validation and formatting
   
   #### Phase 4: Layout and Integration
   - **Main Layout**: Activity timer application layout
     - Responsive grid layout for activity components
     - Component composition patterns
     - State coordination between activity components
   - **App Integration**: Complete application assembly
     - Activity state management integration
     - Theme system integration
     - Offline support and service worker integration

### 6. Modern React Patterns Implementation
   - **React 18 Features**: Concurrent rendering, automatic batching
   - **Custom Hooks**: Shared logic extraction
   - **Context API**: Global state management
   - **Performance Optimization**: React.memo, useMemo, useCallback
   - **Error Boundaries**: Comprehensive error handling
   - **Suspense**: Loading state management

### 7. Styling Strategy (Tailwind-First)
   - **Design components with Tailwind utilities**
   - **Create design system with Tailwind configuration**
   - **Implement responsive design with Tailwind breakpoints**
   - **Use Tailwind's dark mode features**
   - **Create custom component classes for complex patterns**
   - **Optimize for minimal CSS bundle size**

### 8. Testing Strategy (Test-First Approach)
   - **Write tests before implementing components**
   - **Test user interactions and behavior**
   - **Test responsive design and theme switching**
   - **Integration testing for component interactions**
   - **Accessibility testing**
   - **Performance testing where relevant**

## Technical Guidelines

### Development Workflow
**IMPORTANT: Incremental Development with Git Tracking**

**Core Principle**: Implement each component incrementally with regular git commits to track progress and enable easy rollback if needed.

#### Per-Component Development Cycle:
1. **Analyze current feature** - understand user experience and behavior
2. **Design component API** - props, state, interactions  
3. **Write comprehensive tests** - define expected behavior
   - 🔄 **COMMIT**: "Add tests for [ComponentName] - [brief description]"
4. **Implement component** - satisfy tests with modern patterns
   - 🔄 **COMMIT**: "Implement [ComponentName] basic functionality"
5. **Style with Tailwind** - responsive, theme-aware design
   - 🔄 **COMMIT**: "Add styling to [ComponentName] - responsive + theme support"
6. **Document component** - usage examples and API
   - 🔄 **COMMIT**: "Document [ComponentName] - API and usage examples"
7. **Integrate and test** - verify with other components
   - 🔄 **COMMIT**: "Integrate [ComponentName] with [related components]"

#### Git Commit Strategy:
- **Frequency**: Commit after each major step (tests, implementation, styling, integration)
- **Granularity**: One logical change per commit (easier to track and revert)
- **Messages**: Clear, descriptive commit messages following pattern:
  ```
  [Action] [Component/Feature] - [Brief description]
  
  Examples:
  - "Add tests for ActivityForm - form validation and state management"
  - "Implement ActivityManager - basic state machine logic" 
  - "Fix ActivityForm validation - handle edge cases"
  - "Integrate ActivityManager with Timeline - real-time updates"
  ```
- **Verification**: Run tests before each commit to ensure stability
- **Documentation**: Update memory logs at component completion milestones

#### Break Points for Review:
- After completing each component's test suite
- After implementing core component functionality
- After styling and theme integration
- After full component integration
- Before moving to next phase

#### Benefits of Incremental Approach:
- **Change Tracking**: Easy to see what changed when
- **Rollback Safety**: Can revert specific changes without losing other work
- **Progress Visibility**: Clear milestones and achievements  
- **Debugging**: Easier to identify when issues were introduced
- **Collaboration**: Better history for team understanding

### Technology Stack
- **Build Tool**: Vite with SWC for fastest builds
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v3 with JIT mode
- **Testing**: Vitest + React Testing Library + jsdom
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6 (if needed)
- **Development**: ESLint + Prettier + TypeScript strict mode

### Code Quality Standards
- **TypeScript**: Strict mode with comprehensive typing
- **Testing**: >90% test coverage with meaningful tests
- **Accessibility**: WCAG compliance built-in
- **Performance**: Optimized bundle size and runtime performance
- **Documentation**: Comprehensive component documentation
- **Code Style**: Consistent formatting and patterns

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Input, Card, etc.)
│   ├── feature/        # Activity components (ActivityForm, ActivityManager, etc.)
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks for activity management
├── contexts/           # React contexts (Theme, Activity state)
├── lib/                # Core business logic (activity state machine, time utils)
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and Tailwind config
└── __tests__/          # Test files
```

## Expected Outcome

### User Experience
- **Identical functionality** to current application
- **Improved performance** with modern React patterns
- **Enhanced visual design** with Tailwind consistency
- **Better responsive behavior** across all devices
- **Smooth animations and transitions**

### Technical Excellence
- **Modern React codebase** following current best practices
- **Optimal build performance** with Vite
- **Maintainable styling** with Tailwind design system
- **Comprehensive test coverage** driving quality
- **Type-safe implementation** throughout

### Developer Experience
- **Fast development workflow** with Vite HMR
- **Productive styling** with Tailwind utilities
- **Clear component architecture** and documentation
- **Reliable testing** with comprehensive coverage
- **Modern tooling** and development environment

## Validation Criteria

**Implementation Approach**: Each phase should be completed incrementally with regular git commits and verification checkpoints.

### Phase 1: Foundation ✅ **COMPLETED**
- [x] Vite + React + TypeScript project setup complete
- [x] Tailwind CSS configured with custom theme  
- [x] Vitest + React Testing Library working
- [x] ESLint + Prettier + TypeScript configured
- [x] File structure and development workflow established
- [x] Basic component templates and patterns defined
- **Git Milestone**: `Phase 1 Complete - Foundation Ready`

### Phase 2: Core Components ✅ **COMPLETED**
- [x] Theme system implemented and tested
- [x] Base UI components created (Button, Input, Card, etc.)
- [x] Layout system implemented  
- [x] Error boundaries and error handling
- [x] All foundation tests passing
- **Git Milestone**: `Phase 2 Complete - Core UI Components Ready`
- **Current Status**: 166/167 tests passing (99.4% success rate)

### Phase 3: Activity Management Components 🔄 **NEXT PHASE**

#### 3.1 ActivityForm Component
- [ ] **Tests**: Write comprehensive test suite for ActivityForm
  - [ ] Form validation tests
  - [ ] State management tests  
  - [ ] Error handling tests
  - [ ] Accessibility tests
  - 🔄 **Commit Checkpoint**: "Add ActivityForm test suite"
- [ ] **Implementation**: Core ActivityForm functionality
  - [ ] Basic form structure and validation
  - [ ] State management with hooks
  - [ ] Error handling and edge cases
  - 🔄 **Commit Checkpoint**: "Implement ActivityForm core functionality"
- [ ] **Styling**: Theme-aware responsive design
  - [ ] Tailwind styling implementation
  - [ ] Dark/light theme compatibility
  - [ ] Mobile responsiveness
  - 🔄 **Commit Checkpoint**: "Add ActivityForm styling and themes"
- [ ] **Integration**: Connect with app state
  - [ ] Integration with activity state management
  - [ ] Real-time updates and feedback
  - 🔄 **Commit Checkpoint**: "Integrate ActivityForm with app state"

#### 3.2 ActivityManager Component  
- [ ] **Tests**: State machine and control logic tests
  - [ ] Activity lifecycle tests (PENDING → RUNNING → COMPLETED)
  - [ ] State transition validation tests
  - [ ] Real-time update tests
  - 🔄 **Commit Checkpoint**: "Add ActivityManager test suite"
- [ ] **Implementation**: Activity state machine logic
  - [ ] Core state machine implementation
  - [ ] Activity control methods (start, pause, complete)
  - [ ] Status monitoring and updates
  - 🔄 **Commit Checkpoint**: "Implement ActivityManager state machine"
- [ ] **Styling**: Control interface design
  - [ ] Activity control UI components
  - [ ] Status indicators and feedback
  - [ ] Theme integration
  - 🔄 **Commit Checkpoint**: "Add ActivityManager styling and controls"
- [ ] **Integration**: Connect with ActivityForm and Timeline
  - [ ] Form-to-manager data flow
  - [ ] Real-time timeline updates
  - [ ] Cross-component state synchronization
  - 🔄 **Commit Checkpoint**: "Integrate ActivityManager with other components"

#### 3.3 Timeline Components
- [ ] **Tests**: Timeline display and update tests
  - [ ] Timeline data rendering tests
  - [ ] Real-time update tests  
  - [ ] Visual feedback tests
  - 🔄 **Commit Checkpoint**: "Add Timeline component test suite"
- [ ] **Implementation**: Timeline visualization
  - [ ] TimelineDisplay component implementation
  - [ ] Timeline data management
  - [ ] Real-time update mechanisms
  - 🔄 **Commit Checkpoint**: "Implement Timeline core functionality"  
- [ ] **Styling**: Timeline visual design
  - [ ] Activity timeline visual layout
  - [ ] Color-coded activity indicators
  - [ ] Responsive timeline display
  - 🔄 **Commit Checkpoint**: "Add Timeline styling and visualization"
- [ ] **Integration**: Complete activity management integration
  - [ ] Full activity workflow integration
  - [ ] Cross-component state coordination
  - [ ] End-to-end functionality verification
  - 🔄 **Commit Checkpoint**: "Complete Timeline integration"

**Phase 3 Git Milestone**: `Phase 3 Complete - Activity Management Ready`

### Phase 4: Progress and Integration Components 🔄 **FUTURE**

#### 4.1 ProgressBar Component
- [ ] **Tests**: Real-time tracking and visual feedback tests
- [ ] **Implementation**: Progress calculation and display logic
- [ ] **Styling**: Visual progress indicators with theme support
- [ ] **Integration**: Connect with activity state for real-time updates
- 🔄 **Commit Checkpoint**: "Complete ProgressBar component"

#### 4.2 Summary Component  
- [ ] **Tests**: Analytics and data presentation tests
- [ ] **Implementation**: Activity summary and statistics logic
- [ ] **Styling**: Data visualization and responsive layout
- [ ] **Integration**: Connect with activity history and analytics
- 🔄 **Commit Checkpoint**: "Complete Summary component"

#### 4.3 TimeSetup Component
- [ ] **Tests**: Time configuration and validation tests
- [ ] **Implementation**: Duration setting and deadline management
- [ ] **Styling**: Time input interface with theme support
- [ ] **Integration**: Connect with activity creation workflow
- 🔄 **Commit Checkpoint**: "Complete TimeSetup component"

**Phase 4 Git Milestone**: `Phase 4 Complete - Progress Components Ready`

### Phase 5: Polish and Integration 🔄 **FINAL**

#### 5.1 Integration Testing
- [ ] **Full application integration testing**
- [ ] **Cross-component state coordination verification**
- [ ] **End-to-end user workflow testing**
- 🔄 **Commit Checkpoint**: "Complete integration testing"

#### 5.2 Performance and Accessibility
- [ ] **Performance optimization complete**
- [ ] **Accessibility verification (WCAG compliance)**
- [ ] **Cross-browser compatibility confirmed**
- 🔄 **Commit Checkpoint**: "Complete performance and accessibility"

#### 5.3 Final Features
- [ ] **Service worker and offline support integration**
- [ ] **Documentation complete**
- [ ] **Deployment preparation**
- 🔄 **Commit Checkpoint**: "Ready for deployment"

**Phase 5 Git Milestone**: `Application Complete - Ready for Deployment`

## Git Workflow Summary

### Repository Management
- **Branch Strategy**: Work on main branch with frequent commits  
- **Commit Frequency**: After each major development step
- **Commit Messages**: Descriptive and following established patterns
- **Tag Strategy**: Tag major phase completions for easy reference

### Commit Message Patterns
```bash
# Component Development
"Add tests for [Component] - [test focus]"
"Implement [Component] - [functionality]" 
"Style [Component] - [styling focus]"
"Integrate [Component] - [integration details]"

# Bug Fixes  
"Fix [Component] [issue] - [solution]"
"Debug [Component] [problem] - [resolution]"

# Documentation
"Document [Component] - [documentation type]"
"Update [Component] docs - [changes]"

# Phase Milestones
"Phase [N] Complete - [phase name]"
```

### Development Checkpoints
- **After Each Component**: Test, implement, style, integrate
- **After Each Phase**: Full verification and milestone commit
- **Before Major Changes**: Ensure clean working state
- **Regular Verification**: Run test suite before commits

This incremental approach ensures:
✅ **Change Tracking**: Every step is documented in git history  
✅ **Rollback Safety**: Can revert to any stable checkpoint  
✅ **Progress Visibility**: Clear milestones show development progress  
✅ **Debugging**: Easy to identify when issues were introduced  
✅ **Documentation**: Git history serves as development log
- Create base UI components
- Set up layout and responsive utilities
- Establish styling patterns and standards

### Phase 3: Simple Components (Days 3-4)
- Implement Calculator with tests
- Create Timer widget with functionality
- Build Loading states and error handling
- Verify responsive design across components

### Phase 4: Complex Components (Days 5-7)
- Implement Weather Widget with API
- Build Task Manager with full CRUD
- Create Dashboard layout
- Integration testing and optimization

### Phase 5: Final Polish (Days 8-9)
- Performance optimization
- Accessibility improvements
- Cross-browser testing
- Documentation completion
- Final integration verification

## Success Metrics
- **Functional Parity**: 100% feature equivalence with current app
- **Code Quality**: Modern patterns, TypeScript safety, test coverage
- **Performance**: Improved build times and runtime performance  
- **Maintainability**: Clear architecture and comprehensive documentation
- **User Experience**: Enhanced responsiveness and visual consistency

This approach ensures you get a completely fresh, modern React application while maintaining the functionality and user experience that already works well in your current application.
