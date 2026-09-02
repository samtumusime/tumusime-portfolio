'use client';

import useModalScrollLock from '@/lib/useModalScrollLock';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  useModalScrollLock(open);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-surface border border-border rounded-lg max-w-sm w-full p-6 shadow-card">
        <h3 className="font-semibold text-text mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="text-sm px-4 py-2 rounded-md border border-border text-text hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="text-sm px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-text transition-colors disabled:opacity-60"
          >
            {busy ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
