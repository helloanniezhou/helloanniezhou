import React from "react";
import "./ProjectDetailShared.css";

function ProjectFeatureRow({ title, description, imageSrc, imageAlt }) {
  return (
    <section>
      <h3>{title}</h3>
      <p>{description}</p>
      <img src={imageSrc} alt={imageAlt} />
    </section>
  );
}

export default ProjectFeatureRow;
