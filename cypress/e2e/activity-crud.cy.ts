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
    it('should complete full CRUD workflow', () => {
      // Create
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Integration Test Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Integration Test Activity').should('be.visible');
      
      // Read
      cy.contains('Integration Test Activity').should('be.visible');
      
      // Update
      cy.get('button').contains('Edit').first().click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().clear().type('Updated Integration Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Updated Integration Activity').should('be.visible');
      
      // Delete
      cy.get('button').contains('Delete').first().click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete').click();
      });
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Updated Integration Activity').should('not.exist');
    });

    it('should handle multiple activities workflow', () => {
      // Create multiple activities
      const activities = ['Activity 1', 'Activity 2', 'Activity 3'];
      
      activities.forEach(activity => {
        cy.contains('Add Activity').click();
        cy.get('[role="dialog"]').within(() => {
          cy.get('input[type="text"]').first().type(activity);
        });
        cy.get('button').contains('Save').click();
        cy.get('[role="dialog"]').should('not.exist');
      });
      
      // Verify all are visible
      activities.forEach(activity => {
        cy.contains(activity).should('be.visible');
      });
      
      // Delete first one
      cy.get('button').contains('Delete').first().click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete').click();
      });
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify remaining activities exist
      cy.get('button').contains('Delete').should('have.length.at.least', 1);
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
      cy.contains('No activities yet').should('be.visible');
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
