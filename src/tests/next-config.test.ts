/**
 * Test for Next.js configuration
 */
import fs from 'fs';
import path from 'path';

describe('Next.js Configuration', () => {
  let nextConfig: string | undefined;
  
  beforeAll(() => {
    // Load the Next.js config
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(configPath)) {
      // We can't require directly as it may use dynamic features
      const configContent = fs.readFileSync(configPath, 'utf8');
      // Check for critical configurations
      nextConfig = configContent;
    }
  });
  
  test('should have proper Next.js config file', () => {
    expect(nextConfig).toBeDefined();
    
    // Check for important configurations
    expect(nextConfig).toContain('module.exports');
    expect(nextConfig).toContain('nextConfig');
  });
  
  test('should not have incorrect routing or rewrites', () => {
    if (nextConfig) {
      // Check if there are any problematic rewrites
      const hasProblematicRewrites = nextConfig.includes('rewrites') && 
        (nextConfig.includes('source: \'/\'') || nextConfig.includes('source: "/"'));
      
      expect(hasProblematicRewrites).toBe(false);
    }
  });
  
  test('package.json should have correct Next.js configuration', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    expect(fs.existsSync(packagePath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('next');
    
    // Check for appropriate scripts
    expect(packageJson.scripts).toHaveProperty('dev');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('start');
  });
});
