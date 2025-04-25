import nextConfig from '../../next.config';

describe('Next.js Configuration', () => {
  it('should have consistent webpack and turbopack configurations', () => {
    // Check if webpack is configured
    const hasWebpackConfig = typeof nextConfig.webpack === 'function';
    
    // Check if turbopack is configured (now uses stable API)
    const hasTurboConfig = typeof nextConfig.turbopack === 'object';
    
    // If webpack is configured, turbopack should also be configured
    if (hasWebpackConfig) {
      expect(hasTurboConfig).toBe(true);
    }
    
    // If using turbopack, ensure it has the necessary configurations
    if (hasTurboConfig) {
      // Check for rules (replacing deprecated loaders)
      expect(nextConfig.turbopack).toHaveProperty('rules');
      expect(nextConfig.turbopack).toHaveProperty('resolveAlias');
    }
  });

  it('should use proper Turbopack configuration format', () => {
    const turboConfig = nextConfig.turbopack;
    
    if (turboConfig) {
      // Ensure we're using rules (new format) and not loaders (deprecated)
      expect(turboConfig).not.toHaveProperty('loaders');
      
      // Check that rules use glob patterns (*.ext) instead of extensions (.ext)
      if (turboConfig.rules) {
        const ruleKeys = Object.keys(turboConfig.rules);
        for (const key of ruleKeys) {
          expect(key.startsWith('*.')).toBe(true);
        }
      }
    }
  });

  it('should have valid experimental configurations', () => {
    expect(nextConfig.experimental).toBeDefined();
    
    if (nextConfig.experimental?.serverActions) {
      expect(Array.isArray(nextConfig.experimental.serverActions.allowedOrigins)).toBe(true);
    }
    
    // Ensure the deprecated turbo property is not present in experimental
    expect(nextConfig.experimental).not.toHaveProperty('turbo');
  });
});
