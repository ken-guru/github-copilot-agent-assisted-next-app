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

```mermaid
graph TD
    %% Core App Structure
    App[App] --> TT[ThemeToggle]
    App --> EB[ErrorBoundary]
    App --> SWU[ServiceWorkerUpdater]
    App --> OI[OfflineIndicator]
    
    %% Activity Flow
    App --> AM[ActivityManager]
    AM --> AB[ActivityButton]
    AM --> AF[ActivityForm]
    
    %% Time Setup Flow
    App --> TS[TimeSetup]
    
    %% Visualization Components
    App --> TL[Timeline]
    App --> PB[ProgressBar]
    App --> SUM[Summary]
    
    %% Component Dependencies
    TL -.-> TD[TimeDisplay]
    PB -.-> TD
    AB -.-> TD
    SUM -.-> TD
    
    %% Data Flow
    TL --> |displays| entries[Timeline Entries]
    PB --> |shows progress of| entries
    AM --> |manages| activities[Activities]
    SUM --> |summarizes| entries
    AB --> |controls| activities
    TS --> |configures| duration[Time Duration]
    entries --> |derived from| activities
    duration --> |affects| entries
    
    %% Visual Appearance
    TT -.-> |affects appearance of| App
    
    %% Error Handling
    EB -.-> |catches errors in| App
    SWU --> |works with| OI
    
    %% Component Categories
    classDef visualization fill:#c4e3f3,stroke:#337ab7
    classDef stateManagement fill:#d9edf7,stroke:#31708f
    classDef userInput fill:#dff0d8,stroke:#3c763d
    classDef auxiliary fill:#fcf8e3,stroke:#8a6d3b
    classDef utility fill:#f2dede,stroke:#a94442
    
    %% Apply Categories
    class TL,PB visualization
    class AM,SUM stateManagement
    class TS,AB userInput
    class SWU,AF auxiliary
    class TD,OI,TT,EB utility
```

## Component Legend

- **Visualization Components**: Timeline, ProgressBar
- **State Management Components**: ActivityManager, Summary  
- **User Input Components**: TimeSetup, ActivityButton
- **Auxiliary Components**: ServiceWorkerUpdater, ActivityForm
- **Utility Components**: TimeDisplay, OfflineIndicator, ThemeToggle, ErrorBoundary

### Diagram Relationship Types

- **Solid lines**: Direct parent-child rendering relationships
- **Dashed lines**: Functional dependencies or interactions
- **Text on lines**: Describes the nature of the relationship

## Related Documentation

- [Main README](../../README.md)
- [Development Process Guidelines](../PLANNED_CHANGES.md#development-process-guidelines)
- [Memory Log](../MEMORY_LOG.md) - Project history and issue resolutions
