import { generateUniqueId, isValidUuid } from '../idUtils';

describe('ID Utilities', () => {
  describe('generateUniqueId', () => {
    it('generates unique IDs', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      expect(id1).not.toEqual(id2);
    });

    it('generates string IDs', () => {
      const id = generateUniqueId();
      expect(typeof id).toBe('string');
    });

    it('generates non-empty IDs', () => {
      const id = generateUniqueId();
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('isValidUuid', () => {
    it('returns true for valid UUIDs', () => {
      expect(isValidUuid('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).toBe(true);
      expect(isValidUuid('A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11')).toBe(true);
    });

    it('returns false for invalid UUIDs', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
      expect(isValidUuid('')).toBe(false);
      expect(isValidUuid('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1')).toBe(false); // Too short
      expect(isValidUuid('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a111')).toBe(false); // Too long
    });
  });
});