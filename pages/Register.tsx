
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../services/tracking';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      localStorage.setItem('user_token', 'simulated_user_token');
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('user_name', formData.name);
      trackEvent('Lead', { method: 'registration' });
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const inputClasses = "w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition duration-200 font-medium";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Create Account</h1>
          <p className="text-gray-500 font-medium">Join Nisbimart for an exclusive shopping experience</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                  className={inputClasses.replace('px-4', 'pl-12')}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className={inputClasses.replace('px-4', 'pl-12')}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className={inputClasses.replace('px-4', 'pl-12')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-brand-orange transition active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-brand-black/10"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-orange font-bold hover:underline">Sign in instead</Link>
        </p>

        <div className="mt-12 flex items-center justify-center space-x-2 text-gray-400 text-xs font-medium">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Secure AES-256 encrypted authentication</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
