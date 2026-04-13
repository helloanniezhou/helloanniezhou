import notionProjectPages from "../data/notionProjectPages.json";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";

const ABOUT_SLUG = "about-projects";

/** Slugs that map to `/projects/:slug` (excludes About-page-only entries). */
export function listCaseStudySlugs() {
  return Object.keys(notionProjectPages).filter((slug) => slug !== ABOUT_SLUG);
}

export function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Nav entries: only case studies with synced block JSON. */
export function listCaseStudiesForNav() {
  return listCaseStudySlugs()
    .map((slug) => {
      const doc = getNotionDocForSlug(slug);
      if (!doc?.blocks?.length) return null;
      const raw = doc.title;
      const title =
        typeof raw === "string" && raw.trim() ? raw.trim() : humanizeSlug(slug);
      return { slug, title };
    })
    .filter(Boolean);
}
