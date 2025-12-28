
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, Languages, ShoppingCart } from 'lucide-react';
import { useTranslation } from '../services/i18n';

interface Props {
  cartCount: number;
}

const Navbar: React.FC<Props> = ({ cartCount }) => {
  const { t, language, setLanguage } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button className="p-2 -ml-2 lg:hidden text-gray-500">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-1 ml-2 lg:ml-0 group">
              {/* Logo Implementation mimicking the provided image */}
              <div className="flex items-center">
                <div className="relative mr-2">
                  <ShoppingCart size={32} className="text-brand-black" strokeWidth={2.5} />
                  <div className="absolute -top-1 -right-1 w-5 h-4 bg-brand-orange rounded-md transform rotate-12 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-2xl font-black tracking-tighter text-brand-black flex items-center">
                  nisbi<span className="text-brand-orange">mart</span>
                  <span className="ml-0.5 w-1.5 h-1.5 bg-brand-orange rounded-full self-start mt-2"></span>
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-10 text-sm font-bold text-gray-800">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-200 uppercase tracking-wide">{t('shop_all')}</Link>
            <Link to="/?cat=electronics" className="hover:text-brand-orange transition-colors duration-200 uppercase tracking-wide">{t('electronics')}</Link>
            <Link to="/?cat=lifestyle" className="hover:text-brand-orange transition-colors duration-200 uppercase tracking-wide">{t('lifestyle')}</Link>
            <Link to="/tracking" className="hover:text-brand-orange transition-colors duration-200 uppercase tracking-wide">{t('order_status')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="hidden sm:flex items-center space-x-1 px-4 py-2 rounded-2xl border-2 border-brand-orange/10 text-[11px] font-black text-brand-orange hover:bg-brand-orange hover:text-white transition-all duration-300"
            >
              <Languages size={14} />
              <span>{language === 'en' ? 'বাংলা' : 'ENGLISH'}</span>
            </button>

            <button className="p-2 text-gray-700 hover:text-brand-orange transition-colors">
              <Search size={22} />
            </button>
            <Link to="/login" className="p-2 text-gray-700 hover:text-brand-orange transition-colors">
              <User size={22} />
            </Link>
            <Link to="/cart" className="relative p-2.5 bg-brand-black text-white rounded-2xl hover:bg-brand-orange transition-all duration-300 shadow-lg shadow-brand-black/10 active:scale-95">
              <ShoppingBag size={20} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-black leading-none text-white transform bg-brand-orange rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
