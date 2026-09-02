'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const CARDS = [
  { table: 'projects', label: 'Projects', href: '/admin/projects' },
  { table: 'certificates', label: 'Certificates', href: '/admin/certificates' },
  { table: 'awards', label: 'Awards', href: '/admin/awards' },
  { table: 'skill_groups', label: 'Skill groups', href: '/admin/skills' },
  { table: 'experience', label: 'Experience entries', href: '/admin/experience' },
];

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const results = await Promise.all(
        CARDS.map((c) => supabase.from(c.table).select('id', { count: 'exact', head: true }))
      );
      const next = {};
      results.forEach((r, i) => (next[CARDS[i].table] = r.count || 0));
      setCounts(next);

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnread(count || 0);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Overview</h1>
      <p className="text-sm text-muted mb-8">A quick snapshot of your published content.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CARDS.map((c) => (
          <Link
            key={c.table}
            href={c.href}
            className="glass-panel rounded-lg p-6 hover:border-gold/40 transition-colors"
          >
            <span className="block text-3xl font-bold text-gold tabular-nums">
              {counts ? counts[c.table] : '—'}
            </span>
            <span className="block mt-2 text-sm text-muted">{c.label}</span>
          </Link>
        ))}

        <Link
          href="/admin/messages"
          className="glass-panel rounded-lg p-6 hover:border-gold/40 transition-colors relative"
        >
          <span className="block text-3xl font-bold text-gold tabular-nums">{unread}</span>
          <span className="block mt-2 text-sm text-muted">Unread messages</span>
          {unread > 0 && <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-accent" />}
        </Link>
      </div>

      <div className="glass-panel rounded-lg p-6">
        <h2 className="font-semibold text-sm mb-3">Getting started</h2>
        <ul className="text-sm text-muted space-y-2 list-disc pl-5">
          <li>Fill in <Link href="/admin/profile" className="text-gold hover:underline">Profile / About</Link> first — your name, bio, and contact links power the whole public site.</li>
          <li>Upload your CV under <Link href="/admin/cv" className="text-gold hover:underline">CV</Link> and mark it active.</li>
          <li>Add your real projects, certificates, awards, skills and experience — anything marked &quot;Draft&quot; stays hidden from visitors until you publish it.</li>
          <li>Check <Link href="/admin/messages" className="text-gold hover:underline">Messages</Link> for contact-form submissions.</li>
        </ul>
      </div>
    </div>
  );
}
