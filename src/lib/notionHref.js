import notionMap from "../data/notionProjectPages.json";

const SKIP_SLUGS = new Set(["about-projects"]);

function normalizePageId(raw) {
  return String(raw).replace(/-/g, "").toLowerCase();
}

function buildNotionPageIdToProjectPath() {
  const m = new Map();
  for (const [slug, pageId] of Object.entries(notionMap)) {
    if (SKIP_SLUGS.has(slug) || typeof pageId !== "string") continue;
    m.set(normalizePageId(pageId), `/projects/${slug}`);
  }
  return m;
}

const notionPageIdToProjectPath = buildNotionPageIdToProjectPath();

/**
 * Notion page mentions in link text often become `href` like `/213bef17e03580d0bce1d98d4f0ebfd4`.
 * Map those to case-study routes when the page id is in notionProjectPages.json.
 */
export function resolveNotionHref(href) {
  if (href == null || href === "") return { kind: "none" };
  if (/^https?:\/\//i.test(href)) {
    return { kind: "external", href };
  }
  if (href.startsWith("/") && !href.startsWith("//")) {
    const pathOnly = href.split(/[?#]/)[0];
    const seg = pathOnly.slice(1);
    const compact = normalizePageId(seg);
    if (compact.length === 32 && /^[0-9a-f]+$/.test(compact)) {
      const to = notionPageIdToProjectPath.get(compact);
      if (to) return { kind: "internal", to };
    }
    return { kind: "internal", to: href };
  }
  return { kind: "external", href };
}
