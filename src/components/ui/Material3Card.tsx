import React, { forwardRef } from 'react';
import { Material3Container, Material3ContainerProps } from './Material3Container';
import styles from './Material3Card.module.css';

export interface Material3CardProps extends Omit<Material3ContainerProps, 'variant'> {
  /** Card variant */
  variant?: 'elevated' | 'filled' | 'outlined';
  /** Card header content */
  header?: React.ReactNode;
  /** Card footer content */
  footer?: React.ReactNode;
  /** Enable card actions */
  actions?: React.ReactNode;
  /** Card padding variant */
  padding?: 'none' | 'compact' | 'comfortable' | 'spacious';
}

export const Material3Card = forwardRef<HTMLDivElement, Material3CardProps>(
  ({
    variant = 'elevated',
    header,
    footer,
    actions,
    padding = 'comfortable',
    shape = 'cardElevated',
    elevation = 'level1',
    className = '',
    children,
    ...props
  }, ref) => {
    const cardClasses = [
      styles.card,
      styles[`padding-${padding}`],
      className
    ].filter(Boolean).join(' ');

    return (
      <Material3Container
        ref={ref}
        variant={variant}
        shape={shape}
        elevation={elevation}
        className={cardClasses}
        {...props}
      >
        {header && (
          <div className={styles.header}>
            {header}
          </div>
        )}
        
        <div className={styles.body}>
          {children}
        </div>
        
        {(footer || actions) && (
          <div className={styles.footer}>
            {footer}
            {actions && (
              <div className={styles.actions}>
                {actions}
              </div>
            )}
          </div>
        )}
      </Material3Container>
    );
  }
);

Material3Card.displayName = 'Material3Card';