/**
 * Material 3 Motion System Demo Component
 * Interactive demonstration of motion utilities, animations, and transitions
 */

'use client';

import React from 'react';
import { Material3Motion } from '../motion-utils';
import type { Material3MotionDuration, Material3MotionEasing } from '../types';

export default function MotionDemo() {
  const [selectedDuration, setSelectedDuration] = React.useState<Material3MotionDuration>('medium2');
  const [selectedEasing, setSelectedEasing] = React.useState<Material3MotionEasing>('standard');
  const [animationType, setAnimationType] = React.useState<string>('fadeIn');
  const [isAnimating, setIsAnimating] = React.useState(false);

  const demoElementRef = React.useRef<HTMLDivElement>(null);

  const durations: Material3MotionDuration[] = [
    'short1', 'short2', 'short3', 'short4',
    'medium1', 'medium2', 'medium3', 'medium4',
    'long1', 'long2', 'long3', 'long4',
    'extra-long1', 'extra-long2', 'extra-long3', 'extra-long4'
  ];

  const easings: Material3MotionEasing[] = [
    'linear', 'standard', 'standard-accelerate', 'standard-decelerate',
    'emphasized', 'emphasized-accelerate', 'emphasized-decelerate',
    'expressive-standard', 'expressive-entrance', 'expressive-exit',
    'expressive-bounce', 'expressive-elastic', 'expressive-back'
  ];

  const animations = [
    'fadeIn', 'fadeOut', 'scaleIn', 'scaleOut',
    'slideIn-left', 'slideIn-right', 'slideIn-up', 'slideIn-down',
    'bounce', 'shake'
  ];

  const runAnimation = React.useCallback(async () => {
    if (!demoElementRef.current || isAnimating) return;

    setIsAnimating(true);
    const element = demoElementRef.current;

    try {
      let animation: Animation;

      switch (animationType) {
        case 'fadeIn':
          animation = Material3Motion.Animation.fadeIn(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'fadeOut':
          animation = Material3Motion.Animation.fadeOut(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'scaleIn':
          animation = Material3Motion.Animation.scaleIn(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'scaleOut':
          animation = Material3Motion.Animation.scaleOut(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'slideIn-left':
          animation = Material3Motion.Animation.slideIn(element, 'left', {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'slideIn-right':
          animation = Material3Motion.Animation.slideIn(element, 'right', {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'slideIn-up':
          animation = Material3Motion.Animation.slideIn(element, 'up', {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'slideIn-down':
          animation = Material3Motion.Animation.slideIn(element, 'down', {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'bounce':
          animation = Material3Motion.Animation.bounce(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        case 'shake':
          animation = Material3Motion.Animation.shake(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
          break;
        default:
          animation = Material3Motion.Animation.fadeIn(element, {
            duration: selectedDuration,
            easing: selectedEasing
          });
      }

      await Material3Motion.Utils.waitForAnimation(animation);
    } catch (error) {
      console.error('Animation failed:', error);
    } finally {
      setIsAnimating(false);
    }
  }, [animationType, selectedDuration, selectedEasing, isAnimating]);

  const resetElement = () => {
    if (!demoElementRef.current) return;
    
    const element = demoElementRef.current;
    Material3Motion.Utils.cancelAnimations(element);
    element.style.transform = '';
    element.style.opacity = '1';
    setIsAnimating(false);
  };

  const setupButton = (element: HTMLButtonElement) => {
    Material3Motion.Components.button.setup(element);
  };

  const setupCard = (element: HTMLDivElement) => {
    Material3Motion.Components.card.setup(element);
  };

  const setupFab = (element: HTMLButtonElement) => {
    Material3Motion.Components.fab.setup(element);
  };

  return (
    <div className="motion-demo p-8 space-y-8">
      <div className="demo-header">
        <h2 className="m3-title-large mb-4">Material 3 Motion System Demo</h2>
        <p className="m3-body-medium text-on-surface-variant">
          Interactive demonstration of Material 3 motion principles, easing curves, 
          duration scales, and component-specific animations.
        </p>
      </div>

      {/* Animation Controls */}
      <div className="controls-section m3-surface-container p-6 m3-shape-lg space-y-4">
        <h3 className="m3-title-medium mb-4">Animation Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="m3-label-medium block mb-2">Animation Type</label>
            <select 
              value={animationType}
              onChange={(e) => setAnimationType(e.target.value)}
              className="w-full p-2 border border-outline rounded m3-body-medium"
            >
              {animations.map(animation => (
                <option key={animation} value={animation}>
                  {animation.replace('-', ' → ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="m3-label-medium block mb-2">Duration</label>
            <select 
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value as Material3MotionDuration)}
              className="w-full p-2 border border-outline rounded m3-body-medium"
            >
              {durations.map(duration => (
                <option key={duration} value={duration}>
                  {duration} ({Material3Motion.Duration.getValue(duration)}ms)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="m3-label-medium block mb-2">Easing</label>
            <select 
              value={selectedEasing}
              onChange={(e) => setSelectedEasing(e.target.value as Material3MotionEasing)}
              className="w-full p-2 border border-outline rounded m3-body-medium"
            >
              {easings.map(easing => (
                <option key={easing} value={easing}>
                  {easing.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={runAnimation}
            disabled={isAnimating}
            className="px-6 py-2 bg-primary text-on-primary rounded m3-motion-button m3-label-large"
            ref={setupButton}
          >
            {isAnimating ? 'Animating...' : 'Run Animation'}
          </button>
          
          <button
            onClick={resetElement}
            className="px-6 py-2 bg-secondary text-on-secondary rounded m3-motion-button m3-label-large"
            ref={setupButton}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Demo Element */}
      <div className="demo-stage flex justify-center items-center min-h-64 m3-surface-variant rounded-lg p-8">
        <div
          ref={demoElementRef}
          className="demo-element w-24 h-24 bg-primary rounded-lg flex items-center justify-center m3-elevation-2"
        >
          <span className="text-on-primary m3-label-large font-bold">M3</span>
        </div>
      </div>

      {/* Component Examples */}
      <div className="components-section space-y-6">
        <h3 className="m3-title-medium">Component Motion Examples</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Button Examples */}
          <div className="component-demo m3-surface-container p-4 rounded-lg">
            <h4 className="m3-title-small mb-3">Buttons</h4>
            <div className="space-y-2">
              <button
                className="w-full px-4 py-2 bg-primary text-on-primary rounded m3-label-large"
                ref={setupButton}
                onMouseDown={(e) => Material3Motion.Components.button.press(e.currentTarget)}
                onMouseUp={(e) => Material3Motion.Components.button.release(e.currentTarget)}
                onMouseLeave={(e) => Material3Motion.Components.button.release(e.currentTarget)}
              >
                Primary Button
              </button>
              <button
                className="w-full px-4 py-2 bg-secondary text-on-secondary rounded m3-label-large"
                ref={setupButton}
                onMouseDown={(e) => Material3Motion.Components.button.press(e.currentTarget)}
                onMouseUp={(e) => Material3Motion.Components.button.release(e.currentTarget)}
                onMouseLeave={(e) => Material3Motion.Components.button.release(e.currentTarget)}
              >
                Secondary Button
              </button>
            </div>
          </div>

          {/* Card Examples */}
          <div className="component-demo m3-surface-container p-4 rounded-lg">
            <h4 className="m3-title-small mb-3">Cards</h4>
            <div
              className="w-full h-20 bg-surface border border-outline rounded-lg p-3 cursor-pointer"
              ref={setupCard}
              onMouseEnter={(e) => Material3Motion.Components.card.hover(e.currentTarget)}
              onMouseLeave={(e) => Material3Motion.Components.card.unhover(e.currentTarget)}
            >
              <p className="m3-body-medium">Hover for elevation</p>
            </div>
          </div>

          {/* FAB Examples */}
          <div className="component-demo m3-surface-container p-4 rounded-lg">
            <h4 className="m3-title-small mb-3">Floating Action Button</h4>
            <div className="flex justify-center">
              <button
                className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center m3-elevation-3"
                ref={setupFab}
                onMouseEnter={(e) => Material3Motion.Components.fab.hover(e.currentTarget)}
                onMouseLeave={(e) => Material3Motion.Components.fab.reset(e.currentTarget)}
                onMouseDown={(e) => Material3Motion.Components.fab.press(e.currentTarget)}
                onMouseUp={(e) => Material3Motion.Components.fab.reset(e.currentTarget)}
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Easing Curve Visualization */}
      <div className="easing-visualization m3-surface-container p-6 rounded-lg">
        <h3 className="m3-title-medium mb-4">Easing Curve Visualization</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {easings.slice(0, 8).map(easing => (
            <div key={easing} className="easing-demo text-center">
              <div className="mb-2">
                <div 
                  className="w-8 h-8 bg-primary rounded mx-auto easing-ball"
                  style={{
                    transition: `transform 1s ${Material3Motion.Easing.getValue(easing)}`,
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(40px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                />
              </div>
              <p className="m3-label-small text-on-surface-variant">
                {easing.replace(/-/g, ' ')}
              </p>
            </div>
          ))}
        </div>
        <p className="m3-body-small text-on-surface-variant mt-4 text-center">
          Hover over the circles to see different easing curves in action
        </p>
      </div>

      {/* Motion Principles */}
      <div className="principles-section m3-surface-container p-6 rounded-lg">
        <h3 className="m3-title-medium mb-4">Material 3 Motion Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="m3-title-small mb-2">Purposeful</h4>
            <p className="m3-body-medium text-on-surface-variant">
              Every motion serves a clear purpose, guiding user attention and 
              providing feedback about system state changes.
            </p>
          </div>
          <div>
            <h4 className="m3-title-small mb-2">Expressive</h4>
            <p className="m3-body-medium text-on-surface-variant">
              Motion reflects your brand personality while maintaining 
              usability and accessibility standards.
            </p>
          </div>
          <div>
            <h4 className="m3-title-small mb-2">Seamless</h4>
            <p className="m3-body-medium text-on-surface-variant">
              Transitions feel natural and maintain spatial relationships 
              between interface elements.
            </p>
          </div>
          <div>
            <h4 className="m3-title-small mb-2">Responsive</h4>
            <p className="m3-body-medium text-on-surface-variant">
              Motion timing adapts to user preferences and system capabilities, 
              respecting accessibility needs.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="tips-section m3-surface-container p-6 rounded-lg">
        <h3 className="m3-title-medium mb-4">Performance & Accessibility</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p className="m3-body-medium">
              <strong>Reduced Motion:</strong> System automatically respects user preferences 
              for reduced motion accessibility.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p className="m3-body-medium">
              <strong>Hardware Acceleration:</strong> Transform and opacity animations 
              leverage GPU acceleration for smooth performance.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <p className="m3-body-medium">
              <strong>Duration Guidelines:</strong> Shorter durations (50-200ms) for micro-interactions, 
              longer durations (300-600ms) for spatial transitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}