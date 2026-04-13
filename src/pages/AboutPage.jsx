import React, { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NotionBlocks from "../components/notion/NotionBlocks";
import aboutData from "../data/about";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";

const aboutProjectsNotionDoc = getNotionDocForSlug("about-projects");

function AboutPage() {
  const location = useLocation();
  const prevPathRef = useRef(undefined);

  const { workExperience, education } = aboutData;
  const notionBlocks = aboutProjectsNotionDoc?.blocks;
  const hasNotionProjects = Boolean(notionBlocks?.length);

  useLayoutEffect(() => {
    const el = document.getElementById("projects");
    const prev = prevPathRef.current;
    prevPathRef.current = location.pathname;

    if (!el || location.hash !== "#projects") return;

    const navigatedHomeFromProject = prev != null && prev !== "/" && location.pathname === "/";
    const initialLoadWithHash = prev === undefined && location.hash === "#projects";
    if (navigatedHomeFromProject || initialLoadWithHash) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [location.pathname, location.hash]);

  return (
    <article className="md">
      <h1 className="about-title">
        About Annie
        <img
          className="about-title__look"
          src="/cursors/look.svg"
          alt=""
          decoding="async"
        />
      </h1>
      <p className="intro-text">
        I&apos;m a UX designer, with 10+ years at Google and an MBA from Harvard. I love to build prototypes and think about the business of the product. Find me on{" "}
        <a href="https://www.linkedin.com/in/annieyezhou/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        .
      </p>

      {hasNotionProjects ? (
        <div id="projects" className="about-projects-section">
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
