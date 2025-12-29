import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowLeft,
  Truck,
  AlertTriangle,
  Package,
  Clock,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Zap,
  RefreshCw,
  MapPin,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Order, OrderStatus, TrackingHistoryEntry } from '../../types';
import { detectFraud } from '../../services/gemini';
import { db } from '../../services/db';
import { smsService } from '../../services/sms';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<{riskScore: number, reason: string} | null>(null);
  const [courierInfo, setCourierInfo] = useState({ carrier: '', trackingNumber: '' });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await db.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case OrderStatus.PENDING: return 'bg-orange-100 text-orange-700 border-orange-200';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-700 border-blue-200';
      case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-700 border-purple-200';
      case OrderStatus.CONFIRMED: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case OrderStatus.OUT_FOR_DELIVERY: return 'bg-amber-100 text-amber-700 border-amber-200';
      case OrderStatus.PACKED: return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const analyzeOrder = async (order: Order) => {
    setSelectedOrder(order);
    setCourierInfo({ carrier: order.carrier || '', trackingNumber: order.trackingNumber || '' });
    setFraudAnalysis(null);
    const result = await detectFraud(order);
    setFraudAnalysis(result);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    
    setTimeout(async () => {
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          const historyEntry = { 
            status: newStatus, 
            timestamp: new Date().toISOString(),
            note: 'Status updated via Quick-Action Manager'
          };
          const updated = { 
            ...o, 
            status: newStatus,
            statusHistory: [...(o.statusHistory || []), historyEntry]
          };
          
          smsService.triggerStatusSms(updated);
          
          if (selectedOrder?.id === orderId) setSelectedOrder(updated);
          return updated;
        }
        return o;
      });

      setOrders(updatedOrders);
      await db.updateOrders(updatedOrders);
      setUpdatingId(null);
    }, 400);
  };

  const updateOrderCourier = async () => {
    if (!selectedOrder) return;
    const updatedOrders = orders.map(o => {
      if (o.id === selectedOrder.id) {
        const newStatus = courierInfo.trackingNumber ? OrderStatus.SHIPPED : o.status;
        const history = [...(o.statusHistory || [])];
        
        if (newStatus !== o.status) {
            history.push({ 
              status: newStatus, 
              timestamp: new Date().toISOString(), 
              note: `Logistics sync: ${courierInfo.carrier} / ${courierInfo.trackingNumber}` 
            });
        }
        
        const updated = { 
          ...o, 
          carrier: courierInfo.carrier, 
          trackingNumber: courierInfo.trackingNumber,
          status: newStatus,
          statusHistory: history,
          trackingHistory: o.trackingHistory || [
            { status: 'Shipment Created', location: 'Merchant Warehouse', timestamp: new Date().toISOString() }
          ]
        };
        
        if (updated.status === OrderStatus.SHIPPED && o.status !== OrderStatus.SHIPPED) {
           smsService.triggerStatusSms(updated);
        }
        return updated;
      }
      return o;
    });
    setOrders(updatedOrders);
    await db.updateOrders(updatedOrders);
    const updatedSel = updatedOrders.find(u => u.id === selectedOrder.id);
    if(updatedSel) setSelectedOrder(updatedSel);
    alert('Logistics updated. Tracking initialized.');
  };

  const fetchTrackingUpdates = () => {
    if (!selectedOrder?.trackingNumber) return;
    setIsFetchingTracking(true);

    setTimeout(async () => {
      const mockEvents: TrackingHistoryEntry[] = [
        { status: 'Out for Delivery', location: 'Local Distribution Center', timestamp: new Date().toISOString() },
        { status: 'Arrived at Hub', location: 'Regional Sorting Center', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { status: 'In Transit', location: 'National Gateway', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
        { status: 'Picked Up', location: 'Merchant Facility', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
      ];

      const updatedOrders = orders.map(o => {
        if (o.id === selectedOrder.id) {
          return { ...o, trackingHistory: mockEvents };
        }
        return o;
      });

      setOrders(updatedOrders);
      await db.updateOrders(updatedOrders);
      const updatedSel = updatedOrders.find(u => u.id === selectedOrder.id);
      if(updatedSel) setSelectedOrder(updatedSel);
      setIsFetchingTracking(false);
    }, 1500);
  };

  const inputClasses = "w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-orange/30 outline-none transition duration-200";

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Orders Explorer</h1>
          <p className="text-gray-500 font-medium">Sales verification and fulfillment control</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID, name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-900 focus:ring-4 focus:ring-brand-orange/10 outline-none w-full sm:w-80 shadow-sm font-medium"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-100 rounded-2xl px-6 py-3 text-sm font-black text-brand-black shadow-sm outline-none focus:ring-4 focus:ring-brand-orange/10 appearance-none cursor-pointer hover:bg-gray-50 transition-colors min-w-[160px]"
          >
            <option value="All">All Flow Stages</option>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-gray border-b border-gray-50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Manifest</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gross Revenue</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-brand-orange/5 transition group relative">
                <td className="px-8 py-5 font-black text-brand-black">{order.id}</td>
                <td className="px-8 py-5">
                  <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{order.customerPhone}</div>
                </td>
                <td className="px-8 py-5 font-black text-brand-orange">৳{(order.total || 0).toFixed(2)}</td>
                <td className="px-8 py-5">
                  <div className="relative inline-block w-48">
                    {updatingId === order.id ? (
                      <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black uppercase text-gray-400 animate-pulse">
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Updating Flow...</span>
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`w-full px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer outline-none appearance-none transition duration-300 ${getStatusColor(order.status)}`}
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status} className="bg-white text-gray-900 font-bold">{status}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => analyzeOrder(order)} 
                    className="p-3 bg-brand-gray text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition rounded-2xl shadow-sm hover:scale-105 active:scale-95"
                    title="Deep Audit"
                  >
                    <ChevronRight size={18} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold">No active orders found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-brand-black/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto no-scrollbar border-l border-gray-100 animate-in slide-in-from-right duration-500">
            
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <button onClick={() => setSelectedOrder(null)} className="flex items-center space-x-2 text-gray-400 hover:text-brand-orange transition-colors font-black text-[10px] uppercase tracking-widest">
                <ArrowLeft size={16} strokeWidth={3} /> 
                <span>Back to Manifest</span>
              </button>
              <div className="flex space-x-2">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
              </div>
            </div>

            <div className="p-10 space-y-12">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black text-brand-black mb-2 tracking-tighter">{selectedOrder.id}</h2>
                  <p className="text-gray-500 font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <p className="text-4xl font-black text-brand-orange">৳{(selectedOrder.total || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-brand-gray p-8 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                     <Truck size={20} className="text-brand-black" />
                     <h3 className="font-black text-brand-black tracking-tight">Logistics Terminal</h3>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <button 
                      onClick={fetchTrackingUpdates}
                      disabled={isFetchingTracking}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center space-x-1 hover:text-indigo-800 transition"
                    >
                      {isFetchingTracking ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      <span>Poll Real-time Feed</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Courier Carrier</label>
                    <input placeholder="e.g. Pathao" value={courierInfo.carrier} onChange={(e) => setCourierInfo({...courierInfo, carrier: e.target.value})} className={inputClasses} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tracking Number</label>
                    <input placeholder="e.g. PN-12345" value={courierInfo.trackingNumber} onChange={(e) => setCourierInfo({...courierInfo, trackingNumber: e.target.value})} className={inputClasses} />
                  </div>
                </div>
                
                <button 
                  onClick={updateOrderCourier} 
                  className="w-full bg-brand-black text-white py-4 rounded-2xl font-black text-sm hover:bg-brand-orange transition-all duration-300 shadow-xl shadow-brand-black/20 mb-8"
                >
                  Sync & Bind Shipment
                </button>

                {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 && (
                   <div className="mt-8 pt-8 border-t border-gray-200">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Courier Transit Log</p>
                      <div className="space-y-6">
                         {selectedOrder.trackingHistory.map((th, i) => (
                           <div key={i} className="flex items-start space-x-4 relative">
                              {i !== selectedOrder.trackingHistory!.length - 1 && (
                                <div className="absolute left-[7px] top-6 w-[2px] h-8 bg-gray-100"></div>
                              )}
                              <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm shrink-0 mt-1 ${i === 0 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                              <div className="flex-grow">
                                 <div className="flex justify-between">
                                    <p className={`text-sm font-black uppercase tracking-tight ${i === 0 ? 'text-indigo-600' : 'text-gray-900'}`}>{th.status}</p>
                                    <p className="text-[9px] font-black text-gray-400">{new Date(th.timestamp).toLocaleTimeString()}</p>
                                 </div>
                                 <p className="text-xs text-gray-500 font-medium flex items-center space-x-1 mt-0.5">
                                    <MapPin size={10} />
                                    <span>{th.location}</span>
                                 </p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                )}
              </div>

              <div className="bg-brand-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-black/20">
                <div className="absolute -top-4 -right-4 opacity-5"><TrendingUp size={160} /></div>
                <div className="flex items-center space-x-2 mb-8 text-brand-orange font-black text-[10px] uppercase tracking-widest">
                   <DollarSign size={16} />
                   <span>Financial Performance</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Revenue</p>
                      <p className="text-xl font-black">৳{(selectedOrder.costDetails?.revenue || 0).toFixed(2)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">COGS</p>
                      <p className="text-xl font-black text-red-400">-৳{(selectedOrder.costDetails?.cogs || 0).toFixed(2)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Shipping & Ad</p>
                      <p className="text-xl font-black text-red-400">-৳{((selectedOrder.costDetails?.shipping || 0) + (selectedOrder.costDetails?.marketing || 0)).toFixed(2)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Net Profit</p>
                      <p className="text-xl font-black text-brand-orange">+৳{(selectedOrder.costDetails?.profit || 0).toFixed(2)}</p>
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3 mb-8">
                   <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl"><Clock size={20} /></div>
                   <h3 className="text-lg font-black text-brand-black tracking-tight">Flow History</h3>
                </div>
                <div className="relative pl-8 border-l-2 border-brand-orange/10 space-y-8">
                   {(selectedOrder.statusHistory || []).map((h, i) => (
                     <div key={i} className="relative">
                        <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-brand-orange border-4 border-white shadow-sm"></div>
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-sm font-black text-brand-black uppercase tracking-wider">{h.status}</p>
                              {h.note && <p className="text-xs text-gray-400 mt-1 font-medium italic">{h.note}</p>}
                           </div>
                           <p className="text-[10px] font-black text-gray-400 uppercase">{new Date(h.timestamp).toLocaleString()}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className={`p-8 rounded-[2.5rem] border ${fraudAnalysis?.riskScore && fraudAnalysis.riskScore > 50 ? 'bg-red-50 border-red-100' : 'bg-brand-orange/10 border-brand-orange/20'}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle size={20} className={fraudAnalysis?.riskScore && fraudAnalysis.riskScore > 50 ? 'text-red-600' : 'text-brand-orange'} />
                  <h3 className="font-black text-brand-black tracking-tight">AI Fraud Intelligence</h3>
                </div>
                {fraudAnalysis ? (
                  <>
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className={`text-4xl font-black ${fraudAnalysis.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'}`}>{fraudAnalysis.riskScore}%</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Factor</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">{fraudAnalysis.reason}</p>
                    <button onClick={async () => { await db.toggleBlacklist(selectedOrder.customerPhone); alert('Identity quarantined in Blacklist.'); }} className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] border-b-2 border-red-100 hover:border-red-600 pb-1 transition-all">
                      Permanent Blacklist
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 font-bold italic animate-pulse">
                    <Zap size={14} />
                    <span>Gemini analyzing behavior patterns...</span>
                  </div>
                )}
              </div>

              <div className="space-y-6 pb-12">
                <div className="flex items-center space-x-3 mb-4">
                   <Package size={20} className="text-brand-black" />
                   <h4 className="text-lg font-black text-brand-black tracking-tight">Order Manifest</h4>
                </div>
                <div className="space-y-4">
                   {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-brand-gray rounded-[2rem] border border-gray-100 group hover:border-brand-orange transition duration-500">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-white">
                           <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={item.name} />
                           <div className="absolute bottom-0 right-0 bg-brand-black text-white text-[10px] font-black px-1.5 py-0.5 rounded-tl-lg">x{item.quantity}</div>
                        </div>
                        <div>
                           <p className="text-sm font-black text-brand-black">{item.name}</p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">৳{(item.price || 0)} SKU price</p>
                        </div>
                      </div>
                      <p className="font-black text-brand-black text-lg">৳{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;