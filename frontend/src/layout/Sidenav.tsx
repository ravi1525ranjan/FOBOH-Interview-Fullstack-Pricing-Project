import { NavLink } from "react-router-dom";
export default function Sidenav() {
  return (
    <aside className="sidenav">
      <div className="sidenav-brand">
        {/* <span className="icon brand">🚀</span> */}
        <span className="brand-name">FOBOH</span>
      </div>
      <nav className="sidenav-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidenav-link active" : "sidenav-link"
          }
        >
          <img
            src="/src/assets/icons/dashboard.svg"
            className="icon"
            alt="Dashboard"
          />
          Dashboard
        </NavLink>

        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive ? "sidenav-link active" : "sidenav-link"
          }
        >
          <img
            src="/src/assets/icons/pricing.svg"
            className="icon"
            alt="Pricing"
          />
          Pricing
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidenav-link active" : "sidenav-link"
          }
        >
          <img
            src="/src/assets/icons/settings.svg"
            className="icon"
            alt="Settings"
          />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
