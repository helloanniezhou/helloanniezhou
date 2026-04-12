import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import ArtworkPage from "./pages/ArtworkPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AdminEditorPage from "./pages/AdminEditorPage";

function App() {
  const location = useLocation();
  const bookRoute =
    location.pathname === "/" ||
    location.pathname.startsWith("/projects/") ||
    location.pathname === "/artwork";

  return (
    <div className="page">
      <div
        key={location.pathname}
        className={`route-frame ${bookRoute ? "route-frame--book" : "route-frame-animate"}`}
      >
        <Routes location={location}>
          <Route path="/" element={<WorkPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/artwork" element={<ArtworkPage />} />
          <Route path="/edit" element={<AdminEditorPage />} />
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
