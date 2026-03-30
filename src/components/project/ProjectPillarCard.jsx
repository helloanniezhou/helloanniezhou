import React from "react";
import "./ProjectDetailShared.css";

function ProjectPillarCard({ emoji, text }) {
  return (
    <article className="project-pillar-card">
      <div className="project-pillar-emoji" aria-hidden="true">
        {emoji}
      </div>
      <p>{text}</p>
    </article>
  );
}

export default ProjectPillarCard;
