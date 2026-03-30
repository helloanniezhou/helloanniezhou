import React from "react";
import "./ResumeRow.css";

function ResumeRow({ timeRange, title, location, isEducation = false }) {
  return (
    <article className="resume-row">
      <div className="resume-time">{timeRange}</div>
      <div className="resume-details">
        <h3 className="resume-title">{title}</h3>
        <p className="resume-location">{location}</p>
      </div>
    </article>
  );
}

export default ResumeRow;
