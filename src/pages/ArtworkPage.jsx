import React from "react";
import { artworkPieces } from "../artwork/pieces";

function ArtworkPage() {
  return (
    <article className="md artwork-page">
      <h1>Artwork</h1>

      {artworkPieces.length === 0 ? (
        <p>Add image files (.png, .jpg, .webp, .gif) to <code className="artwork-code">src/artwork/</code>.</p>
      ) : (
        <div className="artwork-stack">
          {artworkPieces.map((piece) => (
            <figure key={piece.src} className="artwork-figure">
              <img src={piece.src} alt={piece.alt} loading="lazy" decoding="async" />
              <figcaption>{piece.alt}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}

export default ArtworkPage;
