# Activity Timer and Tracker

## Project Context
You are working on a time management and activity tracking application built with Next.js. This documentation serves as both a guide for developers and a prompt for AI assistance in development.

## Project Scope and Limitations
```markdown
This is a hobby project with the following characteristics:
- Created for learning and experimentation purposes
- Not intended for production use
- May contain experimental features
- Built with AI assistance (primarily GitHub Copilot)
```

## Development Philosophy
The application is developed using AI-assisted techniques with these principles:
- Test-Driven Development (TDD)
- Component-based architecture
- Responsive design
- Theme-aware styling
- Accessibility considerations

### Change Management Approach
```markdown
The project uses a dual-file system for tracking changes:
1. PLANNED_CHANGES.md: 
   - Contains upcoming feature specifications
   - Written in a prompt-friendly format
   - Used as input for AI-assisted implementation
2. IMPLEMENTED_CHANGES.md:
   - Chronicles completed implementations
   - Includes timestamps and implementation details
   - Serves as reference for similar future changes
```

## Core Features
When implementing or modifying features, ensure adherence to these core functionalities:
```markdown
- Time Management
  - Duration setting for work sessions
  - Deadline tracking capabilities
  
- Activity Management
  - Creation and tracking of multiple activities
  - Real-time status monitoring
  
- Visual Feedback
  - Progress bar for ongoing activities
  - Timeline visualization
  - Color-coded activity identification
  
- Theme System
  - Light/Dark/System theme modes
  - HSL-based color system
  - Persistent theme preferences
```

## Implementation Guidelines

### Project Structure
```
src/
  ├── app/            # Next.js app directory (routes, layout)
  ├── components/     # React components
  │   └── __tests__/  # Component tests
  ├── hooks/          # Custom React hooks
  │   └── __tests__/  # Hook tests
  └── utils/          # Utility functions
      └── __tests__/  # Utility tests
```

### Design System Specifications

#### Color System Requirements
```markdown
- Use HSL color format exclusively
- Maintain consistent hue values across themes
- Adjust saturation/lightness for theme variants
- Implement via CSS variables
- Ensure WCAG compliance for contrast ratios
```

#### Theme Implementation Requirements
```markdown
- Support three modes: Light/Dark/System
- Use CSS variables for theme values
- Implement smooth transitions
- Persist user preferences
- Handle system preference changes
```

## Development Setup

### Environment Requirements
```bash
Node.js (Latest LTS)
npm or yarn
```

### Installation Commands
```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Run tests
npm test
# or
yarn test

# Watch mode for tests
npm run test:watch
# or
yarn test:watch
```

### Testing Requirements
When implementing new features or modifying existing ones:
```markdown
1. Write tests first (TDD approach)
2. Ensure full coverage of new functionality
3. Update existing tests when changing behavior
4. Validate both light and dark theme scenarios
5. Test system theme preference handling
```

## Technology Stack
When implementing features, utilize these core technologies:
```markdown
- Next.js: Application framework
- React: UI component library
- TypeScript: Type safety
- Jest: Testing framework
- React Testing Library: Component testing
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

---
Note: When using this document as a prompt for AI assistance, ensure to provide specific context about which section or feature you're working on to receive more targeted and relevant responses.
