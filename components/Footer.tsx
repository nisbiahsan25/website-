
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, ShoppingCart } from 'lucide-react';
import { useTranslation } from '../services/i18n';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-1 mb-8 group">
              <div className="flex items-center">
                <div className="relative mr-2">
                  <ShoppingCart size={28} className="text-brand-black" strokeWidth={2.5} />
                  <div className="absolute -top-1 -right-1 w-4 h-3 bg-brand-orange rounded-md transform rotate-12 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-xl font-black tracking-tighter text-brand-black flex items-center">
                  nisbi<span className="text-brand-orange">mart</span>
                  <span className="ml-0.5 w-1 h-1 bg-brand-orange rounded-full self-start mt-1.5"></span>
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
              আপনার নিত্যদিনের প্রয়োজনীয় আধুনিক গ্যাজেট এবং লাইফস্টাইল পণ্য এখন এক ঠিকানায়। কোয়ালিটি এবং সেবার নিশ্চয়তায় আমরাই সেরা।
            </p>
            <div className="flex space-x-5">
              <div className="w-10 h-10 bg-brand-gray rounded-xl flex items-center justify-center text-brand-black hover:bg-brand-orange hover:text-white cursor-pointer transition-all duration-300">
                <Facebook size={18} strokeWidth={2.5} />
              </div>
              <div className="w-10 h-10 bg-brand-gray rounded-xl flex items-center justify-center text-brand-black hover:bg-brand-orange hover:text-white cursor-pointer transition-all duration-300">
                <Instagram size={18} strokeWidth={2.5} />
              </div>
              <div className="w-10 h-10 bg-brand-gray rounded-xl flex items-center justify-center text-brand-black hover:bg-brand-orange hover:text-white cursor-pointer transition-all duration-300">
                <Twitter size={18} strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-brand-black mb-8 uppercase text-[10px] tracking-[0.2em]">{t('shop_all')}</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-bold">
              <li><Link to="/shop?filter=new" className="hover:text-brand-orange transition-colors">{t('new_arrivals')}</Link></li>
              <li><Link to="/shop?filter=best" className="hover:text-brand-orange transition-colors">{t('best_seller')}</Link></li>
              <li><Link to="/shop?cat=electronics" className="hover:text-brand-orange transition-colors">{t('gadget_exclusive')}</Link></li>
              <li><Link to="/shop?filter=offer" className="hover:text-brand-orange transition-colors">{t('offer_zone')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-brand-black mb-8 uppercase text-[10px] tracking-[0.2em]">{t('help_support')}</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-bold">
              <li><Link to="/tracking" className="hover:text-brand-orange transition-colors">{t('order_status')}</Link></li>
              <li><Link to="/policy/shipping" className="hover:text-brand-orange transition-colors">{t('shipping_policy')}</Link></li>
              <li><Link to="/policy/return" className="hover:text-brand-orange transition-colors">{t('return_policy')}</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange transition-colors">{t('contact_us')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-brand-black mb-8 uppercase text-[10px] tracking-[0.2em]">{t('account')}</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-bold">
              <li><Link to="/admin" className="hover:text-brand-orange transition-colors">{t('admin')}</Link></li>
              <li><Link to="/login" className="hover:text-brand-orange transition-colors">{t('login')}</Link></li>
              <li><Link to="/cart" className="hover:text-brand-orange transition-colors">{t('my_cart')}</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-orange transition-colors">{t('wishlist')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <p>© 2024 Nisbimart Systems. Engineered for Excellence.</p>
          <div className="flex space-x-10">
            <a href="#" className="hover:text-brand-orange transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
