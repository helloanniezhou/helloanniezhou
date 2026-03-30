import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import TopNavLink from "./components/TopNavLink";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import ArtworkPage from "./pages/ArtworkPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {
  const location = useLocation();

  return (
    <div className="page">
      <header className="top-nav-wrap">
        <nav className="top-nav" aria-label="Primary">
          <TopNavLink to="/" label="Work" end />
          <TopNavLink to="/about" label="About" />
          <TopNavLink to="/artwork" label="Artwork" />
        </nav>
      </header>

      <div key={location.pathname} className="route-frame route-frame-animate">
        <Routes location={location}>
          <Route path="/" element={<WorkPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/artwork" element={<ArtworkPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>
            &copy; 2026 Annie Zhou. Images &copy; Annie Zhou &amp; respective companies.
            <br />
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
