const KEY = "helloanniezhou-site-content-v1";

/** @returns {{ projects?: object[], details?: Record<string, object> } | null} */
export function loadSiteContent() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {{ projects: object[], details: Record<string, object> }} data */
export function saveSiteContent(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearSiteContent() {
  localStorage.removeItem(KEY);
}
