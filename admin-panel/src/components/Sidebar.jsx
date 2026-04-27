import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'captains', label: 'Captains', icon: Users },
    { id: 'rides', label: 'Live Rides', icon: MapPin },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'finances', label: 'Finances', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'safety', label: 'Safety (SOS)', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-slate-900 text-xl">
          C
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">CABLO</h1>
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[2px]">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
