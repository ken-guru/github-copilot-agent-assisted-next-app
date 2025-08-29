/**
 * Hover and Focus Animations Demo
 * Demonstrates enhanced Material 3 micro-interactions
 */

'use client';

import React from 'react';
import Button from '../components/Button';
import Material3Input from '../components/Input';
import Material3Card from '../components/Card';
import { useHoverAnimation, useFocusAnimation, useAnimations } from '../hooks/useAnimations';

export const HoverFocusDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = React.useState('buttons');

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '2rem',
        fontWeight: 600,
        color: 'var(--m3-on-surface)',
        marginBottom: '1rem'
      }}>
        Material 3 Hover & Focus Animations
      </h1>

      {/* Demo Navigation */}
      <Material3Card style={{ padding: '1rem' }}>
        <div style={{ 
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'buttons', label: 'Button Interactions' },
            { id: 'inputs', label: 'Input Interactions' },
            { id: 'cards', label: 'Card Interactions' },
            { id: 'custom', label: 'Custom Elements' }
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={selectedDemo === id ? 'filled' : 'text'}
              size="small"
              onClick={() => setSelectedDemo(id)}
            >
              {label}
            </Button>
          ))}
        </div>
      </Material3Card>

      {/* Button Interactions Demo */}
      {selectedDemo === 'buttons' && (
        <Material3Card style={{ padding: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'var(--m3-on-surface)',
            marginBottom: '1rem'
          }}>
            Button Hover & Focus States
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>Filled Buttons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="filled" size="small">Small Filled</Button>
                <Button variant="filled" size="medium">Medium Filled</Button>
                <Button variant="filled" size="large">Large Filled</Button>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>Outlined Buttons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="outlined" size="small">Small Outlined</Button>
                <Button variant="outlined" size="medium">Medium Outlined</Button>
                <Button variant="outlined" size="large">Large Outlined</Button>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>Text Buttons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="text" size="small">Small Text</Button>
                <Button variant="text" size="medium">Medium Text</Button>
                <Button variant="text" size="large">Large Text</Button>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>Special States</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="elevated">Elevated</Button>
                <Button variant="tonal">Tonal</Button>
                <Button iconOnly startIcon="♥">Icon Only</Button>
              </div>
            </div>
          </div>

          <p style={{ 
            color: 'var(--m3-on-surface-variant)',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            Hover over buttons to see scale and elevation animations. Tab navigation shows focus states with glow effects.
          </p>
        </Material3Card>
      )}

      {/* Input Interactions Demo */}
      {selectedDemo === 'inputs' && (
        <Material3Card style={{ padding: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'var(--m3-on-surface)',
            marginBottom: '1rem'
          }}>
            Input Hover & Focus States
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>Outlined Inputs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Material3Input
                  variant="outlined"
                  label="Name"
                  placeholder="Enter your name"
                  enhancedAnimations={true}
                />
                <Material3Input
                  variant="outlined"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  enhancedAnimations={true}
                />
                <Material3Input
                  variant="outlined"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  enhancedAnimations={true}
                />
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>Filled Inputs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Material3Input
                  variant="filled"
                  label="Phone"
                  type="tel"
                  placeholder="Enter phone number"
                  enhancedAnimations={true}
                />
                <Material3Input
                  variant="filled"
                  label="Address"
                  placeholder="Enter address"
                  enhancedAnimations={true}
                />
                <Material3Input
                  variant="filled"
                  label="Message"
                  placeholder="Enter your message"
                  enhancedAnimations={true}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--m3-on-surface-variant)' }}>State Examples</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <Material3Input
                variant="outlined"
                label="Error State"
                error={true}
                errorText="This field is required"
                enhancedAnimations={true}
              />
              <Material3Input
                variant="outlined"
                label="Success State"
                success={true}
                helperText="Looks good!"
                enhancedAnimations={true}
              />
              <Material3Input
                variant="outlined"
                label="Disabled State"
                disabled={true}
                placeholder="Disabled input"
                enhancedAnimations={true}
              />
            </div>
          </div>

          <p style={{ 
            color: 'var(--m3-on-surface-variant)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginTop: '1rem'
          }}>
            Hover over inputs to see subtle elevation. Focus shows enhanced outline with glow effects and label animations.
          </p>
        </Material3Card>
      )}

      {/* Card Interactions Demo */}
      {selectedDemo === 'cards' && (
        <Material3Card style={{ padding: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'var(--m3-on-surface)',
            marginBottom: '1rem'
          }}>
            Interactive Card States
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <InteractiveCard title="Hover Card" type="hover" />
            <InteractiveCard title="Focus Card" type="focus" />
            <InteractiveCard title="Press Card" type="press" />
            <InteractiveCard title="Combined Effects" type="combined" />
          </div>

          <p style={{ 
            color: 'var(--m3-on-surface-variant)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginTop: '1rem'
          }}>
            Interact with cards to see different animation effects. Each card demonstrates specific interaction patterns.
          </p>
        </Material3Card>
      )}

      {/* Custom Elements Demo */}
      {selectedDemo === 'custom' && (
        <Material3Card style={{ padding: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'var(--m3-on-surface)',
            marginBottom: '1rem'
          }}>
            Custom Interactive Elements
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <CustomHoverElement />
            <CustomFocusElement />
            <CustomPressElement />
            <CustomCombinedElement />
          </div>

          <p style={{ 
            color: 'var(--m3-on-surface-variant)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginTop: '1rem'
          }}>
            These demonstrate how to apply Material 3 animations to custom elements using the animation hooks.
          </p>
        </Material3Card>
      )}
    </div>
  );
};

// Supporting components

const InteractiveCard: React.FC<{
  title: string;
  type: 'hover' | 'focus' | 'press' | 'combined';
}> = ({ title, type }) => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = React.useCallback(() => {
    if ((type === 'press' || type === 'combined') && elementRef.current) {
      const element = elementRef.current;
      element.style.transform = 'scale(0.98)';
      element.style.transition = 'transform 100ms ease-out';
    }
  }, [type]);

  const handleMouseUp = React.useCallback(() => {
    if ((type === 'press' || type === 'combined') && elementRef.current) {
      const element = elementRef.current;
      element.style.transform = '';
      element.style.transition = 'transform 150ms ease-out';
    }
  }, [type]);

  // Apply hover animation if needed
  React.useEffect(() => {
    if ((type === 'hover' || type === 'combined') && elementRef.current) {
      const { createHoverAnimation } = require('../utils/animation-utils');
      const { onMouseEnter, onMouseLeave } = createHoverAnimation(elementRef.current, {
        scale: 1.02,
        elevation: 2
      });

      const element = elementRef.current;
      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, [type]);

  // Apply focus animation if needed
  React.useEffect(() => {
    if ((type === 'focus' || type === 'combined') && elementRef.current) {
      const { createFocusAnimation } = require('../utils/animation-utils');
      const { onFocus, onBlur } = createFocusAnimation(elementRef.current);

      const element = elementRef.current;
      element.addEventListener('focus', onFocus);
      element.addEventListener('blur', onBlur);

      return () => {
        element.removeEventListener('focus', onFocus);
        element.removeEventListener('blur', onBlur);
      };
    }
  }, [type]);

  return (
    <Material3Card
      ref={elementRef}
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        userSelect: 'none',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h3 style={{ 
        fontSize: '1.1rem',
        fontWeight: 500,
        color: 'var(--m3-on-surface)',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: '0.9rem',
        color: 'var(--m3-on-surface-variant)'
      }}>
        {type === 'hover' && 'Hover to see elevation'}
        {type === 'focus' && 'Tab to focus and see glow'}
        {type === 'press' && 'Click to see press effect'}
        {type === 'combined' && 'Try hover, focus, and press'}
      </p>
    </Material3Card>
  );
};

const CustomHoverElement: React.FC = () => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elementRef.current) {
      const { createHoverAnimation } = require('../utils/animation-utils');
      const { onMouseEnter, onMouseLeave } = createHoverAnimation(elementRef.current, {
        scale: 1.05,
        elevation: 3
      });

      const element = elementRef.current;
      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, []);

  return (
    <div
      ref={elementRef}
      style={{
        padding: '1rem',
        backgroundColor: 'var(--m3-primary-container)',
        color: 'var(--m3-on-primary-container)',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Hover Me</div>
      </div>
    </div>
  );
};

const CustomFocusElement: React.FC = () => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elementRef.current) {
      const { createFocusAnimation } = require('../utils/animation-utils');
      const { onFocus, onBlur } = createFocusAnimation(elementRef.current);

      const element = elementRef.current;
      element.addEventListener('focus', onFocus);
      element.addEventListener('blur', onBlur);

      return () => {
        element.removeEventListener('focus', onFocus);
        element.removeEventListener('blur', onBlur);
      };
    }
  }, []);

  return (
    <div
      ref={elementRef}
      tabIndex={0}
      style={{
        padding: '1rem',
        backgroundColor: 'var(--m3-secondary-container)',
        color: 'var(--m3-on-secondary-container)',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
      }}
    >
      <div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⌨️</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Tab Focus</div>
      </div>
    </div>
  );
};

const CustomPressElement: React.FC = () => {
  const [isPressed, setIsPressed] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    if (elementRef.current) {
      elementRef.current.style.transform = 'scale(0.95)';
      elementRef.current.style.transition = 'transform 100ms ease-out';
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (elementRef.current) {
      elementRef.current.style.transform = '';
      elementRef.current.style.transition = 'transform 150ms ease-out';
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        padding: '1rem',
        backgroundColor: 'var(--m3-tertiary-container)',
        color: 'var(--m3-on-tertiary-container)',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👆</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Press Me</div>
      </div>
    </div>
  );
};

const CustomCombinedElement: React.FC = () => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elementRef.current) {
      const { createHoverAnimation, createFocusAnimation } = require('../utils/animation-utils');
      
      // Set up hover animation
      const { onMouseEnter, onMouseLeave } = createHoverAnimation(elementRef.current, {
        scale: 1.03,
        elevation: 2
      });
      
      // Set up focus animation
      const { onFocus, onBlur } = createFocusAnimation(elementRef.current);

      const element = elementRef.current;
      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', onMouseLeave);
      element.addEventListener('focus', onFocus);
      element.addEventListener('blur', onBlur);

      return () => {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
        element.removeEventListener('focus', onFocus);
        element.removeEventListener('blur', onBlur);
      };
    }
  }, []);

  return (
    <div
      ref={elementRef}
      tabIndex={0}
      style={{
        padding: '1rem',
        backgroundColor: 'var(--m3-surface-variant)',
        color: 'var(--m3-on-surface-variant)',
        borderRadius: '0.75rem',
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
      }}
    >
      <div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>All Effects</div>
      </div>
    </div>
  );
};

export default HoverFocusDemo;