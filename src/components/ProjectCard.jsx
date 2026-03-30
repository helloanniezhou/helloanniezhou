import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

function ProjectCard({
  title,
  description,
  slug,
  imageSrc,
  imageAlt,
  comingSoon = false,
  titleLight = false
}) {
  const content = (
    <article className="project-card">
      <div className={`project-card-media ${comingSoon ? "is-placeholder" : ""}`}>
        {comingSoon ? (
          <div className="project-card-coming-soon">Coming soon</div>
        ) : (
          <img src={imageSrc} alt={imageAlt} className="project-card-image" />
        )}
      </div>

      <div className="project-card-content">
        <h3 className={`project-card-title ${titleLight ? "is-light" : ""}`}>{title}</h3>
        <p
          className="project-card-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </article>
  );

  if (comingSoon || !slug) {
    return content;
  }

  return (
    <Link to={`/projects/${slug}`} className="project-card-link">
      {content}
    </Link>
  );
}

export default ProjectCard;
