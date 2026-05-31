import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PublishedPostsProvider } from "./context/PublishedPostsContext";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PublishedPostsProvider>
        <App />
      </PublishedPostsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
