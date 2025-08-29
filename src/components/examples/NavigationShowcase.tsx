import React from 'react';
import Navigation from '../Navigation';

/**
 * Navigation Showcase Component
 * Demonstrates the Material 3 Expressive Navigation component
 * with different states and responsive behavior
 */
const NavigationShowcase: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--md-sys-color-background)' }}>
      <Navigation />
      
      <div style={{ 
        padding: 'var(--md-sys-spacing-6)', 
        maxWidth: '1200px', 
        margin: '0 auto',
        color: 'var(--md-sys-color-on-background)'
      }}>
        <h1 style={{
          fontFamily: 'var(--md-sys-typescale-headline-large-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)',
          lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
          letterSpacing: 'var(--md-sys-typescale-headline-large-letter-spacing)',
          marginBottom: 'var(--md-sys-spacing-6)',
          color: 'var(--md-sys-color-primary)'
        }}>
          Material 3 Expressive Navigation
        </h1>
        
        <div style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
          <h2 style={{
            fontFamily: 'var(--md-sys-typescale-title-large-font-family)',
            fontSize: 'var(--md-sys-typescale-title-large-font-size)',
            fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
            marginBottom: 'var(--md-sys-spacing-4)',
            color: 'var(--md-sys-color-on-surface)'
          }}>
            Features Implemented
          </h2>
          
          <ul style={{
            fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
            lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
            color: 'var(--md-sys-color-on-surface)',
            paddingLeft: 'var(--md-sys-spacing-6)'
          }}>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Organic pill-shaped active indicators with subtle asymmetry
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Dynamic color adaptation based on theme and context
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Smooth state transitions with shared element animations
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Enhanced focus indicators with expressive outlines
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Responsive navigation behavior for mobile devices
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Material 3 Expressive design tokens and motion system
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
              ✅ Comprehensive component tests for navigation functionality
            </li>
          </ul>
        </div>
        
        <div style={{
          padding: 'var(--md-sys-spacing-4)',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          marginBottom: 'var(--md-sys-spacing-6)'
        }}>
          <h3 style={{
            fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
            fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
            marginBottom: 'var(--md-sys-spacing-3)',
            color: 'var(--md-sys-color-on-surface)'
          }}>
            Testing Instructions
          </h3>
          
          <p style={{
            fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
            lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
            color: 'var(--md-sys-color-on-surface-variant)',
            marginBottom: 'var(--md-sys-spacing-3)'
          }}>
            Try the following interactions to test the Material 3 Expressive navigation:
          </p>
          
          <ul style={{
            fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
            color: 'var(--md-sys-color-on-surface-variant)',
            paddingLeft: 'var(--md-sys-spacing-5)'
          }}>
            <li style={{ marginBottom: 'var(--md-sys-spacing-1)' }}>
              Hover over navigation items to see expressive hover effects
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-1)' }}>
              Click navigation items to see ripple effects and active states
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-1)' }}>
              Use Tab key to navigate and see enhanced focus indicators
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-1)' }}>
              Resize the window to test responsive behavior
            </li>
            <li style={{ marginBottom: 'var(--md-sys-spacing-1)' }}>
              Toggle between light and dark themes to see color adaptation
            </li>
          </ul>
        </div>
        
        <div style={{
          padding: 'var(--md-sys-spacing-4)',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          border: `1px solid var(--md-sys-color-outline-variant)`
        }}>
          <h3 style={{
            fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
            fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
            marginBottom: 'var(--md-sys-spacing-3)',
            color: 'var(--md-sys-color-on-primary-container)'
          }}>
            Implementation Complete
          </h3>
          
          <p style={{
            fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
            lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
            color: 'var(--md-sys-color-on-primary-container)',
            margin: 0
          }}>
            The navigation component has been successfully redesigned with Material 3 Expressive patterns,
            replacing the Bootstrap navbar with a modern, accessible, and delightful navigation experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationShowcase;