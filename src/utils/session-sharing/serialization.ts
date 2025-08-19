/**
 * Session data serialization and deserialization utilities
 * @see .kiro/specs/shareable-session-summary/design.md
 */

import { SessionSummaryData, StoredSession, SessionMetadata } from '@/types/session-sharing';
import { validateSessionForSharing } from '@/utils/security/validation';
import { generateUUID } from '@/utils/uuid';

/**
 * Serialization error class
 */
export class SerializationError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'SerializationError';
  }
}

/**
 * Serialize session data for storage
 */
export function serializeSessionData(
  sessionData: SessionSummaryData,
  options: {
    userAgent?: string;
    expirationDays?: number;
  } = {}
): StoredSession {
  try {
    // Validate and sanitize the session data
    const validatedData = validateSessionForSharing(sessionData);
    
    // Generate metadata
    const now = new Date();
    const expirationDays = options.expirationDays || 90;
    const expiresAt = new Date(now.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    
    const metadata: SessionMetadata = {
      id: generateUUID(),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      version: '1.0.0',
      userAgent: options.userAgent
    };
    
    const storedSession: StoredSession = {
      sessionData: validatedData,
      metadata
    };
    
    // Validate the complete stored session structure
    validateStoredSession(storedSession);
    
    return storedSession;
  } catch (error) {
    if (error instanceof Error) {
      throw new SerializationError(`Failed to serialize session data: ${error.message}`, error);
    }
    throw new SerializationError('Failed to serialize session data: Unknown error');
  }
}

/**
 * Deserialize session data from storage
 */
export function deserializeSessionData(data: unknown): StoredSession {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid session data: not an object');
    }
    
    // Basic structure validation
    const sessionObj = data as Record<string, unknown>;
    
    if (!sessionObj.sessionData || typeof sessionObj.sessionData !== 'object') {
      throw new Error('Invalid session data: missing sessionData');
    }
    
    if (!sessionObj.metadata || typeof sessionObj.metadata !== 'object') {
      throw new Error('Invalid session data: missing metadata');
    }
    
    // Validate the complete stored session structure
    const storedSession = sessionObj as unknown as StoredSession;
    validateStoredSession(storedSession);
    
    return storedSession;
  } catch (error) {
    if (error instanceof Error) {
      throw new SerializationError(`Failed to deserialize session data: ${error.message}`, error);
    }
    throw new SerializationError('Failed to deserialize session data: Unknown error');
  }
}/**

 * Validate stored session structure
 */
function validateStoredSession(storedSession: StoredSession): void {
  // Validate session data
  validateSessionForSharing(storedSession.sessionData);
  
  // Validate metadata
  const metadata = storedSession.metadata;
  
  if (!metadata.id || typeof metadata.id !== 'string') {
    throw new Error('Invalid metadata: missing or invalid id');
  }
  
  if (!metadata.createdAt || typeof metadata.createdAt !== 'string') {
    throw new Error('Invalid metadata: missing or invalid createdAt');
  }
  
  if (!metadata.expiresAt || typeof metadata.expiresAt !== 'string') {
    throw new Error('Invalid metadata: missing or invalid expiresAt');
  }
  
  if (!metadata.version || typeof metadata.version !== 'string') {
    throw new Error('Invalid metadata: missing or invalid version');
  }
  
  // Validate timestamps
  try {
    const createdAt = new Date(metadata.createdAt);
    const expiresAt = new Date(metadata.expiresAt);
    
    if (isNaN(createdAt.getTime())) {
      throw new Error('Invalid createdAt timestamp');
    }
    
    if (isNaN(expiresAt.getTime())) {
      throw new Error('Invalid expiresAt timestamp');
    }
    
    if (expiresAt <= createdAt) {
      throw new Error('Expiration date must be after creation date');
    }
  } catch (error) {
    throw new Error(`Invalid timestamp format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a session has expired
 */
export function isSessionExpired(metadata: SessionMetadata): boolean {
  try {
    const expiresAt = new Date(metadata.expiresAt);
    const now = new Date();
    
    // Check if the date is invalid
    if (isNaN(expiresAt.getTime())) {
      return true;
    }
    
    return now > expiresAt;
  } catch {
    // If we can't parse the expiration date, consider it expired for safety
    return true;
  }
}

/**
 * Convert session data to JSON string with error handling
 */
export function sessionToJSON(storedSession: StoredSession): string {
  try {
    return JSON.stringify(storedSession);
  } catch (error) {
    if (error instanceof Error) {
      throw new SerializationError(`Failed to convert session to JSON: ${error.message}`, error);
    }
    throw new SerializationError('Failed to convert session to JSON: Unknown error');
  }
}

/**
 * Parse session data from JSON string with error handling
 */
export function sessionFromJSON(jsonString: string): StoredSession {
  try {
    const parsed = JSON.parse(jsonString);
    return deserializeSessionData(parsed);
  } catch (error) {
    if (error instanceof SerializationError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new SerializationError(`Failed to parse session from JSON: ${error.message}`, error);
    }
    throw new SerializationError('Failed to parse session from JSON: Unknown error');
  }
}