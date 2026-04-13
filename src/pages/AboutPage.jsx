import React from "react";
import NotionBlocks from "../components/notion/NotionBlocks";
import aboutData from "../data/about";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";

const aboutProjectsNotionDoc = getNotionDocForSlug("about-projects");

function AboutPage() {
  const { workExperience, education } = aboutData;
  const notionBlocks = aboutProjectsNotionDoc?.blocks;
  const hasNotionProjects = Boolean(notionBlocks?.length);

  return (
    <article className="md">
      <h1>About Annie</h1>
      <p className="intro-text">
        I&apos;m a UX designer, with 10+ years at Google and an MBA from Harvard. I&apos;m drawn to the messy 0→1
        stage, especially where AI can unlock new ways for people to create, work, and think. Find me on{" "}
        <a href="https://www.linkedin.com/in/annieyezhou/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        .
      </p>

      {hasNotionProjects ? (
        <div className="about-projects-section">
          <h2>Projects</h2>
          <div className="about-projects-item">
            <NotionBlocks blocks={notionBlocks} />
          </div>
        </div>
      ) : null}

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

export default AboutPage;
