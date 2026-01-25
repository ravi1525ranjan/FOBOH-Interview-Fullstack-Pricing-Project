import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import Sidenav from './layout/Sidenav';
import PricingPage from "./pages/PricingPage";
import Dashboard from './pages/Dashboard'; 
import Settings from './pages/Settings';

function App() {
  return (
    <div className="app-layout">
      <Sidenav />
      <div className="content-area">
        <Header />
        <main className="main">
          <div className="page-container">
            <Routes>
              {/* Redirect empty path to dashboard */}
              <Route path="/" element={<Navigate to="/pricing" />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Catch-all for 404s */}
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
