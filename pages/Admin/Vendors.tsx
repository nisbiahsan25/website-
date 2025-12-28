
import React, { useState, useEffect } from 'react';
import { Plus, Layout, ShieldCheck, XCircle, TrendingUp, DollarSign, ExternalLink } from 'lucide-react';
import { Vendor } from '../../types';
import { db } from '../../services/db';

const AdminVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Partial<Vendor> | null>(null);

  useEffect(() => {
    setVendors(db.getVendors());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;
    const newVendor = {
      ...editingVendor,
      id: editingVendor.id || `v-${Date.now()}`,
      status: editingVendor.status || 'Active',
      rating: editingVendor.rating || 5
    } as Vendor;

    const updated = editingVendor.id 
      ? vendors.map(v => v.id === editingVendor.id ? newVendor : v)
      : [...vendors, newVendor];

    setVendors(updated);
    db.saveVendors(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-brand-gray min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Marketplace Vendors</h1>
          <p className="text-gray-500 font-medium">Control seller access and commission logic</p>
        </div>
        <button 
          onClick={() => { setEditingVendor({ name: '', commissionRate: 10 }); setIsModalOpen(true); }}
          className="bg-brand-black text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 shadow-xl"
        >
          <Plus size={24} />
          <span>Add Seller</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors.map(vendor => (
          <div key={vendor.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm group hover:border-brand-orange transition-all duration-500">
             <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-brand-gray rounded-2xl flex items-center justify-center font-black text-2xl">
                   {vendor.name.charAt(0)}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {vendor.status}
                </div>
             </div>
             <h3 className="text-xl font-black text-brand-black mb-1">{vendor.name}</h3>
             <p className="text-xs text-gray-400 font-medium mb-6">Commission: {vendor.commissionRate}%</p>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-brand-gray rounded-2xl">
                   <p className="text-[10px] font-black text-gray-400 uppercase">Rating</p>
                   <p className="font-black text-brand-orange">{vendor.rating} ★</p>
                </div>
                <div className="p-4 bg-brand-gray rounded-2xl">
                   <p className="text-[10px] font-black text-gray-400 uppercase">Payouts</p>
                   <p className="font-black text-brand-black">$0.00</p>
                </div>
             </div>

             <div className="flex space-x-2">
                <button className="flex-grow bg-brand-gray text-brand-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition">Dashboard</button>
                <button className="p-3 bg-brand-gray text-gray-400 rounded-xl hover:text-brand-orange transition"><DollarSign size={20} /></button>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingVendor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/40 backdrop-blur-xl">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 animate-in zoom-in duration-300">
              <h2 className="text-3xl font-black mb-8">Vendor Onboarding</h2>
              <form onSubmit={handleSave} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Company Name</label>
                    <input value={editingVendor.name} onChange={e => setEditingVendor({...editingVendor, name: e.target.value})} className="w-full px-6 py-4 bg-brand-gray rounded-2xl border-none font-bold" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Commission Rate (%)</label>
                    <input type="number" value={editingVendor.commissionRate} onChange={e => setEditingVendor({...editingVendor, commissionRate: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-brand-gray rounded-2xl border-none font-bold" />
                 </div>
                 <button type="submit" className="w-full bg-brand-black text-white py-5 rounded-2xl font-black text-lg shadow-2xl">Authorize Vendor</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
