'use client';

export default function StatusBanner({ status }) {
  if (!status) return null;
  const styles =
    status.type === 'error'
      ? 'bg-accent/15 border-accent/40 text-text'
      : 'bg-gold/10 border-gold/30 text-text';
  return (
    <div className={`text-sm px-4 py-3 rounded-md border mb-5 ${styles}`}>{status.message}</div>
  );
}
