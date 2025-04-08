import fs from 'fs';
import path from 'path';

describe('Next.js routing structure', () => {
  it('should properly handle routing between Pages Router and App Router', () => {
    const appRouterPagePath = path.join(process.cwd(), 'src/app/page.tsx');
    const pagesRouterIndexPath = path.join(process.cwd(), 'pages/index.tsx');
    
    const appRouterExists = fs.existsSync(appRouterPagePath);
    const pagesRouterExists = fs.existsSync(pagesRouterIndexPath);
    
    if (appRouterExists && pagesRouterExists) {
      // Both routing systems are in use - verify the Pages Router is importing from the App Router
      // to ensure they work together rather than conflict
      const pagesContent = fs.readFileSync(pagesRouterIndexPath, 'utf8');
      expect(
        pagesContent.includes("../src/app/page") || 
        pagesContent.includes("HomeContent") || 
        pagesContent.includes("BridgeContent")
      ).toBe(true, 'Pages Router should import or reference App Router components');
    }
    
    // At least one should exist to handle the root route
    expect(appRouterExists || pagesRouterExists).toBe(true, 'No root route handler found');
  });

  it('should use proper naming conventions for routing files', () => {
    const appDirExists = fs.existsSync(path.join(process.cwd(), 'src/app'));
    const pagesDirExists = fs.existsSync(path.join(process.cwd(), 'pages'));
    
    // Check if using the App Router
    if (appDirExists) {
      // Check if page.tsx exists for root route
      const rootPage = fs.existsSync(path.join(process.cwd(), 'src/app/page.tsx'));
      expect(rootPage).toBe(true, 'App Router requires page.tsx file for root route');
    }
    
    // Check if using the Pages Router
    if (pagesDirExists) {
      // Check if index.tsx exists for root route
      const indexPage = fs.existsSync(path.join(process.cwd(), 'pages/index.tsx'));
      expect(indexPage).toBe(true, 'Pages Router requires index.tsx file for root route');
    }
    
    // At least one routing system should be in use
    expect(appDirExists || pagesDirExists).toBe(true, 'No routing system detected');
  });
});
