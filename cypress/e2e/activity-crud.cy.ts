describe('Activity CRUD Operations', () => {
  beforeEach(() => {
    // Handle hydration errors from Next.js and React 19
    cy.on('uncaught:exception', (err) => {
      // Log all uncaught exceptions for debugging purposes
      console.error('Uncaught exception:', err);
      
      // Ignore specific hydration mismatch errors
      // These occur due to theme initialization script and service worker registration
      if (err.message.includes('Hydration failed')) {
        console.warn('Ignoring expected hydration error');
        return false;
      }
      
      // Ignore specific minified React errors in production builds
      // React 19 may have additional error codes
      if (err.message.includes('Minified React error #418') || 
          err.message.includes('Minified React error #423') ||
          err.message.includes('Minified React error #425')) {
        console.warn('Ignoring expected minified React error');
        return false;
      }
      
      // Ignore React 19 text content mismatch errors
      if (err.message.includes('Text content does not match') ||
          err.message.includes('did not match')) {
        console.warn('Ignoring text content mismatch error');
        return false;
      }
      
      // Allow all other errors to propagate and fail the test
      return true;
    });
    
    // Visit activities page but do NOT clear localStorage
    // This allows data to persist across navigation tests
    cy.visit('/activities');
  });

  // Helper function to clear localStorage for tests that need a clean state
  const clearLocalStorageForFreshState = () => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
  };

  describe('Core E2E User Workflows', () => {
    it('should verify activities page loads and basic functionality exists', () => {
      // Clear localStorage for this test to ensure a clean state
      clearLocalStorageForFreshState();
      
      // Verify the page loads with expected structure
      cy.contains('Your Activities').should('be.visible');
      cy.contains('Add Activity').should('be.visible');
      
      // Verify essential UI elements with default activities present
      cy.get('button').contains('Import').should('be.visible');
      cy.get('button').contains('Export').should('be.visible');
      cy.get('button').contains('Reset Activities').should('be.visible');
      
      // This is a high-level smoke test - detailed CRUD testing should be in Jest
    });
  });

  describe('Import/Export Workflows', () => {
    beforeEach(() => {
      // Clear localStorage to ensure a clean state for each export/import test
      clearLocalStorageForFreshState();
      
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
      // Click visible Activities link (first one - desktop nav, or only one on mobile)
      cy.get('[href="/activities"]:visible').first().click();
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
      cy.get('[href="/activities"]:visible').first().click();
      
      // Verify activity persists
      cy.contains('Navigation Test Activity').should('be.visible');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle empty activity list gracefully', () => {
      // Clear localStorage and set empty state for this specific test
      cy.window().then((win) => {
        win.localStorage.clear();
        win.localStorage.setItem('activities_v1', '[]');
      });
      cy.reload();

      // Should show empty state with toolbar actions available (except Export)
      cy.contains('No activities found').should('be.visible');
      cy.get('button').contains('Add Activity').should('be.visible');
      cy.get('button').contains('Import').should('be.visible');
      cy.get('button').contains('Reset Activities').should('be.visible');
      cy.get('button').contains('Export').should('not.exist');
    });

    it('should handle modal interactions correctly', () => {
      // This test doesn't require a clean state, so data from previous tests can persist
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
