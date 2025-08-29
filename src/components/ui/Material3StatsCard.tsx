import React, { forwardRef } from 'react';
import { Material3Container, Material3ContainerProps } from './Material3Container';
import styles from './Material3StatsCard.module.css';

export interface Material3StatsCardProps extends Omit<Material3ContainerProps, 'variant' | 'children'> {
  /** Stats card variant */
  variant?: 'elevated' | 'filled' | 'outlined';
  /** Label for the statistic */
  label: string;
  /** Value to display */
  value: string | number;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional trend indicator */
  trend?: 'up' | 'down' | 'neutral';
  /** Optional secondary value */
  secondaryValue?: string;
  /** Color emphasis for the value */
  valueColor?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Size variant */
  size?: 'compact' | 'comfortable' | 'spacious';
}

export const Material3StatsCard = forwardRef<HTMLDivElement, Material3StatsCardProps>(
  ({
    variant = 'elevated',
    label,
    value,
    icon,
    trend,
    secondaryValue,
    valueColor = 'default',
    size = 'comfortable',
    shape = 'summaryCard',
    elevation = 'level1',
    interactive = false,
    className = '',
    ...props
  }, ref) => {
    const statsClasses = [
      styles.statsCard,
      styles[`size-${size}`],
      styles[`value-color-${valueColor}`],
      trend && styles[`trend-${trend}`],
      className
    ].filter(Boolean).join(' ');

    return (
      <Material3Container
        ref={ref}
        variant={variant}
        shape={shape}
        elevation={elevation}
        interactive={interactive}
        className={statsClasses}
        {...props}
      >
        <div className={styles.content}>
          {icon && (
            <div className={styles.icon}>
              {icon}
            </div>
          )}
          
          <div className={styles.textContent}>
            <div className={styles.label}>
              {label}
            </div>
            
            <div className={styles.value}>
              {value}
              {trend && (
                <span className={styles.trendIndicator} aria-label={`Trend: ${trend}`}>
                  {trend === 'up' && '↗'}
                  {trend === 'down' && '↘'}
                  {trend === 'neutral' && '→'}
                </span>
              )}
            </div>
            
            {secondaryValue && (
              <div className={styles.secondaryValue}>
                {secondaryValue}
              </div>
            )}
          </div>
        </div>
      </Material3Container>
    );
  }
);

Material3StatsCard.displayName = 'Material3StatsCard';