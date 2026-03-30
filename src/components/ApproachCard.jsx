import React from "react";
import "./ApproachCard.css";

function ApproachCard({ emoji, title, body }) {
  return (
    <article className="approach-card">
      <div className="approach-emoji">{emoji}</div>
      <h3 className="approach-title">{title}</h3>
      <p className="approach-body" dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}

export default ApproachCard;
