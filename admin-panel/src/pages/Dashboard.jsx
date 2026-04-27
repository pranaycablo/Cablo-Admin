import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Car,
  Shield
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

const data = [
  { name: 'Mon', revenue: 4000, rides: 240 },
  { name: 'Tue', revenue: 3000, rides: 139 },
  { name: 'Wed', revenue: 2000, rides: 980 },
  { name: 'Thu', revenue: 2780, rides: 390 },
  { name: 'Fri', revenue: 1890, rides: 480 },
  { name: 'Sat', revenue: 2390, rides: 380 },
  { name: 'Sun', revenue: 3490, rides: 430 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-${color}-500/10 transition-all`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium relative z-10">{title}</h3>
    <p className="text-3xl font-black text-white mt-1 relative z-10">{value}</p>
  </div>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalCaptains: 0,
    totalRides: 0,
    totalRevenue: 0,
    openFailures: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [activeFailures, setActiveFailures] = useState([]);

  useEffect(() => {
    fetchMetrics();
    fetchFailures();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(res.data.metrics);
      setRecentRides(res.data.recentRides || []);
    } catch (err) {
      console.error('Failed to fetch metrics');
    }
  };

  const fetchFailures = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/failures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveFailures(res.data.failures || []);
    } catch (err) {
      console.error('Failed to fetch failures');
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Revenue,Rides\n"
      + data.map(e => `${e.name},${e.revenue},${e.rides}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cablo_report_weekly.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Platform Command Center</h2>
          <p className="text-slate-400 mt-1 font-medium">Real-time governance and revenue tracking.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-bold text-sm">
            <Calendar size={18} className="text-amber-500" />
            <span>Today, {new Date().toLocaleDateString()}</span>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            <Download size={18} />
            Export Reports
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${metrics.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend={12.5} color="amber" />
        <StatCard title="Total Users" value={metrics.totalUsers} icon={Users} trend={5.2} color="blue" />
        <StatCard title="Total Rides" value={metrics.totalRides} icon={Clock} trend={8.4} color="emerald" />
        <StatCard title="System Alerts" value={metrics.openFailures} icon={AlertTriangle} trend={-15} color="red" />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
            <p className="text-sm text-slate-400 font-medium">Live data stream from multi-shard DB</p>
          </div>
          <div className="flex gap-2 bg-slate-950 p-1 rounded-xl">
            {['Daily', 'Weekly', 'Monthly'].map(t => (
              <button key={t} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${t === 'Weekly' ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#f59e0b" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Operational Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="text-emerald-500" size={20} />
              Live Operational Flow
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">Real-time</span>
          </div>
          <div className="space-y-4">
            {recentRides.map((ride) => (
              <div key={ride._id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    <Car className="text-slate-500" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Ride #{ride._id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{ride.status} • {ride.region || 'Global'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">₹{ride.fare?.amount || 0}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{new Date(ride.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            ))}
            {recentRides.length === 0 && (
              <p className="text-center py-10 text-slate-600 text-xs italic">Waiting for new ride requests...</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-[2px]">View All Transactions →</button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              AI Sentinel Alerts
            </h3>
            <span className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">Urgent</span>
          </div>
          <div className="space-y-4">
            {activeFailures.map((failure) => (
              <div key={failure._id} className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-bold text-white capitalize">{failure.type.replace(/_/g, ' ')}</p>
                  <span className={`text-[10px] font-black uppercase ${failure.priority === 'high' ? 'text-red-500' : 'text-amber-500'}`}>
                    {failure.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{failure.description || `Automatic recovery initiated by ${failure.agentResponsible} agent.`}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-red-600 transition-all">Override AI</button>
                  <button className="px-4 py-2 bg-slate-800 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-slate-700 transition-all">Ignore</button>
                </div>
              </div>
            ))}
            {activeFailures.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10">
                <Shield className="text-emerald-500/20 mb-2" size={32} />
                <p className="text-center text-slate-600 text-xs italic">Neural Shield Active. No anomalies detected.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
