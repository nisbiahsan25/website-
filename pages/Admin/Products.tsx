
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Package, TrendingUp, Zap, 
  Image as ImageIcon, CheckCircle2, X, Layers, DollarSign, 
  ChevronRight, Sparkles, Truck, Info, ArrowUpRight, Video, 
  Tags, List, Table as TableIcon, RefreshCw, CreditCard, Upload, Camera
} from 'lucide-react';
import { Product, ProductVariation, ProductSpecification } from '../../types';
import { db } from '../../services/db';
import { getMarketingCopy } from '../../services/gemini';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'financials' | 'specs' | 'logistics' | 'growth'>('general');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await db.getProducts();
    setProducts(Array.isArray(data) ? data : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.sku) return;

    setSaving(true);
    try {
      const finalProduct = {
        ...editingProduct,
        id: editingProduct.id || `p-${Date.now()}`,
        status: editingProduct.status || 'Active',
        vendorId: editingProduct.vendorId || 'v-1',
        rating: editingProduct.rating || 5,
        reviews: editingProduct.reviews || 0,
        slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/\s+/g, '-'),
        images: editingProduct.images?.length ? editingProduct.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200'],
        hasVariations: !!editingProduct.hasVariations,
        specifications: editingProduct.specifications || [],
        features: editingProduct.features || []
      } as Product;

      let updated;
      if (editingProduct.id) {
        updated = products.map(p => p.id === editingProduct.id ? finalProduct : p);
      } else {
        updated = [...products, finalProduct];
      }

      // STRICT SYNC WITH SERVER
      await db.saveProducts(updated);
      
      // REFRESH DATA FROM SERVER
      await loadProducts();
      
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Failed to sync with server. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const currentImages = [...(editingProduct?.images || [])];
        currentImages[index] = base64String;
        setEditingProduct({ ...editingProduct, images: currentImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecGroup = () => {
    const specs = [...(editingProduct?.specifications || [])];
    specs.push({ group: 'New Group', items: [{ label: '', value: '' }] });
    setEditingProduct({ ...editingProduct, specifications: specs });
  };

  const handleAddSpecItem = (groupIndex: number) => {
    const specs = [...(editingProduct?.specifications || [])];
    specs[groupIndex].items.push({ label: '', value: '' });
    setEditingProduct({ ...editingProduct, specifications: specs });
  };

  const handleAddFeature = () => {
    const features = [...(editingProduct?.features || [])];
    features.push('');
    setEditingProduct({ ...editingProduct, features });
  };

  const inputClasses = "w-full px-5 py-4 rounded-2xl bg-brand-gray border border-gray-100 text-sm font-bold text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-brand-orange/10 outline-none transition duration-300";
  const labelClasses = "block text-[10px] font-black text-gray-500 uppercase mb-2 ml-1 tracking-[0.15em]";

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-4 border-b-4 transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
        activeTab === id ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400 hover:text-brand-black'
      }`}
    >
      <Icon size={14} strokeWidth={3} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="p-8 bg-brand-gray min-h-screen">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Product Ecosystem</h1>
          <p className="text-gray-500 font-medium">Enterprise Grade SKU Management</p>
        </div>
        <button 
          onClick={() => { 
            setEditingProduct({ name: '', sku: '', brand: '', price: 0, cost: 0, stock: 0, category: 'electronics', features: [], specifications: [], variations: [], images: [], trackInventory: true, shippingInsideCity: 60, shippingOutsideCity: 120, emiMonths: 6 }); 
            setActiveTab('general');
            setIsModalOpen(true); 
          }}
          className="bg-brand-black text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 shadow-2xl shadow-brand-black/20 hover:bg-brand-orange transition-all active:scale-95"
        >
          <Plus size={24} />
          <span>New Entity</span>
        </button>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by SKU or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-brand-gray border border-gray-100 text-sm font-bold outline-none focus:ring-4 focus:ring-brand-orange/10 transition"
            />
          </div>
          <button onClick={loadProducts} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-orange hover:text-brand-black transition">
            <RefreshCw size={14} />
            <span>Sync with Server</span>
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-brand-gray/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Info</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Inventory</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price (Cash)</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
              <tr key={product.id} className="hover:bg-brand-orange/5 transition group">
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-brand-gray rounded-2xl overflow-hidden border border-gray-100">
                      <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                    </div>
                    <div>
                      <p className="font-black text-brand-black line-clamp-1">{product.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <span className="font-black text-sm text-gray-900">{product.stock} Units</span>
                </td>
                <td className="px-8 py-5 font-black text-brand-orange">৳{product.price}</td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => { setEditingProduct(product); setActiveTab('general'); setIsModalOpen(true); }} className="p-3 bg-brand-gray text-gray-400 hover:text-brand-orange transition rounded-2xl">
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <Package className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="font-bold text-gray-400">No products found on server.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/40 backdrop-blur-xl p-4">
           <div className="bg-white w-full max-w-6xl h-[92vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
              
              {/* Header */}
              <div className="p-10 pb-6 border-b border-gray-50 flex justify-between items-center bg-brand-gray/30">
                 <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-brand-black text-white rounded-3xl flex items-center justify-center shadow-xl shadow-brand-black/20">
                       <Layers size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-brand-black tracking-tighter">SKU Architect</h2>
                        <div className="flex items-center space-x-2 mt-1">
                           <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Advanced Product Configuration</span>
                        </div>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white hover:bg-red-50 hover:text-red-500 rounded-full transition-all duration-300 shadow-sm"><X size={24} /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-50 px-10 bg-white sticky top-0 z-10 space-x-2">
                <TabButton id="general" label="Identity" icon={Layers} />
                <TabButton id="financials" label="Pricing Logic" icon={DollarSign} />
                <TabButton id="specs" label="Specifications" icon={TableIcon} />
                <TabButton id="logistics" label="Inventory" icon={Package} />
                <TabButton id="growth" label="Sales & AI" icon={Sparkles} />
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-12 space-y-12 no-scrollbar bg-white">
                
                {activeTab === 'general' && (
                  <div className="grid grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="col-span-7 space-y-10">
                      <div>
                        <label className={labelClasses}>Primary Display Name</label>
                        <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className={inputClasses} placeholder="e.g. EZVIZ CP1 Lite 2MP Pan & Tilt WiFi Dome IP Camera" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className={labelClasses}>Model / SKU Code</label>
                          <input required value={editingProduct.sku} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} className={inputClasses} placeholder="CP1-LITE-BLK" />
                        </div>
                        <div>
                          <label className={labelClasses}>Brand</label>
                          <input value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} className={inputClasses} placeholder="e.g. EZVIZ" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-4">
                           <label className={labelClasses}>Key Features (Bullets)</label>
                           <button type="button" onClick={handleAddFeature} className="text-[10px] font-black text-brand-orange uppercase tracking-widest flex items-center"><Plus size={12} className="mr-1" /> Add Feature</button>
                        </div>
                        <div className="space-y-3">
                           {editingProduct.features?.map((f, i) => (
                             <div key={i} className="flex space-x-3">
                                <input 
                                  value={f} 
                                  onChange={e => {
                                    const features = [...(editingProduct.features || [])];
                                    features[i] = e.target.value;
                                    setEditingProduct({...editingProduct, features});
                                  }} 
                                  className={inputClasses} 
                                  placeholder={`Feature #${i+1}`} 
                                />
                                <button type="button" onClick={() => {
                                  const features = [...(editingProduct.features || [])];
                                  features.splice(i, 1);
                                  setEditingProduct({...editingProduct, features});
                                }} className="p-4 text-red-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-5 space-y-8">
                       <label className={labelClasses}>Media Assets (Click to Upload)</label>
                       <div className="grid grid-cols-1 gap-6">
                          {/* Main Image Upload */}
                          <div className="p-8 bg-brand-gray rounded-[3rem] border border-gray-100 flex flex-col items-center">
                             <input 
                               type="file" 
                               ref={mainImageInputRef}
                               className="hidden" 
                               accept="image/*"
                               onChange={(e) => handleFileUpload(e, 0)}
                             />
                             <div 
                               onClick={() => mainImageInputRef.current?.click()}
                               className="w-full aspect-square bg-white rounded-[2rem] border-2 border-dashed border-brand-orange/30 hover:border-brand-orange cursor-pointer flex flex-col items-center justify-center mb-6 overflow-hidden relative group transition-all"
                             >
                                {editingProduct.images?.[0] ? (
                                   <>
                                      <img src={editingProduct.images[0]} className="w-full h-full object-cover" alt="Preview" />
                                      <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                         <Camera className="text-white" size={32} />
                                      </div>
                                   </>
                                ) : (
                                   <div className="text-center p-6">
                                      <Upload size={48} className="text-brand-orange/30 mx-auto mb-3" />
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Primary Image</p>
                                   </div>
                                )}
                             </div>
                             <p className="text-[9px] font-bold text-gray-400 uppercase text-center">Suggested Size: 1000 x 1000px</p>
                          </div>

                          {/* Gallery Thumbnail Uploads */}
                          <div className="grid grid-cols-3 gap-4">
                             {[1, 2, 3].map(idx => (
                               <div key={idx} className="relative group">
                                  <input 
                                    type="file" 
                                    id={`file-${idx}`}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, idx)}
                                  />
                                  <label 
                                    htmlFor={`file-${idx}`}
                                    className="aspect-square bg-brand-gray rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-orange cursor-pointer flex items-center justify-center overflow-hidden transition-all"
                                  >
                                     {editingProduct.images?.[idx] ? (
                                        <img src={editingProduct.images[idx]} className="w-full h-full object-cover" alt="Thumb" />
                                     ) : (
                                        <Plus size={20} className="text-gray-300" />
                                     )}
                                  </label>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'financials' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-8">
                          <h4 className="text-xl font-black text-brand-black flex items-center space-x-3"><DollarSign className="text-brand-orange" /> <span>Cash & Regular Pricing</span></h4>
                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className={labelClasses}>Cash Discount Price (৳)</label>
                                <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className={inputClasses} />
                             </div>
                             <div>
                                <label className={labelClasses}>Regular Listing Price (৳)</label>
                                <input type="number" value={editingProduct.salePrice} onChange={e => setEditingProduct({...editingProduct, salePrice: parseFloat(e.target.value)})} className={inputClasses} />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <h4 className="text-xl font-black text-brand-black flex items-center space-x-3"><CreditCard className="text-brand-orange" /> <span>EMI Configuration</span></h4>
                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className={labelClasses}>EMI Tenure (Months)</label>
                                <input type="number" value={editingProduct.emiMonths} onChange={e => setEditingProduct({...editingProduct, emiMonths: parseInt(e.target.value)})} className={inputClasses} />
                             </div>
                             <div className="bg-brand-black rounded-[2rem] p-6 text-white flex flex-col justify-center">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Monthly Installment</p>
                                <p className="text-2xl font-black text-brand-orange">৳{Math.ceil((editingProduct.salePrice || editingProduct.price || 0) / (editingProduct.emiMonths || 6))}/mo</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xl font-black text-brand-black flex items-center space-x-3"><TableIcon className="text-brand-orange" /> <span>Detailed Specifications</span></h4>
                       <button type="button" onClick={handleAddSpecGroup} className="bg-brand-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2"><Plus size={14} /> <span>Add Group</span></button>
                    </div>

                    <div className="space-y-8">
                       {editingProduct.specifications?.map((group, gIdx) => (
                         <div key={gIdx} className="bg-brand-gray/50 rounded-[2.5rem] p-8 border border-gray-100 space-y-6">
                            <div className="flex justify-between items-center">
                               <input 
                                 value={group.group} 
                                 onChange={e => {
                                   const specs = [...(editingProduct.specifications || [])];
                                   specs[gIdx].group = e.target.value;
                                   setEditingProduct({...editingProduct, specifications: specs});
                                 }} 
                                 className="bg-transparent border-b-2 border-brand-orange font-black text-brand-black outline-none w-64" 
                                 placeholder="Group Name (e.g. Network)" 
                               />
                               <div className="flex space-x-4">
                                  <button type="button" onClick={() => handleAddSpecItem(gIdx)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Add Item</button>
                                  <button type="button" onClick={() => {
                                    const specs = [...(editingProduct.specifications || [])];
                                    specs.splice(gIdx, 1);
                                    setEditingProduct({...editingProduct, specifications: specs});
                                  }} className="text-[10px] font-black text-red-400 uppercase tracking-widest">Remove Group</button>
                               </div>
                            </div>

                            <div className="space-y-4">
                               {group.items.map((item, iIdx) => (
                                 <div key={iIdx} className="grid grid-cols-12 gap-6 items-center">
                                    <div className="col-span-5">
                                       <input 
                                          value={item.label} 
                                          onChange={e => {
                                            const specs = [...(editingProduct.specifications || [])];
                                            specs[gIdx].items[iIdx].label = e.target.value;
                                            setEditingProduct({...editingProduct, specifications: specs});
                                          }} 
                                          className={inputClasses + " bg-white"} 
                                          placeholder="Label (e.g. WiFi)" 
                                       />
                                    </div>
                                    <div className="col-span-6">
                                       <input 
                                          value={item.value} 
                                          onChange={e => {
                                            const specs = [...(editingProduct.specifications || [])];
                                            specs[gIdx].items[iIdx].value = e.target.value;
                                            setEditingProduct({...editingProduct, specifications: specs});
                                          }} 
                                          className={inputClasses + " bg-white"} 
                                          placeholder="Value (e.g. IEEE 802.11 b/g/n)" 
                                       />
                                    </div>
                                    <div className="col-span-1 text-center">
                                       <button type="button" onClick={() => {
                                          const specs = [...(editingProduct.specifications || [])];
                                          specs[gIdx].items.splice(iIdx, 1);
                                          setEditingProduct({...editingProduct, specifications: specs});
                                       }} className="text-gray-300 hover:text-red-500 transition"><X size={16} /></button>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === 'logistics' && (
                  <div className="grid grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="space-y-8">
                        <h4 className="text-xl font-black text-brand-black flex items-center space-x-3"><Package className="text-brand-orange" /> <span>Stock Management</span></h4>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className={labelClasses}>Current Inventory Level</label>
                              <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className={inputClasses} />
                           </div>
                           <div>
                              <label className={labelClasses}>Low Stock Alert Trigger</label>
                              <input type="number" value={editingProduct.lowStockAlert} onChange={e => setEditingProduct({...editingProduct, lowStockAlert: parseInt(e.target.value)})} className={inputClasses} />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <h4 className="text-xl font-black text-brand-black flex items-center space-x-3"><Truck className="text-brand-orange" /> <span>Shipping Protocols</span></h4>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className={labelClasses}>Dhaka City (৳)</label>
                              <input type="number" value={editingProduct.shippingInsideCity} onChange={e => setEditingProduct({...editingProduct, shippingInsideCity: parseFloat(e.target.value)})} className={inputClasses} />
                           </div>
                           <div>
                              <label className={labelClasses}>Outside Dhaka (৳)</label>
                              <input type="number" value={editingProduct.shippingOutsideCity} onChange={e => setEditingProduct({...editingProduct, shippingOutsideCity: parseFloat(e.target.value)})} className={inputClasses} />
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'growth' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-brand-black p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12"><Sparkles size={120} /></div>
                      <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                           <div className="p-3 bg-brand-orange rounded-2xl"><Zap size={20} fill="white" /></div>
                           <h4 className="text-2xl font-black tracking-tight">AI Strategy Engine</h4>
                        </div>
                        <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                          Synthesize high-converting product descriptions based on your SKU's technical specs and features.
                        </p>
                        <button 
                          type="button" 
                          disabled={loadingAi || !editingProduct.name}
                          onClick={async () => {
                             setLoadingAi(true);
                             const copy = await getMarketingCopy(editingProduct.name || '', editingProduct.features || []);
                             setEditingProduct({...editingProduct, description: copy});
                             setLoadingAi(false);
                          }}
                          className="bg-brand-orange text-white px-10 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center space-x-3 hover:bg-white hover:text-brand-black transition-all duration-500 shadow-2xl shadow-brand-orange/30 disabled:opacity-50"
                        >
                          {loadingAi ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                          <span>Synthesize Sales Description</span>
                        </button>
                      </div>
                    </div>

                    <div>
                       <label className={labelClasses}>Full Product Narrative (Markdown)</label>
                       <textarea 
                        rows={12}
                        value={editingProduct.description}
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                        className={`${inputClasses} resize-none leading-relaxed p-8 mt-4`}
                        placeholder="Detailed storytelling and tech explanation..."
                       />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-16 flex items-center justify-end space-x-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black text-gray-400 hover:text-brand-black transition-all uppercase tracking-widest text-xs">Cancel Build</button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-brand-black text-white px-20 py-6 rounded-[2.5rem] font-black text-xl hover:bg-brand-orange transition-all duration-500 shadow-2xl shadow-brand-black/20 hover:scale-105 active:scale-95 flex items-center space-x-3"
                  >
                    {saving ? <RefreshCw className="animate-spin" /> : null}
                    <span>{saving ? 'Authorizing SKU...' : 'Authorize SKU'}</span>
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
