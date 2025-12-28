
import React, { useState, useEffect } from 'react';
import { Shield, Plus, Save, Trash2, X, CheckSquare, Square, ChevronRight } from 'lucide-react';
import { Role, PermissionSlug } from '../../types';
import { db } from '../../services/db';
import { authService } from '../../services/auth';

const PERMISSION_GROUPS: { group: string, perms: { slug: PermissionSlug, label: string }[] }[] = [
  {
    group: 'Orders',
    perms: [
      { slug: 'orders.view', label: 'View Orders' },
      { slug: 'orders.edit', label: 'Edit Orders' },
      { slug: 'orders.cancel', label: 'Cancel Orders' },
      { slug: 'orders.assign', label: 'Assign Courier' },
    ]
  },
  {
    group: 'Products',
    perms: [
      { slug: 'products.add', label: 'Add Product' },
      { slug: 'products.edit', label: 'Edit Product' },
      { slug: 'products.delete', label: 'Delete Product' },
      { slug: 'products.inventory', label: 'Manage Inventory' },
    ]
  },
  {
    group: 'Marketing',
    perms: [
      { slug: 'marketing.view', label: 'View Campaigns' },
      { slug: 'marketing.manage', label: 'Manage Coupons' },
      { slug: 'marketing.reports', label: 'Growth Reports' },
    ]
  },
  {
    group: 'Finance',
    perms: [
      { slug: 'finance.view', label: 'View Revenue' },
      { slug: 'finance.profit', label: 'View Net Profit' },
      { slug: 'finance.refunds', label: 'Manage Refunds' },
    ]
  },
  {
    group: 'System',
    perms: [
      { slug: 'system.users', label: 'Manage Staff' },
      { slug: 'system.roles', label: 'Manage Roles' },
      { slug: 'system.logs', label: 'Audit Logs' },
      { slug: 'system.settings', label: 'System Settings' },
    ]
  }
];

const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setRoles(db.getRoles());
  }, []);

  const handleTogglePermission = (slug: PermissionSlug) => {
    if (!selectedRole) return;
    const perms = selectedRole.permissions.includes(slug)
      ? selectedRole.permissions.filter(p => p !== slug)
      : [...selectedRole.permissions, slug];
    setSelectedRole({ ...selectedRole, permissions: perms });
  };

  const saveRole = () => {
    if (!selectedRole) return;
    let updated;
    if (selectedRole.id) {
      updated = roles.map(r => r.id === selectedRole.id ? selectedRole : r);
    } else {
      const newRole = { ...selectedRole, id: `role-${Date.now()}`, slug: selectedRole.name.toLowerCase().replace(/\s+/g, '-') };
      updated = [...roles, newRole];
    }
    setRoles(updated);
    db.saveRoles(updated);
    authService.logAction('SAVE_ROLE', 'Role', selectedRole.id, { name: selectedRole.name });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Access Control</h1>
          <p className="text-gray-500 font-medium">Define roles and permission matrices</p>
        </div>
        <button 
          onClick={() => { setSelectedRole({ id: '', name: '', slug: '', permissions: [] }); setIsModalOpen(true); }}
          className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center space-x-2 shadow-xl shadow-brand-orange/20"
        >
          <Plus size={24} />
          <span>Create New Role</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:border-brand-orange transition-all duration-500">
             <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-brand-orange/5 text-brand-orange rounded-2xl"><Shield size={24} /></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{role.permissions.length} Perms</span>
             </div>
             <h3 className="text-xl font-black text-brand-black mb-2">{role.name}</h3>
             <p className="text-xs text-gray-400 font-medium mb-8">Access level: {role.slug}</p>
             <button 
              onClick={() => { setSelectedRole(role); setIsModalOpen(true); }}
              className="w-full bg-brand-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition flex items-center justify-center space-x-2"
             >
               <span>Edit Matrix</span>
               <ChevronRight size={14} />
             </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
             <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-brand-gray/50">
                <div>
                   <h2 className="text-3xl font-black text-brand-black">Permission Matrix</h2>
                   <p className="text-xs text-gray-400 font-bold uppercase mt-1">Configuring: {selectedRole.name || 'New Role'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-full transition"><X size={24} /></button>
             </div>

             <div className="flex-grow overflow-y-auto p-10 space-y-12 no-scrollbar">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role Name</label>
                   <input 
                    value={selectedRole.name}
                    onChange={e => setSelectedRole({...selectedRole, name: e.target.value})}
                    placeholder="e.g. Finance Auditor"
                    className="w-full px-6 py-4 bg-brand-gray border border-gray-100 rounded-2xl outline-none font-black text-lg focus:ring-4 focus:ring-brand-orange/10 transition"
                   />
                </div>

                <div className="space-y-8">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Permissions Map</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {PERMISSION_GROUPS.map(group => (
                        <div key={group.group} className="bg-brand-gray rounded-[2rem] p-6 border border-gray-50">
                           <h5 className="font-black text-brand-black mb-6 flex items-center space-x-2">
                              <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
                              <span>{group.group}</span>
                           </h5>
                           <div className="space-y-3">
                              {group.perms.map(p => (
                                <button 
                                  key={p.slug}
                                  onClick={() => handleTogglePermission(p.slug)}
                                  className="flex items-center space-x-3 w-full text-left group"
                                >
                                  {selectedRole.permissions.includes(p.slug) ? (
                                    <CheckSquare size={20} className="text-brand-orange" />
                                  ) : (
                                    <Square size={20} className="text-gray-300 group-hover:text-brand-orange transition" />
                                  )}
                                  <span className={`text-sm font-bold ${selectedRole.permissions.includes(p.slug) ? 'text-brand-black' : 'text-gray-500'}`}>{p.label}</span>
                                </button>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="p-10 border-t border-gray-50 bg-white flex justify-end space-x-4">
                <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 font-black text-gray-400 hover:text-brand-black transition">Cancel</button>
                <button 
                  onClick={saveRole}
                  className="bg-brand-black text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-brand-orange transition shadow-xl shadow-brand-black/20"
                >
                  Save Matrix
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
