/**
 * Fetches each Notion page body and writes portable JSON blocks to src/data/notionBlocks/<slug>.json
 *
 * Setup:
 * 1. Create an internal integration at https://www.notion.so/my-integrations
 * 2. Share each project page with the integration
 * 3. Put the secret in env: create a root `.env` with NOTION_TOKEN=... (gitignored), or run
 *    `export NOTION_TOKEN=secret_...` in your shell.
 * 4. Edit src/data/notionProjectPages.json: { "your-slug": "notion-page-uuid" }
 * 5. npm run notion:sync
 *
 * Images:
 * - External / "Link" URLs are copied into JSON as-is (best for CDNs you control).
 * - Uploaded Notion files are downloaded during sync into public/notion-images/<slug>/ (stable for static hosting).
 *   Commit those files with the repo, or re-run sync in CI before build (requires network).
 *
 * Image size (optional):
 * - In Notion, start the image caption with a line `dim:480` or `dim:480px` (then optional caption text) to set maxWidth in px.
 * - Or edit the generated JSON: add "maxWidth", "width", and/or "height" (numbers = px). Re-sync merges these by block id
 *   when the same block still exists so edits are kept.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const NOTION_VERSION = "2022-06-28";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const MAP_PATH = path.join(ROOT, "src", "data", "notionProjectPages.json");
const OUT_DIR = path.join(ROOT, "src", "data", "notionBlocks");

/** Load root `.env` into process.env if present (does not override existing env vars). */
function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function notionHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
  };
}

async function notionFetch(token, pathname) {
  const res = await fetch(`https://api.notion.com/v1${pathname}`, { headers: notionHeaders(token) });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`Notion ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

async function listChildren(token, blockId) {
  const results = [];
  let cursor;
  do {
    let pathname = `/blocks/${blockId}/children?page_size=100`;
    if (cursor) pathname += `&start_cursor=${encodeURIComponent(cursor)}`;
    const data = await notionFetch(token, pathname);
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  for (const block of results) {
    if (block.has_children) {
      block.children = await listChildren(token, block.id);
    }
  }
  return results;
}

/** Caption line `dim:400` or `dim:400px` at start of first text run → maxWidth; remainder becomes visible caption. */
function extractDimFromCaption(richText) {
  if (!richText?.length) return { richText, maxWidth: undefined };
  const first = richText[0];
  if (first?.type !== "text") return { richText, maxWidth: undefined };
  const m = first.text.match(/^dim:\s*(\d+)\s*px?\s*/i);
  if (!m) return { richText, maxWidth: undefined };
  const maxWidth = Number(m[1]);
  const rest = first.text.slice(m[0].length).replace(/^\n+/, "");
  const newRuns = [...richText];
  if (rest) {
    newRuns[0] = { ...first, text: rest };
  } else {
    newRuns.shift();
  }
  return { richText: newRuns, maxWidth };
}

function walkBlocks(blocks, visit) {
  if (!blocks?.length) return;
  for (const b of blocks) {
    visit(b);
    if (b.children?.length) walkBlocks(b.children, visit);
  }
}

/** Carry over maxWidth / width / height from previous export when block id still matches. */
function mergeImageDimensionsFromPrevious(blocks, previousBlocks) {
  const prevById = new Map();
  walkBlocks(previousBlocks, (b) => {
    if (b.type === "image" && b.id) prevById.set(b.id, b);
  });
  walkBlocks(blocks, (b) => {
    if (b.type !== "image" || !b.id) return;
    const prev = prevById.get(b.id);
    if (!prev) return;
    for (const key of ["maxWidth", "width", "height"]) {
      if (b[key] == null && prev[key] != null) b[key] = prev[key];
    }
  });
}

function mapRichText(richText) {
  if (!richText?.length) return [];
  return richText.map((rt) => ({
    type: "text",
    text: rt.plain_text,
    bold: !!rt.annotations?.bold,
    italic: !!rt.annotations?.italic,
    strikethrough: !!rt.annotations?.strikethrough,
    underline: !!rt.annotations?.underline,
    code: !!rt.annotations?.code,
    color: rt.annotations?.color,
    href: rt.href || null
  }));
}

/** Download Notion-hosted file URL (short-lived signed URL) into public/; return site path like /notion-images/slug/id.jpg */
async function persistNotionHostedImage(fileUrl, slug, blockId) {
  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = (res.headers.get("content-type") || "").split(";")[0].trim();
  let ext = "jpg";
  if (ct.includes("png")) ext = "png";
  else if (ct.includes("jpeg") || ct === "image/jpg") ext = "jpg";
  else if (ct.includes("webp")) ext = "webp";
  else if (ct.includes("gif")) ext = "gif";
  else if (ct.includes("svg")) ext = "svg";
  else {
    try {
      const u = new URL(fileUrl);
      const m = u.pathname.match(/\.(jpe?g|png|webp|gif|svg)$/i);
      if (m) ext = m[1].toLowerCase().replace("jpeg", "jpg");
    } catch {
      /* keep default */
    }
  }

  const safeId = String(blockId).replace(/-/g, "");
  const relDir = path.join("notion-images", slug);
  const fileName = `${safeId}.${ext}`;
  const absDir = path.join(ROOT, "public", relDir);
  fs.mkdirSync(absDir, { recursive: true });
  const absPath = path.join(absDir, fileName);
  fs.writeFileSync(absPath, buf);
  return `/${["notion-images", slug, fileName].join("/")}`;
}

async function transformBlock(block, slug) {
  const id = block.id;
  const t = block.type;

  if (t === "paragraph") {
    return { id, type: t, richText: mapRichText(block.paragraph.rich_text) };
  }
  if (t === "heading_1" || t === "heading_2" || t === "heading_3") {
    return { id, type: t, richText: mapRichText(block[t].rich_text) };
  }
  if (t === "bulleted_list_item" || t === "numbered_list_item") {
    const children = await Promise.all((block.children || []).map((c) => transformBlock(c, slug)));
    return {
      id,
      type: t,
      richText: mapRichText(block[t].rich_text),
      children
    };
  }
  if (t === "quote") {
    return { id, type: t, richText: mapRichText(block.quote.rich_text) };
  }
  if (t === "divider") {
    return { id, type: t };
  }
  if (t === "image") {
    const im = block.image;
    const captionMapped = mapRichText(im?.caption || []);
    const { richText: caption, maxWidth: dimMaxWidth } = extractDimFromCaption(captionMapped);
    if (im?.type === "external" && im.external?.url) {
      const out = { id, type: t, url: im.external.url, caption };
      if (dimMaxWidth != null) out.maxWidth = dimMaxWidth;
      return out;
    }
    if (im?.type === "file" && im.file?.url && process.env.NOTION_SKIP_HOSTED_IMAGE_DOWNLOAD !== "1") {
      try {
        const url = await persistNotionHostedImage(im.file.url, slug, id);
        const out = { id, type: t, url, caption };
        if (dimMaxWidth != null) out.maxWidth = dimMaxWidth;
        return out;
      } catch (e) {
        console.warn(`  image ${id}: could not download hosted file (${e.message})`);
      }
    }
    const out = { id, type: t, unsupported: "hosted_file", caption };
    if (dimMaxWidth != null) out.maxWidth = dimMaxWidth;
    return out;
  }
  if (t === "callout") {
    const children = await Promise.all((block.children || []).map((c) => transformBlock(c, slug)));
    return {
      id,
      type: t,
      icon: block.callout.icon,
      richText: mapRichText(block.callout.rich_text),
      children
    };
  }
  if (t === "code") {
    return {
      id,
      type: t,
      language: block.code.language,
      richText: mapRichText(block.code.rich_text)
    };
  }
  if (t === "toggle") {
    const children = await Promise.all((block.children || []).map((c) => transformBlock(c, slug)));
    return {
      id,
      type: t,
      richText: mapRichText(block.toggle.rich_text),
      children
    };
  }

  return { id, type: "unsupported", unsupported: true, rawType: t };
}

async function transformBlocks(rawBlocks, slug) {
  return Promise.all(rawBlocks.map((b) => transformBlock(b, slug)));
}

async function main() {
  loadEnvFile();
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    console.error(
      "Missing NOTION_TOKEN. Add it to a root `.env` file (see .env.example) or export it in your shell."
    );
    process.exit(1);
  }
  if (!fs.existsSync(MAP_PATH)) {
    console.error("Missing src/data/notionProjectPages.json");
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
  const slugs = Object.keys(map);
  if (slugs.length === 0) {
    console.log("notionProjectPages.json is empty — add { \"slug\": \"page-uuid\" } entries.");
    process.exit(0);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const slug of slugs) {
    const pageId = map[slug];
    if (!pageId || typeof pageId !== "string") {
      console.warn(`Skip ${slug}: invalid page id`);
      continue;
    }
    const rawBlocks = await listChildren(token, pageId);
    const blocks = await transformBlocks(rawBlocks, slug);
    const outPath = path.join(OUT_DIR, `${slug}.json`);
    if (fs.existsSync(outPath)) {
      try {
        const prevDoc = JSON.parse(fs.readFileSync(outPath, "utf8"));
        mergeImageDimensionsFromPrevious(blocks, prevDoc.blocks || []);
      } catch {
        /* ignore corrupt previous */
      }
    }
    const doc = {
      sourcePageId: pageId,
      fetchedAt: new Date().toISOString(),
      blocks
    };
    fs.writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
    console.log(`Wrote ${path.relative(ROOT, outPath)} (${blocks.length} top-level blocks)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
