"use client";
import React from 'react';
import { useOptionalGlobalTimer } from '@/contexts/GlobalTimerContext';

type AddMinuteButtonProps = {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline-primary';
  className?: string;
  title?: string;
  ariaLabel?: string;
  'data-testid'?: string;
  disabled?: boolean;
};

/**
 * Reusable "Add 1 minute" button used in ActivityManager header and TimerDrawer quick actions.
 * - Default styling matches ActivityManager: outline-primary, size sm, icon + label "1 min"
 * - If no onClick provided, uses GlobalTimerContext.addOneMinute when available
 */
const AddMinuteButton: React.FC<AddMinuteButtonProps> = ({
  onClick,
  size = 'sm',
  variant = 'outline-primary',
  className = '',
  title = 'Add 1 minute to session duration',
  ariaLabel,
  'data-testid': dataTestId,
  disabled = false,
}) => {
  const ctx = useOptionalGlobalTimer();
  const handler = onClick ?? ctx?.addOneMinute ?? (() => {});

  const base = 'btn d-flex align-items-center';
  const sizeCls = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantCls = variant === 'primary' ? 'btn-primary' : 'btn-outline-primary';
  const classes = [base, sizeCls, variantCls, className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={handler}
      title={title}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      disabled={disabled}
    >
      <i className="bi bi-plus-circle me-2" aria-hidden="true" />
      <span>1 min</span>
    </button>
  );
};

export default AddMinuteButton;
