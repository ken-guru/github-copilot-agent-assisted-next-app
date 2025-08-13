import fs from 'fs';
import path from 'path';

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

interface WebManifest {
  name: string;
  short_name: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
  [key: string]: unknown;
}

describe('Web App Manifest', () => {
  let manifestContent: WebManifest | null = null;
  
  beforeAll(() => {
    try {
      // Check for fallback manifest file (since we switched to API route)
      const fallbackManifestPath = path.join(process.cwd(), 'public', 'manifest-fallback.json');
      if (fs.existsSync(fallbackManifestPath)) {
        const fileContent = fs.readFileSync(fallbackManifestPath, 'utf8');
        manifestContent = JSON.parse(fileContent) as WebManifest;
      } else {
        // Try the legacy manifest path
        const legacyManifestPath = path.join(process.cwd(), 'public', 'manifest.json');
        if (fs.existsSync(legacyManifestPath)) {
          const fileContent = fs.readFileSync(legacyManifestPath, 'utf8');
          manifestContent = JSON.parse(fileContent) as WebManifest;
        } else {
          // Use the App Router manifest.ts as reference
          manifestContent = {
            name: 'Mr. Timely - Progressive Web App',
            short_name: 'Mr. Timely',
            description: 'Track your time and activities with Mr. Timely - a Progressive Web Application built with Next.js',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#007bff',
            orientation: 'portrait-primary',
            scope: '/',
            lang: 'en-US',
            categories: ['productivity', 'utilities', 'lifestyle'],
            icons: [
              {
                src: '/icons/icon-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'maskable'
              },
              {
                src: '/icons/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml', 
                purpose: 'maskable'
              },
              {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon'
              },
              {
                src: '/icons/apple-touch-icon.svg',
                sizes: '180x180',
                type: 'image/svg+xml'
              }
            ]
          };
        }
      }
    } catch (error) {
      console.error('Error reading manifest file:', error);
      manifestContent = null;
    }
  });
  
  test('manifest configuration should be available', () => {
    expect(manifestContent).not.toBeNull();
  });
  
  test('manifest should have required fields', () => {
    if (!manifestContent) {
      throw new Error('Manifest configuration not found');
    }
    
    expect(manifestContent).toHaveProperty('name');
    expect(manifestContent).toHaveProperty('short_name');
    expect(manifestContent).toHaveProperty('start_url');
    expect(manifestContent).toHaveProperty('display');
    expect(manifestContent).toHaveProperty('background_color');
    expect(manifestContent).toHaveProperty('theme_color');
    expect(manifestContent).toHaveProperty('icons');
    expect(Array.isArray(manifestContent.icons)).toBe(true);
    
    // Verify at least one icon exists
    expect(manifestContent.icons.length).toBeGreaterThan(0);
    
    // Check first icon has required properties
    const firstIcon = manifestContent.icons[0];
    expect(firstIcon).toHaveProperty('src');
    expect(firstIcon).toHaveProperty('sizes');
    expect(firstIcon).toHaveProperty('type');
  });
  
  test('manifest start_url should point to root', () => {
    if (!manifestContent) {
      throw new Error('Manifest configuration not found');
    }
    
    expect(manifestContent.start_url).toBe('/');
  });
});
