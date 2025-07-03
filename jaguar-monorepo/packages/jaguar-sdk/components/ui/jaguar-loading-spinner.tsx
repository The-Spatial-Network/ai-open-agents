'use client';

import { cn } from '@/lib/utils';

interface JaguarLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'gradient';
  className?: string;
}

export function JaguarLoadingSpinner({
  size = 'md',
  variant = 'primary',
  className,
}: JaguarLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const variantClasses = {
    primary: 'bg-jaguar-gold border-jaguar-gold-light animate-gold-pulse',
    secondary: 'bg-jaguar-indigo border-jaguar-indigo-light',
    gradient: 'animate-gold-to-indigo',
  };

  if (variant === 'gradient') {
    return (
      <div
        className={cn(
          'rounded-full animate-gold-to-indigo',
          sizeClasses[size],
          className,
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full border-2 border-t-transparent animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function JaguarPulsingDot({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={cn(
        'rounded-full bg-jaguar-gold animate-gold-pulse',
        sizeClasses[size],
        className,
      )}
    />
  );
}
