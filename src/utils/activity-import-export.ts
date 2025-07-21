/**
 * Activity Import/Export utilities for JSON handling
 * Provides enhanced import/export functionality with field auto-population
 * and clean export format (without internal fields like isActive)
 */

import { Activity } from '../types/activity';

/**
 * Options for exporting activities
 */
export interface ExportOptions {
  /** Include the isActive field in export (default: false) */
  includeIsActive?: boolean;
  /** Only export active activities (default: false) */
  activeOnly?: boolean;
}

/**
 * Options for importing activities
 */
export interface ImportOptions {
  /** Existing activities to avoid color conflicts */
  existingActivities?: Activity[];
  /** Starting color index for new activities */
  colorStartIndex?: number;
}

/**
 * Type for partial activity objects that can be imported
 */
export interface PartialActivityImport {
  id?: string;
  name: string; // Required field
  description?: string | null;
  colorIndex?: number;
  createdAt?: string | null;
  isActive?: boolean;
}

/**
 * Normalize description field handling null/undefined values
 * @param description - Description value from import data
 * @returns Normalized description value
 */
function normalizeDescription(description?: string | null): string | undefined {
  return description === null ? undefined : description;
}

/**
 * Export activities to a clean JSON format
 * Removes internal fields like isActive by default
 *
 * @param activities - Array of activities to export
 * @param options - Export options
 * @returns Array of activities in export format
 */
export function exportActivities(
  activities: Activity[],
  options: ExportOptions = {}
): Record<string, unknown>[] {
  const { includeIsActive = false, activeOnly = false } = options;

  let filteredActivities = activities;

  // Filter to active activities only if requested
  if (activeOnly) {
    filteredActivities = activities.filter(activity => activity.isActive);
  }

  return filteredActivities.map(activity => {
    const exported: Record<string, unknown> = {
      id: activity.id,
      name: activity.name,
      colorIndex: activity.colorIndex,
      createdAt: activity.createdAt,
    };

    // Include description if it exists
    if (activity.description !== undefined) {
      exported.description = activity.description;
    }

    // Include isActive if explicitly requested
    if (includeIsActive) {
      exported.isActive = activity.isActive;
    }

    return exported;
  });
}

/**
 * Import activities from JSON, auto-populating missing fields
 * Accepts minimal objects with just a name field
 *
 * @param importData - Array of partial activity objects
 * @param options - Import options
 * @returns Array of complete Activity objects
 * @throws Error if import data is invalid
 */
export function importActivities(
  importData: unknown[],
  options: ImportOptions = {}
): Activity[] {
  const { existingActivities = [], colorStartIndex = 0 } = options;

  // Validate input is an array
  if (!Array.isArray(importData)) {
    throw new Error('Import data must be an array');
  }

  if (importData.length === 0) {
    return [];
  }

  const usedColorIndices = new Set(existingActivities.map(a => a.colorIndex));
  let nextColorIndex = colorStartIndex;

  // Function to get next available color index
  const getNextColorIndex = (): number => {
    while (usedColorIndices.has(nextColorIndex)) {
      nextColorIndex++;
    }
    usedColorIndices.add(nextColorIndex);
    return nextColorIndex++;
  };

  return importData.map((item, index) => {
    // Validate item is an object
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid import data at index ${index}: must be an object`);
    }

    const partialActivity = item as PartialActivityImport;

    // Validate required name field
    if (!partialActivity.name || typeof partialActivity.name !== 'string' || partialActivity.name.trim() === '') {
      throw new Error(`Invalid import data at index ${index}: name is required and must be a non-empty string`);
    }

    // Generate ID if missing or invalid
    let id = partialActivity.id;
    if (!id || typeof id !== 'string' || id.trim() === '') {
      id = crypto.randomUUID ? crypto.randomUUID() : `imported-${Date.now()}-${index}`;
    }

    // Use provided colorIndex or assign next available
    let colorIndex = partialActivity.colorIndex;
    if (typeof colorIndex !== 'number' || colorIndex < 0) {
      colorIndex = getNextColorIndex();
    } else {
      // Mark provided colorIndex as used
      usedColorIndices.add(colorIndex);
    }

    // Use provided createdAt or current timestamp
    let createdAt = partialActivity.createdAt;
    if (!createdAt || typeof createdAt !== 'string') {
      createdAt = new Date().toISOString();
    }

    // Use provided isActive or default to true
    const isActive = typeof partialActivity.isActive === 'boolean'
      ? partialActivity.isActive
      : true;

    // Handle description using helper function
    const description = normalizeDescription(partialActivity.description);

    const activity: Activity = {
      id,
      name: partialActivity.name.trim(),
      colorIndex,
      createdAt,
      isActive,
    };

    // Add description if it exists and is not empty
    if (description !== undefined && typeof description === 'string') {
      activity.description = description;
    }

    return activity;
  });
}

/**
 * Validate if an object has the minimum required fields for import
 *
 * @param obj - Object to validate
 * @returns True if object can be imported
 */
export function canImportActivity(obj: unknown): obj is PartialActivityImport {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const partialActivity = obj as PartialActivityImport;
  return !!(partialActivity.name && typeof partialActivity.name === 'string' && partialActivity.name.trim());
}

/**
 * Get a preview of what would be imported without actually importing
 * Useful for showing import previews to users
 *
 * @param importData - Data to preview
 * @param options - Import options
 * @returns Preview of imported activities or validation errors
 */
export function previewImport(
  importData: unknown[],
  options: ImportOptions = {}
): {
  valid: Activity[],
  errors: string[]
} {
  const errors: string[] = [];
  const valid: Activity[] = [];

  if (!Array.isArray(importData)) {
    errors.push('Import data must be an array');
    return { valid, errors };
  }

  try {
    const imported = importActivities(importData, options);
    valid.push(...imported);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown import error');
  }

  return { valid, errors };
}
