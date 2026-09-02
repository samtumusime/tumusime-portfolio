'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import StatusBanner from '@/components/admin/StatusBanner';
import FileUploadField from '@/components/admin/FileUploadField';

const emptyProfile = {
  full_name: '',
  headline: '',
  bio: '',
  email: '',
  linkedin_url: '',
  github_url: '',
  location: '',
  focus_areas: '',
  hero_labels: '',
  portrait_url: '',
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfileId(data.id);
          setProfile({
            ...emptyProfile,
            ...data,
            focus_areas: (data.focus_areas || []).join(', '),
            hero_labels: (data.hero_labels || []).join(', '),
          });
        }
        setLoading(false);
      });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const supabase = createClient();
    const payload = {
      full_name: profile.full_name,
      headline: profile.headline,
      bio: profile.bio,
      email: profile.email,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      location: profile.location,
      focus_areas: profile.focus_areas.split(',').map((s) => s.trim()).filter(Boolean),
      hero_labels: profile.hero_labels.split(',').map((s) => s.trim()).filter(Boolean),
      portrait_url: profile.portrait_url,
      updated_at: new Date().toISOString(),
    };

    let error = null;
    if (profileId) {
      const res = await supabase.from('profiles').update(payload).eq('id', profileId);
      error = res.error;
    } else {
      const res = await supabase.from('profiles').insert(payload).select().single();
      error = res.error;
      if (res.data) setProfileId(res.data.id);
    }

    setSaving(false);
    setStatus(error ? { type: 'error', message: error.message } : { type: 'success', message: 'Profile updated. Changes are live on the public site.' });
  }

  if (loading) return <div className="text-sm text-muted">Loading…</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Profile / About</h1>
      <p className="text-sm text-muted mb-6">This powers the hero, about section, and contact links on your public site.</p>

      <StatusBanner status={status} />

      <form onSubmit={handleSave} className="glass-panel rounded-lg p-6 space-y-5 max-w-2xl">
        <FileUploadField
          label="Portrait image"
          value={profile.portrait_url}
          onChange={(url) => setProfile((p) => ({ ...p, portrait_url: url }))}
          folder="profile"
          accept="image/*"
        />

        <Field label="Full name" value={profile.full_name} onChange={(v) => setProfile((p) => ({ ...p, full_name: v }))} required />
        <Field
          label="Hero one-liner (shown under your name)"
          value={profile.headline}
          onChange={(v) => setProfile((p) => ({ ...p, headline: v }))}
        />
        <Field
          label="Hero labels (comma-separated, e.g. AI & Machine Learning Enthusiast, ICT & Networking Foundation)"
          value={profile.hero_labels}
          onChange={(v) => setProfile((p) => ({ ...p, hero_labels: v }))}
        />
        <TextArea label="Bio (About section — separate paragraphs with a blank line)" value={profile.bio} onChange={(v) => setProfile((p) => ({ ...p, bio: v }))} rows={6} />
        <Field label="Focus areas (comma-separated tags)" value={profile.focus_areas} onChange={(v) => setProfile((p) => ({ ...p, focus_areas: v }))} />
        <Field label="Location" value={profile.location} onChange={(v) => setProfile((p) => ({ ...p, location: v }))} />
        <Field label="Public email" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} type="email" />
        <Field label="LinkedIn URL" value={profile.linkedin_url} onChange={(v) => setProfile((p) => ({ ...p, linkedin_url: v }))} type="url" />
        <Field label="GitHub URL" value={profile.github_url} onChange={(v) => setProfile((p) => ({ ...p, github_url: v }))} type="url" />

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-text text-sm font-medium transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-md bg-bg border border-border text-sm focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-md bg-bg border border-border text-sm focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
