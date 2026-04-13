# Notion content sync (skill)

This repo pulls selected Notion pages into static JSON and optional image files so the site can render case studies and the About “Projects” block without calling the Notion API at runtime.

## Layout

| Path | Role |
|------|------|
| `notion/fetchNotionBlocks.mjs` | CLI: fetch blocks + page title, write JSON, download hosted images |
| `notion/notion-skill.md` | This guide |
| `src/data/notionProjectPages.json` | Map **slug** → **Notion page id** (which pages to export) |
| `src/data/notionBlocks/<slug>.json` | Generated portable blocks + `title` + `fetchedAt` |
| `public/notion-images/<slug>/` | Downloaded Notion file images (commit or regenerate in CI) |
| `src/lib/notionExtractDim.js` | Shared: parse `dim:…` from image captions (sync + UI) |

Runtime code (`NotionBlocks`, `notionHref`, `notionProjects`, etc.) lives under `src/` and reads only the JSON.

## One-time setup

1. Create a [Notion integration](https://www.notion.so/my-integrations) (internal).
2. For each page listed in `notionProjectPages.json`, open the page in Notion → **Share** → invite the integration (same as sharing with a user).
3. Create a root `.env` (gitignored) with:
   ```bash
   NOTION_TOKEN=secret_...
   ```
   Or export `NOTION_TOKEN` in your shell before running sync.

## Registering a page

Edit `src/data/notionProjectPages.json`:

```json
{
  "about-projects": "340bef17e03580d6a55adfa2e2c82c7c",
  "my-case-study": "your-notion-page-uuid-here"
}
```

- **Slug** becomes the filename `notionBlocks/<slug>.json` and, for non–`about-projects` entries, the route `/projects/<slug>` (see `src/lib/notionProjects.js`).
- **`about-projects`** is reserved for the About page embedded list; it is not a standalone project route.

Use the page id from the Notion URL (32 hex characters, with or without hyphens).

## Sync commands

From the repository root:

| Goal | Command |
|------|---------|
| Pull **every** page in the map | `npm run notion:sync` |
| Pull **one** page by slug | `npm run notion:sync -- google-go` |
| Same, explicit flag | `npm run notion:sync -- --slug=google-go` or `--slug google-go` |

Single-page sync only updates that slug’s JSON (and its images under `public/notion-images/<slug>/`). Other slugs are untouched.

### Environment knobs

| Variable | Effect |
|----------|--------|
| `NOTION_TOKEN` | Required. Integration secret. |
| `NOTION_SKIP_HOSTED_IMAGE_DOWNLOAD=1` | Skip downloading Notion-hosted files (faster / offline); images may appear as unsupported in JSON until you sync with network. |

## What the export contains

- **`blocks`**: Simplified tree (paragraphs, headings, lists, quotes, images, callouts, code, toggles, column layouts; unknown types marked `unsupported`).
- **`title`**: From the Notion page’s **title** property when the API returns it; otherwise the previous JSON’s `title` is kept if present.
- **`sourcePageId`**, **`fetchedAt`**: For traceability.

## Image sizing in Notion

- Start an image caption with **`dim:<value>`** (stripped in the site). Examples: `dim:640`, `dim:100%`, `dim:24rem`.
- Or edit dimensions on the exported image objects in JSON (`maxWidth`, `width`, `height`); re-sync merges those by **block id** when the block still exists.

## After syncing

1. Commit `src/data/notionBlocks/*.json` and any new/changed files under `public/notion-images/`.
2. Run `npm run build` to confirm the app bundles cleanly.

## Troubleshooting

- **`object_not_found` / 404**: Page not shared with the integration, or wrong page id.
- **`Unauthorized`**: Invalid or revoked `NOTION_TOKEN`.
- **Unknown slug** (single-page mode): Slug must exactly match a key in `notionProjectPages.json`.

## Cursor agents

Point agents at this file for Notion workflow: **`notion/notion-skill.md`**. The entry script is **`notion/fetchNotionBlocks.mjs`**.
