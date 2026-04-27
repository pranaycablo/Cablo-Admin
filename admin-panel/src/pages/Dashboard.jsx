import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
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
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Platform Overview</h2>
        <p className="text-slate-400 mt-1">Real-time performance analytics of Cablo Mobility.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="₹2,45,900" icon={TrendingUp} trend={12.5} color="amber" />
        <StatCard title="Active Captains" value="1,240" icon={Users} trend={5.2} color="blue" />
        <StatCard title="Completed Rides" value="8,432" icon={Clock} trend={-2.1} color="emerald" />
        <StatCard title="SOS Alerts" value="0" icon={AlertTriangle} trend={0} color="red" />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
            <p className="text-sm text-slate-400">Weekly revenue vs total rides volume</p>
          </div>
          <select className="bg-slate-800 border-none rounded-lg text-sm px-4 py-2 text-white outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
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
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-800">
                  <th className="pb-4 font-medium">Rider</th>
                  <th className="pb-4 font-medium">Vehicle</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[1,2,3,4].map((i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800" />
                        <div>
                          <p className="text-sm font-bold text-white">John Doe</p>
                          <p className="text-xs text-slate-500">+91 9876543210</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm">Cab (Prime)</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">Completed</span>
                    </td>
                    <td className="py-4 font-bold text-white">₹450</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Top Performers</h3>
          <div className="space-y-6">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center font-bold text-amber-500">
                    #{i}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Captain Rajesh</p>
                    <p className="text-xs text-slate-500">4.9 ★ • 128 Rides</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">₹12,400</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">This Week</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-slate-800 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-all">
            View All Captains
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
