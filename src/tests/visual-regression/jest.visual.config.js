/**
 * Jest Configuration for Visual Regression Tests
 * Specialized configuration for visual testing with Playwright
 */

module.exports = {
  displayName: 'Visual Regression Tests',
  testMatch: [
    '<rootDir>/src/tests/visual-regression/**/*.test.ts'
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/visual-regression/jest.visual.setup.js'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        compilerOptions: {
          module: 'commonjs',
          target: 'es2020',
          lib: ['es2020', 'dom'],
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          skipLibCheck: true,
          strict: true
        }
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.test.{ts,tsx}',
    '!**/__tests__/**'
  ],
  coverageDirectory: '<rootDir>/coverage/visual',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000, // 30 seconds for visual tests
  maxWorkers: 2, // Limit workers for browser tests
  verbose: true,
  bail: false, // Continue running tests even if some fail
  errorOnDeprecated: true,
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1'
  }
};