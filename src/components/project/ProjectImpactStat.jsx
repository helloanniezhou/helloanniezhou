import React from "react";
import "./ProjectDetailShared.css";

function ProjectImpactStat({ label, children }) {
  return (
    <article>
      <h3>{label}</h3>
      <p>{children}</p>
    </article>
  );
}

export default ProjectImpactStat;
