import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

/** @returns {Promise<Set<string> | null>} Published slugs, or null if Supabase is not configured. */
export async function fetchPublishedSlugs() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("blog_posts").select("slug");
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.slug));
}

export { isSupabaseConfigured };
