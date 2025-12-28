
import { StaffUser, Role, PermissionSlug, AuditLog } from '../types';
import { db } from './db';

export const authService = {
  // Hash password using SHA-256 with strict empty check
  hashPassword: async (password: string): Promise<string> => {
    if (!password || password.trim().length === 0) {
      // Return a special non-matching string if password is empty
      return "INVALID_EMPTY_PASSWORD_HASH";
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  },

  getCurrentUser: (): StaffUser | null => {
    const userJson = localStorage.getItem('nexus_admin_user');
    if (!userJson || userJson === 'undefined' || userJson === 'null') return null;
    try {
      const user = JSON.parse(userJson);
      // Extra check: If user object is missing mandatory fields, treat as unauthenticated
      if (!user || !user.id || !user.email) return null;
      return user;
    } catch (e) {
      console.error("Error parsing current user:", e);
      return null;
    }
  },

  // Changed to async to support asynchronous role fetching from server
  can: async (permission: PermissionSlug): Promise<boolean> => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    // Check if session flag is explicitly true
    if (localStorage.getItem('admin_authenticated') !== 'true') return false;
    
    // Master Access Override
    if (user.email === 'admin@nisbimart.com') return true;

    // Await the roles fetch from persistence engine
    const allRoles = await db.getRoles();
    const userRoles = allRoles.filter(r => user.roleIds.includes(r.id));
    
    // Super Admin check via slug
    if (userRoles.some(r => r.slug === 'super-admin')) return true;

    const permissions = new Set<PermissionSlug>();
    userRoles.forEach(role => role.permissions.forEach(p => permissions.add(p)));
    
    return permissions.has(permission);
  },

  logAction: (action: string, entity: string, entityId?: string, metadata?: any) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const log: AuditLog = {
      id: `LOG-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      metadata
    };

    const logs = JSON.parse(localStorage.getItem('nexus_audit_logs') || '[]');
    logs.unshift(log);
    localStorage.setItem('nexus_audit_logs', JSON.stringify(logs.slice(0, 1000)));
  }
};
