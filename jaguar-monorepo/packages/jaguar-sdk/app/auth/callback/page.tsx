'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Force dynamic rendering to prevent prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
  const [status, setStatus] = useState<
    'loading' | 'converting' | 'redirecting' | 'error'
  >('loading');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
          throw new Error('No session ID provided');
        }

        setStatus('converting');

        // Convert the anonymous session to a user session
        const response = await fetch('/api/auth/convert-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to convert session');
        }

        const { chatId } = await response.json();

        setStatus('redirecting');

        // Redirect to the dashboard chat with the converted chat
        setTimeout(() => {
          router.push(`/dashboard/chat/${chatId}?from=landing`);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-black font-bold text-2xl">J</span>
          </div>

          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(217,181,113)] mx-auto" />
              <div className="space-y-2">
                <h2 className="jaguar-h3">Completing authentication...</h2>
                <p className="jaguar-body-secondary">
                  Please wait while we set up your account
                </p>
              </div>
            </>
          )}

          {status === 'converting' && (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(217,181,113)] mx-auto" />
              <div className="space-y-2">
                <h2 className="jaguar-h3">Creating your workspace...</h2>
                <p className="jaguar-body-secondary">
                  Preparing your dream for Jaguar
                </p>
              </div>
            </>
          )}

          {status === 'redirecting' && (
            <>
              <div className="w-8 h-8 text-[rgb(217,181,113)] mx-auto">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="jaguar-h3">Welcome to Jaguar! 🎉</h2>
                <p className="jaguar-body-secondary">
                  Redirecting you to your workspace...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-8 h-8 text-red-400 mx-auto">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h2 className="jaguar-h3">Something went wrong</h2>
                <p className="jaguar-body-secondary">{error}</p>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="jaguar-button-primary"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-black font-bold text-2xl">J</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(217,181,113)] mx-auto" />
          <div className="space-y-2">
            <h2 className="jaguar-h3">Loading...</h2>
            <p className="jaguar-body-secondary">
              Please wait while we prepare your authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
