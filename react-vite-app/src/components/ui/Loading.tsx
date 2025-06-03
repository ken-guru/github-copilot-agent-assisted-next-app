import React from 'react';
import { cn } from '@/utils/cn';

export interface LoadingProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  text?: string;
  centered?: boolean;
  fullscreen?: boolean;
  className?: string;
  'aria-label'?: string;
}

const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  centered = false,
  fullscreen = false,
  className,
  'aria-label': ariaLabel = 'Loading',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  };

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
    xl: 'w-3 h-3',
  };

  const barSizeClasses = {
    sm: 'w-0.5 h-3',
    md: 'w-1 h-4',
    lg: 'w-1 h-5',
    xl: 'w-1.5 h-6',
  };

  const renderSpinner = () => (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={text ? undefined : ariaLabel}
      aria-hidden={text ? 'true' : undefined}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderDots = () => (
    <div
      className={cn('flex space-x-1', className)}
      role="status"
      aria-label={text ? undefined : ariaLabel}
      aria-hidden={text ? 'true' : undefined}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            dotSizeClasses[size],
            colorClasses[color].replace('text-', 'bg-')
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'animate-pulse rounded-full',
        sizeClasses[size],
        colorClasses[color].replace('text-', 'bg-'),
        className
      )}
      role="status"
      aria-label={text ? undefined : ariaLabel}
      aria-hidden={text ? 'true' : undefined}
    />
  );

  const renderBars = () => (
    <div
      className={cn('flex space-x-1', className)}
      role="status"
      aria-label={text ? undefined : ariaLabel}
      aria-hidden={text ? 'true' : undefined}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-sm animate-pulse',
            barSizeClasses[size],
            colorClasses[color].replace('text-', 'bg-')
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  const renderLoadingElement = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  const loadingElement = renderLoadingElement();

  const content = text ? (
    <div className="flex flex-col items-center space-y-2">
      {loadingElement}
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  ) : (
    loadingElement
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        {content}
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex min-h-[100px] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

Loading.displayName = 'Loading';

export { Loading };
