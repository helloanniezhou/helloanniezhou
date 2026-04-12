const raw = import.meta.glob("./**/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default"
});

function resolveUrl(mod) {
  if (typeof mod === "string") return mod;
  return mod?.default ?? "";
}

function altFromPath(path) {
  const name = path
    .replace(/^\.\//, "")
    .replace(/\.[^/.]+$/, "")
    .split("/")
    .pop();
  return name ? name.replace(/[-_]+/g, " ").trim() : "Artwork";
}

export const artworkPieces = Object.entries(raw)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const src = resolveUrl(mod);
    return { src, alt: altFromPath(path) };
  })
  .filter((item) => item.src);
