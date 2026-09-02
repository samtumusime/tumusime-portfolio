'use client';

import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { name: 'category', label: 'Category name (e.g. Networking, AI / ML)', type: 'text', required: true },
  { name: 'items', label: 'Skills in this category (comma-separated)', type: 'tags', required: true },
];

const listColumns = [
  { key: 'category', label: 'Category' },
  { key: 'items', label: 'Skills' },
];

export default function AdminSkillsPage() {
  return (
    <EntityManager
      table="skill_groups"
      title="Skills"
      fields={fields}
      listColumns={listColumns}
      emptyLabel="No skill groups yet. Add your first category above (e.g. 'Networking' with items LAN, VLAN, DNS...)."
      searchPlaceholder="Search skill groups..."
    />
  );
}
