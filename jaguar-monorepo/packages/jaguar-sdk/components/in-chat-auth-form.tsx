'use client';

import { useActionState, useEffect, useState } from 'react';
import { register, type RegisterActionState } from '@/app/(auth)/actions';
import { toast } from '@/components/toast';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InChatAuthFormProps {
  sessionId: string;
  onSuccess: (userId: string) => void;
  onError: (error: string) => void;
}

export function InChatAuthForm({
  sessionId,
  onSuccess,
  onError,
}: InChatAuthFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    { status: 'idle' },
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      onError(
        'An account with this email already exists. Please try signing in instead.',
      );
    } else if (state.status === 'failed') {
      onError('Failed to create account. Please try again.');
    } else if (state.status === 'invalid_data') {
      onError('Please check your email and password format.');
    } else if (state.status === 'success') {
      toast({ type: 'success', description: 'Account created successfully!' });
      // We'll handle session conversion in the parent component
      onSuccess(email);
    }

    if (state.status !== 'in_progress') {
      setIsLoading(false);
    }
  }, [state, email, onSuccess, onError]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="jaguar-card p-6 max-w-md w-full">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="jaguar-h3">Create Your Account</h3>
          <p className="jaguar-body-secondary text-sm">
            Join thousands building the future with AI agents
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-normal">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              autoFocus
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-[rgb(217,181,113)] focus:border-[rgb(217,181,113)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-normal">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              required
              minLength={6}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-[rgb(217,181,113)] focus:border-[rgb(217,181,113)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[rgb(217,181,113)] hover:bg-[rgb(217,181,113)]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,181,113,0.3)]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account & Continue'
            )}
          </button>
        </form>

        <p className="text-center jaguar-body-secondary text-xs">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy. Your dream is safe with us.
        </p>
      </div>
    </div>
  );
}
