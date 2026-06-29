export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended' | 'expired';
  notes: string;
  isOnline: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  expirationDate: string; // ISO date string or "unlimited"
  trafficLimit: number; // in GB, or -1 for unlimited
  unlimitedTraffic: boolean;
  unlimitedTime: boolean;
  dailyUsageLimit: number; // in GB, or -1 for unlimited
  concurrentIpLimit: number;
  concurrentDeviceLimit: number;
  maxConnectedUsers: number;
  bandwidthUsed: number; // in bytes
  dailyBandwidthUsed: number; // in bytes
  remainingBandwidth: number; // in bytes, -1 for unlimited
  remainingDays: number; // -1 for unlimited
  lastResetDate: string;
}

export interface Upstream {
  id: string;
  name: string;
  address: string;
  enabled: boolean;
  priority: number;
  latency: number; // in ms
  health: 'healthy' | 'unhealthy';
}

export interface LocalDNS {
  id: string;
  hostname: string;
  ipAddress: string;
  enabled: boolean;
  priority: number;
}

export interface QueryLog {
  id: string;
  timestamp: string;
  query: string; // hostname
  type: string; // A, AAAA, MX, TXT, etc.
  responseCode: string; // NOERROR, NXDOMAIN, etc.
  latency: number; // ms
  clientIp: string;
  user: string; // username/email
  country: string;
  asn: string;
  protocol: 'UDP' | 'TCP' | 'DoH';
  ipv6: boolean;
}

export interface IpMonitor {
  id: string;
  subscriptionId: string;
  currentIp: string;
  previousIps: string[];
  country: string;
  asn: string;
  city: string;
  deviceCount: number;
  status: 'allowed' | 'blocked' | 'whitelisted';
}

export interface DoHSettings {
  endpoint: string;
  customPath: string;
  port: number;
  cacheTtl: number;
  minTtl: number;
  maxTtl: number;
  dnssec: boolean;
  edns: boolean;
  userAgent: string;
  timeout: number;
  retries: number;
  compression: boolean;
  cors: boolean;
  rateLimit: number; // req/min
  cacheControl: string;
  ipv6Enabled: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  status: 'success' | 'failure' | 'warning' | 'info';
  ip: string;
}

export interface Notification {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  message: string;
  read: boolean;
}
