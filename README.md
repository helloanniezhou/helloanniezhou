# Annie Zhou portfolio

A React portfolio managed entirely through local code. Project content, navigation order, and publication settings are committed with the site. No content sync or database is needed to run the portfolio.

## Run locally

```sh
npm install
npm run dev
```

Check production changes with `npm run build`.

## Edit content

- `src/content/projects.js`: project titles, sidebar order, and visibility (`published`).
- `src/content/projects/<slug>.json`: each project's text, images, and layout.
- `src/content/about-projects.json`: project overview on the About page.
- `src/data/about.js` and `src/pages/AboutPage.jsx`: biography, work, and education.
- `public/project-images/<slug>/`: project images, referenced as `/project-images/<slug>/filename.webp`.
- `src/components/content/`: shared content rendering and styles. You can also build custom layouts directly in React.

The existing Ask Health project is preserved as a draft (`published: false`). Its two images retain their existing remote URLs because local copies were unavailable during migration; replace them with files in `public/project-images/ask-health/` when available.

## Add a project

1. Create `src/content/projects/my-project.json` using the example below, or copy an existing project.
2. Add `{ slug: "my-project", title: "My Project", published: true }` to the `projects` array in `src/content/projects.js`. The slug must match the JSON filename.
3. Put images in `public/project-images/my-project/`.
4. Add a link in `src/content/about-projects.json` if you want it in the About overview too. Sidebar navigation updates automatically.
5. Preview `/projects/my-project`, then run `npm run build`.

```json
{
  "blocks": [
    { "id": "intro", "type": "paragraph", "richText": [{ "text": "Describe the project and your role." }] },
    { "id": "problem", "type": "heading_2", "richText": [{ "text": "The problem" }] },
    { "id": "problem-text", "type": "paragraph", "richText": [{ "text": "Explain the problem you solved." }] },
    { "id": "hero", "type": "image", "url": "/project-images/my-project/hero.webp", "alt": "Project overview", "caption": [{ "text": "A short caption" }] }
  ]
}
```

Blocks support paragraphs, headings (`heading_1`–`heading_3`), images, bulleted and numbered list items, quotes, dividers, callouts, code, toggles, and columns. Rich text runs support `bold`, `italic`, `underline`, `strikethrough`, `code`, and `href`. Use ordinary `/projects/<slug>` paths for internal links. Give blocks unique, descriptive IDs. Images support `maxWidth`, `width`, and `height`.

## Vibe coding

Ask your coding assistant to edit the local content files or React components, for example: “Add a project called My Project with this case study and these images, using the current portfolio style.” No external editor or integration is required.

The former `/CRM` route now shows the local project list and editing instructions. Historical database migrations and unused server authentication code are retained; they do not control portfolio content. Deploy using your existing hosting workflow after reviewing the changes.
