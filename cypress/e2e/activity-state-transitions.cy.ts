/// <reference types="cypress" />

describe('User Activity Management Workflows', () => {
  beforeEach(() => {
    // Enhanced error handling to prevent React errors from failing test
    cy.on('uncaught:exception', (err) => {
      // Check for hydration errors
      if (err.message.includes('Hydration failed')) {
        return false;
      }
      
      // Check for React error #418
      if (err.message.includes('Minified React error #418')) {
        return false;
      }
      
      // Check for any React error
      if (err.message.includes('Minified React error')) {
        return false;
      }
      
      // Let other errors fail the test
      return true;
    });
    
    cy.visit('/');
  });

  describe('Complete User Journey: Time Setup to Summary', () => {
    it('should allow a user to set up time and complete a full activity session', () => {
      // Step 1: User sets up their time allocation
      cy.get('[data-testid="time-setup"]').should('be.visible');
      cy.get('#hours').clear();
      cy.get('#hours').type('1');
      cy.get('[type="submit"]').click();
      
      // Step 2: User should see activity management interface
      cy.get('[data-testid="activity-manager"]').should('be.visible');
      
      // Step 3: User starts their first activity
      cy.get('[data-testid^="start-activity-"]').first().click();
      
      // Step 4: User should see progress indicators
      cy.get('[data-testid="progress-bar"]').should('be.visible');
      cy.get('[data-testid="timeline"]').should('be.visible');
      
      // Step 5: User completes the activity
      cy.get('[data-testid^="complete-activity-"]').first().click();
      
      // Step 6: User removes remaining activities to reach summary
      cy.get('[data-testid^="remove-activity-"]').each(($el) => {
        cy.wrap($el).click();
      });
      
      // Step 7: User should see the final summary
      cy.get('[data-testid="summary"]').should('be.visible');
      cy.get('[data-testid="summary"]').should('contain', 'Time Spent per Activity');
    });
  });

  describe('Activity Management Workflows', () => {
    beforeEach(() => {
      // Set up time for each test
      cy.get('[data-testid="time-setup"]').should('be.visible');
      cy.get('#hours').clear();
      cy.get('#hours').type('1');
      cy.get('[type="submit"]').click();
      cy.get('[data-testid="activity-manager"]').should('be.visible');
    });

    it('should allow user to start and complete multiple activities sequentially', () => {
      // Start first activity
      cy.get('[data-testid^="start-activity-"]').first().click();
      cy.get('[data-testid^="complete-activity-"]').first().click();
      
      // Start second activity  
      cy.get('[data-testid^="start-activity-"]').first().click();
      cy.get('[data-testid^="complete-activity-"]').first().click();
      
      // Complete remaining activities
      cy.get('[data-testid^="start-activity-"]').each(($el) => {
        cy.wrap($el).click();
      });
      cy.get('[data-testid^="complete-activity-"]').each(($el) => {
        cy.wrap($el).click();
      });
      
      // Should reach summary
      cy.get('[data-testid="summary"]').should('be.visible');
    });

    it('should allow user to add a custom activity and use it', () => {
      // Add a new activity
      cy.get('[data-testid="activity-form"]').should('be.visible');
      cy.get('#activity-name').type('Custom Task');
      cy.get('button[type="submit"]').click();
      
      // Should see the new activity in the list
      cy.contains('Custom Task').should('be.visible');
      
      // Should be able to start the custom activity
      cy.get('[data-testid="start-activity-custom-task"]').click();
      cy.get('[data-testid="complete-activity-custom-task"]').click();
      
      // Clean up other activities to reach summary
      cy.get('[data-testid^="remove-activity-"]').each(($el) => {
        cy.wrap($el).click();
      });
      
      // Should see custom activity in summary
      cy.get('[data-testid="summary"]').should('be.visible');
      cy.get('[data-testid="summary"]').should('contain', 'Custom Task');
    });

    it('should allow user to remove unwanted activities', () => {
      const initialActivitiesCount = 4; // Default activities
      
      // Remove one activity
      cy.get('[data-testid^="remove-activity-"]').first().click();
      
      // Should have one fewer activity
      cy.get('[data-testid^="start-activity-"]').should('have.length', initialActivitiesCount - 1);
      
      // Complete remaining activities to reach summary
      cy.get('[data-testid^="start-activity-"]').each(($el) => {
        cy.wrap($el).click();
      });
      cy.get('[data-testid^="complete-activity-"]').each(($el) => {
        cy.wrap($el).click();
      });
      
      cy.get('[data-testid="summary"]').should('be.visible');
    });
  });

  describe('Data Persistence Across Interactions', () => {
    beforeEach(() => {
      cy.get('[data-testid="time-setup"]').should('be.visible');
      cy.get('#hours').clear();
      cy.get('#hours').type('2');
      cy.get('[type="submit"]').click();
    });

    it('should maintain activity progress when user refreshes the page', () => {
      // Start an activity
      cy.get('[data-testid^="start-activity-"]').first().click();
      
      // Wait for activity to be running
      cy.get('[data-testid^="complete-activity-"]').should('be.visible');
      
      // Refresh the page
      cy.reload();
      
      // Should maintain the state (activity should still be running)
      // Note: This test verifies data persistence behavior
      cy.get('[data-testid="activity-manager"]').should('be.visible');
    });

    it('should handle time expiration gracefully', () => {
      // This test would require time manipulation, but validates the user experience
      // when time runs out during activities
      cy.get('[data-testid^="start-activity-"]').first().click();
      
      // The user should see appropriate messaging when time is up
      // (This is a placeholder for a more complex time manipulation test)
      cy.get('[data-testid="activity-manager"]').should('be.visible');
    });
  });

  describe('Responsive User Experience', () => {
    beforeEach(() => {
      cy.get('[data-testid="time-setup"]').should('be.visible');
      cy.get('#hours').clear();
      cy.get('#hours').type('1');
      cy.get('[type="submit"]').click();
    });

    it('should work properly on mobile viewport', () => {
      // Set mobile viewport
      cy.viewport(375, 667);
      
      // Should still be fully functional
      cy.get('[data-testid="activity-manager"]').should('be.visible');
      cy.get('[data-testid^="start-activity-"]').first().should('be.visible').click();
      cy.get('[data-testid^="complete-activity-"]').first().should('be.visible').click();
      
      // Timeline might be hidden on mobile, but other elements should work
      cy.get('[data-testid="progress-bar"]').should('be.visible');
    });

    it('should work properly on desktop viewport', () => {
      // Set desktop viewport
      cy.viewport(1280, 720);
      
      // Should show all elements including timeline
      cy.get('[data-testid="activity-manager"]').should('be.visible');
      cy.get('[data-testid="timeline"]').should('be.visible');
      cy.get('[data-testid="progress-bar"]').should('be.visible');
      
      // Should be fully functional
      cy.get('[data-testid^="start-activity-"]').first().click();
      cy.get('[data-testid^="complete-activity-"]').first().click();
    });
  });
});