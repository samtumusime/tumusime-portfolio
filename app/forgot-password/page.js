'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setError('');
    setStatus('');

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/update-password')}`;
      const { error: requestError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (requestError) {
        setError('We could not start password recovery. Please wait a moment and try again.');
      } else {
        setStatus('If an account matches that address, password recovery instructions will be sent.');
      }
    } catch {
      setError('We could not start password recovery. Please wait a moment and try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-text px-4 py-12">
      <section className="w-full max-w-sm">
        <header className="text-center mb-8">
          <div className="font-bold tracking-widest text-sm">TUMUSIME SAM</div>
          <h1 className="text-xs text-muted mt-2">Recover your password</h1>
        </header>
        <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-7 space-y-5">
          <p className="text-sm text-muted leading-relaxed">
            Enter the email address associated with your admin account. If it matches an account, we’ll send a secure recovery link.
          </p>
          <div>
            <label htmlFor="recovery-email" className="block text-xs text-muted mb-1.5">Email</label>
            <input
              id="recovery-email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {status && <p role="status" className="text-sm text-muted">{status}</p>}
          {error && <p role="alert" className="text-sm text-accent-hover">{error}</p>}
          <button
            type="submit"
            disabled={sending || !email.trim()}
            className="w-full px-6 py-3 rounded-md bg-accent hover:bg-accent-hover border border-accent text-text text-sm font-medium transition-colors disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send recovery link'}
          </button>
          <p className="text-center text-xs text-muted">
            <Link href="/login" className="hover:text-gold underline-offset-4 hover:underline">Back to sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
