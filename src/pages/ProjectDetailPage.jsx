import React from "react";
import { Navigate, useParams } from "react-router-dom";
import projects from "../data/projects";
import NotionBlocks from "../components/notion/NotionBlocks";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";
import "./ProjectDetailPage.css";

function NotionDrivenProjectPage({ project, doc }) {
  return (
    <article className="project-doc">
      <header>
        <h1>{project.title}</h1>
      </header>
      <NotionBlocks blocks={doc.blocks} />
    </article>
  );
}

function GenericProjectPage({ project }) {
  return (
    <article className="project-doc">
      <header>
        <h1>{project.title}</h1>
      </header>
      <section>
        <p dangerouslySetInnerHTML={{ __html: project.description }} />
      </section>
    </article>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const notionDoc = getNotionDocForSlug(slug);
  if (notionDoc?.blocks?.length) {
    return <NotionDrivenProjectPage project={project} doc={notionDoc} />;
  }

  return <GenericProjectPage project={project} />;
}

export default ProjectDetailPage;
