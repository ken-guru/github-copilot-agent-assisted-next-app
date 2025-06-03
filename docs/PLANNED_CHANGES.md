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
- Custom theme system with light/dark mode switching
- Interactive components: TaskManager, WeatherWidget, Calculator, Timer
- Dashboard layout with component organization
- Responsive design and mobile compatibility
- TypeScript implementation
- Comprehensive test coverage patterns

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

   #### Phase 2: Utility Components  
   - **Calculator**: Rewrite with modern state management
     - Mathematical operations logic
     - Display formatting and validation
     - Keyboard input handling
     - Error state management
   - **Timer Widget**: Fresh implementation
     - Timer logic with hooks
     - Start/stop/reset functionality
     - Visual countdown display
     - Notification system
   - **Loading States**: Modern loading patterns and spinners

   #### Phase 3: Data Components
   - **Weather Widget**: Complete rewrite
     - API integration patterns
     - Data fetching with modern hooks
     - Error handling and loading states
     - Responsive weather display
   - **Task Manager**: Full CRUD implementation
     - Task state management
     - Local storage persistence
     - Task filtering and sorting
     - Drag and drop functionality
   
   #### Phase 4: Layout and Navigation
   - **Dashboard**: Modern layout implementation
     - Grid-based responsive layout
     - Component composition patterns
     - State coordination between widgets
   - **Navigation**: Simple routing setup
   - **Header/Footer**: Clean layout components

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
1. **Analyze current feature** - understand user experience and behavior
2. **Design component API** - props, state, interactions
3. **Write comprehensive tests** - define expected behavior
4. **Implement component** - satisfy tests with modern patterns
5. **Style with Tailwind** - responsive, theme-aware design
6. **Document component** - usage examples and API
7. **Integrate and test** - verify with other components

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
│   ├── ui/             # Base components (Button, Input, etc.)
│   ├── widgets/        # Feature components (Calculator, Weather, etc.)
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
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

### Phase 1: Foundation
- [ ] Vite + React + TypeScript project setup complete
- [ ] Tailwind CSS configured with custom theme
- [ ] Vitest + React Testing Library working
- [ ] ESLint + Prettier + TypeScript configured
- [ ] File structure and development workflow established
- [ ] Basic component templates and patterns defined

### Phase 2: Core Components
- [ ] Theme system implemented and tested
- [ ] Base UI components created (Button, Input, Card, etc.)
- [ ] Layout system implemented
- [ ] Error boundaries and error handling
- [ ] All foundation tests passing

### Phase 3: Feature Components
- [ ] Calculator component fully implemented and tested
- [ ] Timer widget complete with all functionality
- [ ] Weather widget with API integration
- [ ] All feature components responsive and theme-compatible

### Phase 4: Complex Features
- [ ] Task Manager with full CRUD operations
- [ ] Dashboard layout with component integration
- [ ] Navigation and routing (if applicable)
- [ ] All complex features tested and working

### Phase 5: Polish and Integration
- [ ] Full application integration testing
- [ ] Performance optimization complete
- [ ] Accessibility verification
- [ ] Cross-browser compatibility confirmed
- [ ] Documentation complete
- [ ] Ready for deployment

## Implementation Phases

### Phase 1: Project Setup (Day 1)
- Create new Vite + React + TypeScript project
- Configure Tailwind CSS with custom theme
- Set up testing framework and tooling
- Design file structure and development workflow
- Create basic component templates

### Phase 2: Design System (Day 2)
- Implement theme system and context
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
