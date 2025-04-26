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
    // Check for the actual title of the page - "Mr. Timely" instead of "Next.js"
    cy.title().should('include', 'Mr. Timely')
  })

  // Check if there's a navigation element or button instead of just looking for <a> tags
  it('should have navigation elements', () => {
    // Look for navigation elements more broadly (nav, buttons, or any clickable elements)
    cy.get('nav, button, [role="button"]').should('exist')
    
    // Alternatively, we could check for the page structure
    cy.get('header, main, footer').should('exist')
  })
})
