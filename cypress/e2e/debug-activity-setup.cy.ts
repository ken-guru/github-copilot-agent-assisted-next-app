/**
 * Debug test to understand the application flow
 */

describe('Debug Activity Setup', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Hydration failed') || err.message.includes('Minified React error #418')) {
        return false;
      }
      return true;
    });

    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.wait(1000);
  });

  it('should debug the application setup flow', () => {
    // Check what's on the page initially
    cy.get('body').should('be.visible');
    
    // Take a screenshot to see what's there
    cy.screenshot('initial-page');
    
    // Look for time setup elements
    cy.get('h5').should('contain', 'Set Time');
    cy.get('#minutes').should('be.visible');
    
    // Set time
    cy.get('#minutes').focus().clear().type('5');
    cy.contains('button', 'Set Time').click();
    
    // Wait and take another screenshot
    cy.wait(3000);
    cy.screenshot('after-time-set');
    
    // Check what elements are now visible
    cy.get('body').then($body => {
      const html = $body.html();
      cy.log('Page HTML after time set:', html);
    });
    
    // Look for any elements that might be the activity manager
    cy.get('[data-testid]').each($el => {
      const testId = $el.attr('data-testid');
      cy.log(`Found element with data-testid: ${testId}`);
    });
    
    // Check if activity manager appears
    cy.get('[data-testid="activity-manager"]', { timeout: 10000 }).should('be.visible');
  });
});