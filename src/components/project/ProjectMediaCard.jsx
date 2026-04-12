import React from "react";
import "./ProjectDetailShared.css";

function ProjectMediaCard({ imageSrc, imageAlt, caption, phone = false }) {
  return (
    <li>
      <figure data-phone={phone ? "" : undefined}>
        <img src={imageSrc} alt={imageAlt} />
        <figcaption>{caption}</figcaption>
      </figure>
    </li>
  );
}

export default ProjectMediaCard;
