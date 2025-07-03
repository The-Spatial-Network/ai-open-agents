'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InChatAuthForm } from '@/components/in-chat-auth-form';

type LandingState =
  | 'initial' // Simple input box
  | 'submitting' // Saving prompt, show loading
  | 'chat-expanded' // Full chat interface visible
  | 'auth-form' // Show email signup form
  | 'registering' // Processing registration
  | 'converting' // Converting session after auth
  | 'redirecting'; // Moving to dashboard

export default function LandingPage() {
  const [dreamAgent, setDreamAgent] = useState('');
  const [landingState, setLandingState] = useState<LandingState>('initial');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!dreamAgent.trim()) return;

    setLandingState('submitting');
    setError(null);

    try {
      // Save anonymous session
      const response = await fetch('/api/anonymous-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: dreamAgent,
          sessionData: { timestamp: Date.now() },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save your dream');
      }

      const { sessionId: newSessionId } = await response.json();
      setSessionId(newSessionId);

      // Animate to expanded chat interface
      setTimeout(() => {
        setLandingState('chat-expanded');
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLandingState('initial');
    }
  };

  const handleAuthSuccess = async (userEmail: string) => {
    if (!sessionId) return;

    setLandingState('converting');
    setError(null);

    try {
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

      setLandingState('redirecting');

      // Redirect to the dashboard chat with the converted chat
      setTimeout(() => {
        router.push(`/dashboard/chat/${chatId}?from=landing`);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to set up your workspace',
      );
      setLandingState('auth-form');
    }
  };

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
    setLandingState('auth-form');
  };

  const handleEmailAuth = () => {
    setLandingState('auth-form');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold">J</span>
          </div>
          <div>
            <h1 className="jaguar-h3">jaguar</h1>
            <p className="jaguar-helper uppercase tracking-wide">
              Open Source AGI
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Agents
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Teams
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Marketplace
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Nature
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Learn
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="jaguar-body-secondary hover:text-white transition-colors"
          >
            Sign In
          </a>
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="jaguar-button-primary"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="jaguar-pill">world&apos;s first open source agi</div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="jaguar-h1">manifest your dreams</h1>
            <h1 className="jaguar-h1">
              with{' '}
              <span className="bg-gradient-to-r from-[rgb(217,181,113)] to-yellow-400 bg-clip-text text-transparent">
                ai agents
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="jaguar-body-secondary text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Turn your wildest ideas into reality. Build, deploy, and monetize
            intelligent agents that work together to automate your world.
          </p>

          {/* Credibility Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Powered by n8n</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>OpenWebUI Backend</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔗</span>
              <span>OpenRouter Models</span>
            </div>
          </div>
        </div>

        {/* Dream Input Section */}
        <div className="max-w-4xl mx-auto mt-16 space-y-8">
          {landingState === 'initial' && (
            <div className="relative">
              <textarea
                value={dreamAgent}
                onChange={(e) => setDreamAgent(e.target.value)}
                placeholder="Describe your dream... I'll help you build the agents to make it happen"
                className="w-full min-h-[120px] jaguar-card text-white placeholder:text-gray-400 text-lg p-6 resize-none focus:ring-2 focus:ring-[rgb(217,181,113)] focus:border-transparent outline-none jaguar-body"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!dreamAgent.trim()}
                className="absolute bottom-4 right-4 bg-[rgb(217,181,113)] hover:shadow-[0_0_20px_rgba(217,181,113,0.3)] disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-all text-black"
              >
                →
              </button>
            </div>
          )}

          {landingState === 'submitting' && (
            <div className="relative">
              <div className="w-full min-h-[120px] jaguar-card text-white text-lg p-6 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[rgb(217,181,113)]" />
                  <span className="jaguar-body">Saving your dream...</span>
                </div>
              </div>
            </div>
          )}

          {(landingState === 'chat-expanded' ||
            landingState === 'auth-form' ||
            landingState === 'registering' ||
            landingState === 'converting' ||
            landingState === 'redirecting') && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* User's Dream Message */}
              <div className="flex justify-end">
                <div className="max-w-3xl bg-[rgb(217,181,113)] text-black p-4 rounded-2xl rounded-br-md">
                  <p className="jaguar-body">{dreamAgent}</p>
                </div>
              </div>

              {/* Jaguar's Response */}
              <div className="flex justify-start">
                <div className="max-w-3xl jaguar-card p-4 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-sm">J</span>
                    </div>
                    <span className="jaguar-body font-medium">Jaguar</span>
                  </div>
                  <div className="space-y-3">
                    <p className="jaguar-body">I love your vision! 🚀</p>
                    <p className="jaguar-body">
                      To bring your dream to life, I&apos;ll need to create a
                      personalized workspace for you. This will let me save your
                      progress and help you build amazing agents step by step.
                    </p>
                    <p className="jaguar-body-secondary text-sm">
                      Ready to start building together? Let&apos;s get you set
                      up - it only takes a moment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Authentication Options */}
              {landingState === 'chat-expanded' && (
                <div className="flex justify-center animate-in fade-in duration-300 delay-200">
                  <div className="jaguar-card p-6 max-w-md w-full">
                    <h3 className="jaguar-h3 text-center mb-4">
                      Continue Your Journey
                    </h3>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleEmailAuth}
                        className="w-full flex items-center justify-center space-x-3 bg-[rgb(217,181,113)] hover:bg-[rgb(217,181,113)]/90 text-black p-3 rounded-xl transition-colors font-medium"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Continue with Email</span>
                      </button>
                    </div>
                    <p className="text-center jaguar-body-secondary text-sm mt-4">
                      Your dream is safe with us. We&apos;ll never share your
                      ideas.
                    </p>
                  </div>
                </div>
              )}

              {/* Email Auth Form */}
              {landingState === 'auth-form' && sessionId && (
                <div className="flex justify-center animate-in fade-in duration-300">
                  <InChatAuthForm
                    sessionId={sessionId}
                    onSuccess={handleAuthSuccess}
                    onError={handleAuthError}
                  />
                </div>
              )}

              {/* Loading States */}
              {(landingState === 'registering' ||
                landingState === 'converting') && (
                <div className="flex justify-center">
                  <div className="jaguar-card p-6 max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(217,181,113)] mx-auto mb-4" />
                    <p className="jaguar-body">
                      {landingState === 'registering'
                        ? 'Creating your account...'
                        : 'Setting up your workspace...'}
                    </p>
                  </div>
                </div>
              )}

              {landingState === 'redirecting' && (
                <div className="flex justify-center">
                  <div className="jaguar-card p-6 max-w-md w-full text-center">
                    <div className="w-8 h-8 text-[rgb(217,181,113)] mx-auto mb-4">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="jaguar-h3 mb-2">Welcome to Jaguar! 🎉</h3>
                    <p className="jaguar-body-secondary">
                      Taking you to your workspace...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-xl">
              <p className="jaguar-body">{error}</p>
            </div>
          )}

          {/* Dream Starters */}
          <div className="space-y-4">
            <p className="text-center jaguar-body-secondary">
              Or try one of these dream starters:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Create an agent that automates my morning routine with weather and calendar updates',
                'Build a content creation team that writes and publishes blog posts',
                'Design an agent that monitors my business metrics and sends alerts',
                'Create a research assistant that finds grants for regenerative agriculture',
                'Build an agent that manages my social media presence across platforms',
                'Design a customer support agent that handles common inquiries',
              ].map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setDreamAgent(starter)}
                  className="text-left p-4 jaguar-card hover:border-[rgb(217,181,113)] transition-all duration-200 jaguar-helper hover:text-white"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="jaguar-h2">the complete ai agent platform</h2>
          <p className="jaguar-body-secondary text-xl max-w-3xl mx-auto">
            Build, deploy, and monetize intelligent agent teams that work
            together to automate your workflows and align profit with purpose.
          </p>
        </div>
        <div className="jaguar-divider mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'agent creation',
              description:
                'Build custom agents with specific capabilities and personalities',
              icon: '🤖',
            },
            {
              title: 'team collaboration',
              description:
                'Organize agents into teams that work together on complex tasks',
              icon: '👥',
            },
            {
              title: 'workflow automation',
              description:
                'Connect agents to n8n workflows for powerful automation',
              icon: '⚡',
            },
            {
              title: 'monetization',
              description:
                'Deploy and monetize your agents on the Spatial Network',
              icon: '💰',
            },
            {
              title: 'open source',
              description:
                'Fully open source platform that you can self-host or extend',
              icon: '🌐',
            },
            {
              title: 'api integrations',
              description:
                'Connect your agents to any API or service with our integration capabilities',
              icon: '🔗',
            },
          ].map((feature) => (
            <div key={feature.title} className="jaguar-card group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="jaguar-h3 mb-2">{feature.title}</h3>
              <p className="jaguar-body-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6">
          <h2 className="jaguar-h2">
            start building above to create your first ai agent
          </h2>
          <p className="jaguar-body-secondary text-xl">
            No signup required to try
          </p>
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="jaguar-button-primary text-lg px-8 py-4"
          >
            Start Building Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="jaguar-divider py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">J</span>
              </div>
              <div>
                <h3 className="jaguar-h3">jaguar sdk</h3>
                <p className="jaguar-helper">Open Source AGI</p>
              </div>
            </div>
            <p className="jaguar-helper">
              © 2025 Jaguar SDK. Open source and built for the future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
