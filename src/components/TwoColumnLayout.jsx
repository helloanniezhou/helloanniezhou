import React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { listCaseStudiesForNav } from "../lib/notionProjects";
import "./TwoColumnLayout.css";

function linkClass({ isActive }) {
  return `tc-a${isActive ? " tc-a--on" : ""}`;
}

function ProjectsSideLink() {
  const location = useLocation();
  const navigate = useNavigate();
  const onAbout = location.pathname === "/";

  const handleClick = (e) => {
    if (!onAbout) return;
    e.preventDefault();
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    navigate({ pathname: "/", hash: "projects" }, { replace: true });
  };

  return (
    <Link to={{ pathname: "/", hash: "projects" }} className="tc-a" onClick={handleClick}>
      Projects
    </Link>
  );
}

export default function TwoColumnLayout() {
  const caseStudies = listCaseStudiesForNav();

  return (
    <div className="tc">
      <nav className="tc-side" aria-label="Site">
        <div className="tc-stack">
          <NavLink to="/" end className={linkClass}>
            About
          </NavLink>
        </div>
        <div className="tc-stack">
          <ProjectsSideLink />
          <ul className="tc-stack tc-stack--tight">
            {caseStudies.map(({ slug, title }) => (
              <li key={slug}>
                <NavLink to={`/projects/${slug}`} className={linkClass}>
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="tc-stack">
          <NavLink to="/artwork" className={linkClass}>
            Artwork
          </NavLink>
        </div>
      </nav>
      <main className="tc-body">
        <Outlet />
      </main>
    </div>
  );
}
