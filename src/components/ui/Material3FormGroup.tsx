import React from 'react';
import styles from './Material3FormGroup.module.css';

export interface Material3FormGroupProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'compact' | 'comfortable' | 'spacious';
  direction?: 'column' | 'row';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  'data-testid'?: string;
}

export const Material3FormGroup: React.FC<Material3FormGroupProps> = ({
  children,
  className,
  spacing = 'comfortable',
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  'data-testid': dataTestId,
}) => {
  const containerClasses = [
    styles.formGroup,
    styles[spacing],
    styles[direction],
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    wrap && styles.wrap,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {children}
    </div>
  );
};

export default Material3FormGroup;