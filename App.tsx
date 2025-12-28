
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminOrders from './pages/Admin/Orders';
import AdminMarketing from './pages/Admin/Marketing';
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminCustomers from './pages/Admin/Customers';
import AdminStaff from './pages/Admin/Staff';
import AdminRoles from './pages/Admin/Roles';
import AdminTrackingSettings from './pages/Admin/TrackingSettings';
import AdminLogin from './pages/Admin/Login';
import AdminVendors from './pages/Admin/Vendors';
import AdminSystemData from './pages/Admin/SystemData';
import SmsDashboard from './pages/Admin/SMS/SmsDashboard';
import PageBuilder from './pages/Admin/CMS/PageBuilder';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import StaticPage from './pages/StaticPage';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import { CartItem, Product } from './types';
import { trackEvent } from './services/tracking';
import { LanguageProvider } from './services/i18n';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmData = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      fbclid: params.get('fbclid'),
      gclid: params.get('gclid'),
    };
    if (utmData.utm_source || utmData.fbclid || utmData.gclid) {
      localStorage.setItem('nexus_utm', JSON.stringify(utmData));
    }
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, purchaseType: 'OneTime' }];
    });
    trackEvent('AddToCart', { product_id: product.id, value: product.price, currency: 'BDT' });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuth = () => localStorage.getItem('admin_authenticated') === 'true';

  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        {!isAdminPath && <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />}
        <main className={`flex-grow ${isAdminPath ? '' : 'pt-20 pb-12'}`}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/wishlist" element={<Wishlist addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy/:type" element={<StaticPage />} />
            
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route 
              path="/admin" 
              element={isAuth() ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="marketing" element={<AdminMarketing />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="vendors" element={<AdminVendors />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="data" element={<AdminSystemData />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="capi" element={<AdminTrackingSettings />} />
              <Route path="sms" element={<SmsDashboard />} />
              <Route path="builder" element={<PageBuilder />} />
              <Route path="fraud" element={<div className="p-12"><h1 className="text-4xl font-black text-brand-black">Fraud Shield AI</h1><p className="text-gray-500 mt-4 font-medium">Real-time behavior analysis enabled.</p></div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isAdminPath && <Footer />}
      </div>
    </LanguageProvider>
  );
};

export default App;
