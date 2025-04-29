### Issue: Console Errors and Warnings After Theme Fixes
**Date:** 2025-04-28
**Tags:** #debugging #styling #pwa #react-hydration
**Status:** Resolved

#### Initial State
- Multiple console errors and warnings after resolving CSS variables issue:
  1. "Error while trying to use icon from Manifest" - icon not found/valid
  2. Deprecated `apple-mobile-web-app-capable` warning
  3. React hydration mismatch with `className` and `data-theme` attributes
  4. "Invalid HSL color format" error in theme contrast validation

#### Debug Process
1. Icon manifest issue
   - Inspected public/manifest.json and found references to icon paths
   - Verified the existence of icon files in public/icons directory
   - Updated metadata configuration to include all icons

2. HSL color format error
   - Analyzed error in `getContrastRatio` function
   - Found that the function couldn't parse certain CSS color formats
   - Updated the regex pattern to handle various HSL syntax forms
   - Added error handling to prevent cascading failures

3. React hydration mismatch
   - Investigated classes applied during server-side rendering vs. client-side
   - Found inconsistent theme application between server and client
   - Improved preload script to ensure consistent theme application

#### Resolution
1. Fixed icon manifest issues:
   - Updated Next.js metadata configuration to include proper icon references
   - Ensured correct icon paths in both metadata and manifest.json

2. Fixed HSL color format parsing:
   - Enhanced color parsing to handle multiple formats (hex, RGB, HSL)
   - Added comprehensive error handling to prevent crashes
   - Updated validation code to safely handle unsupported formats

3. Fixed hydration mismatch:
   - Improved theme preload script to ensure consistent classes/attributes
   - Added code to remove existing classes before setting new ones
   - Added better guards for SSR vs. CSR environments

4. Added mobile-web-app-capable meta tag:
   - Added the recommended meta tag alongside apple-mobile-web-app-capable

#### Lessons Learned
- React hydration errors require careful attention to initial state consistency
- CSS parsing requires robust error handling for different browsers and formats 
- PWA manifest errors can be difficult to debug without inspecting network requests
- Running cross-browser compatibility tests is important, especially for PWAs
- Multiple CSS files require careful management of not just variables but also how they're applied
