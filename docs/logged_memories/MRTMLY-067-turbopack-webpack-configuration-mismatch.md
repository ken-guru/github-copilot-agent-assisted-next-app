### Issue: Turbopack and Webpack Configuration Mismatch
**Date:** 2025-04-09
**Tags:** #debugging #next-js #bundler #turbopack #webpack #deprecation
**Status:** Resolved

#### Initial State
- Next.js application showing warning about webpack and turbopack configuration mismatch:
  ```
  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
  ⚠ See instructions if you need to configure Turbopack:
   https://nextjs.org/docs/app/api-reference/next-config-js/turbo
  ```
- The application was using webpack configuration but not properly configured for Turbopack

#### Debug Process
1. Configuration analysis
   - Checked the Next.js documentation for Turbopack configuration requirements
   - Found that when both webpack and Turbopack are used, they need to be configured consistently
   - Identified that our config only had webpack configured but was missing Turbopack config

2. Testing approach
   - Created tests to verify that the webpack and Turbopack configurations are consistent
   - Identified required Turbopack configuration properties for our project
   - Verified existing webpack configuration to ensure parity

3. Addressing deprecated API
   - After adding initial Turbopack config, received deprecation warning:
     ```
     ⚠ experimental.turbo.loaders is now deprecated. Please update next.config.js to use experimental.turbo.rules as soon as possible.
     ```
   - Updated test to check for proper rules format using glob patterns
   - Refactored configuration to use the new `rules` format instead of `loaders`

#### Resolution
- Initially updated `next.config.ts` to include Turbopack configuration with loaders:
  ```typescript
  experimental: {
    // ... existing configuration
    turbo: {
      loaders: {
        '.md': ['raw-loader'],
      },
      resolveAlias: {
        '@': './src',
      }
    },
  }
  ```

- Then refactored to use the recommended non-deprecated format:
  ```typescript
  experimental: {
    // ... existing configuration
    turbo: {
      rules: {
        '*.md': ['raw-loader'],
      },
      resolveAlias: {
        '@': './src',
      }
    },
  }
  ```

- Added comprehensive tests to verify:
  1. Consistent configuration between webpack and Turbopack
  2. Use of proper non-deprecated APIs
  3. Correct glob pattern format for rules

- Successfully eliminated all warnings and errors related to Turbopack configuration
- Verified that the application now starts without any configuration warnings
- Ensured backward compatibility with webpack for production builds
- Confirmed all tests are passing with the updated configuration

#### Lessons Learned
- When using Next.js with Turbopack, configurations for webpack and Turbopack need to be in sync
- Next.js APIs evolve rapidly; stay current with API changes by watching for deprecation warnings
- The transition from `loaders` with extensions to `rules` with glob patterns reflects a more flexible pattern matching approach
- Always test configuration changes to ensure they work across development and production environments
- When Next.js displays warnings about bundler configuration, they should be addressed to prevent unexpected behavior
- API deprecation warnings should be addressed promptly to ensure future compatibility
- Configuration warnings should not be ignored, as addressing them early prevents potential issues in future upgrades
- Next.js error messages typically provide clear guidance on how to resolve deprecated APIs
- Tests are crucial for validating configuration changes, especially with experimental features
- A complete test suite helps ensure that configuration changes don't introduce regressions
