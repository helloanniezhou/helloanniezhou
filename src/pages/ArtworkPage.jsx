import React, { useMemo } from "react";
import InteractiveBook from "../components/book/InteractiveBook";
import artworkItems from "../data/artwork";

function ArtworkPage() {
  const spreads = useMemo(
    () =>
      artworkItems.map((item, index) => ({
        front: (
          <div className="ib-art-spread">
            <img
              src={item.src}
              alt={item.alt}
              className="ib-art-img"
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ),
        back: (
          <div className="ib-art-spread ib-art-back">
            <p className="ib-art-caption">{item.alt}</p>
          </div>
        )
      })),
    []
  );

  const cover = (
    <div className="ib-cover-inner ib-cover-inner--art">
      <div className="ib-cover-ornament" aria-hidden="true" />
      <h2 className="ib-cover-title">Illustration</h2>
      <p className="ib-cover-sub">A sketchbook in spreads.</p>
      <div className="ib-cover-ornament" aria-hidden="true" />
    </div>
  );

  return (
    <main className="content content-artwork">
      <InteractiveBook
        cover={cover}
        spreads={spreads}
        folioStart={1}
        hint="Drag to turn the page, or use the arrows."
      />
    </main>
  );
}

export default ArtworkPage;
