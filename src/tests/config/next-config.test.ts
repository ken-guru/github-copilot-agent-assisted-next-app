import nextConfig from '../../../next.config';

describe('Next.js Config', () => {
  describe('webpack and turbo configurations', () => {
    test('should document webpack and turbo configuration status', () => {
      const hasWebpackConfig = !!nextConfig.webpack;
      const hasTurboConfig = !!nextConfig.turbopack;

      // This is now an informative test rather than an assertion
      console.info(`Configuration status: webpack=${hasWebpackConfig}, turbopack=${hasTurboConfig}`);
      
      // We still expect one of them to be configured
      expect(hasWebpackConfig || hasTurboConfig).toBe(true);
    });
  });

  describe('turbopack configuration', () => {
    test('should check turbopack configuration when available', () => {
      if (!nextConfig.turbopack) {
        console.info('Skipping turbopack tests - turbopack is not configured');
        return;
      }
      
      // Turbopack config should have resolveAlias for path mappings
      expect(nextConfig.turbopack).toHaveProperty('resolveAlias');
      
      // Verify resolveAlias contains our @ alias
      if (nextConfig.turbopack.resolveAlias) {
        expect(nextConfig.turbopack.resolveAlias).toHaveProperty('@');
        console.info('Turbopack resolveAlias configured correctly');
      }
      
      // Rules are optional in Turbopack, check if they exist
      if (nextConfig.turbopack.rules) {
        expect(typeof nextConfig.turbopack.rules).toBe('object');
        console.info(`Turbopack rules keys: ${Object.keys(nextConfig.turbopack.rules).join(', ') || 'no keys'}`);
      }
    });
  });
}); // End of Next.js Config describe block
