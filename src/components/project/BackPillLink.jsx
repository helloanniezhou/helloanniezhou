import React from "react";
import { Link } from "react-router-dom";
import "./ProjectDetailShared.css";

function BackPillLink({ to = "/", label = "Back" }) {
  return (
    <Link to={to} className="project-back-pill">
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}

export default BackPillLink;
