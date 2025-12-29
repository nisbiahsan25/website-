
import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Trash2, Mail, MoreVertical, CheckCircle2, XCircle, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { StaffUser, Role } from '../../types';
import { db } from '../../services/db';
import { authService } from '../../services/auth';

const AdminStaff: React.FC = () => {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffUser> | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const staffList = await db.getStaff();
      const roleList = await db.getRoles();
      setStaff(staffList);
      setRoles(roleList);
    };
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    
    // CRITICAL: Prevent creating new staff without password
    if (!editingStaff.id && (!password || password.trim().length < 4)) {
      alert("Security Error: A password of at least 4 characters is mandatory for new staff.");
      return;
    }

    let updatedStaff: StaffUser = { ...editingStaff } as StaffUser;

    if (password.trim().length > 0) {
      updatedStaff.passwordHash = await authService.hashPassword(password);
    } else if (!updatedStaff.id) {
       return; // Should not reach here due to above check
    }

    let finalStaffList;
    if (editingStaff.id) {
      finalStaffList = staff.map(s => s.id === editingStaff.id ? updatedStaff : s);
    } else {
      updatedStaff.id = `u-${Date.now()}`;
      updatedStaff.status = 'Active';
      finalStaffList = [...staff, updatedStaff];
    }
    
    setStaff(finalStaffList);
    await db.saveStaff(finalStaffList);
    authService.logAction('SAVE_STAFF', 'Staff', updatedStaff.id, { email: updatedStaff.email });
    setIsModalOpen(false);
    setPassword('');
    setEditingStaff(null);
  };

  const inputClasses = "w-full px-6 py-4 bg-brand-gray rounded-2xl border border-gray-100 outline-none font-bold focus:ring-4 focus:ring-brand-orange/10 transition";

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-gray-500 font-medium">Control internal access and team roles</p>
        </div>
        <button 
          onClick={() => { setEditingStaff({ name: '', email: '', roleIds: [], status: 'Active' }); setPassword(''); setIsModalOpen(true); }}
          className="bg-brand-black text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center space-x-2 shadow-xl shadow-brand-black/20 hover:bg-brand-orange transition-all"
        >
          <UserPlus size={24} />
          <span>Invite Member</span>
        </button>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-gray border-b border-gray-50">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name & Email</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Assignment</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.map(user => (
              <tr key={user.id} className="hover:bg-brand-orange/5 transition group">
                <td className="px-10 py-6">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-brand-black text-white rounded-xl flex items-center justify-center font-black uppercase">{user.name ? user.name.charAt(0) : '?'}</div>
                     <div>
                        <p className="font-bold text-brand-black">{user.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex flex-wrap gap-2">
                    {roles.filter(r => user.roleIds.includes(r.id)).map(r => (
                      <span key={r.id} className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase rounded-lg">
                        {r.name}
                      </span>
                    ))}
                    {user.roleIds.length === 0 && <span className="text-xs text-gray-300">No roles</span>}
                  </div>
                </td>
                <td className="px-10 py-6">
                   <div className="flex items-center space-x-2">
                     {user.status === 'Active' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
                     <span className="text-sm font-bold text-gray-700">{user.status}</span>
                   </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <button onClick={() => { setEditingStaff(user); setPassword(''); setIsModalOpen(true); }} className="p-3 text-gray-300 hover:text-brand-orange transition rounded-xl">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-bold">No staff members found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/40 backdrop-blur-xl">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10">
              <h2 className="text-3xl font-black text-brand-black mb-2">Manage Access</h2>
              <p className="text-xs text-gray-400 font-bold uppercase mb-8">Set credentials and permissions</p>
              
              <form onSubmit={handleSave} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                    <input required value={editingStaff.name} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} className={inputClasses} />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                    <input required type="email" value={editingStaff.email} onChange={e => setEditingStaff({...editingStaff, email: e.target.value})} className={inputClasses} />
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Assign Roles</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto no-scrollbar bg-brand-gray p-4 rounded-2xl">
                       {roles.map(role => (
                          <label key={role.id} className="flex items-center space-x-2 cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={editingStaff.roleIds?.includes(role.id)}
                                onChange={e => {
                                   const ids = editingStaff.roleIds || [];
                                   const updated = e.target.checked ? [...ids, role.id] : ids.filter(id => id !== role.id);
                                   setEditingStaff({...editingStaff, roleIds: updated});
                                }}
                                className="accent-brand-orange"
                             />
                             <span className="text-xs font-bold text-gray-700">{role.name}</span>
                          </label>
                       ))}
                    </div>
                 </div>
                 
                 <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                      {editingStaff.id ? 'Change Password (leave blank to keep current)' : 'Set Password (Mandatory)'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className={inputClasses + " pl-12 pr-12"} 
                        placeholder="••••••••" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                 </div>

                 <div className="pt-4 flex space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 font-black text-gray-400 uppercase text-xs">Cancel</button>
                    <button type="submit" className="flex-grow bg-brand-black text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-orange transition">
                       {editingStaff.id ? 'Update' : 'Create'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
