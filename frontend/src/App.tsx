import './App.css'
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>FOBOH Pricing Profile</h1>
        </div>
      </header>

      <main className="main">
        <div className="page-container">
          <PricingPage />
        </div>
      </main>
    </div>
  );
}

export default App
