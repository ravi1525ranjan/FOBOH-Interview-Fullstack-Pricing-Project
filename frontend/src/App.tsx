import './App.css'
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import Sidenav from './layout/Sidenav';
import PricingPage from "./pages/PricingPage";
import Dashboard from './pages/Dashboard'; 
import Settings from './pages/Settings';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="app-layout d-flex">
      {/* Pass collapsed state to Sidenav */}
      <Sidenav isCollapsed={isCollapsed} />
      
      <div className="content-area flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Pass toggle function to Header */}
        <Header onToggleSidenav={toggleSidebar} />
        
        <main className="main bg-light" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="page-container p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/pricing" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;