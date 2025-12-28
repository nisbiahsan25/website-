
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

export const translations = {
  en: {
    shop_all: 'Shop All',
    electronics: 'Electronics',
    lifestyle: 'Lifestyle',
    order_status: 'Order Status',
    login: 'Login',
    cart: 'Cart',
    add_to_cart: 'Add to Cart',
    quick_add: 'Quick Add',
    best_seller: 'Best Seller',
    checkout: 'Checkout',
    summary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    free: 'FREE',
    confirm_order: 'Confirm Order',
    contact_info: 'Contact Information',
    shipping_details: 'Shipping Details',
    payment_methods: 'Payment Methods',
    full_address: 'Full Address',
    city: 'City',
    zip: 'ZIP Code',
    first_name: 'First Name',
    last_name: 'Last Name',
    phone: 'Phone Number',
    email: 'Email',
    buy_now: 'Buy Now',
    featured: 'Featured',
    popular_potential: 'Profit Potential',
    active_sku: 'Active SKU',
    low_stock: 'Low Stock',
    home: 'Home',
    admin: 'Admin',
    new_arrivals: 'New Arrivals',
    gadget_exclusive: 'Gadget Exclusive',
    offer_zone: 'Offer Zone',
    help_support: 'Support',
    shipping_policy: 'Shipping Policy',
    return_policy: 'Return Policy',
    contact_us: 'Contact Us',
    account: 'Account',
    wishlist: 'Wishlist',
    my_cart: 'My Cart'
  },
  bn: {
    shop_all: 'সব পণ্য',
    electronics: 'ইলেকট্রনিক্স',
    lifestyle: 'লাইফস্টাইল',
    order_status: 'অর্ডার স্ট্যাটাস',
    login: 'লগইন',
    cart: 'কার্ট',
    add_to_cart: 'কার্টে যোগ করুন',
    quick_add: 'দ্রুত কিনুন',
    best_seller: 'বেস্ট সেলার',
    checkout: 'চেকআউট',
    summary: 'অর্ডার সামারি',
    subtotal: 'সাব-টোটাল',
    shipping: 'ডেলিভারি চার্জ',
    total: 'সর্বমোট',
    free: 'ফ্রি',
    confirm_order: 'অর্ডার নিশ্চিত করুন',
    contact_info: 'যোগাযোগের তথ্য',
    shipping_details: 'ডেলিভারি ঠিকানা',
    payment_methods: 'পেমেন্ট পদ্ধতি',
    full_address: 'পুরো ঠিকানা',
    city: 'শহর',
    zip: 'জিপ কোড',
    first_name: 'নামের প্রথমাংশ',
    last_name: 'নামের শেষাংশ',
    phone: 'ফোন নম্বর',
    email: 'ইমেইল',
    buy_now: 'এখনি কিনুন',
    featured: 'ফিচারড',
    popular_potential: 'মুনাফার সম্ভাবনা',
    active_sku: 'সক্রিয় এসকেইউ',
    low_stock: 'স্টক কম',
    home: 'হোম',
    admin: 'অ্যাডমিন',
    new_arrivals: 'নতুন পণ্য',
    gadget_exclusive: 'গ্যাজেট এক্সক্লুসিভ',
    offer_zone: 'অফার জোন',
    help_support: 'সহযোগিতা',
    shipping_policy: 'শিপিং পলিসি',
    return_policy: 'রিটার্ন পলিসি',
    contact_us: 'যোগাযোগ',
    account: 'অ্যাকাউন্ট',
    wishlist: 'উইশলিস্ট',
    my_cart: 'আমার কার্ট'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('nexus_lang') as Language) || 'bn'
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus_lang', lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
