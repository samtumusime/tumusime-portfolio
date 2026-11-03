'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const [sessionState, setSessionState] = useState('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser()
      .then(({ data, error: userError }) => {
        if (!active) return;
        setSessionState(!userError && data.user ? 'ready' : 'missing');
      })
      .catch(() => {
        if (active) setSessionState('missing');
      });

    return () => { active = false; };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password.length < 12) {
      setError('Use a password with at least 12 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('The password could not be updated. Request a fresh recovery link and try again.');
        return;
      }
      router.replace('/admin/settings?password=updated');
      router.refresh();
    } catch {
      setError('The password could not be updated. Request a fresh recovery link and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-text px-4 py-12">
      <section className="w-full max-w-sm">
        <header className="text-center mb-8">
          <div className="font-bold tracking-widest text-sm">TUMUSIME SAM</div>
          <h1 className="text-xs text-muted mt-2">Set a new password</h1>
        </header>
        {sessionState === 'loading' ? (
          <p role="status" className="text-center text-sm text-muted">Checking your secure session…</p>
        ) : sessionState === 'missing' ? (
          <div className="glass-panel rounded-lg p-7 text-center space-y-4">
            <p role="alert" className="text-sm text-muted">This recovery link is invalid or has expired.</p>
            <Link href="/forgot-password" className="text-sm text-gold hover:underline">Request a new link</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-7 space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-xs text-muted mb-1.5">New password</label>
              <input
                id="new-password"
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs text-muted mb-1.5">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            {error && <p role="alert" className="text-sm text-accent-hover">{error}</p>}
            <button
              type="submit"
              disabled={saving || !password || !confirmPassword}
              className="w-full px-6 py-3 rounded-md bg-accent hover:bg-accent-hover border border-accent text-text text-sm font-medium transition-colors disabled:opacity-60"
            >
              {saving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
