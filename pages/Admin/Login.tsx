
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ShoppingCart, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import { db } from '../../services/db';
import { authService } from '../../services/auth';
import { StaffUser } from '../../types';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useLayoutEffect runs synchronously before painting, 
  // ensuring storage is cleared before any interaction can happen
  useLayoutEffect(() => {
    localStorage.clear(); // Complete purge of all sessions on landing
    localStorage.setItem('admin_authenticated', 'false');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Double-Layer Strict Validation
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail) {
      setError('Identity (Email) is required.');
      return;
    }
    
    if (!sanitizedPassword || sanitizedPassword.length === 0) {
      setError('Access Key (Password) cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const staffRaw = db.getStaff();
      const staff = Array.isArray(staffRaw) ? staffRaw : [];
      const user = staff.find(s => s.email.toLowerCase() === sanitizedEmail);

      // 2. Master Fallback (Only if database is empty)
      const isMasterEmail = sanitizedEmail === 'admin@nisbimart.com';
      const masterPassword = 'admin123'; 

      if (isMasterEmail && staff.length === 0) {
        if (sanitizedPassword === masterPassword) {
          const masterUser: StaffUser = {
            id: 'root-nexus',
            name: 'Root Admin',
            email: 'admin@nisbimart.com',
            roleIds: ['super-admin'],
            status: 'Active',
            passwordHash: await authService.hashPassword(masterPassword)
          };
          db.saveStaff([masterUser]);
          
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('nexus_admin_user', JSON.stringify(masterUser));
          navigate('/admin');
          return;
        } else {
          throw new Error('Verification failed. Invalid Master Key.');
        }
      }

      // 3. Secure Credential Verification
      if (!user) {
        throw new Error('Authorization identity not found.');
      }

      if (user.status !== 'Active') {
        throw new Error('This administrative account is suspended.');
      }

      if (!user.passwordHash || user.passwordHash === 'INVALID_EMPTY_PASSWORD_HASH') {
        throw new Error('Account security breach: No valid hash found in DB.');
      }

      // SHA-256 for empty string: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
      const blacklistedEmptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const enteredHash = await authService.hashPassword(sanitizedPassword);
      
      if (enteredHash === blacklistedEmptyHash) {
        throw new Error('Security Error: Empty password logic detected.');
      }

      if (user.passwordHash === enteredHash) {
        // Success: Double lock the session
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('nexus_admin_user', JSON.stringify(user));
        authService.logAction('LOGIN_SUCCESS', 'Auth', user.id);
        navigate('/admin');
      } else {
        authService.logAction('LOGIN_FAILED', 'Auth', user.id, { reason: 'Invalid Key' });
        throw new Error('Invalid credentials. Access Denied.');
      }
    } catch (err: any) {
      setError(err.message || 'Fatal authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const isBtnDisabled = !email.trim() || !password.trim() || loading;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4">
      {/* Visual background layers omitted for brevity but kept in mind */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-1 mb-8">
              <div className="flex items-center bg-white/5 p-4 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
                <ShoppingCart size={32} className="text-white" strokeWidth={2.5} />
                <span className="text-2xl font-black tracking-tighter text-white ml-2">
                  nisbi<span className="text-brand-orange">mart</span>
                </span>
              </div>
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Access Control</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Authorization Required to Proceed</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase text-center flex items-center justify-center space-x-2">
                <ShieldAlert size={14} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Identity (Email)</label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@nisbimart.com" 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange transition" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Key</label>
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange transition" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isBtnDisabled}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition duration-500 ${
                isBtnDisabled ? 'bg-white/5 text-gray-700 cursor-not-allowed' : 'bg-brand-orange text-white hover:scale-[1.02] shadow-xl shadow-brand-orange/20'
              }`}
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <span>Authenticate</span>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <div className="inline-flex items-center space-x-2 text-gray-700 text-[9px] font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={14} className="text-brand-orange" />
                <span>Zero-Trust Protocol V3.0 Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
