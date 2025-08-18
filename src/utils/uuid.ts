/**
 * UUID generation and validation utilities
 * @see .kiro/specs/shareable-session-summary/design.md
 */

import { UUIDSchema } from './security/validation';

/**
 * Generate a cryptographically secure UUID v4
 * Uses crypto.randomUUID() when available, falls back to a secure alternative
 */
export function generateUUID(): string {
  // Use native crypto.randomUUID if available (modern browsers and Node.js 16+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  // This should not happen in modern environments, but provides a safety net
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Generate UUID v4 using crypto.getRandomValues
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version (4) and variant bits according to RFC 4122
    bytes[6] = (bytes[6]! & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8]! & 0x3f) | 0x80; // Variant 10

    // Convert to hex string with proper formatting
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  }

  // Final fallback (should never be reached in production)
  throw new Error('No secure random number generator available');
}

/**
 * Validate UUID format using Zod schema
 * @param uuid - The UUID string to validate
 * @returns The validated UUID string
 * @throws Error if UUID format is invalid
 */
export function validateUUID(uuid: string): string {
  const result = UUIDSchema.safeParse(uuid);
  if (!result.success) {
    throw new Error(`Invalid UUID format: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Check if a string is a valid UUID without throwing
 * @param uuid - The string to check
 * @returns true if valid UUID, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const result = UUIDSchema.safeParse(uuid);
  return result.success;
}

/**
 * Generate a session sharing ID (UUID v4)
 * This is a wrapper around generateUUID with additional validation
 */
export function generateSessionSharingId(): string {
  const uuid = generateUUID();
  
  // Validate the generated UUID (should never fail, but good for safety)
  validateUUID(uuid);
  
  return uuid;
}

/**
 * Validate and normalize a session sharing ID
 * @param sessionId - The session sharing ID to validate
 * @returns The normalized session sharing ID
 * @throws Error if session ID is invalid
 */
export function validateSessionSharingId(sessionId: string): string {
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('Session sharing ID must be a non-empty string');
  }

  const trimmed = sessionId.trim();
  if (!trimmed) {
    throw new Error('Session sharing ID cannot be empty');
  }

  return validateUUID(trimmed);
}

/**
 * Extract UUID from a share URL
 * @param shareUrl - The complete share URL
 * @returns The extracted UUID
 * @throws Error if URL format is invalid or UUID cannot be extracted
 */
export function extractUUIDFromShareUrl(shareUrl: string): string {
  try {
    const url = new URL(shareUrl);
    const pathParts = url.pathname.split('/');
    
    // Expected format: /shared/{uuid}
    if (pathParts.length >= 3 && pathParts[1] === 'shared') {
      const uuid = pathParts[2];
      if (uuid) {
        return validateUUID(uuid);
      }
    }
    
    throw new Error('Invalid share URL format');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract UUID from share URL: ${error.message}`);
    }
    throw new Error('Failed to extract UUID from share URL');
  }
}

/**
 * Generate a share URL for a given UUID
 * @param baseUrl - The base URL of the application
 * @param sessionId - The session UUID
 * @returns The complete share URL
 */
export function generateShareUrl(baseUrl: string, sessionId: string): string {
  const validatedSessionId = validateSessionSharingId(sessionId);
  
  // Validate base URL format
  if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '') {
    throw new Error('Base URL must be a non-empty string');
  }

  try {
    // Validate that baseUrl is a valid URL with HTTP/HTTPS protocol
    const parsedBaseUrl = new URL(baseUrl);
    
    if (!['http:', 'https:'].includes(parsedBaseUrl.protocol)) {
      throw new Error('Base URL must use HTTP or HTTPS protocol');
    }
    
    const url = new URL('/shared/' + validatedSessionId, baseUrl);
    return url.toString();
  } catch (error) {
    throw new Error(`Failed to generate share URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * UUID utilities for session relationships
 */
export class SessionRelationshipUtils {
  /**
   * Validate that a session can be linked to another (prevent circular references)
   * @param sourceSessionId - The session that will have a new derived session
   * @param targetSessionId - The session that will be derived from source
   * @param existingRelationships - Map of existing session relationships (sessionId -> derivedSessionIds)
   * @returns true if linking is safe, false if it would create a circular reference
   */
  static canLinkSessions(
    sourceSessionId: string,
    targetSessionId: string,
    existingRelationships: Map<string, string[]>
  ): boolean {
    const validatedSource = validateSessionSharingId(sourceSessionId);
    const validatedTarget = validateSessionSharingId(targetSessionId);

    // Cannot link to self
    if (validatedSource === validatedTarget) {
      return false;
    }

    // Check if target already has source in its derivation chain
    // This would create a circular reference if we link source -> target
    const visited = new Set<string>();
    const stack = [validatedTarget];

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      
      // If target's chain leads back to source, linking would create a cycle
      if (current === validatedSource) {
        return false;
      }

      // Follow the derivation chain from current session
      const derived = existingRelationships.get(current) || [];
      stack.push(...derived);
    }

    return true;
  }

  /**
   * Calculate the depth of a session chain
   * @param sessionId - The session ID to calculate depth for
   * @param relationships - Map of session relationships (sessionId -> derivedSessionIds)
   * @returns The depth of the session chain
   */
  static calculateChainDepth(
    sessionId: string,
    relationships: Map<string, string[]>
  ): number {
    const validatedSessionId = validateSessionSharingId(sessionId);
    const visited = new Set<string>();
    let maxDepth = 0;

    function dfs(currentId: string, depth: number): void {
      if (visited.has(currentId)) {
        return;
      }
      
      visited.add(currentId);
      maxDepth = Math.max(maxDepth, depth);

      const derived = relationships.get(currentId) || [];
      for (const derivedId of derived) {
        dfs(derivedId, depth + 1);
      }
    }

    dfs(validatedSessionId, 0);
    return maxDepth;
  }
}