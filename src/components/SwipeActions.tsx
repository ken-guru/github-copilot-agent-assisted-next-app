import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './SwipeActions.module.css';

type SwipeAction = {
  label: string;
  icon?: React.ReactNode;
  handler: () => void;
  color: string;
};

interface SwipeActionsProps {
  children: React.ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  actionThreshold?: number;
  showActionButtons?: boolean;
  useHapticFeedback?: boolean;
}

/**
 * SwipeActions component adds left and right swipe actions to a child component.
 * Commonly used for list items to reveal actions like delete, archive, etc.
 */
const SwipeActions: React.FC<SwipeActionsProps> = ({
  children,
  leftAction,
  rightAction,
  actionThreshold = 80,
  showActionButtons = false,
  useHapticFeedback = true
}) => {
  const { isMobile, hasTouch } = useViewport();
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [thresholdCrossed, setThresholdCrossed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const startX = useRef(0);
  const currentX = useRef(0);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    setIsSwiping(true);
    setSwipeOffset(0);
    setThresholdCrossed(false);
  }, []);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping) return;
    
    currentX.current = e.touches[0].clientX;
    const delta = currentX.current - startX.current;
    
    // Check if we're crossing the threshold from uncrossed to crossed
    if (!thresholdCrossed && Math.abs(delta) >= actionThreshold) {
      setThresholdCrossed(true);
      
      // Provide haptic feedback
      if (useHapticFeedback && navigator.vibrate) {
        navigator.vibrate([10]);
      }
    }
    
    // Only allow swipe in direction where we have an action
    if ((delta > 0 && !leftAction) || (delta < 0 && !rightAction)) {
      return;
    }
    
    setSwipeOffset(delta);
    
    // Prevent scrolling when swiping horizontally
    if (Math.abs(delta) > 10) {
      e.preventDefault();
    }
  }, [isSwiping, actionThreshold, useHapticFeedback, leftAction, rightAction, thresholdCrossed]);
  
  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;
    
    setIsSwiping(false);
    
    // If swiped far enough, trigger action
    if (swipeOffset >= actionThreshold && leftAction) {
      leftAction.handler();
    } else if (swipeOffset <= -actionThreshold && rightAction) {
      rightAction.handler();
    }
    
    // Reset swipe offset with animation
    setSwipeOffset(0);
    setThresholdCrossed(false);
  }, [isSwiping, swipeOffset, actionThreshold, leftAction, rightAction]);
  
  // Don't apply swipe actions on non-touch or non-mobile devices
  const enableSwipeActions = isMobile && hasTouch && (leftAction || rightAction);
  
  // Determine container class name
  const containerClass = `
    ${styles.container}
    ${enableSwipeActions ? styles.swipeContainer : ''}
    ${prefersReducedMotion ? styles.reduceMotion : ''}
  `;
  
  if (!enableSwipeActions) {
    // For desktop or when no actions, just render children
    return (
      <div className={containerClass} data-testid="swipe-actions-container">
        {children}
      </div>
    );
  }
  
  return (
    <div className={containerClass} data-testid="swipe-actions-container">
      {/* Actions background */}
      <div className={styles.actionsContainer}>
        {leftAction && (
          <div 
            className={styles.actionLeft} 
            style={{ backgroundColor: leftAction.color }}
            data-testid="left-action"
          >
            {leftAction.icon && <div className={styles.actionIcon}>{leftAction.icon}</div>}
            <div className={styles.actionLabel}>{leftAction.label}</div>
          </div>
        )}
        
        {rightAction && (
          <div 
            className={styles.actionRight} 
            style={{ backgroundColor: rightAction.color }}
            data-testid="right-action"
          >
            {rightAction.icon && <div className={styles.actionIcon}>{rightAction.icon}</div>}
            <div className={styles.actionLabel}>{rightAction.label}</div>
          </div>
        )}
      </div>
      
      {/* Content with swipe behavior */}
      <div 
        className={styles.content}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-testid="swipe-content"
      >
        {children}
      </div>
      
      {/* Optional button alternatives for accessibility */}
      {showActionButtons && (
        <div className={styles.buttonContainer}>
          {leftAction && (
            <button
              className={`${styles.actionButton} ${styles.leftButton}`}
              style={{ backgroundColor: leftAction.color }}
              onClick={leftAction.handler}
              aria-label={leftAction.label}
            >
              {leftAction.icon && <span className={styles.actionIcon}>{leftAction.icon}</span>}
              {leftAction.label}
            </button>
          )}
          
          {rightAction && (
            <button
              className={`${styles.actionButton} ${styles.rightButton}`}
              style={{ backgroundColor: rightAction.color }}
              onClick={rightAction.handler}
              aria-label={rightAction.label}
            >
              {rightAction.icon && <span className={styles.actionIcon}>{rightAction.icon}</span>}
              {rightAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SwipeActions;
