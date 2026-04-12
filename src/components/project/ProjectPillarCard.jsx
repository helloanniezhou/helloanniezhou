import React from "react";
import "./ProjectDetailShared.css";

function ProjectPillarCard({ emoji, text }) {
  return (
    <li>
      <i aria-hidden="true">{emoji}</i>
      <p>{text}</p>
    </li>
  );
}

export default ProjectPillarCard;
