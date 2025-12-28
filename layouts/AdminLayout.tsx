
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Users, Target, Zap, TrendingUp,
  Box, Settings, ShieldCheck, UserCheck, LogOut, Tag,
  MessageSquare, Globe, Shield, Truck, Share2, Repeat, Database
} from 'lucide-react';
import { authService } from '../services/auth';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authorizedNav, setAuthorizedNav] = useState<any[]>([]);
  const [authorizedSys, setAuthorizedSys] = useState<any[]>([]);
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('nexus_admin_user');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', perm: null },
    { to: '/admin/builder', icon: Globe, label: 'Funnel Builder', perm: 'marketing.manage' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Sales Feed', perm: 'orders.view' },
    { to: '/admin/products', icon: Box, label: 'Ecosystem SKU', perm: 'products.edit' },
    { to: '/admin/categories', icon: Tag, label: 'Categories', perm: 'products.edit' },
    { to: '/admin/vendors', icon: Truck, label: 'Vendors', perm: 'vendor.manage' },
    { to: '/admin/marketing', icon: Target, label: 'Performance', perm: 'marketing.view' },
    { to: '/admin/sms', icon: MessageSquare, label: 'Comms Engine', perm: 'marketing.manage' },
    { to: '/admin/customers', icon: Users, label: 'Intelligence', perm: 'customers.view' },
  ];

  const systemItems = [
    { to: '/admin/capi', icon: Zap, label: 'Tracking Infrastructure', perm: 'marketing.reports' },
    { to: '/admin/data', icon: Database, label: 'Data & Backup', perm: 'system.settings' },
    { to: '/admin/roles', icon: Shield, label: 'Access Control', perm: 'system.roles' },
    { to: '/admin/staff', icon: UserCheck, label: 'Team Roles', perm: 'system.users' },
  ];

  // Resolve permissions asynchronously
  useEffect(() => {
    const filterPermissions = async () => {
      const navResults = [];
      for (const item of navItems) {
        if (!item.perm || await authService.can(item.perm as any)) {
          navResults.push(item);
        }
      }
      setAuthorizedNav(navResults);

      const sysResults = [];
      for (const item of systemItems) {
        if (!item.perm || await authService.can(item.perm as any)) {
          sysResults.push(item);
        }
      }
      setAuthorizedSys(sysResults);
    };

    filterPermissions();
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-brand-gray font-sans">
      <aside className="w-72 bg-brand-black text-white flex flex-col fixed h-full z-10 overflow-y-auto no-scrollbar shadow-2xl">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Ecosystem</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-1 py-4">
          {authorizedNav.map(item => (
            <Link key={item.to} to={item.to} className={`flex items-center space-x-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${isActive(item.to) ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-8 pb-4 px-6">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Infrastructure</p>
          </div>

          {authorizedSys.map(item => (
            <Link key={item.to} to={item.to} className={`flex items-center space-x-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${isActive(item.to) ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-brand-black/50 backdrop-blur-md">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Terminate session</span>
          </button>
        </div>
      </aside>
      <div className="flex-grow ml-72 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
