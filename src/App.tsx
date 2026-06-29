import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, Globe, Server, Terminal, ShieldAlert, Settings, Wifi, Code, Database, LogOut, Bell, Languages, Check, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Subscription, Upstream, LocalDNS, QueryLog, IpMonitor, DoHSettings, AuditLog, Notification } from './types';
import { translations, Language } from './data/translations';

// Components
import Login from './components/Login.js';
import DashboardOverview from './components/DashboardOverview.js';
import UsersTab from './components/UsersTab.js';
import UpstreamsTab from './components/UpstreamsTab.js';
import LocalDnsTab from './components/LocalDnsTab.js';
import LogsTab from './components/LogsTab.js';
import IpMonitorTab from './components/IpMonitorTab.js';
import SettingsTab from './components/SettingsTab.js';
import PingToolTab from './components/PingToolTab.js';
import WorkerGeneratorTab from './components/WorkerGeneratorTab.js';
import SystemUtilityTab from './components/SystemUtilityTab.js';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Database States
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [upstreams, setUpstreams] = useState<Upstream[]>([]);
  const [localDns, setLocalDns] = useState<LocalDNS[]>([]);
  const [logs, setLogs] = useState<QueryLog[]>([]);
  const [monitors, setMonitors] = useState<IpMonitor[]>([]);
  const [settings, setSettings] = useState<DoHSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check login on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Fetch full data if logged in
  useEffect(() => {
    if (loggedInUser) {
      fetchAllData();
    }
  }, [loggedInUser]);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.loggedIn) {
        setLoggedInUser(data.user);
      }
    } catch (err) {
      console.error('Session check failed', err);
    } finally {
      setLoadingSession(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [
        statsRes, usersRes, subRes, upsRes, localRes, logsRes, ipRes, setRes, auditRes, notifRes
      ] = await Promise.all([
        fetch('/api/statistics').then(r => r.json()),
        fetch('/api/users').then(r => r.json()),
        fetch('/api/subscriptions').then(r => r.json()),
        fetch('/api/upstreams').then(r => r.json()),
        fetch('/api/local-dns').then(r => r.json()),
        fetch('/api/logs').then(r => r.json()),
        fetch('/api/ip-monitors').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json())
      ]);

      setStats(statsRes);
      setUsers(usersRes);
      setSubscriptions(subRes);
      setUpstreams(upsRes);
      setLocalDns(localRes);
      setLogs(logsRes);
      setMonitors(ipRes);
      setSettings(setRes);
      setAuditLogs(auditRes);
      setNotifications(notifRes);
    } catch (err) {
      console.error('Error fetching dashboard states', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setLoggedInUser(null);
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAllNotif = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      fetchAllData();
      setShowNotifications(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono tracking-widest text-slate-400">LOADING PICKO CONSOLE SESSION...</p>
        </div>
      </div>
    );
  }

  if (!loggedInUser) {
    return <Login onLoginSuccess={(u) => setLoggedInUser(u)} lang={lang} />;
  }

  const t = translations[lang];
  const isRtl = lang === 'fa';
  const unreadNotifs = notifications.filter(n => !n.read);

  // Sidebar Menu Tabs Configuration
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: Activity },
    { id: 'users', label: t.users, icon: Users },
    { id: 'upstreams', label: t.upstreams, icon: Globe },
    { id: 'localDns', label: t.localDns, icon: Server },
    { id: 'logs', label: t.liveLogs, icon: Terminal },
    { id: 'ipMonitor', label: t.ipMonitor, icon: ShieldAlert },
    { id: 'settings', label: t.settings, icon: Settings },
    { id: 'pingTool', label: t.pingTool, icon: Wifi },
    { id: 'workerGen', label: t.workerGen, icon: Code },
    { id: 'system', label: t.system, icon: Database }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-blue-500 selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar navigation */}
      <aside className={`w-full md:w-64 bg-slate-900 text-slate-300 border-slate-800 flex flex-col shrink-0 ${isRtl ? 'md:border-l' : 'md:border-r'}`}>
        {/* Brand logo header */}
        <div className="px-6 py-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight leading-none uppercase">{t.title}</h1>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">{t.subtitle}</span>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setShowNotifications(false); }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Card with logout */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between gap-2.5">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{loggedInUser.name}</p>
            <span className="text-[10px] text-slate-500 font-mono truncate block mt-0.5">{loggedInUser.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-400 transition"
            title={t.logout}
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top bar header */}
        <header className="bg-white border-b border-slate-200/80 h-16 px-6 flex items-center justify-between z-30 select-none">
          {/* Active page title */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          {/* Right quick controls */}
          <div className="flex items-center gap-3 relative">
            
            {/* Language Localizer Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
              title="Change Language / RTL Mode"
            >
              <Languages className="w-4 h-4 text-slate-400" />
              <span>{lang === 'en' ? 'Farsi (FA)' : 'English (EN)'}</span>
            </button>

            {/* Notifications Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Overlay list */}
              {showNotifications && (
                <div className={`absolute top-12 ${isRtl ? 'left-0' : 'right-0'} w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden`}>
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{t.notification}</span>
                    {unreadNotifs.length > 0 && (
                      <button 
                        onClick={handleReadAllNotif}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        {isRtl ? 'خوانده شده همه' : 'Mark all read'}
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 text-xs text-slate-600 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 font-medium">No alerts registered.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 hover:bg-slate-50 transition flex gap-2.5 items-start ${!n.read ? 'bg-blue-50/20' : ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                            n.type === 'danger' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}></span>
                          <div className="flex-1">
                            <p className="leading-normal">{n.message}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{new Date(n.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Core content Viewstage container */}
        <section className="flex-1 p-6 md:p-8 overflow-y-auto select-text">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardOverview stats={stats} t={t} lang={lang} />
              )}

              {activeTab === 'users' && (
                <UsersTab 
                  users={users} 
                  subscriptions={subscriptions} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}

              {activeTab === 'upstreams' && (
                <UpstreamsTab 
                  upstreams={upstreams} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}

              {activeTab === 'localDns' && (
                <LocalDnsTab 
                  localDns={localDns} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}

              {activeTab === 'logs' && (
                <LogsTab 
                  logs={logs} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}

              {activeTab === 'ipMonitor' && (
                <IpMonitorTab 
                  monitors={monitors} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab 
                  settings={settings} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}

              {activeTab === 'pingTool' && (
                <PingToolTab 
                  subscriptions={subscriptions} 
                  users={users} 
                  t={t} 
                  lang={lang} 
                />
              )}

              {activeTab === 'workerGen' && (
                <WorkerGeneratorTab 
                  t={t} 
                  lang={lang} 
                />
              )}

              {activeTab === 'system' && (
                <SystemUtilityTab 
                  auditLogs={auditLogs} 
                  notifications={notifications} 
                  t={t} 
                  lang={lang} 
                  onRefresh={fetchAllData} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
    </div>
  );
}
