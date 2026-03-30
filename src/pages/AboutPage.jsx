import React from "react";
import ResumeRow from "../components/ResumeRow";
import QuoteCard from "../components/QuoteCard";
import ApproachCard from "../components/ApproachCard";
import aboutData from "../data/about";

function AboutPage() {
  const { testimonials, workExperience, education, approachCards } = aboutData;

  return (
    <main className="content content-about">
      <section className="about-hero">
        <h1 className="about-title">About Annie</h1>
        <div className="about-intro-wrap">
          <p className="about-intro">
            I&apos;m a UX designer, with 10+ years at Google and an MBA from Harvard.
            I&apos;m drawn to the messy 0 to 1 stage, especially where AI can unlock new ways
            for people to create, work, and think.
            <br />
            <br />
            Find me on{" "}
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              Linkedin
            </a>
            .
          </p>
          <img
            className="about-avatar"
            src="https://placehold.co/200x200"
            alt="Annie Zhou portrait"
          />
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-label">What people say about me</h2>
        <div className="quote-grid">
          {testimonials.map((quote) => (
            <QuoteCard key={quote} quote={quote} />
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-label">Work Experience</h2>
        <div className="resume-list">
          {workExperience.map((item) => (
            <ResumeRow
              key={`${item.time}-${item.role}`}
              timeRange={item.time}
              title={item.role}
              location={item.location}
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-label">Education</h2>
        <div className="resume-list">
          {education.map((item) => (
            <ResumeRow
              key={`${item.time}-${item.role}`}
              timeRange={item.time}
              title={item.role}
              location={item.location}
              isEducation
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-label">My approach</h2>
        <div className="approach-grid">
          {approachCards.map((card) => (
            <ApproachCard key={card.title} emoji={card.emoji} title={card.title} body={card.body} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
