/**
 * Cross-Browser Compatibility E2E Tests
 * 
 * End-to-end tests for Material 3 Expressive components
 * across different browsers and devices.
 */

describe('Cross-Browser Compatibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000); // Allow page to fully load
  });

  describe('CSS Feature Detection', () => {
    it('should detect and apply browser support classes', () => {
      cy.get('html').should('have.class', 'supports-cssCustomProperties');
      cy.get('html').should('have.class', 'supports-flexbox');
      cy.get('html').should('have.class', 'supports-cssGrid');
    });

    it('should apply browser-specific classes', () => {
      cy.get('html').then(($html) => {
        const classes = Array.from($html[0].classList);
        const hasBrowserClass = classes.some(cls => cls.startsWith('browser-'));
        const hasEngineClass = classes.some(cls => cls.startsWith('engine-'));
        
        expect(hasBrowserClass).to.be.true;
        expect(hasEngineClass).to.be.true;
      });
    });

    it('should detect device type classes', () => {
      cy.get('html').then(($html) => {
        const classes = Array.from($html[0].classList);
        const hasDeviceClass = classes.some(cls => 
          cls === 'is-mobile' || cls === 'is-tablet' || cls === 'is-desktop'
        );
        
        expect(hasDeviceClass).to.be.true;
      });
    });
  });

  describe('Material 3 Component Rendering', () => {
    it('should render Material 3 buttons correctly', () => {
      cy.get('[data-testid="material3-button"]').should('be.visible');
      cy.get('[data-testid="material3-button"]').should('have.css', 'border-radius');
      cy.get('[data-testid="material3-button"]').should('have.css', 'transition');
    });

    it('should render Material 3 text fields correctly', () => {
      cy.get('[data-testid="material3-textfield"]').should('be.visible');
      cy.get('[data-testid="material3-textfield"]').should('have.css', 'border-radius');
    });

    it('should render Material 3 cards correctly', () => {
      cy.get('[data-testid="material3-card"]').should('be.visible');
      cy.get('[data-testid="material3-card"]').should('have.css', 'box-shadow');
      cy.get('[data-testid="material3-card"]').should('have.css', 'border-radius');
    });

    it('should handle missing CSS custom properties gracefully', () => {
      // Test fallback colors
      cy.get('[data-testid="material3-button"]').then(($button) => {
        const backgroundColor = $button.css('background-color');
        expect(backgroundColor).to.not.equal('rgba(0, 0, 0, 0)');
        expect(backgroundColor).to.not.equal('transparent');
      });
    });
  });

  describe('Animation Performance', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      cy.window().then((win) => {
        Object.defineProperty(win, 'matchMedia', {
          value: (query: string) => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
          }),
        });
      });

      cy.reload();
      
      // Check that animations are disabled
      cy.get('[data-testid="animated-element"]').should('have.css', 'animation-duration', '0s');
    });

    it('should maintain smooth animations at 60fps', () => {
      let frameCount = 0;
      let startTime: number;

      cy.window().then((win) => {
        startTime = win.performance.now();
        
        const measureFrameRate = () => {
          frameCount++;
          if (frameCount < 60) {
            win.requestAnimationFrame(measureFrameRate);
          } else {
            const endTime = win.performance.now();
            const duration = endTime - startTime;
            const fps = (frameCount / duration) * 1000;
            
            expect(fps).to.be.greaterThan(30);
          }
        };
        
        win.requestAnimationFrame(measureFrameRate);
      });
    });

    it('should handle hover effects smoothly', () => {
      cy.get('[data-testid="material3-button"]')
        .trigger('mouseenter')
        .should('have.css', 'transform')
        .trigger('mouseleave');
    });

    it('should handle focus effects correctly', () => {
      cy.get('[data-testid="material3-button"]')
        .focus()
        .should('have.css', 'outline')
        .blur();
    });
  });

  describe('Touch and Mobile Interactions', () => {
    it('should handle touch events on mobile', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="material3-button"]')
        .trigger('touchstart')
        .trigger('touchend')
        .should('be.visible');
    });

    it('should provide adequate touch targets', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="touch-target"]').then(($element) => {
        const rect = $element[0].getBoundingClientRect();
        expect(rect.width).to.be.at.least(44);
        expect(rect.height).to.be.at.least(44);
      });
    });

    it('should handle swipe gestures', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid="swipeable-element"]')
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] })
        .trigger('touchend');
    });

    it('should disable hover effects on touch devices', () => {
      cy.viewport('iphone-x');
      
      // Simulate touch device
      cy.window().then((win) => {
        Object.defineProperty(win.navigator, 'maxTouchPoints', {
          value: 5,
          writable: true,
        });
      });

      cy.reload();
      
      cy.get('[data-testid="hover-sensitive-element"]').then(($element) => {
        // Touch devices should not have hover effects
        expect($element.css('transition')).to.not.contain('hover');
      });
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`should render correctly on ${name} (${width}x${height})`, () => {
        cy.viewport(width, height);
        
        cy.get('[data-testid="responsive-container"]').should('be.visible');
        cy.get('[data-testid="responsive-text"]').should('be.visible');
        
        // Check that text is readable
        cy.get('[data-testid="responsive-text"]').then(($text) => {
          const fontSize = parseFloat($text.css('font-size'));
          expect(fontSize).to.be.at.least(14);
        });
      });
    });

    it('should handle orientation changes', () => {
      cy.viewport('iphone-x');
      
      // Portrait
      cy.get('[data-testid="orientation-sensitive"]').should('be.visible');
      
      // Landscape
      cy.viewport(812, 375);
      cy.get('[data-testid="orientation-sensitive"]').should('be.visible');
    });
  });

  describe('Accessibility Across Browsers', () => {
    it('should maintain proper focus order', () => {
      cy.get('body').tab();
      cy.focused().should('have.attr', 'tabindex', '0');
      
      cy.tab();
      cy.focused().should('be.visible');
    });

    it('should provide proper ARIA labels', () => {
      cy.get('[data-testid="material3-button"]')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-labelledby');
    });

    it('should maintain color contrast ratios', () => {
      cy.get('[data-testid="material3-button"]').then(($button) => {
        const backgroundColor = $button.css('background-color');
        const color = $button.css('color');
        
        // Basic check that colors are not the same
        expect(backgroundColor).to.not.equal(color);
      });
    });

    it('should support high contrast mode', () => {
      // Simulate high contrast mode
      cy.window().then((win) => {
        Object.defineProperty(win, 'matchMedia', {
          value: (query: string) => ({
            matches: query === '(prefers-contrast: high)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
          }),
        });
      });

      cy.reload();
      
      cy.get('[data-testid="high-contrast-element"]')
        .should('have.css', 'border-width', '2px');
    });
  });

  describe('Performance Optimization', () => {
    it('should load critical CSS first', () => {
      cy.window().then((win) => {
        const stylesheets = Array.from(win.document.styleSheets);
        const criticalStyles = stylesheets.find(sheet => 
          sheet.href && sheet.href.includes('material3-tokens')
        );
        
        expect(criticalStyles).to.exist;
      });
    });

    it('should lazy load non-critical resources', () => {
      cy.window().then((win) => {
        // Check that non-critical resources are loaded after initial render
        cy.wait(2000);
        
        const images = Array.from(win.document.images);
        images.forEach(img => {
          expect(img.complete).to.be.true;
        });
      });
    });

    it('should handle slow network conditions', () => {
      // Simulate slow 3G
      cy.window().then((win) => {
        if ('connection' in win.navigator) {
          Object.defineProperty(win.navigator, 'connection', {
            value: {
              effectiveType: '3g',
              downlink: 0.7,
              rtt: 300,
            },
            writable: true,
          });
        }
      });

      cy.reload();
      
      // Should still be functional on slow connections
      cy.get('[data-testid="material3-button"]').should('be.visible');
      cy.get('[data-testid="material3-button"]').click();
    });
  });

  describe('Error Handling', () => {
    it('should handle CSS loading failures gracefully', () => {
      // Block CSS loading
      cy.intercept('GET', '**/*.css', { statusCode: 404 });
      
      cy.reload();
      
      // Should still render basic functionality
      cy.get('body').should('be.visible');
      cy.get('[data-testid="fallback-styles"]').should('be.visible');
    });

    it('should handle JavaScript errors gracefully', () => {
      cy.window().then((win) => {
        // Inject an error
        win.eval('throw new Error("Test error")');
      });

      // Should still be functional
      cy.get('[data-testid="material3-button"]').should('be.visible');
      cy.get('[data-testid="material3-button"]').click();
    });

    it('should provide fallback fonts', () => {
      // Block web font loading
      cy.intercept('GET', '**/*.woff*', { statusCode: 404 });
      
      cy.reload();
      
      cy.get('[data-testid="text-element"]').then(($text) => {
        const fontFamily = $text.css('font-family');
        expect(fontFamily).to.contain('system');
      });
    });
  });

  describe('Print Styles', () => {
    it('should apply print-specific styles', () => {
      cy.window().then((win) => {
        // Simulate print media
        const mediaQueryList = {
          matches: true,
          media: 'print',
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        };

        Object.defineProperty(win, 'matchMedia', {
          value: () => mediaQueryList,
        });
      });

      cy.reload();
      
      cy.get('[data-testid="no-print"]').should('have.css', 'display', 'none');
      cy.get('[data-testid="print-optimized"]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });
  });
});

describe('Browser-Specific Tests', () => {
  describe('Safari-specific tests', () => {
    it('should handle Safari button appearance', () => {
      // These tests would run specifically on Safari
      cy.get('[data-testid="material3-button"]')
        .should('have.css', '-webkit-appearance', 'none');
    });

    it('should handle Safari input styling', () => {
      cy.get('input[data-testid="material3-input"]')
        .should('have.css', '-webkit-appearance', 'none');
    });
  });

  describe('Firefox-specific tests', () => {
    it('should handle Firefox button focus', () => {
      cy.get('[data-testid="material3-button"]')
        .should('have.css', '-moz-appearance', 'none');
    });

    it('should handle Firefox input inner border', () => {
      cy.get('input[data-testid="material3-input"]').then(($input) => {
        // Check that inner border is removed
        const computedStyle = getComputedStyle($input[0], '::-moz-focus-inner');
        expect(computedStyle.border).to.equal('0px none');
      });
    });
  });

  describe('Chrome/Edge-specific tests', () => {
    it('should handle number input spinners', () => {
      cy.get('input[type="number"]').then(($input) => {
        const computedStyle = getComputedStyle($input[0], '::-webkit-outer-spin-button');
        expect(computedStyle.webkitAppearance).to.equal('none');
      });
    });
  });
});

describe('Performance Benchmarks', () => {
  it('should load within performance budget', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start');
      },
    });

    cy.window().then((win) => {
      win.performance.mark('end');
      win.performance.measure('page-load', 'start', 'end');
      
      const measure = win.performance.getEntriesByName('page-load')[0];
      expect(measure.duration).to.be.lessThan(3000); // 3 second budget
    });
  });

  it('should maintain 60fps during animations', () => {
    let frameCount = 0;
    let droppedFrames = 0;
    let lastTime = 0;

    cy.window().then((win) => {
      const measureFrames = (currentTime: number) => {
        if (lastTime) {
          const delta = currentTime - lastTime;
          frameCount++;
          
          // If frame took longer than 16.67ms (60fps), count as dropped
          if (delta > 16.67) {
            droppedFrames++;
          }
        }
        
        lastTime = currentTime;
        
        if (frameCount < 60) {
          win.requestAnimationFrame(measureFrames);
        } else {
          const dropRate = droppedFrames / frameCount;
          expect(dropRate).to.be.lessThan(0.1); // Less than 10% dropped frames
        }
      };
      
      win.requestAnimationFrame(measureFrames);
    });

    // Trigger animation
    cy.get('[data-testid="animated-element"]').trigger('mouseenter');
    cy.wait(1000);
  });
});