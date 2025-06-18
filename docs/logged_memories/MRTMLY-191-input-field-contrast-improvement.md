### Issue: Input Field Contrast Improvement
**Date:** 2025-05-19
**Tags:** #accessibility #ui-layout #contrast #dark-mode #input-fields
**Status:** Resolved

#### Initial State
- Input fields in the application had very little contrast against their background
- Fields were difficult to see and distinguish, especially in dark mode
- Input fields were using `var(--background)` for their background color
- Issue affected multiple components including TimeSetup and ActivityManager

#### Debug Process
1. Initial investigation
   - Identified that input fields were using `var(--background)` for their background color 
   - This provided insufficient contrast against the text and surrounding content
   - Analyzed the CSS styling for input fields across multiple components
   - Found that some components like `TimeSetup.module.css` and `ActivityForm.module.css` had already been updated to use `--background-alt`
   - Found remaining issues in `ActivityManager.module.css` and `src/components/TimeSetup.module.css`

2. Solution approach
   - Determined best practice would be to use `var(--background-alt)` for input fields
   - This provides better contrast against both the text and the surrounding components
   - Adding a subtle inset box shadow further improves visual distinction
   - Needed to be consistent across all components

3. First implementation
   - Modified `/components/feature/ActivityManager.module.css` to use `--background-alt` instead of `--background`
   - Modified `/src/components/TimeSetup.module.css` to use `--background-alt` instead of `--background`
   - Added subtle inset box shadow to both for better visual distinction
   - Ensured consistency with other input field styling in the application

4. Further contrast enhancement
   - Initial changes improved contrast but were still insufficient for optimal visibility
   - Moved from using CSS variables to explicit color values for maximum contrast
   - Used white background in light mode and a darker gray (#2a2a2a) in dark mode
   - Enhanced the box-shadow for better depth perception
   - Added specific dark mode class selectors to target theme changes

5. Final contrast improvement and style refinement
   - Removed the inset box shadows that appeared visually unpleasant
   - Used a pure white (#ffffff) background for inputs in light mode
   - Used a much lighter gray (#383838) for inputs in dark mode for better contrast
   - Increased border thickness to 2px and used more visible border colors
   - Implemented subtle background color change on focus for better user feedback
   - Standardized this approach across all input fields in the application

6. Complete implementation across all components
   - Updated ActivityForm input field styling for consistency
   - Updated ActivityManager input field styling in src directory
   - Ensured all input fields have identical styling across the application
   - Verified that all input fields now have appropriate contrast in both light and dark modes

#### Resolution
- Final improved input field styling in ActivityManager component:
  ```css
  .addActivityInput {
    padding: var(--space-sm);
    border-radius: var(--space-sm);
    border: 2px solid #d0d0d0; /* Lighter, more visible border for light mode */
    background-color: #ffffff; /* Pure white in light mode */
    color: var(--text-primary);
  }

  .dark .addActivityInput,
  [data-theme="dark"] .addActivityInput,
  .dark-mode .addActivityInput {
    background-color: #383838; /* Much lighter gray for dark mode */
    border-color: #555555; /* More visible border in dark mode */
    color: var(--text-primary-dark);
  }

  .addActivityInput:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: #f9f9f9; /* Very slight gray to indicate focus in light mode */
  }
  ```
  
- Final improved input field styling in TimeSetup components:
  ```css
  .input {
    width: 100%;
    padding: var(--space-sm);
    border: 2px solid #d0d0d0; /* Lighter, more visible border for light mode */
    border-radius: var(--radius-input);
    background-color: #ffffff; /* Pure white in light mode */
    color: var(--text-primary);
  }

  .dark .input,
  [data-theme="dark"] .input,
  .dark-mode .input {
    background-color: #383838; /* Much lighter gray for dark mode */
    border-color: #555555; /* More visible border in dark mode */
    color: var(--text-primary-dark);
  }

  .input:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: #f9f9f9; /* Very slight gray to indicate focus in light mode */
  }
  ```

- Input fields now have significantly better contrast against their background and surrounding elements
- Consistent styling across all input fields in the application
- Improved user experience, especially for users with visual impairments or in dark mode

#### Lessons Learned
- Form input fields should have distinct styling from the page background for better accessibility
- Sometimes CSS variables may not provide enough contrast, and explicit color values are needed
- Using hard-coded colors like white for light mode and a specific darker gray for dark mode can provide better contrast than relying on theme variables
- Enhanced box shadows (deeper and with more opacity) significantly improve the visual distinction of input fields
- The approach of using theme-specific selectors (`.dark`, `[data-theme="dark"]`, etc.) provides more control than relying solely on CSS variables
- When tackling accessibility issues, incremental improvements may be necessary, testing with actual users between iterations
- Systematically checking all instances of a component type is important when fixing UI issues
