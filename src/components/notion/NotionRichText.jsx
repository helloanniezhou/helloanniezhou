import React from "react";
import { Link } from "react-router-dom";
import { resolveNotionHref } from "../../lib/notionHref";

function renderRun(run) {
  const text = run.text ?? "";
  if (run.href) {
    const resolved = resolveNotionHref(run.href);
    if (resolved.kind === "internal") {
      return <Link to={resolved.to}>{text}</Link>;
    }
    if (resolved.kind === "external") {
      return (
        <a href={resolved.href} target="_blank" rel="noreferrer">
          {text}
        </a>
      );
    }
  }

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
    el = <span className="notion-underline">{el}</span>;
  }
  return el;
}

function NotionRichText({ runs }) {
  if (!runs?.length) {
    return null;
  }

  /* Single wrapper so parents (e.g. flex column `li`) don’t stack each run on its own line */
  return (
    <span className="notion-rich-text">
      {runs.map((run, i) => (
        <React.Fragment key={`${i}-${run.text ?? ""}`}>{renderRun(run)}</React.Fragment>
      ))}
    </span>
  );
}

export default NotionRichText;
