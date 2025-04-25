import { getThemeVariable, getThemeStyle, createThemeStyles } from '../themeSync';

describe('Theme Synchronization Utilities', () => {
  // Store the original window object and document properties
  let originalWindow;
  let originalDocument;
  
  beforeEach(() => {
    // Save original objects
    originalWindow = global.window;
    originalDocument = global.document;
    
    // Mock window and document
    global.window = {};
    global.document = {
      documentElement: {
        classList: {
          contains: jest.fn()
        }
      }
    };
  });
  
  afterEach(() => {
    // Restore original objects
    global.window = originalWindow;
    global.document = originalDocument;
  });
  
  test('getThemeVariable returns light theme variable during SSR', () => {
    // Simulate SSR environment (no window)
    global.window = undefined;
    
    const result = getThemeVariable('--light-var', '--dark-var', '#default');
    expect(result).toBe('var(--light-var, #default)');
  });
  
  test('getThemeVariable returns dark theme variable when dark mode is active', () => {
    // Mock dark mode
    document.documentElement.classList.contains.mockReturnValue(true);
    
    const result = getThemeVariable('--light-var', '--dark-var', '#default');
    expect(result).toBe('var(--dark-var, #default)');
  });
  
  test('getThemeVariable returns light theme variable when light mode is active', () => {
    // Mock light mode
    document.documentElement.classList.contains.mockReturnValue(false);
    
    const result = getThemeVariable('--light-var', '--dark-var', '#default');
    expect(result).toBe('var(--light-var, #default)');
  });
  
  test('getThemeStyle converts kebab-case property to camelCase', () => {
    // Mock light mode
    document.documentElement.classList.contains.mockReturnValue(false);
    
    const result = getThemeStyle('background-color', '--bg-light', '--bg-dark', '#fff');
    
    expect(result).toHaveProperty('backgroundColor');
    expect(result.backgroundColor).toBe('var(--bg-light, #fff)');
  });
  
  test('createThemeStyles generates a complete style object', () => {
    // Mock dark mode
    document.documentElement.classList.contains.mockReturnValue(true);
    
    const styles = createThemeStyles({
      backgroundColor: {
        light: '--bg-light',
        dark: '--bg-dark',
        fallback: '#000'
      },
      color: {
        light: '--text-light',
        dark: '--text-dark',
        fallback: '#fff'
      }
    });
    
    expect(styles).toHaveProperty('backgroundColor', 'var(--bg-dark, #000)');
    expect(styles).toHaveProperty('color', 'var(--text-dark, #fff)');
  });
});
