import React from 'react';
import styles from './Material3InputGroup.module.css';

export interface Material3InputGroupProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'attached' | 'spaced';
  align?: 'start' | 'center' | 'end' | 'stretch';
  'data-testid'?: string;
}

export const Material3InputGroup: React.FC<Material3InputGroupProps> = ({
  children,
  className,
  variant = 'attached',
  align = 'stretch',
  'data-testid': dataTestId,
}) => {
  const containerClasses = [
    styles.inputGroup,
    styles[variant],
    styles[`align-${align}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {children}
    </div>
  );
};

export default Material3InputGroup;