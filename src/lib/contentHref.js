export function resolveContentHref(href) {
  if (!href) return { kind: "none" };
  if (href.startsWith("/") && !href.startsWith("//")) return { kind: "internal", to: href };
  if (/^(https?:|mailto:|tel:)/i.test(href)) return { kind: "external", href };
  return { kind: "none" };
}
