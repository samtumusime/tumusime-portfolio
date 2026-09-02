'use client';

import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'category', label: 'Category (e.g. IoT, Networking, AI/ML)', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'technologies', label: 'Technologies (comma-separated)', type: 'tags' },
  { name: 'image_url', label: 'Project image', type: 'file', folder: 'projects', accept: 'image/*' },
  { name: 'github_url', label: 'GitHub URL', type: 'url' },
  { name: 'live_url', label: 'Live demo URL', type: 'url' },
];

const listColumns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'technologies', label: 'Technologies' },
];

export default function AdminProjectsPage() {
  return (
    <EntityManager
      table="projects"
      title="Projects"
      fields={fields}
      listColumns={listColumns}
      emptyLabel="No projects yet. Add your first project above."
      searchPlaceholder="Search projects..."
    />
  );
}
