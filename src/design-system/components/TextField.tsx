/**
 * Material 3 TextField Component
 * Comprehensive text field implementation using Material 3 design tokens
 */

'use client';

import React from 'react';
import { Material3Colors } from '../tokens/colors';
import { Material3Typography } from '../tokens/typography';
import { Material3SpacingSystem } from '../tokens/spacing';
import { Material3ElevationSystem } from '../tokens/elevation';
import { MotionContainer } from './SharedMotion';

// TextField variant types
export type Material3TextFieldVariant = 'filled' | 'outlined';
export type Material3TextFieldSize = 'small' | 'medium' | 'large';
export type Material3ValidationState = 'default' | 'success' | 'warning' | 'error';

// TextField component props
export interface Material3TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  variant?: Material3TextFieldVariant;
  size?: Material3TextFieldSize;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  validation?: Material3ValidationState;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
  inputClassName?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Material3TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, Material3TextFieldProps>(({
  variant = 'filled',
  size = 'medium',
  label,
  placeholder,
  helperText,
  errorText,
  validation = 'default',
  disabled = false,
  required = false,
  readOnly = false,
  multiline = false,
  rows = 3,
  maxRows = 6,
  startIcon,
  endIcon,
  prefix,
  suffix,
  className = '',
  inputClassName = '',
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  ...props
}, ref) => {
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isDark, setIsDark] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  // Forward ref handling
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement | HTMLTextAreaElement);

  // Check for dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Check if field has value for label animation
  React.useEffect(() => {
    const currentValue = value !== undefined ? value : inputRef.current?.value || '';
    setHasValue(Boolean(currentValue));
  }, [value]);

  // Get design tokens
  const colors = isDark ? Material3Colors.dark : Material3Colors.light;
  const { base: spacing } = Material3SpacingSystem;
  const { scale: typography } = Material3Typography;

  // Determine current state colors
  const getStateColors = () => {
    if (disabled) {
      return {
        border: Material3Colors.utils.withAlpha(colors.onSurface, 0.12),
        background: Material3Colors.utils.withAlpha(colors.onSurface, 0.04),
        text: Material3Colors.utils.withAlpha(colors.onSurface, 0.38),
        label: Material3Colors.utils.withAlpha(colors.onSurface, 0.38),
        helper: Material3Colors.utils.withAlpha(colors.onSurface, 0.38)
      };
    }

    switch (validation) {
      case 'error':
        return {
          border: colors.error,
          background: variant === 'filled' ? colors.surfaceContainerHighest : colors.surface,
          text: colors.onSurface,
          label: colors.error,
          helper: colors.error
        };
      case 'success':
        return {
          border: colors.tertiary, // Using tertiary for success state
          background: variant === 'filled' ? colors.surfaceContainerHighest : colors.surface,
          text: colors.onSurface,
          label: colors.tertiary,
          helper: colors.tertiary
        };
      case 'warning':
        return {
          border: colors.secondary, // Using secondary for warning state
          background: variant === 'filled' ? colors.surfaceContainerHighest : colors.surface,
          text: colors.onSurface,
          label: colors.secondary,
          helper: colors.secondary
        };
      default:
        return {
          border: isFocused ? colors.primary : colors.outline,
          background: variant === 'filled' ? colors.surfaceContainerHighest : colors.surface,
          text: colors.onSurface,
          label: isFocused || hasValue ? colors.primary : Material3Colors.utils.withAlpha(colors.onSurface, 0.6),
          helper: Material3Colors.utils.withAlpha(colors.onSurface, 0.6)
        };
    }
  };

  const stateColors = getStateColors();

  // Size configurations
  const sizeConfig = {
    small: {
      height: '2.5rem', // 40px
      paddingX: spacing.small4, // 12px
      paddingY: spacing.small3, // 8px
      fontSize: typography.bodyMedium.fontSize,
      iconSize: '1rem'
    },
    medium: {
      height: '3.5rem', // 56px
      paddingX: spacing.medium2, // 16px
      paddingY: spacing.small4, // 12px
      fontSize: typography.bodyLarge.fontSize,
      iconSize: '1.25rem'
    },
    large: {
      height: '4rem', // 64px
      paddingX: spacing.medium3, // 20px
      paddingY: spacing.medium2, // 16px
      fontSize: typography.titleMedium.fontSize,
      iconSize: '1.5rem'
    }
  };

  const currentSize = sizeConfig[size];

  // Handle focus events
  const handleFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(Boolean(event.target.value));
    onChange?.(event);
  }, [onChange]);

  // Container styles
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  };

  // Field container styles
  const fieldContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: multiline ? 'auto' : currentSize.height,
    backgroundColor: stateColors.background,
    borderRadius: variant === 'filled' ? '0.25rem 0.25rem 0 0' : '0.25rem',
    border: variant === 'outlined' ? `1px solid ${stateColors.border}` : 'none',
    borderBottom: variant === 'filled' ? `1px solid ${stateColors.border}` : undefined,
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    overflow: 'hidden'
  };

  // Focus ring styles
  const focusStyles = isFocused ? {
    borderColor: stateColors.border,
    borderWidth: variant === 'outlined' ? '2px' : undefined,
    borderBottomWidth: variant === 'filled' ? '2px' : undefined,
    outline: 'none'
  } : {};

  // Input/textarea styles
  const inputStyles: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: stateColors.text,
    fontSize: currentSize.fontSize,
    fontFamily: typography.bodyLarge.fontFamily,
    fontWeight: typography.bodyLarge.fontWeight,
    lineHeight: typography.bodyLarge.lineHeight,
    padding: `${currentSize.paddingY} ${startIcon || prefix ? spacing.small2 : currentSize.paddingX} ${currentSize.paddingY} ${endIcon || suffix ? spacing.small2 : currentSize.paddingX}`,
    paddingLeft: startIcon || prefix ? spacing.small2 : currentSize.paddingX,
    paddingRight: endIcon || suffix ? spacing.small2 : currentSize.paddingX,
    paddingTop: label ? spacing.medium3 : currentSize.paddingY,
    paddingBottom: label ? spacing.small2 : currentSize.paddingY,
    resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? `${rows * 1.5}rem` : 'auto',
    maxHeight: multiline && maxRows ? `${maxRows * 1.5}rem` : 'auto'
  };

  // Label styles
  const labelStyles: React.CSSProperties = {
    position: 'absolute',
    left: startIcon || prefix ? `calc(${currentSize.paddingX} + ${currentSize.iconSize} + ${spacing.small2})` : currentSize.paddingX,
    top: isFocused || hasValue ? spacing.small2 : '50%',
    transform: isFocused || hasValue ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: isFocused || hasValue ? typography.bodySmall.fontSize : currentSize.fontSize,
    fontWeight: typography.bodySmall.fontWeight,
    color: stateColors.label,
    pointerEvents: 'none',
    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: 1,
    backgroundColor: variant === 'outlined' && (isFocused || hasValue) ? stateColors.background : 'transparent',
    padding: variant === 'outlined' && (isFocused || hasValue) ? `0 ${spacing.small1}` : '0'
  };

  // Icon styles
  const iconStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: currentSize.iconSize,
    height: currentSize.iconSize,
    fontSize: currentSize.iconSize,
    color: stateColors.text,
    flexShrink: 0
  };

  // Prefix/suffix styles
  const affixStyles: React.CSSProperties = {
    fontSize: currentSize.fontSize,
    color: Material3Colors.utils.withAlpha(stateColors.text, 0.7),
    whiteSpace: 'nowrap',
    userSelect: 'none'
  };

  // Helper text styles
  const helperTextStyles: React.CSSProperties = {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight,
    color: stateColors.helper,
    marginTop: spacing.small1,
    paddingLeft: currentSize.paddingX,
    paddingRight: currentSize.paddingX
  };

  // Determine the display text for helper/error
  const displayHelperText = errorText || helperText;

  return (
    <MotionContainer
      preset="fadeIn"
      trigger={true}
      duration="short2"
    >
      <div style={containerStyles} className={className}>
        {/* Field container */}
        <div 
          style={{
            ...fieldContainerStyles,
            ...focusStyles
          }}
        >
          {/* Start icon */}
          {startIcon && (
            <div style={{ ...iconStyles, marginLeft: currentSize.paddingX }}>
              {startIcon}
            </div>
          )}

          {/* Prefix */}
          {prefix && (
            <span style={{ ...affixStyles, marginLeft: startIcon ? spacing.small2 : currentSize.paddingX }}>
              {prefix}
            </span>
          )}

          {/* Input/Textarea */}
          {multiline ? (
            <textarea
              ref={inputRef as React.Ref<HTMLTextAreaElement>}
              style={inputStyles}
              className={inputClassName}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              placeholder={isFocused ? placeholder : ''}
              value={value as string}
              defaultValue={defaultValue as string}
              rows={rows}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={validation === 'error'}
              aria-describedby={displayHelperText ? `${props.id || 'textfield'}-helper` : undefined}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              type="text"
              style={inputStyles}
              className={inputClassName}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              placeholder={isFocused ? placeholder : ''}
              value={value}
              defaultValue={defaultValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={validation === 'error'}
              aria-describedby={displayHelperText ? `${props.id || 'textfield'}-helper` : undefined}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {/* Label */}
          {label && (
            <label style={labelStyles}>
              {label}
              {required && <span style={{ color: colors.error }}> *</span>}
            </label>
          )}

          {/* Suffix */}
          {suffix && (
            <span style={{ ...affixStyles, marginRight: endIcon ? spacing.small2 : currentSize.paddingX }}>
              {suffix}
            </span>
          )}

          {/* End icon */}
          {endIcon && (
            <div style={{ ...iconStyles, marginRight: currentSize.paddingX }}>
              {endIcon}
            </div>
          )}
        </div>

        {/* Helper/Error text */}
        {displayHelperText && (
          <div 
            id={`${props.id || 'textfield'}-helper`}
            style={helperTextStyles}
          >
            {displayHelperText}
          </div>
        )}
      </div>
    </MotionContainer>
  );
});

Material3TextField.displayName = 'Material3TextField';

export default Material3TextField;