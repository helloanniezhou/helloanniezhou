// Order here controls the sidebar. Set published: false to hide a project.
export const projects = [
  { slug: "project-genie", title: "Project Genie", published: true },
  { slug: "fitness-for-fitbit", title: "Google Health & Pixel Watch", published: true },
  { slug: "airwallex", title: "Airwallex", published: true },
  { slug: "google-go", title: "Google Go", published: true },
  { slug: "ask-health", title: "Ask Health for Fitbit", published: false },
];

const docs = import.meta.glob("./projects/*.json", { eager: true, import: "default" });
export function getProjectDoc(slug) {
  return docs[`./projects/${slug}.json`] ?? null;
}
export function listCaseStudiesForNav() {
  return projects.filter((project) => project.published && getProjectDoc(project.slug)?.blocks?.length);
}
