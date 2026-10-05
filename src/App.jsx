import React, { useEffect, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import TwoColumnLayout from "./components/TwoColumnLayout";
import AboutPage from "./pages/AboutPage";
import ArtworkPage from "./pages/ArtworkPage";
import ResumePage from "./pages/ResumePage";
import CrmPage from "./pages/CrmPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ScrollReveal from "./components/ScrollReveal";

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
  const { pathname } = useLocation();
  return (
    <div className="page page--twocol">
      <ScrollToTop />
      <ScrollReveal />
      <Analytics />
      <BlockImageContextMenu />
      <div key={pathname} className="route-frame">
        <Routes>
          <Route path="/CRM" element={<CrmPage />} />
          <Route path="/crm" element={<Navigate to="/CRM" replace />} />
          <Route element={<TwoColumnLayout />}>
            <Route path="/" element={<AboutPage />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/artwork" element={<ArtworkPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>

      <footer className="tc-foot">
        <p>Designed and developed by Annie Zhou</p>
      </footer>
    </div>
  );
}

export default App;
