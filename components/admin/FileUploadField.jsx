'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/uploadFile';

export default function FileUploadField({ label, value, onChange, folder = 'uploads', accept }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await uploadFile(file, folder);
      onChange(url);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const isImage = value && /\.(png|jpe?g|webp|gif|svg)$/i.test(value);

  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        {value && isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-14 h-14 object-cover rounded-md border border-border" />
        )}
        {value && !isImage && (
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-gold underline">
            View current file
          </a>
        )}
        <label className="text-xs px-3.5 py-2 rounded-md border border-border cursor-pointer hover:border-gold/50 transition-colors">
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          <input type="file" accept={accept} onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-muted hover:text-accent-hover transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-accent-hover mt-1.5">{error}</p>}
    </div>
  );
}
