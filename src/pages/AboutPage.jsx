import React from "react";
import ResumeRow from "../components/ResumeRow";
import aboutData from "../data/about";
import { publicUrl } from "../lib/publicUrl";
import "./AboutCase.css";

function AboutPage() {
  const { testimonials, workExperience, education, approachCards } = aboutData;

  return (
    <main className="content content-about about-case">
      <div className="about-case-bind">
        <div className="about-case-sheet">
          <header className="about-case-rail">
            <span className="about-case-meta">Participant profile</span>
            <span className="about-case-id">9-625-ANN-RC</span>
          </header>

          <h1>Annie Zhou</h1>
          <p className="about-case-tagline">
            UX design leadership · Google · MBA, Harvard Business School
          </p>

          <div className="about-case-lead">
            <div className="about-case-lead-body">
              <p>
                UX designer with 10+ years at Google and an MBA from HBS. I focus on the messy 0-to-1
                stage—especially where AI can unlock new ways for people to create, work, and think.
              </p>
              <p>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </p>
            </div>
            <img
              className="about-case-photo"
              src={publicUrl("/media/LRG_DSC07385.jpeg")}
              alt="Annie Zhou portrait"
            />
          </div>

          <hr className="about-case-rule" />

          <section className="about-case-exhibit">
            <h2>Exhibit 1 — Background</h2>
            <div className="resume-list">
              {workExperience.map((item) => (
                <ResumeRow
                  key={`${item.time}-${item.role}`}
                  timeRange={item.time}
                  title={item.role}
                  location={item.location}
                />
              ))}
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

          <hr className="about-case-rule" />

          <section className="about-case-exhibit">
            <h2>Exhibit 2 — Colleague perspectives</h2>
            <ul className="about-case-pulls">
              {testimonials.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ul>
          </section>

          <hr className="about-case-rule" />

          <section className="about-case-exhibit">
            <h2>Exhibit 3 — Working style</h2>
            <ul className="about-case-list">
              {approachCards.map((card) => (
                <li key={card.title}>
                  <strong>{card.title}.</strong>{" "}
                  <span dangerouslySetInnerHTML={{ __html: card.body }} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
