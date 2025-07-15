# GitHub Copilot Instructions

**Note:** This file harmonizes legacy protocols with the 4.1 Beast Mode V3 workflow. Beast Mode takes precedence for autonomous development sessions, while these standards apply to general development practices.

---

## Autonomous Development Mode (Beast Mode V3 Active)
- Continue iterating until problems are completely resolved
- Perform extensive internet research using fetch_webpage tool for all third-party dependencies
- Test frequently during implementation rather than strict TDD
- Communicate with casual, friendly yet professional tone
- Focus on problem resolution over documentation during active development


## Testing, Linting, and Type Checking Protocols
- Always run tests, linting, and type checking using the npm scripts defined in package.json:
	- `npm test` for Jest unit tests
	- `npm run lint` for linting
	- `npm run type-check` for TypeScript type checking
- Do not use the integrated tools in VS Code for these tasks; rely on the npm scripts for consistency with CI/CD and local workflows.

## Testing Protocols
- **Beast Mode**: Test frequently during implementation for immediate validation
- **Standard Mode**: Write tests before implementing functionality (TDD approach)
- Maintain thorough test coverage for all features and bug fixes
- Use Jest for unit tests

## Documentation Standards
- Document major architectural decisions when they impact long-term maintainability
- Use clear commit messages and PR descriptions
- Update README.md and PLANNED_CHANGES.md for significant feature changes
- **Beast Mode**: Documentation can be deferred during intensive problem-solving sessions

## Research and External Dependencies
- **Beast Mode**: Mandatory internet research for all third-party packages and frameworks
- Verify package documentation and best practices before implementation
- Recursively gather information from relevant links and documentation
- Update understanding based on latest available information

## Code Quality Standards
- Enforce linting and type safety on all commits
- Use import path aliases (@hooks, @lib, @components) for consistency
- Follow established naming conventions and file organization
- Separate production and test TypeScript configurations

## Memory Log Protocols (Legacy)
- Log significant architectural decisions in MEMORY_LOG.md when applicable
- Use memory log mapping files for major refactoring efforts
- **Note**: These protocols are primarily for reference; Beast Mode focuses on immediate problem resolution

---

**Primary Workflow**: See `.github/chatmodes/4.1 Beast Mode V3.chatmode.md` for active autonomous development protocols.
