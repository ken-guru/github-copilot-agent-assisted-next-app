# Planned Changes

This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation following the template in `docs/templates/PLANNED_CHANGES_TEMPLATE.md`.

Once implemented, move the change to `IMPLEMENTED_CHANGES.md` with a timestamp.

## Planned Change: Adjustments to JSON import and export (#242)

# Adjustments to JSON import and export

## Context
This change affects the activity import/export functionality. Currently, the exported/imported JSON for activities includes an `isActive` field, but its necessity is unclear as it is not visible in the activity creation/editing form. Additionally, the import process is strict and expects all fields to be present, which is not user-friendly for bulk or manual imports.

## Requirements
1. Investigate the usage of the `isActive` field in the codebase and determine if it is necessary for import/export. Remove it from the export if not needed.
2. Update the import logic to allow incomplete activity objects:
   - If only the `name` is present, auto-populate all other required fields with sensible defaults.
   - Handle missing, undefined, or null fields gracefully.
   - Ensure that imported activities are valid and usable in the application.
3. Add/Update tests to cover:
   - Importing activities with only `name` present
   - Importing activities with various combinations of missing fields
   - Exporting activities and verifying the presence/absence of `isActive`
4. Update documentation to describe the new import/export behavior and supported JSON formats.

## Technical Guidelines
- Use TypeScript for all changes.
- Ensure backward compatibility for existing imports/exports.
- Maintain or improve performance of import/export operations.
- Ensure accessibility and usability for users importing/exporting activities.
- Follow test-first development: write Jest tests before implementation.

## Expected Outcome
- Users can import activity JSONs with only the `name` field, and all other fields are auto-populated.
- The `isActive` field is only included if necessary; otherwise, it is omitted from exports.
- The import process is robust against missing, undefined, or null fields.
- Documentation and tests are updated to reflect the new behavior.

## Validation Criteria
- [x] Implementation complete
- [x] Test cases written (Jest)
- [x] Documentation updated
- [x] All tests, lint, and type checks pass
- [x] Change moved to IMPLEMENTED_CHANGES.md with timestamp
