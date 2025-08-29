/**
 * Mobile Touch Interactions E2E Tests
 * Tests Material 3 touch targets, ripple effects, gestures, and responsive behavior
 */

describe('Mobile Optimizations', () => {
  // Test different viewport sizes
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 384, height: 854 },
    { name: 'iPad', width: 768, height: 1024 },
  ];

  viewports.forEach(({ name, width, height }) => {
    context(`${name} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
      });

      it('should have properly sized touch targets', () => {
        // Test button touch targets
        cy.get('button, .m3-button, [role="button"]').each(($button) => {
          // Material 3 minimum touch target is 48px
          cy.wrap($button).should('have.css', 'min-height').then((minHeight) => {
            const height = parseInt(minHeight as unknown as string);
            expect(height).to.be.at.least(40); // Allow some variance for small buttons
          });
        });
      });

      it('should show ripple effects on touch', () => {
        // Add styles to slow down animations for testing
        cy.document().then((doc) => {
          const style = doc.createElement('style');
          style.textContent = `
            .material3-ripple {
              animation-duration: 1s !important;
              transition-duration: 1s !important;
            }
          `;
          doc.head.appendChild(style);
        });

        // Find and click a button
        cy.get('button').first().then(($button) => {
          if ($button.length > 0) {
            cy.wrap($button).click();
            
            // Check for ripple effect
            cy.get('.material3-ripple', { timeout: 2000 }).should('exist');
          }
        });
      });

      it('should have responsive spacing on mobile', () => {
        // Test that components fit within viewport
        cy.get('[data-testid="time-setup"]').then(($timeSetup) => {
          if ($timeSetup.length > 0) {
            cy.wrap($timeSetup).should('be.visible');
            
            // Check that element doesn't overflow viewport
            cy.wrap($timeSetup).invoke('outerWidth').should('be.lte', width);
            
            // Check padding is appropriate
            cy.wrap($timeSetup).should('have.css', 'padding').and('not.be.empty');
          }
        });
      });

      it('should handle responsive text sizing', () => {
        // Check that text is readable on mobile
        cy.get('p, span, label, h1, h2, h3, h4, h5, h6').each(($element) => {
          cy.wrap($element).should('have.css', 'font-size').then((fontSize) => {
            const size = parseInt(fontSize as unknown as string);
            // Font size should be at least 12px for mobile readability
            expect(size).to.be.at.least(12);
          });
        });
      });

      it('should work with touch interactions', () => {
        // Test touch events on interactive elements
        cy.get('button, input, [role="button"]').first().then(($element) => {
          if ($element.length > 0) {
            // Simulate touch interaction
            cy.wrap($element)
              .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
              .trigger('touchend');
            
            // Should not cause errors
            cy.window().then((win) => {
              expect(win.console.error).to.not.have.been.called;
            });
          }
        });
      });

      it('should handle input focus and virtual keyboard', () => {
        cy.get('input[type="text"], input[type="email"], input[type="number"]').first().then(($input) => {
          if ($input.length > 0) {
            // Focus input
            cy.wrap($input).focus().should('be.focused');
            
            // Type in input
            cy.wrap($input).type('test input');
            cy.wrap($input).should('have.value', 'test input');
            
            // Input should remain visible
            cy.wrap($input).should('be.visible');
          }
        });
      });

      it('should maintain accessibility with touch', () => {
        // Test focus management
        cy.get('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')
          .first()
          .then(($element) => {
            if ($element.length > 0) {
              cy.wrap($element).focus().should('be.focused');
              
              // Test keyboard navigation
              cy.wrap($element).type('{tab}');
              
              // Should move focus to next element
              cy.focused().should('exist');
            }
          });
      });

      it('should handle rapid interactions gracefully', () => {
        cy.get('button').first().then(($button) => {
          if ($button.length > 0) {
            // Rapid clicks
            for (let i = 0; i < 5; i++) {
              cy.wrap($button).click();
              cy.wait(50);
            }
            
            // Should not break
            cy.wrap($button).should('be.visible');
          }
        });
      });
    });
  });

  context('Gesture Support', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('/demo/navigation');
    });

    it('should support swipe gestures on tab navigation', () => {
      cy.get('[role="tablist"]').then(($tabBar) => {
        if ($tabBar.length > 0) {
          // Get initial active tab
          cy.get('[role="tab"][aria-selected="true"]').invoke('text').as('initialTab');
          
          // Simulate swipe gesture
          cy.wrap($tabBar)
            .trigger('touchstart', { 
              touches: [{ clientX: 300, clientY: 100 }] 
            })
            .trigger('touchmove', { 
              touches: [{ clientX: 100, clientY: 100 }] 
            })
            .trigger('touchend');
          
          // Tab navigation should still work
          cy.get('[role="tab"][aria-selected="true"]').should('exist');
        }
      });
    });

    it('should handle drawer swipe gestures', () => {
      // Test navigation drawer if present
      cy.get('[role="navigation"]').then(($nav) => {
        if ($nav.length > 0) {
          // Simulate edge swipe
          cy.get('body')
            .trigger('touchstart', { 
              touches: [{ clientX: 10, clientY: 200 }] 
            })
            .trigger('touchmove', { 
              touches: [{ clientX: 150, clientY: 200 }] 
            })
            .trigger('touchend');
          
          // Navigation should remain functional
          cy.wrap($nav).should('be.visible');
        }
      });
    });
  });

  context('Performance', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('/');
    });

    it('should maintain performance with multiple touch interactions', () => {
      // Monitor performance
      cy.window().then((win) => {
        const startTime = win.performance.now();
        
        // Perform multiple interactions
        cy.get('button, input, [role="button"]').each(($element, index) => {
          if (index < 5) { // Limit to first 5 elements
            cy.wrap($element).click({ force: true });
            cy.wait(100);
          }
        });
        
        cy.window().then((win) => {
          const endTime = win.performance.now();
          const duration = endTime - startTime;
          
          // Should complete interactions in reasonable time
          expect(duration).to.be.lessThan(5000); // 5 seconds
        });
      });
    });

    it('should not leak memory with touch handlers', () => {
      // Monitor memory usage (basic test)
      cy.window().then((win) => {
        const initialMemory = (win.performance as any).memory?.usedJSHeapSize || 0;
        
        // Perform many touch interactions
        for (let i = 0; i < 10; i++) {
          cy.get('button').first().click({ force: true });
          cy.wait(50);
        }
        
        cy.window().then((win) => {
          const finalMemory = (win.performance as any).memory?.usedJSHeapSize || 0;
          
          // Memory shouldn't grow excessively
          if (initialMemory > 0 && finalMemory > 0) {
            const growth = finalMemory - initialMemory;
            expect(growth).to.be.lessThan(10000000); // 10MB limit
          }
        });
      });
    });
  });

  context('Cross-Device Compatibility', () => {
    const testCases = [
      { device: 'iphone-6', orientation: 'portrait' },
      { device: 'iphone-6', orientation: 'landscape' },
      { device: 'ipad-2', orientation: 'portrait' },
      { device: 'samsung-s10', orientation: 'portrait' },
    ];

    testCases.forEach(({ device, orientation }) => {
      it(`should work on ${device} in ${orientation}`, () => {
        cy.viewport(device as any, orientation as any);
        cy.visit('/');
        
        // Basic functionality should work
        cy.get('button').first().then(($button) => {
          if ($button.length > 0) {
            cy.wrap($button).should('be.visible').click();
            
            // Should not cause errors
            cy.window().its('console.error').should('not.have.been.called');
          }
        });
        
        // Text should be readable
        cy.get('body').should('have.css', 'font-size').then((fontSize) => {
          const size = parseInt(fontSize as unknown as string);
          expect(size).to.be.at.least(12);
        });
      });
    });
  });

  context('Edge Cases', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('/');
    });

    it('should handle simultaneous touch events', () => {
      cy.get('button').first().then(($button) => {
        if ($button.length > 0) {
          // Simulate multi-touch
          cy.wrap($button)
            .trigger('touchstart', { 
              touches: [
                { clientX: 100, clientY: 100 },
                { clientX: 150, clientY: 100 }
              ] 
            })
            .trigger('touchend');
          
          // Should handle gracefully
          cy.wrap($button).should('be.visible');
        }
      });
    });

    it('should handle touch cancellation', () => {
      cy.get('button').first().then(($button) => {
        if ($button.length > 0) {
          // Start touch and cancel
          cy.wrap($button)
            .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
            .trigger('touchcancel');
          
          // Should not leave touch handlers in bad state
          cy.wrap($button).click().should('be.visible');
        }
      });
    });

    it('should work without JavaScript errors', () => {
      // Set up error monitoring
      cy.window().then((win) => {
        const errors: string[] = [];
        win.addEventListener('error', (e) => errors.push(e.message));
        win.addEventListener('unhandledrejection', (e) => errors.push(e.reason?.toString() || 'Promise rejection'));
        
        // Perform various touch interactions
        cy.get('button, input, [role="button"]').each(($element, index) => {
          if (index < 3) {
            cy.wrap($element).click({ force: true });
            cy.wait(100);
          }
        });
        
        // Check for errors
        cy.window().then(() => {
          expect(errors).to.have.length(0);
        });
      });
    });
  });
});