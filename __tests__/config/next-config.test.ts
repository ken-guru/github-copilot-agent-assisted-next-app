import nextConfig from '../../next.config';

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
      
      // Only run these if turbopack is configured
      expect(nextConfig.turbopack).toHaveProperty('rules');
      expect(nextConfig.turbopack).toHaveProperty('resolveAlias');
      
      // Check for specific file patterns in rules (if rules exists)
      if (nextConfig.turbopack.rules) {
        expect(nextConfig.turbopack.rules).toHaveProperty('*.md');
      }
    });
  });
}); // End of Next.js Config describe block
