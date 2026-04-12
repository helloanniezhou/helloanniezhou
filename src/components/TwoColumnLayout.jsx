import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./TwoColumnLayout.css";

function linkClass({ isActive }) {
  return `tc-a${isActive ? " tc-a--on" : ""}`;
}

export default function TwoColumnLayout() {
  return (
    <div className="tc">
      <nav className="tc-side" aria-label="Site">
        <div className="tc-stack">
          <span className="tc-a disabled">Projects</span>
          <ul className="tc-stack tc-stack--tight">
            <li>
              <NavLink to="/projects/fitness-for-fitbit" className={linkClass}>
                Fitbit
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects/google-go" className={linkClass}>
                Google Go
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects/airwallex" className={linkClass}>
                Airwallex
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects/ideo-digital-confidence-kit" className={linkClass}>
                IDEO
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="tc-stack">
          <NavLink to="/artwork" className={linkClass}>
            Artwork
          </NavLink>
        </div>
        <div className="tc-stack">
          <NavLink to="/" end className={linkClass}>
            About
          </NavLink>
        </div>
      </nav>
      <main className="tc-body">
        <Outlet />
      </main>
    </div>
  );
}
