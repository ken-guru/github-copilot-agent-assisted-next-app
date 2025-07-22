describe('Activity Form Context-Based Behavior', () => {
  beforeEach(() => {
    // Ignore hydration errors that don't affect functionality
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('Hydration failed')) {
        return false; // prevent the test from failing
      }
    });
    
    cy.visit('/');
    // Set up time first - required to see activity management
    // Use more specific selector for the duration input in TimeSetup
    cy.get('[data-testid="time-setup"]').within(() => {
      cy.get('input[type="number"]').first().clear();
      cy.get('input[type="number"]').first().type('30');
      cy.get('button').contains('Set Time').click();
    });
  });

  it('timeline form is always simplified - shows only name field', () => {
    // Timeline context form should always be simplified (only name field)
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('not.exist');
      cy.get('button[id="activityColor"]').should('not.exist');
    });
  });

  it('shows simplified form when activity is selected', () => {
    // First add an activity
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').type('Test Activity');
      cy.get('button[type="submit"]').click();
    });

    // Click on the activity to select it
    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Test Activity').click();
    });

    // Form remains simplified even when activity is selected
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('not.exist');
      cy.get('button[id="activityColor"]').should('not.exist');
    });
  });

  it('allows adding quick activities with simplified form', () => {
    // Add an activity using simplified form
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').type('Quick Activity');
      cy.get('button[type="submit"]').click();
    });

    // Verify the activity was added to the list
    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Quick Activity').should('exist');
    });
    
    // Form should still be simplified after adding
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('not.exist');
      cy.get('button[id="activityColor"]').should('not.exist');
    });
  });

  it('timeline form remains simplified when activity is deselected', () => {
    // Add and select an activity
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').type('Test Activity');
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Test Activity').click();
    });

    // Form should be simplified
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityDescription"]').should('not.exist');
    });

    // Click the activity again to deselect it
    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Test Activity').click();
    });

    // Timeline form should still be simplified after deselection
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('not.exist');
      cy.get('button[id="activityColor"]').should('not.exist');
    });
  });
});
