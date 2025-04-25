import React, { useState, useRef, useEffect } from 'react';
import {
  useLongPress,
  useMultiTouch,
  useSpringAnimation,
  useRippleEffect,
  TouchFeedbackProvider,
  useTouchFeedback
} from '../../utils/advancedTouchInteractions';

// Component demonstrating all advanced touch interactions
const AdvancedTouchInteractionsExample = () => {
  return (
    <TouchFeedbackProvider>
      <div className="advanced-touch-example">
        <h2>Advanced Touch Interactions</h2>
        
        <div className="example-grid">
          <LongPressExample />
          <MultiTouchExample />
          <SpringAnimationExample />
          <RippleEffectExample />
        </div>
        
        <HapticFeedbackControls />
      </div>
    </TouchFeedbackProvider>
  );
};

// Long Press example component
const LongPressExample = () => {
  const [pressStatus, setPressStatus] = useState('Idle');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Set up long press with callbacks
  const longPressProps = useLongPress(
    () => {
      setPressStatus('Long Press Detected!');
    },
    {
      delay: 500,
      onTap: () => setPressStatus('Tap Detected'),
      onMove: (data) => {
        setPosition({ x: data.deltaX, y: data.deltaY });
        setPressStatus('Moving: ' + Math.round(data.absX) + ',' + Math.round(data.absY));
      }
    }
  );
  
  // Reset after delay
  useEffect(() => {
    if (pressStatus !== 'Idle') {
      const timer = setTimeout(() => {
        setPressStatus('Idle');
        setPosition({ x: 0, y: 0 });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [pressStatus]);
  
  return (
    <div className="example-card">
      <h3>Long Press</h3>
      <div 
        {...longPressProps}
        className="interactive-area long-press-area"
        style={{ 
          transform: `translate(${position.x / 5}px, ${position.y / 5}px)`,
          transition: pressStatus === 'Idle' ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        Press and hold here
        <div className="status">{pressStatus}</div>
      </div>
      <p className="instructions">
        Hold for 500ms to trigger long press.<br/>
        Move finger while holding to drag.
      </p>
    </div>
  );
};

// Multi-touch gesture example component
const MultiTouchExample = () => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState('Touch with two fingers');
  
  // Set up multi-touch with callbacks
  const multiTouchProps = useMultiTouch({
    onPinch: (data) => {
      setScale(data.scale);
      setStatus(`Pinch: ${data.scale.toFixed(2)}x`);
    },
    onRotate: (data) => {
      setRotation(data.angle * (180 / Math.PI)); // Convert to degrees
      setStatus(`Rotation: ${Math.round(rotation)}°`);
    },
    onPinchEnd: () => {
      setTimeout(() => setStatus('Touch with two fingers'), 1500);
    },
    onRotateEnd: () => {
      setTimeout(() => setStatus('Touch with two fingers'), 1500);
    }
  });
  
  return (
    <div className="example-card">
      <h3>Multi-Touch Gestures</h3>
      <div 
        {...multiTouchProps}
        className="interactive-area multi-touch-area"
      >
        <div 
          className="transform-target"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: status === 'Touch with two fingers' ? 'all 0.5s ease-out' : 'none'
          }}
        >
          <div className="indicator">
            <div className="arrow"></div>
          </div>
        </div>
        <div className="status">{status}</div>
      </div>
      <p className="instructions">
        Pinch to zoom in/out<br/>
        Rotate with two fingers
      </p>
    </div>
  );
};

// Spring animation example
const SpringAnimationExample = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Set up spring animation
  const [props, api] = useSpringAnimation({
    from: { x: 0, y: 0, scale: 1, rotation: 0 },
    to: { x: 0, y: 0, scale: 1, rotation: 0 },
    config: { tension: 170, friction: 26 },
    onRest: () => setIsAnimating(false)
  });
  
  // Animation presets
  const animations = [
    {
      name: 'Bounce',
      animation: { y: -50, scale: 1.2 }
    },
    {
      name: 'Spin',
      animation: { rotation: 360 }
    },
    {
      name: 'Pop',
      animation: { scale: 0.5 }
    },
    {
      name: 'Shake',
      animation: { x: 20 }
    }
  ];
  
  // Play an animation
  const playAnimation = (animation) => {
    setIsAnimating(true);
    
    // Start animation
    api.start({
      to: animation,
      immediate: false
    });
    
    // Reset after animation
    setTimeout(() => {
      api.start({
        to: { x: 0, y: 0, scale: 1, rotation: 0 },
        immediate: false
      });
    }, 500);
  };
  
  return (
    <div className="example-card">
      <h3>Spring Animations</h3>
      <div className="animation-container">
        <div 
          className="animated-element"
          style={{
            transform: `translate(${props.x}px, ${props.y}px) scale(${props.scale}) rotate(${props.rotation}deg)`
          }}
        >
          <div className="emoji">🎾</div>
        </div>
      </div>
      <div className="button-row">
        {animations.map(anim => (
          <button
            key={anim.name}
            onClick={() => !isAnimating && playAnimation(anim.animation)}
            disabled={isAnimating}
          >
            {anim.name}
          </button>
        ))}
      </div>
      <p className="instructions">
        Click buttons to play physics-based animations
      </p>
    </div>
  );
};

// Ripple effect example
const RippleEffectExample = () => {
  // Set up ripple effect
  const ripplePropsDefault = useRippleEffect({ color: 'rgba(66, 133, 244, 0.4)' });
  const ripplePropsPrimary = useRippleEffect({ color: 'rgba(255, 255, 255, 0.3)' });
  const ripplePropsCustom = useRippleEffect({ 
    color: 'rgba(255, 193, 7, 0.4)',
    duration: 1200,
    size: 200
  });
  
  // Trigger custom ripple event
  const handleClick = (element, intensity) => {
    // Create custom event for haptic feedback
    const customEvent = new CustomEvent('gesturedetected', {
      bubbles: true,
      detail: { intensity }
    });
    element.dispatchEvent(customEvent);
  };
  
  return (
    <div className="example-card">
      <h3>Ripple Effects</h3>
      <div className="ripple-examples">
        <button 
          {...ripplePropsDefault}
          className="ripple-button default"
          onClick={(e) => handleClick(e.currentTarget, 'light')}
        >
          Default
        </button>
        
        <button 
          {...ripplePropsPrimary}
          className="ripple-button primary"
          onClick={(e) => handleClick(e.currentTarget, 'medium')}
        >
          Primary
        </button>
        
        <button 
          {...ripplePropsCustom}
          className="ripple-button custom"
          onClick={(e) => handleClick(e.currentTarget, 'strong')}
        >
          Custom
        </button>
      </div>
      <p className="instructions">
        Tap buttons to see different ripple effects<br/>
        Each provides different haptic feedback
      </p>
    </div>
  );
};

// Haptic feedback controls
const HapticFeedbackControls = () => {
  const { vibrationEnabled, toggleVibration, provideFeedback } = useTouchFeedback();
  
  // Test haptic feedback
  const testFeedback = (intensity) => {
    provideFeedback(intensity);
  };
  
  return (
    <div className="haptic-controls">
      <h3>Haptic Feedback Controls</h3>
      <div className="toggle-container">
        <label>
          <input
            type="checkbox"
            checked={vibrationEnabled}
            onChange={toggleVibration}
          />
          Haptic Feedback Enabled
        </label>
      </div>
      
      <div className="button-row">
        <button onClick={() => testFeedback('light')} disabled={!vibrationEnabled}>
          Light
        </button>
        <button onClick={() => testFeedback('medium')} disabled={!vibrationEnabled}>
          Medium
        </button>
        <button onClick={() => testFeedback('strong')} disabled={!vibrationEnabled}>
          Strong
        </button>
      </div>
    </div>
  );
};

export default AdvancedTouchInteractionsExample;
