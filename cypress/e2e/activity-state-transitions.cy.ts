describe('Activity State Transitions', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the initial load and set up time (SETUP state)
    cy.get('[data-testid="time-setup"]').should('be.visible')
    cy.get('#hours').type('1')
    cy.get('[type="submit"]').click()
  })

  it('should support planning state functionality', () => {
    // Verify we can add activities in planning state
    cy.get('[data-testid="activity-input"]').should('be.visible')
    cy.get('[data-testid="start-activities"]').should('be.disabled')

    // Add activities
    cy.get('[data-testid="activity-input"]').type('Test Activity 1{enter}')
    cy.get('[data-testid="start-activities"]').should('not.be.disabled')
    cy.get('[data-testid="activity-input"]').type('Test Activity 2{enter}')

    // Verify activities were added
    cy.get('[data-testid="activity-test-activity-1"]').should('exist')
    cy.get('[data-testid="activity-test-activity-2"]').should('exist')

    // Start activities to move to ACTIVITY state
    cy.get('[data-testid="start-activities"]').click()
  })

  it('should not show summary until all activities are properly handled', () => {
    // Add activities in Planning state
    cy.get('[data-testid="activity-input"]').type('Homework{enter}')
    cy.get('[data-testid="activity-input"]').type('Reading{enter}')
    cy.get('[data-testid="activity-input"]').type('Play Time{enter}')
    cy.get('[data-testid="activity-input"]').type('Chores{enter}')

    // Start activities and wait for transition
    cy.get('[data-testid="start-activities"]').click()
    cy.get('[data-testid="start-activity-homework"]').should('exist')

    // Start and complete first activity
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="complete-activity-homework"]').click()

    // Verify we're not in summary state yet
    cy.get('[data-testid="summary"]').should('not.exist')

    // Start and complete second activity
    cy.get('[data-testid="start-activity-reading"]').click()
    cy.get('[data-testid="complete-activity-reading"]').click()

    // Verify we're still not in summary state
    cy.get('[data-testid="summary"]').should('not.exist')

    // Start and complete third and fourth activity
    cy.get('[data-testid="start-activity-play-time"]').click()
    cy.get('[data-testid="complete-activity-play-time"]').click()
    cy.get('[data-testid="start-activity-chores"]').click()
    cy.get('[data-testid="complete-activity-chores"]').click()

    // Now we should see the summary
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should reach summary when some activities are completed and others removed', () => {
    // Add activities in Planning state
    cy.get('[data-testid="activity-input"]').type('Homework{enter}')
    cy.get('[data-testid="activity-input"]').type('Reading{enter}')
    cy.get('[data-testid="activity-input"]').type('Play Time{enter}')
    cy.get('[data-testid="activity-input"]').type('Chores{enter}')

    // Start activities and wait for transition
    cy.get('[data-testid="start-activities"]').click()
    cy.get('[data-testid="start-activity-homework"]').should('exist')

    // Start and complete first activity
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="complete-activity-homework"]').click()

    // Verify we're not in summary state yet
    cy.get('[data-testid="summary"]').should('not.exist')

    // Remove remaining activities
    cy.get('[data-testid="remove-activity-reading"]').click()
    cy.get('[data-testid="remove-activity-play-time"]').click()
    cy.get('[data-testid="remove-activity-chores"]').click()

    // Now we should see the summary since we completed one and removed the rest
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should reach summary when first removing some, then completing others', () => {
    // Add activities in Planning state
    cy.get('[data-testid="activity-input"]').type('Homework{enter}')
    cy.get('[data-testid="activity-input"]').type('Reading{enter}')
    cy.get('[data-testid="activity-input"]').type('Play Time{enter}')
    cy.get('[data-testid="activity-input"]').type('Chores{enter}')

    // Start activities and wait for transition
    cy.get('[data-testid="start-activities"]').click()
    cy.get('[data-testid="start-activity-homework"]').should('exist')

    // Remove some activities first
    cy.get('[data-testid="remove-activity-reading"]').click()
    cy.get('[data-testid="remove-activity-play-time"]').click()
    cy.get('[data-testid="remove-activity-chores"]').click()

    // Verify we're not in summary state yet
    cy.get('[data-testid="summary"]').should('not.exist')

    // Start and complete remaining activity
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="complete-activity-homework"]').click()

    // Now we should see the summary
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should reach summary when completing all activities without removing any', () => {
    // Add activities in Planning state
    cy.get('[data-testid="activity-input"]').type('Homework{enter}')
    cy.get('[data-testid="activity-input"]').type('Reading{enter}')
    cy.get('[data-testid="activity-input"]').type('Play Time{enter}')
    cy.get('[data-testid="activity-input"]').type('Chores{enter}')

    // Start activities and wait for transition
    cy.get('[data-testid="start-activities"]').click()
    cy.get('[data-testid="start-activity-homework"]').should('exist')

    // Start and complete all activities
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="complete-activity-homework"]').click()
    cy.get('[data-testid="start-activity-reading"]').click()
    cy.get('[data-testid="complete-activity-reading"]').click()
    cy.get('[data-testid="start-activity-play-time"]').click()
    cy.get('[data-testid="complete-activity-play-time"]').click()
    cy.get('[data-testid="start-activity-chores"]').click()
    cy.get('[data-testid="complete-activity-chores"]').click()

    // Now we should see the summary
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should not show summary when all activities are removed without completion', () => {
    // Add activities in Planning state
    cy.get('[data-testid="activity-input"]').type('Homework{enter}')
    cy.get('[data-testid="activity-input"]').type('Reading{enter}')
    cy.get('[data-testid="activity-input"]').type('Play Time{enter}')
    cy.get('[data-testid="activity-input"]').type('Chores{enter}')

    // Start activities and wait for transition
    cy.get('[data-testid="start-activities"]').click()
    cy.get('[data-testid="start-activity-homework"]').should('exist')

    // Remove all activities without completing any
    cy.get('[data-testid="remove-activity-homework"]').click()
    cy.get('[data-testid="remove-activity-reading"]').click()
    cy.get('[data-testid="remove-activity-play-time"]').click()
    cy.get('[data-testid="remove-activity-chores"]').click()

    // Verify we're not in summary state
    cy.get('[data-testid="summary"]').should('not.exist')
  })
})