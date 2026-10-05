import React, { createContext, useContext } from "react";
import { projects } from "../content/projects";

const PublishedPostsContext = createContext(null);
const isSlugPublished = (slug) => projects.some((project) => project.slug === slug && project.published);
const value = {
  isLoading: false,
  isSlugPublished,
  isProjectPathPublished(path) {
    const match = /^\/projects\/([^/?#]+)/.exec(path);
    return !match || isSlugPublished(match[1]);
  },
};
export function PublishedPostsProvider({ children }) {
  return <PublishedPostsContext.Provider value={value}>{children}</PublishedPostsContext.Provider>;
}
export function usePublishedPosts() {
  return useContext(PublishedPostsContext);
}
