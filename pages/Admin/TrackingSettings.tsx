
import React, { useState } from 'react';
import { Save, Zap, Facebook, Chrome, Shield } from 'lucide-react';

const AdminTrackingSettings: React.FC = () => {
  const [config, setConfig] = useState({
    fbPixel: '123456789012345',
    fbCapi: 'EAAG...',
    googleGTM: 'GTM-XXXXXX',
    testMode: true
  });

  const inputClasses = "w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition duration-200";

  return (
    <div className="p-8">
      <header className="flex justify-between items-end mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900">Pixel & CAPI Settings</h1><p className="text-gray-500">Configure your server-side tracking infrastructure</p></div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-700 transition">
          <Save size={20} /><span>Save Configuration</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-8"><Facebook className="text-blue-600" /><h3 className="font-bold text-xl text-gray-900">Meta Infrastructure</h3></div>
          <div className="space-y-6">
            <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Pixel ID</label><input value={config.fbPixel} onChange={e => setConfig({...config, fbPixel: e.target.value})} className={inputClasses} /></div>
            <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">CAPI Access Token</label><textarea value={config.fbCapi} onChange={e => setConfig({...config, fbCapi: e.target.value})} rows={4} className={`${inputClasses} resize-none`} /></div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div><p className="text-sm font-bold text-blue-900">Event Deduplication</p><p className="text-xs text-blue-700">Recommended for higher match quality</p></div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8"><Chrome className="text-orange-500" /><h3 className="font-bold text-xl text-gray-900">Google Marketing</h3></div>
            <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">GTM Container ID</label><input value={config.googleGTM} onChange={e => setConfig({...config, googleGTM: e.target.value})} className={inputClasses} /></div>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white">
            <div className="flex items-center space-x-3 mb-6"><Shield className="text-indigo-400" /><h3 className="font-bold text-xl">Advanced Security</h3></div>
            <p className="text-sm text-gray-400 mb-6">Server-side events bypass iOS14+ restrictions and ad-blockers by communicating directly with API endpoints.</p>
            <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-xs font-bold text-emerald-500 uppercase">CAPI Bridge Active</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrackingSettings;
