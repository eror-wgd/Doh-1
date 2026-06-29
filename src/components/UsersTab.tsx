import React, { useState } from 'react';
import { 
  Users, UserPlus, Trash2, Edit2, ShieldAlert, CheckCircle, RefreshCw, Calendar, Database, Search, ChevronRight, X, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, Subscription } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface UsersTabProps {
  users: User[];
  subscriptions: Subscription[];
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function UsersTab({ users, subscriptions, t, lang, onRefresh }: UsersTabProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trafficLimit, setTrafficLimit] = useState('100');
  const [dailyUsageLimit, setDailyUsageLimit] = useState('-1');
  const [concurrentIpLimit, setConcurrentIpLimit] = useState('2');
  const [concurrentDeviceLimit, setConcurrentDeviceLimit] = useState('3');
  const [maxConnectedUsers, setMaxConnectedUsers] = useState('2');
  const [unlimitedTraffic, setUnlimitedTraffic] = useState(false);
  const [unlimitedTime, setUnlimitedTime] = useState(false);
  const [notes, setNotes] = useState('');

  // Editing state
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const getSub = (userId: string): Subscription | undefined => {
    return subscriptions.find(s => s.userId === userId);
  };

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.notes.toLowerCase().includes(q);
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        email,
        trafficLimit: unlimitedTraffic ? -1 : parseFloat(trafficLimit),
        unlimitedTraffic,
        unlimitedTime,
        dailyUsageLimit: parseFloat(dailyUsageLimit),
        concurrentIpLimit: parseInt(concurrentIpLimit),
        concurrentDeviceLimit: parseInt(concurrentDeviceLimit),
        maxConnectedUsers: parseInt(maxConnectedUsers),
        notes,
        status: 'active',
        expirationDate: unlimitedTime ? 'unlimited' : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        // Clear fields
        setName('');
        setEmail('');
        setTrafficLimit('100');
        setUnlimitedTraffic(false);
        setUnlimitedTime(false);
        setNotes('');
        onRefresh();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenew = async (subId: string) => {
    try {
      await fetch(`/api/subscriptions/${subId}/renew`, { method: 'POST' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetTraffic = async (subId: string) => {
    try {
      await fetch(`/api/subscriptions/${subId}/reset-traffic`, { method: 'POST' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this subscriber? This is irreversible.')) return;
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatGb = (bytes: number) => {
    if (bytes < 0) return 'Unlimited';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Search and action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={t.searchUser}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-500/10 active:translate-y-px transition"
        >
          <UserPlus className="w-4 h-4" />
          {t.addUser}
        </button>
      </div>

      {/* Users grid list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
                <th className="px-6 py-4">{t.name}</th>
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4">{t.expiration}</th>
                <th className="px-6 py-4">{t.trafficUsed}</th>
                <th className="px-6 py-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No active subscribers found matching filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const sub = getSub(user.id);
                  const isSuspended = user.status === 'suspended';
                  const isExpired = user.status === 'expired';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      {/* Name / Info */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="px-1.5 py-0.5 bg-slate-900 text-white font-mono text-[9px] rounded font-bold uppercase">Admin</span>
                            )}
                            {user.isOnline && (
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Resolving DOH requests currently"></span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono block mt-0.5">{user.email}</span>
                          {user.notes && (
                            <span className="text-[11px] text-amber-600 block mt-1 italic">
                              * {user.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isSuspended 
                            ? 'bg-rose-50 text-rose-600' 
                            : isExpired 
                              ? 'bg-amber-50 text-amber-600' 
                              : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isSuspended ? (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              {isRtl ? 'تعلیق شده' : 'Suspended'}
                            </>
                          ) : isExpired ? (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              {isRtl ? 'منقضی شده' : 'Expired'}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              {isRtl ? 'فعال' : 'Active'}
                            </>
                          )}
                        </span>
                      </td>

                      {/* Expiration */}
                      <td className="px-6 py-4">
                        {sub ? (
                          <div className="space-y-0.5 text-xs">
                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {sub.unlimitedTime ? t.unlimited : new Date(sub.expirationDate).toLocaleDateString()}
                            </p>
                            {!sub.unlimitedTime && (
                              <p className="text-slate-400 block font-mono">
                                {Math.max(0, Math.ceil((new Date(sub.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} {isRtl ? 'روز باقی مانده' : 'days left'}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Traffic limit */}
                      <td className="px-6 py-4">
                        {sub ? (
                          <div className="space-y-1.5 max-w-[160px]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800 font-mono">{formatGb(sub.bandwidthUsed)}</span>
                              <span className="text-slate-400 font-mono">/ {sub.unlimitedTraffic ? t.unlimited : `${sub.trafficLimit} GB`}</span>
                            </div>
                            {!sub.unlimitedTraffic && (
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    (sub.bandwidthUsed / (sub.trafficLimit * 1024 * 1024 * 1024)) > 0.9 
                                      ? 'bg-rose-500' 
                                      : 'bg-blue-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, (sub.bandwidthUsed / (sub.trafficLimit * 1024 * 1024 * 1024)) * 100)}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* Suspend/Activate toggle */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                              isSuspended
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                            }`}
                            title={isSuspended ? 'Activate profile' : 'Suspend profile'}
                          >
                            {isSuspended ? t.activate : t.suspend}
                          </button>

                          {/* Reset bandwidth & renew subscription limits */}
                          {sub && (
                            <>
                              <button
                                onClick={() => handleResetTraffic(sub.id)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
                                title={t.resetTraffic}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleRenew(sub.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition"
                                title="Add 30 Days expiration and reset traffic limit"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                {isRtl ? 'تمدید' : 'Renew'}
                              </button>
                            </>
                          )}

                          {/* Delete */}
                          {user.id !== 'admin' && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                              title="Delete subscriber permanently"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Creation Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                {t.addUser}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form scroll container */}
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.name}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ali Soltani"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.email}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ali@domain.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Traffic Limit Options */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Traffic Allocation & Expiration</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={unlimitedTraffic}
                        onChange={(e) => setUnlimitedTraffic(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Unlimited Traffic
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={unlimitedTime}
                        onChange={(e) => setUnlimitedTime(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Unlimited Expiration
                    </label>
                  </div>
                </div>

                {!unlimitedTraffic && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Monthly Traffic Allowance (GB)</label>
                    <input
                      type="number"
                      value={trafficLimit}
                      onChange={(e) => setTrafficLimit(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                )}
              </div>

              {/* Hardware Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Max IPs</label>
                  <input
                    type="number"
                    value={concurrentIpLimit}
                    onChange={(e) => setConcurrentIpLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Max Devices</label>
                  <input
                    type="number"
                    value={concurrentDeviceLimit}
                    onChange={(e) => setConcurrentDeviceLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Max Active Connections</label>
                  <input
                    type="number"
                    value={maxConnectedUsers}
                    onChange={(e) => setMaxConnectedUsers(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional customer details, customized pricing info, etc."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition"
                ></textarea>
              </div>

              {/* Modal footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  Create Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
