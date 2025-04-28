### Issue: Multiple globals.css Files Causing CSS Variable Conflicts
**Date:** 2025-04-28
**Tags:** #debugging #styling #css #themes
**Status:** Resolved

#### Initial State
- Application styling was broken due to CSS variables not being properly defined
- Two `globals.css` files with duplicate and conflicting variable definitions:
  1. `/styles/globals.css` (root level) with theme variables
  2. `/src/app/globals.css` (app router) with app-specific styles
- Theme variables weren't properly shared between the files
- Dark mode was not working consistently

#### Debug Process
1. Identified the duplicate CSS variable definitions
   - Both files were defining the same CSS variables with potentially different values
   - Variable imports weren't working as CSS doesn't have "import" functionality for variables
   - Dark mode variables had inconsistent definitions and references

2. Analyzed the relationship between the files
   - `styles/globals.css` was meant for core theme variables and utility classes
   - `src/app/globals.css` was meant for Next.js App Router specific styles
   - The CSS cascade order was important but not properly managed

#### Resolution
1. Separated concerns between the two files:
   - `styles/globals.css`: Core theme variables and utility classes
   - `src/app/globals.css`: App-specific styles that use those variables

2. Fixed CSS variable definitions:
   - Removed duplicate definitions of the same variables
   - Consolidated dark theme variables in one place
   - Added proper comments explaining the variable sources

3. Fixed import order in layout.tsx:
   - Imported `styles/globals.css` first to establish theme variables
   - Then imported `app/globals.css` to use those variables
   - Added comments explaining the importance of this order

4. Added system preference fallbacks in both files:
   - Ensured dark mode would work based on system preference
   - Made sure user preferences would override system preferences

#### Lessons Learned
- CSS doesn't support variable imports like programming languages
- The cascade order of CSS files matters for variable definitions
- Clear separation of concerns in CSS files prevents conflicts
- Commented CSS helps maintain complex theming systems
- Explicit variable documentation prevents confusion
