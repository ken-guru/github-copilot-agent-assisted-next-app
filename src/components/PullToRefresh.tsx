import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './PullToRefresh.module.css';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  pullThreshold?: number;
  showRefreshButton?: boolean;
  refreshButtonText?: string;
  disablePullToRefresh?: boolean;
  useHapticFeedback?: boolean;
}

/**
 * PullToRefresh component that adds pull-to-refresh functionality
 * to its children on mobile touch devices.
 */
const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  pullThreshold = 100,
  showRefreshButton = false,
  refreshButtonText = "Refresh",
  disablePullToRefresh = false,
  useHapticFeedback = true
}) => {
  const { isMobile, hasTouch } = useViewport();
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReadyToRefresh, setIsReadyToRefresh] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    if (disablePullToRefresh || isRefreshing) return;
    
    // Only trigger pull if we're at the top of the container
    const container = containerRef.current;
    if (container && container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setIsPulling(true);
    setPullDistance(0);
  }, [disablePullToRefresh, isRefreshing]);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPulling) return;
    
    currentY.current = e.touches[0].clientY;
    const delta = Math.max(0, currentY.current - startY.current);
    
    // Apply resistance for more natural feel - initially easy to pull but gets harder
    const pullWithResistance = Math.min(delta * 0.5, pullThreshold * 1.5);
    
    setPullDistance(pullWithResistance);
    setIsReadyToRefresh(pullWithResistance >= pullThreshold);
    
    // Prevent scrolling if pulling
    if (delta > 5) {
      e.preventDefault();
    }
  }, [isPulling, pullThreshold]);
  
  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    // If pulled far enough, trigger refresh
    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true);
      
      // Provide haptic feedback if enabled
      if (useHapticFeedback && navigator.vibrate) {
        navigator.vibrate([15]);
      }
      
      try {
        await onRefresh();
      } finally {
        // Set a minimum display time for the loading state
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsReadyToRefresh(false);
        }, 500);
      }
    } else {
      // Reset pull distance with animation
      setPullDistance(0);
      setIsReadyToRefresh(false);
    }
  }, [isPulling, pullDistance, pullThreshold, onRefresh, useHapticFeedback]);
  
  // Handle button refresh
  const handleButtonRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      await onRefresh();
    } finally {
      // Set a minimum display time for the loading state
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [isRefreshing, onRefresh]);
  
  // Don't apply pull-to-refresh on non-touch or non-mobile devices
  const enablePullToRefresh = isMobile && hasTouch && !disablePullToRefresh;
  
  // Determine container class name
  const containerClass = `
    ${styles.container}
    ${enablePullToRefresh ? styles.pullToRefresh : ''}
    ${prefersReducedMotion ? styles.reduceMotion : ''}
  `;
  
  // Determine indicator class name
  const indicatorClass = `
    ${styles.indicator}
    ${isReadyToRefresh ? styles.readyToRefresh : ''}
  `;
  
  return (
    <div 
      ref={containerRef}
      className={containerClass}
      onTouchStart={enablePullToRefresh ? handleTouchStart : undefined}
      onTouchMove={enablePullToRefresh ? handleTouchMove : undefined}
      onTouchEnd={enablePullToRefresh ? handleTouchEnd : undefined}
      data-testid="pull-to-refresh-container"
    >
      {/* Pull indicator */}
      {enablePullToRefresh && (
        <div 
          className={indicatorClass}
          style={{ transform: `translateY(${pullDistance}px)` }}
          data-testid="pull-indicator"
        >
          {isRefreshing ? (
            <div className={styles.spinnerContainer} data-testid="refresh-loading-indicator">
              <div className={styles.spinner} />
            </div>
          ) : (
            <>
              <div className={styles.arrowIcon}>
                {/* Simple down arrow */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
              <div className={styles.refreshText}>
                {isReadyToRefresh ? 'Release to refresh' : 'Pull to refresh'}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Content */}
      {children}
      
      {/* Optional refresh button for accessibility */}
      {showRefreshButton && (
        <div className={styles.refreshButtonContainer}>
          <button 
            className={styles.refreshButton}
            onClick={handleButtonRefresh}
            disabled={isRefreshing}
            aria-label={refreshButtonText}
          >
            {isRefreshing ? 'Loading...' : refreshButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default PullToRefresh;
