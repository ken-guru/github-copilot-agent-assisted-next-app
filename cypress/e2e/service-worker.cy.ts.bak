/// <reference types="cypress" />

describe('Service Worker Functionality', () => {
  beforeEach(() => {
    // Prevent uncaught exceptions from failing tests
    cy.on('uncaught:exception', () => false);
    
    // Start with online mode and clear any existing service workers
    cy.setOnline();
    
    // Set up console spies
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
      cy.spy(win.console, 'error').as('consoleError');
    });
  });

  it('should register the service worker', () => {
    cy.visit('/');
    // Wait for initial load
    cy.window().then((win) => {
      // Ensure we're starting fresh
      cy.wrap(win.navigator.serviceWorker.getRegistrations())
        .then((registrations) => {
          return Promise.all(registrations.map(r => r.unregister()));
        });
    });
    
    // Now wait for new registration
    cy.waitForServiceWorkerRegistration();
    cy.window().then((win) => {
      cy.wrap(win.navigator.serviceWorker.getRegistration()).should('exist');
    });
  });

  it('should handle network offline state', () => {
    cy.visit('/');
    cy.waitForServiceWorkerRegistration();
    
    // Verify we start without offline indicator
    cy.get('[data-testid="offline-indicator"]').should('not.exist');
    
    // Switch to offline mode
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'));
      Object.defineProperty(win.navigator, 'onLine', { value: false, configurable: true });
    });
    
    // Verify offline indicator appears
    cy.get('[data-testid="offline-indicator"]', { timeout: 2000 }).should('be.visible');
  });

  it('should handle transition from offline to online', () => {
    // Set initial offline state first
    cy.visit('/').then((win) => {
      // Set offline state and dispatch event
      Object.defineProperty(win.navigator, 'onLine', { value: false, configurable: true });
      win.dispatchEvent(new Event('offline'));
      
      // Wait for page to recognize offline state
      cy.get('[data-testid="offline-indicator"]', { timeout: 2000 }).should('be.visible').then(() => {
        // Once we've confirmed offline state, switch to online
        Object.defineProperty(win.navigator, 'onLine', { value: true, configurable: true });
        win.dispatchEvent(new Event('online'));
        
        // Verify offline indicator disappears
        cy.get('[data-testid="offline-indicator"]').should('not.exist');
      });
    });
  });

  it('should show update notification when a new service worker is available', () => {
    // Intercept service worker script requests
    cy.intercept('/service-worker.js').as('swRequest');
    
    cy.visit('/');
    cy.wait('@swRequest');
    
    // Wait for initial component mount
    cy.get('main').should('exist');
    
    // Simulate service worker update available
    cy.window().then((win) => {
      // First ensure we have an active service worker
      Object.defineProperty(win.navigator.serviceWorker, 'controller', {
        value: {
          state: 'activated',
          addEventListener: () => {}
        },
        configurable: true
      });

      // Then simulate the update available event
      win.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable', {
        detail: { message: 'A new version is available. Please refresh to update.' }
      }));
    });

    // Wait for notification with increased timeout
    cy.get('[data-testid="update-notification"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="update-notification-message"]')
      .should('contain.text', 'A new version is available');
    
    // Verify dismissal works
    cy.get('[data-testid="update-notification-dismiss"]').click();
    cy.get('[data-testid="update-notification"]').should('not.exist');
  });
});