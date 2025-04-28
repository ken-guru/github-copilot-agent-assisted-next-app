import fs from 'fs';
import path from 'path';

describe('Web App Manifest', () => {
  let manifestContent: any;
  
  beforeAll(() => {
    try {
      // Try to read the manifest file
      const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
      const fileContent = fs.readFileSync(manifestPath, 'utf8');
      manifestContent = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading manifest file:', error);
      manifestContent = null;
    }
  });
  
  test('manifest.json file should exist', () => {
    expect(manifestContent).not.toBeNull();
  });
  
  test('manifest should have required fields', () => {
    if (!manifestContent) {
      fail('Manifest file not found');
      return;
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
      fail('Manifest file not found');
      return;
    }
    
    expect(manifestContent.start_url).toBe('/');
  });
});
