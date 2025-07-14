import fs from 'fs';
import path from 'path';

describe('Next.js routing structure', () => {
  it('should use a single routing system to avoid conflicts', () => {
    const appRouterPagePath = path.join(process.cwd(), 'app/page.tsx');
    const pagesRouterIndexPath = path.join(process.cwd(), 'pages/index.tsx');
    
    const appRouterExists = fs.existsSync(appRouterPagePath);
    const pagesRouterExists = fs.existsSync(pagesRouterIndexPath);
    
    // Only one of the files should exist to handle the root route
    // to avoid the "Conflicting app and page file" error
    if (appRouterExists) {
      expect(pagesRouterExists).toBe(false);
    } else {
      expect(pagesRouterExists).toBe(true);
    }
    
    // At least one should exist to handle the root route
    expect(appRouterExists || pagesRouterExists).toBe(true);
  });

  it('should use proper naming conventions for routing files', () => {
    const appDirExists = fs.existsSync(path.join(process.cwd(), 'app'));
    const pagesDirExists = fs.existsSync(path.join(process.cwd(), 'pages'));
    
    // Check if using the App Router
    if (appDirExists) {
      // Check if page.tsx exists for root route
      const rootPage = fs.existsSync(path.join(process.cwd(), 'app/page.tsx'));
      expect(rootPage).toBe(true);
    }
    
    // Check if using the Pages Router
    if (pagesDirExists) {
      // Check if index.tsx exists for root route (only if app router doesn't exist)
      if (!fs.existsSync(path.join(process.cwd(), 'app/page.tsx'))) {
        const indexPage = fs.existsSync(path.join(process.cwd(), 'pages/index.tsx'));
        expect(indexPage).toBe(true);
      }
    }
    
    // At least one routing system should be in use
    expect(appDirExists || pagesDirExists).toBe(true);
  });
});
