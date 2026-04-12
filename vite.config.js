import { defineConfig } from "vite";

// GitHub Pages project site: https://helloanniezhou.github.io/helloanniezhou/
// Dev (`npm run dev`): base "/" so http://localhost:5173/artwork works.
// Build + `npm run preview`: base "/helloanniezhou/" so assets match production.
// If you use a user site (repo named <username>.github.io), use "/" for build too.
export default defineConfig(({ command, isPreview }) => ({
  base:
    command === "serve" && !isPreview ? "/" : "/helloanniezhou/",
}));
