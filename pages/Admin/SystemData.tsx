
import React, { useState } from 'react';
import { Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Server } from 'lucide-react';
import { db } from '../../services/db';

const AdminSystemData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleExport = async () => {
    setLoading(true);
    // Wrapped in async to support await inside setTimeout simulation if needed, 
    // but the db method itself is async.
    try {
      await db.exportFullDatabase();
      setLoading(false);
      setStatus({ type: 'success', msg: 'Database exported successfully. You can now upload this file in another browser.' });
    } catch (e) {
      setLoading(false);
      setStatus({ type: 'error', msg: 'Export failed. Check console for details.' });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      // Added await to resolve the async database restoration
      const success = await db.importFullDatabase(content);
      if (success) {
        setStatus({ type: 'success', msg: 'Database restored! Reloading system...' });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setStatus({ type: 'error', msg: 'Failed to import. Invalid database file.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Infrastructure</h1>
        <p className="text-gray-500 font-medium">Data portability, backups, and server synchronization</p>
      </header>

      {status && (
        <div className={`p-6 rounded-[2rem] flex items-center space-x-4 animate-in fade-in zoom-in duration-300 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle2 /> : <AlertTriangle />}
          <p className="font-bold">{status.msg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Backup Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-[2rem] flex items-center justify-center mb-6">
            <Download size={36} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Export Database</h3>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Download your entire store configuration (Products, Orders, CMS) as a JSON file to transfer between browsers or for safety.
          </p>
          <button 
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-brand-black text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-brand-orange transition-all shadow-xl shadow-brand-black/10 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Download size={20} />}
            <span>Backup to JSON</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-brand-black/5 text-brand-black rounded-[2rem] flex items-center justify-center mb-6">
            <Upload size={36} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Restore Database</h3>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Upload a previously exported database file to sync this browser with your other sessions.
          </p>
          <label className="w-full bg-brand-gray text-brand-black py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-gray-200 cursor-pointer transition-all border border-gray-100 active:scale-95">
            <Upload size={20} />
            <span>Upload & Sync</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Connection Info */}
      <div className="bg-brand-black p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Server size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <ShieldCheck className="text-brand-orange" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Connectivity Monitor</span>
          </div>
          <h2 className="text-3xl font-black mb-6 tracking-tighter">Central API Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
              <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Endpoint</p>
              <p className="font-bold text-sm truncate">/api/index.php</p>
            </div>
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Protocol</p>
              <p className="font-bold text-emerald-400">LocalStorage + REST Fallback</p>
            </div>
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Sync Mode</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="font-bold">Persistent Persistence</p>
              </div>
            </div>
          </div>
          <p className="mt-10 text-gray-500 text-sm font-medium italic">
            Note: For real-time cross-browser sync without manual export, you must connect a live MySQL/MongoDB database to the /api/ folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemData;
