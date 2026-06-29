import React, { useState } from 'react';
import { 
  Database, Upload, Download, FileText, CheckCircle2, ShieldAlert, AlertCircle, Info 
} from 'lucide-react';
import { motion } from 'motion/react';
import { AuditLog, Notification } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface SystemUtilityTabProps {
  auditLogs: AuditLog[];
  notifications: Notification[];
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function SystemUtilityTab({ auditLogs, notifications, t, lang, onRefresh }: SystemUtilityTabProps) {
  const [restoreJson, setRestoreJson] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const parsed = JSON.parse(restoreJson);
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (res.ok) {
        setSuccess('Database backup file successfully restored!');
        setRestoreJson('');
        onRefresh();
      } else {
        setError('Invalid database structure inside backup file.');
      }
    } catch (err) {
      setError('Invalid JSON syntax inside backup content.');
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Backup and Restore Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Export */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-950">Database Backup Exporter</h5>
              <p className="text-xs text-slate-400">Download current subscribers, upstreams, and settings.</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Backup exports your entire PICKO DOH system database as a single structured JSON file. It is recommended to perform backups weekly to safeguard subscription allocations.
          </p>

          <a
            href="/api/backup/export"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Export System Database (JSON)
          </a>
        </div>

        {/* Box 2: Import */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-950">Restore Database Importer</h5>
              <p className="text-xs text-slate-400">Load a previously exported PICKO backup file.</p>
            </div>
          </div>

          <form onSubmit={handleRestore} className="space-y-3">
            <textarea
              required
              rows={3}
              value={restoreJson}
              onChange={(e) => setRestoreJson(e.target.value)}
              placeholder="Paste backup JSON file content here..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-500 transition"
            ></textarea>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Restore Database Configuration
            </button>
          </form>

          {error && <p className="text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
          {success && <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{success}</p>}
        </div>

      </div>

      {/* Audit Logs list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">{t.auditLog}</h4>
            <p className="text-xs text-slate-400">Security event streams and management operations logs.</p>
          </div>
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="divide-y divide-slate-100 font-mono text-[11px] text-slate-600">
          {auditLogs.map((log) => {
            const isWarn = log.status === 'warning';
            const isErr = log.status === 'failure';
            return (
              <div key={log.id} className="px-6 py-3.5 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition">
                <div className="flex items-start sm:items-center gap-2 truncate">
                  <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                    isErr 
                      ? 'bg-rose-100 text-rose-700' 
                      : isWarn 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-blue-50 text-blue-600'
                  }`}>
                    {log.status}
                  </span>
                  <span className="font-semibold text-slate-800 truncate">{log.event}</span>
                </div>
                <div className="flex items-center gap-3 font-sans text-slate-400">
                  <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{log.ip}</span>
                  <span className="font-mono text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
