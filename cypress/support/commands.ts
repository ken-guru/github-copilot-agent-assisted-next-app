/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Check if a service worker is registered
       * @example cy.isServiceWorkerRegistered()
       */
      isServiceWorkerRegistered(): Chainable<boolean>;

      /**
       * Wait for service worker to be registered
       * @example cy.waitForServiceWorkerRegistration()
       */
      waitForServiceWorkerRegistration(): Chainable<void>;

      /**
       * Set the network condition to offline
       * @example cy.setOffline()
       */
      setOffline(): Chainable<void>;

      /**
       * Set the network condition to online
       * @example cy.setOnline()
       */
      setOnline(): Chainable<void>;

      /**
       * Unregister all service workers
       * @example cy.unregisterServiceWorkers()
       */
      unregisterServiceWorkers(): Chainable<void>;
    }
  }
}

// Command to check if service worker is registered
Cypress.Commands.add('isServiceWorkerRegistered', () => {
  return cy.window().then(win => {
    return !!win.navigator.serviceWorker.controller;
  });
});

// Command to wait for service worker to be registered
Cypress.Commands.add('waitForServiceWorkerRegistration', () => {
  return cy.window().then(win => {
    return new Cypress.Promise((resolve) => {
      if (win.navigator.serviceWorker.controller) {
        resolve();
      } else {
        const checkInterval = setInterval(() => {
          if (win.navigator.serviceWorker.controller) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 500);
        
        // Set a timeout to prevent infinite loops
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(); // Resolve anyway to prevent test hanging
        }, 10000);
      }
    });
  });
});

// Command to set network to offline
Cypress.Commands.add('setOffline', () => {
  return cy.window().then(win => {
    // Use Chrome DevTools Protocol if available (in Chrome)
    if (Cypress.isBrowser('chrome')) {
      // @ts-ignore - Using undocumented Cypress API
      return Cypress.automation('remote:debugger:protocol', {
        command: 'Network.enable'
      }).then(() => {
        // @ts-ignore
        return Cypress.automation('remote:debugger:protocol', {
          command: 'Network.emulateNetworkConditions',
          params: {
            offline: true,
            latency: 0,
            downloadThroughput: 0,
            uploadThroughput: 0
          }
        });
      });
    } else {
      // Fallback - override navigator.onLine (less reliable)
      cy.log('Using fallback offline mode - not in Chrome');
      Object.defineProperty(win.navigator, 'onLine', {
        get: () => false,
        configurable: true
      });
      win.dispatchEvent(new win.Event('offline'));
    }
  });
});

// Command to set network to online
Cypress.Commands.add('setOnline', () => {
  return cy.window().then(win => {
    // Use Chrome DevTools Protocol if available (in Chrome)
    if (Cypress.isBrowser('chrome')) {
      // @ts-ignore - Using undocumented Cypress API
      return Cypress.automation('remote:debugger:protocol', {
        command: 'Network.enable'
      }).then(() => {
        // @ts-ignore
        return Cypress.automation('remote:debugger:protocol', {
          command: 'Network.emulateNetworkConditions',
          params: {
            offline: false,
            latency: 0,
            downloadThroughput: -1,
            uploadThroughput: -1
          }
        });
      });
    } else {
      // Fallback - override navigator.onLine
      cy.log('Using fallback online mode - not in Chrome');
      Object.defineProperty(win.navigator, 'onLine', {
        get: () => true,
        configurable: true
      });
      win.dispatchEvent(new win.Event('online'));
    }
  });
});

// Command to unregister all service workers
Cypress.Commands.add('unregisterServiceWorkers', () => {
  return cy.window().then(async win => {
    const registrations = await win.navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
    }
    
    return registrations.length;
  });
});

export {}