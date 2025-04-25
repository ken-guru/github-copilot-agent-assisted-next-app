import React, { ButtonHTMLAttributes } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './TouchableButton.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface TouchableButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Click handler function
   */
  onClick: () => void;
  
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Whether button should take full width of container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;
  
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * TouchableButton - A responsive button component that adapts to touch devices
 * 
 * This component provides consistent button styling with proper touch targets
 * on mobile devices while maintaining a cohesive look on desktop.
 */
const TouchableButton: React.FC<TouchableButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
  ...rest
}) => {
  const { hasTouch } = useViewport();
  
  // Combine CSS classes
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    hasTouch ? styles.touchFriendly : '',
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export default TouchableButton;
