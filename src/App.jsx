import React, { useEffect, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
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

function BlockImageContextMenu() {
  useEffect(() => {
    const onContextMenu = (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);
  return null;
}

function App() {
  return (
    <div className="page page--twocol">
      <ScrollToTop />
      <BlockImageContextMenu />
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
        <p>&copy; 2026 Annie Zhou. Vibe coded with Cursor, powered by Notion API.</p>
      </footer>
      
      <Analytics />
    </div>
  );
}

export default App;
