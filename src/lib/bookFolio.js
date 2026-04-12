/** Page 1 in the portfolio volume is the Work index spread. */
export const BOOK_WORK_PAGE = 1;

/** Project list order → pages 2 … n+1 (same order as `projects` array). */
export function projectPageFromListIndex(index) {
  return index + 2;
}

export function projectPageForSlug(slug, projectsList) {
  const i = projectsList.findIndex((p) => p.slug === slug);
  const idx = i >= 0 ? i : 0;
  return projectPageFromListIndex(idx);
}
