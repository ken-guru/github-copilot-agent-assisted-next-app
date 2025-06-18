### Issue: MRTMLY-192: CodeQL JavaScript/TypeScript Analysis Configuration Fix
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
   - Added explicit output directory for SARIF results

3. Custom queries evaluation
   - Initially attempted to include a custom query pack, but discovered it was just a placeholder with no actual query files
   - Removed the custom pack reference as it wasn't needed and contained only placeholder configuration

#### Resolution
- Updated the language configuration in the matrix to use "javascript" (which properly analyzes both JavaScript and TypeScript)
- Removed references to a placeholder custom query pack that contained no actual queries
- Enhanced the analysis configuration with proper output settings
- Fixed the category identifier to match GitHub's expected pattern "/language:javascript"
- Maintained full TypeScript code analysis support
- Focused on using the standard security-and-quality query suite

#### Lessons Learned
- CodeQL analysis uses "javascript" as the language identifier that covers BOTH JavaScript and TypeScript code
- The identifier "javascript-typescript" is not a valid CodeQL language identifier
- Using the correct language identifier is crucial for successful code scanning
- It's important to verify that custom query packs contain actual query files before referencing them
- Removing unnecessary configurations can simplify workflows and reduce potential points of failure
- The standard security-and-quality query suite provides comprehensive analysis without requiring custom packs
- Regular testing of security scanning workflows is important to ensure they remain functional
