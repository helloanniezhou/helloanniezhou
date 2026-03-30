import React from "react";
import "./ProjectDetailShared.css";

function ProjectImpactStat({ label, body }) {
  return (
    <article className="project-impact-stat">
      <h3>{label}</h3>
      <p dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}

export default ProjectImpactStat;
