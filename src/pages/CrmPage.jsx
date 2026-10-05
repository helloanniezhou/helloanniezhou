import React from "react";
import { Link } from "react-router-dom";
import { projects } from "../content/projects";
import "./CrmPage.css";

export default function CrmPage() {
  return (
    <main className="md" style={{ maxWidth: 720, margin: "48px auto", padding: "0 24px" }}>
      <h1>Portfolio projects</h1>
      <p>Manage your portfolio in the local code. Edit project content in <code>src/content/projects/</code> and titles, order, and visibility in <code>src/content/projects.js</code>.</p>
      <ul>{projects.map(({ slug, title, published }) => (
        <li key={slug}>{published ? <Link to={`/projects/${slug}`}>{title}</Link> : title} — {published ? "Published" : "Draft"}</li>
      ))}</ul>
      <p>See the README for adding a new project.</p>
      <Link to="/">Back to portfolio</Link>
    </main>
  );
}
