
export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PROCESSING = 'Processing',
  PACKED = 'Packed',
  SHIPPED = 'Shipped',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  RETURNED = 'Returned',
  CANCELLED = 'Cancelled'
}

export enum BlockType {
  HERO = 'HERO',
  PRODUCT_GRID = 'PRODUCT_GRID',
  FLASH_SALE = 'FLASH_SALE',
  IMAGE_TEXT = 'IMAGE_TEXT',
  COUNTDOWN = 'COUNTDOWN',
  TESTIMONIALS = 'TESTIMONIALS',
  NEWSLETTER = 'NEWSLETTER',
  VENDOR_LIST = 'VENDOR_LIST',
  B2B_BANNER = 'B2B_BANNER'
}

export interface Section {
  id: string;
  type: BlockType;
  order: number;
  isActive: boolean;
  config: any;
  abVariant?: 'A' | 'B';
  analytics?: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  status: 'Published' | 'Draft';
  type: 'Home' | 'Campaign' | 'Landing' | 'Category' | 'B2B';
  seo: {
    title: string;
    description: string;
  };
  tracking: {
    fbPixelId?: string;
    capiEvent?: string;
  };
  sections: Section[];
  createdAt: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface TrackingHistoryEntry {
  status: string;
  location: string;
  timestamp: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  commissionRate: number;
  status: 'Active' | 'Suspended';
}

export interface ProductSpecification {
  group: string;
  items: { label: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  vendorId: string;
  status: 'Active' | 'Draft';
  description: string;
  shortDescription?: string;
  features?: string[];
  specifications?: ProductSpecification[];
  price: number;
  salePrice?: number;
  cost: number;
  wholesalePrice?: number;
  minOrderQuantity?: number;
  subscriptionPrice?: number;
  category: string;
  images: string[];
  videoUrl?: string;
  stock: number;
  lowStockAlert: number;
  trackInventory: boolean;
  weight: number;
  shippingInsideCity: number;
  shippingOutsideCity: number;
  codAvailable: boolean;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  fbProductId?: string;
  googleProductId?: string;
  pixelEventCategory?: string;
  tags?: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  hasVariations: boolean;
  variations?: ProductVariation[];
  loyaltyPoints?: number;
  emiMonths?: number;
}

export interface CartItem extends Product {
  quantity: number;
  purchaseType: 'OneTime' | 'Subscription' | 'Wholesale';
}

export interface OrderCost {
  revenue: number;
  cogs: number;
  shipping: number;
  marketing: number;
  vendorPayout: number;
  affiliateCommission: number;
  taxAmount: number;
  profit: number;
}

export interface Affiliate {
  id: string;
  name: string;
  code: string;
  balance: number;
  totalEarned: number;
  status: 'Active' | 'Pending';
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  affiliateId?: string;
  items: CartItem[];
  total: number;
  currency: 'BDT' | 'USD';
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  trackingHistory?: TrackingHistoryEntry[];
  createdAt: string;
  trackingNumber: string;
  carrier?: string;
  trackingUrl?: string;
  costDetails: OrderCost;
  adSource?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    fbclid?: string;
    gclid?: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentType: 'COD' | 'bKash' | 'Stripe' | 'SSLCommerz';
  invoiceUrl?: string;
}

export interface TrackingEvent {
  id: string;
  eventName: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Lead' | 'Search' | 'Contact';
  timestamp: string;
  url: string;
  data: any;
  userMetadata: {
    ip: string;
    userAgent: string;
    deviceId: string;
    fbc?: string;
    fbp?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface SmsConfig {
  provider: string;
  apiKey: string;
  senderId: string;
  balance: number;
  apiUrl: string;
  costPerSms: number;
}

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  triggerStatus: OrderStatus;
  isActive: boolean;
}

export interface SmsLog {
  id: string;
  phoneNumber: string;
  content: string;
  status: 'SENT' | 'FAILED';
  gatewayResponse: string;
  timestamp: string;
  cost: number;
  orderId?: string;
}

export type PermissionSlug = 
  | 'orders.view' | 'orders.edit' | 'orders.cancel' | 'orders.assign'
  | 'products.add' | 'products.edit' | 'products.delete' | 'products.inventory'
  | 'customers.view' | 'customers.edit' | 'customers.block'
  | 'marketing.view' | 'marketing.manage' | 'marketing.reports'
  | 'finance.view' | 'finance.profit' | 'finance.refunds'
  | 'vendor.manage' | 'affiliate.manage' | 'subscription.manage'
  | 'system.users' | 'system.roles' | 'system.logs' | 'system.settings';

export interface Role {
  id: string;
  name: string;
  slug: string;
  permissions: PermissionSlug[];
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  passwordHash?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  timestamp: string;
  metadata?: any;
}

export interface BIHeatmapData {
  region: string;
  lat: number;
  lng: number;
  value: number;
}
