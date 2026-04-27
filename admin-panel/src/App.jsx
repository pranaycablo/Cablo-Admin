import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FareManagement from './pages/FareManagement';
import AICommand from './pages/AICommand';
import VehicleManagement from './pages/VehicleManagement';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user) => {
    setAdminUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setAdminUser(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex font-inter selection:bg-amber-500 selection:text-slate-900">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="ml-64 flex-1 relative z-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto min-h-screen border-l border-slate-900/30 bg-slate-950/40 backdrop-blur-[2px]">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'fares' && <FareManagement />}
          {activeTab === 'ai' && <AICommand />}
          {activeTab === 'vehicles' && <VehicleManagement />}
          {activeTab === 'captains' && <UserManagement isCaptain={true} />}
          {activeTab === 'settings' && <Settings />}
          {activeTab !== 'dashboard' && activeTab !== 'fares' && activeTab !== 'ai' && activeTab !== 'vehicles' && activeTab !== 'settings' && activeTab !== 'captains' && (
            <div className="flex items-center justify-center h-full p-20 text-center">
              <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-[40px] backdrop-blur-xl">
                <h2 className="text-5xl font-black mb-6 capitalize tracking-tighter">{activeTab} Module</h2>
                <p className="text-slate-400 text-lg max-w-md mx-auto">This neural module is currently being optimized for high-performance enterprise operations.</p>
                <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 text-amber-500 rounded-full text-sm font-black animate-pulse">
                  <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                  Live Neural Sync Active
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
