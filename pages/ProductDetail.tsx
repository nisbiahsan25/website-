
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, Star, Shield, ArrowRight, Truck, RefreshCw, 
  ChevronRight, Home as HomeIcon, Package, Clock, Share2, 
  Heart, CheckCircle2, Info, Plus, Minus, CreditCard, Tag
} from 'lucide-react';
import { Product } from '../types';
import { trackEvent } from '../services/tracking';
import { db } from '../services/db';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'spec' | 'desc' | 'ques' | 'rev'>('spec');
  const [paymentOption, setPaymentOption] = useState<'cash' | 'emi'>('cash');

  useEffect(() => {
    const loadProduct = async () => {
      const all = await db.getProducts();
      const found = all.find(p => p.id === id || p.slug === id);
      if (found) {
        setProduct(found);
        setRelatedProducts(all.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4));
        trackEvent('ViewContent', { product_id: found.id, name: found.name, value: found.price, currency: 'BDT' });
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Syncing Product Data...</p>
    </div>
  );

  const emiMonthly = Math.ceil(product.price / 6);
  const regularPrice = Math.ceil(product.price * 1.08);

  return (
    <div className="bg-brand-gray/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-brand-orange flex items-center"><HomeIcon size={12} className="mr-1" /> Home</Link>
          <ChevronRight size={10} />
          <Link to={`/shop?cat=${product.category}`} className="hover:text-brand-orange">{product.category}</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Left: Product Images & Core Info */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Image Gallery */}
              <div className="space-y-6">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-brand-gray border border-gray-100 relative group">
                  <img 
                    src={product.images[selectedImage]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    alt={product.name} 
                  />
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                     <button className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-gray-400 hover:text-brand-orange shadow-lg transition"><Share2 size={18} /></button>
                     <button className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-500 shadow-lg transition"><Heart size={18} /></button>
                  </div>
                </div>
                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${selectedImage === i ? 'border-brand-orange scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Quick Info */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-black text-brand-black leading-tight tracking-tighter mb-4">{product.name}</h1>
                
                <div className="flex flex-wrap items-center gap-3 mb-8">
                   <div className="flex items-center space-x-1 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
                      <span>Price: ৳{product.price}</span>
                   </div>
                   <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <span>Regular: ৳{regularPrice}</span>
                   </div>
                   <div className="flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={10} />
                      <span>{product.stock > 0 ? 'In Stock' : 'Pre-Order'}</span>
                   </div>
                </div>

                {/* Key Features */}
                <div className="mb-8">
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Key Features</h3>
                   <ul className="space-y-3">
                      <li className="flex items-start text-sm font-medium text-gray-600">
                         <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                         <span>Model: {product.sku}</span>
                      </li>
                      {(product.features || []).slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start text-sm font-medium text-gray-600">
                           <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                           <span>{f}</span>
                        </li>
                      ))}
                   </ul>
                   <button className="mt-4 text-[10px] font-black text-brand-orange uppercase tracking-widest hover:underline">View More Info</button>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 mb-8">
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Payment Options</h3>
                   <div 
                      onClick={() => setPaymentOption('cash')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${paymentOption === 'cash' ? 'border-brand-orange bg-brand-orange/5 shadow-md' : 'border-gray-100 hover:border-brand-orange/20 bg-white'}`}
                   >
                      <div className="flex items-center space-x-4">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentOption === 'cash' ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                         </div>
                         <div>
                            <p className="text-xl font-black text-brand-black">৳{product.price}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Cash Discount Price</p>
                         </div>
                      </div>
                   </div>
                   <div 
                      onClick={() => setPaymentOption('emi')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${paymentOption === 'emi' ? 'border-brand-orange bg-brand-orange/5 shadow-md' : 'border-gray-100 hover:border-brand-orange/20 bg-white'}`}
                   >
                      <div className="flex items-center space-x-4">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentOption === 'emi' ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                         </div>
                         <div>
                            <p className="text-xl font-black text-brand-black">৳{emiMonthly}/month</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Regular Price: ৳{regularPrice} (6 Month EMI)</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
                   <div className="flex items-center bg-brand-gray rounded-2xl p-1 px-4 border border-gray-100">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-400 hover:text-brand-orange"><Minus size={16} /></button>
                      <span className="w-10 text-center font-black text-brand-black">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-400 hover:text-brand-orange"><Plus size={16} /></button>
                   </div>
                   <button 
                    className="flex-grow bg-brand-black text-white py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-brand-orange transition shadow-xl shadow-brand-orange/20 active:scale-95"
                    onClick={() => {}}
                   >
                      <ShoppingBag size={18} />
                      <span>Buy Now</span>
                   </button>
                </div>
              </div>
            </div>

            {/* Tabs for Specification, Description, etc. */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="flex border-b border-gray-100 bg-brand-gray/50 px-4">
                  {[
                    { id: 'spec', label: 'Specification' },
                    { id: 'desc', label: 'Description' },
                    { id: 'ques', label: 'Questions (0)' },
                    { id: 'rev', label: 'Reviews (0)' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === tab.id ? 'text-brand-orange' : 'text-gray-400 hover:text-brand-black'}`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange rounded-t-full"></div>}
                    </button>
                  ))}
               </div>

               <div className="p-10">
                  {activeTab === 'spec' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div>
                          <h4 className="inline-block px-4 py-1.5 bg-brand-orange/5 text-brand-orange rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-orange/10">General Information</h4>
                          <div className="divide-y divide-gray-50 border border-gray-50 rounded-2xl overflow-hidden">
                             <div className="grid grid-cols-3 bg-brand-gray/30">
                                <div className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand</div>
                                <div className="px-6 py-4 text-sm font-bold text-gray-700 col-span-2">{product.brand}</div>
                             </div>
                             <div className="grid grid-cols-3">
                                <div className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Model</div>
                                <div className="px-6 py-4 text-sm font-bold text-gray-700 col-span-2">{product.sku}</div>
                             </div>
                             <div className="grid grid-cols-3 bg-brand-gray/30">
                                <div className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</div>
                                <div className="px-6 py-4 text-sm font-bold text-gray-700 col-span-2 capitalize">{product.category}</div>
                             </div>
                             <div className="grid grid-cols-3">
                                <div className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight</div>
                                <div className="px-6 py-4 text-sm font-bold text-gray-700 col-span-2">{product.weight} kg</div>
                             </div>
                          </div>
                       </div>
                       <div>
                          <h4 className="inline-block px-4 py-1.5 bg-brand-orange/5 text-brand-orange rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-orange/10">Warranty Information</h4>
                          <div className="divide-y divide-gray-50 border border-gray-50 rounded-2xl overflow-hidden">
                             <div className="grid grid-cols-3 bg-brand-gray/30">
                                <div className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Warranty</div>
                                <div className="px-6 py-4 text-sm font-bold text-gray-700 col-span-2">01 Year Official Brand Warranty</div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'desc' && (
                    <div className="animate-in fade-in duration-500 prose max-w-none">
                       <h2 className="text-2xl font-black text-brand-black mb-6 tracking-tighter">{product.name}</h2>
                       <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">{product.description}</p>
                    </div>
                  )}

                  {activeTab === 'ques' && (
                    <div className="text-center py-20 space-y-6 animate-in fade-in duration-500">
                       <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mx-auto text-gray-300">
                          <Info size={40} />
                       </div>
                       <p className="text-gray-400 font-bold">There are no questions asked yet. Be the first one to ask a question.</p>
                       <button className="px-8 py-3 border-2 border-brand-orange text-brand-orange rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange hover:text-white transition">Ask Question</button>
                    </div>
                  )}

                  {activeTab === 'rev' && (
                    <div className="text-center py-20 space-y-6 animate-in fade-in duration-500">
                       <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mx-auto text-gray-300">
                          <Tag size={40} />
                       </div>
                       <p className="text-gray-400 font-bold">This product has no reviews yet. Be the first one to write a review.</p>
                       <button className="px-8 py-3 border-2 border-brand-orange text-brand-orange rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange hover:text-white transition">Write a Review</button>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Right Sidebar: Related Products & Ads */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
            
            {/* Related Products Widget */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-50 bg-brand-gray/50">
                  <h3 className="text-xs font-black text-brand-black uppercase tracking-widest">Related Products</h3>
               </div>
               <div className="p-6 divide-y divide-gray-50">
                  {relatedProducts.map(rp => (
                    <Link key={rp.id} to={`/product/${rp.id}`} className="flex items-center space-x-4 py-4 group">
                       <div className="w-16 h-16 bg-brand-gray rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={rp.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={rp.name} />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-xs font-bold text-gray-900 line-clamp-2 hover:text-brand-orange transition-colors">{rp.name}</p>
                          <p className="text-sm font-black text-brand-orange mt-1">৳{rp.price}</p>
                       </div>
                    </Link>
                  ))}
               </div>
            </div>

            {/* Recently Viewed (Placeholder) */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-50 bg-brand-gray/50">
                  <h3 className="text-xs font-black text-brand-black uppercase tracking-widest">Recently Viewed</h3>
               </div>
               <div className="p-12 text-center">
                  <Clock size={32} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No recent history</p>
               </div>
            </div>

            {/* Trust Badges Widget */}
            <div className="bg-brand-black rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl shadow-brand-black/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={100} /></div>
               <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-orange rounded-xl"><Shield size={16} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Purchase Protection</span>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-medium text-gray-400">
                     <Truck size={14} className="text-brand-orange" />
                     <span>Express Nationwide Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-medium text-gray-400">
                     <CreditCard size={14} className="text-brand-orange" />
                     <span>EMI with 24 Major Banks</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-medium text-gray-400">
                     <RefreshCw size={14} className="text-brand-orange" />
                     <span>7 Day Easy Return Policy</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Zap = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default ProductDetail;
