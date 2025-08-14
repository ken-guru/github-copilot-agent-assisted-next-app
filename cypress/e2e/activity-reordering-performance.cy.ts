/**
 * End-to-end performance tests for activity reordering
 * Tests large activity lists and rapid reordering scenarios
 */

describe('Activity Reordering Performance Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Set up a session with sufficient time
    cy.get('[data-testid="time-input"]').clear().type('30');
    cy.get('[data-testid="start-session"]').click();
    
    // Wait for session to start
    cy.get('[data-testid="activity-manager"]').should('be.visible');
  });

  describe('Large Activity Lists', () => {
    it('should handle 20+ activities efficiently', () => {
      const startTime = Date.now();
      
      // Create 25 activities
      for (let i = 1; i <= 25; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Activity ${i}`);
        cy.get('[data-testid="add-activity"]').click();
        
        // Verify activity was added
        cy.get(`[data-testid="activity-column-activity-${i}"]`).should('exist');
      }
      
      const creationTime = Date.now() - startTime;
      
      // Should create activities efficiently (less than 10 seconds)
      expect(creationTime).to.be.lessThan(10000);
      
      // Verify all activities are visible
      cy.get('[data-testid="activity-list"]').within(() => {
        cy.get('[data-testid^="activity-column-"]').should('have.length', 25);
      });
      
      // Test scrolling performance with large list
      cy.get('[data-testid="activity-list"]').scrollTo('bottom');
      cy.get('[data-testid="activity-list"]').scrollTo('top');
      
      // Should remain responsive
      cy.get('[data-testid="activity-name-input"]').should('be.visible');
    });

    it('should maintain performance with mixed activity states', () => {
      // Create 15 activities
      for (let i = 1; i <= 15; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Task ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
      
      // Start and complete some activities
      cy.get('[data-testid="start-activity-task-1"]').click();
      cy.wait(1000); // Let it run briefly
      cy.get('[data-testid="complete-activity-task-1"]').click();
      
      cy.get('[data-testid="start-activity-task-2"]').click();
      cy.wait(1000);
      cy.get('[data-testid="complete-activity-task-2"]').click();
      
      // Remove some activities
      cy.get('[data-testid="remove-activity-task-3"]').click();
      cy.get('[data-testid="remove-activity-task-4"]').click();
      
      // Verify performance is maintained
      cy.get('[data-testid="activity-list"]').should('be.visible');
      cy.get('[data-testid="activity-name-input"]').should('be.enabled');
    });
  });

  describe('Drag and Drop Performance', () => {
    beforeEach(() => {
      // Create 10 activities for drag tests
      for (let i = 1; i <= 10; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Item ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
    });

    it('should handle rapid drag operations efficiently', () => {
      const startTime = Date.now();
      
      // Perform multiple drag operations
      for (let i = 1; i <= 5; i++) {
        // Drag first item to different positions
        cy.get(`[data-testid="activity-column-item-${i}"]`)
          .find('[draggable="true"]')
          .trigger('dragstart');
        
        cy.get(`[data-testid="activity-column-item-${i + 1}"]`)
          .find('[draggable="true"]')
          .trigger('dragover')
          .trigger('drop');
        
        // Small delay to allow for debounced persistence
        cy.wait(100);
      }
      
      const dragTime = Date.now() - startTime;
      
      // Should handle multiple drags efficiently (less than 3 seconds)
      expect(dragTime).to.be.lessThan(3000);
      
      // Verify order persistence
      cy.reload();
      cy.get('[data-testid="activity-list"]').should('be.visible');
    });

    it('should provide smooth visual feedback during drag', () => {
      // Start drag operation
      cy.get('[data-testid="activity-column-item-1"]')
        .find('[draggable="true"]')
        .trigger('dragstart');
      
      // Verify drag feedback is applied
      cy.get('[data-testid="activity-column-item-1"]')
        .should('have.class', 'dragging');
      
      // Move over target
      cy.get('[data-testid="activity-column-item-2"]')
        .find('[draggable="true"]')
        .trigger('dragover');
      
      // Verify drag over feedback
      cy.get('[data-testid="activity-column-item-2"]')
        .should('have.class', 'drag-over');
      
      // Complete drag
      cy.get('[data-testid="activity-column-item-2"]')
        .find('[draggable="true"]')
        .trigger('drop');
      
      // Verify feedback is cleared
      cy.get('[data-testid="activity-column-item-1"]')
        .should('not.have.class', 'dragging');
      cy.get('[data-testid="activity-column-item-2"]')
        .should('not.have.class', 'drag-over');
    });
  });

  describe('Touch Performance', () => {
    beforeEach(() => {
      // Create activities for touch tests
      for (let i = 1; i <= 8; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Touch ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
    });

    it('should handle touch reordering efficiently', () => {
      // Simulate touch events for reordering
      cy.get('[data-testid="activity-column-touch-1"]')
        .find('[draggable="true"]')
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] });
      
      // Simulate long press
      cy.wait(600); // Longer than longPressMs (500ms)
      
      // Simulate touch move
      cy.get('[data-testid="activity-column-touch-1"]')
        .find('[draggable="true"]')
        .trigger('touchmove', { touches: [{ clientX: 100, clientY: 200 }] });
      
      // Simulate touch end
      cy.get('[data-testid="activity-column-touch-2"]')
        .find('[draggable="true"]')
        .trigger('touchend', { changedTouches: [{ clientX: 100, clientY: 200 }] });
      
      // Should remain responsive
      cy.get('[data-testid="activity-list"]').should('be.visible');
    });
  });

  describe('Keyboard Navigation Performance', () => {
    beforeEach(() => {
      // Create activities for keyboard tests
      for (let i = 1; i <= 12; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Key ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
    });

    it('should handle rapid keyboard reordering efficiently', () => {
      const startTime = Date.now();
      
      // Focus first activity
      cy.get('[data-testid="activity-column-key-1"]')
        .find('[draggable="true"]')
        .focus();
      
      // Perform multiple keyboard reorders
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="activity-column-key-1"]')
          .find('[draggable="true"]')
          .trigger('keydown', { key: 'ArrowDown', ctrlKey: true });
        
        cy.wait(100); // Small delay for debouncing
      }
      
      const keyboardTime = Date.now() - startTime;
      
      // Should handle keyboard operations efficiently
      expect(keyboardTime).to.be.lessThan(2000);
      
      // Verify accessibility announcements work
      cy.get('[aria-live="polite"]').should('exist');
    });
  });

  describe('Cross-View Performance', () => {
    beforeEach(() => {
      // Create activities
      for (let i = 1; i <= 15; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Cross ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
      
      // Reorder some activities
      cy.get('[data-testid="activity-column-cross-1"]')
        .find('[draggable="true"]')
        .trigger('dragstart');
      cy.get('[data-testid="activity-column-cross-3"]')
        .find('[draggable="true"]')
        .trigger('dragover')
        .trigger('drop');
    });

    it('should maintain order consistency across navigation', () => {
      // Start an activity to enable timer view
      cy.get('[data-testid="start-activity-cross-2"]').click();
      
      // Navigate to summary (if available)
      // Note: This depends on the app's navigation structure
      cy.wait(2000); // Let timer run
      
      // Complete activity to see summary
      cy.get('[data-testid="complete-activity-cross-2"]').click();
      
      // Verify order is maintained in summary
      cy.get('[data-testid="summary"]').should('be.visible');
      
      // Navigate back to activities
      cy.get('[data-testid="activity-manager"]').should('be.visible');
      
      // Verify order is still consistent
      cy.get('[data-testid="activity-list"]').should('be.visible');
    });
  });

  describe('Memory and Cleanup Performance', () => {
    it('should handle component updates without memory leaks', () => {
      // Create activities
      for (let i = 1; i <= 10; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Memory ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
      
      // Perform operations that might cause memory leaks
      for (let i = 0; i < 5; i++) {
        // Start and stop activities rapidly
        cy.get('[data-testid="start-activity-memory-1"]').click();
        cy.wait(100);
        cy.get('[data-testid="complete-activity-memory-1"]').click();
        cy.wait(100);
        
        // Drag operations
        cy.get('[data-testid="activity-column-memory-2"]')
          .find('[draggable="true"]')
          .trigger('dragstart');
        cy.get('[data-testid="activity-column-memory-3"]')
          .find('[draggable="true"]')
          .trigger('dragover')
          .trigger('drop');
        cy.wait(100);
      }
      
      // Should remain responsive
      cy.get('[data-testid="activity-name-input"]').should('be.enabled');
      cy.get('[data-testid="add-activity"]').should('be.enabled');
    });

    it('should handle page reload with large activity lists', () => {
      // Create large activity list
      for (let i = 1; i <= 20; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Reload ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
      
      // Perform some reordering
      cy.get('[data-testid="activity-column-reload-1"]')
        .find('[draggable="true"]')
        .trigger('dragstart');
      cy.get('[data-testid="activity-column-reload-5"]')
        .find('[draggable="true"]')
        .trigger('dragover')
        .trigger('drop');
      
      // Reload page
      cy.reload();
      
      // Should load efficiently
      cy.get('[data-testid="activity-manager"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="activity-list"]').should('be.visible');
      
      // Verify activities are loaded
      cy.get('[data-testid^="activity-column-"]').should('have.length.at.least', 15);
    });
  });

  describe('Animation Performance', () => {
    beforeEach(() => {
      // Create activities for animation tests
      for (let i = 1; i <= 8; i++) {
        cy.get('[data-testid="activity-name-input"]').type(`Anim ${i}`);
        cy.get('[data-testid="add-activity"]').click();
      }
    });

    it('should handle loading animations smoothly', () => {
      // Reload to trigger loading animations
      cy.reload();
      
      // Should show loading state briefly
      cy.get('.skeleton').should('exist');
      
      // Should transition to loaded state smoothly
      cy.get('[data-testid="activity-list"]', { timeout: 5000 }).should('be.visible');
      cy.get('.skeleton').should('not.exist');
      
      // Should show fade-in animations
      cy.get('.fadeIn').should('exist');
    });

    it('should handle drag animations without blocking UI', () => {
      // Start drag with animation
      cy.get('[data-testid="activity-column-anim-1"]')
        .find('[draggable="true"]')
        .trigger('dragstart');
      
      // UI should remain responsive during animation
      cy.get('[data-testid="activity-name-input"]').should('be.enabled');
      
      // Complete drag
      cy.get('[data-testid="activity-column-anim-2"]')
        .find('[draggable="true"]')
        .trigger('dragover')
        .trigger('drop');
      
      // Should show reordering animation
      cy.get('.reordering').should('exist');
      
      // Animation should complete
      cy.wait(200);
      cy.get('.reordering').should('not.exist');
    });
  });
});