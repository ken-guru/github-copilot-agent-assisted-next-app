# Component Documentation

This directory contains comprehensive documentation for all key components in the application. Each component documentation includes props, state management approach, theme compatibility, mobile responsiveness, accessibility considerations, and examples.

## Visualization Components

These components handle the visual display of activities and time information:

- [**Timeline**](./Timeline.md): Visualizes activities and breaks on a vertical timeline
- [**ProgressBar**](./ProgressBar.md): Displays progress through visual color transitions

## State Management Components

These components handle the core application state and data presentation:

- [**ActivityManager**](./ActivityManager.md): Central hub for activity management
- [**Summary**](./Summary.md): Provides overview of completed activity session

## User Input Components

These components handle user interactions and input:

- [**TimeSetup**](./TimeSetup.md): Configures time settings for the application
- [**ActivityButton**](./ActivityButton.md): Controls activity states in the application

## Auxiliary Components

These components provide supporting functionality:

- [**ServiceWorkerUpdater**](./ServiceWorkerUpdater.md): Manages service worker lifecycle and update notifications
- [**ActivityForm**](./ActivityForm.md): Interface for creating and editing activities

## Utility Components

These components handle specific utility functions:

- [**TimeDisplay**](./TimeDisplay.md): Standardized time and date presentation
- [**OfflineIndicator**](./OfflineIndicator.md): Visual feedback for offline status
- [**ThemeToggle**](./ThemeToggle.md): Switches between light and dark themes
- [**ErrorBoundary**](./ErrorBoundary.md): Catches and handles JavaScript errors

## Component Relationships

Key component relationships:
- **Timeline** and **ProgressBar** visualize data from the same timeline entries
- **ActivityManager** controls activities that are tracked in **Timeline**
- **TimeSetup** configures time values used by **ProgressBar** and **Timeline**
- **TimeDisplay** is used by multiple components to show formatted time
- **ThemeToggle** affects the appearance of all components
- **ErrorBoundary** can wrap any component to provide error handling

## Related Documentation

- [Main README](../../README.md)
- [Development Process Guidelines](../PLANNED_CHANGES.md#development-process-guidelines)
- [Memory Log](../MEMORY_LOG.md) - Project history and issue resolutions
