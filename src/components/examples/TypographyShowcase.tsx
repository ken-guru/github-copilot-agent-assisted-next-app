/**
 * Typography Showcase Component
 * Demonstrates the Material 3 Expressive typography system implementation
 */

import React from 'react';
import {
  getMaterial3ExpressiveTypography,
  getMaterial3ContextualTypography,
  getMaterial3AdaptiveTypography,
  getMaterial3Classes,
} from '../../utils/material3-utils';

interface TypographyShowcaseProps {
  context?: 'compact' | 'comfortable' | 'spacious';
  showResponsive?: boolean;
}

export const TypographyShowcase: React.FC<TypographyShowcaseProps> = ({
  context = 'comfortable',
  showResponsive = true,
}) => {
  // Example of expressive typography with different emphasis levels
  const headlineStyle = getMaterial3ExpressiveTypography('headlineLarge', 'bold', 'high');
  const subtitleStyle = getMaterial3ExpressiveTypography('titleMedium', 'medium', 'medium');
  const bodyStyle = getMaterial3ExpressiveTypography('bodyLarge', 'regular', 'low');

  // Example of contextual typography scaling
  const contextualHeadline = getMaterial3ContextualTypography('headlineMedium', context);
  const contextualBody = getMaterial3ContextualTypography('bodyMedium', context);

  // Example of adaptive typography for responsive design
  const adaptiveTypography = getMaterial3AdaptiveTypography('titleLarge');

  // Example of utility classes
  const utilityClasses = getMaterial3Classes({
    typography: 'displaySmall',
    color: 'primary',
    stateLayer: true,
  });

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <h1 style={headlineStyle}>
        Material 3 Expressive Typography
      </h1>
      
      <p style={subtitleStyle}>
        Enhanced typography system with dynamic scaling and expressive variations
      </p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={contextualHeadline}>
          Contextual Typography ({context})
        </h2>
        <p style={contextualBody}>
          This text adapts its size based on the context setting. 
          Try switching between compact, comfortable, and spacious modes 
          to see how the typography scales appropriately.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={adaptiveTypography.base}>
          Responsive Typography
        </h2>
        <p style={bodyStyle}>
          The typography system includes responsive scaling that adapts to different screen sizes:
        </p>
        <ul style={bodyStyle}>
          <li>Mobile: 87.5% scaling for better readability on small screens</li>
          <li>Tablet: 95% scaling for balanced proportions</li>
          <li>Desktop: 105% scaling for enhanced visual hierarchy</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 className="md-typescale-headline-small md-color-primary">
          Utility Classes Example
        </h2>
        <div className={utilityClasses} style={{ padding: '16px', cursor: 'pointer' }}>
          Interactive element with utility classes
        </div>
      </section>

      <section>
        <h2 style={getMaterial3ExpressiveTypography('headlineSmall', 'semi-bold', 'high')}>
          Font Weight Variations
        </h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          <p style={getMaterial3ExpressiveTypography('bodyLarge', 'light')}>
            Light weight (300) - Subtle and elegant
          </p>
          <p style={getMaterial3ExpressiveTypography('bodyLarge', 'regular')}>
            Regular weight (400) - Standard readability
          </p>
          <p style={getMaterial3ExpressiveTypography('bodyLarge', 'medium')}>
            Medium weight (500) - Balanced emphasis
          </p>
          <p style={getMaterial3ExpressiveTypography('bodyLarge', 'semi-bold')}>
            Semi-bold weight (600) - Strong presence
          </p>
          <p style={getMaterial3ExpressiveTypography('bodyLarge', 'bold')}>
            Bold weight (700) - High impact
          </p>
        </div>
      </section>

      {showResponsive && (
        <section style={{ marginTop: '32px', padding: '16px', backgroundColor: 'var(--md-sys-color-surface-container)' }}>
          <h3 className="md-typescale-title-medium md-color-on-surface">
            Responsive Behavior
          </h3>
          <p className="md-typescale-body-medium md-color-on-surface-variant">
            This typography system automatically adapts to different screen sizes and contexts.
            The CSS custom properties and calc() functions ensure optimal performance while
            maintaining design consistency across all devices.
          </p>
        </section>
      )}
    </div>
  );
};

export default TypographyShowcase;