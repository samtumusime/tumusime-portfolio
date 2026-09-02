import { createClient } from '@/lib/supabase/client';

const BUCKET = 'portfolio-media';

// Uploads a File to Supabase Storage and returns its public URL.
// Requires the "portfolio-media" bucket + policies from supabase/storage.sql.
export async function uploadFile(file, folder = 'uploads') {
  const supabase = createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // Also record it in the media library table for the Media page.
  await supabase.from('media').insert({
    file_name: file.name,
    file_url: data.publicUrl,
    file_type: file.type,
    size_bytes: file.size,
  });

  return { url: data.publicUrl, path };
}
