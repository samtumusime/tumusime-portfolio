'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import StatusBanner from '@/components/admin/StatusBanner';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_RULES,
  evaluatePasswordPolicy,
  getPasswordPolicyErrors,
} from '@/lib/auth/passwordPolicy.mjs';
import { isAuthRateLimited } from '@/lib/auth/authRateLimit.mjs';

export default function AdminSettingsPage() {
  const [email, setEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [changeStatus, setChangeStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [changing, setChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordRuleStatus = evaluatePasswordPolicy(newPassword);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email || '');
    }).catch(() => {
      if (active) setEmail('');
    });
    return () => { active = false; };
  }, []);

  async function handleResetPassword() {
    setSending(true);
    setResetStatus(null);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setResetStatus(
        error
          ? { type: 'error', message: 'Password recovery could not be started. Please try again.' }
          : { type: 'success', message: 'If the account is eligible, password recovery instructions will be sent.' }
      );
    } catch {
      setResetStatus({ type: 'error', message: 'Password recovery could not be started. Please try again.' });
    } finally {
      setSending(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    setChangeStatus(null);

    if (getPasswordPolicyErrors(newPassword).length > 0) {
      setChangeStatus({ type: 'error', message: 'Choose a password that meets every requirement below.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeStatus({ type: 'error', message: 'The new passwords do not match.' });
      return;
    }
    if (newPassword === currentPassword) {
      setChangeStatus({ type: 'error', message: 'Choose a new password different from your current password.' });
      return;
    }

    setChanging(true);
    try {
      const supabase = createClient();
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: currentPassword,
      });
      if (reauthError) {
        setChangeStatus({
          type: 'error',
          message: isAuthRateLimited(reauthError)
            ? 'Supabase Auth has temporarily limited sign-in requests. Wait a few minutes before trying again.'
            : 'The current password could not be verified.',
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setChangeStatus({ type: 'error', message: 'The new password could not be saved. Please try again.' });
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangeStatus({ type: 'success', message: 'Your password has been updated.' });
    } catch {
      setChangeStatus({ type: 'error', message: 'The password could not be updated. Please try again.' });
    } finally {
      setChanging(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Settings</h1>
      <p className="text-sm text-muted mb-6">Account and environment details.</p>

      <div className="max-w-xl space-y-6">
        <section className="glass-panel rounded-lg p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold mb-1">Admin account</h2>
            <p className="text-sm text-muted">{email || 'Loading…'}</p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-2">Change password</h2>
              <p className="text-sm text-muted mb-3">
                Confirm your current password, then choose a new one. Supabase Auth verifies the current password before saving.
              </p>
              <label htmlFor="current-password" className="block text-xs text-muted mb-1.5">Current password</label>
              <input
                id="current-password"
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-xs text-muted mb-1.5">New password</label>
              <input
                id="new-password"
                type="password"
                required
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={256}
                autoComplete="new-password"
                aria-describedby="settings-password-requirements"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <ul id="settings-password-requirements" className="mt-3 space-y-1 text-xs text-muted">
                {PASSWORD_RULES.map(({ key, label }) => (
                  <li key={key} className={passwordRuleStatus[key] ? 'text-gold' : ''}>
                    <span className="font-medium">{passwordRuleStatus[key] ? 'Met' : 'Required'}:</span> {label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-xs text-muted mb-1.5">Confirm new password</label>
              <input
                id="confirm-new-password"
                type="password"
                required
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={256}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            {changeStatus && (
              <p role={changeStatus.type === 'error' ? 'alert' : 'status'} className={`text-sm ${changeStatus.type === 'error' ? 'text-accent-hover' : 'text-gold'}`}>
                {changeStatus.message}
              </p>
            )}
            <button
              type="submit"
              disabled={changing || !email || !currentPassword || !newPassword || !confirmPassword}
              className="text-sm px-4 py-2 rounded-md border border-border hover:border-gold/50 transition-colors disabled:opacity-60"
            >
              {changing ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        <section className="glass-panel rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold mb-2">Password recovery</h2>
            <p className="text-sm text-muted">
              Send a secure password-reset link to your admin email via Supabase Auth.
            </p>
          </div>
          <StatusBanner status={resetStatus} />
          <button
            onClick={handleResetPassword}
            disabled={sending || !email}
            className="text-sm px-4 py-2 rounded-md border border-border hover:border-gold/50 transition-colors disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send password reset email'}
          </button>
        </section>

        <section className="glass-panel rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-2">About this dashboard</h2>
          <p className="text-sm text-muted leading-relaxed">
            The admin account must match the server-side <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">ADMIN_USER_ID</code>
            {' '}allowlist. Route middleware and database Row Level Security both enforce that identity; hiding this page is not an access control.
          </p>
        </section>
      </div>
    </div>
  );
}
