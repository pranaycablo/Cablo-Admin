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
  ShieldAlert,
  Globe,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai', label: 'Cablo AI Brain', icon: Sparkles },
    { id: 'captains', label: 'Captains', icon: Users },
    { id: 'rides', label: 'Live Rides', icon: MapPin },
    { id: 'fares', label: 'Fare Control', icon: Globe },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'finances', label: 'Finances', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'safety', label: 'Safety (SOS)', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-950 h-screen fixed left-0 top-0 border-r border-slate-900/50 flex flex-col p-4 z-50 shadow-2xl">
      <div className="flex items-center gap-4 mb-10 px-2 py-6 border-b border-slate-900/30">
        <div className="relative group">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20 transform group-hover:rotate-6 transition-transform">
            <img src="/logo.png" alt="Cablo" className="w-10 h-10 object-contain brightness-0" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-lg border-4 border-slate-950 flex items-center justify-center text-[8px] font-black text-white shadow-xl">
            V2
          </div>
        </div>
        <div>
          <h1 className="font-black text-2xl tracking-tighter text-white leading-none">CABLO</h1>
          <p className="text-[9px] text-amber-500 font-black uppercase tracking-[3px] mt-1">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-amber-500 text-slate-900 font-bold shadow-xl shadow-amber-500/20 translate-x-2' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Secure Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
