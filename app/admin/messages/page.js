'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminMessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expanded, setExpanded] = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleRead(m) {
    await supabase.from('messages').update({ is_read: !m.is_read }).eq('id', m.id);
    load();
  }

  async function openMessage(m) {
    setExpanded(expanded === m.id ? null : m.id);
    if (!m.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', m.id);
      load();
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from('messages').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Messages</h1>
      <p className="text-sm text-muted mb-6">Submissions from your public contact form.</p>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-md bg-surface animate-pulse" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-14 text-center text-muted text-sm">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`glass-panel rounded-lg p-4 transition-colors ${!m.is_read ? 'border-gold/40' : ''}`}>
              <button onClick={() => openMessage(m)} className="w-full flex items-center justify-between gap-4 text-left">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                    <span className="text-sm font-medium truncate">{m.name}</span>
                    <span className="text-xs text-muted truncate">{m.email}</span>
                  </div>
                  {expanded !== m.id && (
                    <p className="text-xs text-muted mt-1 truncate max-w-md">{m.message}</p>
                  )}
                </div>
                <span className="text-xs text-muted shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
              </button>

              {expanded === m.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-text/90 leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <div className="flex gap-4 mt-3 text-xs">
                    <a href={`mailto:${m.email}`} className="text-gold hover:underline">Reply by email ↗</a>
                    <button onClick={() => toggleRead(m)} className="text-muted hover:text-text">
                      Mark as {m.is_read ? 'unread' : 'read'}
                    </button>
                    <button onClick={() => setDeleteTarget(m)} className="text-accent-hover hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this message?"
        description="This can't be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
