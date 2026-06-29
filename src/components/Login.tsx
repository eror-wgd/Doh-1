import React, { useState } from 'react';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../data/translations';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  lang: Language;
}

export default function Login({ onLoginSuccess, lang }: LoginProps) {
  const [email, setEmail] = useState('admin@pickodoh.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection to backend failed. Please verify server is online.');
    } finally {
      setLoading(false);
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 selection:bg-blue-500 selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/20">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isRtl ? 'ورود به پنل PICKO DoH' : 'PICKO DoH Management'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isRtl ? 'کنسول مدیریت دی‌ان‌اس بر بستر HTTPS' : 'Secure DNS over HTTPS controller'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {isRtl ? 'آدرس ایمیل مدیر' : 'Admin Email Address'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pickodoh.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {isRtl ? 'کلمه عبور' : 'Secure Password'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:translate-y-px transition duration-150"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {isRtl ? 'در حال بررسی...' : 'Authenticating...'}
                </span>
              ) : (
                isRtl ? 'ورود به داشبورد' : 'Access Administrator Console'
              )}
            </button>
          </form>

          {/* Credentials helper badge */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
            <span className="text-xs text-slate-400">
              {isRtl ? 'اعتبار پیش‌فرض جهت تست پنل:' : 'Development Credentials:'}
            </span>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs">
              <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-blue-400 rounded-lg font-mono">
                admin@pickodoh.com
              </span>
              <span className="text-slate-500">/</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-blue-400 rounded-lg font-mono">
                admin123
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6 font-mono">
          © 2026 PICKO DoH Network Services. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
