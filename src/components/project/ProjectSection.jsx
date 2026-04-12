import React from "react";
import "./ProjectDetailShared.css";

function ProjectSection({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default ProjectSection;
