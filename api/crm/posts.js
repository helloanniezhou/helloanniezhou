import { CASE_STUDY_SLUGS } from "../_lib/caseStudySlugs.js";
import { requireCrmSession } from "../_lib/crmSession.js";
import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";

async function ensureRows(supabase) {
  const rows = CASE_STUDY_SLUGS.map((slug) => ({ slug, published: true }));
  await supabase.from("blog_posts").upsert(rows, {
    onConflict: "slug",
    ignoreDuplicates: true,
  });
}

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(503).json({ error: "Database is not configured." });
  }

  if (req.method === "GET") {
    if (!requireCrmSession(req, res)) return;

    await ensureRows(supabase);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, published, updated_at")
      .in("slug", CASE_STUDY_SLUGS)
      .order("slug");

    if (error) return res.status(500).json({ error: error.message });

    const bySlug = new Map((data ?? []).map((row) => [row.slug, row]));
    const posts = CASE_STUDY_SLUGS.map((slug) => {
      const row = bySlug.get(slug);
      return {
        slug,
        published: row?.published ?? true,
        updated_at: row?.updated_at ?? null,
      };
    });

    return res.status(200).json({ posts });
  }

  if (req.method === "PATCH") {
    if (!requireCrmSession(req, res)) return;

    const { slug, published } = req.body ?? {};
    if (!CASE_STUDY_SLUGS.includes(slug) || typeof published !== "boolean") {
      return res.status(400).json({ error: "Invalid slug or published value." });
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .upsert({ slug, published }, { onConflict: "slug" })
      .select("slug, published, updated_at")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ post: data });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: "Method not allowed" });
}
