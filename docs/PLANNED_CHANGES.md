# Planned Changes

This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation following the template in `docs/templates/PLANNED_CHANGES_TEMPLATE.md`.

Once implemented, move the change to `IMPLEMENTED_CHANGES.md` with a timestamp.

## No current planned changes

All current changes have been implemented and moved to `IMPLEMENTED_CHANGES.md`.

### Context
Issue #242 requests improvements to the activity JSON import/export functionality. Currently:
- The export JSON includes the `isActive` field which is not visible or editable in the activity creation/edit forms
- The import functionality requires all fields to be present and does not auto-populate missing/optional fields
- Users want to be able to import minimal JSON objects where only essential fields like `name` are provided

Components affected:
- `src/utils/activity-storage.ts` - Core storage functionality
- `src/components/feature/ActivityCrud.tsx` - Import/export UI
- Activity type validation and processing

### Requirements
1. **Export Functionality Enhancement**
   - Remove `isActive` field from JSON exports by default
   - Keep `isActive` as an internal field for soft deletion functionality
   - Maintain backward compatibility with existing JSON structure

2. **Import Functionality Enhancement**
   - Accept incomplete JSON objects with only essential fields (name required)
   - Auto-populate missing fields with sensible defaults:
     - `id`: Generate new UUID if missing
     - `description`: Use empty string or undefined if missing
     - `colorIndex`: Assign next available color index if missing
     - `createdAt`: Use current timestamp if missing
     - `isActive`: Default to true if missing
   - Handle various field states (missing, undefined, null)

3. **Validation Enhancement**
   - Update validation to support partial activity objects during import
   - Maintain strict validation for internal storage operations
   - Add comprehensive error handling for malformed import data

### Technical Guidelines
- **Framework Considerations**: Use existing localStorage-based storage system
- **Performance**: Maintain current performance characteristics
- **Testing**: Write comprehensive Jest tests for all import/export scenarios
- **Type Safety**: Maintain TypeScript type safety throughout
- **Error Handling**: Provide clear error messages for invalid import data
- **Backward Compatibility**: Ensure existing export files can still be imported

### Expected Outcome
**User Perspective**:
- Users can export activities without seeing internal `isActive` field
- Users can import minimal JSON files with just activity names
- Clear error messages when import fails due to invalid data
- Seamless import/export experience for backup and migration

**Technical Perspective**:
- Clean separation between internal data model and export format
- Robust import validation and auto-population logic
- Comprehensive test coverage for edge cases
- Maintainable code structure following existing patterns

### Validation Criteria
- [ ] Export JSON no longer includes `isActive` field
- [ ] Import accepts minimal JSON with only `name` field
- [ ] Import auto-populates all missing required fields
- [ ] Import handles undefined, null, and missing field states
- [ ] All existing functionality remains working
- [ ] Comprehensive Jest test coverage added
- [ ] Error handling provides helpful user feedback
- [ ] Backward compatibility with existing export files maintained
- [ ] Documentation updated to reflect new capabilities

**Note:** Always use the complete template structure - never create partial specifications. Ask clarifying questions if template sections cannot be completed fully before proceeding with implementation.