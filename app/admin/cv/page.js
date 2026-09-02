'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import StatusBanner from '@/components/admin/StatusBanner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { uploadFile } from '@/lib/uploadFile';

export default function AdminCvPage() {
  const supabase = createClient();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('cv_files').select('*').order('uploaded_at', { ascending: false });
    setFiles(data || []);
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
      const { url } = await uploadFile(file, 'cv');
      const makeActive = files.length === 0;
      const { error } = await supabase.from('cv_files').insert({
        label: file.name,
        file_url: url,
        file_name: file.name,
        is_active: makeActive,
      });
      if (error) throw error;
      setStatus({ type: 'success', message: 'CV uploaded.' });
      await load();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function setActive(id) {
    await supabase.from('cv_files').update({ is_active: false }).neq('id', id);
    await supabase.from('cv_files').update({ is_active: true }).eq('id', id);
    load();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from('cv_files').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">CV</h1>
      <p className="text-sm text-muted mb-6">
        Upload your CV as a PDF. Whichever file is marked <strong>Active</strong> is the one linked from the
        &quot;Download CV&quot; buttons on the public site.
      </p>

      <StatusBanner status={status} />

      <label className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-md border border-border cursor-pointer hover:border-gold/50 transition-colors mb-6">
        {uploading ? 'Uploading…' : '+ Upload new CV'}
        <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {loading ? (
        <div className="h-16 rounded-md bg-surface animate-pulse" />
      ) : files.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-14 text-center text-muted text-sm">
          No CV uploaded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-4 glass-panel rounded-lg p-4">
              <div className="min-w-0">
                <a href={f.file_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-text hover:text-gold transition-colors truncate block">
                  {f.file_name || f.label}
                </a>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(f.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {f.is_active ? (
                  <span className="text-xs px-2.5 py-1 rounded-full border border-gold/40 text-gold">Active</span>
                ) : (
                  <button onClick={() => setActive(f.id)} className="text-xs text-gold hover:underline">
                    Make active
                  </button>
                )}
                <button onClick={() => setDeleteTarget(f)} className="text-xs text-accent-hover hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this CV file?"
        description="If it's the active CV, download links on the public site will stop working until you activate another one."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
