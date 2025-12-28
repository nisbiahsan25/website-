
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useTranslation } from '../services/i18n';
import { db } from '../services/db';

interface Props {
  addToCart: (p: Product) => void;
}

const Wishlist: React.FC<Props> = ({ addToCart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    // Correctly await the async getProducts call
    const loadWishlistItems = async () => {
      const allProducts = await db.getProducts();
      // For now, let's just mock with popular products as "wishlisted"
      setItems(allProducts.filter(p => p.isPopular).slice(0, 3));
    };

    loadWishlistItems();
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
          <Heart size={48} />
        </div>
        <h2 className="text-4xl font-black text-brand-black mb-4">আপনার উইশলিস্ট খালি!</h2>
        <p className="text-gray-500 font-medium mb-10">পছন্দের পণ্যগুলো সেভ করে রাখুন এবং পরে কিনুন।</p>
        <Link to="/" className="inline-flex items-center space-x-3 bg-brand-black text-white px-10 py-5 rounded-2xl font-black hover:bg-brand-orange transition">
          <ShoppingBag size={20} />
          <span>শপিং শুরু করুন</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center space-x-4 mb-12">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-orange transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-4xl font-black text-brand-black tracking-tight">{t('wishlist')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group shadow-sm">
            <div className="aspect-square overflow-hidden relative">
                <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name} />
                <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition shadow-lg">
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="p-8">
                <h3 className="text-lg font-bold text-brand-black mb-2">{item.name}</h3>
                <p className="text-2xl font-black text-brand-orange mb-6">৳{item.price}</p>
                <button onClick={() => addToCart(item)} className="w-full bg-brand-black text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-brand-orange transition">
                    <ShoppingBag size={18} />
                    <span>কার্টে যোগ করুন</span>
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
