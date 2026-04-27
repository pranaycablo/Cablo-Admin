import React, { useState, useEffect } from 'react';
import { Car, Plus, Save, Image as ImageIcon, Trash2, LayoutGrid, Info } from 'lucide-react';
import axios from 'axios';

const VehicleManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'cab',
    slab: 'ride',
    icon: '',
    description: '',
    capacity: 4,
    weightLimit: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/vehicle-categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('http://localhost:5000/api/admin/vehicle-categories', newCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert('Failed to create category');
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Fleet Architecture</h2>
          <p className="text-slate-400 mt-1 font-medium">Design vehicle tiers, upload icons, and assign service slabs.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-black rounded-xl shadow-xl shadow-white/10 hover:bg-slate-100 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create New Category
        </button>
      </header>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center p-2 border border-slate-800 group-hover:border-amber-500/30 transition-all">
                {cat.icon ? (
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                ) : (
                  <Car className="text-slate-700" size={32} />
                )}
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  cat.slab === 'ride' ? 'bg-blue-500/10 text-blue-500' :
                  cat.slab === 'parcel' ? 'bg-amber-500/10 text-amber-500' :
                  cat.slab === 'bus' ? 'bg-emerald-500/10 text-emerald-500' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {cat.slab}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  {cat.type}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
            <p className="text-sm text-slate-400 font-medium mb-6 line-clamp-2">{cat.description || 'No description provided for this category.'}</p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/50">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Capacity</p>
                <p className="text-white font-bold">{cat.capacity} Pax</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Weight Limit</p>
                <p className="text-white font-bold">{cat.weightLimit || 0} KG</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Category */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-8 relative z-10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6">Create Vehicle Tier</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Category Name</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-amber-500"
                  placeholder="e.g. Cablo Luxury"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Service Slab</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-amber-500"
                  value={newCategory.slab}
                  onChange={(e) => setNewCategory({...newCategory, slab: e.target.value})}
                >
                  <option value="ride">Ride-Hailing</option>
                  <option value="parcel">Parcel/Logistics</option>
                  <option value="bus">Bus/Transit</option>
                  <option value="machinery">Heavy Machinery</option>
                  <option value="logistics">City Logistics</option>
                  <option value="monthly">Monthly Subscription</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Vehicle Type (Technical)</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-amber-500"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                >
                  <option value="bike">Bike</option>
                  <option value="auto">Auto Rikshaw</option>
                  <option value="cab">Cab/Car</option>
                  <option value="mini_load">Mini Loader</option>
                  <option value="city_load">City Pickup</option>
                  <option value="lite_truck">Lite Truck</option>
                  <option value="bus">Bus</option>
                  <option value="heavy_machinery">Heavy Machinery</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Icon PNG URL</label>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pl-12 text-white outline-none focus:border-amber-500"
                    placeholder="https://..."
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  />
                  <ImageIcon className="absolute left-4 top-4 text-slate-600" size={20} />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleCreate}
                className="flex-1 bg-amber-500 text-slate-900 font-black py-4 rounded-2xl hover:bg-amber-400 transition-all active:scale-95"
              >
                Launch Category
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="px-8 bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
