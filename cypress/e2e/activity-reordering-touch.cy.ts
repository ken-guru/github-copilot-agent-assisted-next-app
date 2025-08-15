/**
 * End-to-end tests for mobile touch drag-and-drop reordering
 * Tests touch interactions, long press detection, and mobile-specific behaviors
 */

describe('Activity Reordering - Touch Interactions', () => {
  beforeEach(() => {
    // Handle hydration errors from Next.js
    cy.on('uncaught:exception', (err) => {
      // Log all uncaught exceptions for debugging purposes
      console.error('Uncaught exception:', err);
      
      // Ignore specific hydration mismatch errors in development
      if (err.message.includes('Hydration failed')) {
        console.warn('Ignoring expected hydration error in development mode');
        return false;
      }
      
      // Ignore specific minified React errors in production builds
      if (err.message.includes('Minified React error #418')) {
        console.warn('Ignoring expected minified React error in production mode');
        return false;
      }
      
      // Allow all other errors to propagate and fail the test
      return true;
    });

    cy.visit('/');
    
    // Clear any existing data to ensure clean state
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    
    // Wait for page to be fully loaded
    cy.wait(1000);
    
    // Set up activities for testing using the correct selectors
    cy.get('#minutes').focus().clear().type('10');
    cy.contains('button', 'Set Time').click();
    
    // Wait for transition to activity view
    cy.wait(2000);
    
    // Add test activities
    const activities = ['First Activity', 'Second Activity', 'Third Activity'];
    activities.forEach((activityName) => {
      cy.get('[data-testid="activity-form"]').within(() => {
        cy.get('input[type="text"]').clear().type(activityName);
        cy.get('button[type="submit"]').click();
      });
      cy.wait(500);
    });
  });

  describe('Touch Drag and Drop', () => {
    it('should support long press to initiate drag on touch devices', () => {
      // Simulate mobile viewport
      cy.viewport('iphone-x');
      
      // Get the first activity card
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      // Get the third activity card
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .eq(2)
        .as('thirdActivity');
      
      // Perform long press on first activity
      cy.get('@firstActivity').then($el => {
        const element = $el[0];
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Simulate touch start
        cy.wrap(element).trigger('touchstart', {
          touches: [{ clientX: centerX, clientY: centerY }],
          targetTouches: [{ clientX: centerX, clientY: centerY }],
          changedTouches: [{ clientX: centerX, clientY: centerY }]
        });
        
        // Wait for long press duration (500ms)
        cy.wait(600);
        
        // Check if drag state is active (visual feedback)
        cy.get('@firstActivity').should('have.class', 'dragging');
      });
    });

    it('should cancel long press if touch moves too much', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      cy.get('@firstActivity').then($el => {
        const element = $el[0];
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Start touch
        cy.wrap(element).trigger('touchstart', {
          touches: [{ clientX: centerX, clientY: centerY }]
        });
        
        // Move touch beyond threshold (>10px)
        cy.wrap(element).trigger('touchmove', {
          touches: [{ clientX: centerX + 20, clientY: centerY + 20 }]
        });
        
        // Wait past long press duration
        cy.wait(600);
        
        // Should not have drag class
        cy.get('@firstActivity').should('not.have.class', 'dragging');
      });
    });

    it('should perform reordering on successful touch drop', () => {
      cy.viewport('iphone-x');
      
      // Store initial order
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .then($activities => {
          const initialOrder = Array.from($activities).map(el => el.textContent?.trim());
          
          // Get first and third activities
          const firstActivity = $activities[0];
          const thirdActivity = $activities[2];
          
          const firstRect = firstActivity.getBoundingClientRect();
          const thirdRect = thirdActivity.getBoundingClientRect();
          
          const firstCenterX = firstRect.left + firstRect.width / 2;
          const firstCenterY = firstRect.top + firstRect.height / 2;
          const thirdCenterX = thirdRect.left + thirdRect.width / 2;
          const thirdCenterY = thirdRect.top + thirdRect.height / 2;
          
          // Start long press on first activity
          cy.wrap(firstActivity).trigger('touchstart', {
            touches: [{ clientX: firstCenterX, clientY: firstCenterY }]
          });
          
          // Wait for long press
          cy.wait(600);
          
          // Move to third activity position
          cy.wrap(firstActivity).trigger('touchmove', {
            touches: [{ clientX: thirdCenterX, clientY: thirdCenterY }]
          });
          
          // End touch (drop)
          cy.wrap(firstActivity).trigger('touchend', {
            changedTouches: [{ clientX: thirdCenterX, clientY: thirdCenterY }]
          });
          
          // Verify order changed
          cy.get('[data-testid="activity-list"]')
            .find('[data-activity-id]')
            .then($newActivities => {
              const newOrder = Array.from($newActivities).map(el => el.textContent?.trim());
              expect(newOrder).to.not.deep.equal(initialOrder);
              
              // First activity should now be in third position
              expect(newOrder[2]).to.equal(initialOrder[0]);
            });
        });
    });

    it('should provide visual feedback during touch drag', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .eq(1)
        .as('secondActivity');
      
      cy.get('@firstActivity').then($first => {
        const firstElement = $first[0];
        const firstRect = firstElement.getBoundingClientRect();
        const firstCenterX = firstRect.left + firstRect.width / 2;
        const firstCenterY = firstRect.top + firstRect.height / 2;
        
        // Start long press
        cy.wrap(firstElement).trigger('touchstart', {
          touches: [{ clientX: firstCenterX, clientY: firstCenterY }]
        });
        
        // Wait for long press
        cy.wait(600);
        
        // Should have dragging visual feedback
        cy.get('@firstActivity').should('have.class', 'dragging');
        
        // Move over second activity
        cy.get('@secondActivity').then($second => {
          const secondElement = $second[0];
          const secondRect = secondElement.getBoundingClientRect();
          const secondCenterX = secondRect.left + secondRect.width / 2;
          const secondCenterY = secondRect.top + secondRect.height / 2;
          
          cy.wrap(firstElement).trigger('touchmove', {
            touches: [{ clientX: secondCenterX, clientY: secondCenterY }]
          });
          
          // Second activity should have drag-over feedback
          cy.get('@secondActivity').should('have.class', 'drag-over');
        });
        
        // End touch
        cy.wrap(firstElement).trigger('touchend', {
          changedTouches: [{ clientX: firstCenterX, clientY: firstCenterY }]
        });
        
        // Visual feedback should be cleared
        cy.get('@firstActivity').should('not.have.class', 'dragging');
        cy.get('@secondActivity').should('not.have.class', 'drag-over');
      });
    });

    it('should handle touch cancel gracefully', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      cy.get('@firstActivity').then($el => {
        const element = $el[0];
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Start long press
        cy.wrap(element).trigger('touchstart', {
          touches: [{ clientX: centerX, clientY: centerY }]
        });
        
        // Wait for long press
        cy.wait(600);
        
        // Should be dragging
        cy.get('@firstActivity').should('have.class', 'dragging');
        
        // Cancel touch
        cy.wrap(element).trigger('touchcancel');
        
        // Should clear drag state
        cy.get('@firstActivity').should('not.have.class', 'dragging');
      });
    });

    it('should prevent scrolling during touch drag', () => {
      cy.viewport('iphone-x');
      
      // Add more activities to make the list scrollable
      for (let i = 4; i <= 10; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Activity ${i}`);
        cy.get('[data-testid="add-activity-button"]').click();
      }
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      // Get initial scroll position
      cy.window().then(win => {
        const initialScrollY = win.scrollY;
        
        cy.get('@firstActivity').then($el => {
          const element = $el[0];
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Start long press
          cy.wrap(element).trigger('touchstart', {
            touches: [{ clientX: centerX, clientY: centerY }]
          });
          
          // Wait for long press
          cy.wait(600);
          
          // Move touch (this would normally cause scrolling)
          cy.wrap(element).trigger('touchmove', {
            touches: [{ clientX: centerX, clientY: centerY + 100 }]
          });
          
          // Check that scroll position hasn't changed significantly
          cy.window().should(win => {
            expect(Math.abs(win.scrollY - initialScrollY)).to.be.lessThan(50);
          });
          
          // End touch
          cy.wrap(element).trigger('touchend', {
            changedTouches: [{ clientX: centerX, clientY: centerY + 100 }]
          });
        });
      });
    });
  });

  describe('Touch Accessibility', () => {
    it('should maintain keyboard navigation alongside touch support', () => {
      cy.viewport('iphone-x');
      
      // Focus first activity
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .focus();
      
      // Use keyboard to reorder
      cy.focused().type('{ctrl+downarrow}');
      
      // Verify order changed
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .eq(1)
        .should('contain', 'First Activity');
    });

    it('should provide proper ARIA attributes for touch interactions', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .should('have.attr', 'draggable', 'true')
        .should('have.attr', 'role', 'button')
        .should('have.attr', 'tabindex', '0');
    });
  });

  describe('Cross-View Consistency', () => {
    it('should maintain touch reordering across different views', () => {
      cy.viewport('iphone-x');
      
      // Reorder activities using touch
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .then($first => {
          const firstElement = $first[0];
          const firstRect = firstElement.getBoundingClientRect();
          
          cy.get('[data-testid="activity-list"]')
            .find('[data-activity-id]')
            .eq(2)
            .then($third => {
              const thirdElement = $third[0];
              const thirdRect = thirdElement.getBoundingClientRect();
              
              // Perform touch reorder
              cy.wrap(firstElement).trigger('touchstart', {
                touches: [{ 
                  clientX: firstRect.left + firstRect.width / 2, 
                  clientY: firstRect.top + firstRect.height / 2 
                }]
              });
              
              cy.wait(600);
              
              cy.wrap(firstElement).trigger('touchend', {
                changedTouches: [{ 
                  clientX: thirdRect.left + thirdRect.width / 2, 
                  clientY: thirdRect.top + thirdRect.height / 2 
                }]
              });
            });
        });
      
      // Start first activity to go to timer view
      cy.get('[data-testid="activity-list"]')
        .find('[data-testid^="start-activity-"]')
        .first()
        .click();
      
      // Navigate to summary (complete all activities quickly)
      cy.get('[data-testid^="complete-activity-"]').click();
      cy.get('[data-testid^="start-activity-"]').first().click();
      cy.get('[data-testid^="complete-activity-"]').click();
      cy.get('[data-testid^="start-activity-"]').first().click();
      cy.get('[data-testid^="complete-activity-"]').click();
      
      // Check that summary maintains the reordered sequence
      cy.get('[data-testid="summary-view"]').should('be.visible');
      cy.get('[data-testid="completed-activities"]')
        .find('.activity-item')
        .first()
        .should('contain', 'Second Activity'); // First activity should now be in different position
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid touch interactions without breaking', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      // Perform rapid touch start/end cycles
      for (let i = 0; i < 5; i++) {
        cy.get('@firstActivity').then($el => {
          const element = $el[0];
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          cy.wrap(element).trigger('touchstart', {
            touches: [{ clientX: centerX, clientY: centerY }]
          });
          
          cy.wait(50); // Short delay
          
          cy.wrap(element).trigger('touchend', {
            changedTouches: [{ clientX: centerX, clientY: centerY }]
          });
        });
      }
      
      // Should still be functional
      cy.get('@firstActivity').should('be.visible');
      cy.get('[data-testid="activity-list"]').should('be.visible');
    });

    it('should handle multi-touch gracefully', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="activity-list"]')
        .find('[data-activity-id]')
        .first()
        .as('firstActivity');
      
      cy.get('@firstActivity').then($el => {
        const element = $el[0];
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Start multi-touch
        cy.wrap(element).trigger('touchstart', {
          touches: [
            { clientX: centerX, clientY: centerY },
            { clientX: centerX + 50, clientY: centerY + 50 }
          ]
        });
        
        cy.wait(600);
        
        // Should not start dragging with multi-touch
        cy.get('@firstActivity').should('not.have.class', 'dragging');
      });
    });
  });
});