'use client';

import { cn } from '@/lib/utils';

interface JaguarSkeletonProps {
  className?: string;
  variant?: 'default' | 'shimmer' | 'pulse';
  children?: React.ReactNode;
}

export function JaguarSkeleton({
  className,
  variant = 'shimmer',
  children,
}: JaguarSkeletonProps) {
  const variantClasses = {
    default: 'bg-jaguar-indigo/10 animate-pulse',
    shimmer:
      'bg-jaguar-indigo/5 animate-indigo-shimmer relative overflow-hidden',
    pulse: 'bg-jaguar-gold/10 animate-gold-pulse',
  };

  return (
    <div
      className={cn('rounded-md', variantClasses[variant], className)}
      role="status"
      aria-label="Loading content"
    >
      {variant === 'shimmer' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jaguar-indigo/10 to-transparent animate-indigo-shimmer" />
      )}
      {children && <div className="opacity-0">{children}</div>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function JaguarSkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <JaguarSkeleton
          key={`skeleton-${Math.random()}-${i}`}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
          variant="shimmer"
        />
      ))}
    </div>
  );
}

export function JaguarSkeletonMessage({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('flex gap-4 w-full', className)}>
      {/* Avatar skeleton */}
      <JaguarSkeleton
        className="size-8 rounded-full flex-shrink-0"
        variant="pulse"
      />

      {/* Message content skeleton */}
      <div className="flex-1 space-y-3">
        <JaguarSkeletonText lines={2} />
        <div className="flex gap-2">
          <JaguarSkeleton className="h-6 w-16 rounded-full" variant="shimmer" />
          <JaguarSkeleton className="h-6 w-20 rounded-full" variant="shimmer" />
        </div>
      </div>
    </div>
  );
}
