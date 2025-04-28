/**
 * Test for Next.js app route configuration
 */
import fs from 'fs';
import path from 'path';

describe('Next.js App Router Configuration', () => {
  test('should have proper page.tsx file in app directory', () => {
    const pagePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
    expect(fs.existsSync(pagePath)).toBe(true);
    
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    expect(pageContent).toContain('export default function Home');
  });

  test('should have proper layout.tsx file in app directory', () => {
    const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
    expect(fs.existsSync(layoutPath)).toBe(true);
    
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent).toContain('export default function RootLayout');
  });
  
  test('should have proper directory structure for Next.js App Router', () => {
    const appDir = path.join(process.cwd(), 'src', 'app');
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.statSync(appDir).isDirectory()).toBe(true);
    
    // Check for critical files
    expect(fs.existsSync(path.join(appDir, 'page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'layout.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'globals.css'))).toBe(true);
  });
});
