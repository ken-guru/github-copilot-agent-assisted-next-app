/**
 * Visual Regression Testing Configuration
 * Configures automated visual testing for Material 3 Expressive components
 */

export interface VisualTestConfig {
  component: string;
  variants: string[];
  viewports: ViewportConfig[];
  themes: ThemeConfig[];
  states: ComponentState[];
  animations?: boolean;
  accessibility?: boolean;
}

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor?: number;
}

export interface ThemeConfig {
  name: 'light' | 'dark';
  colorScheme: string;
}

export interface ComponentState {
  name: string;
  props?: Record<string, any>;
  interactions?: InteractionStep[];
}

export interface InteractionStep {
  type: 'hover' | 'focus' | 'click' | 'scroll';
  selector?: string;
  delay?: number;
}

// Standard viewport configurations for responsive testing
export const STANDARD_VIEWPORTS: ViewportConfig[] = [
  { name: 'mobile', width: 375, height: 667, deviceScaleFactor: 2 },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'large-desktop', width: 1920, height: 1080, deviceScaleFactor: 1 }
];

// Theme configurations for color adaptation testing
export const STANDARD_THEMES: ThemeConfig[] = [
  { name: 'light', colorScheme: 'light' },
  { name: 'dark', colorScheme: 'dark' }
];

// Common component states for interaction testing
export const COMMON_STATES: ComponentState[] = [
  { name: 'default', props: {} },
  { name: 'hover', interactions: [{ type: 'hover', delay: 100 }] },
  { name: 'focus', interactions: [{ type: 'focus', delay: 100 }] },
  { name: 'active', interactions: [{ type: 'click', delay: 50 }] },
  { name: 'disabled', props: { disabled: true } }
];

// Material 3 Expressive component test configurations
export const VISUAL_TEST_CONFIGS: VisualTestConfig[] = [
  {
    component: 'Material3Button',
    variants: ['filled', 'outlined', 'text', 'elevated', 'tonal'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: COMMON_STATES,
    animations: true,
    accessibility: true
  },
  {
    component: 'Material3TextField',
    variants: ['outlined', 'filled'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: [
      ...COMMON_STATES,
      { name: 'filled', props: { value: 'Sample text' } },
      { name: 'error', props: { error: true, helperText: 'Error message' } },
      { name: 'floating-label', interactions: [{ type: 'focus' }] }
    ],
    animations: true,
    accessibility: true
  },
  {
    component: 'Material3Container',
    variants: ['elevated', 'filled', 'outlined'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: [
      { name: 'default', props: {} },
      { name: 'with-content', props: { children: 'Sample content' } },
      { name: 'elevated', props: { elevation: 'level3' } }
    ],
    accessibility: true
  },
  {
    component: 'Navigation',
    variants: ['default'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: [
      { name: 'default', props: {} },
      { name: 'active-item', props: { activeItem: 'timer' } },
      { name: 'mobile-menu', interactions: [{ type: 'click', selector: '.menu-toggle' }] }
    ],
    animations: true,
    accessibility: true
  },
  {
    component: 'ActivityButtonMaterial3',
    variants: ['default'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: [
      { name: 'idle', props: { activity: { name: 'Work', status: 'idle' } } },
      { name: 'running', props: { activity: { name: 'Work', status: 'running' } } },
      { name: 'completed', props: { activity: { name: 'Work', status: 'completed' } } },
      ...COMMON_STATES
    ],
    animations: true,
    accessibility: true
  },
  {
    component: 'SummaryMaterial3',
    variants: ['default'],
    viewports: STANDARD_VIEWPORTS,
    themes: STANDARD_THEMES,
    states: [
      { name: 'with-data', props: { activities: [], totalTime: 3600 } },
      { name: 'empty', props: { activities: [], totalTime: 0 } }
    ],
    accessibility: true
  }
];