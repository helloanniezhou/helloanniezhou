import React, { useCallback, useMemo, useRef, useState } from "react";
import InteractiveBook from "../components/book/InteractiveBook";
import projects from "../data/projects";
import artworkItems from "../data/artwork";
import { BOOK_WORK_PAGE } from "../lib/bookFolio";
import {
  buildWorkBookNavTargets,
  buildWorkBookSpreads,
  getActiveWorkBookTabKey
} from "../lib/workBookSpreads";

function WorkPage() {
  const spreads = useMemo(() => buildWorkBookSpreads(projects, artworkItems), []);
  const navTabs = useMemo(() => buildWorkBookNavTargets(projects), []);
  const [navJump, setNavJump] = useState(null);
  const [bookSpread, setBookSpread] = useState(-1);
  const bookTopRef = useRef(null);
  const onSpreadIndexChange = useCallback((idx) => setBookSpread(idx), []);

  const activeTabKey = useMemo(() => getActiveWorkBookTabKey(bookSpread, navTabs), [bookSpread, navTabs]);

  const handleTabSelect = useCallback((tab) => {
    setNavJump({ targetPage: tab.targetPage, id: Date.now() });
    requestAnimationFrame(() => {
      bookTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const cover = (
    <div className="ib-cover-inner">
      <div className="ib-cover-ornament" aria-hidden="true" />
      <h2 className="ib-cover-title">Annie Zhou</h2>
      <p className="ib-cover-sub">
        Work, case studies, and illustration — one volume.{" "}
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-book-interactive>
          LinkedIn
        </a>
        .
      </p>
      <div className="ib-cover-ornament" aria-hidden="true" />
    </div>
  );

  return (
    <main ref={bookTopRef} className="content content-work content-work-book">
      <InteractiveBook
        cover={cover}
        spreads={spreads}
        folioStart={BOOK_WORK_PAGE + 1}
        hint="Drag the page, tap, or use ← → / A D keys."
        navJump={navJump}
        onSpreadIndexChange={onSpreadIndexChange}
        sectionTabs={navTabs}
        sectionTabActiveKey={activeTabKey}
        onSectionTabSelect={handleTabSelect}
      />
    </main>
  );
}

export default WorkPage;
