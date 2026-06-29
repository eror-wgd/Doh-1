import React from 'react';
import { 
  Users, AlertTriangle, Activity, Database, ArrowUpRight, CheckCircle2, Cpu, HardDrive, Clock, ShieldAlert 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, TranslationKeys } from '../data/translations';

interface DashboardOverviewProps {
  stats: any;
  t: TranslationKeys;
  lang: Language;
}

export default function DashboardOverview({ stats, t, lang }: DashboardOverviewProps) {
  if (!stats) return (
    <div className="flex items-center justify-center p-12 h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Safe destructuring with fallbacks
  const activeUsers = stats.activeUsers ?? 0;
  const expiredUsers = stats.expiredUsers ?? 0;
  const onlineUsers = stats.onlineUsers ?? 0;
  const todayQueries = stats.todayQueries ?? 0;
  const totalQueries = stats.totalQueries ?? 0;
  const blockedQueries = stats.blockedQueries ?? 0;
  const avgResponseTime = stats.avgResponseTime ?? 0;
  const totalTrafficBytes = stats.totalTrafficBytes ?? 0;
  const trafficTodayBytes = stats.trafficTodayBytes ?? 0;
  const countryStats = stats.countryStats ?? [];
  const domainStats = stats.domainStats ?? [];
  const clientStats = stats.clientStats ?? [];
  const timelineData = stats.timelineData ?? [];
  const sys = stats.systemMetrics ?? { cpu: '0%', memory: '0 MB', requests: '0 req/s', errors: '0%' };

  // Calculate coordinates for custom SVG Chart
  // We have a 24-hour timeline. Chart width is 600, height is 160.
  const chartWidth = 600;
  const chartHeight = 160;
  const maxVal = Math.max(...timelineData.map((d: any) => d.total), 10);
  const paddingX = 40;
  const paddingY = 20;

  const points = timelineData.map((d: any, index: number) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (timelineData.length - 1 || 1);
    const y = chartHeight - paddingY - (d.total * (chartHeight - paddingY * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  const blockedPoints = timelineData.map((d: any, index: number) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (timelineData.length - 1 || 1);
    const y = chartHeight - paddingY - (d.blocked * (chartHeight - paddingY * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Active Subscriptions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.activeUsers}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">{activeUsers}</h3>
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-emerald-500 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> {onlineUsers}
            </span>
            <span>{isRtl ? 'کاربر هم‌اکنون فعال (در حال حل دامنه)' : 'resolvers active right now'}</span>
          </div>
        </div>

        {/* Card 2: Today Queries */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.queriesToday}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">{todayQueries}</h3>
            </div>
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-indigo-600 font-mono">
              {((todayQueries / (totalQueries || 1)) * 100).toFixed(1)}%
            </span>
            <span>{isRtl ? 'کل پرس‌وجوهای ثبت شده در دیتابیس' : 'of cumulative query history'}</span>
          </div>
        </div>

        {/* Card 3: Today's Traffic */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.todayTraffic}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">{formatBytes(trafficTodayBytes)}</h3>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{isRtl ? 'حجم کل مصرفی ماه:' : 'Total Month:'}</span>
            <span className="font-mono text-slate-600">{formatBytes(totalTrafficBytes)}</span>
          </div>
        </div>

        {/* Card 4: Blocked Ad Queries */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked Queries</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">{blockedQueries}</h3>
            </div>
            <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-rose-600 font-mono">
              {((blockedQueries / (totalQueries || 1)) * 100).toFixed(1)}%
            </span>
            <span>{isRtl ? 'نرخ بلاک تبلیغات و ردیاب‌های آلوده' : 'overall tracker/ad blocking rate'}</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Performance section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Chart Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-900">{isRtl ? 'نمودار ترافیک ۲۴ ساعت گذشته' : 'Real-Time Hourly Resolver load'}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{isRtl ? 'آمار کل درخواست‌ها و تبلیغات بلاک شده' : 'Overview of total vs filtered queries'}</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                {isRtl ? 'کل درخواست‌ها' : 'Total Queries'}
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-3 h-3 bg-rose-400 rounded-full"></span>
                {isRtl ? 'مسدود شده (تبلیغات)' : 'Blocked Tracker/Ads'}
              </span>
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="relative w-full aspect-[21/9] min-h-[200px] overflow-visible">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible select-none">
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeWidth="1" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth="1" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x={paddingX - 10} y={paddingY + 4} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">{maxVal}</text>
              <text x={paddingX - 10} y={chartHeight / 2 + 4} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">{Math.floor(maxVal / 2)}</text>
              <text x={paddingX - 10} y={chartHeight - paddingY + 4} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">0</text>

              {/* Total Queries Area & Line */}
              <path
                d={`M ${paddingX},${chartHeight - paddingY} L ${points} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`}
                fill="url(#totalGrad)"
              />
              <path
                d={`M ${points}`}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Blocked Queries Area & Line */}
              <path
                d={`M ${paddingX},${chartHeight - paddingY} L ${blockedPoints} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`}
                fill="url(#blockedGrad)"
              />
              <path
                d={`M ${blockedPoints}`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 2"
              />

              {/* X Axis Labels (Timeline) */}
              {timelineData.map((d: any, i: number) => {
                if (i % 4 !== 0) return null;
                const x = paddingX + (i * (chartWidth - paddingX * 2)) / (timelineData.length - 1 || 1);
                return (
                  <text key={i} x={x} y={chartHeight - 4} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    {d.time}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* System performance stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">{isRtl ? 'وضعیت سلامت سرور و ورکر' : 'Server & Worker performance'}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{isRtl ? 'بارگذاری لحظه‌ای منابع در دیتاسنتر کلادفلر' : 'Live hardware performance indices'}</p>
          </div>

          <div className="space-y-4 my-6">
            {/* CPU */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  {isRtl ? 'میزان مصرف پردازنده (CPU)' : 'Cloudflare CPU Compute'}
                </span>
                <span className="font-mono text-slate-900 font-semibold">{sys.cpu}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: sys.cpu }}></div>
              </div>
            </div>

            {/* Memory */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  {isRtl ? 'حافظه در دسترس (RAM)' : 'Sandbox Memory Heap'}
                </span>
                <span className="font-mono text-slate-900 font-semibold">{sys.memory.split('/')[0]}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>

            {/* Query Latency */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {isRtl ? 'میانگین تاخیر حل دی‌ان‌اس' : 'Avg Resolve Latency'}
                </span>
                <span className="font-mono text-slate-900 font-semibold">{avgResponseTime.toFixed(1)} ms</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(avgResponseTime, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{isRtl ? 'نرخ درخواست ثانیه' : 'Req Speed'}</p>
              <p className="text-sm font-bold text-slate-800 font-mono mt-1">{sys.requests}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{isRtl ? 'نرخ خطای ورکر' : 'Worker Failures'}</p>
              <p className="text-sm font-bold text-emerald-600 font-mono mt-1">{sys.errors}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Bento Bottom Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Box 1: Most Active Subscribers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>{isRtl ? 'پر مصرف‌ترین مشترکین' : 'Most Active Users'}</span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold font-mono">Top 5</span>
          </h5>
          <div className="space-y-3.5">
            {clientStats.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                <div className="truncate max-w-[180px]">
                  <p className="font-semibold text-slate-800 truncate">{item.name.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.name}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                    {item.value} queries
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Top Queried Domains */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>{isRtl ? 'پر تکرارترین دامنه‌ها' : 'Most Queried Domains'}</span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold font-mono">Requests</span>
          </h5>
          <div className="space-y-3.5">
            {domainStats.map((item: any, i: number) => {
              const isAd = item.name.includes('doubleclick') || item.name.includes('adservice') || item.name.includes('analytics');
              return (
                <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div className="truncate max-w-[180px]">
                    <span className="font-mono text-slate-800 truncate block">{item.name}</span>
                    {isAd && (
                      <span className="text-[9px] bg-rose-50 text-rose-500 font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        Tracker/Filter Match
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-slate-700">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 3: Country Statistics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>{isRtl ? 'آمار موقعیت جغرافیایی' : 'Country Distribution'}</span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold font-mono">GeoIP</span>
          </h5>
          <div className="space-y-3">
            {countryStats.slice(0, 5).map((item: any, i: number) => {
              const percentage = Math.round((item.value / totalQueries) * 100) || 5;
              return (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-[9px]">{item.name}</span>
                      {item.name === 'IR' ? 'Iran' : item.name === 'US' ? 'United States' : item.name === 'DE' ? 'Germany' : item.name === 'GB' ? 'United Kingdom' : 'Europe'}
                    </span>
                    <span className="font-mono text-slate-500">{item.value} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
