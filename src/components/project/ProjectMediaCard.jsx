import React from "react";
import MediaVisual from "../MediaVisual";
import "./ProjectDetailShared.css";

function ProjectMediaCard({ imageSrc, imageAlt, caption, phone = false }) {
  return (
    <article className={`project-media-card ${phone ? "is-phone" : ""}`}>
      <MediaVisual src={imageSrc} alt={imageAlt} className="project-media-image" />
      <p className="project-media-caption">{caption}</p>
    </article>
  );
}

export default ProjectMediaCard;
