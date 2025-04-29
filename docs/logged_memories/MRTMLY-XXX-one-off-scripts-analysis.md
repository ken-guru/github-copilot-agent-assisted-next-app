### Issue: One-Off Scripts Analysis
**Date:** 2023-11-30
**Tags:** #maintenance #cleanup #scripts
**Status:** In Progress

#### Initial State
- The project contains several utility scripts in the `/scripts` directory
- Some scripts appear to be one-off solutions to issues that have likely been resolved
- Need to identify which scripts are candidates for cleanup or archiving

#### Debug Process
1. Script identification and analysis
   - Examined script names and contents
   - Analyzed purpose and ongoing utility
   - Categorized scripts as either ongoing utilities or one-off solutions

2. Identified potential one-off scripts:
   - `convert-test-files.js` - Likely a one-time migration tool for test files
   - `test-duplicate-activity-handling.js` - Specialized test for a specific issue
   - `clean-config.sh` - Configuration cleanup utility for a specific migration

#### Recommendations
- Archive or remove the identified one-off scripts
- Before removal, verify:
  1. The issues these scripts addressed are fully resolved
  2. The functionality is not needed for future similar scenarios
  3. Any valuable code patterns are documented elsewhere
  4. No active references to these scripts exist in documentation or other scripts

#### Lessons Learned
- Utility scripts should be clearly categorized as either:
  - Ongoing development utilities (keep in `/scripts`)
  - One-off solutions (consider moving to `/scripts/archive`)
- Consider adding documentation comments at the top of scripts explaining their purpose and whether they're expected to be used long-term
- Review script inventory periodically to prevent accumulation of outdated utilities
