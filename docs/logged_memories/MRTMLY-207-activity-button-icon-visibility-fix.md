# Activity Button Icon Visibility Fix

**Date:** 2024-12-30  
**Tags:** #bugfix #bootstrap #ui #color-theming #activity-button  
**Status:** Resolved

## Initial State

### Issue Description
User reported that the icon inside the ActivityButton to start an activity was completely invisible, suspected to be a color-related issue.

### Investigation Findings
Upon examining the ActivityButton component (`/src/components/ActivityButton.tsx`), found conflicting color classes on the Button component:

```tsx
className="flex-grow-1 text-primary bg-primary border-primary"
```

**Root Cause:** The button had both `text-primary` (primary blue text) and `bg-primary` (primary blue background) applied, making the text/icon invisible against the matching background color.

## Debug Process

### Step 1: Component Analysis
- Located ActivityButton in `/src/components/ActivityButton.tsx`
- Identified the problematic line 105 with conflicting color classes
- Confirmed Bootstrap variant was already set to `variant="primary"` which handles styling

### Step 2: Solution Implementation
- Removed redundant color classes: `text-primary bg-primary border-primary`
- Kept only layout-related class: `flex-grow-1`
- Let Bootstrap's `variant="primary"` handle all color styling automatically

### Step 3: Test Validation
- One Bootstrap test failed due to expecting color classes
- Updated test to check for both class-based and component-based color implementation
- All 40 ActivityButton tests now passing

## Resolution

### Changes Made
1. **ActivityButton.tsx**: Removed conflicting color classes from Button component
2. **ActivityButton.bootstrap.test.tsx**: Updated color system test to handle React Bootstrap's approach

### Technical Details
- Bootstrap's `variant="primary"` automatically applies appropriate colors
- Removed manual color class overrides that conflicted with variant styling
- Tests updated to recognize both class-based and prop-based Bootstrap color systems

## Lessons Learned

### Key Insights
1. **Bootstrap Variant vs Manual Classes**: When using React Bootstrap components with variants, avoid manual color class overrides
2. **Color Conflict Detection**: Always check for text/background color conflicts when troubleshooting visibility issues
3. **Test Adaptation**: Bootstrap tests need to account for both CSS classes and component props

### Best Practices
- Let Bootstrap variants handle color theming instead of manual overrides
- Use Bootstrap's design system consistently throughout components
- Update tests to reflect actual Bootstrap rendering patterns

### Future Considerations
- Review other components for similar color class conflicts
- Establish coding standards for Bootstrap color usage
- Consider automated testing for color contrast issues
