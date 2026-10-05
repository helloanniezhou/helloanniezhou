import React from "react";
import aboutData from "../data/about";

export default function ResumePage() {
  const { workExperience, education } = aboutData;

  return (
    <article className="md">
      <h1>Resume</h1>
      <p className="resume-intro resume-name">Annie Zhou</p>
      <p className="resume-intro">
        <strong>Staff UX Design Leader with 10+ Years in AI &amp; Consumer Products</strong>
      </p>
      <p className="resume-intro">
        Product and design leader with 10+ years building 0→1 consumer experiences at Google, spanning frontier AI, health, Search, Assistant, and fintech. Currently leading design for Project Genie, Google DeepMind’s frontier world model, partnering across product and research to shape both product strategy and model capabilities. Combines deep UX expertise with business strategy through an MBA from Harvard Business School.
      </p>
      <div className="resume-section">
        <h2>Work experience</h2>
        {workExperience.map((item) => (
          <div key={`${item.time}-${item.role}`} className="md-item">
            <span className="md-time">{item.time}</span>
            <p className="md-title">{item.role}</p>
            <span className="md-place">{item.location}</span>
          </div>
        ))}

        <h2>Education</h2>
        {education.map((item) => (
          <div key={`${item.time}-${item.role}`} className="md-item">
            <span className="md-time">{item.time}</span>
            <p className="md-title">{item.role}</p>
            <span className="md-place">{item.location}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
