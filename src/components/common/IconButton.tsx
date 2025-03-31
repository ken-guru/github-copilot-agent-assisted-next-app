import React from 'react';
import styles from './IconButton.module.css';

/**
 * Icon mapping for common icon types
 */
const ICON_PATHS = {
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  play: 'M8 5v14l11-7z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  minus: 'M19 13H5v-2h14v2z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
};

interface IconButtonProps {
  /**
   * Icon to display in the button
   */
  icon: keyof typeof ICON_PATHS | string;
  
  /**
   * Button label (used for aria-label and title)
   */
  label: string;
  
  /**
   * Click handler
   */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Disable the button
   */
  disabled?: boolean;
  
  /**
   * Button variant (controls styling)
   */
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success';
  
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Test ID for testing
   */
  testId?: string;
  
  /**
   * Additional button props
   */
  [key: string]: any;
}

/**
 * IconButton component that displays an icon with button functionality
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onClick,
  className = '',
  disabled = false,
  variant = 'default',
  size = 'medium',
  testId,
  ...rest
}) => {
  // Determine the icon path
  const iconPath = ICON_PATHS[icon as keyof typeof ICON_PATHS] || icon;
  
  // Compose CSS classes
  const buttonClasses = [
    styles.iconButton,
    variant !== 'default' ? styles[variant] : '',
    size !== 'medium' ? styles[size] : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      data-testid={testId}
      {...rest}
    >
      <span className={styles.icon}>
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
          <path d={iconPath} />
        </svg>
      </span>
    </button>
  );
};

export default IconButton;