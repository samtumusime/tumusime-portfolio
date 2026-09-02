'use client';

import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'organization', label: 'Organization', type: 'text' },
  { name: 'award_date', label: 'Date (e.g. 2025)', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Image (optional)', type: 'file', folder: 'awards', accept: 'image/*' },
];

const listColumns = [
  { key: 'title', label: 'Title' },
  { key: 'organization', label: 'Organization' },
  { key: 'award_date', label: 'Date' },
];

export default function AdminAwardsPage() {
  return (
    <EntityManager
      table="awards"
      title="Awards"
      fields={fields}
      listColumns={listColumns}
      emptyLabel="No awards yet. Add your first award above."
      searchPlaceholder="Search awards..."
    />
  );
}
