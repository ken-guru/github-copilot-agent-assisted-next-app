/**
 * Motion System Showcase Component
 * 
 * Demonstrates Material 3 Expressive motion patterns including:
 * - Easing curves and duration scales
 * - Shared element transitions
 * - Micro-interactions
 * - Performance-optimized animations
 * - Reduced motion support
 */

'use client';

import React, { useState } from 'react';
import {
  useMotionPreferences,
  useTransition,
  useSharedElementTransition,
  useMicroInteraction,
  useRippleEffect,
  useKeyframeAnimation
} from '../../hooks/useMotionSystem';
import {
  Material3Easing,
  Material3Duration,
  createTransition
} from '../../utils/material3-motion-system';

interface MotionSystemShowcaseProps {
  className?: string;
}

export default function MotionSystemShowcase({ className = '' }: MotionSystemShowcaseProps) {
  const [activeDemo, setActiveDemo] = useState<string>('easing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { prefersReducedMotion } = useMotionPreferences();
  const fadeTransition = useSharedElementTransition('fade');
  const scaleTransition = useSharedElementTransition('scale');
  const slideTransition = useSharedElementTransition('slide');
  const buttonPress = useMicroInteraction('buttonPress');
  const cardHover = useMicroInteraction('cardHover');
  const rippleEffect = useRippleEffect();
  const { createAnimation } = useKeyframeAnimation();

  const handleDemoChange = (demo: string) => {
    setIsTransitioning(true);
    fadeTransition.exit();
    
    setTimeout(() => {
      setActiveDemo(demo);
      fadeTransition.enter();
      setIsTransitioning(false);
    }, 200);
  };

  const triggerCustomAnimation = () => {
    const keyframes = {
      '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
      '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.8' },
      '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
    };
    
    createAnimation('custom-spin', keyframes, {
      duration: 1000,
      easing: 'emphasizedDecelerate',
      iterations: 1
    });
  };

  return (
    <div className={`motion-system-showcase ${className}`}>
      <div className="showcase-header">
        <h2 className="md-typescale-headline-medium">
          Material 3 Expressive Motion System
        </h2>
        <p className="md-typescale-body-medium">
          Interactive demonstration of Material 3 motion patterns and animations.
          {prefersReducedMotion && (
            <span className="reduced-motion-notice">
              {' '}(Reduced motion detected - animations are simplified)
            </span>
          )}
        </p>
      </div>

      <div className="demo-navigation">
        {[
          { id: 'easing', label: 'Easing Curves' },
          { id: 'transitions', label: 'Shared Transitions' },
          { id: 'micro', label: 'Micro-interactions' },
          { id: 'performance', label: 'Performance' }
        ].map((demo) => (
          <button
            key={demo.id}
            className={`demo-nav-button ${activeDemo === demo.id ? 'active' : ''}`}
            onClick={() => handleDemoChange(demo.id)}
            {...buttonPress.handlers}
            style={buttonPress.styles}
          >
            {demo.label}
          </button>
        ))}
      </div>

      <div 
        className="demo-content"
        style={fadeTransition.styles}
      >
        {activeDemo === 'easing' && (
          <EasingCurvesDemo />
        )}
        
        {activeDemo === 'transitions' && (
          <SharedTransitionsDemo 
            fadeTransition={fadeTransition}
            scaleTransition={scaleTransition}
            slideTransition={slideTransition}
          />
        )}
        
        {activeDemo === 'micro' && (
          <MicroInteractionsDemo 
            cardHover={cardHover}
            rippleEffect={rippleEffect}
          />
        )}
        
        {activeDemo === 'performance' && (
          <PerformanceDemo onTriggerAnimation={triggerCustomAnimation} />
        )}
      </div>

      <style jsx>{`
        .motion-system-showcase {
          padding: var(--md-sys-spacing-6);
          max-width: 1200px;
          margin: 0 auto;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: var(--md-sys-spacing-8);
        }

        .showcase-header h2 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--md-sys-spacing-3);
        }

        .showcase-header p {
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 0 auto;
        }

        .reduced-motion-notice {
          color: var(--md-sys-color-primary);
          font-weight: 500;
        }

        .demo-navigation {
          display: flex;
          gap: var(--md-sys-spacing-2);
          justify-content: center;
          margin-bottom: var(--md-sys-spacing-6);
          flex-wrap: wrap;
        }

        .demo-nav-button {
          padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
          border: 1px solid var(--md-sys-color-outline);
          border-radius: var(--md-sys-shape-corner-pill-medium);
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
          transition: ${createTransition({
            property: ['background-color', 'border-color', 'color'],
            duration: 'short3',
            easing: 'standard'
          })};
        }

        .demo-nav-button:hover {
          background: var(--md-sys-color-surface-container-high);
        }

        .demo-nav-button.active {
          background: var(--md-sys-color-primary-container);
          border-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary-container);
        }

        .demo-content {
          min-height: 400px;
          padding: var(--md-sys-spacing-6);
          background: var(--md-sys-color-surface-container-low);
          border-radius: var(--md-sys-shape-corner-large);
          box-shadow: var(--md-sys-elevation-level1);
        }

        @media (prefers-reduced-motion: reduce) {
          .demo-nav-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function EasingCurvesDemo() {
  const [activeEasing, setActiveEasing] = useState<keyof typeof Material3Easing>('standard');
  
  return (
    <div className="easing-demo">
      <h3 className="md-typescale-title-large">Easing Curves</h3>
      <p className="md-typescale-body-medium">
        Material 3 provides different easing curves for various animation contexts.
      </p>

      <div className="easing-controls">
        {Object.keys(Material3Easing).map((easing) => (
          <button
            key={easing}
            className={`easing-button ${activeEasing === easing ? 'active' : ''}`}
            onClick={() => setActiveEasing(easing as keyof typeof Material3Easing)}
          >
            {easing}
          </button>
        ))}
      </div>

      <div className="easing-visualization">
        <div 
          className="easing-ball"
          style={{
            transition: createTransition({
              property: 'transform',
              duration: 'long2',
              easing: activeEasing
            })
          }}
        />
        <div className="easing-info">
          <code>{Material3Easing[activeEasing]}</code>
        </div>
      </div>

      <style jsx>{`
        .easing-demo h3 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--md-sys-spacing-2);
        }

        .easing-demo p {
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: var(--md-sys-spacing-4);
        }

        .easing-controls {
          display: flex;
          gap: var(--md-sys-spacing-2);
          margin-bottom: var(--md-sys-spacing-6);
          flex-wrap: wrap;
        }

        .easing-button {
          padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4);
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: var(--md-sys-shape-corner-small);
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
          font-size: 0.875rem;
        }

        .easing-button.active {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          border-color: var(--md-sys-color-primary);
        }

        .easing-visualization {
          position: relative;
          height: 100px;
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-medium);
          overflow: hidden;
          margin-bottom: var(--md-sys-spacing-4);
        }

        .easing-ball {
          width: 20px;
          height: 20px;
          background: var(--md-sys-color-primary);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          animation: easing-demo 2s infinite alternate;
        }

        .easing-info {
          text-align: center;
          padding: var(--md-sys-spacing-3);
        }

        .easing-info code {
          background: var(--md-sys-color-surface-container-highest);
          color: var(--md-sys-color-on-surface);
          padding: var(--md-sys-spacing-1) var(--md-sys-spacing-2);
          border-radius: var(--md-sys-shape-corner-extra-small);
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }

        @keyframes easing-demo {
          0% { transform: translateY(-50%) translateX(0); }
          100% { transform: translateY(-50%) translateX(calc(100vw - 200px)); }
        }
      `}</style>
    </div>
  );
}

interface SharedTransitionsDemoProps {
  fadeTransition: ReturnType<typeof useSharedElementTransition>;
  scaleTransition: ReturnType<typeof useSharedElementTransition>;
  slideTransition: ReturnType<typeof useSharedElementTransition>;
}

function SharedTransitionsDemo({ 
  fadeTransition, 
  scaleTransition, 
  slideTransition 
}: SharedTransitionsDemoProps) {
  const [activeTransition, setActiveTransition] = useState<'fade' | 'scale' | 'slide'>('fade');
  
  const transitions = {
    fade: fadeTransition,
    scale: scaleTransition,
    slide: slideTransition
  };

  const triggerTransition = (type: 'fade' | 'scale' | 'slide') => {
    const transition = transitions[type];
    transition.exit();
    setTimeout(() => {
      setActiveTransition(type);
      transition.enter();
    }, 200);
  };

  return (
    <div className="transitions-demo">
      <h3 className="md-typescale-title-large">Shared Element Transitions</h3>
      <p className="md-typescale-body-medium">
        Smooth transitions between different states and views.
      </p>

      <div className="transition-controls">
        {(['fade', 'scale', 'slide'] as const).map((type) => (
          <button
            key={type}
            className={`transition-button ${activeTransition === type ? 'active' : ''}`}
            onClick={() => triggerTransition(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="transition-demo-area">
        <div 
          className="transition-element"
          style={transitions[activeTransition].styles}
        >
          <h4>{activeTransition.charAt(0).toUpperCase() + activeTransition.slice(1)} Transition</h4>
          <p>This element demonstrates the {activeTransition} transition pattern.</p>
        </div>
      </div>

      <style jsx>{`
        .transitions-demo h3 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--md-sys-spacing-2);
        }

        .transitions-demo p {
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: var(--md-sys-spacing-4);
        }

        .transition-controls {
          display: flex;
          gap: var(--md-sys-spacing-2);
          margin-bottom: var(--md-sys-spacing-6);
        }

        .transition-button {
          padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
          border: 1px solid var(--md-sys-color-outline);
          border-radius: var(--md-sys-shape-corner-medium);
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
        }

        .transition-button.active {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          border-color: var(--md-sys-color-secondary);
        }

        .transition-demo-area {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .transition-element {
          padding: var(--md-sys-spacing-6);
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: var(--md-sys-shape-corner-large);
          text-align: center;
          max-width: 300px;
        }

        .transition-element h4 {
          margin: 0 0 var(--md-sys-spacing-2) 0;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .transition-element p {
          margin: 0;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

interface MicroInteractionsDemoProps {
  cardHover: ReturnType<typeof useMicroInteraction>;
  rippleEffect: ReturnType<typeof useRippleEffect>;
}

function MicroInteractionsDemo({ cardHover, rippleEffect }: MicroInteractionsDemoProps) {
  return (
    <div className="micro-demo">
      <h3 className="md-typescale-title-large">Micro-interactions</h3>
      <p className="md-typescale-body-medium">
        Subtle feedback animations that enhance user interactions.
      </p>

      <div className="micro-examples">
        <div 
          className="hover-card"
          {...cardHover.handlers}
          style={cardHover.styles}
        >
          <h4>Hover Card</h4>
          <p>Hover or touch to see elevation change</p>
        </div>

        <button 
          className="ripple-button"
          ref={rippleEffect.ref}
          {...rippleEffect.rippleHandlers}
        >
          Ripple Effect
          <span className="button-subtitle">Click to see ripple</span>
        </button>

        <div className="pulse-element md-animate-pulse">
          <span>Pulsing Element</span>
        </div>
      </div>

      <style jsx>{`
        .micro-demo h3 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--md-sys-spacing-2);
        }

        .micro-demo p {
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: var(--md-sys-spacing-4);
        }

        .micro-examples {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--md-sys-spacing-4);
        }

        .hover-card {
          padding: var(--md-sys-spacing-5);
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-medium);
          cursor: pointer;
          user-select: none;
        }

        .hover-card h4 {
          margin: 0 0 var(--md-sys-spacing-2) 0;
          color: var(--md-sys-color-on-surface);
        }

        .hover-card p {
          margin: 0;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 0.875rem;
        }

        .ripple-button {
          position: relative;
          overflow: hidden;
          padding: var(--md-sys-spacing-4) var(--md-sys-spacing-6);
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--md-sys-spacing-1);
        }

        .button-subtitle {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .pulse-element {
          padding: var(--md-sys-spacing-4);
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
          border-radius: var(--md-sys-shape-corner-medium);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

interface PerformanceDemoProps {
  onTriggerAnimation: () => void;
}

function PerformanceDemo({ onTriggerAnimation }: PerformanceDemoProps) {
  const [isOptimized, setIsOptimized] = useState(true);
  
  return (
    <div className="performance-demo">
      <h3 className="md-typescale-title-large">Performance Optimization</h3>
      <p className="md-typescale-body-medium">
        GPU-accelerated animations and performance monitoring.
      </p>

      <div className="performance-controls">
        <label className="optimization-toggle">
          <input
            type="checkbox"
            checked={isOptimized}
            onChange={(e) => setIsOptimized(e.target.checked)}
          />
          <span>GPU Acceleration</span>
        </label>

        <button 
          className="trigger-animation-button"
          onClick={onTriggerAnimation}
        >
          Trigger Custom Animation
        </button>
      </div>

      <div className="performance-info">
        <div className="info-card">
          <h4>Optimization Features</h4>
          <ul>
            <li>will-change property management</li>
            <li>GPU layer promotion</li>
            <li>Animation frame throttling</li>
            <li>Performance measurement</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>Best Practices</h4>
          <ul>
            <li>Use transform and opacity for animations</li>
            <li>Avoid animating layout properties</li>
            <li>Clean up will-change after animations</li>
            <li>Respect reduced motion preferences</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .performance-demo h3 {
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--md-sys-spacing-2);
        }

        .performance-demo p {
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: var(--md-sys-spacing-4);
        }

        .performance-controls {
          display: flex;
          gap: var(--md-sys-spacing-4);
          align-items: center;
          margin-bottom: var(--md-sys-spacing-6);
          flex-wrap: wrap;
        }

        .optimization-toggle {
          display: flex;
          align-items: center;
          gap: var(--md-sys-spacing-2);
          cursor: pointer;
        }

        .optimization-toggle input {
          margin: 0;
        }

        .trigger-animation-button {
          padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
          background: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          cursor: pointer;
        }

        .performance-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--md-sys-spacing-4);
        }

        .info-card {
          padding: var(--md-sys-spacing-4);
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-medium);
        }

        .info-card h4 {
          margin: 0 0 var(--md-sys-spacing-3) 0;
          color: var(--md-sys-color-on-surface);
        }

        .info-card ul {
          margin: 0;
          padding-left: var(--md-sys-spacing-4);
          color: var(--md-sys-color-on-surface-variant);
        }

        .info-card li {
          margin-bottom: var(--md-sys-spacing-1);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}