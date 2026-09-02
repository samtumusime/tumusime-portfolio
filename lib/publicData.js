import { createClient } from '@/lib/supabase/server';

// All reads here rely on RLS: anon role only ever sees is_published = true
// rows (see supabase/schema.sql), so there is no risk of leaking drafts.

export async function getProfile() {
  const supabase = createClient();
  const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return data;
}

export async function getSkillGroups() {
  const supabase = createClient();
  const { data } = await supabase
    .from('skill_groups')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getExperience() {
  const supabase = createClient();
  const { data } = await supabase
    .from('experience')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getProjects() {
  const supabase = createClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getCertificates() {
  const supabase = createClient();
  const { data } = await supabase
    .from('certificates')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getAwards() {
  const supabase = createClient();
  const { data } = await supabase
    .from('awards')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function getActiveCv() {
  const supabase = createClient();
  const { data } = await supabase
    .from('cv_files')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getPortfolioData() {
  const [profile, skillGroups, experience, projects, certificates, awards, cv] =
    await Promise.all([
      getProfile(),
      getSkillGroups(),
      getExperience(),
      getProjects(),
      getCertificates(),
      getAwards(),
      getActiveCv(),
    ]);
  return { profile, skillGroups, experience, projects, certificates, awards, cv };
}
