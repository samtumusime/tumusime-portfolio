'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ConfirmDialog from './ConfirmDialog';
import StatusBanner from './StatusBanner';
import FileUploadField from './FileUploadField';
import useModalScrollLock from '@/lib/useModalScrollLock';

function emptyRecordFor(fields) {
  const rec = {};
  fields.forEach((f) => {
    rec[f.name] = f.type === 'tags' ? [] : f.type === 'checkbox' ? false : '';
  });
  rec.is_published = true;
  return rec;
}

function toFormValue(record, field) {
  const v = record[field.name];
  if (field.type === 'tags') return (v || []).join(', ');
  if (field.type === 'checkbox') return !!v;
  return v ?? '';
}

function fromFormValue(value, field) {
  if (field.type === 'tags') {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (field.type === 'checkbox') return !!value;
  if (field.type === 'number') return value === '' ? 0 : Number(value);
  return value;
}

// Reusable list + create/edit/delete manager for the simple, list-shaped
// content types (projects, certificates, awards, skill groups, experience).
// `fields` describes the form; `listColumns` describes the table preview.
export default function EntityManager({ table, title, fields, listColumns, emptyLabel, searchPlaceholder }) {
  const supabase = createClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // record being edited, or null for new
  const [formState, setFormState] = useState(emptyRecordFor(fields));
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useModalScrollLock(showForm);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
    if (error) setStatus({ type: 'error', message: error.message });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openCreate() {
    setEditing(null);
    setFormState(emptyRecordFor(fields));
    setShowForm(true);
  }

  function openEdit(record) {
    setEditing(record);
    const state = {};
    fields.forEach((f) => (state[f.name] = toFormValue(record, f)));
    state.is_published = record.is_published;
    setFormState(state);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const payload = {};
      fields.forEach((f) => {
        payload[f.name] = fromFormValue(formState[f.name] ?? '', f);
      });
      payload.is_published = !!formState.is_published;

      if (editing) {
        const { error } = await supabase.from(table).update(payload).eq('id', editing.id);
        if (error) throw error;
        setStatus({ type: 'success', message: 'Saved changes.' });
      } else {
        if (!fields.some((field) => field.name === 'sort_order')) payload.sort_order = items.length;
        const { error } = await supabase.from(table).insert(payload);
        if (error) throw error;
        setStatus({ type: 'success', message: 'Created successfully.' });
      }
      setShowForm(false);
      await load();
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from(table).delete().eq('id', deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Deleted.' });
      load();
    }
  }

  async function togglePublish(record) {
    const { error } = await supabase
      .from(table)
      .update({ is_published: !record.is_published })
      .eq('id', record.id);
    if (error) setStatus({ type: 'error', message: error.message });
    else load();
  }

  async function move(record, direction) {
    const idx = items.findIndex((i) => i.id === record.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const other = items[swapIdx];
    await Promise.all([
      supabase.from(table).update({ sort_order: other.sort_order }).eq('id', record.id),
      supabase.from(table).update({ sort_order: record.sort_order }).eq('id', other.id),
    ]);
    load();
  }

  const filtered = query
    ? items.filter((item) =>
        listColumns.some((col) =>
          String(item[col.key] ?? '').toLowerCase().includes(query.toLowerCase())
        )
      )
    : items;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted mt-1">{items.length} total · {items.filter((i) => i.is_published).length} published</p>
        </div>
        <button
          onClick={openCreate}
          className="text-sm px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-text transition-colors"
        >
          + Add new
        </button>
      </div>

      <StatusBanner status={status} />

      {items.length > 4 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder || 'Search...'}
          className="w-full sm:max-w-xs mb-5 px-3.5 py-2 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-gold transition-colors"
        />
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-md bg-surface animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-14 text-center text-muted text-sm">
          {emptyLabel || 'Nothing here yet.'}
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-left text-xs text-muted uppercase tracking-wide">
                  {listColumns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                  ))}
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} className="border-t border-border hover:bg-surface/60 transition-colors">
                    {listColumns.map((col) => (
                      <td key={col.key} className="px-4 py-3 align-top max-w-xs truncate">
                        {typeof item[col.key] === 'boolean'
                          ? item[col.key] ? '⭐ Featured' : '—'
                          : Array.isArray(item[col.key]) ? item[col.key].join(', ') : item[col.key] || '—'}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-top">
                      <button
                        onClick={() => togglePublish(item)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          item.is_published
                            ? 'border-gold/40 text-gold'
                            : 'border-border text-muted'
                        }`}
                      >
                        {item.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                      <button onClick={() => move(item, 'up')} disabled={i === 0} className="text-muted hover:text-text disabled:opacity-30 px-1.5">↑</button>
                      <button onClick={() => move(item, 'down')} disabled={i === filtered.length - 1} className="text-muted hover:text-text disabled:opacity-30 px-1.5">↓</button>
                      <button onClick={() => openEdit(item)} className="text-gold hover:underline px-2">Edit</button>
                      <button onClick={() => setDeleteTarget(item)} className="text-accent-hover hover:underline px-1">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
          <form
            onSubmit={handleSave}
            className="relative bg-surface border border-border rounded-lg max-w-lg w-full p-6 shadow-card max-h-[85vh] overflow-y-auto"
          >
            <h3 className="font-semibold mb-5">{editing ? 'Edit entry' : 'Add new entry'}</h3>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  {f.type === 'file' ? (
                    <FileUploadField
                      label={f.label}
                      value={formState[f.name]}
                      onChange={(url) => setFormState((s) => ({ ...s, [f.name]: url }))}
                      folder={f.folder || table}
                      accept={f.accept}
                    />
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 text-sm pt-1">
                      <input
                        type="checkbox"
                        checked={!!formState[f.name]}
                        onChange={(e) => setFormState((s) => ({ ...s, [f.name]: e.target.checked }))}
                        className="accent-accent"
                      />
                      {f.label}
                    </label>
                  ) : f.type === 'textarea' ? (
                    <div>
                      <label className="block text-xs text-muted mb-1.5">{f.label}</label>
                      <textarea
                        rows={4}
                        required={f.required}
                        value={formState[f.name] || ''}
                        onChange={(e) => setFormState((s) => ({ ...s, [f.name]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-md bg-bg border border-border text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs text-muted mb-1.5">{f.label}</label>
                      <input
                        type={f.type === 'url' ? 'url' : f.type === 'number' ? 'number' : 'text'}
                        required={f.required}
                        value={formState[f.name] || ''}
                        onChange={(e) => setFormState((s) => ({ ...s, [f.name]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-3.5 py-2.5 rounded-md bg-bg border border-border text-sm focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  )}
                </div>
              ))}
              <label className="flex items-center gap-2 text-sm pt-1">
                <input
                  type="checkbox"
                  checked={!!formState.is_published}
                  onChange={(e) => setFormState((s) => ({ ...s, is_published: e.target.checked }))}
                  className="accent-accent"
                />
                Published (visible on public site)
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm px-4 py-2 rounded-md border border-border hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="text-sm px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-text transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this entry?"
        description="This can't be undone. It will immediately disappear from the public site."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  );
}
