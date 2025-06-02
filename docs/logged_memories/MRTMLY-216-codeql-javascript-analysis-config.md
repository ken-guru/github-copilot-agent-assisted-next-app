### Issue: MRTMLY-216: CodeQL JavaScript/TypeScript Analysis Configuration Fix
**Date:** 2025-06-02
**Tags:** #debugging #codeql #security #deployment #typescript
**Status:** Resolved

#### Initial State
- Code scanning was failing with the error: "1 configuration not found"
- The warning specifically indicated that a CodeQL configuration for JavaScript was missing
- The GitHub workflow (codeql-analysis.yml) was present but using an incorrect language identifier "javascript-typescript"

#### Debug Process
1. Initial investigation of the error
   - Examined the existing codeql-analysis.yml workflow file
   - Found that it was using "javascript-typescript" instead of "javascript" in the language matrix
   - Confirmed the error was related to the language identifier mismatch
   - Verified that in CodeQL terminology, the "javascript" analyzer actually handles both JavaScript AND TypeScript code

2. Solution attempts
   - Changed language identifier from "javascript-typescript" to "javascript" to match GitHub's expected configuration
   - Confirmed that this change maintains full TypeScript analysis support
   - Added support for custom query packs from the codeql-custom-queries-javascript directory
   - Added explicit output directory for SARIF results

#### Resolution
- Updated the language configuration in the matrix to use "javascript" (which properly analyzes both JavaScript and TypeScript)
- Added proper integration with the custom query pack
- Enhanced the analysis configuration with proper output settings
- Fixed the category identifier to match GitHub's expected pattern "/language:javascript"
- Maintained full TypeScript code analysis support

#### Lessons Learned
- CodeQL analysis uses "javascript" as the language identifier that covers BOTH JavaScript and TypeScript code
- The identifier "javascript-typescript" is not a valid CodeQL language identifier
- Using the correct language identifier is crucial for successful code scanning
- Custom query packs need to be explicitly included in the workflow configuration
- Regular testing of security scanning workflows is important to ensure they remain functional
