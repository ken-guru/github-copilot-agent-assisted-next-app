import React from 'react';
import { cn } from '@/utils/cn';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  success?: boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'md', error = false, success = false, placeholder, children, multiple = false, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3',
      lg: 'h-12 px-4 text-lg',
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
      <select
        className={cn(
          // Base styles
          'flex w-full rounded-md border bg-white text-gray-900 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Dark mode
          'dark:bg-gray-800 dark:text-gray-100',
          // Size classes (with conditional height for multiple)
          multiple ? 'min-h-[100px] px-3 py-2' : sizeClasses[size],
          // State classes
          getStateClasses(),
          // Select-specific styles
          multiple ? '' : 'pr-8 appearance-none bg-no-repeat bg-right bg-[length:1.5em_1.5em] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")]',
          className
        )}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        multiple={multiple}
        {...props}
      >
        {placeholder && !multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export { Select };
