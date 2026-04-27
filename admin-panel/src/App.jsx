import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FareManagement from './pages/FareManagement';

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
    <div className="bg-slate-950 min-h-screen text-slate-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="ml-64 flex-1">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'fares' && <FareManagement />}
        {activeTab !== 'dashboard' && activeTab !== 'fares' && (
          <div className="flex items-center justify-center h-full p-20 text-center">
            <div>
              <h2 className="text-4xl font-bold mb-4 capitalize">{activeTab} Module</h2>
              <p className="text-slate-400">This module is currently being synchronized with the global multi-shard database.</p>
              <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-sm font-bold animate-pulse">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                Live Sync Active
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
