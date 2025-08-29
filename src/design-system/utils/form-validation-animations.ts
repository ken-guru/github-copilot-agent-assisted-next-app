/**
 * Form Validation Animation Utilities
 * Provides Material 3 compliant error, success, and validation animations
 */

import { MATERIAL3_EASING, ANIMATION_DURATION, prefersReducedMotion } from './animation-utils';

/**
 * Form validation animation types
 */
export type ValidationAnimationType = 'error' | 'success' | 'warning' | 'info';

/**
 * Animation configuration for form validation
 */
export interface ValidationAnimationConfig {
  type: ValidationAnimationType;
  message?: string;
  duration?: number;
  persistent?: boolean;
  onComplete?: () => void;
}

/**
 * Create error shake animation for form fields
 */
export function createErrorAnimation(element: HTMLElement, config: ValidationAnimationConfig): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      element.classList.add('error-state');
      config.onComplete?.();
      resolve();
      return;
    }

    // Add error class for styling
    element.classList.add('error-state');

    // Create shake animation
    const shakeAnimation = element.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' }
    ], {
      duration: config.duration || ANIMATION_DURATION.medium1,
      easing: MATERIAL3_EASING.emphasized,
    });

    // Color pulse animation
    const colorAnimation = element.animate([
      { 
        borderColor: 'var(--m3-outline)',
        boxShadow: '0 0 0 0 rgba(var(--m3-error-rgb), 0)' 
      },
      { 
        borderColor: 'var(--m3-error)',
        boxShadow: '0 0 0 2px rgba(var(--m3-error-rgb), 0.2)' 
      },
      { 
        borderColor: 'var(--m3-error)',
        boxShadow: '0 0 0 0 rgba(var(--m3-error-rgb), 0)' 
      }
    ], {
      duration: config.duration || ANIMATION_DURATION.medium1,
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards'
    });

    Promise.all([
      new Promise(resolve => shakeAnimation.addEventListener('finish', resolve)),
      new Promise(resolve => colorAnimation.addEventListener('finish', resolve))
    ]).then(() => {
      config.onComplete?.();
      resolve();
    });
  });
}

/**
 * Create success pulse animation for form fields
 */
export function createSuccessAnimation(element: HTMLElement, config: ValidationAnimationConfig): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      element.classList.add('success-state');
      config.onComplete?.();
      resolve();
      return;
    }

    // Add success class for styling
    element.classList.add('success-state');

    // Create success pulse animation
    const pulseAnimation = element.animate([
      { 
        transform: 'scale(1)',
        borderColor: 'var(--m3-outline)',
        boxShadow: '0 0 0 0 rgba(var(--m3-tertiary-rgb), 0)' 
      },
      { 
        transform: 'scale(1.01)',
        borderColor: 'var(--m3-tertiary)',
        boxShadow: '0 0 0 3px rgba(var(--m3-tertiary-rgb), 0.3)' 
      },
      { 
        transform: 'scale(1)',
        borderColor: 'var(--m3-tertiary)',
        boxShadow: '0 0 0 0 rgba(var(--m3-tertiary-rgb), 0)' 
      }
    ], {
      duration: config.duration || ANIMATION_DURATION.medium2,
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards'
    });

    pulseAnimation.addEventListener('finish', () => {
      config.onComplete?.();
      resolve();
    });
  });
}

/**
 * Create warning animation for form fields
 */
export function createWarningAnimation(element: HTMLElement, config: ValidationAnimationConfig): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      element.classList.add('warning-state');
      config.onComplete?.();
      resolve();
      return;
    }

    // Add warning class
    element.classList.add('warning-state');

    // Create gentle bounce animation
    const bounceAnimation = element.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.02)' },
      { transform: 'scale(0.99)' },
      { transform: 'scale(1.01)' },
      { transform: 'scale(1)' }
    ], {
      duration: config.duration || ANIMATION_DURATION.medium1,
      easing: MATERIAL3_EASING.bounce,
    });

    // Color change animation
    const colorAnimation = element.animate([
      { borderColor: 'var(--m3-outline)' },
      { borderColor: 'var(--m3-secondary)' },
      { borderColor: 'var(--m3-secondary)' }
    ], {
      duration: config.duration || ANIMATION_DURATION.medium1,
      easing: MATERIAL3_EASING.standard,
      fill: 'forwards'
    });

    Promise.all([
      new Promise(resolve => bounceAnimation.addEventListener('finish', resolve)),
      new Promise(resolve => colorAnimation.addEventListener('finish', resolve))
    ]).then(() => {
      config.onComplete?.();
      resolve();
    });
  });
}

/**
 * Create info animation for form fields
 */
export function createInfoAnimation(element: HTMLElement, config: ValidationAnimationConfig): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      element.classList.add('info-state');
      config.onComplete?.();
      resolve();
      return;
    }

    // Add info class
    element.classList.add('info-state');

    // Create subtle glow animation
    const glowAnimation = element.animate([
      { 
        borderColor: 'var(--m3-outline)',
        boxShadow: '0 0 0 0 rgba(var(--m3-primary-rgb), 0)' 
      },
      { 
        borderColor: 'var(--m3-primary)',
        boxShadow: '0 0 0 1px rgba(var(--m3-primary-rgb), 0.1)' 
      },
      { 
        borderColor: 'var(--m3-primary)',
        boxShadow: '0 0 0 0 rgba(var(--m3-primary-rgb), 0)' 
      }
    ], {
      duration: config.duration || ANIMATION_DURATION.medium1,
      easing: MATERIAL3_EASING.standard,
      fill: 'forwards'
    });

    glowAnimation.addEventListener('finish', () => {
      config.onComplete?.();
      resolve();
    });
  });
}

/**
 * Clear validation state and animations
 */
export function clearValidationState(element: HTMLElement): void {
  element.classList.remove('error-state', 'success-state', 'warning-state', 'info-state');
  
  // Reset styles
  element.style.borderColor = '';
  element.style.boxShadow = '';
  element.style.transform = '';
}

/**
 * Animate form field validation based on type
 */
export function animateValidation(element: HTMLElement, config: ValidationAnimationConfig): Promise<void> {
  // Clear previous state
  clearValidationState(element);

  switch (config.type) {
    case 'error':
      return createErrorAnimation(element, config);
    case 'success':
      return createSuccessAnimation(element, config);
    case 'warning':
      return createWarningAnimation(element, config);
    case 'info':
      return createInfoAnimation(element, config);
    default:
      return Promise.resolve();
  }
}

/**
 * Create animated message display
 */
export function createMessageAnimation(
  messageElement: HTMLElement,
  message: string,
  type: ValidationAnimationType
): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      messageElement.textContent = message;
      messageElement.style.opacity = '1';
      resolve();
      return;
    }

    // Set message content
    messageElement.textContent = message;

    // Apply type-specific color
    const colorMap = {
      error: 'var(--m3-error)',
      success: 'var(--m3-tertiary)',
      warning: 'var(--m3-secondary)',
      info: 'var(--m3-primary)'
    };
    messageElement.style.color = colorMap[type];

    // Animate in
    const animation = messageElement.animate([
      { 
        opacity: 0,
        transform: 'translateY(-8px) scale(0.95)' 
      },
      { 
        opacity: 1,
        transform: 'translateY(0) scale(1)' 
      }
    ], {
      duration: ANIMATION_DURATION.short4,
      easing: MATERIAL3_EASING.expressiveEntrance,
      fill: 'forwards'
    });

    animation.addEventListener('finish', () => resolve());
  });
}

/**
 * Remove animated message
 */
export function removeMessageAnimation(messageElement: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      messageElement.textContent = '';
      messageElement.style.opacity = '0';
      resolve();
      return;
    }

    // Animate out
    const animation = messageElement.animate([
      { 
        opacity: 1,
        transform: 'translateY(0) scale(1)' 
      },
      { 
        opacity: 0,
        transform: 'translateY(-8px) scale(0.95)' 
      }
    ], {
      duration: ANIMATION_DURATION.short3,
      easing: MATERIAL3_EASING.expressiveExit,
      fill: 'forwards'
    });

    animation.addEventListener('finish', () => {
      messageElement.textContent = '';
      resolve();
    });
  });
}

/**
 * Create loading spinner animation for form submission
 */
export function createFormSubmissionAnimation(
  formElement: HTMLElement,
  submitButton: HTMLElement,
  loadingText: string = 'Submitting...'
): (() => void) {
  if (prefersReducedMotion()) {
    submitButton.textContent = loadingText;
    submitButton.setAttribute('disabled', 'true');
    formElement.style.opacity = '0.7';
    
    return () => {
      submitButton.removeAttribute('disabled');
      formElement.style.opacity = '';
    };
  }

  // Store original button content
  const originalContent = submitButton.innerHTML;
  
  // Create spinner
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top: 2px solid transparent;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
  `;
  
  // Update button
  submitButton.innerHTML = `${spinner.outerHTML}${loadingText}`;
  submitButton.setAttribute('disabled', 'true');
  
  // Animate spinner
  const spinnerElement = submitButton.querySelector('div') as HTMLElement;
  const spinAnimation = spinnerElement.animate([
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ], {
    duration: ANIMATION_DURATION.long2,
    iterations: Infinity,
    easing: 'linear'
  });

  // Animate form opacity
  const formAnimation = formElement.animate([
    { opacity: 1 },
    { opacity: 0.7 }
  ], {
    duration: ANIMATION_DURATION.short3,
    easing: MATERIAL3_EASING.standard,
    fill: 'forwards'
  });

  // Return cleanup function
  return () => {
    spinAnimation.cancel();
    formAnimation.cancel();
    
    submitButton.innerHTML = originalContent;
    submitButton.removeAttribute('disabled');
    formElement.style.opacity = '';
  };
}

/**
 * Create form completion animation with success feedback
 */
export function createFormCompletionAnimation(
  formElement: HTMLElement,
  successMessage: string = 'Success!'
): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      const messageEl = document.createElement('div');
      messageEl.textContent = successMessage;
      messageEl.style.cssText = `
        color: var(--m3-tertiary);
        text-align: center;
        font-weight: 500;
        margin: 1rem 0;
      `;
      formElement.appendChild(messageEl);
      resolve();
      return;
    }

    // Create success message element
    const messageEl = document.createElement('div');
    messageEl.textContent = successMessage;
    messageEl.style.cssText = `
      color: var(--m3-tertiary);
      text-align: center;
      font-weight: 500;
      margin: 1rem 0;
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    `;
    formElement.appendChild(messageEl);

    // Animate form out and message in
    const formAnimation = formElement.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.98)', opacity: 0.3 }
    ], {
      duration: ANIMATION_DURATION.medium1,
      easing: MATERIAL3_EASING.emphasized,
      fill: 'forwards'
    });

    const messageAnimation = messageEl.animate([
      { 
        opacity: 0,
        transform: 'translateY(20px) scale(0.9)' 
      },
      { 
        opacity: 1,
        transform: 'translateY(0) scale(1)' 
      }
    ], {
      duration: ANIMATION_DURATION.medium2,
      easing: MATERIAL3_EASING.expressiveEntrance,
      fill: 'forwards',
      delay: ANIMATION_DURATION.short2
    });

    Promise.all([
      new Promise(resolve => formAnimation.addEventListener('finish', resolve)),
      new Promise(resolve => messageAnimation.addEventListener('finish', resolve))
    ]).then(() => {
      // Add success pulse to message
      const pulseAnimation = messageEl.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ], {
        duration: ANIMATION_DURATION.medium1,
        easing: MATERIAL3_EASING.bounce
      });

      pulseAnimation.addEventListener('finish', () => resolve());
    });
  });
}