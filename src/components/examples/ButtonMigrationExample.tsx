"use client";

import React from 'react';
import { Material3Button, Material3IconButton, Material3FAB } from '../ui/Material3Button';

/**
 * Button Migration Example
 * 
 * Shows how to replace Bootstrap buttons with Material 3 Expressive buttons
 * in the Mr. Timely application
 */
export const ButtonMigrationExample: React.FC = () => {
  // Sample icons
  const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"></polyline>
      <path d="19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'var(--md-sys-typescale-font-family-plain)'
    }}>
      <h1 style={{
        fontFamily: 'var(--md-sys-typescale-headline-large-font-family)',
        fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
        fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)',
        color: 'var(--md-sys-color-on-surface)',
        marginBottom: '2rem'
      }}>
        Bootstrap to Material 3 Button Migration
      </h1>

      {/* Primary Actions */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'var(--md-sys-typescale-title-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1rem'
        }}>
          Primary Actions
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Bootstrap:
            </p>
            <code style={{ 
              padding: '0.5rem', 
              backgroundColor: 'var(--md-sys-color-surface-variant)', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {'<Button variant="primary">Save</Button>'}
            </code>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Material 3:
            </p>
            <Material3Button variant="filled">
              Save
            </Material3Button>
          </div>
        </div>
      </section>

      {/* Secondary Actions */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'var(--md-sys-typescale-title-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1rem'
        }}>
          Secondary Actions
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Bootstrap:
            </p>
            <code style={{ 
              padding: '0.5rem', 
              backgroundColor: 'var(--md-sys-color-surface-variant)', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {'<Button variant="outline-secondary">Cancel</Button>'}
            </code>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Material 3:
            </p>
            <Material3Button variant="outlined">
              Cancel
            </Material3Button>
          </div>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'var(--md-sys-typescale-title-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1rem'
        }}>
          Buttons with Icons
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Bootstrap:
            </p>
            <code style={{ 
              padding: '0.5rem', 
              backgroundColor: 'var(--md-sys-color-surface-variant)', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {'<Button><i className="bi bi-plus"></i> Add</Button>'}
            </code>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Material 3:
            </p>
            <Material3Button variant="filled" startIcon={<PlusIcon />}>
              Add Activity
            </Material3Button>
          </div>
        </div>
      </section>

      {/* Icon-only Buttons */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'var(--md-sys-typescale-title-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1rem'
        }}>
          Icon-only Buttons
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Bootstrap:
            </p>
            <code style={{ 
              padding: '0.5rem', 
              backgroundColor: 'var(--md-sys-color-surface-variant)', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {'<Button variant="outline-primary" size="sm"><i className="bi bi-pencil"></i></Button>'}
            </code>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Material 3:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Material3IconButton 
                icon={<EditIcon />} 
                variant="outlined"
                aria-label="Edit"
              />
              <Material3IconButton 
                icon={<DeleteIcon />} 
                variant="text"
                colorRole="error"
                aria-label="Delete"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'var(--md-sys-typescale-title-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1rem'
        }}>
          Floating Action Button
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Bootstrap (no equivalent):
            </p>
            <code style={{ 
              padding: '0.5rem', 
              backgroundColor: 'var(--md-sys-color-surface-variant)', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {'<Button className="rounded-circle position-fixed">+</Button>'}
            </code>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Material 3:
            </p>
            <Material3FAB 
              icon={<PlusIcon />} 
              variant="large"
              aria-label="Add new item"
            />
          </div>
        </div>
      </section>

      {/* Migration Benefits */}
      <section style={{ 
        padding: '1.5rem',
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        border: '1px solid var(--md-sys-color-outline-variant)'
      }}>
        <h2 style={{
          fontSize: 'var(--md-sys-typescale-title-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1rem'
        }}>
          Migration Benefits
        </h2>
        
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1.5rem',
          color: 'var(--md-sys-color-on-surface)'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Enhanced Visual Design:</strong> Organic shapes, expressive colors, and dynamic elevation
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Better Interactions:</strong> Ripple effects, smooth hover states, and micro-animations
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Improved Accessibility:</strong> Better focus indicators, proper ARIA labels, and keyboard navigation
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Consistent Design System:</strong> All components follow Material 3 Expressive principles
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Mobile Optimization:</strong> Touch-friendly sizes and responsive behavior
          </li>
          <li>
            <strong>Performance:</strong> Optimized animations and reduced motion support
          </li>
        </ul>
      </section>
    </div>
  );
};