import { Product, Order, Category, SmsConfig, SmsTemplate, SmsLog, OrderStatus, CMSPage, BlockType, Role, StaffUser, Vendor } from '../types';

/**
 * SERVER PERSISTENCE ENGINE
 * Communicates with api/index.php for all data storage.
 */

const API_URL = 'api/index.php';

const apiRequest = async (action: string, method: string = 'GET', data?: any) => {
  try {
    const url = `${API_URL}?action=${action}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);
    
    if (!response.ok) {
        console.warn(`API [${action}] returned ${response.status}. Using local defaults.`);
        return null;
    }
    
    return await response.json();
  } catch (e) {
    console.warn(`API Connectivity Issue [${action}]:`, e);
    return null;
  }
};

export const db = {
  getProducts: async (): Promise<Product[]> => {
    const data = await apiRequest('get_products');
    return Array.isArray(data) ? data : [];
  },

  saveProducts: async (products: Product[]) => {
    await apiRequest('save_products', 'POST', products);
    window.dispatchEvent(new Event('db-updated'));
  },

  getOrders: async (): Promise<Order[]> => {
    const data = await apiRequest('get_orders');
    return Array.isArray(data) ? data : [];
  },

  updateOrders: async (orders: Order[]) => {
    await apiRequest('save_orders', 'POST', orders);
    window.dispatchEvent(new Event('db-updated'));
  },

  getCategories: async (): Promise<Category[]> => {
    const data = await apiRequest('get_categories');
    return Array.isArray(data) ? data : [];
  },

  saveCategories: async (categories: Category[]) => {
    await apiRequest('save_categories', 'POST', categories);
  },

  getPages: async (): Promise<CMSPage[]> => {
    const data = await apiRequest('get_pages');
    return Array.isArray(data) ? data : [];
  },

  savePages: async (pages: CMSPage[]) => {
    await apiRequest('save_pages', 'POST', pages);
  },

  getPageBySlug: async (slug: string): Promise<CMSPage | undefined> => {
     const pages = await db.getPages();
     const found = Array.isArray(pages) ? pages.find(p => p.slug === slug) : undefined;
     
     if (slug === 'home' && (!found)) {
        return {
          id: 'home-default',
          title: 'Nisbimart Home',
          slug: 'home',
          status: 'Published',
          type: 'Home',
          seo: { title: 'Nisbimart | Home', description: 'Best gadgets in town' },
          tracking: {},
          sections: [
            { id: 'h1', type: BlockType.HERO, isActive: true, order: 0, config: { source: 'manual', title: 'Modern Gear for Modern Life', subtitle: 'Exclusive Collection', description: 'Experience tech like never before.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', buttonText: 'Shop Now' } },
            { id: 'g1', type: BlockType.PRODUCT_GRID, isActive: true, order: 1, config: { title: 'New Arrivals', category: 'all', limit: 8 } }
          ],
          createdAt: new Date().toISOString()
        } as CMSPage;
     }
     return found;
  },

  getStaff: async (): Promise<StaffUser[]> => {
    const data = await apiRequest('get_staff');
    return Array.isArray(data) ? data : [];
  },
  
  saveStaff: async (staff: StaffUser[]) => {
    await apiRequest('save_staff', 'POST', staff);
  },
  
  getRoles: async (): Promise<Role[]> => {
    const data = await apiRequest('get_roles');
    return Array.isArray(data) ? data : [];
  },

  saveRoles: async (roles: Role[]) => {
    await apiRequest('save_roles', 'POST', roles);
  },

  getVendors: async (): Promise<Vendor[]> => {
    const data = await apiRequest('get_vendors');
    return Array.isArray(data) ? data : [];
  },

  saveVendors: async (vendors: Vendor[]) => {
    await apiRequest('save_vendors', 'POST', vendors);
  },

  getSmsConfig: async (): Promise<SmsConfig> => {
    const data = await apiRequest('get_sms_config');
    return data || { balance: 500, provider: "NisbiGate", apiKey: "", senderId: "NISBIMART", apiUrl: "", costPerSms: 0.5 };
  },

  saveSmsConfig: async (config: SmsConfig) => {
    await apiRequest('save_sms_config', 'POST', config);
  },

  getSmsTemplates: async (): Promise<SmsTemplate[]> => {
    const data = await apiRequest('get_sms_templates');
    if (Array.isArray(data) && data.length > 0) return data;
    return [
      { id: 't1', name: 'Order Confirmation', content: 'Hello {{name}}, your order {{order_id}} for {{total}} has been received.', triggerStatus: OrderStatus.PENDING, isActive: true },
      { id: 't2', name: 'Order Shipped', content: 'Good news {{name}}! Your order {{order_id}} is on its way.', triggerStatus: OrderStatus.SHIPPED, isActive: true }
    ];
  },

  saveSmsTemplates: async (templates: SmsTemplate[]) => {
    await apiRequest('save_sms_templates', 'POST', templates);
  },

  getSmsLogs: async (): Promise<SmsLog[]> => {
    const data = await apiRequest('get_sms_logs');
    return Array.isArray(data) ? data : [];
  },

  saveSmsLog: async (log: SmsLog) => {
    await apiRequest('save_sms_log', 'POST', log);
  },

  getCustomers: async () => {
    const orders = await db.getOrders();
    const customersMap = new Map();
    if (Array.isArray(orders)) {
      orders.forEach((order: Order) => {
        if (!customersMap.has(order.customerEmail)) {
          customersMap.set(order.customerEmail, {
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            orderCount: 0,
            totalSpent: 0,
            lastOrder: order.createdAt
          });
        }
        const c = customersMap.get(order.customerEmail);
        c.orderCount++;
        c.totalSpent += (order.total || 0);
      });
    }
    return Array.from(customersMap.values());
  },

  getBlacklist: async (): Promise<string[]> => {
    const data = await apiRequest('get_blacklist');
    return Array.isArray(data) ? data : [];
  },

  toggleBlacklist: async (phone: string) => {
    const list = await db.getBlacklist();
    const updated = list.includes(phone) ? list.filter(p => p !== phone) : [...list, phone];
    await apiRequest('save_blacklist', 'POST', updated);
  },

  exportFullDatabase: async () => {
    const data = {
      products: await db.getProducts(),
      orders: await db.getOrders(),
      categories: await db.getCategories(),
      pages: await db.getPages(),
      staff: await db.getStaff(),
      roles: await db.getRoles(),
      vendors: await db.getVendors(),
      smsConfig: await db.getSmsConfig(),
      smsTemplates: await db.getSmsTemplates(),
      smsLogs: await db.getSmsLogs(),
      blacklist: await db.getBlacklist()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nisbimart-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importFullDatabase: async (jsonContent: string) => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.products) await db.saveProducts(data.products);
      if (data.orders) await db.updateOrders(data.orders);
      if (data.categories) await db.saveCategories(data.categories);
      if (data.pages) await db.savePages(data.pages);
      if (data.staff) await db.saveStaff(data.staff);
      if (data.roles) await db.saveRoles(data.roles);
      if (data.vendors) await db.saveVendors(data.vendors);
      if (data.smsConfig) await db.saveSmsConfig(data.smsConfig);
      if (data.smsTemplates) await db.saveSmsTemplates(data.smsTemplates);
      if (data.blacklist) await apiRequest('save_blacklist', 'POST', data.blacklist);
      return true;
    } catch (e) {
      console.error("Import Error:", e);
      return false;
    }
  }
};