// Type definitions for Service Worker test mocks

// Augment the global namespace with service worker types
declare global {
  interface Window {
    Request: typeof Request;
  }
  
  /**
   * Minimal CookieStoreManager typing used by tests to satisfy DOM lib updates.
   * If the DOM lib already provides this, interface merging will extend it safely.
   */
  interface CookieStoreManager {
    get(name: string): Promise<unknown>;
    set(...args: unknown[]): Promise<void>;
    delete(...args: unknown[]): Promise<void>;
    subscribe(...args: unknown[]): Promise<void>;
    unsubscribe(...args: unknown[]): Promise<void>;
    getSubscriptions(): Promise<unknown[]>;
  }
  
  interface MockRequest extends Request {
    cache?: string;
    credentials?: RequestCredentials;
    destination?: RequestDestination;
    headers?: Headers;
    integrity?: string;
    keepalive?: boolean;
    method?: string;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    url: string;
  }
}

export {};
