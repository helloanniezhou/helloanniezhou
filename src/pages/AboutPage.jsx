import React, { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ContentBlocks from "../components/content/ContentBlocks";
import aboutProjectsDoc from "../content/about-projects.json";



function AboutPage() {
  const location = useLocation();
  const prevPathRef = useRef(undefined);

  const projectBlocks = aboutProjectsDoc?.blocks;
  const hasProjects = Boolean(projectBlocks?.length);

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
        <strong>I&apos;m a product and design leader with 10+ years building 0→1 experiences across AI and consumer products.</strong>
      </p>
      <p className="intro-text intro-text--body">
        My work combines AI-native design, consumer product intuition, and product strategy, drawing on a background in human-centered design and a Harvard MBA. I currently lead design for Project Genie at Google Labs. Find me on{" "}
        <a href="https://www.linkedin.com/in/annieyezhou/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        .
      </p>

      {hasProjects ? (
        <div id="projects" className="about-projects-section">
          <h2>Projects</h2>
          <div className="about-projects-item">
            <ContentBlocks blocks={projectBlocks} />
          </div>
        </div>
      ) : null}

    </article>
  );
}

export default AboutPage;
