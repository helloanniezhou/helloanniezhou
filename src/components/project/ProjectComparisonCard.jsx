import React from "react";
import "./ProjectDetailShared.css";

function ProjectComparisonCard({ title, description, isStructured = false }) {
  return (
    <li>
      <h3>{title}</h3>
      <figure data-viz={isStructured ? "bars" : "circle"} aria-hidden="true">
        {isStructured ? (
          <>
            <i />
            <i />
            <i />
            <i />
          </>
        ) : null}
      </figure>
      <p>{description}</p>
    </li>
  );
}

export default ProjectComparisonCard;
