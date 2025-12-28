
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface Props {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
}

const Cart: React.FC<Props> = ({ cart, removeFromCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Scaling your lifestyle starts here.</p>
        <Link to="/" className="inline-block bg-brand-black text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-orange transition transform hover:-translate-y-1">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-2 mb-10">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-brand-orange transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-grow space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="text-sm font-bold text-gray-400">
                    Qty: {item.quantity}
                  </div>
                  <p className="text-lg font-black text-brand-orange">৳{item.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Card */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-brand-black rounded-3xl p-8 text-white sticky top-24 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Order Breakdown</h3>
            <div className="space-y-4 mb-8 text-gray-400 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (Included)</span>
                <span className="text-white font-bold">৳0.00</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Amount</p>
                <p className="text-3xl font-black text-brand-orange">৳{subtotal}</p>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:bg-white hover:text-brand-black transition active:scale-95 shadow-lg shadow-brand-orange/20">
              <span>Checkout Now</span>
              <ShoppingBag size={20} />
            </Link>
            <p className="text-center text-xs text-gray-500 mt-6 font-medium uppercase tracking-widest">
              Safe & Secure Transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
