/**
 * Test to verify Jest configuration is valid
 */
import fs from 'fs';
import path from 'path';

describe('Jest Configuration', () => {
  let jestConfigContent: string;

  beforeAll(() => {
    const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
    jestConfigContent = fs.readFileSync(jestConfigPath, 'utf8');
  });

  test('should not contain unused watch plugins', () => {
    // Check that the problematic plugins are not in the config
    expect(jestConfigContent).not.toContain('jest-watch-typeahead/filename');
    expect(jestConfigContent).not.toContain('jest-watch-typeahead/testname');
  });

  test('should export a valid Jest configuration function', () => {
    // Just testing that the file exports something (can't easily test the actual function)
    expect(jestConfigContent).toContain('module.exports');
  });
});
