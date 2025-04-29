// Type definitions for Service Worker test mocks

// Augment the global namespace with service worker types
declare global {
  interface Window {
    Request: typeof Request;
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
