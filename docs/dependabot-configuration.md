# Dependabot Configuration Documentation

This document explains the Dependabot configuration for this project and outlines best practices for managing dependencies.

## Configuration Overview

The Dependabot configuration is maintained in `.github/dependabot.yml` and is set up to:
- Automatically update npm dependencies weekly (Mondays)
- Automatically update GitHub Actions dependencies weekly (Wednesdays)
- Group related dependencies to minimize pull request volume
- Handle security updates as high-priority items

## Dependency Groups

We've organized dependencies into logical groups to reduce the number of pull requests and to ensure related packages are updated together:

| Group | Description | Update Types |
|-------|-------------|-------------|
| dev-dependencies | General development dependencies | minor, patch |
| typescript-ecosystem | TypeScript and related tools | minor, patch |
| linting-tools | ESLint, Prettier and related plugins | minor, patch |
| testing-tools | Jest, Testing Library and other test tools | minor, patch |
| bundlers-and-build | Webpack, Babel and build tools | minor, patch |
| react-ecosystem | React and related libraries | minor, patch |
| next-ecosystem | Next.js and related libraries | minor, patch |
| types | TypeScript type definitions | minor, patch |
| security-updates | All dependencies with security implications | major, minor, patch |

## Auto-merge Policy

Dependabot is configured to automatically merge dependency updates with the following conditions:
- The update is not for critical dependencies like React, Next.js
- The update is not a major version change
- All CI checks pass

## Review Process

Dependencies that don't qualify for auto-merge require manual review:
1. Review the change log of the updated package
2. Check for breaking changes
3. Verify that tests pass
4. Approve and merge the pull request

## Security Updates

Security updates are prioritized and include:
- All severity levels (critical, high, medium, low)
- All update types (major, minor, patch)
- Special labeling (`security:review`) for easier identification
- Automatic opening of pull requests when vulnerabilities are detected

For critical security vulnerabilities, consider manually updating the dependency immediately rather than waiting for the scheduled Dependabot run:

```bash
# Update a vulnerable package to latest secure version
npm update vulnerable-package

# Or explicitly install a specific secure version
npm install vulnerable-package@x.y.z
```

## Manual Override

If you need to manually update a dependency:

```bash
# Update a single package
npm update package-name

# Update all packages according to package.json constraints
npm update

# Force update to latest version (may change package.json)
npm install package-name@latest
```

## Maintenance

The Dependabot configuration should be reviewed quarterly to ensure:
- Grouped dependencies remain logically organized
- Ignored dependencies are still appropriate to ignore
- Auto-merge policies are still appropriate
- New dependency categories are considered for grouping
