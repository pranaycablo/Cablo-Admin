import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldOff, Trash2, Mail, Phone, MapPin, Search, Filter } from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, data) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`http://localhost:5000/api/admin/users/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('PERMANENTLY DELETE THIS USER? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.mobile?.includes(searchTerm)
  );

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Citizen Governance</h2>
          <p className="text-slate-400 mt-1 font-medium">Manage user access, roles, and safety statuses across regions.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search by name or mobile..."
              className="bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-6 text-white text-sm outline-none focus:border-amber-500 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
          </div>
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
              <th className="px-6 py-5">Full Name & ID</th>
              <th className="px-6 py-5">Contact Details</th>
              <th className="px-6 py-5">Region / Role</th>
              <th className="px-6 py-5">Activity Status</th>
              <th className="px-6 py-5 text-right">Governance Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-bold text-white shadow-lg border border-slate-700">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono uppercase">ID: {user._id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone size={12} className="text-amber-500" />
                      {user.mobile}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mail size={12} className="text-blue-500" />
                      {user.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold inline-block w-fit">Global</span>
                    <span className="text-xs text-slate-500 font-bold uppercase">{user.role || 'user'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {user.isBlocked ? (
                    <span className="flex items-center gap-1 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full w-fit">
                      <ShieldOff size={10} />
                      Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                      <Shield size={10} />
                      Verified
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button 
                    onClick={() => handleAction(user._id, { isBlocked: !user.isBlocked })}
                    className={`p-2 rounded-lg transition-all ${user.isBlocked ? 'bg-emerald-500 text-slate-900' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    title={user.isBlocked ? 'Unblock User' : 'Block User'}
                  >
                    <Shield size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <Users className="text-slate-800 mx-auto mb-4" size={48} />
            <p className="text-slate-500 font-bold italic">No citizens found in the current governance shard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
