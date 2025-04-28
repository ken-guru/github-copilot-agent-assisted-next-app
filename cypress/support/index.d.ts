/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
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
    waitForServiceWorkerRegistration(): Chainable<void>;
  }
}
