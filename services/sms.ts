
import { Order, OrderStatus, SmsLog, SmsTemplate } from '../types';
import { db } from './db';

export const smsService = {
  parseTemplate: (template: string, order: Order): string => {
    let content = template;
    content = content.replace(/{{name}}/g, order.customerName);
    content = content.replace(/{{order_id}}/g, order.id);
    content = content.replace(/{{total}}/g, `৳${order.total.toFixed(2)}`);
    content = content.replace(/{{tracking_url}}/g, order.trackingUrl || 'N/A');
    content = content.replace(/{{tracking_number}}/g, order.trackingNumber);
    return content;
  },

  sendSms: async (phoneNumber: string, content: string, orderId?: string) => {
    // Added await to resolve the async database calls
    const config = await db.getSmsConfig();
    const blacklist = await db.getBlacklist();

    if (blacklist.includes(phoneNumber)) {
      console.warn(`[SMS] Blocked attempt to blacklisted number: ${phoneNumber}`);
      return { success: false, reason: 'Blacklisted' };
    }

    if (config.balance <= 0) {
      return { success: false, reason: 'Insufficient Balance' };
    }

    // Simulate API Call
    console.log(`[SMS] Dispatching to ${phoneNumber}: "${content}"`);
    
    const log: SmsLog = {
      id: `SMS-${Math.floor(Math.random() * 900000 + 100000)}`,
      phoneNumber,
      content,
      status: 'SENT',
      gatewayResponse: '200 OK - Message Accepted',
      timestamp: new Date().toISOString(),
      cost: config.costPerSms,
      orderId
    };

    db.saveSmsLog(log);
    
    // Update balance
    config.balance -= config.costPerSms;
    await db.saveSmsConfig(config);

    return { success: true, logId: log.id };
  },

  triggerStatusSms: async (order: Order) => {
    // Added await to resolve the async template fetch
    const templates = await db.getSmsTemplates();
    const template = templates.find(t => t.triggerStatus === order.status && t.isActive);
    
    if (template) {
      const parsedContent = smsService.parseTemplate(template.content, order);
      return await smsService.sendSms(order.customerPhone, parsedContent, order.id);
    }
  }
};
