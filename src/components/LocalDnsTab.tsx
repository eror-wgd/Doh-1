import React, { useState } from 'react';
import { 
  Server, Plus, Trash2, Shield, HelpCircle, Check, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { LocalDNS } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface LocalDnsTabProps {
  localDns: LocalDNS[];
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function LocalDnsTab({ localDns, t, lang, onRefresh }: LocalDnsTabProps) {
  const [hostname, setHostname] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [priority, setPriority] = useState('1');
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/local-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname, ipAddress, priority: parseInt(priority), enabled: true })
      });

      if (res.ok) {
        setHostname('');
        setIpAddress('');
        setPriority('1');
        setShowAdd(false);
        onRefresh();
      } else {
        setError('Failed to insert local DNS rule.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (rule: LocalDNS) => {
    try {
      await fetch(`/api/local-dns/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !rule.enabled })
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/local-dns/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Informative card about DOH synthesis */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
          <Server className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight">{isRtl ? 'بای‌پَس آدرس‌های محلی و خصوصی' : 'Zero-Latency Local DNS Bypass'}</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            By mapping private server hostnames here, the PICKO Worker synthesizes immediate DNS responses. Queries are handled directly in memory within Cloudflare Workers edge, guaranteeing instantaneous response times of &lt; 1ms without calling upstream authoritative servers.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900">{isRtl ? 'لیست مسیرهای میانبر محلی' : 'Local Hostname Bindings'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Manage virtual A-record responses mapped directly on Edge.</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            {t.addRule}
          </button>
        </div>

        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-50 border-b border-slate-100"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">{t.hostname}</label>
                <input
                  type="text"
                  required
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="e.g. printer.office"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">{t.ipAddress}</label>
                <input
                  type="text"
                  required
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="e.g. 192.168.1.50"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">{t.priority}</label>
                <input
                  type="number"
                  required
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
            {error && <p className="text-xs text-rose-600 mt-2 font-semibold">{error}</p>}
          </motion.div>
        )}

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
                <th className="px-6 py-4">{t.hostname}</th>
                <th className="px-6 py-4">{t.ipAddress}</th>
                <th className="px-6 py-4 text-center">{t.priority}</th>
                <th className="px-6 py-4 text-center">{t.status}</th>
                <th className="px-6 py-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {localDns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No custom local bypass rules configured yet.
                  </td>
                </tr>
              ) : (
                localDns.map((rule) => (
                  <tr key={rule.id} className={`hover:bg-slate-50/40 transition ${!rule.enabled ? 'opacity-60 bg-slate-50/20' : ''}`}>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {rule.hostname}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 text-xs font-semibold">
                      {rule.ipAddress}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {rule.priority}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        rule.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleToggle(rule)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                            rule.enabled
                              ? 'bg-amber-50 border-amber-200 text-amber-600'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          }`}
                        >
                          {rule.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 hover:border-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
