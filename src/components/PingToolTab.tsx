import React, { useState } from 'react';
import { 
  Activity, Play, CheckCircle2, AlertTriangle, RefreshCw, Server, ShieldCheck, Wifi, WifiOff 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Subscription, User } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface PingToolTabProps {
  subscriptions: Subscription[];
  users: User[];
  t: TranslationKeys;
  lang: Language;
}

export default function PingToolTab({ subscriptions, users, t, lang }: PingToolTabProps) {
  const [selectedSubId, setSelectedSubId] = useState(subscriptions[0]?.id || '');
  const [pingResult, setPingResult] = useState<any | null>(null);
  const [pinging, setPinging] = useState(false);

  const activeSubs = subscriptions.filter(s => {
    const u = users.find(usr => usr.id === s.userId);
    return u && u.status === 'active';
  });

  const handlePing = async () => {
    if (!selectedSubId) return;
    setPinging(true);
    setPingResult(null);

    try {
      const response = await fetch(`/api/ping/${selectedSubId}`);
      const data = await response.json();
      
      // Simulate slow response network effect
      setTimeout(() => {
        setPingResult(data);
        setPinging(false);
      }, 1200);

    } catch (err) {
      console.error(err);
      setPinging(false);
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Selector Dashboard Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-900">{isRtl ? 'انتخاب اشتراک جهت عیب‌یابی' : 'Profile Diagnostics Selector'}</h4>
            <p className="text-xs text-slate-400 mt-1">Select an active profile and initiate real-time link latency testing.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase">Target Subscription</label>
            <select
              value={selectedSubId}
              onChange={(e) => { setSelectedSubId(e.target.value); setPingResult(null); }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none"
            >
              {activeSubs.map(s => {
                const u = users.find(usr => usr.id === s.userId);
                return (
                  <option key={s.id} value={s.id}>
                    {u?.name} ({s.id})
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handlePing}
            disabled={pinging || !selectedSubId}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition"
          >
            {pinging ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Pinging subscriber link...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Trigger Connection Diagnostics
              </>
            )}
          </button>
        </div>

        {/* Right diagnostic screen */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">Edge Telemetry Terminal</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            </div>

            <div className="mt-4 font-mono text-xs space-y-2">
              <p className="text-slate-500">&gt; pickodoh-ping-diagnostics --target={selectedSubId || 'null'}</p>
              {pinging && (
                <p className="text-slate-300 animate-pulse">&gt; Transmitting 64 bytes to Cloudflare edge edge-ingress-02...</p>
              )}
              
              {!pinging && !pingResult && (
                <p className="text-slate-400">Idle. Select a profile above and click ping to initiate socket testing.</p>
              )}

              {pingResult && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="space-y-3 pt-2"
                >
                  <div className="flex items-center gap-2">
                    {pingResult.packetLoss > 10 ? (
                      <WifiOff className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : (
                      <Wifi className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-200">
                      Response: {pingResult.packetLoss > 10 ? 'Connection Degraded' : 'Active and Healthy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl mt-3 text-slate-300">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">RTT Latency</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1 font-mono">{pingResult.latency} ms</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Packet Loss</p>
                      <p className="text-sm font-bold text-rose-400 mt-1 font-mono">{pingResult.packetLoss}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Status Check</p>
                      <p className={`text-sm font-bold mt-1 uppercase ${pingResult.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {pingResult.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Round Trip Times history (Last 5 Pings)</p>
                    <div className="flex items-end gap-1.5 h-10 font-mono text-[9px] text-slate-500">
                      {pingResult.history.map((h: number, idx: number) => {
                        const hPercentage = Math.min(100, (h / 60) * 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[8px] text-slate-400">{h}ms</span>
                            <div className="w-full bg-slate-800 rounded-t h-6 overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-t" style={{ height: `${hPercentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3 flex items-center justify-between mt-4">
            <span>PICKO DNS SECURE PROXY v1.2</span>
            <span>EDGE RESOLUTION METRICS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
