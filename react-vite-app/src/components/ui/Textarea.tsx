import React from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  success?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = 'md', error = false, success = false, resize = 'none', ...props }, ref) => {
    const sizeClasses = {
      sm: 'min-h-[60px] px-2 py-1 text-sm',
      md: 'min-h-[100px] px-3 py-2',
      lg: 'min-h-[140px] px-4 py-3 text-lg',
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const stateClasses = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:focus:border-green-400 dark:focus:ring-green-400',
    };

    const getStateClasses = () => {
      if (error) return stateClasses.error;
      if (success) return stateClasses.success;
      return stateClasses.default;
    };

    return (
      <textarea
        className={cn(
          // Base styles
          'flex w-full rounded-md border bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Dark mode
          'dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400',
          // Size classes
          sizeClasses[size],
          // Resize classes
          resizeClasses[resize],
          // State classes
          getStateClasses(),
          className
        )}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
