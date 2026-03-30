import React from "react";
import "./QuoteCard.css";

function QuoteCard({ quote }) {
  return (
    <article className="quote-card">
      <div className="quote-mark">"</div>
      <p className="quote-text">{quote}</p>
      <div className="quote-mark quote-mark-end">"</div>
    </article>
  );
}

export default QuoteCard;
