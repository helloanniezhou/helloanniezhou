import React from "react";
import "./BookSectionTabs.css";

function BookSectionTabs({ tabs, activeKey, onSelect, className = "", variant = "standalone" }) {
  const rootClass = (() => {
    const base = "book-section-tabs";
    if (variant === "on-book") return `${base} book-section-tabs--on-book ${className}`.trim();
    if (variant === "on-cover") return `${base} book-section-tabs--on-cover ${className}`.trim();
    return `${base} ${className}`.trim();
  })();

  return (
    <div className={rootClass} role="tablist" aria-label="Jump to section in the book">
      <div className="book-section-tabs__rail" aria-hidden="true" />
      <div className="book-section-tabs__row">
        {tabs.map((tab) => {
          const active = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`book-section-tabs__tab${active ? " book-section-tabs__tab--active" : ""}`}
              onClick={() => onSelect(tab)}
            >
              <span className="book-section-tabs__tab-pad" aria-hidden="true" />
              <span className="book-section-tabs__label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BookSectionTabs;
