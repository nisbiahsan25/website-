
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, Lock, User, Wallet } from 'lucide-react';
import { CartItem, OrderStatus, Order } from '../types';
import { trackEvent } from '../services/tracking';
import { useTranslation } from '../services/i18n';

interface Props {
  cart: CartItem[];
  clearCart: () => void;
}

const Checkout: React.FC<Props> = ({ cart, clearCart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'cod'
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 60; // Adjusting for BDT scale
  const total = subtotal + shipping;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    trackEvent('InitiateCheckout', { value: subtotal, num_items: cart.length, currency: 'BDT' });
  }, [cart, navigate, subtotal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const cogs = cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
      const marketing = 150; // BDT scale
      const profit = total - cogs - shipping - marketing;
      const utmData = JSON.parse(localStorage.getItem('nexus_utm') || '{}');
      const now = new Date().toISOString();

      const order: Order = {
        id: `ORD-${Math.floor(Math.random() * 900000 + 100000)}`,
        customerId: 'guest_user_1',
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: [...cart],
        total: total,
        currency: 'BDT',
        status: OrderStatus.PENDING,
        statusHistory: [{ status: OrderStatus.PENDING, timestamp: now, note: 'Order placed by customer.' }],
        createdAt: now,
        trackingNumber: `NX-${Math.floor(Math.random() * 10000000)}`,
        costDetails: {
          revenue: total,
          cogs: cogs,
          shipping: shipping,
          marketing: marketing,
          vendorPayout: 0,
          affiliateCommission: 0,
          taxAmount: 0,
          profit: profit
        },
        adSource: utmData,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: 'Bangladesh'
        },
        paymentType: 'COD'
      };

      const orders = JSON.parse(localStorage.getItem('nexus_orders') || '[]');
      orders.push(order);
      localStorage.setItem('nexus_orders', JSON.stringify(orders));

      trackEvent('Purchase', { value: total, currency: 'BDT', num_items: cart.length, order_id: order.id });
      clearCart();
      setLoading(false);
      navigate(`/tracking?id=${order.id}`);
    }, 2000);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-orange/30 focus:border-transparent outline-none transition duration-200";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                  <User size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('contact_info')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                  <input type="email" name="email" required className={inputClasses} placeholder="you@example.com" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                  <input type="tel" name="phone" required className={inputClasses} placeholder="01XXXXXXXXX" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('first_name')}</label>
                  <input type="text" name="firstName" required className={inputClasses} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('last_name')}</label>
                  <input type="text" name="lastName" className={inputClasses} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                  <Truck size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('shipping_details')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_address')}</label>
                  <input type="text" name="address" required className={inputClasses} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                  <input type="text" name="city" required className={inputClasses} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('zip')}</label>
                  <input type="text" name="zip" required className={inputClasses} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                  <Wallet size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('payment_methods')}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 hover:border-brand-orange/20'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="accent-brand-orange h-4 w-4" />
                  <div className="ml-4 flex items-center justify-between w-full">
                    <div>
                      <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে টাকা দিন</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-brand-black rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 tracking-tight">{t('summary')}</h3>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">{t('subtotal')}</span>
                  <span className="font-bold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">{t('shipping')}</span>
                  <span className="text-brand-orange font-bold">{shipping === 0 ? t('free') : `৳${shipping}`}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10 mt-4">
                  <span>{t('total')}</span>
                  <span className="text-brand-orange">৳{total}</span>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading} className={`w-full bg-brand-orange text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-white hover:text-brand-black transition duration-300 ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : t('confirm_order')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
