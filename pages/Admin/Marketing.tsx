
import React, { useState } from 'react';
import { 
  BarChart2, 
  Zap, 
  Target, 
  MessageSquare, 
  Plus, 
  RefreshCw,
  Facebook,
  Share2,
  Mail,
  Send
} from 'lucide-react';
import { getMarketingCopy } from '../../services/gemini';

const AdminMarketing: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCopy = async () => {
    if (!productName) return;
    setLoading(true);
    const copy = await getMarketingCopy(productName, features.split(','));
    setGeneratedCopy(copy);
    setLoading(false);
  };

  const capiEvents = [
    { event: 'ViewContent', count: 12450, match: '94%', trend: '+5%' },
    { event: 'AddToCart', count: 2100, match: '91%', trend: '+12%' },
    { event: 'InitiateCheckout', count: 850, match: '88%', trend: '-2%' },
    { event: 'Purchase', count: 458, match: '96%', trend: '+8%' },
  ];

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition duration-200";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketing & ROAS</h1>
        <p className="text-gray-500">Automation and performance analytics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Facebook size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Meta Ads Manager</h2>
              </div>
              <button className="text-indigo-600 text-sm font-bold flex items-center space-x-1">
                <span>View Full Report</span>
                <Share2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Spend</p>
                <p className="text-xl font-black text-gray-900">$2,450.00</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">ROAS</p>
                <p className="text-xl font-black text-indigo-600">4.21x</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Cost Per Purchase</p>
                <p className="text-xl font-black text-gray-900">$5.34</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Zap size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">CAPI Tracking Health</h2>
              </div>
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                <RefreshCw size={10} className="animate-spin" />
                <span>Live Tracking</span>
              </span>
            </div>

            <div className="space-y-4">
              {capiEvents.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm font-bold">
                      {item.event.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.event}</p>
                      <p className="text-xs text-gray-500">{item.count.toLocaleString()} Events</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase">Match Quality</p>
                      <p className="text-sm font-bold text-indigo-600">{item.match}</p>
                    </div>
                    <div className="text-right w-16">
                      <p className={`text-xs font-bold ${item.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.trend}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Copywriter</h2>
          </div>
          
          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. Nexus Pro Watch"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Key Features</label>
              <textarea 
                rows={3}
                placeholder="Long battery, AMOLED, Heart sensor"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className={`${inputClasses} resize-none`}
              />
            </div>
            <button 
              onClick={handleGenerateCopy}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
              <span>Generate Ad Copy</span>
            </button>

            {generatedCopy && (
              <div className="mt-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 relative">
                <div className="text-sm text-indigo-900 whitespace-pre-line leading-relaxed italic">
                  "{generatedCopy}"
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(generatedCopy)}
                  className="absolute top-2 right-2 p-2 text-indigo-400 hover:text-indigo-600 transition"
                >
                  <Share2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Mail size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Retention Flows</h2>
          </div>
          <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-gray-200 transition">
            <Plus size={16} />
            <span>New Flow</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Abandoned Cart Recovery</h3>
              <p className="text-sm text-gray-500">Auto-send SMS after 1 hour</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-emerald-600">12.5%</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Recover Rate</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Post-Purchase Upsell</h3>
              <p className="text-sm text-gray-500">Email sequence for LTV</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-indigo-600">$4.5k</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Add. Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketing;
