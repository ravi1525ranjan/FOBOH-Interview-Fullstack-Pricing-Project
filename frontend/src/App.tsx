import './App.css'
import Header from './layout/Header';
import Sidenav from './layout/Sidenav';
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    <div className="app-layout">
      <Sidenav />
      <div className="content-area">
        <Header />
        <main className="main">
          <div className="page-container">
            <PricingPage />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
