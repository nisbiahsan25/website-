import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { db } from '../../services/db';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await db.getCustomers();
      setCustomers(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="p-8">
      <header className="flex justify-between items-end mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900">Customer Intelligence</h1><p className="text-gray-500">Analyze user behavior and lifetime value</p></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 outline-none w-64 shadow-sm" />
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Value</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Active</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading Customer Data...</td></tr>
            ) : filtered.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.email}</div>
                </td>
                <td className="px-6 py-4"><span className="text-sm font-bold text-gray-700">{c.orderCount}</span></td>
                <td className="px-6 py-4"><span className="text-sm font-bold text-brand-orange">৳{(c.totalSpent || 0).toFixed(2)}</span></td>
                <td className="px-6 py-4"><div className="text-xs text-gray-500">{new Date(c.lastOrder).toLocaleDateString()}</div></td>
                <td className="px-6 py-4 flex justify-end space-x-2">
                  <button className="p-2 text-gray-400 hover:text-brand-orange transition"><Mail size={18} /></button>
                  <button className="p-2 text-gray-400 hover:text-brand-orange transition"><TrendingUp size={18} /></button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;