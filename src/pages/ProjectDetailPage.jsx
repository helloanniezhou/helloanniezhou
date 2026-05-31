import React from "react";
import { Navigate, useParams } from "react-router-dom";
import NotionBlocks from "../components/notion/NotionBlocks";
import { usePublishedPosts } from "../context/PublishedPostsContext";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";
import { humanizeSlug } from "../lib/notionProjects";
import "./ProjectDetailPage.css";

const ABOUT_SLUG = "about-projects";

function ProjectDetailPage() {
  const { slug } = useParams();
  const { isSlugPublished, isLoading } = usePublishedPosts();

  if (!slug || slug === ABOUT_SLUG) {
    return <Navigate to="/" replace />;
  }

  if (!isLoading && !isSlugPublished(slug)) {
    return <Navigate to="/" replace />;
  }

  const doc = getNotionDocForSlug(slug);
  if (!doc?.blocks?.length) {
    return <Navigate to="/" replace />;
  }

  const raw = doc.title;
  const title =
    typeof raw === "string" && raw.trim() ? raw.trim() : humanizeSlug(slug);

  return (
    <article className="project-doc">
      <header>
        <h1>{title}</h1>
      </header>
      <NotionBlocks blocks={doc.blocks} />
    </article>
  );
}

export default ProjectDetailPage;
