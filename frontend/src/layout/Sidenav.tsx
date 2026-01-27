import { NavLink } from "react-router-dom";

type SidenavProps = {
  isCollapsed: boolean;
};

export default function Sidenav({ isCollapsed }: SidenavProps) {
  const navItems = [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/pricing", icon: "pricing", label: "Pricing" },
    { to: "/settings", icon: "settings", label: "Settings" },
  ];

  return (
    <aside 
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark shadow" 
      style={{ 
        width: isCollapsed ? '80px' : '240px', 
        minHeight: '100vh',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
        zIndex: 1000
      }}
    >
      {/* Brand Section */}
      <div className="d-flex align-items-center mb-4 text-white text-decoration-none justify-content-center" style={{ height: '40px' }}>
        {!isCollapsed ? (
          <span className="fs-4 fw-bold tracking-tight">FOBOH</span>
        ) : (
          <span className="fs-4 fw-bold text-success">F</span>
        )}
      </div>

      <hr className="opacity-25" />

      {/* Navigation Menu */}
      <nav className="nav nav-pills flex-column mb-auto gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : ""}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isCollapsed ? 'justify-content-center' : 'gap-3'} ${
                isActive ? "active bg-success shadow-sm" : "text-white opacity-75 nav-hover"
              }`
            }
            style={{ transition: 'all 0.2s ease' }}
          >
 
            <img 
              src={`/src/assets/icons/${item.icon}.svg`} 
              width="20" 
              height="20" 
              alt={item.label}
              style={{ objectFit: 'contain' }} 
            />
            
            {!isCollapsed && (
              <span className="fw-medium text-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}