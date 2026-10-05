import React from "react";
import { extractDimFromCaptionRuns } from "../../lib/imageDimensions.js";
import RichText from "./RichText";
import "./ContentBlocks.css";

/** JSON: maxWidth | width | height — number (px) or string (e.g. "50%"). */
function cssDimension(value) {
  if (value == null) return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
  return String(value);
}

function imageStyle(block) {
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

function ContentBlock({ block }) {
  const t = block.type;

  if (t === "paragraph") {
    return (
      <p className="content-block content-p">
        <RichText runs={block.richText} />
      </p>
    );
  }

  if (t === "heading_1") {
    return (
      <h1 className="content-block content-h1">
        <RichText runs={block.richText} />
      </h1>
    );
  }
  if (t === "heading_2") {
    return (
      <h2 className="content-block content-h2">
        <RichText runs={block.richText} />
      </h2>
    );
  }
  if (t === "heading_3") {
    return (
      <h3 className="content-block content-h3">
        <RichText runs={block.richText} />
      </h3>
    );
  }

  if (t === "bulleted_list_item") {
    return (
      <li className="content-block content-li content-li--bullet">
        <RichText runs={block.richText} />
        {block.children?.length ? <ContentBlocks blocks={block.children || []} /> : null}
      </li>
    );
  }

  if (t === "numbered_list_item") {
    return (
      <li className="content-block content-li content-li--numbered">
        <RichText runs={block.richText} />
        {block.children?.length ? <ContentBlocks blocks={block.children || []} /> : null}
      </li>
    );
  }

  if (t === "quote") {
    return (
      <blockquote className="content-block content-quote">
        <p>
          <RichText runs={block.richText} />
        </p>
      </blockquote>
    );
  }

  if (t === "divider") {
    return <hr className="content-block content-divider" />;
  }

  if (t === "video") {
    if (!block.url) return null;
    if (/\.(mp4|webm|ogg|mov)(?:[?#]|$)/i.test(block.url)) {
      return (
        <div className="content-block content-video">
          <video src={block.url} playsInline controls aria-label={block.title || "Project video"} />
        </div>
      );
    }
    return (
      <div className="content-block content-video">
        <iframe
          src={block.url}
          title={block.title || "Project video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (t === "image") {
    if (block.unsupported === "hosted_file") {
      return (
        <p className="content-block content-image-fallback">
        </p>
      );
    }
    if (!block.url) {
      return null;
    }
    const { runs: captionRuns, maxWidth: dimFromCaption } = extractDimFromCaptionRuns(block.caption || []);
    const imgStyle = imageStyle({
      maxWidth: block.maxWidth ?? dimFromCaption,
      width: block.width,
      height: block.height
    });
    return (
      <figure className="content-block content-figure">
        {block.presentation?.startsWith("phone-") ? (
          <div className={`content-phone-frame content-phone-frame--${block.presentation}`}>
            <img src={block.url} alt={block.alt || ""} loading="lazy" decoding="async" />
          </div>
        ) : (
          <img src={block.url} alt={block.alt || ""} loading="lazy" decoding="async" style={imgStyle} />
        )}
        {captionRuns?.length ? (
          <figcaption>
            <RichText runs={captionRuns} />
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (t === "callout") {
    const icon = block.icon?.type === "emoji" ? block.icon.emoji : null;
    return (
      <aside className="content-block content-callout">
        {icon ? <span className="content-callout__icon">{icon}</span> : null}
        <div className="content-callout__body">
          <RichText runs={block.richText} />
          {block.children?.length ? (
            <div className="content-callout__children">
              <ContentBlocks blocks={block.children || []} />
            </div>
          ) : null}
        </div>
      </aside>
    );
  }

  if (t === "code") {
    const code = (block.richText || []).map((r) => r.text).join("");
    return (
      <pre className="content-block content-code">
        <code className={`language-${block.language || "plain"}`}>{code}</code>
      </pre>
    );
  }

  if (t === "toggle") {
    return (
      <details className="content-block content-toggle">
        <summary className="content-toggle__summary">
          <RichText runs={block.richText} />
        </summary>
        <div className="content-toggle__body">
          <ContentBlocks blocks={block.children || []} />
        </div>
      </details>
    );
  }

  if (t === "column_list") {
    return (
      <div className={`content-block content-column-list${block.layout === "outcomes" ? " content-column-list--outcomes" : block.layout === "gallery" || block.layout === "fitness-gallery" ? " content-column-list--gallery" : ""}${block.layout === "fitness-gallery" ? " content-column-list--fitness" : ""}`}>
        {block.children?.length ? <ContentBlocks blocks={block.children} /> : null}
      </div>
    );
  }

  if (t === "column") {
    const flexStyle =
      typeof block.widthRatio === "number" && Number.isFinite(block.widthRatio)
        ? { flex: `${block.widthRatio} 1 0%`, minWidth: 0 }
        : { flex: "1 1 0%", minWidth: 0 };
    return (
      <div className="content-block content-column" style={flexStyle}>
        {block.children?.length ? <ContentBlocks blocks={block.children} /> : null}
      </div>
    );
  }

  if (block.unsupported) {
    return null;
  }
}

/** Renders list groups: consecutive list items wrapped in ul/ol */
function ContentBlocks({ blocks }) {
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
        <ul key={group[0].id} className="content-list content-list--bullet">
          {group.map((item) => (
            <ContentBlock key={item.id} block={item} />
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
        <ol key={group[0].id} className="content-list content-list--numbered">
          {group.map((item) => (
            <ContentBlock key={item.id} block={item} />
          ))}
        </ol>
      );
      continue;
    }

    out.push(<ContentBlock key={b.id} block={b} />);
    i += 1;
  }

  return <div className="content-blocks md">{out}</div>;
}

export default ContentBlocks;
