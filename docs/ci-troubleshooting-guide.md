# CI/CD Troubleshooting Guide

This guide helps resolve common CI/CD issues in the Mr. Timely project.

## Common Issues and Solutions

### 1. Package Lock Synchronization Issues

**Error:** `npm ci` fails with "package.json and package-lock.json are out of sync"

**Symptoms:**
- Missing packages from lock file
- Version mismatches between package.json and package-lock.json
- CI build fails during dependency installation

**Solution:**

```bash
# Method 1: Regenerate package-lock.json
rm package-lock.json
rm -rf node_modules
npm install

# Method 2: Use the fix script
node scripts/fix-package-lock.js

# Method 3: Update lock file only
npm install --package-lock-only
```

**Prevention:**
- Always commit `package-lock.json` changes
- Use `npm ci` in CI/CD instead of `npm install`
- Run `npm install` locally after adding new dependencies

### 2. TypeScript Build Errors

**Error:** Type checking fails during build

**Common Causes:**
- Missing type definitions
- Outdated TypeScript version
- Configuration issues

**Solution:**

```bash
# Check TypeScript configuration
npm run type-check

# Update TypeScript and type definitions
npm update typescript @types/node @types/react @types/react-dom

# Fix specific type issues
npm install --save-dev @types/[missing-package]
```

### 3. Test Failures in CI

**Error:** Tests pass locally but fail in CI

**Common Causes:**
- Environment differences
- Missing test dependencies
- Timing issues in tests

**Solution:**

```bash
# Run tests with same environment as CI
NODE_ENV=test npm test

# Update test dependencies
npm install --save-dev @testing-library/jest-dom @testing-library/react

# Fix timing issues
npm install --save-dev @testing-library/user-event
```

### 4. Build Process Failures

**Error:** `npm run build` fails

**Common Causes:**
- Missing environment variables
- Asset optimization issues
- Memory limitations

**Solution:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Check for missing environment variables
cp .env.example .env.local

# Clean build cache
npm run clean-build
```

### 5. Dependency Conflicts

**Error:** Conflicting peer dependencies

**Solution:**

```bash
# Check for conflicts
npm ls

# Resolve using overrides in package.json
{
  "overrides": {
    "conflicting-package": "^desired-version"
  }
}

# Force resolution
npm install --force
```

## CI/CD Best Practices

### 1. Dependency Management

```json
{
  "scripts": {
    "preinstall": "npx check-node-version --node \">= 18\"",
    "postinstall": "npm audit --audit-level=moderate"
  }
}
```

### 2. Environment Configuration

```yaml
# .github/workflows/ci.yml
env:
  NODE_ENV: test
  CI: true
  NODE_OPTIONS: "--max-old-space-size=4096"
```

### 3. Caching Strategy

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 4. Matrix Testing

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

## Debugging Commands

### Local Debugging

```bash
# Simulate CI environment
NODE_ENV=test CI=true npm test

# Check package integrity
npm doctor

# Verify dependencies
npm audit
npm outdated

# Clean everything
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### CI Debugging

```bash
# Enable verbose logging
npm config set loglevel verbose

# Debug specific step
npm run build --verbose

# Check environment
env | grep NODE
node --version
npm --version
```

## Emergency Fixes

### 1. Quick Fix for Broken CI

```bash
# Revert to last working state
git revert HEAD
git push

# Or force update dependencies
npm update
npm audit fix
git add package*.json
git commit -m "fix: update dependencies"
git push
```

### 2. Bypass Failing Tests Temporarily

```yaml
# In GitHub Actions
- name: Run tests
  run: npm test
  continue-on-error: true
```

### 3. Skip CI for Documentation Changes

```bash
git commit -m "docs: update README [skip ci]"
```

## Monitoring and Alerts

### 1. Dependency Monitoring

```json
{
  "scripts": {
    "security-check": "npm audit --audit-level=high",
    "dependency-check": "npm outdated --depth=0"
  }
}
```

### 2. Build Performance Monitoring

```yaml
- name: Build performance
  run: |
    time npm run build
    du -sh dist/
```

### 3. Test Coverage Monitoring

```yaml
- name: Test coverage
  run: npm test -- --coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Preventive Measures

### 1. Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run type-check && npm run lint",
      "pre-push": "npm test"
    }
  }
}
```

### 2. Automated Dependency Updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 3. Regular Maintenance

```bash
# Weekly maintenance script
#!/bin/bash
npm audit fix
npm update
npm test
npm run build
```

## Getting Help

### 1. Check CI Logs

1. Go to GitHub Actions tab
2. Click on failed workflow
3. Expand failed step
4. Look for error messages

### 2. Local Reproduction

```bash
# Reproduce CI environment locally
docker run -it node:18 bash
git clone [your-repo]
cd [your-repo]
npm ci
npm test
npm run build
```

### 3. Community Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm CLI Documentation](https://docs.npmjs.com/cli)
- [Node.js Troubleshooting Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)

## Contact

For persistent CI issues:
1. Create an issue with CI logs
2. Include environment details
3. Provide steps to reproduce
4. Tag with `ci/cd` label