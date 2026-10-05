import React from "react";
import { Navigate, useParams } from "react-router-dom";
import ContentBlocks from "../components/content/ContentBlocks";
import { getProjectDoc, projects } from "../content/projects";
import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug && item.published);
  const doc = getProjectDoc(slug);
  if (!project || !doc?.blocks?.length) return <Navigate to="/" replace />;
  return (
    <article className="project-doc">
      <header><h1>{doc.title || project.title}</h1></header>
      <ContentBlocks blocks={doc.blocks} />
    </article>
  );
}
