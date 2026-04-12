/**
 * Prefix with Vite `base` so /public files work in dev, preview, and GitHub Pages.
 * External http(s) and data URLs are returned unchanged.
 */
export function publicUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const path = url.startsWith("/") ? url.slice(1) : url;
  return `${normalizedBase}${path}`;
}
