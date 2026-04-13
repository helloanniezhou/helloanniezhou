/**
 * Build-time JSON from notion/fetchNotionBlocks.mjs (one file per slug).
 * Vite inlines matching .json files; keys vary by version (e.g. ./slug.json vs full path).
 */
const rawModules = import.meta.glob("./*.json", { eager: true });

function unwrap(mod) {
  if (mod == null) return null;
  return mod.default != null ? mod.default : mod;
}

const notionDocs = {};
for (const [key, mod] of Object.entries(rawModules)) {
  notionDocs[key] = unwrap(mod);
}

export function getNotionDocForSlug(slug) {
  const fileName = `${slug}.json`;
  const key = Object.keys(notionDocs).find(
    (k) => k === `./${fileName}` || k.endsWith(`/${fileName}`)
  );
  return key ? notionDocs[key] : null;
}
