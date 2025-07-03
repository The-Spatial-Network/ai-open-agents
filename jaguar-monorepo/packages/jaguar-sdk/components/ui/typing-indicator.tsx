'use client';

import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gold' | 'indigo' | 'gradient';
}

export function TypingIndicator({
  className,
  size = 'md',
  variant = 'gold',
}: TypingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const variantClasses = {
    gold: 'bg-jaguar-gold',
    indigo: 'bg-jaguar-indigo',
    gradient: 'bg-gradient-to-r from-jaguar-gold to-jaguar-indigo',
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={`typing-dot-${index}`}
          className={cn(
            'rounded-full animate-typing-dots',
            sizeClasses[size],
            variantClasses[variant],
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export function TypingMessage({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn('flex items-center space-x-2 text-jaguar-gold', className)}
    >
      <TypingIndicator variant="gold" size="sm" />
      <span className="text-sm font-medium">AI is thinking...</span>
    </div>
  );
}
