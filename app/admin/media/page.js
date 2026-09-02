'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusBanner from '@/components/admin/StatusBanner';
import { uploadFile } from '@/lib/uploadFile';

function formatSize(bytes) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const supabase = createClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      await uploadFile(file, 'media');
      setStatus({ type: 'success', message: 'File uploaded.' });
      await load();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from('media').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Media</h1>
      <p className="text-sm text-muted mb-6">
        General file library. Files uploaded through Projects, Certificates, Awards, CV, and Profile also show up here automatically.
      </p>

      <StatusBanner status={status} />

      <label className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-md border border-border cursor-pointer hover:border-gold/50 transition-colors mb-6">
        {uploading ? 'Uploading…' : '+ Upload file'}
        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-square rounded-md bg-surface animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-14 text-center text-muted text-sm">
          No files yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => {
            const isImage = m.file_type?.startsWith('image/');
            return (
              <div key={m.id} className="glass-panel rounded-lg overflow-hidden group relative">
                <div className="aspect-square bg-surface-2 flex items-center justify-center">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.file_url} alt={m.file_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted font-mono px-2 text-center">{m.file_name}</span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs truncate">{m.file_name}</p>
                  <p className="text-[10px] text-muted mt-0.5">{formatSize(m.size_bytes)}</p>
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a href={m.file_url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">View</a>
                  <button onClick={() => setDeleteTarget(m)} className="text-xs text-accent-hover hover:underline">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this file?"
        description="This removes it from the media library. If it's still used on a project, certificate, or elsewhere, that reference will break."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
