import React, { useState, useEffect, useRef } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './MobileNavigation.module.css';

export interface NavigationView {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileNavigationProps {
  views: NavigationView[];
  activeView: string;
  onViewChange: (viewId: string) => void;
}

/**
 * MobileNavigation component that provides a touch-optimized navigation bar for switching views
 * Only renders on mobile viewports and supports both button taps and swipe gestures
 */
const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  views, 
  activeView, 
  onViewChange 
}) => {
  const { isMobile, hasTouch } = useViewport();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const previousActiveView = useRef(activeView);
  
  // Touch handling state
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    isSwiping: false,
  });
  
  // Don't render on desktop
  if (!isMobile) {
    return null;
  }
  
  // Handle view change animation
  useEffect(() => {
    if (previousActiveView.current !== activeView) {
      setIsAnimating(true);
      
      // Set a timeout to remove the animation class
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      // Update previous view ref
      previousActiveView.current = activeView;
      
      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [activeView]);
  
  // Show swipe hint after a delay on first render
  useEffect(() => {
    if (hasTouch) {
      const timer = setTimeout(() => {
        setShowSwipeHint(true);
        
        // Hide hint after showing it for a few seconds
        const hideTimer = setTimeout(() => {
          setShowSwipeHint(false);
        }, 3000);
        
        return () => clearTimeout(hideTimer);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasTouch]);
  
  // Find the current index of the active view
  const activeIndex = views.findIndex(view => view.id === activeView);
  
  // Handle button click
  const handleButtonClick = (viewId: string) => {
    if (viewId !== activeView) {
      onViewChange(viewId);
    }
  };
  
  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasTouch) return;
    
    setTouchState({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      isSwiping: true,
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.isSwiping) return;
    
    // Don't do anything special during the move, just let the browser handle the touch
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.isSwiping) return;
    
    // Get touch end position
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    // Calculate distance moved
    const deltaX = touchState.startX - endX;
    const deltaY = Math.abs(touchState.startY - endY);
    
    // Only consider horizontal swipes (ignore diagonal/vertical)
    if (deltaY < 50) {
      // Minimum distance threshold for a swipe
      const SWIPE_THRESHOLD = 80;
      
      // Check swipe direction and distance
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        // Swipe left (next view)
        if (deltaX > 0 && activeIndex < views.length - 1) {
          onViewChange(views[activeIndex + 1].id);
        }
        // Swipe right (previous view)
        else if (deltaX < 0 && activeIndex > 0) {
          onViewChange(views[activeIndex - 1].id);
        }
      }
    }
    
    // Reset touch state
    setTouchState({
      startX: 0,
      startY: 0,
      isSwiping: false,
    });
  };
  
  // Container class combining fixed classes with conditional ones
  const containerClass = `${styles.mobileNav} ${isAnimating ? styles.animating : ''} ${showSwipeHint ? styles.showSwipeHint : ''}`;
  
  return (
    <nav 
      className={containerClass} 
      data-testid="mobile-navigation"
      role="navigation"
      aria-label="View Navigation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.swipeHint} />
      
      {views.map(view => (
        <button
          key={view.id}
          className={`${styles.navButton} ${activeView === view.id ? styles.activeButton : ''}`}
          onClick={() => handleButtonClick(view.id)}
          aria-pressed={activeView === view.id}
          data-testid={`nav-button-${view.id}`}
        >
          <span className={styles.icon}>{view.icon}</span>
          <span className={styles.label}>{view.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNavigation;
