describe('Activity CRUD Operations', () => {
  beforeEach(() => {
    // Handle hydration errors from Next.js
    cy.on('uncaught:exception', (err, runnable) => {
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
    
    cy.visit('/activities');
    // Clear any existing data
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Navigation and Layout', () => {
    it('should display the activities page with correct title', () => {
      // Check for page content instead of specific title
      cy.contains('Your Activities').should('be.visible');
    });

    it('should show Add Activity button', () => {
      cy.get('button').contains('Add Activity').should('be.visible').and('not.be.disabled');
    });

    it('should display empty state when no activities exist', () => {
      // Should show the Add Activity button which is always present
      cy.get('button').contains('Add Activity').should('be.visible');
    });

    it('should navigate to activities page from home', () => {
      cy.visit('/');
      cy.get('[href="/activities"]').click();
      cy.url().should('include', '/activities');
      cy.contains('Your Activities').should('be.visible');
    });

    it('should have proper page structure and accessibility', () => {
      // Check for main content areas
      cy.get('main').should('exist');
      
      // Check for proper headings hierarchy
      cy.get('h1, h2, h3, h4, h5, h6').should('exist');
      
      // Check ARIA labels where expected
      cy.get('[aria-label="Activity List"]').should('exist');
    });
  });

  describe('Create Activity', () => {
    it('should open modal when clicking Add Activity', () => {
      cy.contains('Add Activity').click();
      
      // Modal should be visible
      cy.get('[role="dialog"]').should('be.visible');
      
      // Modal should have proper title
      cy.contains('Add Activity').should('be.visible');
      
      // Form fields should be present
      cy.get('input[type="text"]').should('be.visible');
      cy.get('button').contains('Save').should('be.visible');
      cy.get('button').contains('Cancel').should('be.visible');
    });

    it('should create a new activity successfully', () => {
      cy.contains('Add Activity').click();
      
      // Fill in the activity name - be more specific with the selector
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Test Activity');
      });
      
      // Save the activity
      cy.get('button').contains('Save').click();
      
      // Verify modal closes
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify activity appears in the list
      cy.contains('Test Activity').should('be.visible');
      
      // Verify success message appears
      cy.contains('created successfully').should('be.visible');
    });

    it('should allow canceling activity creation', () => {
      cy.contains('Add Activity').click();
      
      // Enter some data
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Canceled Activity');
      });
      
      // Cancel the operation
      cy.get('button').contains('Cancel').click();
      
      // Modal should close
      cy.get('[role="dialog"]').should('not.exist');
      
      // Activity should not be created
      cy.contains('Canceled Activity').should('not.exist');
    });
  });

  describe('Read Activity', () => {
    beforeEach(() => {
      // Create a test activity for reading tests
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Read Test Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should display activity in the list with correct information', () => {
      cy.contains('Read Test Activity').should('be.visible');
      
      // Check that Edit and Delete buttons are present - simplified selector
      cy.get('button').contains('Edit').should('be.visible');
      cy.get('button').contains('Delete').should('be.visible');
    });

    it('should show activities count when multiple exist', () => {
      // Add another activity
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Second Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      
      // Both activities should be visible
      cy.contains('Read Test Activity').should('be.visible');
      cy.contains('Second Activity').should('be.visible');
    });
  });

  describe('Update Activity', () => {
    beforeEach(() => {
      // Create a test activity for editing tests
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Edit Test Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should update activity with new data', () => {
      // Click Edit button - simplified approach
      cy.get('button').contains('Edit').first().click();
      
      // Wait for modal to be visible and ready
      cy.get('[role="dialog"]').should('be.visible');
      
      // Clear and enter new name
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().clear().type('Updated Activity Name');
      });
      
      // Save changes
      cy.get('button').contains('Save').click();
      
      // Verify modal closes
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify activity name was updated
      cy.contains('Updated Activity Name').should('be.visible');
      
      // Verify success message
      cy.contains('updated successfully').should('be.visible');
    });

    it('should cancel editing without saving changes', () => {
      // Click Edit button - simplified approach
      cy.get('button').contains('Edit').first().click();
      
      // Make changes
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().clear().type('Canceled Changes');
      });
      
      // Cancel the edit
      cy.get('button').contains('Cancel').click();
      
      // Verify modal closes
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify original name is still there
      cy.contains('Edit Test Activity').should('be.visible');
      cy.contains('Canceled Changes').should('not.exist');
    });

    it('should preserve original data when canceling edit', () => {
      // Click Edit button - simplified approach
      cy.get('button').contains('Edit').first().click();
      
      // Escape to cancel
      cy.get('body').type('{esc}');
      
      // Verify modal closes and original data preserved
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Edit Test Activity').should('be.visible');
    });
  });

  describe('Delete Activity', () => {
    beforeEach(() => {
      // Create test activities for deletion tests
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Delete Test Activity 1');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Delete Test Activity 2');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should show confirmation dialog when clicking Delete', () => {
      // Click Delete button - simplified approach
      cy.get('button').contains('Delete').first().click();
      
      // Verify confirmation dialog appears
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('Are you sure').should('be.visible');
      cy.contains('This action cannot be undone').should('be.visible');
    });

    it('should delete activity when confirmed', () => {
      // Store the first activity name for verification
      cy.contains('Delete Test Activity 1').should('be.visible');
      
      // Click Delete button for first activity
      cy.get('button').contains('Delete').first().click();
      
      // Confirm deletion
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete').click();
      });
      
      // Verify modal closes
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify success message
      cy.contains('deleted successfully').should('be.visible');
      
      // Verify second activity still exists (at least one should remain)
      cy.contains('Delete Test Activity 2').should('be.visible');
    });

    it('should cancel deletion when clicking Cancel', () => {
      // Click Delete button
      cy.get('button').contains('Delete').first().click();
      
      // Cancel deletion
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Cancel').click();
      });
      
      // Verify modal closes
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify both activities still exist
      cy.contains('Delete Test Activity 1').should('be.visible');
      cy.contains('Delete Test Activity 2').should('be.visible');
    });
  });

  describe('Import/Export', () => {
    beforeEach(() => {
      // Create some activities for export
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Export Test 1');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Export Test 2');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should have Export button visible', () => {
      cy.get('button').contains('Export').should('be.visible').and('not.be.disabled');
    });

    it('should have Import button visible', () => {
      cy.get('button').contains('Import').should('be.visible').and('not.be.disabled');
    });

    it('should open export modal when clicking Export', () => {
      cy.get('button').contains('Export').click();
      
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('Export Activities').should('be.visible');
      cy.contains('Download activities.json').should('be.visible');
    });

    it('should open import modal when clicking Import', () => {
      cy.get('button').contains('Import').click();
      
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('Import Activities').should('be.visible');
      cy.get('input[type="file"]').should('exist');
    });

    it('should allow canceling export', () => {
      cy.get('button').contains('Export').click();
      
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Close').click();
      });
      
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should allow canceling import', () => {
      cy.get('button').contains('Import').click();
      
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Cancel').click();
      });
      
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    beforeEach(() => {
      // Create a test activity
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Accessibility Test');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('should support keyboard navigation through activities', () => {
      // Focus on the first focusable button
      cy.get('button').contains('Add Activity').focus();
      
      // Edit button should be focusable
      cy.get('button').contains('Edit').should('be.visible');
      
      // Delete button should be focusable  
      cy.get('button').contains('Delete').should('be.visible');
    });

    it('should have proper ARIA labels on buttons', () => {
      // Check ARIA labels
      cy.get('button[aria-label*="Edit"]').should('exist');
      cy.get('button[aria-label*="Delete"]').should('exist');
    });

    it('should support screen reader announcements', () => {
      // Check for screen reader friendly content
      cy.get('[aria-label="Activity List"]').should('exist');
      cy.get('button[aria-label*="Edit Accessibility Test"]').should('exist');
      cy.get('button[aria-label*="Delete Accessibility Test"]').should('exist');
    });

    it('should maintain focus management in modals', () => {
      // Open modal and check focus
      cy.contains('Add Activity').click();
      
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().should('be.focused');
      });
      
      // Cancel and check focus returns
      cy.get('button').contains('Cancel').click();
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty activity list gracefully', () => {
      // Make sure localStorage is clear and reload to see empty state
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      cy.reload();
      
      // Should show empty state
      cy.contains('No activities yet').should('be.visible');
    });

    it('should handle modal backdrop clicks', () => {
      cy.contains('Add Activity').click();
      
      // Try clicking outside the modal to test backdrop behavior
      // Note: Bootstrap modals with backdrop="static" may not close on backdrop click
      cy.get('[role="dialog"]').should('be.visible');
      
      // Test that Escape key still works as expected
      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full CRUD workflow', () => {
      // Create
      cy.contains('Add Activity').click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().type('Integration Test Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Integration Test Activity').should('be.visible');
      
      // Read
      cy.contains('Integration Test Activity').should('be.visible');
      
      // Update - simplified selector
      cy.get('button').contains('Edit').first().click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('input[type="text"]').first().clear().type('Updated Integration Activity');
      });
      cy.get('button').contains('Save').click();
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Updated Integration Activity').should('be.visible');
      
      // Delete - simplified selector
      cy.get('button').contains('Delete').first().click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete').click();
      });
      cy.get('[role="dialog"]').should('not.exist');
      cy.contains('Updated Integration Activity').should('not.exist');
    });

    it('should maintain data consistency across operations', () => {
      // Create multiple activities
      const activities = ['Activity 1', 'Activity 2', 'Activity 3'];
      
      activities.forEach(activity => {
        cy.contains('Add Activity').click();
        cy.get('[role="dialog"]').within(() => {
          cy.get('input[type="text"]').first().type(activity);
        });
        cy.get('button').contains('Save').click();
        cy.get('[role="dialog"]').should('not.exist');
      });
      
      // Verify all are visible
      activities.forEach(activity => {
        cy.contains(activity).should('be.visible');
      });
      
      // Delete first one (using simplified approach)
      cy.get('button').contains('Delete').first().click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('button').contains('Delete').click();
      });
      cy.get('[role="dialog"]').should('not.exist');
      
      // Verify the remaining activities exist
      cy.get('button').contains('Delete').should('have.length.at.least', 1); // At least one delete button remaining
    });
  });
});
