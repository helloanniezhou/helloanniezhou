import React from "react";
import "./ProjectDetailShared.css";

function ProjectComparisonCard({ title, description, isStructured = false }) {
  return (
    <article className="project-compare-card">
      <h3 className="project-compare-title">{title}</h3>
      <div className="project-compare-visual">
        {isStructured ? (
          <div className="project-compare-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
        ) : (
          <div className="project-compare-circle" />
        )}
      </div>
      <p className="project-compare-description">{description}</p>
    </article>
  );
}

export default ProjectComparisonCard;
