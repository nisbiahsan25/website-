
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Chrome, Facebook, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../services/tracking';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication logic
    setTimeout(() => {
      localStorage.setItem('user_token', 'simulated_user_token');
      localStorage.setItem('user_email', email);
      trackEvent('Lead', { method: 'email' });
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    // In final server, this would trigger OAuth
    setTimeout(() => {
      localStorage.setItem('user_token', `simulated_${provider}_token`);
      localStorage.setItem('user_email', `${provider}_user@gmail.com`);
      trackEvent('Lead', { method: provider });
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const inputClasses = "w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition duration-200 font-medium";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Log in to manage your orders and wishlist</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={inputClasses.replace('px-4', 'pl-12')}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <button type="button" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClasses.replace('px-4', 'pl-12')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-indigo-600 transition active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-gray-900/10"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center space-x-2 p-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition font-bold text-gray-700 text-sm active:scale-95"
            >
              <Chrome size={18} className="text-blue-500" />
              <span>Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center justify-center space-x-2 p-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition font-bold text-gray-700 text-sm active:scale-95"
            >
              <Facebook size={18} className="text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline transition-colors decoration-2 underline-offset-4">Create one for free</Link>
        </p>

        <div className="mt-12 flex items-center justify-center space-x-2 text-gray-400 text-xs font-medium">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Secure AES-256 encrypted authentication</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
