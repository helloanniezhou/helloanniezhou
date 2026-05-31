import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";
import { humanizeSlug, listCaseStudySlugs } from "../lib/notionProjects";
import { usePublishedPosts } from "../context/PublishedPostsContext";
import "./CrmPage.css";

function titleForSlug(slug) {
  const doc = getNotionDocForSlug(slug);
  const raw = doc?.title;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return humanizeSlug(slug);
}

async function readJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function CrmPage() {
  const { reload: reloadPublished } = usePublishedPosts();
  const [authed, setAuthed] = useState(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [busySlug, setBusySlug] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoadError("");
    const data = await readJson(await fetch("/api/crm/posts"));
    setPosts(data.posts ?? []);
  }, []);

  useEffect(() => {
    document.title = "CRM — Annie Zhou";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    fetch("/api/crm/session")
      .then((res) => res.json())
      .then((data) => setAuthed(Boolean(data.ok)))
      .catch(() => setAuthed(false));

    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (authed) {
      loadPosts().catch((err) => setLoadError(err.message));
    }
  }, [authed, loadPosts]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginBusy(true);
    try {
      await readJson(
        await fetch("/api/crm/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        })
      );
      setPassword("");
      setAuthed(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/crm/logout", { method: "POST" });
    setAuthed(false);
    setPosts([]);
  };

  const togglePublished = async (slug, published) => {
    setBusySlug(slug);
    setLoadError("");
    try {
      const data = await readJson(
        await fetch("/api/crm/posts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, published }),
        })
      );
      setPosts((prev) =>
        prev.map((post) => (post.slug === slug ? data.post : post))
      );
      await reloadPublished();
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setBusySlug(null);
    }
  };

  if (authed === null) {
    return (
      <div className="crm">
        <p className="crm-muted">Checking session…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="crm">
        <header className="crm-header">
          <h1>CRM</h1>
          <Link to="/" className="crm-link">
            ← Back to site
          </Link>
        </header>
        <form className="crm-login" onSubmit={handleLogin}>
          <label htmlFor="crm-password">Password</label>
          <input
            id="crm-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginBusy}
          />
          {loginError ? <p className="crm-error">{loginError}</p> : null}
          <button type="submit" disabled={loginBusy || !password}>
            {loginBusy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  const slugs = listCaseStudySlugs();
  const rows = slugs.map((slug) => {
    const post = posts.find((p) => p.slug === slug);
    return {
      slug,
      title: titleForSlug(slug),
      published: post?.published ?? true,
      updated_at: post?.updated_at,
    };
  });

  return (
    <div className="crm">
      <header className="crm-header">
        <div>
          <h1>CRM</h1>
          <p className="crm-muted">Publish or unpublish Notion case studies.</p>
        </div>
        <div className="crm-header__actions">
          <Link to="/" className="crm-link">
            View site
          </Link>
          <button type="button" className="crm-btn crm-btn--ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {loadError ? <p className="crm-error">{loadError}</p> : null}

      <ul className="crm-list">
        {rows.map(({ slug, title, published, updated_at }) => (
          <li key={slug} className="crm-row">
            <div className="crm-row__info">
              <strong>{title}</strong>
              <span className="crm-muted">/projects/{slug}</span>
              {updated_at ? (
                <span className="crm-muted">
                  Updated {new Date(updated_at).toLocaleString()}
                </span>
              ) : null}
            </div>
            <div className="crm-row__actions">
              <span className={`crm-badge ${published ? "crm-badge--on" : "crm-badge--off"}`}>
                {published ? "Published" : "Unpublished"}
              </span>
              <button
                type="button"
                className="crm-btn"
                disabled={busySlug === slug}
                onClick={() => togglePublished(slug, !published)}
              >
                {busySlug === slug
                  ? "Saving…"
                  : published
                    ? "Unpublish"
                    : "Publish"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrmPage;
