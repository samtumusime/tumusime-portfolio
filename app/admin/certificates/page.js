'use client';

import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'issuer', label: 'Issuer', type: 'text', required: true },
  { name: 'issue_date', label: 'Issue date (e.g. 2024)', type: 'text' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'networking, ai, cloud, security, iot, other' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'credential_id', label: 'Credential ID', type: 'text' },
  { name: 'credential_url', label: 'Credential verification URL', type: 'url' },
  { name: 'file_url', label: 'Certificate file (PDF or image)', type: 'file', folder: 'certificates' },
  { name: 'sort_order', label: 'Display order', type: 'number', placeholder: '1' },
  { name: 'is_featured', label: 'Featured certificate', type: 'checkbox' },
];

const listColumns = [
  { key: 'title', label: 'Title' },
  { key: 'issuer', label: 'Issuer' },
  { key: 'category', label: 'Category' },
  { key: 'issue_date', label: 'Date' },
  { key: 'is_featured', label: 'Featured' },
  { key: 'sort_order', label: 'Display Order' },
];

export default function AdminCertificatesPage() {
  return (
    <EntityManager
      table="certificates"
      title="Certificates"
      fields={fields}
      listColumns={listColumns}
      emptyLabel="No certificates yet. Add your first certificate above."
      searchPlaceholder="Search certificates..."
    />
  );
}
