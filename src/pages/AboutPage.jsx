import React from "react";
import aboutData from "../data/about";

function AboutPage() {
  const { workExperience, education } = aboutData;

  return (
    <article className="md">
      <h1>About Annie</h1>
      <p>
        I&apos;m a UX designer, with 10+ years at Google and an MBA from Harvard. I&apos;m drawn to the messy 0→1
        stage, especially where AI can unlock new ways for people to create, work, and think. Find me on{" "}
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
          Linkedin
        </a>
        .
      </p>

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
    </article>
  );
}

export default AboutPage;
