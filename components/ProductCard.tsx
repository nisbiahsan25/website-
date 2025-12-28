
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from '../services/i18n';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  
  return (
    <div className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-orange/5 transition-all duration-500">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          />
          {product.isPopular && (
            <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl">
              {t('best_seller')}
            </div>
          )}
        </div>
        
        {/* Hover overlay with button */}
        <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white p-4 rounded-full text-brand-black transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                <ArrowRight size={24} />
            </div>
        </div>
      </Link>
      
      <div className="p-6 text-center">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-2">
          <Link to={`/product/${product.id}`} className="hover:text-brand-orange transition-colors">{product.name}</Link>
        </h3>
        
        <div className="flex items-center justify-center space-x-1 mb-4">
          <div className="flex text-brand-orange">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-bold tracking-tighter">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-4 bg-brand-gray p-2 rounded-2xl">
          <span className="text-xl font-black text-brand-black ml-2">৳{product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-brand-black text-white p-3 rounded-xl hover:bg-brand-orange transition-all duration-300 active:scale-90 shadow-lg shadow-brand-black/10"
            title={t('add_to_cart')}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
