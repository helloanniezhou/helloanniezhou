import React from "react";
import { extractDimFromCaptionRuns } from "../../lib/notionExtractDim.js";
import NotionRichText from "./NotionRichText";
import "./NotionBlocks.css";

/** JSON: maxWidth | width | height — number (px) or string (e.g. "50%"). */
function cssDimension(value) {
  if (value == null) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
  return String(value);
}

function notionImageStyle(block) {
  const style = {};
  if (block.maxWidth != null) {
    style.maxWidth = cssDimension(block.maxWidth);
    if (block.width == null) style.width = "100%";
  }
  if (block.width != null) style.width = cssDimension(block.width);
  if (block.height != null) style.height = cssDimension(block.height);
  else if (block.maxWidth != null || block.width != null) style.height = "auto";
  return Object.keys(style).length ? style : undefined;
}

function NotionBlock({ block }) {
  const t = block.type;

  if (t === "paragraph") {
    return (
      <p className="notion-block notion-p">
        <NotionRichText runs={block.richText} />
      </p>
    );
  }

  if (t === "heading_1") {
    return (
      <h1 className="notion-block notion-h1">
        <NotionRichText runs={block.richText} />
      </h1>
    );
  }
  if (t === "heading_2") {
    return (
      <h2 className="notion-block notion-h2">
        <NotionRichText runs={block.richText} />
      </h2>
    );
  }
  if (t === "heading_3") {
    return (
      <h3 className="notion-block notion-h3">
        <NotionRichText runs={block.richText} />
      </h3>
    );
  }

  if (t === "bulleted_list_item") {
    return (
      <li className="notion-block notion-li notion-li--bullet">
        <NotionRichText runs={block.richText} />
        {block.children?.length ? <NotionBlocks blocks={block.children || []} /> : null}
      </li>
    );
  }

  if (t === "numbered_list_item") {
    return (
      <li className="notion-block notion-li notion-li--numbered">
        <NotionRichText runs={block.richText} />
        {block.children?.length ? <NotionBlocks blocks={block.children || []} /> : null}
      </li>
    );
  }

  if (t === "quote") {
    return (
      <blockquote className="notion-block notion-quote">
        <p>
          <NotionRichText runs={block.richText} />
        </p>
      </blockquote>
    );
  }

  if (t === "divider") {
    return <hr className="notion-block notion-divider" />;
  }

  if (t === "image") {
    if (block.unsupported === "hosted_file") {
      return (
        <p className="notion-block notion-image-fallback">
        </p>
      );
    }
    if (!block.url) {
      return null;
    }
    const { runs: captionRuns, maxWidth: dimFromCaption } = extractDimFromCaptionRuns(block.caption || []);
    const imgStyle = notionImageStyle({
      maxWidth: block.maxWidth ?? dimFromCaption,
      width: block.width,
      height: block.height
    });
    return (
      <figure className="notion-block notion-figure">
        <img src={block.url} alt="" loading="lazy" decoding="async" style={imgStyle} />
        {captionRuns?.length ? (
          <figcaption>
            <NotionRichText runs={captionRuns} />
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (t === "callout") {
    const icon = block.icon?.type === "emoji" ? block.icon.emoji : null;
    return (
      <aside className="notion-block notion-callout">
        {icon ? <span className="notion-callout__icon">{icon}</span> : null}
        <div className="notion-callout__body">
          <NotionRichText runs={block.richText} />
          {block.children?.length ? (
            <div className="notion-callout__children">
              <NotionBlocks blocks={block.children || []} />
            </div>
          ) : null}
        </div>
      </aside>
    );
  }

  if (t === "code") {
    const code = (block.richText || []).map((r) => r.text).join("");
    return (
      <pre className="notion-block notion-code">
        <code className={`language-${block.language || "plain"}`}>{code}</code>
      </pre>
    );
  }

  if (t === "toggle") {
    return (
      <details className="notion-block notion-toggle">
        <summary className="notion-toggle__summary">
          <NotionRichText runs={block.richText} />
        </summary>
        <div className="notion-toggle__body">
          <NotionBlocks blocks={block.children || []} />
        </div>
      </details>
    );
  }

  if (block.unsupported) {
    return (
      <p className="notion-block notion-unsupported">
        <small>Unsupported block: {block.rawType || t}</small>
      </p>
    );
  }

  return (
    <p className="notion-block notion-unsupported">
      <small>Unknown block type: {t}</small>
    </p>
  );
}

/** Renders list groups: consecutive list items wrapped in ul/ol */
function NotionBlocks({ blocks }) {
  if (!blocks?.length) {
    return null;
  }

  const out = [];
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === "bulleted_list_item") {
      const group = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        group.push(blocks[i]);
        i += 1;
      }
      out.push(
        <ul key={group[0].id} className="notion-list notion-list--bullet">
          {group.map((item) => (
            <NotionBlock key={item.id} block={item} />
          ))}
        </ul>
      );
      continue;
    }
    if (b.type === "numbered_list_item") {
      const group = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        group.push(blocks[i]);
        i += 1;
      }
      out.push(
        <ol key={group[0].id} className="notion-list notion-list--numbered">
          {group.map((item) => (
            <NotionBlock key={item.id} block={item} />
          ))}
        </ol>
      );
      continue;
    }

    out.push(<NotionBlock key={b.id} block={b} />);
    i += 1;
  }

  return <div className="notion-blocks md">{out}</div>;
}

export default NotionBlocks;
