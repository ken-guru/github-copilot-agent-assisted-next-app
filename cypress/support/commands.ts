/// <reference types="cypress" />
// Import the type definitions
/// <reference path="./index.d.ts" />

/**
 * Sets the navigator.onLine property to true and triggers an online event
 */
Cypress.Commands.add('setOnline', () => {
  cy.log('Setting browser to online mode');
  cy.window().then((win) => {
    Object.defineProperty(win.navigator, 'onLine', { value: true });
    win.dispatchEvent(new win.Event('online'));
  });
});

/**
 * Sets the navigator.onLine property to false and triggers an offline event
 */
Cypress.Commands.add('setOffline', () => {
  cy.log('Setting browser to offline mode');
  cy.window().then((win) => {
    Object.defineProperty(win.navigator, 'onLine', { value: false });
    win.dispatchEvent(new win.Event('offline'));
  });
});

/**
 * Waits for the service worker to be registered and controlling the page
 * with a configurable timeout
 */
Cypress.Commands.add('waitForServiceWorkerRegistration', (timeoutMs = 10000) => {
  cy.log('Waiting for service worker registration');
  
  // Define the timeout for service worker registration
  const startTime = Date.now();
  
  cy.window().then((win) => {
    return new Promise((resolve, reject) => {
      // If service worker already controlling the page
      if (win.navigator.serviceWorker.controller) {
        cy.log('Service worker already controlling the page');
        resolve(win.navigator.serviceWorker.controller);
        return;
      }
      
      // Setup listener for controllerchange event
      const onControllerChange = () => {
        cy.log('Service worker controller changed');
        win.navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        resolve(win.navigator.serviceWorker.controller);
      };
      
      win.navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      
      // Set up timeout to avoid hanging
      const checkInterval = setInterval(() => {
        if (win.navigator.serviceWorker.controller) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          cy.log('Service worker controller detected during interval check');
          win.navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          resolve(win.navigator.serviceWorker.controller);
        } else if (Date.now() - startTime > timeoutMs) {
          clearInterval(checkInterval);
          cy.log('Service worker registration timed out - forcing resolve');
          win.navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          resolve(null); // Resolve with null to indicate timeout
        }
      }, 500);
      
      // Also set an explicit timeout
      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        cy.log('Service worker registration timed out - forcing resolve');
        win.navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        resolve(null); // Resolve with null to indicate timeout
      }, timeoutMs);
    });
  });
});
