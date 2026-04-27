import React, { useState, useEffect } from 'react';
import { Shield, Key, CreditCard, Cpu, Map as MapIcon, Save, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = [
    { id: 'platform', name: 'Platform Governance', icon: Shield, color: 'emerald' },
    { id: 'payment', name: 'Payment Gateways', icon: CreditCard, color: 'amber' },
    { id: 'ai', name: 'AI Models & Agents', icon: Cpu, color: 'blue' },
    { id: 'maps', name: 'Maps & Geo Services', icon: MapIcon, color: 'red' },
  ];

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfigs(res.data.configs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (config) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('http://localhost:5000/api/admin/config', config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Updated: ${config.key}`);
    } catch (err) {
      alert('Failed to update config');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter">Global Control Vault</h2>
        <p className="text-slate-400 mt-2 font-medium">Manage encryption keys, AI model agents, and dynamic platform fees.</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg bg-${cat.color}-500/10 text-${cat.color}-500`}>
                <cat.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">{cat.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configs.filter(c => c.category === cat.id).map((config) => (
                <div key={config._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl group hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{config.key}</p>
                      <h4 className="text-sm font-bold text-white">{config.description || 'System Parameter'}</h4>
                    </div>
                    <button 
                      onClick={() => handleUpdate(config)}
                      className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-amber-500 hover:text-slate-900 transition-all"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                  <input 
                    type={cat.id === 'platform' ? 'text' : 'password'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-mono text-sm focus:border-amber-500 outline-none"
                    value={config.value}
                    onChange={(e) => {
                      const newConfigs = [...configs];
                      const target = newConfigs.find(c => c._id === config._id);
                      target.value = e.target.value;
                      setConfigs(newConfigs);
                    }}
                  />
                </div>
              ))}
              
              {/* Add New Param Placeholder */}
              <button className="border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 transition-all">
                <RefreshCw size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Initialize New Parameter</span>
              </button>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex gap-4 items-start">
        <AlertCircle className="text-amber-500 shrink-0" size={24} />
        <div>
          <h4 className="text-amber-500 font-bold mb-1">Security Protocol Warning</h4>
          <p className="text-slate-400 text-sm leading-relaxed">Changes to AI Model keys or Payment Gateway secrets will take effect globally across all mobile and web instances after the next system heartbeat (approx. 5 minutes).</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
