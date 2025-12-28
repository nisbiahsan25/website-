
import { TrackingEvent } from '../types';

export const trackEvent = async (
  eventName: TrackingEvent['eventName'],
  data: any = {}
) => {
  const utm = JSON.parse(localStorage.getItem('nexus_utm') || '{}');
  
  const event: TrackingEvent = {
    id: Math.random().toString(36).substr(2, 9),
    eventName,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    data: { ...data, ...utm },
    userMetadata: {
      ip: '127.0.0.1', // Simulated
      userAgent: navigator.userAgent,
      // Added missing deviceId
      deviceId: 'sim-device-' + Math.random().toString(36).substr(2, 5),
      fbc: utm.fbclid ? `fb.1.${Date.now()}.${utm.fbclid}` : undefined,
      fbp: `fb.1.${Date.now()}.${Math.floor(Math.random() * 1000000000)}`,
    }
  };

  // 1. Simulate Browser Pixel Fire
  console.log(`[PIXEL] Firing ${eventName}:`, event);

  // 2. Simulate Server-Side CAPI Fire
  try {
    // In production, this would call a Node.js backend which proxies to Meta/Google APIs
    console.log(`[CAPI] Sending ${eventName} to server...`);
    // Example: await fetch('/api/tracking/capi', { method: 'POST', body: JSON.stringify(event) });
  } catch (err) {
    console.error('CAPI Fail:', err);
  }

  // 3. Store event locally for session tracking
  const history = JSON.parse(localStorage.getItem('nexus_tracking_history') || '[]');
  history.push(event);
  localStorage.setItem('nexus_tracking_history', JSON.stringify(history.slice(-50)));
};
