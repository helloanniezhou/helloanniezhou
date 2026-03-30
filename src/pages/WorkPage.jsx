import React from "react";
import ProjectCard from "../components/ProjectCard";
import projects from "../data/projects";

function WorkPage() {
  return (
    <main className="content content-work">
      <section className="work-hero">
        <h1 className="work-title">Annie Zhou</h1>
        <p className="work-subtitle">
          <span>
            👩🏻‍💻 Leading UX design at Fitbit at Google and exploring the possibility of
            genAI. Find me on{" "}
          </span>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            Linkedin
          </a>
          <span>.</span>
        </p>
      </section>

      <section className="projects-grid" aria-label="Projects">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            slug={project.slug}
            imageSrc={project.imageSrc}
            imageAlt={project.imageAlt}
            comingSoon={project.comingSoon}
            titleLight={project.titleLight}
          />
        ))}
      </section>
    </main>
  );
}

export default WorkPage;
