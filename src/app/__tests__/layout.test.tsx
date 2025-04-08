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
    
    // Viewport export should contain these properties
    expect(viewport).toHaveProperty('viewport', 'width=device-width, initial-scale=1');
    expect(viewport).toHaveProperty('themeColor', '#000000');
  });
});
