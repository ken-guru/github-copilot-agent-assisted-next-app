describe('Simplified Activity Form', () => {
  beforeEach(() => {
    cy.visit('/');
    // Set up time first - required to see activity management
    // Use more specific selector for the duration input in TimeSetup
    cy.get('[data-testid="time-setup"]').within(() => {
      cy.get('input[type="number"]').first().clear().type('30');
      cy.get('button').contains('Start').click();
    });
  });

  it('shows full form when no activity is selected', () => {
    // Should show all form fields when no activity is running
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('be.visible');
      cy.get('button[id="activityColor"]').should('be.visible');
    });
  });

  it('shows simplified form when activity is selected', () => {
    // First add and select an activity
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').type('Test Activity');
      cy.get('button[type="submit"]').click();
    });

    // Click on the activity to select it
    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Test Activity').click();
    });

    // Now the form should be simplified - only name field visible
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('not.exist');
      cy.get('button[id="activityColor"]').should('not.exist');
    });
  });

  it('allows adding quick activities with simplified form', () => {
    // First add and select an activity to get simplified form
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').type('Initial Activity');
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Initial Activity').click();
    });

    // Add another activity using simplified form
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').type('Quick Activity');
      cy.get('button[type="submit"]').click();
    });

    // Verify the quick activity was added to the list
    cy.get('[data-testid="activity-list"]').within(() => {
      cy.contains('Quick Activity').should('exist');
    });
  });

  it('shows full form again when no activity is running', () => {
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

    // Form should be full again
    cy.get('[data-testid="activity-form-column"]').within(() => {
      cy.get('input[id="activityName"]').should('be.visible');
      cy.get('input[id="activityDescription"]').should('be.visible');
      cy.get('button[id="activityColor"]').should('be.visible');
    });
  });
});
