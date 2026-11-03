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
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/update-password')}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setStatus(
        error
          ? { type: 'error', message: 'Password recovery could not be started. Please try again.' }
          : { type: 'success', message: 'If the account is eligible, password recovery instructions will be sent.' }
      );
    } catch {
      setStatus({ type: 'error', message: 'Password recovery could not be started. Please try again.' });
    } finally {
      setSending(false);
    }
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
            The admin account must match the server-side <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">ADMIN_USER_ID</code>
            allowlist. Route middleware and database Row Level Security both enforce that identity; hiding this page is not an access control.
          </p>
        </div>
      </div>
    </div>
  );
}
