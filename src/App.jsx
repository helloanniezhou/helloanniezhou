import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import TwoColumnLayout from "./components/TwoColumnLayout";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import ArtworkPage from "./pages/ArtworkPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {
  const location = useLocation();

  return (
    <div className="page page--twocol">
      <div key={location.pathname} className="route-frame route-frame-animate">
        <Routes location={location}>
          <Route element={<TwoColumnLayout />}>
            <Route path="/" element={<WorkPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
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
