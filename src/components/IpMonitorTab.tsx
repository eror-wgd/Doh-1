import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Search, ShieldX, HelpCircle, AlertCircle, Trash2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { IpMonitor } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface IpMonitorTabProps {
  monitors: IpMonitor[];
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function IpMonitorTab({ monitors, t, lang, onRefresh }: IpMonitorTabProps) {
  const [search, setSearch] = useState('');

  const filtered = monitors.filter(m => {
    const q = search.toLowerCase();
    return m.currentIp.includes(q) || m.subscriptionId.toLowerCase().includes(q) || m.city.toLowerCase().includes(q);
  });

  const handleUpdateStatus = async (id: string, status: 'allowed' | 'blocked' | 'whitelisted') => {
    try {
      await fetch(`/api/ip-monitors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Overview Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search IPs, subscription ID, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-sm"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {isRtl ? 'ثبت و پایش رفتارهای جغرافیایی اشتراک‌ها جهت پیشگیری از ابیوز' : 'Real-time client telemetry to prevent unauthorized profile distribution.'}
        </div>
      </div>

      {/* Main IP Table list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
                <th className="px-6 py-4">Subscription ID</th>
                <th className="px-6 py-4">Current Client IP</th>
                <th className="px-6 py-4">Geographic Details</th>
                <th className="px-6 py-4 text-center">Devices</th>
                <th className="px-6 py-4 text-center">Access Status</th>
                <th className="px-6 py-4 text-center">Security Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No connected clients currently tracked in security logs.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const isBlocked = m.status === 'blocked';
                  const isWhitelisted = m.status === 'whitelisted';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Subscription */}
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">
                        {m.subscriptionId}
                      </td>

                      {/* IP Addresses */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-mono font-bold text-slate-900">{m.currentIp}</p>
                          {m.previousIps.length > 0 && (
                            <p className="text-[10px] text-slate-400 font-mono">
                              Prev: {m.previousIps.join(', ')}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Geo Detail */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 text-xs">
                          <p className="font-semibold text-slate-800">{m.city}, {m.country}</p>
                          <p className="text-slate-400 block font-mono text-[10px]">{m.asn}</p>
                        </div>
                      </td>

                      {/* Device Count */}
                      <td className="px-6 py-4 text-center font-bold text-slate-900 font-mono">
                        {m.deviceCount}
                      </td>

                      {/* Access Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isBlocked 
                            ? 'bg-rose-50 text-rose-600' 
                            : isWhitelisted 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isBlocked ? (
                            <>
                              <ShieldX className="w-3.5 h-3.5" />
                              Blocked
                            </>
                          ) : isWhitelisted ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Whitelisted
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Allowed
                            </>
                          )}
                        </span>
                      </td>

                      {/* Controls */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Allow */}
                          {!isWhitelisted && m.status !== 'allowed' && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'allowed')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold transition"
                            >
                              Allow IP
                            </button>
                          )}

                          {/* Block */}
                          {!isBlocked && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'blocked')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
                            >
                              Block IP
                            </button>
                          )}

                          {/* Whitelist */}
                          {!isWhitelisted && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'whitelisted')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition"
                            >
                              Whitelist
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
