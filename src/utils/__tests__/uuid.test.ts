/**
 * Tests for UUID generation and validation utilities
 */

import {
  generateUUID,
  validateUUID,
  isValidUUID,
  generateSessionSharingId,
  validateSessionSharingId,
  extractUUIDFromShareUrl,
  generateShareUrl,
  SessionRelationshipUtils,
} from '../uuid';

describe('UUID Utilities', () => {
  describe('generateUUID', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate UUIDs with correct version and variant', () => {
      const uuid = generateUUID();
      const parts = uuid.split('-');
      
      // Version should be 4
      expect(parts[2][0]).toBe('4');
      
      // Variant should be 8, 9, a, or b
      expect(['8', '9', 'a', 'b']).toContain(parts[3][0].toLowerCase());
    });
  });

  describe('validateUUID', () => {
    it('should validate correct UUID v4', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(() => validateUUID(validUUID)).not.toThrow();
      expect(validateUUID(validUUID)).toBe(validUUID);
    });

    it('should reject invalid UUID formats', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '550e8400-e29b-41d4-a716',
        '550e8400-e29b-41d4-a716-446655440000-extra',
        '',
        '550e8400-e29b-41d4-a716-44665544000g', // invalid character
        '550e8400-e29b-41d4-a716-44665544000', // too short
      ];

      invalidUUIDs.forEach(uuid => {
        expect(() => validateUUID(uuid)).toThrow('Invalid UUID format');
      });
    });
  });

  describe('isValidUUID', () => {
    it('should return true for valid UUIDs', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should return false for invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '550e8400-e29b-41d4-a716',
        '',
        '550e8400-e29b-41d4-a716-44665544000g',
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });
  });

  describe('generateSessionSharingId', () => {
    it('should generate a valid session sharing ID', () => {
      const sessionId = generateSessionSharingId();
      expect(isValidUUID(sessionId)).toBe(true);
    });

    it('should generate unique session IDs', () => {
      const id1 = generateSessionSharingId();
      const id2 = generateSessionSharingId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('validateSessionSharingId', () => {
    it('should validate correct session sharing IDs', () => {
      const validId = '550e8400-e29b-41d4-a716-446655440000';
      expect(() => validateSessionSharingId(validId)).not.toThrow();
      expect(validateSessionSharingId(validId)).toBe(validId);
    });

    it('should trim whitespace from session IDs', () => {
      const validId = '550e8400-e29b-41d4-a716-446655440000';
      const idWithWhitespace = `  ${validId}  `;
      expect(validateSessionSharingId(idWithWhitespace)).toBe(validId);
    });

    it('should reject invalid session sharing IDs', () => {
      const invalidIds = [
        '',
        '   ',
        'not-a-uuid',
        null as unknown,
        undefined as unknown,
        123 as unknown,
      ];

      invalidIds.forEach(id => {
        expect(() => validateSessionSharingId(id)).toThrow();
      });
    });
  });

  describe('extractUUIDFromShareUrl', () => {
    it('should extract UUID from valid share URLs', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const urls = [
        `https://example.com/shared/${uuid}`,
        `http://localhost:3000/shared/${uuid}`,
        `https://myapp.vercel.app/shared/${uuid}`,
        `https://example.com/shared/${uuid}/`,
        `https://example.com/shared/${uuid}?param=value`,
      ];

      urls.forEach(url => {
        expect(extractUUIDFromShareUrl(url)).toBe(uuid);
      });
    });

    it('should reject invalid share URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'https://example.com/wrong/path',
        'https://example.com/shared/',
        'https://example.com/shared/not-a-uuid',
        'https://example.com/shared',
        '',
      ];

      invalidUrls.forEach(url => {
        expect(() => extractUUIDFromShareUrl(url)).toThrow();
      });
    });
  });

  describe('generateShareUrl', () => {
    it('should generate valid share URLs', () => {
      const baseUrl = 'https://example.com';
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const shareUrl = generateShareUrl(baseUrl, sessionId);
      
      expect(shareUrl).toBe(`${baseUrl}/shared/${sessionId}`);
      expect(() => new URL(shareUrl)).not.toThrow();
    });

    it('should handle different base URL formats', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const baseUrls = [
        'https://example.com',
        'https://example.com/',
        'http://localhost:3000',
        'https://myapp.vercel.app',
      ];

      baseUrls.forEach(baseUrl => {
        const shareUrl = generateShareUrl(baseUrl, sessionId);
        expect(shareUrl).toContain(`/shared/${sessionId}`);
        expect(() => new URL(shareUrl)).not.toThrow();
      });
    });

    it('should validate session ID before generating URL', () => {
      const baseUrl = 'https://example.com';
      const invalidSessionIds = [
        'not-a-uuid',
        '',
        '   ',
      ];

      invalidSessionIds.forEach(sessionId => {
        expect(() => generateShareUrl(baseUrl, sessionId)).toThrow();
      });
    });

    it('should handle invalid base URLs', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const invalidBaseUrls = [
        'not-a-url',
        '',
        '   ',
        'invalid://url with spaces',
        'http://',
        'https://',
      ];

      invalidBaseUrls.forEach(baseUrl => {
        expect(() => generateShareUrl(baseUrl, sessionId)).toThrow();
      });
    });
  });

  describe('SessionRelationshipUtils', () => {
    describe('canLinkSessions', () => {
      it('should allow linking unrelated sessions', () => {
        const sourceId = '550e8400-e29b-41d4-a716-446655440000';
        const targetId = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        const relationships = new Map<string, string[]>();

        const canLink = SessionRelationshipUtils.canLinkSessions(
          sourceId,
          targetId,
          relationships
        );

        expect(canLink).toBe(true);
      });

      it('should prevent linking session to itself', () => {
        const sessionId = '550e8400-e29b-41d4-a716-446655440000';
        const relationships = new Map<string, string[]>();

        const canLink = SessionRelationshipUtils.canLinkSessions(
          sessionId,
          sessionId,
          relationships
        );

        expect(canLink).toBe(false);
      });

      it('should prevent circular references', () => {
        const sessionA = '550e8400-e29b-41d4-a716-446655440000';
        const sessionB = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        const sessionC = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

        // Create a chain: A -> B -> C
        const relationships = new Map([
          [sessionA, [sessionB]],
          [sessionB, [sessionC]],
          [sessionC, []],
        ]);

        // Try to link C -> A (would create circular reference)
        const canLink = SessionRelationshipUtils.canLinkSessions(
          sessionC,
          sessionA,
          relationships
        );

        expect(canLink).toBe(false);
      });

      it('should allow complex non-circular relationships', () => {
        const sessionA = '550e8400-e29b-41d4-a716-446655440000';
        const sessionB = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        const sessionC = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
        const sessionD = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

        // Create relationships: A -> B, A -> C, B -> D
        const relationships = new Map([
          [sessionA, [sessionB, sessionC]],
          [sessionB, [sessionD]],
          [sessionC, []],
          [sessionD, []],
        ]);

        // Link C -> D should be allowed (no circular reference)
        const canLink = SessionRelationshipUtils.canLinkSessions(
          sessionD,
          sessionC,
          relationships
        );

        expect(canLink).toBe(true);
      });
    });

    describe('calculateChainDepth', () => {
      it('should calculate depth for single session', () => {
        const sessionId = '550e8400-e29b-41d4-a716-446655440000';
        const relationships = new Map([[sessionId, []]]);

        const depth = SessionRelationshipUtils.calculateChainDepth(
          sessionId,
          relationships
        );

        expect(depth).toBe(0);
      });

      it('should calculate depth for linear chain', () => {
        const sessionA = '550e8400-e29b-41d4-a716-446655440000';
        const sessionB = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        const sessionC = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

        // Create chain: A -> B -> C
        const relationships = new Map([
          [sessionA, [sessionB]],
          [sessionB, [sessionC]],
          [sessionC, []],
        ]);

        const depth = SessionRelationshipUtils.calculateChainDepth(
          sessionA,
          relationships
        );

        expect(depth).toBe(2);
      });

      it('should calculate depth for branching relationships', () => {
        const sessionA = '550e8400-e29b-41d4-a716-446655440000';
        const sessionB = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        const sessionC = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
        const sessionD = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
        const sessionE = '6ba7b813-9dad-11d1-80b4-00c04fd430c8';

        // Create branching: A -> [B, C], B -> D, C -> E
        const relationships = new Map([
          [sessionA, [sessionB, sessionC]],
          [sessionB, [sessionD]],
          [sessionC, [sessionE]],
          [sessionD, []],
          [sessionE, []],
        ]);

        const depth = SessionRelationshipUtils.calculateChainDepth(
          sessionA,
          relationships
        );

        expect(depth).toBe(2); // Maximum depth is 2 (A -> B -> D or A -> C -> E)
      });

      it('should handle empty relationships', () => {
        const sessionId = '550e8400-e29b-41d4-a716-446655440000';
        const relationships = new Map<string, string[]>();

        const depth = SessionRelationshipUtils.calculateChainDepth(
          sessionId,
          relationships
        );

        expect(depth).toBe(0);
      });
    });
  });

  describe('Error handling', () => {
    it('should provide meaningful error messages', () => {
      expect(() => validateUUID('invalid')).toThrow('Invalid UUID format');
      expect(() => validateSessionSharingId('')).toThrow('Session sharing ID must be a non-empty string');
      expect(() => extractUUIDFromShareUrl('invalid')).toThrow('Failed to extract UUID from share URL');
    });
  });

  describe('Integration with crypto API', () => {
    it('should work when crypto.randomUUID is available', () => {
      // This test verifies the function works with the native crypto API
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it('should handle missing crypto.randomUUID gracefully', () => {
      // Mock crypto.randomUUID to be undefined
      const originalRandomUUID = global.crypto?.randomUUID;
      
      if (global.crypto) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.crypto as any).randomUUID = undefined;
      }

      try {
        const uuid = generateUUID();
        expect(isValidUUID(uuid)).toBe(true);
      } finally {
        // Restore original function
        if (global.crypto && originalRandomUUID) {
          global.crypto.randomUUID = originalRandomUUID;
        }
      }
    });
  });
});