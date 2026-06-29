import React, { useState, useEffect } from 'react';
import { 
  Terminal, Copy, Check, Download, AlertCircle, RefreshCw, Server, HelpCircle, BookOpen 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, TranslationKeys } from '../data/translations';

interface WorkerGeneratorTabProps {
  t: TranslationKeys;
  lang: Language;
}

export default function WorkerGeneratorTab({ t, lang }: WorkerGeneratorTabProps) {
  const [scriptCode, setScriptCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchWorkerCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/worker-generate');
      const data = await res.json();
      setScriptCode(data.script || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerCode();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step-by-step Installation Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-900">{isRtl ? 'راهنمای نصب و راه‌اندازی ورکر' : 'Cloudflare Worker Deploy Guide'}</h4>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div>
              <span className="font-bold text-slate-800 block">Step 1: Create Cloudflare Worker</span>
              <p className="mt-1">Login to your Cloudflare Dashboard, navigate to <strong>Workers & Pages</strong>, and click <strong>Create Application</strong> &rarr; <strong>Create Worker</strong>.</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block">Step 2: Copy Deployable Code</span>
              <p className="mt-1">Copy the compiled production code shown in the terminal panel on the right. This script contains your active subscriber keys, bypass, and upstream routes pre-configured.</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block">Step 3: Paste and Save</span>
              <p className="mt-1">Inside Cloudflare’s online editor, delete any default code, paste your custom payload, and click <strong>Save and Deploy</strong>.</p>
            </div>

            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <span className="font-bold block">Dynamic API Synchronization</span>
                <p className="mt-0.5 text-[11px] text-blue-700">This code contains a self-contained in-memory lookup. When you add/remove users or alter paths, click <strong>Recompile Code</strong> and re-deploy your worker to instantly sync database changes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                worker.js (Production Code)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchWorkerCode}
                  disabled={loading}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                  title="Re-compile with latest database changes"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-auto max-h-[350px] font-mono text-xs text-emerald-400 bg-slate-950 p-4 border border-slate-800 rounded-xl leading-relaxed whitespace-pre select-all">
              {loading ? 'Compiling secure worker deployment script...' : scriptCode}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3 flex items-center justify-between mt-4">
            <span>READY FOR ZERO-LATENCY DIRECT DEPLOYMENT</span>
            <span>COMPATIBLE WITH CLOUDFLARE D1 & KV RESOLUTION</span>
          </div>
        </div>

      </div>
    </div>
  );
}
