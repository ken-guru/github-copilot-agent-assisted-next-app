import fs from 'fs';
import path from 'path';

describe('Next.js routing structure', () => {
  it('should not have conflicting routes between Pages Router and App Router', () => {
    // Check if app/page.tsx exists
    const appRouterHomePage = path.join(process.cwd(), 'src/app/page.tsx');
    const appRouterExists = fs.existsSync(appRouterHomePage);
    
    // Check if pages/index.tsx exists
    const pagesRouterHomePage = path.join(process.cwd(), 'pages/index.tsx');
    const pagesRouterExists = fs.existsSync(pagesRouterHomePage);
    
    // We shouldn't have both for the same route
    if (appRouterExists && pagesRouterExists) {
      // If both exist, we need to either:
      // 1. Remove one of them
      // 2. Make sure they don't conflict (change path or use middleware)
      fail('Conflicting routes detected: both app/page.tsx and pages/index.tsx exist');
    }
    
    // At least one should exist to handle the root route
    expect(appRouterExists || pagesRouterExists).toBe(true);
  });
  
  it('should have consistent routing structure', () => {
    // Determine which router system we're using primarily
    const appDir = path.join(process.cwd(), 'src/app');
    const pagesDir = path.join(process.cwd(), 'pages');
    
    const appDirExists = fs.existsSync(appDir);
    const pagesDirExists = fs.existsSync(pagesDir);
    
    if (appDirExists) {
      // If using App Router, check for essential files
      const appLayoutExists = fs.existsSync(path.join(appDir, 'layout.tsx'));
      expect(appLayoutExists).toBe(true);
    }
    
    if (pagesDirExists && !appDirExists) {
      // If only using Pages Router, check for _app.tsx
      const appFileExists = fs.existsSync(path.join(pagesDir, '_app.tsx'));
      expect(appFileExists).toBe(true);
    }
  });
});
