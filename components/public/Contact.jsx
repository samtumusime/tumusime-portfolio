'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;
      setForm({ name: '', email: '', message: '' });
      setStatus('sent');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <section className="section" id="contact" data-section="contact">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">08</span>
          <h2 className="section-title">Get in Touch</h2>
          <div className="section-line" />
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Contact information */}
          <div data-reveal className="space-y-8">
            <p className="text-muted leading-relaxed text-base max-w-sm">
              I&apos;m always interested in hearing about new projects and opportunities. Feel free to reach out!
            </p>

            {/* Contact links */}
            <div className="space-y-4">
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`} 
                  className="flex items-center gap-4 p-4 glass-panel rounded-lg hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center group-hover:bg-gold/25 transition-all duration-300">
                    <span className="text-base">✉</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted/70 mb-0.5">Email</p>
                    <p className="text-sm text-gold group-hover:text-gold/80 transition-colors font-medium">
                      {profile.email}
                    </p>
                  </div>
                </a>
              )}

              {profile?.linkedin_url && (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-4 p-4 glass-panel rounded-lg hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center group-hover:bg-gold/25 transition-all duration-300 text-sm font-bold">
                    in
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted/70 mb-0.5">LinkedIn</p>
                    <p className="text-sm text-gold group-hover:text-gold/80 transition-colors font-medium">
                      Connect with me
                    </p>
                  </div>
                </a>
              )}

              {profile?.github_url && (
                <a 
                  href={profile.github_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-4 p-4 glass-panel rounded-lg hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center group-hover:bg-gold/25 transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gold">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted/70 mb-0.5">GitHub</p>
                    <p className="text-sm text-gold group-hover:text-gold/80 transition-colors font-medium">
                      View my projects
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-8 space-y-6" data-reveal>
            <div>
              <label htmlFor="formName" className="block text-xs uppercase tracking-widest text-gold/70 mb-2.5 font-semibold">
                Name
              </label>
              <input
                id="formName"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-5 py-3 rounded-lg bg-surface/50 border border-border hover:border-gold/30 focus:border-gold text-sm text-text placeholder:text-muted/50 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="formEmail" className="block text-xs uppercase tracking-widest text-gold/70 mb-2.5 font-semibold">
                Email
              </label>
              <input
                id="formEmail"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full px-5 py-3 rounded-lg bg-surface/50 border border-border hover:border-gold/30 focus:border-gold text-sm text-text placeholder:text-muted/50 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="formMessage" className="block text-xs uppercase tracking-widest text-gold/70 mb-2.5 font-semibold">
                Message
              </label>
              <textarea
                id="formMessage"
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Your message..."
                className="w-full px-5 py-3 rounded-lg bg-surface/50 border border-border hover:border-gold/30 focus:border-gold text-sm text-text placeholder:text-muted/50 focus:outline-none transition-all duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-7 py-3.5 rounded-lg bg-accent hover:bg-accent-hover border border-accent text-text text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-text/30 border-t-text animate-spin" />
                  Sending…
                </span>
              ) : (
                'Send Message'
              )}
            </button>

            {status === 'sent' && (
              <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
                <p className="text-sm text-gold font-medium text-center">
                  ✓ Thank you! Your message has been sent successfully.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-lg bg-accent/20 border border-accent/30">
                <p className="text-sm text-accent/90 font-medium text-center">
                  Something went wrong. Please try again in a moment.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
