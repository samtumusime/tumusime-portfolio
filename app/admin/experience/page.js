'use client';

import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { name: 'position', label: 'Role / Position', type: 'text', required: true },
  { name: 'organization', label: 'Organization', type: 'text', required: true },
  { name: 'date_range', label: 'Date range (e.g. 2024 – Present)', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
];

const listColumns = [
  { key: 'position', label: 'Position' },
  { key: 'organization', label: 'Organization' },
  { key: 'date_range', label: 'Dates' },
];

export default function AdminExperiencePage() {
  return (
    <EntityManager
      table="experience"
      title="Experience"
      fields={fields}
      listColumns={listColumns}
      emptyLabel="No experience entries yet. Add your first role above."
      searchPlaceholder="Search experience..."
    />
  );
}
