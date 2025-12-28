
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Package, MapPin, CheckCircle2, Clock, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, OrderStatus } from '../types';

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetailedHistory, setShowDetailedHistory] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setOrderId(id);
      handleTrack(id);
    }
  }, [location]);

  const handleTrack = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem('nexus_orders') || '[]');
      const found = orders.find((o: Order) => o.id === id);
      setOrder(found || null);
      setLoading(false);
    }, 800);
  };

  const statusSteps = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.PACKED,
    OrderStatus.SHIPPED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED
  ];

  const currentStepIdx = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-gray-500 font-medium">Enter your order ID or tracking number to see the status.</p>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-12 flex space-x-2">
        <input 
          type="text" 
          placeholder="e.g. ORD-123456" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-grow px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-orange/30 outline-none transition duration-200 font-bold"
        />
        <button 
          onClick={() => handleTrack(orderId)}
          className="bg-brand-black text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-orange transition flex items-center space-x-2 active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search size={20} strokeWidth={3} />
              <span>Track</span>
            </>
          )}
        </button>
      </div>

      {order ? (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-8 border-b border-gray-100">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order Number</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{order.id}</h2>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Estimated Arrival</p>
              <h2 className="text-3xl font-black text-brand-orange tracking-tighter">3-5 Business Days</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Status Pipeline */}
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-[3px] bg-gray-50"></div>
              <div className="space-y-10">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  
                  return (
                    <div key={step} className="relative pl-12">
                      <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm transition-all duration-500 ${
                        isCompleted ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={16} strokeWidth={3} /> : <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>}
                      </div>
                      <div>
                        <h3 className={`text-sm font-black uppercase tracking-widest ${isCurrent ? 'text-brand-orange' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step}
                        </h3>
                        {isCurrent && (
                          <p className="text-[10px] text-gray-500 mt-1 font-black flex items-center space-x-1 animate-pulse">
                            <Clock size={12} />
                            <span>LIVE UPDATING</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Detailed Feed */}
            <div className="space-y-8">
               <div className="bg-brand-gray p-8 rounded-[2.5rem] border border-gray-100">
                  <div className="flex items-center space-x-4 mb-6">
                     <div className="p-3 bg-white rounded-2xl shadow-sm"><Truck className="text-brand-orange" size={24} /></div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Partner</p>
                        <p className="font-black text-gray-900">{order.carrier || 'Logistics Assigned'}</p>
                     </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mb-6">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tracking ID</p>
                       <div className="flex items-center space-x-2">
                          <span className="text-xl font-black text-brand-black tracking-tight">{order.trackingNumber}</span>
                       </div>
                    </div>
                  )}

                  {order.trackingHistory && order.trackingHistory.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-gray-200">
                       <button 
                        onClick={() => setShowDetailedHistory(!showDetailedHistory)}
                        className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-black transition"
                       >
                          <span>Transit History</span>
                          {showDetailedHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                       </button>

                       {showDetailedHistory && (
                         <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            {order.trackingHistory.map((th, i) => (
                              <div key={i} className="flex items-start space-x-4">
                                <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${i === 0 ? 'bg-brand-orange shadow-[0_0_10px_rgba(242,113,65,0.5)]' : 'bg-gray-200'}`}></div>
                                <div className="flex-grow">
                                   <div className="flex justify-between items-baseline">
                                      <p className={`text-xs font-black uppercase tracking-tight ${i === 0 ? 'text-brand-orange' : 'text-gray-900'}`}>{th.status}</p>
                                      <p className="text-[9px] font-black text-gray-400">{new Date(th.timestamp).toLocaleDateString()}</p>
                                   </div>
                                   <p className="text-[10px] text-gray-500 font-bold flex items-center space-x-1 mt-0.5">
                                      <MapPin size={8} />
                                      <span>{th.location}</span>
                                   </p>
                                </div>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                  )}
               </div>

               <div className="bg-brand-black p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-black/20">
                  <div className="flex items-center space-x-3 mb-4 text-brand-orange font-black text-[10px] uppercase tracking-[0.3em]">
                     <Package size={16} />
                     <span>Safe Delivery Guaranteed</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                     Your package is being handled with our <span className="text-white">Nexus Care Protocol</span>. Expect a call from our rider once they arrive at your city hub.
                  </p>
               </div>
            </div>
          </div>
        </div>
      ) : orderId && !loading && (
        <div className="text-center p-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <AlertCircle size={40} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Manifest Not Found</h2>
           <p className="text-gray-500 font-medium max-w-sm mx-auto">We couldn't locate an order with that ID. Please verify the credentials in your confirmation SMS.</p>
        </div>
      )}
    </div>
  );
};

const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default OrderTracking;
