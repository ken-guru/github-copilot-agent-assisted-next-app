describe('Activity State Transitions', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the initial load and set up time (SETUP state)
    cy.get('[data-testid="time-setup"]').should('be.visible')
    cy.get('#hours').type('1')
    cy.get('[type="submit"]').click()

    // Add activities in Planning state
    cy.get('[data-testid="activity-input"]').type('Homework{enter}')
    cy.get('[data-testid="activity-input"]').type('Reading{enter}')
    cy.get('[data-testid="activity-input"]').type('Play Time{enter}')
    cy.get('[data-testid="activity-input"]').type('Chores{enter}')

    // Start activities (transition to ACTIVITY state)
    cy.get('[data-testid="start-activities"]').click()
  })

  it('should not show summary until all activities are properly handled', () => {
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

  it('should reach summary when starting all activities consecutively, then finally completing the last one', () => {
    // Start all activities in sequence (they auto-complete when the next one starts)
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="start-activity-reading"]').click()
    cy.get('[data-testid="start-activity-play-time"]').click()
    cy.get('[data-testid="start-activity-chores"]').click()

    // Verify we're not in summary state yet
    cy.get('[data-testid="summary"]').should('not.exist')

    // Complete the last activity
    cy.get('[data-testid="complete-activity-chores"]').click()

    // Now we should see the summary
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should not show summary when all activities are removed without completion', () => {
    // Remove all activities without completing any
    cy.get('[data-testid="remove-activity-homework"]').click()
    cy.get('[data-testid="remove-activity-reading"]').click()
    cy.get('[data-testid="remove-activity-play-time"]').click()
    cy.get('[data-testid="remove-activity-chores"]').click()

    // Verify we're not in summary state
    cy.get('[data-testid="summary"]').should('not.exist')
  })

  it('should support planning state functionality', () => {
    // We're already in ACTIVITY state from beforeEach, so let's start fresh
    cy.visit('/')

    // Set up time
    cy.get('[data-testid="time-setup"]').should('be.visible')
    cy.get('#hours').type('1')
    cy.get('[type="submit"]').click()

    // Verify we can add activities in planning state
    cy.get('[data-testid="activity-input"]').should('be.visible')
    cy.get('[data-testid="start-activities"]').should('be.disabled')

    // Add activities
    cy.get('[data-testid="activity-input"]').type('Test Activity 1{enter}')
    cy.get('[data-testid="start-activities"]').should('not.be.disabled')
    cy.get('[data-testid="activity-input"]').type('Test Activity 2{enter}')

    // Verify activities can be reordered
    cy.get('[data-testid="activity-test-activity-1"]').trigger('dragstart')
    cy.get('[data-testid="activity-test-activity-2"]').trigger('drop')

    // Start activities to move to ACTIVITY state
    cy.get('[data-testid="start-activities"]').click()

    // Verify we can't add more activities in ACTIVITY state
    cy.get('[data-testid="activity-input"]').should('not.exist')
  })
})