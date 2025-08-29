/**
 * Animation Showcase Component
 * Demonstrates Material 3 Expressive animations and micro-interactions
 */

import React, { useState } from 'react';
import { Material3AnimatedButton } from '../ui/Material3AnimatedButton';
import { Material3AnimatedTextField } from '../ui/Material3AnimatedTextField';
import { Material3PageTransition, usePageTransition } from '../ui/Material3PageTransition';
import { useLoadingAnimation, useMicroInteractions } from '../../hooks/useAnimations';
import styles from './AnimationShowcase.module.css';

export const AnimationShowcase: React.FC = () => {
  const [buttonStates, setButtonStates] = useState({
    loading: false,
    success: false,
    error: false,
  });
  
  const [textFieldStates, setTextFieldStates] = useState({
    error: false,
    success: false,
    loading: false,
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const { transitionKey, triggerTransition } = usePageTransition();
  const { startLoading, stopLoading, isLoading } = useLoadingAnimation({ type: 'organic' });
  const { triggerClick, triggerSuccess, triggerValidationError } = useMicroInteractions();

  const handleButtonDemo = (type: 'loading' | 'success' | 'error') => {
    setButtonStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handleTextFieldDemo = (type: 'error' | 'success' | 'loading') => {
    setTextFieldStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setTextFieldStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handlePageTransition = () => {
    setCurrentPage(prev => prev + 1);
    triggerTransition();
  };

  const handleMicroInteractionDemo = (element: HTMLElement | null, type: string) => {
    if (!element) return;
    
    switch (type) {
      case 'click':
        triggerClick(element);
        break;
      case 'success':
        triggerSuccess(element);
        break;
      case 'error':
        triggerValidationError(element);
        break;
    }
  };

  return (
    <div className={styles.showcase}>
      <div className={styles.header}>
        <h1 className={styles.title}>Material 3 Expressive Animations</h1>
        <p className={styles.description}>
          Explore the animation system with interactive examples
        </p>
      </div>

      <div className={styles.sections}>
        {/* Button Animations */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Animated Buttons</h2>
          <div className={styles.buttonGrid}>
            <Material3AnimatedButton
              variant="filled"
              loading={buttonStates.loading}
              onClick={() => handleButtonDemo('loading')}
            >
              Loading Demo
            </Material3AnimatedButton>
            
            <Material3AnimatedButton
              variant="outlined"
              success={buttonStates.success}
              onClick={() => handleButtonDemo('success')}
            >
              Success Demo
            </Material3AnimatedButton>
            
            <Material3AnimatedButton
              variant="tonal"
              error={buttonStates.error}
              onClick={() => handleButtonDemo('error')}
            >
              Error Demo
            </Material3AnimatedButton>
            
            <Material3AnimatedButton
              variant="elevated"
              icon={<span>🚀</span>}
              hoverAnimation={true}
              focusAnimation={true}
              rippleEffect={true}
            >
              All Animations
            </Material3AnimatedButton>
          </div>
        </section>

        {/* Text Field Animations */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Animated Text Fields</h2>
          <div className={styles.textFieldGrid}>
            <Material3AnimatedTextField
              label="Standard Field"
              helperText="Watch the label animation"
              variant="outlined"
              animateLabel={true}
              focusAnimation={true}
            />
            
            <Material3AnimatedTextField
              label="Error Demo"
              errorText="This field has an error"
              variant="filled"
              error={textFieldStates.error}
              animateValidation={true}
              leadingIcon={<span>📧</span>}
            />
            
            <Material3AnimatedTextField
              label="Success Demo"
              successText="Field is valid"
              variant="outlined"
              success={textFieldStates.success}
              animateValidation={true}
              trailingIcon={<span>✓</span>}
            />
            
            <Material3AnimatedTextField
              label="Loading Demo"
              helperText="Processing..."
              variant="filled"
              loading={textFieldStates.loading}
            />
          </div>
          
          <div className={styles.textFieldControls}>
            <button
              className={styles.demoButton}
              onClick={() => handleTextFieldDemo('error')}
            >
              Trigger Error
            </button>
            <button
              className={styles.demoButton}
              onClick={() => handleTextFieldDemo('success')}
            >
              Trigger Success
            </button>
            <button
              className={styles.demoButton}
              onClick={() => handleTextFieldDemo('loading')}
            >
              Trigger Loading
            </button>
          </div>
        </section>

        {/* Page Transitions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Page Transitions</h2>
          <div className={styles.pageTransitionDemo}>
            <Material3PageTransition
              transitionKey={transitionKey}
              direction="forward"
              duration="medium"
              easing="emphasized"
            >
              <div className={styles.pageContent}>
                <h3>Page {currentPage}</h3>
                <p>This content transitions smoothly between pages.</p>
                <div className={styles.pageFeatures}>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🎨</span>
                    <span>Expressive Motion</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>⚡</span>
                    <span>Performance Optimized</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>♿</span>
                    <span>Accessibility Aware</span>
                  </div>
                </div>
              </div>
            </Material3PageTransition>
            
            <button
              className={styles.transitionButton}
              onClick={handlePageTransition}
            >
              Next Page
            </button>
          </div>
        </section>

        {/* Micro-interactions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Micro-interactions</h2>
          <div className={styles.microInteractionGrid}>
            <div
              className={styles.interactionCard}
              onClick={(e) => handleMicroInteractionDemo(e.currentTarget, 'click')}
            >
              <h4>Click Animation</h4>
              <p>Click to see ripple effect</p>
            </div>
            
            <div
              className={styles.interactionCard}
              onClick={(e) => handleMicroInteractionDemo(e.currentTarget, 'success')}
            >
              <h4>Success Animation</h4>
              <p>Click to see bounce effect</p>
            </div>
            
            <div
              className={styles.interactionCard}
              onClick={(e) => handleMicroInteractionDemo(e.currentTarget, 'error')}
            >
              <h4>Error Animation</h4>
              <p>Click to see shake effect</p>
            </div>
          </div>
        </section>

        {/* Loading Animations */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Loading Animations</h2>
          <div className={styles.loadingGrid}>
            <div className={styles.loadingDemo}>
              <div className={`${styles.loadingElement} md-loading-pulse`}>
                Pulse Loading
              </div>
            </div>
            
            <div className={styles.loadingDemo}>
              <div className={`${styles.loadingElement} md-loading-wave`}>
                Wave Loading
              </div>
            </div>
            
            <div className={styles.loadingDemo}>
              <div className={`${styles.loadingElement} md-loading-skeleton`}>
                Skeleton Loading
              </div>
            </div>
            
            <div className={styles.loadingDemo}>
              <div className={`${styles.loadingElement} md-loading-organic`}>
                Organic Loading
              </div>
            </div>
          </div>
        </section>

        {/* Performance Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Performance Features</h2>
          <div className={styles.performanceInfo}>
            <div className={styles.performanceCard}>
              <h4>Reduced Motion Support</h4>
              <p>Automatically respects user preferences for reduced motion</p>
            </div>
            
            <div className={styles.performanceCard}>
              <h4>Device Optimization</h4>
              <p>Adapts animation complexity based on device capabilities</p>
            </div>
            
            <div className={styles.performanceCard}>
              <h4>Performance Monitoring</h4>
              <p>Built-in performance tracking and optimization</p>
            </div>
            
            <div className={styles.performanceCard}>
              <h4>GPU Acceleration</h4>
              <p>Uses hardware acceleration for smooth animations</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};