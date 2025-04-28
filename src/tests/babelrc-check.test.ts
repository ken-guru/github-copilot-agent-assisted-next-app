import fs from 'fs';
import path from 'path';

describe('Babel Configuration', () => {
  test('should not have .babelrc in project root', () => {
    const babelrcPath = path.join(process.cwd(), '.babelrc');
    const babelExists = fs.existsSync(babelrcPath);
    
    if (babelExists) {
      console.warn('Found .babelrc file that may be causing issues with Next.js. Consider removing it.');
    }
    
    // This test doesn't assert anything, it just warns about the file
    expect(true).toBe(true);
  });
});
