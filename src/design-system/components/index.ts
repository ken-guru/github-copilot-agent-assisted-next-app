/**
 * Material 3 Core Components
 * Export all core Material 3 components with design token integration
 */

// Core interactive components
export { default as Material3Button } from './Button';
export type { Material3ButtonProps } from './Button';

export { default as Material3Card } from './Card';
export type { Material3CardProps } from './Card';

export { default as Material3TextField } from './TextField';
export type { Material3TextFieldProps } from './TextField';

// Additional core components (to be added)
// export { default as Material3Navigation } from './Navigation';
// export type { Material3NavigationProps } from './Navigation';

// Component groupings for easier imports
export const Material3Components = {
  Button: require('./Button').default,
  Card: require('./Card').default,
  TextField: require('./TextField').default,
  // Navigation: require('./Navigation').default,
};

// Design system version
export const MATERIAL3_DESIGN_SYSTEM_VERSION = '1.0.0';

// Component categories
export const ComponentCategories = {
  INPUTS: ['Button', 'TextField'],
  SURFACES: ['Card'],
  NAVIGATION: ['Navigation'],
  FEEDBACK: ['ProgressIndicator', 'Snackbar'],
  CONTAINMENT: ['Dialog', 'Sheet'],
} as const;