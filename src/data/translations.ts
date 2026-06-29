export const translations = {
  en: {
    title: 'PICKO DoH Service',
    subtitle: 'DNS over HTTPS Management Console',
    dashboard: 'Dashboard',
    users: 'Users & Subscriptions',
    upstreams: 'Upstream DNS',
    localDns: 'Local DNS Bypass',
    liveLogs: 'Live Query Logs',
    ipMonitor: 'IP Monitoring',
    settings: 'DoH Settings',
    pingTool: 'Ping Diagnostics',
    workerGen: 'Worker Generator',
    system: 'Database & Audits',
    
    // Stats Cards
    activeUsers: 'Active Subscriptions',
    expiredUsers: 'Expired Profiles',
    todayTraffic: 'Traffic Today',
    monthTraffic: 'Traffic This Month',
    queriesToday: 'Queries Today',
    queriesMonth: 'Total Queries Logged',
    onlineUsers: 'Online Resolvers',
    systemHealth: 'Worker Health',

    // User Table
    searchUser: 'Search name, email...',
    addUser: 'Create Subscriber',
    name: 'Name',
    email: 'Email',
    status: 'Status',
    expiration: 'Expiration',
    trafficUsed: 'Traffic Used',
    actions: 'Actions',
    suspend: 'Suspend',
    activate: 'Activate',
    notes: 'Internal Notes',
    unlimited: 'Unlimited',
    renew: 'Renew 30 Days',
    resetTraffic: 'Reset Bandwidth',

    // Upstream DNS
    addUpstream: 'Add Upstream Provider',
    address: 'DNS Server IP',
    priority: 'Priority',
    latency: 'Latency',
    health: 'Health Status',

    // Local DNS
    hostname: 'Hostname / Domain',
    ipAddress: 'Target IP Address',
    addRule: 'Add Local Bypass Rule',

    // Settings
    endpointUrl: 'Endpoint Base URL',
    path: 'DNS Path Pattern',
    cacheTtl: 'Cache Default TTL (sec)',
    minTtl: 'Minimum Override TTL',
    dnssec: 'Enforce DNSSEC Verification',
    edns: 'Enable EDNS Client Subnet (ECS)',
    rateLimit: 'Client Rate Limit (req/min)',
    save: 'Apply Configurations',

    // Audit Logs
    auditLog: 'System Audit Logs',
    notification: 'System Alerts',

    // General
    logout: 'Logout',
    en: 'English',
    fa: 'فارسی',
    all: 'All',
    search: 'Search',
    close: 'Close',
    export: 'Export Backup',
    restore: 'Restore Database',
    downloadWorker: 'Copy worker.js Deployment Code',
    loading: 'Processing application request...'
  },
  fa: {
    title: 'سرویس پیکو DoH',
    subtitle: 'کنسول مدیریت دی‌ان‌اس بر بستر HTTPS',
    dashboard: 'داشبورد نظارت',
    users: 'کاربران و اشتراک‌ها',
    upstreams: 'دی‌ان‌اس‌های بالادستی',
    localDns: 'مسیرهای محلی',
    liveLogs: 'گزارش‌های زنده',
    ipMonitor: 'مانیتورینگ آی‌پی',
    settings: 'تنظیمات DoH',
    pingTool: 'ابزار تست پینگ',
    workerGen: 'خروجی ورکر کلادفلر',
    system: 'پشتیبان‌گیری و رویدادها',
    
    // Stats Cards
    activeUsers: 'کاربران فعال',
    expiredUsers: 'اشتراک‌های منقضی شده',
    todayTraffic: 'ترافیک امروز',
    monthTraffic: 'ترافیک ماه جاری',
    queriesToday: 'پرس‌وجوهای امروز',
    queriesMonth: 'کل پرس‌وجوهای ثبت‌شده',
    onlineUsers: 'اتصال‌های همزمان زنده',
    systemHealth: 'وضعیت سلامت ورکر',

    // User Table
    searchUser: 'جستجو نام، ایمیل...',
    addUser: 'ایجاد مشترک جدید',
    name: 'نام کاربر',
    email: 'ایمیل / شناسه',
    status: 'وضعیت',
    expiration: 'تاریخ انقضا',
    trafficUsed: 'ترافیک مصرفی',
    actions: 'عملیات',
    suspend: 'تعلیق',
    activate: 'فعال‌سازی',
    notes: 'یادداشت‌های داخلی',
    unlimited: 'نامحدود',
    renew: 'تمدید ۳۰ روزه',
    resetTraffic: 'صفر کردن ترافیک',

    // Upstream DNS
    addUpstream: 'افزودن سرور بالادستی جدید',
    address: 'آی‌پی سرور دی‌ان‌اس',
    priority: 'اولویت',
    latency: 'تاخیر (میلی‌ثانیه)',
    health: 'وضعیت سلامت',

    // Local DNS
    hostname: 'نام دامنه / هافست‌نیم',
    ipAddress: 'آدرس آی‌پی هدف',
    addRule: 'افزودن میانبر محلی',

    // Settings
    endpointUrl: 'آدرس انتهای مسیر (Endpoint)',
    path: 'الگوی مسیر دی‌ان‌اس',
    cacheTtl: 'حافظه کش پیش‌فرض (ثانیه)',
    minTtl: 'حداقل اورراید TTL',
    dnssec: 'اجبار به احراز هویت DNSSEC',
    edns: 'فعال‌سازی EDNS Client Subnet',
    rateLimit: 'حد مجاز نرخ درخواست (دقیقه)',
    save: 'ذخیره تنظیمات سیستم',

    // Audit Logs
    auditLog: 'گزارش‌های امنیتی سیستم',
    notification: 'هشدارهای زنده سیستم',

    // General
    logout: 'خروج',
    en: 'English',
    fa: 'فارسی',
    all: 'همه',
    search: 'جستجو',
    close: 'بستن',
    export: 'دانلود فایل پشتیبان',
    restore: 'بازیابی پایگاه داده',
    downloadWorker: 'کپی کد خروجی worker.js',
    loading: 'در حال پردازش درخواست...'
  }
};
export type Language = 'en' | 'fa';
export type TranslationKey = keyof typeof translations.en;
export type TranslationKeys = typeof translations.en;
