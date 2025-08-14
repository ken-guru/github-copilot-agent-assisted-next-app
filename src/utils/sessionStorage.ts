/**
 * Session storage utilities for IndexedDB with localStorage fallback
 */

import { PersistedSession, SessionStorage } from '@/types/session';

/**
 * IndexedDB-based session storage implementation
 */
class IndexedDBSessionStorage implements SessionStorage {
  private readonly dbName = 'MrTimelyDB';
  private readonly dbVersion = 1;
  private readonly storeName = 'sessions';
  private readonly sessionKey = 'current-session';

  async saveSession(session: PersistedSession): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('IndexedDB is not available');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const putRequest = store.put(session, this.sessionKey);
        
        putRequest.onerror = () => reject(new Error('Failed to save session to IndexedDB'));
        putRequest.onsuccess = () => {
          db.close();
          resolve();
        };
      };
    });
  }

  async loadSession(): Promise<PersistedSession | null> {
    if (!this.isAvailable()) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);

        const getRequest = store.get(this.sessionKey);
        
        getRequest.onerror = () => reject(new Error('Failed to load session from IndexedDB'));
        getRequest.onsuccess = () => {
          db.close();
          resolve(getRequest.result || null);
        };
      };
    });
  }

  async clearSession(): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const deleteRequest = store.delete(this.sessionKey);
        
        deleteRequest.onerror = () => reject(new Error('Failed to clear session from IndexedDB'));
        deleteRequest.onsuccess = () => {
          db.close();
          resolve();
        };
      };
    });
  }

  isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'indexedDB' in window && indexedDB !== null;
    } catch {
      return false;
    }
  }

  getStorageType(): string {
    return 'IndexedDB';
  }
}

/**
 * localStorage-based session storage implementation (fallback)
 */
class LocalStorageSessionStorage implements SessionStorage {
  private readonly storageKey = 'mr-timely-current-session';

  async saveSession(session: PersistedSession): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      const compressed = this.compressSession(session);
      localStorage.setItem(this.storageKey, compressed);
    } catch (error) {
      throw new Error(`Failed to save session to localStorage: ${error}`);
    }
  }

  async loadSession(): Promise<PersistedSession | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return null;
      }
      
      return this.decompressSession(data);
    } catch (error) {
      console.error('Failed to load session from localStorage:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    if (this.isAvailable()) {
      localStorage.removeItem(this.storageKey);
    }
  }

  isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      
      // Test localStorage functionality
      const testKey = '__mr-timely-storage-test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getStorageType(): string {
    return 'localStorage';
  }

  /**
   * Compress session data for efficient localStorage storage
   */
  private compressSession(session: PersistedSession): string {
    // Simple compression: remove unnecessary whitespace from JSON
    return JSON.stringify(session);
  }

  /**
   * Decompress session data from localStorage
   */
  private decompressSession(data: string): PersistedSession {
    return JSON.parse(data);
  }
}

/**
 * Factory function to get the best available session storage
 */
export function createSessionStorage(): SessionStorage {
  const indexedDBStorage = new IndexedDBSessionStorage();
  const localStorageStorage = new LocalStorageSessionStorage();

  // Prefer IndexedDB over localStorage for better capacity and performance
  if (indexedDBStorage.isAvailable()) {
    return indexedDBStorage;
  }
  
  if (localStorageStorage.isAvailable()) {
    return localStorageStorage;
  }

  // Fallback to a no-op storage if neither is available
  return {
    async saveSession(): Promise<void> {
      console.warn('No storage available for session persistence');
    },
    async loadSession(): Promise<PersistedSession | null> {
      return null;
    },
    async clearSession(): Promise<void> {
      // No-op
    },
    isAvailable(): boolean {
      return false;
    },
    getStorageType(): string {
      return 'none';
    }
  };
}

/**
 * Utility functions for session storage management
 */
export const sessionStorageUtils = {
  /**
   * Check if a session is within recovery time window
   */
  isSessionRecoverable(session: PersistedSession, maxAge: number): boolean {
    const now = Date.now();
    const sessionTime = new Date(session.lastSaved).getTime();
    return (now - sessionTime) <= maxAge;
  },

  /**
   * Format session age for display
   */
  formatSessionAge(session: PersistedSession): string {
    const now = Date.now();
    const sessionTime = new Date(session.lastSaved).getTime();
    const ageMs = now - sessionTime;
    
    const minutes = Math.floor(ageMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  },

  /**
   * Format elapsed time for display
   */
  formatElapsedTime(elapsedSeconds: number): string {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  /**
   * Clean up old sessions (for future use)
   */
  async cleanupOldSessions(storage: SessionStorage, maxAge: number): Promise<void> {
    // For now, we only store one current session
    // This could be extended in the future to handle multiple sessions
    const session = await storage.loadSession();
    if (session && !sessionStorageUtils.isSessionRecoverable(session, maxAge)) {
      await storage.clearSession();
    }
  }
};
