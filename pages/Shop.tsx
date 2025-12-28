
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { db } from '../services/db';
import { useTranslation } from '../services/i18n';
import { SlidersHorizontal } from 'lucide-react';

interface Props {
  addToCart: (p: Product) => void;
}

const Shop: React.FC<Props> = ({ addToCart }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    // Correctly await the async getProducts call
    const fetchAndFilterProducts = async () => {
      let all = await db.getProducts();
      if (filter === 'new') {
          all = all.slice().reverse(); 
      } else if (filter === 'best') {
          all = all.filter(p => p.isPopular);
      } else if (filter === 'offer') {
          all = all.filter(p => p.salePrice && p.salePrice < p.price);
      }
      setProducts(all);
    };

    fetchAndFilterProducts();
  }, [filter]);

  const getTitle = () => {
    switch(filter) {
        case 'new': return t('new_arrivals');
        case 'best': return t('best_seller');
        case 'offer': return t('offer_zone');
        default: return t('shop_all');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tight mb-2">
            {getTitle()}
          </h1>
          <p className="text-gray-500 font-medium">{products.length} products found</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold hover:bg-brand-gray transition">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-gray rounded-[3rem]">
            <p className="text-gray-400 font-bold">No products found in this section.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
