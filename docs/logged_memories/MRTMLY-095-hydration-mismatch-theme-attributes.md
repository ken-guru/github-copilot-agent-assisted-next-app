### Issue: React Hydration Mismatch for Theme Attributes
**Date:** 2025-04-28
**Tags:** #debugging #nextjs #hydration #react #theming
**Status:** Resolved

#### Initial State
- The application was experiencing React hydration mismatches
- Error message indicated the server-rendered HTML did not match client properties
- The issue specifically concerned the `className="light-mode"` and `data-theme="light"` attributes on the `html` element
- Server was rendering without these attributes, but client was adding them during hydration

#### Debug Process
1. Investigation of the theme implementation
   - Identified two main mechanisms for theme application:
     - Inline script in `layout.tsx` head section that runs before React hydration
     - ThemeContext provider that applies theme after component mount
   - Neither approach was accounting for server-side rendering properly

2. Root cause analysis
   - Server renders HTML without theme attributes
   - Client-side code immediately adds these attributes during hydration
   - This timing difference triggers React's hydration mismatch warning
   - The server and client were rendering different DOM structures

#### Resolution
1. Modified `layout.tsx` to include default theme attributes in server-rendered HTML:
   ```tsx
   <html lang="en" className="light-mode" data-theme="light">
   ```

2. Updated the inline script in `layout.tsx` to avoid modifying DOM during hydration:
   - Only makes DOM changes when switching from default light theme
   - Prevents unnecessary modifications that would cause mismatches

3. Enhanced `ThemeContext.tsx`:
   - Added a timeout to delay theme application until after hydration
   - Updated `applyThemeToDOM` to only modify the DOM when the theme actually changes
   - Added check for existing attribute before making DOM changes

#### Lessons Learned
- When using SSR with client-side hydration, the initial server-rendered HTML must match what React expects during hydration
- Theme switching should be handled carefully to avoid modifying the DOM during the critical hydration phase
- Default values should be consistent between server and client rendering
- For attributes modified by client-side JavaScript, ensure they're also included in the server-rendered output
- Using a slight delay with setTimeout(0) can help avoid hydration mismatches by ensuring components are fully hydrated before DOM modifications
