const fs = require('fs');
const path = require('path');

describe('Next.js Configuration Validation', () => {
  let nextConfigContent;

  beforeAll(() => {
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(configPath)) {
      nextConfigContent = fs.readFileSync(configPath, 'utf8');
    }
  });

  test('should not contain invalid configurations', () => {
    expect(nextConfigContent).toBeDefined();
    
    // Check for problematic experimental configurations
    expect(nextConfigContent).not.toContain('appDir: true');
    
    // We're using Next.js, not create-react-app
    expect(nextConfigContent).not.toContain('create-react-app');
    
    // Check for outdated or removed Next.js options
    expect(nextConfigContent).not.toContain('experimental: { turbo:');
    expect(nextConfigContent).not.toContain('turbopack:');
  });

  test('should have valid Next.js configuration', () => {
    expect(nextConfigContent).toContain('const nextConfig = {');
    expect(nextConfigContent).toContain('module.exports = nextConfig');
    
    // For Next.js applications, reactStrictMode is a common setting
    expect(nextConfigContent).toContain('reactStrictMode:');
  });
});
