describe('Activity State Transitions', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the initial load and set up time
    cy.get('[data-testid="time-setup"]').should('be.visible')
    cy.get('#hours').type('1')
    cy.get('[type="submit"]').click()
  })

    // Assume the application starts with four activities named Homework, Reading, Play Time and Chores.
    // We can use these when testing the state transitions.

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

    // Remove second activity
    cy.get('[data-testid="remove-activity-reading"]').click()

    // Remove third activity
    cy.get('[data-testid="remove-activity-play-time"]').click()

    // Now we should see the summary since we completed one and removed the rest
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should reach summary when first removing some, then completing others', () => {
    // Remove second activity
    cy.get('[data-testid="remove-activity-reading"]').click()

    // Remove third activity
    cy.get('[data-testid="remove-activity-play-time"]').click()

    // Verify we're not in summary state yet
    cy.get('[data-testid="summary"]').should('not.exist')

    // Start and complete first activity
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="complete-activity-homework"]').click()

    // Now we should see the summary since we completed one and removed the rest
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should reach summary when completing all activities without removing any', () => {
    // Start and complete first activity
    cy.get('[data-testid="start-activity-homework"]').click()
    cy.get('[data-testid="complete-activity-homework"]').click()

    // Start and complete second activity
    cy.get('[data-testid="start-activity-reading"]').click()
    cy.get('[data-testid="complete-activity-reading"]').click()

    // Start and complete third activity
    cy.get('[data-testid="start-activity-play-time"]').click()
    cy.get('[data-testid="complete-activity-play-time"]').click()

    // Start and complete fourth activity
    cy.get('[data-testid="start-activity-chores"]').click()
    cy.get('[data-testid="complete-activity-chores"]').click()

    // Now we should see the summary
    cy.get('[data-testid="summary"]').should('be.visible')
  })

  it('should reach summary when starting all activities consecutively, then finally completing the last one', () => {
    // Start all activities
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
})