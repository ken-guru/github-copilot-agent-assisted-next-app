/**
 * Deprecated: feature/TimelineDisplay has been removed in favor of the
 * canonical Timeline component and documentation examples.
 *
 * This shim intentionally throws to surface any stale imports quickly
 * in development and tests. If you see this error, replace usage with the
 * canonical timeline or a local, test-only stub.
 */

export default function TimelineDisplayDeprecated(): never {
  throw new Error(
    'feature/TimelineDisplay.tsx is deprecated and has been removed. '
    + 'Use src/components/Timeline.tsx for timeline rendering or update tests to use the canonical component.'
  );
}
