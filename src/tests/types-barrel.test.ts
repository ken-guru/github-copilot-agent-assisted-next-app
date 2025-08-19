import * as types from '@/types';

describe('types barrel', () => {
  it('exports expected keys', () => {
    // Basic sanity checks to ensure the barrel exports the core models
    expect(types).toHaveProperty('DEFAULT_ACTIVITIES');
  // TypeScript types such as `Activity` and `TimelineEntry` are type-only
  // and do not exist at runtime; ensure runtime constants are exported.
  expect(types).toHaveProperty('DEFAULT_ACTIVITIES');
  expect(types).toHaveProperty('MAX_AI_ACTIVITIES');
  });
});
