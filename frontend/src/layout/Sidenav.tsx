export default function Sidenav() {
  return (
    <aside className="sidenav">
      <div className="sidenav-brand">
        {/* <span className="icon brand">🚀</span> */}
        <span className="brand-name">FOBOH</span>
      </div>
      <nav className="sidenav-menu">
        <a href="#" className="sidenav-link">
          <span className="icon">🏠</span> Dashboard
        </a>
        <a href="#" className="sidenav-link active">
          <span className="icon">💰</span> Pricing
        </a>
        {/* <a href="#" className="sidenav-link">
          <span className="icon">📊</span> Reports
        </a> */}
        <a href="#" className="sidenav-link">
          <span className="icon">⚙️</span> Settings
        </a>
      </nav>
    </aside>
  );
}