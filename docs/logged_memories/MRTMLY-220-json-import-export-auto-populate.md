### Issue: Adjustments to JSON import and export (#242) Debugging Session
**Date:** 2025-07-21
**Tags:** #debugging #import #export #activities #json #tests
**Status:** Resolved

#### Initial State
- The import/export logic for activities required all fields to be present, and exported an `isActive` field whose necessity was unclear.
- User requested that import should allow incomplete JSON objects (e.g., only `name` present), with missing fields auto-populated.
- Tests and documentation did not cover these edge cases.

#### Debug Process
1. Gathered requirements from MCP and planning docs.
2. Wrote Jest tests for importing incomplete activities and for export behavior.
3. Implemented `importActivities` to auto-populate missing fields and `exportActivities` to omit `isActive` by default.
4. Updated documentation and fixed all lint/type errors.
5. Ran all tests, lint, type-check, and build to verify correctness.

#### Resolution
- New import/export logic is robust to missing, undefined, or null fields.
- All tests pass, and documentation is up to date.
- The `isActive` field is omitted from exports unless explicitly required.

#### Lessons Learned
- Test-first development ensures robust handling of edge cases.
- Documentation and planning templates help clarify requirements and avoid ambiguity.
- MCP tools streamline debugging and context gathering for complex changes.
