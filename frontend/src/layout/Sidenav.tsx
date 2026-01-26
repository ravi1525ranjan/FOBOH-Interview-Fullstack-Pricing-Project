import { NavLink } from "react-router-dom";

export default function Sidenav() {
  return (
    <aside className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '240px', minHeight: '100vh' }}>
      {/* Brand Section */}
      <div className="d-flex align-items-center mb-4 me-md-auto text-white text-decoration-none">
        <span className="fs-4 fw-bold tracking-tight">FOBOH</span>
      </div>

      <hr />

      {/* Navigation Menu */}
      <nav className="nav nav-pills flex-column mb-auto gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 ${isActive ? "active bg-success" : "text-white"}`
          }
        >
          <img src="/src/assets/icons/dashboard.svg" width="18" height="18" className="filter-white" alt="Dashboard" />
          Dashboard
        </NavLink>

        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 ${isActive ? "active bg-success" : "text-white"}`
          }
        >
          <img src="/src/assets/icons/pricing.svg" width="18" height="18" className="filter-white" alt="Pricing" />
          Pricing
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 ${isActive ? "active bg-success" : "text-white"}`
          }
        >
          <img src="/src/assets/icons/settings.svg" width="18" height="18" className="filter-white" alt="Settings" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}