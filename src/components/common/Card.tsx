import React from 'react';
import styles from './Card.module.css';

type PaddingSize = 'small' | 'medium' | 'large';

interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Optional card title
   */
  title?: React.ReactNode;
  
  /**
   * Optional actions to display in the header (e.g. buttons)
   */
  actions?: React.ReactNode;
  
  /**
   * Whether to apply a shadow effect
   */
  elevated?: boolean;
  
  /**
   * Padding size
   */
  padding?: PaddingSize;
  
  /**
   * Whether to remove the border
   */
  borderless?: boolean;
  
  /**
   * Make the card take the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Test ID for testing
   */
  testId?: string;
}

/**
 * Card component for containing content with consistent styling
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  actions,
  elevated = false,
  padding = 'medium',
  borderless = false,
  fullWidth = false,
  className = '',
  testId = 'card',
}) => {
  // Compose CSS classes
  const cardClasses = [
    styles.card,
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    elevated ? styles.elevated : '',
    borderless ? styles.borderless : '',
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');
  
  const hasHeader = title || actions;
  
  return (
    <div 
      className={cardClasses}
      data-testid={testId}
    >
      {hasHeader && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Card;