import React from "react";
import { isProbablyVideoUrl } from "../lib/mediaUpload";
import { publicUrl } from "../lib/publicUrl";

/**
 * Renders <img> or <video> from a URL (http(s), data, or site-relative).
 */
function MediaVisual({ src, alt, className, videoProps = {} }) {
  if (!src) return null;
  const resolved = publicUrl(src);
  if (isProbablyVideoUrl(resolved)) {
    return (
      <video
        src={resolved}
        className={className}
        muted
        playsInline
        controls
        aria-label={alt || "Video"}
        {...videoProps}
      />
    );
  }
  return <img src={resolved} alt={alt || ""} className={className} loading="lazy" />;
}

export default MediaVisual;
