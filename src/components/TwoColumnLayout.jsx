import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePublishedPosts } from "../context/PublishedPostsContext";
import { listCaseStudiesForNav } from "../content/projects";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const page = menuButtonRef.current?.closest(".page");
    const previousOverflow = document.body.style.overflow;
    const previousInert = page?.inert;
    document.body.style.overflow = "hidden";
    if (page) page.inert = true;
    navigationRef.current?.querySelector("button")?.focus();
    const media = window.matchMedia("(max-width: 1024px)");
    const onResize = () => { if (!media.matches) setMenuOpen(false); };
    media.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (page) page.inert = previousInert;
      media.removeEventListener("change", onResize);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);
  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };
  const { isSlugPublished } = usePublishedPosts();
  const caseStudies = listCaseStudiesForNav().filter(
    ({ slug }) => isSlugPublished(slug)
  );

  const navigation = (
      <nav
        ref={navigationRef}
        id="site-navigation"
        className={`tc-side${menuOpen ? " tc-side--open" : ""}`}
        aria-label="Site"
        onClick={(event) => {
          if (menuOpen && event.target.closest("a")) closeMenu();
        }}
        onKeyDown={(event) => {
          if (!menuOpen) return;
          if (event.key === "Escape") closeMenu();
          if (event.key === "Tab") {
            const controls = navigationRef.current.querySelectorAll("button, a[href]");
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault(); first.focus();
            }
          }
        }}
      >
        <button className="tc-menu-toggle tc-menu-close" type="button" onClick={closeMenu} aria-label="Close navigation menu">
          <span aria-hidden="true">×</span> Close
        </button>
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
          <NavLink to="/resume" className={linkClass}>
            Resume
          </NavLink>
        </div>
        <div className="tc-stack">
          <NavLink to="/artwork" className={linkClass}>
            Artwork
          </NavLink>
        </div>
      </nav>
  );

  return (
    <div className="tc">
      <button
        ref={menuButtonRef}
        className="tc-menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>{menuOpen ? "Close" : "Menu"}</span>
      </button>
      {menuOpen ? createPortal(navigation, document.body) : navigation}

      <main className="tc-body">
        <Outlet />
      </main>
    </div>
  );
}
