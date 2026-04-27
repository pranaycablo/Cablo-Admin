import React, { useState, useEffect } from 'react';
import { Globe, Save, RefreshCw, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const FareManagement = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/fare-configs', {
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
      await axios.post('http://localhost:5000/api/admin/fare-configs', config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Config updated successfully!');
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Global Fare Control</h2>
          <p className="text-slate-400 mt-1">Manage base fares and per-km rates across all regions and tiers.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20">
          <Plus size={20} />
          Add New Region
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {configs.map((config, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">{config.region} - {config.vehicleType}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Tier • {config.currency}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleUpdate(config)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all font-bold text-sm"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">Base Fare</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  value={config.baseFare}
                  onChange={(e) => {
                    const newConfigs = [...configs];
                    newConfigs[idx].baseFare = e.target.value;
                    setConfigs(newConfigs);
                  }}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">Per KM Rate</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  value={config.perKmRate}
                  onChange={(e) => {
                    const newConfigs = [...configs];
                    newConfigs[idx].perKmRate = e.target.value;
                    setConfigs(newConfigs);
                  }}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">Min. Fare</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  value={config.minimumFare}
                  onChange={(e) => {
                    const newConfigs = [...configs];
                    newConfigs[idx].minimumFare = e.target.value;
                    setConfigs(newConfigs);
                  }}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">Platform Fee (%)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  value={config.platformFeePercent}
                  onChange={(e) => {
                    const newConfigs = [...configs];
                    newConfigs[idx].platformFeePercent = e.target.value;
                    setConfigs(newConfigs);
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {configs.length === 0 && !loading && (
          <div className="bg-slate-900 border border-dashed border-slate-800 p-20 rounded-3xl text-center">
            <p className="text-slate-500 font-bold italic">No fare configurations found. Create one to get started.</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center p-20">
            <RefreshCw className="text-amber-500 animate-spin" size={40} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FareManagement;
