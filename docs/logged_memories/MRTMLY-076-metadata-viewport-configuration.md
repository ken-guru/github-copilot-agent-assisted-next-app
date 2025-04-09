### Issue: Next.js 15 Metadata Configuration Warnings
**Date:** 2025-04-08
**Tags:** #next-js #metadata #viewport #configuration #warnings
**Status:** Resolved

#### Initial State
- Next.js development server showing warnings about unsupported metadata configuration:
  - "Unsupported metadata viewport is configured in metadata export"
  - "Unsupported metadata themeColor is configured in metadata export"
- These properties were directly included in the metadata export in layout.tsx

#### Debug Process
1. Investigation of Next.js documentation
   - Identified that viewport and themeColor should be moved to a separate viewport export
   - Referred to Next.js documentation at: https://nextjs.org/docs/app/api-reference/functions/generate-viewport

2. Test-first approach implementation
   - Created test to verify proper separation of metadata and viewport exports
   - Focused test on ensuring correct properties in each export
   - Simplified test to avoid issues with rendering layout component that includes html/body elements

3. Implementation of the fix
   - Added Viewport type import from "next"
   - Removed viewport and themeColor from metadata export
   - Created separate viewport export containing these properties

#### Resolution
- Added proper viewport export with viewport and themeColor properties
- Removed these properties from the metadata export
- Verified fix with passing tests and development server running without warnings
- Application now follows Next.js 15 best practices for metadata configuration

#### Lessons Learned
- Next.js 15 has stricter separation of metadata types for better organization
- Viewport-related properties should be in a separate viewport export
- Test-first approach helped verify the solution before implementation
- When testing Next.js layout components, focus on testing exports rather than rendering when dealing with html/body elements
