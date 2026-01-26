import { useMemo } from "react";

export default function Header() {
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-AU", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  return (
    <header className="navbar navbar-expand-lg border-bottom px-4" style={{ backgroundColor: "#26976C" }}>
      <div className="container-fluid d-flex justify-content-between align-items-center py-2">
        {/* LEFT: User Info */}
        <div className="d-flex flex-column text-white">
          <span className="fw-bold small">Hello, Ravi</span>
          <span className="small opacity-75" style={{ fontSize: '12px' }}>{today}</span>
        </div>

        {/* CENTER: Title */}
        <div className="position-absolute start-50 translate-middle-x">
          <h1 className="h5 mb-0 fw-semibold text-white">Pricing Profile</h1>
        </div>

        {/* RIGHT: Icons */}
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-link p-0 text-white opacity-75 hover-opacity-100">
            <img src="/src/assets/icons/bell.svg" width="20" height="20" alt="Notifications" />
          </button>
          <button className="btn btn-link p-0 text-white opacity-75 hover-opacity-100">
            <img src="/src/assets/icons/help.svg" width="20" height="20" alt="Help" />
          </button>
        </div>
      </div>
    </header>
  );
}