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
    <header className="header">
      <div className="header-inner header-layout">
        {/* LEFT */}
        <div className="header-left">
          <span className="hello">Hello, Ravi</span>
          <span className="datetime">{today}</span>
        </div>

        {/* CENTER */}
        <div className="header-center">
          <h1>Pricing Profile</h1>
        </div>

        {/* RIGHT */}
        <div className="header-right">
<img src="/src/assets/icons/bell.svg" className="icon" alt="Notifications" />
<img src="/src/assets/icons/help.svg" className="icon" alt="Help" />

        </div>
      </div>
    </header>
  );
}
