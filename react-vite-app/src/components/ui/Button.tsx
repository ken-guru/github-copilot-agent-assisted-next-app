import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  className?: string
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button'
  children: ReactNode
}

interface ButtonAsAnchor extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  as: 'a'
  children: ReactNode
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-background-alt text-foreground hover:bg-background-muted border border-border',
  outline: 'border-2 border-border bg-transparent text-foreground hover:bg-background-alt',
  ghost: 'bg-transparent text-foreground hover:bg-background-alt'
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg'
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    className = '', 
    children, 
    as = 'button',
    ...props 
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      rounded-button font-medium
      transition-colors duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      disabled:opacity-50 disabled:pointer-events-none
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.trim()

    const content = (
      <>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {loading ? 'Loading...' : children}
      </>
    )

    if (as === 'a') {
      const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseStyles}
          {...anchorProps}
        >
          {content}
        </a>
      )
    }

    const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={loading || buttonProps.disabled}
        className={baseStyles}
        {...buttonProps}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
