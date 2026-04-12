import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import BookSectionTabs from "./BookSectionTabs";
import "./InteractiveBook.css";

function getPointerX(e) {
  return e.touches?.length ? e.touches[0].clientX : e.clientX;
}

function isInteractiveTarget(target) {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest("a, button, input, textarea, select, [data-book-interactive]"));
}

/**
 * 3D book with drag-to-flip (ref/bookAnimaation). Spreads are ordered front-to-back on the right stack.
 * @param {React.ReactNode} cover — cover face (inside board)
 * @param {{ front: React.ReactNode, back: React.ReactNode }[]} spreads
 * @param {number} [folioStart=1] — printed number on first spread front
 */
function InteractiveBook({
  cover,
  spreads,
  className = "",
  hint,
  folioStart = 1,
  navJump = null,
  onSpreadIndexChange,
  sectionTabs = null,
  sectionTabActiveKey = "",
  onSectionTabSelect = () => {}
}) {
  const totalPages = spreads.length;
  const sceneRef = useRef(null);
  const coverRef = useRef(null);
  const pageRefs = useRef([]);
  const suppressClickUntilRef = useRef(0);
  const [currentPage, setCurrentPage] = useState(-1);
  const currentPageRef = useRef(-1);
  const isAnimatingRef = useRef(false);
  const dragStateRef = useRef(null);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    onSpreadIndexChange?.(currentPage);
  }, [currentPage, onSpreadIndexChange]);

  useLayoutEffect(() => {
    if (!navJump || typeof navJump.targetPage !== "number") return;
    const target = navJump.targetPage;
    const clamped = target < 0 ? -1 : Math.min(target, totalPages);
    for (let i = 0; i < totalPages; i++) {
      const el = pageRefs.current[i];
      if (!el) continue;
      if (clamped < 0) el.classList.remove("ib-flipped");
      else if (i < clamped) el.classList.add("ib-flipped");
      else el.classList.remove("ib-flipped");
    }
    setCurrentPage(clamped < 0 ? -1 : clamped);
    suppressClickUntilRef.current = Date.now() + 450;
  }, [navJump, totalPages]);

  const getPageEl = (i) => pageRefs.current[i] ?? null;

  const leftSpreadIndex = currentPage >= 0 && currentPage < totalPages ? currentPage : -1;

  const indicatorLabel = (() => {
    if (currentPage < 0) return "Cover";
    if (currentPage >= totalPages) return "End";
    const a = folioStart + currentPage * 2;
    return `${a} — ${a + 1}`;
  })();

  const prevDisabled = currentPage < 0;
  const nextDisabled = currentPage >= totalPages;

  const flipNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    const cp = currentPageRef.current;

    if (cp === -1) {
      isAnimatingRef.current = true;
      setCurrentPage(0);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 900);
      return;
    }

    if (cp < totalPages) {
      isAnimatingRef.current = true;
      const page = getPageEl(cp);
      if (page) page.classList.add("ib-flipped");
      setCurrentPage((p) => p + 1);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 800);
    }
  }, [totalPages]);

  const flipPrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    const cp = currentPageRef.current;

    if (cp === 0) {
      isAnimatingRef.current = true;
      setCurrentPage(-1);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 900);
      return;
    }

    if (cp > 0) {
      isAnimatingRef.current = true;
      const prev = cp - 1;
      const page = getPageEl(prev);
      if (page) page.classList.remove("ib-flipped");
      setCurrentPage((p) => p - 1);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 800);
    }
  }, []);

  const startDrag = useCallback(
    (e, targetEl, direction, startX) => {
      if (!targetEl || !direction) return;
      e.preventDefault();
      const angle0 =
        direction === "prev" || direction === "prev-cover" ? -180 : 0;
      dragStateRef.current = {
        el: targetEl,
        direction,
        startX,
        started: false,
        angle: angle0
      };
    },
    []
  );

  const onDragStart = useCallback(
    (e) => {
      if (isAnimatingRef.current) return;
      if (isInteractiveTarget(e.target)) return;

      const startX = getPointerX(e);
      const scene = sceneRef.current;
      if (!scene) return;

      const sceneRect = scene.getBoundingClientRect();
      const bookCenterX = sceneRect.left + sceneRect.width / 2;
      const relX = startX - bookCenterX;
      const cp = currentPageRef.current;

      let targetEl = null;
      let direction = null;

      if (cp === -1) {
        if (relX >= -20) {
          targetEl = coverRef.current;
          direction = "next";
        }
        startDrag(e, targetEl, direction, startX);
        return;
      }

      if (relX > 0) {
        if (cp >= 0 && cp < totalPages) {
          targetEl = getPageEl(cp);
          direction = "next";
        }
      } else if (cp === 0) {
        targetEl = coverRef.current;
        direction = "prev-cover";
      } else if (cp > 0) {
        targetEl = getPageEl(cp - 1);
        direction = "prev";
      }

      startDrag(e, targetEl, direction, startX);
    },
    [startDrag, totalPages]
  );

  const onDragMove = useCallback((e) => {
    const dragState = dragStateRef.current;
    if (!dragState) return;

    const currentX = getPointerX(e);
    const dx = currentX - dragState.startX;

    if (!dragState.started) {
      if (Math.abs(dx) < 5) return;
      dragState.started = true;
      dragState.el.classList.add("ib-dragging");
      isAnimatingRef.current = true;
    }

    e.preventDefault();

    const scene = sceneRef.current;
    if (!scene) return;
    const sceneRect = scene.getBoundingClientRect();
    const maxDrag = sceneRect.width * 0.5;

    let angle;
    if (dragState.direction === "next") {
      const clampedDx = Math.min(0, dx);
      const p = Math.max(0, Math.min(1, Math.abs(clampedDx) / maxDrag));
      angle = -180 * p;
    } else {
      const clampedDx = Math.max(0, dx);
      const p = Math.max(0, Math.min(1, clampedDx / maxDrag));
      angle = -180 + 180 * p;
    }

    dragState.angle = angle;
    dragState.el.style.transform = `rotateY(${angle}deg)`;
  }, []);

  const finishDragAnim = useCallback(() => {
    isAnimatingRef.current = false;
  }, []);

  const onDragEnd = useCallback(() => {
    const dragState = dragStateRef.current;
    if (!dragState) return;

    if (!dragState.started) {
      dragStateRef.current = null;
      return;
    }

    const { el, direction, angle } = dragState;
    el.classList.remove("ib-dragging");

    const threshold = -90;
    let commit = false;
    if (direction === "next") {
      commit = angle < threshold;
    } else {
      commit = angle > threshold;
    }

    const duration = "0.45s";
    const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
    suppressClickUntilRef.current = Date.now() + 320;

    if (direction === "next") {
      if (commit) {
        if (el === coverRef.current) {
          el.style.transition = `transform ${duration} ${easing}`;
          el.style.transform = "rotateY(-180deg)";
          setCurrentPage(0);
          setTimeout(() => {
            el.style.transition = "";
            el.style.transform = "";
            finishDragAnim();
          }, 500);
        } else {
          el.style.transition = `transform ${duration} ${easing}`;
          el.classList.add("ib-flipped");
          el.style.transform = "";
          setCurrentPage((p) => p + 1);
          setTimeout(() => {
            el.style.transition = "";
            finishDragAnim();
          }, 500);
        }
      } else {
        el.style.transition = `transform ${duration} ${easing}`;
        el.style.transform = "rotateY(0deg)";
        setTimeout(() => {
          el.style.transform = "";
          el.style.transition = "";
          finishDragAnim();
        }, 500);
      }
    } else if (direction === "prev-cover") {
      if (commit) {
        el.style.transition = `transform ${duration} ${easing}`;
        el.style.transform = "rotateY(0deg)";
        setCurrentPage(-1);
        setTimeout(() => {
          el.style.transition = "";
          el.style.transform = "";
          finishDragAnim();
        }, 500);
      } else {
        el.style.transition = `transform ${duration} ${easing}`;
        el.style.transform = "rotateY(-180deg)";
        setTimeout(() => {
          el.style.transition = "";
          finishDragAnim();
        }, 500);
      }
    } else if (direction === "prev") {
      if (commit) {
        el.style.transition = `transform ${duration} ${easing}`;
        el.classList.remove("ib-flipped");
        el.style.transform = "";
        setCurrentPage((p) => p - 1);
        setTimeout(() => {
          el.style.transition = "";
          finishDragAnim();
        }, 500);
      } else {
        el.style.transition = `transform ${duration} ${easing}`;
        el.style.transform = "rotateY(-180deg)";
        setTimeout(() => {
          el.style.transform = "";
          el.style.transition = "";
          finishDragAnim();
        }, 500);
      }
    }

    dragStateRef.current = null;
  }, [finishDragAnim]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && isInteractiveTarget(e.target)) return;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") flipNext();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev]);

  useEffect(() => {
    const onMove = (e) => onDragMove(e);
    const onUp = () => onDragEnd();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [onDragMove, onDragEnd]);

  const onPageClick = useCallback(
    (e) => {
      if (Date.now() < suppressClickUntilRef.current) return;
      if (isInteractiveTarget(e.target)) return;
      if (!isAnimatingRef.current) flipNext();
    },
    [flipNext]
  );

  const onCoverClick = useCallback(
    (e) => {
      if (Date.now() < suppressClickUntilRef.current) return;
      if (isInteractiveTarget(e.target)) return;
      if (currentPageRef.current === -1 && !isAnimatingRef.current) flipNext();
    },
    [flipNext]
  );

  const hasSectionTabs = Array.isArray(sectionTabs) && sectionTabs.length > 0;

  const spreadTabs = (i) =>
    hasSectionTabs ? (
      <div
        className="ib-spread-tabs"
        aria-hidden={currentPage < 0 || i !== currentPage}
      >
        <BookSectionTabs
          tabs={sectionTabs}
          activeKey={sectionTabActiveKey}
          onSelect={onSectionTabSelect}
          variant="on-book"
        />
      </div>
    ) : null;

  return (
    <div className={`interactive-book-wrap ${className}`.trim()}>
      <div
        ref={sceneRef}
        className="interactive-book-scene"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        role="presentation"
      >
        <div className="interactive-book">
          <div className="ib-book-shadow" aria-hidden="true" />
          <div className="ib-left-page-edges" aria-hidden="true" />
          <div className="ib-left-pages" style={{ zIndex: totalPages + 5 }}>
            {spreads.map((spread, i) => {
              const leftActive = leftSpreadIndex === i;
              const versoNum = folioStart + i * 2 + 1;
              return (
                <div
                  key={`left-${i}`}
                  className={`ib-left-content ${leftActive ? "ib-active" : ""}`}
                >
                  <div className="ib-page-body">{spread.back}</div>
                  <span className="ib-page-num ib-page-num--left">{versoNum}</span>
                </div>
              );
            })}
          </div>
          <div className="ib-page-edges" aria-hidden="true" />
          <div className="ib-cover-back" aria-hidden="true" />

          {spreads.map((spread, i) => {
            const nFront = folioStart + i * 2;
            const nBack = folioStart + i * 2 + 1;
            const flipped = currentPage >= 0 && i < currentPage;
            const pageZ = flipped ? i + 2 : totalPages * 2 - i + 10;
            return (
              <div
                key={`page-${i}`}
                ref={(el) => {
                  pageRefs.current[i] = el;
                }}
                className="ib-page"
                style={{ zIndex: pageZ }}
                onClick={onPageClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPageClick(e);
                  }
                }}
                aria-label={`Spread ${i + 1}, turn page`}
              >
                <div className="ib-page-face ib-page-front">
                  {spreadTabs(i)}
                  <div className="ib-page-body">{spread.front}</div>
                  <span className="ib-page-num">{nFront}</span>
                </div>
                <div className="ib-page-face ib-page-back">
                  <div className="ib-page-body">{spread.back}</div>
                  <span className="ib-page-num">{nBack}</span>
                </div>
              </div>
            );
          })}

          <div
            ref={coverRef}
            className={`ib-cover-front${currentPage >= 0 ? " ib-cover-open" : ""}`}
            onClick={onCoverClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCoverClick(e);
              }
            }}
            aria-label="Book cover, open"
          >
            <div className="ib-cover-face">
              {hasSectionTabs ? (
                <div className="ib-cover-tabs" aria-hidden={currentPage >= 0}>
                  <BookSectionTabs
                    tabs={sectionTabs}
                    activeKey={sectionTabActiveKey}
                    onSelect={onSectionTabSelect}
                    variant="on-cover"
                  />
                </div>
              ) : null}
              {cover}
            </div>
          </div>
        </div>
      </div>

      <div className="ib-controls">
        <button type="button" className="ib-btn" disabled={prevDisabled} onClick={flipPrev} aria-label="Previous page">
          ‹
        </button>
        <div className="ib-indicator" aria-live="polite">
          {indicatorLabel}
        </div>
        <button type="button" className="ib-btn" disabled={nextDisabled} onClick={flipNext} aria-label="Next page">
          ›
        </button>
      </div>

      {hint ? <p className="ib-hint">{hint}</p> : null}
    </div>
  );
}

export default InteractiveBook;
