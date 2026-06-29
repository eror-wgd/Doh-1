import React, { useState, useEffect } from 'react';
import { 
  Search, RefreshCw, Download, Terminal, Circle, Play, Pause, ChevronLeft, ChevronRight, SlidersHorizontal 
} from 'lucide-react';
import { QueryLog } from '../types';
import { Language, TranslationKeys } from '../data/translations';

interface LogsTabProps {
  logs: QueryLog[];
  t: TranslationKeys;
  lang: Language;
  onRefresh: () => void;
}

export default function LogsTab({ logs, t, lang, onRefresh }: LogsTabProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCode, setFilterCode] = useState('ALL');
  const [liveStream, setLiveStream] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Simulate streaming log updates
  useEffect(() => {
    if (!liveStream) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 4000); // Poll fresh logs from Express state every 4s
    return () => clearInterval(interval);
  }, [liveStream]);

  const filteredLogs = logs.filter(log => {
    const q = search.toLowerCase();
    const matchSearch = log.query.toLowerCase().includes(q) || log.clientIp.includes(q) || log.user.toLowerCase().includes(q);
    const matchType = filterType === 'ALL' || log.type === filterType;
    const matchCode = filterCode === 'ALL' || log.responseCode === filterCode;
    return matchSearch && matchType && matchCode;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Query Domain', 'Type', 'Response Code', 'Latency(ms)', 'Client IP', 'User', 'Country', 'ASN', 'Protocol'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.query,
      l.type,
      l.responseCode,
      l.latency,
      l.clientIp,
      l.user,
      l.country,
      l.asn,
      l.protocol
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pickodoh-dns-logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "pickodoh-dns-logs.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Logs Controls Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl font-mono">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{isRtl ? 'گزارش‌های زنده درخواست‌های دی‌ان‌اس' : 'Live DNS Query Analyzer'}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Stream and inspect DNS resolution patterns in real-time.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live streaming status toggle */}
            <button
              onClick={() => setLiveStream(!liveStream)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                liveStream 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200'
              }`}
            >
              <Circle className={`w-2.5 h-2.5 fill-current ${liveStream ? 'animate-pulse text-emerald-500' : 'text-slate-400'}`} />
              {liveStream ? (isRtl ? 'پخش زنده فعال' : 'Streaming Active') : (isRtl ? 'توقف پخش زنده' : 'Streaming Paused')}
            </button>

            <button
              onClick={onRefresh}
              className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition"
              title="Manual Reload"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Export buttons */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              title="Export filtered to CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              title="Export filtered to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          
          {/* Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search domains, IP, subscriber email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Record Type filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Type:</span>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Records</option>
              <option value="A">A (IPv4)</option>
              <option value="AAAA">AAAA (IPv6)</option>
              <option value="CNAME">CNAME</option>
              <option value="MX">MX</option>
              <option value="TXT">TXT</option>
              <option value="NS">NS</option>
            </select>
          </div>

          {/* Code filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Response:</span>
            <select
              value={filterCode}
              onChange={(e) => { setFilterCode(e.target.value); setCurrentPage(1); }}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Codes</option>
              <option value="NOERROR">NOERROR (Resolved)</option>
              <option value="NXDOMAIN">NXDOMAIN (Blocked/Ad)</option>
              <option value="SERVFAIL">SERVFAIL (Error)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir="ltr">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">Subscriber</th>
                <th className="px-5 py-4">Query</th>
                <th className="px-5 py-4 text-center">Type</th>
                <th className="px-5 py-4 text-center">Response</th>
                <th className="px-5 py-4 text-center">Latency</th>
                <th className="px-5 py-4">Client IP</th>
                <th className="px-5 py-4">Country / ASN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-mono">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 font-sans">
                    No active DNS traffic logged under these criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const isBlocked = log.responseCode === 'NXDOMAIN';
                  return (
                    <tr key={log.id} className={`hover:bg-slate-50/50 transition ${isBlocked ? 'bg-rose-50/10' : ''}`}>
                      {/* Timestamp */}
                      <td className="px-5 py-3.5 text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>

                      {/* User */}
                      <td className="px-5 py-3.5 font-sans">
                        <span className="font-semibold text-slate-800">{log.user.split('@')[0]}</span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{log.user}</span>
                      </td>

                      {/* Query */}
                      <td className="px-5 py-3.5 text-slate-900 font-semibold truncate max-w-[180px]" title={log.query}>
                        {log.query}
                        {isBlocked && (
                          <span className="ml-1.5 px-1.5 py-0.2 bg-rose-50 text-rose-500 font-sans font-bold text-[8px] rounded uppercase">Blocked</span>
                        )}
                      </td>

                      {/* Record Type */}
                      <td className="px-5 py-3.5 text-center font-bold">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {log.type}
                        </span>
                      </td>

                      {/* Response code */}
                      <td className="px-5 py-3.5 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          isBlocked 
                            ? 'bg-rose-100 text-rose-700' 
                            : log.responseCode === 'SERVFAIL' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {log.responseCode}
                        </span>
                      </td>

                      {/* Latency */}
                      <td className="px-5 py-3.5 text-center font-bold text-slate-900">
                        {log.latency} ms
                      </td>

                      {/* Client IP */}
                      <td className="px-5 py-3.5 text-slate-500">
                        {log.clientIp}
                      </td>

                      {/* Geo info */}
                      <td className="px-5 py-3.5 font-sans">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-[9px] font-bold mr-1.5">{log.country}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.asn}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between" dir={isRtl ? 'rtl' : 'ltr'}>
            <span className="text-xs text-slate-500">
              {isRtl 
                ? `نمایش صفحه ${currentPage} از ${totalPages}`
                : `Showing page ${currentPage} of ${totalPages}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
