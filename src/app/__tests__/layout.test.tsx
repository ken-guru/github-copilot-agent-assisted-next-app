import { metadata, viewport } from '../layout';

describe('Layout Configuration', () => {
  it('properly separates metadata and viewport configurations', () => {
    // Metadata should contain basic page info but not viewport or theme color
    expect(metadata).toHaveProperty('title', 'Mr. Timely');
    expect(metadata).toHaveProperty('description', 'Track your time and activities with Mr. Timely');
    expect(metadata).toHaveProperty('icons');
    expect(metadata).toHaveProperty('manifest', '/manifest.json');
    
    // Metadata should NOT contain viewport or themeColor
    expect(metadata).not.toHaveProperty('viewport');
    expect(metadata).not.toHaveProperty('themeColor');
  });
  
  it('correctly structures the viewport configuration according to Next.js 15 specs', () => {
    // Verify viewport has correct properties per Next.js 15 Viewport type
    expect(viewport).toHaveProperty('width', 'device-width');
    expect(viewport).toHaveProperty('initialScale', 1);
    expect(viewport).toHaveProperty('themeColor', '#000000');
    
    // Ensure viewport doesn't have the incorrect 'viewport' property
    expect(viewport).not.toHaveProperty('viewport');
  });
});
