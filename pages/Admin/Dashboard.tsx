
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Target, Zap, TrendingUp, DollarSign, 
  ArrowUpRight, RefreshCw, BrainCircuit, Users, Share2, Package, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, FunnelChart, Funnel, LabelList 
} from 'recharts';
import { getAIOptimizationSuggestions } from '../../services/gemini';
import { db } from '../../services/db';

const AdminDashboard: React.FC = () => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [stats, setStats] = useState({ 
    revenue: 0, orders: 0, roas: 4.8, profit: 0, 
    activeVendors: 0, affiliateSales: 0 
  });

  useEffect(() => {
    // Asynchronously fetch data to fix promise-related errors
    const loadDashboardData = async () => {
      const orders = await db.getOrders();
      // Added await to resolve the promise before accessing .length
      const vendors = await db.getVendors();
      const revenue = orders.reduce((sum, o) => sum + o.total, 0);
      const profit = orders.reduce((sum, o) => sum + o.costDetails.profit, 0);
      const affiliateSales = orders.filter(o => o.affiliateId).length;
      
      const newStats = { 
        revenue, orders: orders.length, roas: 4.8, profit, 
        activeVendors: vendors.length, affiliateSales 
      };
      
      setStats(newStats);
      
      // Trigger AI insights once data is loaded
      setLoadingAi(true);
      const tip = await getAIOptimizationSuggestions(newStats);
      setAiTip(tip);
      setLoadingAi(false);
    };

    loadDashboardData();
  }, []);

  const handleFetchAiInsights = async () => {
    setLoadingAi(true);
    const tip = await getAIOptimizationSuggestions(stats);
    setAiTip(tip);
    setLoadingAi(false);
  };

  // Simple Markdown Parser for UI enhancement
  const formatAiText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let styledLine = line;
      
      // Handle Headings
      if (line.startsWith('###')) {
        return <h4 key={i} className="text-brand-orange font-black text-xl mt-6 mb-3 uppercase tracking-tight">{line.replace('###', '').trim()}</h4>;
      }
      
      // Handle Bold
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      const elements = boldParts.map((part, index) => {
        if (index % 2 === 1) return <strong key={index} className="text-white font-black">{part}</strong>;
        return part;
      });

      return <p key={i} className="mb-4 leading-relaxed text-gray-300 font-medium">{elements}</p>;
    });
  };

  const CARDS = [
    { name: 'Revenue', value: `৳${stats.revenue.toLocaleString()}`, trend: '+14%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Net Profit', value: `৳${stats.profit.toLocaleString()}`, trend: '+18%', icon: TrendingUp, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
    { name: 'Vendors', value: stats.activeVendors.toString(), trend: '+2', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Affiliate Sales', value: stats.affiliateSales.toString(), trend: '+5%', icon: Share2, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const FUNNEL_DATA = [
    { value: 12000, name: 'Visitors', fill: '#f3f4f6' },
    { value: 8000, name: 'View Product', fill: '#e5e7eb' },
    { value: 2000, name: 'Add to Cart', fill: '#F27141' },
    { value: 850, name: 'Checkout', fill: '#d94d1a' },
    { value: 450, name: 'Purchase', fill: '#000000' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-brand-gray min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ecosystem Intelligence</h1>
          <p className="text-gray-500 font-medium">Multi-channel commerce monitoring</p>
        </div>
        <button 
          onClick={handleFetchAiInsights} 
          disabled={loadingAi}
          className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-orange transition shadow-sm flex items-center space-x-2 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={20} className={loadingAi ? 'animate-spin text-brand-orange' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">Refresh AI Feed</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-brand-orange transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <span>{stat.trend}</span>
                <ArrowUpRight size={12} />
              </div>
            </div>
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</h3>
            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-brand-black rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-brand-orange/20">
           {/* Background decorative element */}
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <BrainCircuit size={300} />
           </div>

           <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-brand-orange p-3 rounded-2xl shadow-xl shadow-brand-orange/20"><Sparkles size={20} fill="currentColor" /></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-orange">AI Strategy Core</span>
                </div>
                {loadingAi && <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>Live Computing</div>}
              </div>

              <h2 className="text-4xl font-black mb-8 tracking-tighter">Growth & Scaling Roadmap<span className="text-brand-orange">.</span></h2>
              
              <div className="max-h-[500px] overflow-y-auto pr-4 no-scrollbar custom-ai-content">
                {loadingAi ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                    <div className="h-32 bg-white/5 rounded-[2rem] w-full"></div>
                    <div className="h-4 bg-white/10 rounded-full w-2/3"></div>
                  </div>
                ) : (
                  <div className="text-lg">
                    {aiTip ? formatAiText(aiTip) : "Analyzing your ecosystem for optimization triggers..."}
                  </div>
                )}
              </div>

              {!loadingAi && (
                <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center"><Zap size={14} className="text-brand-orange" /></div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Insights powered by Gemini 3 Pro</p>
                   </div>
                   <button onClick={() => alert('Roadmap exported to PDF.')} className="text-[10px] font-black uppercase tracking-widest hover:text-brand-orange transition">Download Full Audit</button>
                </div>
              )}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
           <h3 className="font-black text-gray-900 text-xl tracking-tight mb-8">Conversion Funnel</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <FunnelChart>
                 <Tooltip 
                   contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} 
                   itemStyle={{color: '#000'}}
                 />
                 <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive>
                   <LabelList position="right" fill="#888" stroke="none" dataKey="name" style={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em'}} />
                 </Funnel>
               </FunnelChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-gray-900 text-xl tracking-tight">Revenue Velocity</h3>
              <div className="flex space-x-4">
                 <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-brand-orange"></div><span className="text-[10px] font-black uppercase text-gray-400">Web</span></div>
                 <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-brand-black"></div><span className="text-[10px] font-black uppercase text-gray-400">App</span></div>
              </div>
           </div>
           <div className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[
                 { day: 'Mon', web: 4000, app: 2400 },
                 { day: 'Tue', web: 3000, app: 1398 },
                 { day: 'Wed', web: 2000, app: 9800 },
                 { day: 'Thu', web: 2780, app: 3908 },
                 { day: 'Fri', web: 1890, app: 4800 },
                 { day: 'Sat', web: 2390, app: 3800 },
                 { day: 'Sun', web: 3490, app: 4300 },
               ]}>
                 <defs>
                    <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F27141" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#F27141" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 'bold'}} />
                 <Tooltip />
                 <Area type="monotone" dataKey="web" stroke="#F27141" fillOpacity={1} fill="url(#colorWeb)" strokeWidth={4} />
                 <Area type="monotone" dataKey="app" stroke="#000000" fillOpacity={1} fill="url(#colorApp)" strokeWidth={4} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
           <h3 className="font-black text-gray-900 text-xl tracking-tight mb-10">Customer Loyalty Tiers</h3>
           <div className="flex items-center justify-around h-[300px]">
              {[
                { label: 'Bronze', value: 450, color: '#cd7f32' },
                { label: 'Silver', value: 120, color: '#c0c0c0' },
                { label: 'Gold', value: 45, color: '#ffd700' },
                { label: 'VIP', value: 12, color: '#000000' }
              ].map((tier, i) => (
                <div key={i} className="flex flex-col items-center">
                   <div className="relative w-24 bg-gray-50 rounded-full flex items-end justify-center overflow-hidden h-48 border border-gray-100 group cursor-default">
                      <div className="w-full transition-all duration-1000 group-hover:brightness-110" style={{ height: `${(tier.value / 450) * 100}%`, backgroundColor: tier.color }}></div>
                   </div>
                   <p className="mt-4 font-black text-[10px] uppercase tracking-[0.2em] text-brand-black">{tier.label}</p>
                   <p className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">{tier.value} Units</p>
                </div>
              ))}
           </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
