'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { safeAdminRedirect } from '@/lib/auth/safeRedirect.mjs';
import {
  AUTH_RATE_LIMIT_BACKOFF_MS,
  isAuthRateLimited,
} from '@/lib/auth/authRateLimit.mjs';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (!cooldownUntil) return undefined;

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) setCooldownUntil(0);
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (Date.now() < cooldownUntil) return;

    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        if (isAuthRateLimited(signInError)) {
          const until = Date.now() + AUTH_RATE_LIMIT_BACKOFF_MS;
          setCooldownUntil(until);
          setSecondsLeft(Math.ceil(AUTH_RATE_LIMIT_BACKOFF_MS / 1000));
          setError('Too many sign-in requests. Wait one minute before trying again.');
        } else {
          setError('Sign-in failed. Check your credentials and try again.');
        }
        return;
      }
      router.replace(safeAdminRedirect(params.get('next')));
      router.refresh();
    } catch {
      setError('Sign-in is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-bold tracking-widest text-sm">TUMUSIME SAM</div>
          <div className="text-xs text-muted mt-1">Admin sign in</div>
        </div>
        <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-7 space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs text-muted mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-muted mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {error && <p role="alert" aria-live="polite" className="text-xs text-accent-hover">{error}</p>}
          <button
            type="submit"
            disabled={loading || secondsLeft > 0}
            className="w-full px-6 py-3 rounded-md bg-accent hover:bg-accent-hover border border-accent text-text text-sm font-medium transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : secondsLeft > 0 ? `Wait ${secondsLeft}s…` : 'Sign in'}
          </button>
          <div className="text-center">
            <Link href="/forgot-password" className="text-xs text-muted hover:text-gold underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
        <p className="text-center text-xs text-muted mt-6">
          Only the configured admin account can access the dashboard.
        </p>
      </div>
    </div>
  );
}
