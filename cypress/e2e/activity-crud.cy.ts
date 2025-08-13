describe('Activity CRUD Operations', () => {
  beforeEach(() => {
    // Handle hydration errors from Next.js
    cy.on('uncaught:exception', (err, runnable) => {
      // Log all uncaught exceptions for debugging purposes
      console.error('Uncaught exception:', err);
      
      // Ignore specific hydration mismatch errors in development
      if (err.message.includes('Hydration failed')) {
        console.warn('Ignoring expected hydration error in development mode');
        return false;
      }
      
      // Ignore specific minified React errors in production builds
      if (err.message.includes('Minified React error #418')) {
        console.warn('Ignoring expected minified React error in production mode');
        return false;
      }
      
      // Allow all other errors to propagate and fail the test
      return true;
    });
    
    cy.visit('/activities');
    // Clear any existing data
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Core E2E User Workflows', () => {
    it('should verify activities page loads and basic functionality exists', () => {
      // Verify the page loads with expected structure
      cy.contains('Your Activities').should('be.visible');
      cy.contains('Add Activity').should('be.visible');
      
  // Verify essential UI elements in empty state
  cy.get('button').contains('Import').should('be.visible');
  cy.get('button').contains('Reset Activities').should('be.visible');
  cy.get('button').contains('Export').should('not.exist');
      
      // This is a high-level smoke test - detailed CRUD testing should be in Jest
    });
  });

  describe('Import/Export Workflows', () => {
    beforeEach(() => {
      // Create test data for export
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Export Test Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      
      // Wait for success toast
      cy.get('[data-testid="toast-notification"]').should('be.visible');
      cy.get('[data-testid="toast-message"]').should('contain', 'created successfully');
    });

    it('should complete export workflow', () => {
      cy.get('button').contains('Export').click();
      
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('Export Activities').should('be.visible');
      cy.contains('Download activities.json').should('be.visible');
      
      // Close export dialog
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Close').click();
      });
      
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should open import workflow', () => {
      cy.get('button').contains('Import').click();
      
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('Import Activities').should('be.visible');
      cy.get('input[type="file"]').should('exist');
      
      // Cancel import
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Cancel').click();
      });
      
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Navigation Integration', () => {
    it('should navigate to activities page from home', () => {
      cy.visit('/');
      cy.get('[href="/activities"]').click();
      cy.url().should('include', '/activities');
      cy.contains('Your Activities').should('be.visible');
    });

    it('should maintain data across navigation', () => {
      // Create activity
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Navigation Test Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      
      // Wait for success toast
      cy.get('[data-testid="toast-notification"]').should('be.visible');
      cy.get('[data-testid="toast-message"]').should('contain', 'created successfully');
      
      // Navigate away and back
      cy.visit('/');
      cy.get('[href="/activities"]').click();
      
      // Verify activity persists
      cy.contains('Navigation Test Activity').should('be.visible');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle empty activity list gracefully', () => {
      // Ensure clean state
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      cy.reload();
      
      // Should show empty state
  cy.contains('No activities found').should('be.visible');
      cy.get('button').contains('Add Activity').should('be.visible');
    });

    it('should handle modal interactions correctly', () => {
      // Test modal opening and closing
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').should('be.visible');
      
      // Test escape key functionality
      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
      
      // Test cancel button
      cy.contains('Add Activity').click();
      cy.get('button').contains('Cancel').click();
      cy.get('[role="dialog"]').should('not.exist');
    });
  });
});
