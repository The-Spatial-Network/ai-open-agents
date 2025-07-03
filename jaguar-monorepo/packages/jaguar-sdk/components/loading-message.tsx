'use client';

import { motion } from 'framer-motion';
import { SparklesIcon } from './icons';
import { TypingIndicator } from './ui/typing-indicator';
import { JaguarLoadingSpinner } from './ui/jaguar-loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingMessageProps {
  variant?: 'thinking' | 'processing' | 'generating';
  className?: string;
}

export function LoadingMessage({
  variant = 'thinking',
  className,
}: LoadingMessageProps) {
  const messages = {
    thinking: 'AI is thinking...',
    processing: 'Processing your request...',
    generating: 'Generating response...',
  };

  const icons = {
    thinking: <TypingIndicator variant="gold" size="sm" />,
    processing: <JaguarLoadingSpinner variant="primary" size="sm" />,
    generating: <JaguarLoadingSpinner variant="gradient" size="sm" />,
  };

  return (
    <motion.div
      data-testid="jaguar-loading-message"
      className={cn(
        'w-full mx-auto max-w-3xl px-4 group/message min-h-24',
        className,
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
      data-role="assistant"
    >
      <div className="flex gap-4 w-full">
        {/* Avatar with gold pulse */}
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-jaguar-gold/30 bg-background animate-gold-pulse">
          <div className="translate-y-px text-jaguar-gold">
            <SparklesIcon size={14} />
          </div>
        </div>

        {/* Loading content */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3 text-jaguar-gold">
            {icons[variant]}
            <span className="text-sm font-medium animate-pulse">
              {messages[variant]}
            </span>
          </div>

          {/* Animated loading bars */}
          <div className="space-y-2 max-w-md">
            <div className="h-3 bg-jaguar-indigo/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-jaguar-gold to-jaguar-indigo animate-gold-to-indigo rounded-full w-3/4" />
            </div>
            <div className="h-3 bg-jaguar-indigo/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-jaguar-gold to-jaguar-indigo animate-gold-to-indigo rounded-full w-1/2"
                style={{ animationDelay: '0.5s' }}
              />
            </div>
            <div className="h-3 bg-jaguar-indigo/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-jaguar-gold to-jaguar-indigo animate-gold-to-indigo rounded-full w-2/3"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced thinking message with better UX
export function JaguarThinkingMessage() {
  return <LoadingMessage variant="thinking" />;
}

// Processing message for file uploads, etc.
export function JaguarProcessingMessage() {
  return <LoadingMessage variant="processing" />;
}

// Generating message for AI responses
export function JaguarGeneratingMessage() {
  return <LoadingMessage variant="generating" />;
}
