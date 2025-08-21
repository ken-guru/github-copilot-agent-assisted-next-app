export function extractActivitiesFromImport(imported: unknown): unknown[] {
  // Accept array of activities directly
  if (Array.isArray(imported)) return imported;

  // Accept object with top-level `activities` array
  if (imported && typeof imported === 'object') {
    const obj = imported as Record<string, unknown>;

    // Handle stored shared session shape: { sessionData: { activities: [...] } }
    if ('sessionData' in obj) {
      const sd = obj['sessionData'];
      if (sd && typeof sd === 'object') {
        const sdObj = sd as Record<string, unknown>;
        const activitiesCandidate = sdObj['activities'];
        if (Array.isArray(activitiesCandidate)) return activitiesCandidate;
        throw new Error('Shared session format invalid: missing sessionData.activities');
      }
      throw new Error('Shared session format invalid: sessionData is not an object');
    }

    const activitiesCandidate = obj['activities'];
    if (Array.isArray(activitiesCandidate)) return activitiesCandidate;
  }

  throw new Error('Unsupported import format');
}

export default extractActivitiesFromImport;
