import React, { useState } from 'react';
import { 
  Globe, Plus, Trash2, Edit2, Check, X, Shield, Activity, HelpCircle, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Upstream } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface UpstreamsTabProps {
  upstreams: Upstream[];
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function UpstreamsTab({ upstreams, t, lang, onRefresh }: UpstreamsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Failover strategy in panel
  const [strategy, setStrategy] = useState<'failover' | 'roundrobin' | 'loadbalance'>('failover');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/upstreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, priority: parseInt(priority), enabled: true })
      });

      if (res.ok) {
        setName('');
        setAddress('');
        setPriority('1');
        setShowAddForm(false);
        onRefresh();
      } else {
        setError('Failed to insert upstream server.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (upstream: Upstream) => {
    try {
      await fetch(`/api/upstreams/${upstream.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !upstream.enabled })
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this upstream DNS provider?')) return;
    try {
      await fetch(`/api/upstreams/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top balance/strategy cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Strategy 1: Active-Passive Auto Failover */}
        <div 
          onClick={() => setStrategy('failover')}
          className={`cursor-pointer p-5 border rounded-2xl transition flex flex-col justify-between h-36 ${
            strategy === 'failover' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Auto-Failover</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${strategy === 'failover' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>Active</span>
          </div>
          <div>
            <h5 className="font-bold text-sm">Primary + Backup Failover</h5>
            <p className={`text-[11px] mt-1 ${strategy === 'failover' ? 'text-blue-100' : 'text-slate-400'}`}>
              Resolves query on primary node (Priority 1). Instantly falls back to backup if latency spikes or timeouts occur.
            </p>
          </div>
        </div>

        {/* Strategy 2: Round Robin */}
        <div 
          onClick={() => setStrategy('roundrobin')}
          className={`cursor-pointer p-5 border rounded-2xl transition flex flex-col justify-between h-36 ${
            strategy === 'roundrobin' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Round Robin</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${strategy === 'roundrobin' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>Active</span>
          </div>
          <div>
            <h5 className="font-bold text-sm">Balanced Round-Robin</h5>
            <p className={`text-[11px] mt-1 ${strategy === 'roundrobin' ? 'text-blue-100' : 'text-slate-400'}`}>
              Rotates queries sequentially across all enabled upstreams. Maximizes bandwidth efficiency across workers.
            </p>
          </div>
        </div>

        {/* Strategy 3: Load Balance */}
        <div 
          onClick={() => setStrategy('loadbalance')}
          className={`cursor-pointer p-5 border rounded-2xl transition flex flex-col justify-between h-36 ${
            strategy === 'loadbalance' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Load Balance</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${strategy === 'loadbalance' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>Active</span>
          </div>
          <div>
            <h5 className="font-bold text-sm">Latency-Based Routing</h5>
            <p className={`text-[11px] mt-1 ${strategy === 'loadbalance' ? 'text-blue-100' : 'text-slate-400'}`}>
              Measures and forwards queries dynamically to the lowest-latency DNS server. Minimizes TTFB values.
            </p>
          </div>
        </div>

      </div>

      {/* Main upstreams controller */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900">{isRtl ? 'سرورهای دی‌ان‌اس بالادستی فعال' : 'Recursive Upstream DNS Providers'}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Configure priority, active servers, and dynamic bypass resolvers.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t.addUpstream}
          </button>
        </div>

        {/* Inline Add Upstream Form */}
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-50 border-b border-slate-100"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Upstream Provider Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quad9 Malware Shield"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">{t.address}</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 9.9.9.9"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">{t.priority}</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="1-10"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition"
                >
                  {loading ? 'Adding...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
            {error && <p className="text-xs text-rose-600 mt-2 font-semibold">{error}</p>}
          </motion.div>
        )}

        {/* Upstreams Listing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">{t.address}</th>
                <th className="px-6 py-4 text-center">{t.priority}</th>
                <th className="px-6 py-4 text-center">{t.latency}</th>
                <th className="px-6 py-4 text-center">{t.health}</th>
                <th className="px-6 py-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {upstreams.map((up) => {
                const isHealthy = up.health === 'healthy';
                return (
                  <tr key={up.id} className={`hover:bg-slate-50/40 transition ${!up.enabled ? 'opacity-60 bg-slate-50/20' : ''}`}>
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${up.enabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{up.name}</p>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Recursive Resolver</span>
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 font-mono font-semibold text-xs text-slate-800">
                      {up.address}
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4 text-center font-bold text-slate-800">
                      {up.priority}
                    </td>

                    {/* Latency */}
                    <td className="px-6 py-4 text-center font-mono font-bold">
                      <span className={`px-2 py-1 rounded text-xs ${
                        up.latency < 15 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : up.latency < 30 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'bg-amber-50 text-amber-600'
                      }`}>
                        {up.latency} ms
                      </span>
                    </td>

                    {/* Health */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-md ${
                        isHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {isHealthy ? 'Healthy' : 'Unreachable'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleToggleEnabled(up)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                            up.enabled
                              ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {up.enabled ? 'Disable' : 'Enable'}
                        </button>

                        <button
                          onClick={() => handleDelete(up.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
