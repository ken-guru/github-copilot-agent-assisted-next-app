// Special Jest config for service worker tests
const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  testEnvironment: 'node',
  testMatch: [
    '**/test/service-worker/syntax-validation.test.js'
  ],
  // Skip the normal setup file
  setupFilesAfterEnv: [],
  // Isolate modules
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { isolatedModules: true }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
