// Special Jest config for service worker tests
const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  testEnvironment: 'node',
  testMatch: [
    "**/test/service-worker/syntax-validation.test.js"
  ],
  // Very important: Don't use the global setup files
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
