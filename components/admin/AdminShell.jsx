'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin', label: 'Overview', icon: '◆' },
  { href: '/admin/projects', label: 'Projects', icon: '▣' },
  { href: '/admin/certificates', label: 'Certificates', icon: '▤' },
  { href: '/admin/awards', label: 'Awards', icon: '★' },
  { href: '/admin/skills', label: 'Skills', icon: '◈' },
  { href: '/admin/experience', label: 'Experience', icon: '❖' },
  { href: '/admin/cv', label: 'CV', icon: '▥' },
  { href: '/admin/profile', label: 'Profile / About', icon: '◐' },
  { href: '/admin/messages', label: 'Messages', icon: '✉' },
  { href: '/admin/media', label: 'Media', icon: '▧' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-border bg-surface z-40">
        <span className="font-bold tracking-wide text-sm">ADMIN</span>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-sm text-muted">
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <aside
        className={`fixed lg:sticky top-0 lg:top-0 h-screen w-64 shrink-0 border-r border-border bg-surface flex flex-col z-30 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 py-6 border-b border-border hidden lg:block">
          <div className="font-bold tracking-widest text-sm">TUMUSIME SAM</div>
          <div className="text-[11px] text-muted mt-0.5">Admin Dashboard</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 mt-14 lg:mt-0">
          {NAV.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  active ? 'text-gold bg-gold/10 border-r-2 border-gold' : 'text-muted hover:text-text'
                }`}
              >
                <span className="text-xs w-4">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" target="_blank" className="block text-xs text-muted hover:text-text mb-3 px-2">
            View public site ↗
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-sm px-3 py-2 rounded-md border border-border hover:border-accent hover:text-accent-hover transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
