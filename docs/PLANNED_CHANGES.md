# Project Development Plan: Bootstrap Integration

## Phase 1: Project Setup and Bootstrap Installation

### Objective
Integrate Bootstrap into the Next.js project and establish a clean foundation for migrating existing components and styles.

### Key Tasks

1.  **Install Bootstrap and Dependencies:**
    *   Install `bootstrap` and `popper.js` (if needed for specific components like dropdowns, popovers, tooltips) via npm or yarn.
        ```bash
        npm install bootstrap @popperjs/core
        # or
        yarn add bootstrap @popperjs/core
        ```
    *   Verify installation and package versions.

2.  **Global Bootstrap CSS Integration:**
    *   Import Bootstrap CSS globally in `src/app/layout.tsx` (or your main layout file).
        ```typescript
        import 'bootstrap/dist/css/bootstrap.min.css';
        ```
    *   Ensure Bootstrap styles are loaded correctly and apply basic resets.

3.  **Viewport Meta Tag:**
    *   Verify that the `pages/_document.tsx` (or equivalent for App Router if you have a custom document) includes the responsive viewport meta tag in the `<head>`:
        ```html
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ```

4.  **JavaScript Integration (as needed):**
    *   For components requiring Bootstrap's JavaScript (e.g., Modals, Dropdowns, Carousel), plan for dynamic imports or selective imports to avoid including all of Bootstrap's JS if not necessary.
    *   Consider using React-Bootstrap or reactstrap for better integration with React's component model, which can simplify the use of Bootstrap JS-dependent components. If choosing this route, install the chosen library:
        ```bash
        npm install react-bootstrap
        # or
        npm install reactstrap
        ```

5.  **Initial Sanity Check:**
    *   Run the application and perform a quick visual inspection to ensure Bootstrap's base styles are being applied without major conflicts.
    *   Check browser console for any immediate errors related to Bootstrap integration.

6.  **Remove Existing Custom CSS:**
    *   Systematically remove or comment out all existing custom CSS files and `className` references from components. This includes:
        *   `styles/design-tokens/` (PENDING - to be deleted after module references are removed)
        *   `styles/layout/` (PENDING - to be deleted after module references are removed)
        *   `styles/main.css` (DONE - import commented in `src/app/layout.tsx`, file to be deleted later)
        *   All `*.module.css` files associated with components. (IN PROGRESS)
            *   Comment out `styles` import and usage in `components/ui/OfflineIndicator.tsx` (DONE)
            *   Comment out `styles` import and usage in `components/ui/ThemeToggle.module.css` (DONE)
            *   Comment out `styles` import and usage in `src/components/ActivityButton.module.css` (DONE)
            *   Comment out `styles` import and usage in `src/components/ActivityForm.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/ActivityManager.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/ConfirmationDialog.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/ProgressBar.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/Summary.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/TimeDisplay.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/TimeSetup.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/Timeline.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/TimelineDisplay.module.css` (PENDING)
            *   Comment out `styles` import and usage in `src/components/UpdateNotification.module.css` (PENDING)
            *   (Once all above are DONE) Delete all `*.module.css` files (PENDING)
            *   (Once all above are DONE) Delete `styles/design-tokens/` directory (PENDING)
            *   (Once all above are DONE) Delete `styles/layout/` directory (PENDING)
            *   (Once all above are DONE) Delete `styles/main.css` file (PENDING)
    *   This step is crucial to avoid style conflicts and to ensure that Bootstrap is the primary styling engine.

7.  **Test Suite Review (Initial):**
    *   Run the existing test suite (`npm test`).
    *   Anticipate a significant number of test failures, especially those related to specific CSS class names, styles, or DOM structures that will change with Bootstrap.
    *   Categorize failing tests:
        *   Tests failing due to removed CSS classes/styles (expected).
        *   Tests failing due to DOM structure changes (will need updates as components are refactored).
        *   Tests for core logic (should ideally still pass or require minimal updates).
    *   This initial run provides a baseline for tracking progress.

### Acceptance Criteria (Phase 1):
*   Bootstrap CSS is successfully imported and globally applied.
*   The application runs without critical errors related to Bootstrap setup.
*   All custom CSS files and `className` props (related to old styling) are removed or commented out.
*   A baseline of failing tests is established.

## Phase 2: Component Refactoring with Bootstrap

### Objective
Incrementally refactor each existing React component to utilize Bootstrap classes for styling and layout, and update corresponding tests. This phase will involve rewriting DOM structures where necessary to align with Bootstrap's conventions.

### General Approach for Each Component:

1.  **Prioritize Components:** Start with foundational layout components, then move to simpler UI elements, and finally tackle complex interactive components. A possible order:
    *   Overall App Layout (`src/app/layout.tsx`, header, footer)
    *   Basic UI Primitives (Buttons, Form Inputs - if not using a React-Bootstrap library)
    *   `SplashScreen`
    *   `TimeSetup`
    *   `ActivityButton`
    *   `ProgressBar`
    *   `Timeline` / `TimelineDisplay`
    *   `Summary`
    *   `ActivityManager`
    *   `OfflineIndicator`, `ServiceWorkerUpdater` (and other UI utilities)

2.  **DOM Structure Review & Rewrite:**
    *   For each component, analyze its current DOM structure.
    *   Identify how Bootstrap's grid system, layout utilities (flex, spacing, etc.), and component classes can be applied.
    *   Rewrite the component's JSX to use Bootstrap's recommended HTML structure and CSS classes. For example, replace custom grid/flexbox implementations with Bootstrap's `row`, `col-*`, `d-flex`, `justify-content-*`, etc.
    *   Replace custom form styling with Bootstrap's form controls and classes.
    *   Utilize Bootstrap components (e.g., `btn`, `card`, `modal`, `alert`) where appropriate.

3.  **Apply Bootstrap Classes:**
    *   Remove all old `className` references that pointed to `*.module.css` files.
    *   Apply Bootstrap utility classes for spacing (`m-*`, `p-*`), typography (`text-*`, `fw-*`), colors (`bg-*`, `text-*`), borders, display, etc.

4.  **JavaScript Interactions (If not using React-Bootstrap/reactstrap):**
    *   If a component requires Bootstrap's JavaScript (e.g., a dropdown), ensure it's initialized correctly. This might involve `useEffect` hooks to initialize Bootstrap components after the DOM is ready.
    *   **Strong Recommendation:** For complex JS-driven components, prefer using a library like React-Bootstrap or reactstrap. These libraries provide React components that encapsulate Bootstrap's behavior, making integration much smoother and more idiomatic in a React application.

5.  **Testing:**
    *   **Test-First (for refactoring):** Before refactoring a component's DOM and styles, review its existing tests.
    *   Update tests to reflect the new DOM structure (e.g., querying by Bootstrap classes if necessary, or preferably by roles and accessible names).
    *   Ensure tests still cover the component's core functionality and user interactions.
    *   Aim to get all tests for the refactored component passing.

6.  **Accessibility (A11y):**
    *   Pay attention to Bootstrap's accessibility recommendations.
    *   Ensure ARIA attributes are used correctly, especially for interactive components.
    *   Verify keyboard navigation and screen reader compatibility.

7.  **Responsive Design:**
    *   Leverage Bootstrap's responsive breakpoints (`col-sm-*`, `d-md-block`, etc.) to ensure components adapt to different screen sizes.
    *   Test responsiveness thoroughly on various devices or using browser developer tools.

### Specific Component Considerations (Examples):

*   **Layout Components (`src/app/layout.tsx`, Header, etc.):**
    *   Implement the main application shell using Bootstrap's grid system or flex utilities.
    *   Use Bootstrap's `navbar` component for the header if applicable.

*   **Forms (`TimeSetup`, `ActivityForm`):**
    *   Use Bootstrap's form classes (`form-control`, `form-label`, `form-check`, `btn`) for consistent styling.
    *   Implement validation feedback using Bootstrap's validation styles.

*   **Buttons (`ActivityButton`, etc.):**
    *   Replace custom button styling with Bootstrap's button classes (`btn`, `btn-primary`, `btn-lg`, etc.).

*   **`ProgressBar`:**
    *   Utilize Bootstrap's `progress` and `progress-bar` components.

*   **`ActivityManager` (and other complex components):**
    *   This will likely be the most intensive refactoring. Break it down into smaller sub-sections.
    *   Focus on using Bootstrap's grid for layout, cards for grouping content, and appropriate utility classes.

### Acceptance Criteria (Phase 2):
*   All relevant components are refactored to use Bootstrap classes and DOM structures.
*   Custom CSS modules and associated styles are completely removed.
*   The application is visually styled using Bootstrap.
*   The majority of the test suite is passing, with tests updated to reflect new structures.
*   The application is responsive across common device breakpoints.
*   Accessibility considerations have been addressed.

## Phase 3: Theming and Customization (Optional)

### Objective
Apply project-specific theming or customizations on top of Bootstrap, if required.

### Key Tasks:

1.  **Identify Customization Needs:**
    *   Determine if the default Bootstrap theme is sufficient or if custom branding (colors, fonts, etc.) is needed.

2.  **Sass Customization (Recommended for deep customization):**
    *   If significant theming is required, set up a Sass build process to override Bootstrap's Sass variables.
    *   Import Bootstrap's Sass files into your project.
    *   Modify variables (e.g., `$primary`, `$font-family-base`) in a custom Sass file before importing Bootstrap's core Sass.
    *   Compile your custom Bootstrap build.

3.  **CSS Overrides (For minor tweaks):**
    *   For small adjustments, create a separate CSS file that loads *after* Bootstrap's CSS to override specific styles. Use this sparingly to avoid specificity wars.

4.  **Custom Components (If needed):**
    *   If Bootstrap doesn't offer a specific component needed, build it using Bootstrap's utility classes and theming capabilities to maintain consistency.

### Acceptance Criteria (Phase 3):
*   The application reflects the desired visual theme, whether default Bootstrap or custom.
*   Customizations are implemented in a maintainable way (preferably via Sass variables).

## Phase 4: Final Review, Testing, and Cleanup

### Objective
Ensure the application is stable, performant, and all tests are passing after the Bootstrap integration.

### Key Tasks:

1.  **Full Test Suite Execution:**
    *   Run `npm test` and ensure all tests are passing. Address any remaining failures.
    *   Perform thorough end-to-end (E2E) testing if applicable (e.g., using Playwright).

2.  **Cross-Browser and Cross-Device Testing:**
    *   Test the application on major browsers (Chrome, Firefox, Safari, Edge) and various device sizes.

3.  **Performance Audit:**
    *   Check for any performance regressions. Ensure Bootstrap's CSS and JS are not causing undue load times.
    *   Optimize as needed (e.g., ensure JS is only loaded if necessary, tree-shaking if using Sass).

4.  **Code Review:**
    *   Review all refactored components for consistency, proper Bootstrap usage, and adherence to best practices.

5.  **Documentation Update:**
    *   Update any relevant project documentation (README, component docs) to reflect the use of Bootstrap and any new DOM structures or class conventions.
    *   Update the Memory Log with details of the migration process, challenges, and solutions.

### Acceptance Criteria (Phase 4):
*   All unit and E2E tests pass.
*   The application functions correctly and looks consistent across supported browsers and devices.
*   Performance is acceptable.
*   Code is clean, well-documented, and follows best practices.
*   Project documentation is up-to-date.

## General Guidelines Throughout the Process:

*   **Version Control:** Commit changes frequently with clear, descriptive messages. Consider using feature branches for larger refactoring tasks.
*   **Incremental Changes:** Refactor one component or a small group of related components at a time. Test thoroughly before moving to the next.
*   **Communication:** Keep the team informed of progress and any roadblocks.
*   **Prioritize Functionality:** Ensure core application logic remains intact throughout the styling changes.
*   **Follow Bootstrap Documentation:** Refer to the official Bootstrap documentation for correct usage of classes and components.

This plan provides a structured approach to migrating your project to Bootstrap. Remember to adapt it based on your project's specific complexities and priorities.
