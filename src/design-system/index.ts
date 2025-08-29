/**
 * Material 3 Component Library
 * Main export file for all Material 3 components
 */

// Core Components
export { default as Material3Button } from './components/Button';
export { default as Material3Card } from './components/Card';
export { default as Material3Input } from './components/Input';
export { default as Material3Modal } from './components/Modal';

// Navigation Components
export { default as Material3AppBar } from './components/AppBar';
export { default as Material3Navigation } from './components/Navigation';
export { default as Material3NavigationLayout } from './components/NavigationLayout';
export { default as Material3ThemeToggle } from './components/ThemeToggle';

// Demo Component
export { default as ComponentLibraryDemo } from './components/ComponentLibraryDemo';

// Re-export types for convenience
export type { Material3ButtonProps } from './components/Button';
export type { Material3CardProps } from './components/Card';
export type { Material3InputProps } from './components/Input';
export type { Material3ModalProps } from './components/Modal';
export type { Material3AppBarProps } from './components/AppBar';
export type { Material3NavigationProps, Material3NavigationItem } from './components/Navigation';
export type { Material3NavigationLayoutProps } from './components/NavigationLayout';
export type { Material3ThemeToggleProps } from './components/ThemeToggle';

// Design System Foundation Exports
export * from './types';