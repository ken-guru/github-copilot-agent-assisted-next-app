# Border Radius System Refinement

**Date:** 2023-12-15
**Tags:** #css #design-system #tokens #refinement #ui
**Status:** Resolved

## Initial State
- Implemented a border radius token system with 7 options (none, xs, sm, md, lg, xl, full)
- Applied semantic variables across components
- Needed clearer guidelines for consistent usage based on element nesting and type
- Issue reported regarding too many different border radius values in use

## Implementation Process
1. Evaluated the current border radius scale
   - Confirmed the scale aligns with the desired "squircle aesthetic"
   - Determined the scale provides good flexibility while limiting options

2. Established rules for border radius based on element nesting
   - Created guidelines for parent/container elements
   - Defined consistent approach for interactive elements
   - Set rules for child elements within containers
   - Clarified usage for small UI elements
   - Added guidance for nested interactive elements

3. Updated documentation
   - Added nesting rules to the design token documentation
   - Included visual hierarchy considerations
   - Added responsive design guidance
   - Emphasized the "squircle aesthetic" principle

## Resolution
- Enhanced the border radius system with clear usage guidelines
- Maintained the existing token variables, adding only usage rules
- Created a consistent approach based on element nesting levels
- Preserved the desired "squircle aesthetic" while avoiding extreme values
- Aligned implementation with the reported issue's requirements

## Lessons Learned
- Design tokens need clear usage guidelines to ensure consistent implementation
- Element hierarchy (parent, child, nested) should inform design token usage
- Visual aesthetics (like "squircle") can be systematically applied through rules
- Responsive considerations are important for maintaining visual consistency
- A system needs both well-defined values AND clear usage patterns
