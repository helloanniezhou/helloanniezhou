import React from "react";
import "./BookSpread.css";

/**
 * Text-forward “open book” frame: paper surface, folio, page-turn entrance.
 * @param {"folio"|"art"} variant
 */
function BookSpread({ children, chapter, folio, variant = "folio", turnDelayMs = 0, className = "" }) {
  const folioText = typeof folio === "number" ? String(folio) : folio;
  const pageStyle =
    turnDelayMs > 0 ? { "--book-turn-delay": `${turnDelayMs}ms` } : undefined;
  const rootClass = ["book-spread", `book-spread--${variant}`, className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <div className="book-page book-page--turn" style={pageStyle}>
        {children}
        <div className="book-folio" aria-hidden="true">
          {chapter ? <span className="book-folio-chapter">{chapter}</span> : null}
          <span className="book-folio-num">{folioText}</span>
        </div>
      </div>
    </div>
  );
}

export default BookSpread;
