import React from "react";
import "./ProjectDetailShared.css";

function ProjectFeatureRow({ title, description, imageSrc, imageAlt, reverse = false }) {
  return (
    <article className={`project-feature-row ${reverse ? "is-reverse" : ""}`}>
      <div className="project-feature-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <img src={imageSrc} alt={imageAlt} className="project-feature-image" />
    </article>
  );
}

export default ProjectFeatureRow;
