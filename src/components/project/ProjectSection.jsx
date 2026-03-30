import React from "react";
import "./ProjectDetailShared.css";

function ProjectSection({ title, body, className = "" }) {
  return (
    <section className={`project-section ${className}`}>
      <h2 className="project-section-title">{title}</h2>
      <p className="project-section-body" dangerouslySetInnerHTML={{ __html: body }} />
    </section>
  );
}

export default ProjectSection;
