import React, { useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import TwoColumnLayout from "./components/TwoColumnLayout";
import AboutPage from "./pages/AboutPage";
import ArtworkPage from "./pages/ArtworkPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="page page--twocol">
      <ScrollToTop />
      <div className="route-frame">
        <Routes>
          <Route element={<TwoColumnLayout />}>
            <Route path="/" element={<AboutPage />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/artwork" element={<ArtworkPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>

      <footer className="tc-foot">
        <p>&copy; 2026 Annie Zhou.</p>
      </footer>
    </div>
  );
}

export default App;
