/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Set browser to online mode
     * @example cy.setOnline()
     */
    setOnline(): Chainable<void>;
    
    /**
     * Set browser to offline mode
     * @example cy.setOffline()
     */
    setOffline(): Chainable<void>;
    
    /**
     * Wait for service worker registration to complete
     * @example cy.waitForServiceWorkerRegistration()
     */
    waitForServiceWorkerRegistration(timeoutMs?: number): Chainable<void>;
  }
}

// Add window.ServiceWorkerUpdaterAPI for Cypress tests
interface Window {
  ServiceWorkerUpdaterAPI?: {
    setUpdateAvailable: (value: boolean) => void;
  };
  Cypress?: unknown;
}
