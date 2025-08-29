/**
 * Material 3 Expressive Mobile-Optimized Layout Component
 * 
 * A layout component that provides responsive, touch-optimized layouts
 * with proper spacing, safe areas, and orientation handling.
 */

import React, { useEffect, useState } from 'react';
import { useMobileOptimizations, useOrientationChange } from '../../hooks/useMobileOptimizations';
import styles from './Material3MobileLayout.module.css';

export interface Material3MobileLayoutProps {
  /** Layout variant */
  variant?: 'page' | 'modal' | 'card' | 'list';
  
  /** Whether to apply safe area insets */
  useSafeArea?: boolean;
  
  /** Whether to handle orientation changes */
  handleOrientation?: boolean;
  
  /** Custom spacing override */
  spacing?: 'compact' | 'comfortable' | 'spacious';
  
  /** Whether to enable touch-optimized scrolling */
  touchScroll?: boolean;
  
  /** Header content */
  header?: React.ReactNode;
  
  /** Footer content */
  footer?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children content */
  children: React.ReactNode;
}

export const Material3MobileLayout: React.FC<Material3MobileLayoutProps> = ({
  variant = 'page',
  useSafeArea = true,
  handleOrientation = true,
  spacing = 'comfortable',
  touchScroll = true,
  header,
  footer,
  className = '',
  children,
}) => {
  const { isMobile, isTablet, orientation, viewportSize } = useMobileOptimizations();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle orientation changes with smooth transitions
  useOrientationChange((newOrientation) => {
    if (handleOrientation) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  });
  
  // Determine layout classes
  const layoutClasses = [
    styles.layout,
    styles[variant],
    styles[spacing],
    isMobile && styles.mobile,
    isTablet && styles.tablet,
    styles[orientation],
    styles[viewportSize],
    useSafeArea && styles.safeArea,
    touchScroll && styles.touchScroll,
    isTransitioning && styles.transitioning,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={layoutClasses}>
      {header && (
        <header className={styles.header}>
          {header}
        </header>
      )}
      
      <main className={styles.main}>
        {children}
      </main>
      
      {footer && (
        <footer className={styles.footer}>
          {footer}
        </footer>
      )}
    </div>
  );
};

/**
 * Mobile-optimized container component
 */
export interface Material3MobileContainerProps {
  /** Container size */
  size?: 'small' | 'medium' | 'large' | 'full';
  
  /** Whether to center the container */
  centered?: boolean;
  
  /** Custom padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children content */
  children: React.ReactNode;
}

export const Material3MobileContainer: React.FC<Material3MobileContainerProps> = ({
  size = 'medium',
  centered = false,
  padding = 'medium',
  className = '',
  children,
}) => {
  const { isMobile, viewportSize } = useMobileOptimizations();
  
  const containerClasses = [
    styles.container,
    styles[`size-${size}`],
    styles[`padding-${padding}`],
    centered && styles.centered,
    isMobile && styles.mobileContainer,
    styles[`viewport-${viewportSize}`],
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

/**
 * Mobile-optimized grid component
 */
export interface Material3MobileGridProps {
  /** Number of columns */
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  
  /** Gap between grid items */
  gap?: 'small' | 'medium' | 'large';
  
  /** Whether to use auto-fit columns */
  autoFit?: boolean;
  
  /** Minimum column width for auto-fit */
  minColumnWidth?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children content */
  children: React.ReactNode;
}

export const Material3MobileGrid: React.FC<Material3MobileGridProps> = ({
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'medium',
  autoFit = false,
  minColumnWidth = '250px',
  className = '',
  children,
}) => {
  const { viewportSize } = useMobileOptimizations();
  
  // Determine number of columns based on viewport
  const getColumns = (): number => {
    if (typeof columns === 'number') return columns;
    
    switch (viewportSize) {
      case 'xs':
        return columns.xs || 1;
      case 'sm':
        return columns.sm || 2;
      case 'md':
        return columns.md || 3;
      case 'lg':
      case 'xl':
      case 'xxl':
        return columns.lg || 4;
      default:
        return 2;
    }
  };
  
  const gridClasses = [
    styles.grid,
    styles[`gap-${gap}`],
    autoFit && styles.autoFit,
    className,
  ].filter(Boolean).join(' ');
  
  const gridStyle = autoFit
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))` }
    : { gridTemplateColumns: `repeat(${getColumns()}, 1fr)` };
  
  return (
    <div className={gridClasses} style={gridStyle}>
      {children}
    </div>
  );
};

/**
 * Mobile-optimized stack component
 */
export interface Material3MobileStackProps {
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  
  /** Gap between stack items */
  gap?: 'small' | 'medium' | 'large';
  
  /** Alignment of items */
  align?: 'start' | 'center' | 'end' | 'stretch';
  
  /** Justification of items */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  /** Whether to wrap items */
  wrap?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children content */
  children: React.ReactNode;
}

export const Material3MobileStack: React.FC<Material3MobileStackProps> = ({
  direction = 'vertical',
  gap = 'medium',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  children,
}) => {
  const stackClasses = [
    styles.stack,
    styles[`direction-${direction}`],
    styles[`gap-${gap}`],
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    wrap && styles.wrap,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
};