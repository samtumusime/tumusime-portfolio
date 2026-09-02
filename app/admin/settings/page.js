'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import StatusBanner from '@/components/admin/StatusBanner';

export default function AdminSettingsPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ''));
  }, []);

  async function handleResetPassword() {
    setSending(true);
    setStatus(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
    });
    setSending(false);
    setStatus(
      error
        ? { type: 'error', message: error.message }
        : { type: 'success', message: `Password reset email sent to ${email}.` }
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Settings</h1>
      <p className="text-sm text-muted mb-6">Account and environment details.</p>

      <StatusBanner status={status} />

      <div className="glass-panel rounded-lg p-6 max-w-xl space-y-6">
        <div>
          <h2 className="text-sm font-semibold mb-1">Admin account</h2>
          <p className="text-sm text-muted">{email || 'Loading…'}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">Change password</h2>
          <p className="text-sm text-muted mb-3">
            Sends a secure password-reset link to your admin email via Supabase Auth.
          </p>
          <button
            onClick={handleResetPassword}
            disabled={sending || !email}
            className="text-sm px-4 py-2 rounded-md border border-border hover:border-gold/50 transition-colors disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send password reset email'}
          </button>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">About this dashboard</h2>
          <p className="text-sm text-muted leading-relaxed">
            This admin panel and the public site share the same Supabase database. Only the account above
            (matching <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">ADMIN_EMAIL</code> in your
            environment variables) can sign in here — enforced by both route middleware and database
            Row Level Security, not just by hiding the page.
          </p>
        </div>
      </div>
    </div>
  );
}
