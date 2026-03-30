import React from "react";
import "./ProjectDetailShared.css";

function ProjectMetaCard({ title, body }) {
  return (
    <article className="project-meta-card">
      <h3 className="project-meta-title">{title}</h3>
      <p className="project-meta-body" dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}

export default ProjectMetaCard;
