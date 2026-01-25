export default function Sidenav() {
  return (
    <aside className="sidenav">
      <div className="sidenav-brand">
        {/* <span className="icon brand">🚀</span> */}
        <span className="brand-name">FOBOH</span>
      </div>
      <nav className="sidenav-menu">
        <a href="#" className="sidenav-link">
          <img src="/src/assets/icons/dashboard.svg" className="icon" alt="Dashboard" />
Dashboard

        </a>
        <a href="#" className="sidenav-link active">
         <img src="/src/assets/icons/pricing.svg" className="icon" alt="Pricing" />
Pricing

        </a>
        <a href="#" className="sidenav-link">
       <img src="/src/assets/icons/settings.svg" className="icon" alt="Settings" />
Settings

        </a>
      </nav>
    </aside>
  );
}