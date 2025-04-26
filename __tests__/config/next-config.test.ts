import nextConfig from '../../next.config';

describe('Next.js Config', () => {
  describe('webpack and turbo configurations', () => {
    it('should have consistent webpack and turbo configurations', () => {
      // Check if webpack is configured
      const hasWebpackConfig = typeof nextConfig.webpack === 'function';
      
      // Check if turbo is configured
      const hasTurboConfig = nextConfig.experimental && 
                            typeof nextConfig.experimental.turbo === 'object';
      
      // If webpack is configured, turbo should also be configured
      if (hasWebpackConfig) {
        expect(hasTurboConfig).toBe(true);
      }
      
      // If using turbopack, ensure it has the necessary configurations
      if (hasTurboConfig) {
        // Check for rules (replacing deprecated loaders)
        expect(nextConfig.experimental?.turbo).toHaveProperty('rules');
        expect(nextConfig.experimental?.turbo).toHaveProperty('resolveAlias');
      }
    });

    it('should use proper Turbopack configuration format', () => {
      const turboConfig = nextConfig.experimental?.turbo;
      
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
    });
  });

  // Fix the TypeScript errors by adding proper type checking for the turbopack property
  describe('turbopack configuration', () => {
    test('should have proper turbopack configuration', () => {
      // Add optional chaining to fix TS18048 errors
      expect(nextConfig.turbopack?.rules).toBeDefined();
      expect(nextConfig.turbopack?.resolveAlias).toBeDefined();
      expect((nextConfig.turbopack as any).loaders).toBeDefined();
      expect((nextConfig.turbopack as any).loaders['*.svg']).toBeDefined();
    });
  }); // End of turbopack configuration describe block
}); // End of Next.js Config describe block
