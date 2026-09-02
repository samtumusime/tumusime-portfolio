'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
  const router = useRouter();
  const params = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('Invalid email or password.');
      return;
    }
    router.replace(params.get('next') || '/admin');
    router.refresh();
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {error && <p className="text-xs text-accent-hover">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-md bg-accent hover:bg-accent-hover border border-accent text-text text-sm font-medium transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-xs text-muted mt-6">
          Only the configured admin account can access the dashboard.
        </p>
      </div>
    </div>
  );
}
