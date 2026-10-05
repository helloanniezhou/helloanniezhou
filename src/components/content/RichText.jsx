import React from "react";
import { Link } from "react-router-dom";
import { usePublishedPosts } from "../../context/PublishedPostsContext";
import { resolveContentHref } from "../../lib/contentHref";

function renderStyledRun(run) {
  const text = run.text ?? "";
  let el = text;
  if (run.code) {
    el = <code>{text}</code>;
  } else {
    if (run.bold) el = <strong>{text}</strong>;
    if (run.italic) el = <em>{el}</em>;
  }
  if (run.strikethrough) {
    el = <s>{el}</s>;
  }
  if (run.underline) {
    el = <span className="content-underline">{el}</span>;
  }
  return el;
}

function RichText({ runs }) {
  const { isProjectPathPublished } = usePublishedPosts();

  function renderRun(run) {
    const text = run.text ?? "";
    if (run.href) {
      const resolved = resolveContentHref(run.href);
      if (resolved.kind === "internal") {
        if (!isProjectPathPublished(resolved.to)) {
          return renderStyledRun(run);
        }
        return <Link to={resolved.to}>{renderStyledRun(run)}</Link>;
      }
      if (resolved.kind === "external") {
        return (
          <a href={resolved.href} target="_blank" rel="noreferrer">
            {renderStyledRun(run)}
          </a>
        );
      }
    }

    return renderStyledRun(run);
  }

  if (!runs?.length) {
    return null;
  }

  /* Single wrapper so parents (e.g. flex column `li`) don’t stack each run on its own line */
  return (
    <span className="content-rich-text">
      {runs.map((run, i) => (
        <React.Fragment key={`${i}-${run.text ?? ""}`}>{renderRun(run)}</React.Fragment>
      ))}
    </span>
  );
}

export default RichText;
