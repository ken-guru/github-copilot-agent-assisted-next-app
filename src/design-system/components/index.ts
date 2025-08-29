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

// Navigation components
export { default as Material3Navigation } from './Navigation';
export type { Material3NavigationProps } from './Navigation';

export { default as Material3NavigationRail } from './NavigationRail';
export type { Material3NavigationRailProps } from './NavigationRail';

export { default as Material3TabBar } from './TabBar';
export type { Material3TabBarProps } from './TabBar';

export { default as Material3NavigationDrawer } from './NavigationDrawer';
export type { Material3NavigationDrawerProps } from './NavigationDrawer';

// Component groupings for easier imports
export const Material3Components = {
  Button: require('./Button').default,
  Card: require('./Card').default,
  TextField: require('./TextField').default,
  Navigation: require('./Navigation').default,
  NavigationRail: require('./NavigationRail').default,
  TabBar: require('./TabBar').default,
  NavigationDrawer: require('./NavigationDrawer').default,
};

// Design system version
export const MATERIAL3_DESIGN_SYSTEM_VERSION = '1.0.0';

// Component categories
export const ComponentCategories = {
  INPUTS: ['Button', 'TextField'],
  SURFACES: ['Card'],
  NAVIGATION: ['Navigation', 'NavigationRail', 'TabBar', 'NavigationDrawer'],
  FEEDBACK: ['ProgressIndicator', 'Snackbar'],
  CONTAINMENT: ['Dialog', 'Sheet'],
} as const;