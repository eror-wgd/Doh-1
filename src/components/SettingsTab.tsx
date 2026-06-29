import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, CheckCircle, Info, RefreshCw, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { DoHSettings } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface SettingsTabProps {
  settings: DoHSettings | null;
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function SettingsTab({ settings, t, lang, onRefresh }: SettingsTabProps) {
  const [endpoint, setEndpoint] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [cacheTtl, setCacheTtl] = useState('300');
  const [minTtl, setMinTtl] = useState('60');
  const [dnssec, setDnssec] = useState(true);
  const [edns, setEdns] = useState(true);
  const [rateLimit, setRateLimit] = useState('120');
  const [compression, setCompression] = useState(true);
  const [cors, setCors] = useState(true);
  const [ipv6Enabled, setIpv6Enabled] = useState(true);
  const [userAgent, setUserAgent] = useState('');
  const [timeout, setTimeoutMs] = useState('3000');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setEndpoint(settings.endpoint || '');
      setCustomPath(settings.customPath || '');
      setCacheTtl(String(settings.cacheTtl ?? 300));
      setMinTtl(String(settings.minTtl ?? 60));
      setDnssec(settings.dnssec ?? true);
      setEdns(settings.edns ?? true);
      setRateLimit(String(settings.rateLimit ?? 120));
      setCompression(settings.compression ?? true);
      setCors(settings.cors ?? true);
      setIpv6Enabled(settings.ipv6Enabled ?? true);
      setUserAgent(settings.userAgent || '');
      setTimeoutMs(String(settings.timeout ?? 3000));
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const payload: Partial<DoHSettings> = {
        endpoint,
        customPath,
        cacheTtl: parseInt(cacheTtl),
        minTtl: parseInt(minTtl),
        dnssec,
        edns,
        rateLimit: parseInt(rateLimit),
        compression,
        cors,
        ipv6Enabled,
        userAgent,
        timeout: parseInt(timeout)
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        onRefresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">{isRtl ? 'پیکربندی سرور و پروتکل DoH' : 'DoH Protocol Configuration'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Define core Cloudflare Worker resolution parameters.</p>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl text-sm transition"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t.save}
              </>
            )}
          </button>
        </div>

        {/* Form Grid */}
        <div className="p-6 space-y-6">
          
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2.5"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Configurations saved successfully! Regenerate your Cloudflare Worker payload to apply instantly.</span>
            </motion.div>
          )}

          {/* Group 1: General Paths */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General Routing</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">{t.endpointUrl}</label>
                <input
                  type="text"
                  required
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500 transition"
                />
                <span className="text-[10px] text-slate-400 block mt-1.5">DNS domain where your Cloudflare Worker is active.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">{t.path}</label>
                <input
                  type="text"
                  required
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500 transition"
                />
                <span className="text-[10px] text-slate-400 block mt-1.5">Base pattern prefix to receive standard DoH queries.</span>
              </div>
            </div>
          </div>

          {/* Group 2: Cache & Performance */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cache TTL & Performance Indices</h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">{t.cacheTtl}</label>
                <input
                  type="number"
                  value={cacheTtl}
                  onChange={(e) => setCacheTtl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">{t.minTtl}</label>
                <input
                  type="number"
                  value={minTtl}
                  onChange={(e) => setMinTtl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">{t.rateLimit}</label>
                <input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group 3: HTTP Protocol Details */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">DNS Client Metadata</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">User-Agent Proxy Header</label>
                <input
                  type="text"
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Connection Timeout (ms)</label>
                <input
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeoutMs(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group 4: Toggle Toggles */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocol Flags & Privacy</h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* DNSSEC */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={dnssec}
                  onChange={(e) => setDnssec(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">{t.dnssec}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Enforce cryptographic verification checks.</span>
                </div>
              </label>

              {/* EDNS */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={edns}
                  onChange={(e) => setEdns(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">{isRtl ? 'فعال‌سازی ساب‌نت کلاینت (ECS)' : 'EDNS Client Subnet'}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pass partial client IP to upstream DNS for better CDN routing.</span>
                </div>
              </label>

              {/* CORS */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={cors}
                  onChange={(e) => setCors(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">CORS Support</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Enable Access-Control headers for browser script fetch.</span>
                </div>
              </label>

              {/* Compression */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={compression}
                  onChange={(e) => setCompression(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Compression Optimization</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Compress payloads to lower bandwidth utilization.</span>
                </div>
              </label>

              {/* IPv6 */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={ipv6Enabled}
                  onChange={(e) => setIpv6Enabled(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">IPv6 DNS Engine</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Process and answer client queries over AAAA networks.</span>
                </div>
              </label>

            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
