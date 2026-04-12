import React, { useRef, useState } from "react";
import MediaVisual from "../MediaVisual";
import { readFileAsDataURL, sanitizeBasename } from "../../lib/mediaUpload";

const EMBED_WARN_BYTES = 4 * 1024 * 1024;

function mediaBaseUrl() {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

function MediaUrlField({ label, value, onChange }) {
  const embedRef = useRef(null);
  const publicRef = useRef(null);
  const [filenameOnly, setFilenameOnly] = useState("");

  const handleEmbed = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > EMBED_WARN_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      const ok = window.confirm(
        `This file is about ${mb} MB. Embedding as a data URL can fail to save or slow the site. Continue?`
      );
      if (!ok) return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      onChange(dataUrl);
    } catch {
      /* ignore */
    }
  };

  const handlePublicLink = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const name = sanitizeBasename(file.name);
    onChange(`${mediaBaseUrl()}media/${encodeURIComponent(name)}`);
  };

  const applyFilenamePath = () => {
    const raw = filenameOnly.trim();
    if (!raw) return;
    const name = sanitizeBasename(raw);
    onChange(`${mediaBaseUrl()}media/${encodeURIComponent(name)}`);
    setFilenameOnly("");
  };

  const pathExample = `${mediaBaseUrl()}media/yourfile.webp`;

  return (
    <div className="admin-editor-field">
      <label>
        {label}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || "")}
          placeholder={pathExample}
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <div className="admin-editor-path-row">
        <label className="admin-editor-path-row-label">Filename in public/media/</label>
        <div className="admin-editor-path-row-inputs">
          <input
            type="text"
            value={filenameOnly}
            onChange={(e) => setFilenameOnly(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyFilenamePath())}
            placeholder="pixelwatch2.webp"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="admin-editor-btn admin-editor-btn--small" onClick={applyFilenamePath}>
            Set path
          </button>
        </div>
      </div>
      <div className="admin-editor-media-actions">
        <button type="button" className="admin-editor-btn admin-editor-btn--small" onClick={() => embedRef.current?.click()}>
          Embed file
        </button>
        <input
          ref={embedRef}
          type="file"
          accept="image/*,video/*"
          className="admin-editor-file-input"
          onChange={handleEmbed}
        />
        <button type="button" className="admin-editor-btn admin-editor-btn--small" onClick={() => publicRef.current?.click()}>
          Link public/media
        </button>
        <input
          ref={publicRef}
          type="file"
          accept="image/*,video/*"
          className="admin-editor-file-input"
          onChange={handlePublicLink}
        />
      </div>
      <p className="admin-editor-media-help">
        Type a path (see placeholder), or set it from the filename above. <strong>Embed</strong> stores a data URL in the draft.{" "}
        <strong>Link</strong> picks a file name — put that file in <code>public/media/</code>.
      </p>
      {value ? (
        <div className="admin-editor-media-preview">
          <MediaVisual src={value} alt="Preview" className="admin-editor-media-preview-el" />
        </div>
      ) : null}
    </div>
  );
}

export default MediaUrlField;
