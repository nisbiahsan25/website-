
import React, { useState, useEffect } from 'react';
import { Settings, FileText, History, Plus, Save, TrendingUp, MessageSquare, ShieldAlert, Trash2, DollarSign, X } from 'lucide-react';
import { OrderStatus, SmsConfig, SmsTemplate, SmsLog } from '../../../types';
import { db } from '../../../services/db';

const SmsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'logs' | 'blacklist'>('settings');
  const [config, setConfig] = useState<SmsConfig>(db.getSmsConfig());
  const [templates, setTemplates] = useState<SmsTemplate[]>(db.getSmsTemplates());
  const [logs, setLogs] = useState<SmsLog[]>(db.getSmsLogs());
  const [blacklist, setBlacklist] = useState<string[]>(db.getBlacklist());
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);

  const saveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSmsConfig(config);
    alert('NisbiGate Configuration Updated Successfully.');
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    const updated = editingTemplate.id 
      ? templates.map(t => t.id === editingTemplate.id ? editingTemplate : t)
      : [...templates, { ...editingTemplate, id: `tpl-${Date.now()}` }];
    setTemplates(updated);
    db.saveSmsTemplates(updated);
    setEditingTemplate(null);
  };

  const inputClasses = "w-full px-5 py-4 rounded-2xl bg-brand-gray border border-gray-100 text-sm font-bold text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-brand-orange/10 outline-none transition duration-300";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase mb-3 ml-1 tracking-widest";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">SMS Engine</h1>
          <p className="text-gray-500 font-medium">Automated order logistics & marketing</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2rem] px-8 py-4 shadow-sm flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway Balance</span>
            <span className="text-xl font-black text-brand-orange">৳{config.balance.toFixed(2)}</span>
          </div>
          <button className="bg-brand-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-orange transition shadow-lg shadow-brand-orange/20">Top Up</button>
        </div>
      </header>

      <nav className="flex space-x-2 p-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-x-auto no-scrollbar">
        {[
          { id: 'settings', label: 'Gateway', icon: Settings },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'logs', label: 'Delivery Log', icon: History },
          { id: 'blacklist', label: 'Fraud Shield', icon: ShieldAlert }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all duration-500 ${
              activeTab === tab.id ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'text-gray-400 hover:text-brand-black hover:bg-brand-gray'
            }`}
          >
            <tab.icon size={18} strokeWidth={2.5} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-10">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Settings size={28} /></div>
                <h3 className="text-2xl font-black text-gray-900">API Credentials</h3>
              </div>
              <form onSubmit={saveConfig} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className={labelClasses}>Primary SMS Provider</label>
                    <input value={config.provider} onChange={e => setConfig({...config, provider: e.target.value})} className={inputClasses} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClasses}>Branded Sender ID</label>
                    <input value={config.senderId || ''} onChange={e => setConfig({...config, senderId: e.target.value})} className={inputClasses} placeholder="e.g. NISBIMART" />
                  </div>
                  <div>
                    <label className={labelClasses}>Cost Per Message (৳)</label>
                    <input type="number" step="0.001" value={config.costPerSms} onChange={e => setConfig({...config, costPerSms: parseFloat(e.target.value)})} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>API Token</label>
                    <input type="password" value={config.apiKey || ''} onChange={e => setConfig({...config, apiKey: e.target.value})} className={inputClasses} placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-brand-black text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-orange transition-all duration-300 shadow-xl shadow-brand-black/10">
                  Save Logic Configuration
                </button>
              </form>
            </div>
            <div className="bg-brand-orange p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-brand-orange/20">
              <div className="absolute -top-10 -right-10 opacity-10 rotate-12"><MessageSquare size={250} /></div>
              <h3 className="text-3xl font-black mb-6">SMS Marketing ROI</h3>
              <p className="text-white/80 font-medium text-lg leading-relaxed mb-10">
                Automated status messages reduce "No Answer" delivery failures by <span className="font-black underline text-white">22.4%</span> across all zones.
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Network Health</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-black">98.2%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-1">Delivery Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">0.8s</p>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-1">Avg. Latency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(t => (
                <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:border-brand-orange transition-all duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg mb-1">{t.name}</h4>
                      <span className="px-3 py-1 bg-brand-orange/5 text-brand-orange text-[9px] font-black uppercase rounded-lg border border-brand-orange/10">
                        {t.triggerStatus}
                      </span>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-500 ${t.isActive ? 'bg-brand-orange' : 'bg-gray-200'}`}
                      onClick={() => {
                        const updated = templates.map(tpl => tpl.id === t.id ? { ...tpl, isActive: !tpl.isActive } : tpl);
                        setTemplates(updated);
                        db.saveSmsTemplates(updated);
                      }}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${t.isActive ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex-grow bg-brand-gray rounded-2xl p-6 text-sm text-gray-500 font-bold leading-relaxed mb-8 italic">
                    "{t.content}"
                  </div>
                  <button onClick={() => setEditingTemplate(t)} className="w-full bg-brand-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition">
                    Edit Template
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setEditingTemplate({ id: '', name: '', content: '', triggerStatus: OrderStatus.PENDING, isActive: true })}
                className="bg-brand-gray/50 border-4 border-dashed border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-gray-300 hover:text-brand-orange hover:border-brand-orange/20 transition-all duration-500 group"
              >
                <Plus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-black uppercase text-xs tracking-widest">New Logic Rule</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-brand-gray/30">
              <h3 className="text-2xl font-black text-gray-900">Live Traffic Manifest</h3>
              <div className="flex space-x-3">
                 <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-orange transition shadow-sm"><TrendingUp size={18} /></button>
                 <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-orange transition shadow-sm"><DollarSign size={18} /></button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-brand-gray border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recipient</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Manifest</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Protocol</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-brand-orange/5 transition group">
                    <td className="px-10 py-6">
                      <p className="font-black text-brand-black">{log.phoneNumber}</p>
                      <p className="text-[10px] font-black text-brand-orange uppercase">{log.orderId || 'Broadcast'}</p>
                    </td>
                    <td className="px-10 py-6 max-w-sm">
                      <p className="text-sm text-gray-600 font-bold truncate">"{log.content}"</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        log.status === 'SENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-xs text-gray-400 font-black">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-brand-gray/50">
               <div>
                 <h2 className="text-3xl font-black text-gray-900">Automation Logic</h2>
                 <p className="text-[10px] font-black text-brand-orange uppercase mt-1 tracking-widest">{editingTemplate.id ? 'Edit Payload' : 'New Payload'}</p>
               </div>
               <button onClick={() => setEditingTemplate(null)} className="p-3 hover:bg-white rounded-full transition"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveTemplate} className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2">
                    <label className={labelClasses}>Trigger Status</label>
                    <select value={editingTemplate.triggerStatus} onChange={e => setEditingTemplate({...editingTemplate, triggerStatus: e.target.value as OrderStatus})} className={inputClasses}>
                      {Object.values(OrderStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                 </div>
                 <div className="col-span-2">
                    <label className={labelClasses}>Template Internal Name</label>
                    <input required value={editingTemplate.name} onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} className={inputClasses} placeholder="e.g. Order Confirmation" />
                 </div>
                 <div className="col-span-2">
                    <label className={labelClasses}>Message Payload</label>
                    <textarea required rows={5} value={editingTemplate.content} onChange={e => setEditingTemplate({...editingTemplate, content: e.target.value})} className={`${inputClasses} resize-none leading-relaxed`} placeholder="Hello {{name}}, your order {{order_id}} is confirmed!" />
                 </div>
               </div>
               <div className="flex flex-wrap gap-2">
                 {['{{name}}', '{{order_id}}', '{{total}}', '{{tracking_url}}'].map(v => (
                   <button key={v} type="button" onClick={() => setEditingTemplate({...editingTemplate, content: editingTemplate.content + ' ' + v})} className="px-3 py-1.5 bg-brand-gray text-[10px] font-black text-gray-500 rounded-lg hover:text-brand-orange transition">
                     {v}
                   </button>
                 ))}
               </div>
               <button type="submit" className="w-full bg-brand-black text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-orange transition-all duration-300">
                 Commit Automation Rule
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsDashboard;
