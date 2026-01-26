import { useMemo } from "react";

type HeaderProps = {
  onToggleSidenav: () => void;
};

export default function Header({ onToggleSidenav }: HeaderProps) {
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-AU", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  return (
    <header className="navbar navbar-expand-lg border-bottom px-4" style={{ backgroundColor: "#26976C", height: '64px' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center py-2">
        
        {/* LEFT: Hamburger & User Info */}
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-link p-0 text-white border-0 shadow-none" 
            onClick={onToggleSidenav}
            style={{ cursor: 'pointer' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="d-flex flex-column text-white ms-2 d-none d-sm-flex">
            <span className="fw-bold small">Hello, Ravi</span>
            <span className="small opacity-75" style={{ fontSize: '11px' }}>{today}</span>
          </div>
        </div>

        {/* CENTER: Title */}
        <div className="position-absolute start-50 translate-middle-x">
          <h1 className="h6 mb-0 fw-semibold text-white text-uppercase tracking-wider">Pricing Profile</h1>
        </div>

        {/* RIGHT: Icons */}
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-link p-0 text-white opacity-75">
            <img src="/src/assets/icons/bell.svg" width="20" height="20" alt="Notifications" />
          </button>
          <button className="btn btn-link p-0 text-white opacity-75">
            <img src="/src/assets/icons/help.svg" width="20" height="20" alt="Help" />
          </button>
        </div>
      </div>
    </header>
  );
}