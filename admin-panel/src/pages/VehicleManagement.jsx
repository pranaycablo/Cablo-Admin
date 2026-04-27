import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Plus, 
  Save, 
  Image as ImageIcon, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  TrendingUp,
  Settings2,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const ServiceArchitecture = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSlab, setExpandedSlab] = useState('ride');
  const [showModal, setShowModal] = useState(false);
  const [newTier, setNewTier] = useState({
    slab: 'ride',
    categoryName: '',
    vehicleType: 'cab',
    icon: '',
    fareLogic: {
      baseFare: 0,
      perKmRate: 0,
      perMinRate: 0,
      minimumFare: 0
    }
  });

  const slabs = [
    { id: 'ride', name: 'Ride-Hailing', icon: '🚗' },
    { id: 'parcel', name: 'Parcel & Logistics', icon: '📦' },
    { id: 'bus', name: 'Bus & Transit', icon: '🚌' },
    { id: 'machinery', name: 'Heavy Machinery', icon: '🏗️' },
    { id: 'logistics', name: 'City Logistics', icon: '🚚' },
    { id: 'monthly', name: 'Monthly Subscription', icon: '📅' }
  ];

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/service-tiers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTiers(res.data.tiers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (tier) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('http://localhost:5000/api/admin/service-tiers', tier, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTiers();
      setShowModal(false);
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://localhost:5000/api/admin/service-tiers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTiers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Service Architecture</h2>
          <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
            <Settings2 size={16} className="text-amber-500" />
            Manage Slabs → Categories → Pricing Hierarchy
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-slate-900 font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} />
          Create New Tier
        </button>
      </header>

      <div className="space-y-6">
        {slabs.map((slab) => {
          const slabTiers = tiers.filter(t => t.slab === slab.id);
          const isExpanded = expandedSlab === slab.id;

          return (
            <div key={slab.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
              <button 
                onClick={() => setExpandedSlab(isExpanded ? null : slab.id)}
                className={`w-full flex items-center justify-between p-6 transition-all ${isExpanded ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{slab.icon}</span>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-white">{slab.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{slabTiers.length} Active Categories</p>
                  </div>
                </div>
                {isExpanded ? <ChevronDown size={24} className="text-slate-500" /> : <ChevronRight size={24} className="text-slate-500" />}
              </button>

              {isExpanded && (
                <div className="p-6 grid grid-cols-1 gap-4">
                  {slabTiers.map((tier) => (
                    <div key={tier._id} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-20 h-20 bg-slate-900 rounded-2xl p-3 border border-slate-800 shrink-0">
                        {tier.icon ? <img src={tier.icon} className="w-full h-full object-contain" /> : <Car className="text-slate-700" size={32} />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h4 className="text-xl font-bold text-white">{tier.categoryName}</h4>
                          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">{tier.vehicleType}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Base Fare</p>
                            <input 
                              className="bg-transparent border-b border-slate-800 text-white font-bold w-full outline-none focus:border-amber-500 py-1"
                              value={tier.fareLogic.baseFare}
                              onChange={(e) => {
                                const newTiers = [...tiers];
                                const target = newTiers.find(t => t._id === tier._id);
                                target.fareLogic.baseFare = e.target.value;
                                setTiers(newTiers);
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Per KM</p>
                            <input 
                              className="bg-transparent border-b border-slate-800 text-white font-bold w-full outline-none focus:border-amber-500 py-1"
                              value={tier.fareLogic.perKmRate}
                              onChange={(e) => {
                                const newTiers = [...tiers];
                                const target = newTiers.find(t => t._id === tier._id);
                                target.fareLogic.perKmRate = e.target.value;
                                setTiers(newTiers);
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Min. Fare</p>
                            <input 
                              className="bg-transparent border-b border-slate-800 text-white font-bold w-full outline-none focus:border-amber-500 py-1"
                              value={tier.fareLogic.minimumFare}
                              onChange={(e) => {
                                const newTiers = [...tiers];
                                const target = newTiers.find(t => t._id === tier._id);
                                target.fareLogic.minimumFare = e.target.value;
                                setTiers(newTiers);
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                            <button 
                              onClick={() => {
                                const newTiers = [...tiers];
                                const target = newTiers.find(t => t._id === tier._id);
                                target.isActive = !target.isActive;
                                setTiers(newTiers);
                                handleSave(target);
                              }}
                              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                                tier.isActive ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {tier.isActive ? 'Active (ON)' : 'Disabled (OFF)'}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleSave(tier)}
                              className="p-2 bg-amber-500 text-slate-900 rounded-lg hover:scale-110 transition-all shadow-lg shadow-amber-500/20"
                            >
                              <Save size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(tier._id)}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {slabTiers.length === 0 && (
                    <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl">
                      <p className="text-slate-500 font-bold italic">No categories defined for {slab.name}.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[40px] p-10 relative z-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
            
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <Plus className="text-amber-500" />
              Configure New Tier
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Master Slab</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-amber-500 font-bold appearance-none"
                  value={newTier.slab}
                  onChange={(e) => setNewTier({...newTier, slab: e.target.value})}
                >
                  {slabs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Category Name</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-amber-500 font-bold"
                  placeholder="e.g. Cablo Prime"
                  value={newTier.categoryName}
                  onChange={(e) => setNewTier({...newTier, categoryName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Vehicle Type</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-amber-500 font-bold"
                  value={newTier.vehicleType}
                  onChange={(e) => setNewTier({...newTier, vehicleType: e.target.value})}
                >
                  <option value="bike">Bike</option>
                  <option value="auto">Auto</option>
                  <option value="cab">Cab</option>
                  <option value="mini_load">Mini Loader</option>
                  <option value="city_load">City Load</option>
                  <option value="bus">Bus</option>
                  <option value="heavy_machinery">Heavy Machinery</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Icon PNG URL</label>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-12 text-white outline-none focus:border-amber-500 font-bold"
                    placeholder="https://..."
                    value={newTier.icon}
                    onChange={(e) => setNewTier({...newTier, icon: e.target.value})}
                  />
                  <ImageIcon className="absolute left-4 top-4 text-slate-600" size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 border-t border-slate-800 pt-8">
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Base Fare (₹)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-amber-500 font-bold"
                  placeholder="0"
                  value={newTier.fareLogic.baseFare}
                  onChange={(e) => setNewTier({...newTier, fareLogic: {...newTier.fareLogic, baseFare: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Per KM Rate (₹)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-amber-500 font-bold"
                  placeholder="0"
                  value={newTier.fareLogic.perKmRate}
                  onChange={(e) => setNewTier({...newTier, fareLogic: {...newTier.fareLogic, perKmRate: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Min. Fare (₹)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-amber-500 font-bold"
                  placeholder="0"
                  value={newTier.fareLogic.minimumFare}
                  onChange={(e) => setNewTier({...newTier, fareLogic: {...newTier.fareLogic, minimumFare: Number(e.target.value)}})}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleSave(newTier)}
                className="flex-1 bg-amber-500 text-slate-900 font-black py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
              >
                DEPLOY SERVICE TIER
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="px-10 bg-slate-800 text-white font-bold py-5 rounded-2xl hover:bg-slate-700 transition-all"
              >
                DISCARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceArchitecture;
