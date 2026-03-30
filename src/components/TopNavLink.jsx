import React from "react";
import { NavLink } from "react-router-dom";

function TopNavLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `top-nav-item top-nav-link ${isActive ? "is-active" : ""}`}
    >
      {label}
    </NavLink>
  );
}

export default TopNavLink;
