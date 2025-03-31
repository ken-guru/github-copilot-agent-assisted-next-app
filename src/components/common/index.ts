/**
 * Common UI Component Library
 * 
 * This library provides reusable UI components with consistent styling
 * that can be used throughout the application.
 */

// Component exports
export { default as Button } from './Button';
export { default as IconButton } from './IconButton';
export { default as StatusIndicator } from './StatusIndicator';
export { default as Card } from './Card';

// Type exports
export type { StatusType, SizeType } from './StatusIndicator';

// Constants
export const ICON_PATHS = {
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  play: 'M8 5v14l11-7z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  minus: 'M19 13H5v-2h14v2z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
};