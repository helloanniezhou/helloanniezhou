import React from "react";
import { Link } from "react-router-dom";
import "./ProjectDetailShared.css";

function BackPillLink({ to = "/", label = "Back" }) {
  return (
    <nav aria-label="Back">
      <Link to={to}>
        <span aria-hidden="true">←</span> {label}
      </Link>
    </nav>
  );
}

export default BackPillLink;
