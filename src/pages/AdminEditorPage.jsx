import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import defaultProjects from "../data/projects.default";
import { detailsBySlug } from "../data/projectDetails.default";
import {
  clearSiteContent,
  loadSiteContent,
  saveSiteContent
} from "../lib/siteContentStorage";
import MediaUrlField from "../components/editor/MediaUrlField";
import "./AdminEditorPage.css";

const DETAIL_SLUGS = new Set(Object.keys(detailsBySlug));

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function buildInitialState() {
  const stored = loadSiteContent();
  const projects = clone(stored?.projects ?? defaultProjects);
  const details = clone(detailsBySlug);
  if (stored?.details) {
    for (const slug of Object.keys(stored.details)) {
      if (details[slug]) details[slug] = clone(stored.details[slug]);
    }
  }
  return { projects, details };
}

function serializeProjectsFile(projectsArr) {
  return `const projects = ${JSON.stringify(projectsArr, null, 2)};\n\nexport default projects;\n`;
}

const DETAIL_VAR_NAMES = {
  "fitness-for-fitbit": "fitbitDetail",
  "google-go": "googleGoDetail",
  airwallex: "airwallexDetail"
};

function serializeProjectDetailsDefault(detailsState) {
  const slugs = Object.keys(detailsState);
  const blocks = [];
  const exportNames = [];
  for (const slug of slugs) {
    const varName = DETAIL_VAR_NAMES[slug] || `detail_${slug.replace(/-/g, "_")}`;
    exportNames.push(varName);
    blocks.push(`const ${varName} = ${JSON.stringify(detailsState[slug], null, 2)};`);
  }
  const mapLines = slugs.map((slug) => {
    const varName = DETAIL_VAR_NAMES[slug] || `detail_${slug.replace(/-/g, "_")}`;
    return `  "${slug}": ${varName}`;
  });
  return `${blocks.join("\n\n")}

export const detailsBySlug = {
${mapLines.join(",\n")}
};

export { ${exportNames.join(", ")} };
`;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function updateProjectAt(projects, index, patch) {
  const next = projects.slice();
  next[index] = { ...next[index], ...patch };
  return next;
}

function JsonArrayField({ fieldKey, value, onCommit }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  return (
    <div className="admin-editor-field admin-editor-field--mono">
      <label>
        {fieldKey} (JSON)
        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            try {
              onCommit(JSON.parse(text));
            } catch {
              setText(JSON.stringify(value, null, 2));
            }
          }}
        />
      </label>
      {fieldKey === "media" || fieldKey === "processSteps" ? (
        <p className="admin-editor-media-help">
          Each <code>image</code> value can be a normal URL, a <strong>data URL</strong> from Embed file, or a path under{" "}
          <code>public/media/</code> (use Link from the image fields above as a reference for the URL shape).
        </p>
      ) : null}
    </div>
  );
}

function DetailFields({ detail, onChange }) {
  const entries = useMemo(() => Object.entries(detail || {}), [detail]);

  return entries.map(([key, value]) => {
    if (key === "slug") {
      return (
        <div key={key} className="admin-editor-field">
          <label>
            slug
            <input type="text" value={value} readOnly disabled />
          </label>
        </div>
      );
    }

    if (typeof value === "string") {
      return (
        <div key={key} className="admin-editor-field">
          <label>
            {key}
            <textarea
              value={value}
              onChange={(e) => onChange({ [key]: e.target.value })}
              rows={key === "overview" || key === "challenge" ? 5 : 3}
            />
          </label>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <JsonArrayField
          key={key}
          fieldKey={key}
          value={value}
          onCommit={(parsed) => onChange({ [key]: parsed })}
        />
      );
    }

    if (typeof value === "object") {
      const imgKeys = Object.keys(value);
      const allStrings = imgKeys.length > 0 && imgKeys.every((k) => typeof value[k] === "string");
      if (key === "images" && allStrings) {
        return (
          <div key={key} className="admin-editor-section">
            <h2>{key}</h2>
            {imgKeys.map((ik) => (
              <MediaUrlField
                key={ik}
                label={ik}
                value={value[ik] || ""}
                onChange={(next) =>
                  onChange({
                    [key]: { ...value, [ik]: next }
                  })
                }
              />
            ))}
          </div>
        );
      }
      return (
        <div key={key} className="admin-editor-section">
          <h2>{key}</h2>
          {imgKeys.map((ik) => (
            <div key={ik} className="admin-editor-field">
              <label>
                {ik}
                <input
                  type="text"
                  value={value[ik] || ""}
                  onChange={(e) =>
                    onChange({
                      [key]: { ...value, [ik]: e.target.value }
                    })
                  }
                />
              </label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  });
}

function AdminEditorPage() {
  const [{ projects, details }, setState] = useState(buildInitialState);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("");

  const project = projects[activeIndex];
  const slug = project?.slug;
  const hasDetail = slug && DETAIL_SLUGS.has(slug);
  const detail = hasDetail ? details[slug] : null;

  const handleSave = () => {
    saveSiteContent({ projects, details });
    setStatus(
      "Saved in this browser. Reload the page so Work and case studies read the new draft (modules load once)."
    );
  };

  const handleClear = () => {
    clearSiteContent();
    window.location.reload();
  };

  const updateListing = (patch) => {
    setState({
      projects: updateProjectAt(projects, activeIndex, patch),
      details
    });
  };

  const updateDetail = (patch) => {
    if (!slug || !details[slug]) return;
    setState({
      projects,
      details: { ...details, [slug]: { ...details[slug], ...patch } }
    });
  };

  const exportFiles = () => {
    downloadText("projects.default.js", serializeProjectsFile(projects));
    downloadText("projectDetails.default.js", serializeProjectDetailsDefault(details));
    setStatus("Downloaded JS sources — paste into src/data/ to commit.");
  };

  if (!project) {
    return <p>No projects.</p>;
  }

  return (
    <div className="admin-editor">
      <header className="admin-editor-toolbar">
        <h1>Studio</h1>
        <div className="admin-editor-actions">
          <Link to="/" className="admin-editor-btn">
            ← Site
          </Link>
          <button type="button" className="admin-editor-btn admin-editor-btn--primary" onClick={handleSave}>
            Save draft
          </button>
          <button type="button" className="admin-editor-btn" onClick={() => window.location.reload()}>
            Reload
          </button>
          <button type="button" className="admin-editor-btn" onClick={exportFiles}>
            Export .js
          </button>
          <button type="button" className="admin-editor-btn admin-editor-btn--danger" onClick={handleClear}>
            Reset data
          </button>
        </div>
        {status ? <p className="admin-editor-status">{status}</p> : null}
      </header>

      <aside className="admin-editor-rail" aria-label="Projects">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            className={i === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(i)}
          >
            {p.title || p.slug}
          </button>
        ))}
      </aside>

      <main className="admin-editor-main">
        <h2 className="admin-editor-doc-title">{project.title || "Untitled"}</h2>

        <section className="admin-editor-section">
          <h2>Work listing</h2>
          <div className="admin-editor-field">
            <label>
              Title
              <input
                type="text"
                value={project.title || ""}
                onChange={(e) => updateListing({ title: e.target.value })}
              />
            </label>
          </div>
          <div className="admin-editor-field">
            <label>
              Slug
              <input type="text" value={project.slug || ""} readOnly disabled title="Edit in source to rename" />
            </label>
          </div>
          <div className="admin-editor-field">
            <label>
              Description
              <textarea
                value={project.description || ""}
                onChange={(e) => updateListing({ description: e.target.value })}
                rows={4}
              />
            </label>
          </div>
          <div className="admin-editor-field">
            <label>
              Year
              <input
                type="text"
                value={project.year ?? ""}
                onChange={(e) => updateListing({ year: e.target.value || undefined })}
              />
            </label>
          </div>
          <MediaUrlField
            label="Image or video path / URL"
            value={project.imageSrc || ""}
            onChange={(next) => updateListing({ imageSrc: next || undefined })}
          />
          <div className="admin-editor-field">
            <label>
              Image alt
              <input
                type="text"
                value={project.imageAlt || ""}
                onChange={(e) => updateListing({ imageAlt: e.target.value || undefined })}
              />
            </label>
          </div>
          <div className="admin-editor-field admin-editor-row">
            <input
              id="coming-soon"
              type="checkbox"
              checked={Boolean(project.comingSoon)}
              onChange={(e) => updateListing({ comingSoon: e.target.checked || undefined })}
            />
            <label htmlFor="coming-soon">Coming soon</label>
          </div>
        </section>

        {hasDetail && detail ? (
          <section className="admin-editor-section">
            <h2>Case study copy</h2>
            <DetailFields detail={detail} onChange={updateDetail} />
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default AdminEditorPage;
