describe('Basic page functionality', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/')
  })

  it('should load the homepage successfully', () => {
    // Check that the page loaded without errors
    cy.get('body').should('be.visible')
  })

  it('should have the correct title', () => {
    // Check the page title
    cy.title().should('include', 'Next.js')
  })

  it('should navigate to another page if available', () => {
    // Try to find and click any navigation link
    cy.get('a').first().click({ force: true })
    
    // Verify URL changed
    cy.url().should('not.eq', Cypress.config().baseUrl + '/')
  })
})
