import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchPublishedSlugs, isSupabaseConfigured } from "../lib/blogPosts";

const PublishedPostsContext = createContext(null);

export function PublishedPostsProvider({ children }) {
  const [publishedSlugs, setPublishedSlugs] = useState(null);
  const [usesSupabase, setUsesSupabase] = useState(false);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUsesSupabase(false);
      setPublishedSlugs(null);
      return;
    }

    setUsesSupabase(true);
    try {
      const slugs = await fetchPublishedSlugs();
      setPublishedSlugs(slugs ?? new Set());
    } catch {
      setPublishedSlugs(null);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const isSlugPublished = useCallback(
    (slug) => {
      if (!usesSupabase || publishedSlugs === null) return true;
      return publishedSlugs.has(slug);
    },
    [publishedSlugs, usesSupabase]
  );

  const isProjectPathPublished = useCallback(
    (path) => {
      if (!usesSupabase || publishedSlugs === null) return true;
      const match = /^\/projects\/([^/?#]+)/.exec(path);
      if (!match) return true;
      return publishedSlugs.has(match[1]);
    },
    [publishedSlugs, usesSupabase]
  );

  const value = useMemo(
    () => ({
      publishedSlugs,
      usesSupabase,
      isLoading: usesSupabase && publishedSlugs === null,
      isSlugPublished,
      isProjectPathPublished,
      reload,
    }),
    [publishedSlugs, usesSupabase, isSlugPublished, isProjectPathPublished, reload]
  );

  return (
    <PublishedPostsContext.Provider value={value}>
      {children}
    </PublishedPostsContext.Provider>
  );
}

export function usePublishedPosts() {
  const ctx = useContext(PublishedPostsContext);
  if (!ctx) {
    throw new Error("usePublishedPosts must be used within PublishedPostsProvider");
  }
  return ctx;
}
