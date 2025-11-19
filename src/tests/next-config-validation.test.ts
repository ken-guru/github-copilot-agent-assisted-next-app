import fs from 'fs';
import path from 'path';

describe('Next.js Configuration Validation', () => {
  let nextConfigContent: string | undefined;

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
    
    // Check for outdated Next.js options (experimental.turbo moved to turbopack in Next.js 16)
    expect(nextConfigContent).not.toContain('experimental: { turbo:');
  });

  test('should have valid Next.js configuration', () => {
    expect(nextConfigContent).toContain('const nextConfig = {');
    expect(nextConfigContent).toContain('module.exports = nextConfig');
    
    // Next.js 16+ has Turbopack as default bundler
    expect(nextConfigContent).toContain('turbopack:');
  });
});
